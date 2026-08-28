import { put, list, get } from "@vercel/blob";
import fs from "fs";
import path from "path";

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

export async function saveTeklif(kayit: TeklifKayit): Promise<void> {
  const arr = (parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || []) as TeklifKayit[];
  arr.push(kayit);
  await writeBlob(TEKLIF_PATH, JSON.stringify(arr));
}

export async function findTeklif(no: string): Promise<TeklifKayit | null> {
  const arr = parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || [];
  return arr.find((t) => t.raporNo === no) || null;
}

/** Tum teklif taleplerini doner (en yeni once). Panel ekrani icin. */
export async function tumTeklifler(): Promise<TeklifKayit[]> {
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
