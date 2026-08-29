import { put, list, get } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { isDbOn, isMysql, run, sql } from "./db";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const CMS_PATH = "cms-state.json";
const TEKLIF_PATH = "teklif-state.json";

/**
 * YEREL GELISTIRME DEPOSU
 *
 * Blob anahtari yokken (yerelde `npm run dev`) okuma/yazma sessizce hicbir sey
 * yapmiyordu: panelde "kaydedildi" yaziyor, sayfa yenilenince degisiklik yok
 * oluyordu. Bu yuzden panelin dogru calisip calismadigi yerelde HIC test
 * edilemiyordu.
 *
 * Artik anahtar yoksa ve uretimde degilsek veri proje kokundeki
 * `.cms-local.json` dosyasina yaziliyor. Uretimde bu yol hic calismaz
 * (sunucusuz dosya sistemi kalici degildir); orada yalnizca Blob veya
 * Postgres kullanilir.
 */
const YEREL_MOD = !BLOB_TOKEN && process.env.NODE_ENV !== "production";

function yerelDosya(pathname: string): string {
  return path.join(process.cwd(), `.cms-local-${pathname}`);
}

function yerelOku(pathname: string): string | null {
  try {
    const p = yerelDosya(pathname);
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  } catch {
    return null;
  }
}

function yerelYaz(pathname: string, value: string): void {
  try {
    fs.writeFileSync(yerelDosya(pathname), value, "utf8");
  } catch {
    /* yerel yazma basarisizsa gelistirme akisi engellenmemeli */
  }
}

async function readBlob(pathname: string): Promise<string | null> {
  if (YEREL_MOD) return yerelOku(pathname);
  if (!BLOB_TOKEN) return null;
  try {
    const res = await list({ prefix: pathname, token: BLOB_TOKEN });
    const found = res.blobs.find((b) => b.pathname === pathname);
    if (!found) return null;
    const g = await get(found.url, { access: "private", token: BLOB_TOKEN, useCache: false });
    if (!g || g.statusCode !== 200) return null;
    return await new Response(g.stream).text();
  } catch {
    return null;
  }
}

async function writeBlob(pathname: string, value: string): Promise<void> {
  if (YEREL_MOD) return yerelYaz(pathname, value);
  if (!BLOB_TOKEN) return;
  await put(pathname, value, { access: "private", token: BLOB_TOKEN, allowOverwrite: true });
}

function parseState<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ---------------- CMS state ----------------
export async function readCmsState(): Promise<unknown | null> {
  return parseState<unknown>(await readBlob(CMS_PATH));
}

export async function writeCmsState(state: unknown): Promise<void> {
  await writeBlob(CMS_PATH, JSON.stringify(state));
}

// ---------------- Teklif (quote) requests ----------------
export type TeklifKayit = {
  ref: string;
  raporNo: string;
  firma: string;
  ad: string;
  tel: string;
  eposta: string;
  bolge: string;
  ekipmanlar: string[];
  tarih: string;
  durum: string;
  gecerli: string;
  ek: string;
};

/**
 * TEKLIF KAYITLARI — veritabani varsa oraya, yoksa Blob'a.
 *
 * ⚠️ Hostinger'a tasinirken bu sart oldu: orada Vercel Blob yok. Eski hali
 * yalnizca Blob'a yaziyordu ve anahtar tanimli degilse `writeBlob` SESSIZCE
 * hicbir sey yapmiyordu — yani Hostinger'da her teklif talebi e-posta ile
 * gelir ama panelde hic gorunmezdi (kayit "basarili" sayildigi icin uyari
 * da cikmazdi).
 *
 * Tablo `cms.ts`'in semasindan bagimsiz olarak burada olusturuluyor; teklif
 * akisi CMS'ten bagimsiz calisabilmeli.
 */
let _teklifSema: Promise<void> | null = null;

function teklifSemaHazir(): Promise<void> {
  if (_teklifSema) return _teklifSema;
  _teklifSema = (async () => {
    const s = sql();
    if (isMysql()) {
      await run(s`CREATE TABLE IF NOT EXISTS teklifler (ref VARCHAR(64) PRIMARY KEY, rapor_no VARCHAR(64), firma TEXT, ad TEXT, tel TEXT, eposta TEXT, bolge TEXT, ekipmanlar JSON, tarih VARCHAR(40), durum VARCHAR(32), gecerli TEXT, ek TEXT)`);
      await run(s`CREATE INDEX idx_teklif_rapor ON teklifler (rapor_no)`).catch(() => {
        // MySQL'de "CREATE INDEX IF NOT EXISTS" yok; ikinci calismada
        // "Duplicate key name" hatasi normaldir, yutuluyor.
      });
    } else {
      await run(s`CREATE TABLE IF NOT EXISTS teklifler (ref text PRIMARY KEY, rapor_no text, firma text, ad text, tel text, eposta text, bolge text, ekipmanlar jsonb, tarih text, durum text, gecerli text, ek text)`);
      await run(s`CREATE INDEX IF NOT EXISTS idx_teklif_rapor ON teklifler (rapor_no)`);
    }
  })().catch((e) => {
    _teklifSema = null;
    throw e;
  });
  return _teklifSema;
}

function satirToTeklif(r: Record<string, unknown>): TeklifKayit {
  const ek = r.ekipmanlar;
  let ekipmanlar: string[] = [];
  if (Array.isArray(ek)) ekipmanlar = ek as string[];
  else if (typeof ek === "string" && ek.trim()) {
    // mysql2 JSON sutununu bazen dize olarak doner (bkz. cms.ts jsonDizi notu).
    try {
      const c = JSON.parse(ek);
      if (Array.isArray(c)) ekipmanlar = c as string[];
    } catch {
      /* bozuk JSON kaydin tamamini kaybettirmesin */
    }
  }
  return {
    ref: String(r.ref),
    raporNo: String(r.rapor_no ?? ""),
    firma: String(r.firma ?? ""),
    ad: String(r.ad ?? ""),
    tel: String(r.tel ?? ""),
    eposta: String(r.eposta ?? ""),
    bolge: String(r.bolge ?? ""),
    ekipmanlar,
    tarih: String(r.tarih ?? ""),
    durum: String(r.durum ?? "yeni"),
    gecerli: String(r.gecerli ?? ""),
    ek: String(r.ek ?? ""),
  };
}

export async function saveTeklif(kayit: TeklifKayit): Promise<void> {
  if (isDbOn()) {
    await teklifSemaHazir();
    const s = sql();
    await run(
      s`INSERT INTO teklifler (ref, rapor_no, firma, ad, tel, eposta, bolge, ekipmanlar, tarih, durum, gecerli, ek) VALUES (${kayit.ref}, ${kayit.raporNo}, ${kayit.firma}, ${kayit.ad}, ${kayit.tel}, ${kayit.eposta}, ${kayit.bolge}, ${JSON.stringify(kayit.ekipmanlar)}, ${kayit.tarih}, ${kayit.durum}, ${kayit.gecerli}, ${kayit.ek})`
    );
    return;
  }
  const arr = (parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || []) as TeklifKayit[];
  arr.push(kayit);
  await writeBlob(TEKLIF_PATH, JSON.stringify(arr));
}

/**
 * Tek bir teklif kaydini siler.
 *
 * ⚠️ Panelde silme HIC YOKTU: talepler listeleniyor ama kaldirilamiyordu.
 * Test kayitlarini temizlemek icin phpMyAdmin'e girmek gerekiyordu — yani
 * veritabaninda elle SQL calistirmak. Musteri verisi iceren bir tabloda bu
 * gereksiz bir risk.
 */
export async function deleteTeklif(ref: string): Promise<void> {
  if (isDbOn()) {
    await teklifSemaHazir();
    await run(sql()`DELETE FROM teklifler WHERE ref = ${ref}`);
    return;
  }
  const arr = (parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || []) as TeklifKayit[];
  await writeBlob(TEKLIF_PATH, JSON.stringify(arr.filter((t) => t.ref !== ref)));
}

export async function findTeklif(no: string): Promise<TeklifKayit | null> {
  if (isDbOn()) {
    await teklifSemaHazir();
    const s = sql();
    const r = await run(s`SELECT * FROM teklifler WHERE rapor_no = ${no} LIMIT 1`);
    return r.length ? satirToTeklif(r[0]) : null;
  }
  const arr = parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || [];
  return arr.find((t) => t.raporNo === no) || null;
}

/** Tum teklif taleplerini doner (en yeni once). Panel ekrani icin. */
export async function tumTeklifler(): Promise<TeklifKayit[]> {
  if (isDbOn()) {
    await teklifSemaHazir();
    const s = sql();
    const r = await run(s`SELECT * FROM teklifler ORDER BY tarih DESC`);
    return r.map(satirToTeklif);
  }
  const arr = parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || [];
  return [...arr].reverse();
}

/**
 * Deponun yazilabilir olup olmadigini kontrol eder.
 *
 * 2026-08-28'de uretimde Vercel Blob deposu ASKIYA ALINMISTI ve bu hicbir
 * yerde gorunmuyordu: okuma hatalari try/catch icinde yutuluyor, site kod
 * icindeki varsayilanlarla calismaya devam ediyordu. Yani panelden yapilan
 * her degisiklik kayboluyor ama kullanici bunu anlamiyordu.
 *
 * Panel bu kontrolu yapip durumu ekranin tepesinde gosteriyor.
 */
export async function depoDurumu(): Promise<{ calisiyor: boolean; mesaj: string }> {
  // Veritabani varsa (Hostinger MySQL / Neon) asil depo odur; Blob hic
  // kullanilmaz, dolayisiyla token'in yoklugu bir hata degildir.
  if (isDbOn()) {
    try {
      await run(sql()`SELECT 1 AS x`);
      return { calisiyor: true, mesaj: "" };
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      return { calisiyor: false, mesaj: `Veritabanına bağlanılamadı: ${m}` };
    }
  }
  if (YEREL_MOD) return { calisiyor: true, mesaj: "" }; // yerel dosya deposu
  if (!BLOB_TOKEN) {
    return { calisiyor: false, mesaj: "BLOB_READ_WRITE_TOKEN tanımlı değil." };
  }
  try {
    await list({ prefix: CMS_PATH, token: BLOB_TOKEN, limit: 1 });
    return { calisiyor: true, mesaj: "" };
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    return { calisiyor: false, mesaj: m };
  }
}
