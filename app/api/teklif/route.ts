import { NextResponse } from "next/server";
import { saveTeklif } from "@/lib/store";
import { epostaGonder, teklifEpostaHtml, teklifEpostaMetin, type EpostaEki } from "@/lib/eposta";
import { hataMetni } from "@/lib/hata";

/**
 * MUSTERININ EKLEDIGI FOTOGRAFLAR
 *
 * ⚠️ Fotograflar VERITABANINA YAZILMIYOR; yalnizca bildirim e-postasinin ekine
 * konuyor. Gerekcesi: `teklifler` tablosunda ek icin sutun yok ve MySQL'de
 * sutun eklemek ozel gecis kodu istiyor; ustelik musteri fotograflarini base64
 * olarak satirlara gomek tabloyu hizla sisirir ve KVKK acisindan gereksiz bir
 * saklama olur. E-posta kutusu bu is icin dogru yer — talep zaten oradan
 * takip ediliyor. Panelde kayda "N fotograf eklendi" notu dusuluyor.
 *
 * Tarayici tarafi fotograflari 1600 px / JPEG'e kucultuyor (lib/gorsel-kucult);
 * asagidaki sinirlar, kucultmenin calismadigi durumlar icin guvenlik agi.
 */
const EN_FAZLA_EK = 5;
const TEK_EK_SINIRI = 6 * 1024 * 1024;
const TOPLAM_EK_SINIRI = 8 * 1024 * 1024;

/** Dosya adini e-posta ekine konabilecek zararsiz bir ada indirger. */
function guvenliAd(ham: string, sira: number): string {
  const temiz = (ham || "")
    .replace(/[\\/]/g, "-")
    .replace(/[^\w.\-() ]+/g, "")
    .trim()
    .slice(-80);
  return temiz || `fotograf-${sira}.jpg`;
}

/**
 * Istek govdesini okur.
 *
 * Fotograf yoksa istemci eskisi gibi JSON gonderiyor; fotograf varsa
 * `multipart/form-data` icinde `veri` alani JSON, `gorsel` alanlari dosyalar.
 * Iki bicim de destekleniyor ki fotograf ozelligi eski akisi bozmasin.
 */
async function govdeyiOku(
  req: Request
): Promise<{ data: Record<string, unknown> | null; ekler: EpostaEki[] }> {
  const tur = req.headers.get("content-type") || "";
  if (!tur.toLowerCase().includes("multipart/form-data")) {
    return { data: await req.json().catch(() => null), ekler: [] };
  }

  const fd = await req.formData().catch(() => null);
  if (!fd) return { data: null, ekler: [] };

  let data: Record<string, unknown> | null = null;
  try {
    const ham = fd.get("veri");
    data = typeof ham === "string" ? (JSON.parse(ham) as Record<string, unknown>) : null;
  } catch {
    data = null;
  }

  const ekler: EpostaEki[] = [];
  let toplam = 0;
  for (const parca of fd.getAll("gorsel")) {
    if (typeof parca === "string" || !(parca instanceof Blob)) continue;
    if (ekler.length >= EN_FAZLA_EK) break;
    // Yalnizca gorsel; parca.type istemciden geliyor, bu yuzden ayrica boyut
    // sinirlari da uygulaniyor.
    if (!parca.type.startsWith("image/")) continue;
    if (parca.size === 0 || parca.size > TEK_EK_SINIRI) continue;
    if (toplam + parca.size > TOPLAM_EK_SINIRI) break;
    toplam += parca.size;
    ekler.push({
      ad: guvenliAd((parca as File).name, ekler.length + 1),
      tur: parca.type,
      veri: Buffer.from(await parca.arrayBuffer()),
    });
  }
  return { data, ekler };
}

/**
 * Online teklif formunun alicisi.
 *
 * ⚠️ Onceki hali talebi yalnizca kaydediyordu; e-posta gonderimi hic
 * yazilmamisti (yerinde "uretimde burada e-posta bildirimi" notu vardi).
 * Yani gelen her talep sessizce bir dosyaya yaziliyordu ve kimse haberdar
 * olmuyordu. Artik kayittan sonra bildirim e-postasi gonderiliyor.
 *
 * E-posta gonderimi BASARISIZ olsa bile istek basarili sayilir: talep zaten
 * kaydedildi ve panelde gorunuyor, musteriyi cezalandirmanin anlami yok.
 * Sonuc yanitta `bildirim` alaninda donuyor, boylece sorun sessiz kalmiyor.
 */
export async function POST(req: Request) {
  const { data, ekler } = await govdeyiOku(req);

  const eksik: string[] = [];
  if (!data?.firma) eksik.push("firma adı");
  if (!data?.tel) eksik.push("telefon");
  if (!data?.eposta) eksik.push("e-posta");
  if (!Array.isArray(data?.ekipmanlar) || data.ekipmanlar.length === 0) eksik.push("en az bir ekipman");
  if (eksik.length || !data) {
    return NextResponse.json(
      { error: `Şu alanlar eksik: ${eksik.join(", ")}.` },
      { status: 400 }
    );
  }

  // Yukaridaki kontrol gecildiyse dizi oldugu kesin; govde `unknown` alanlarla
  // geldigi icin burada bir kez daraltiliyor.
  const gelenEkipmanlar = (data.ekipmanlar as unknown[]).map(String);

  const tarih = new Date().toISOString();
  const ref = "BLG-" + Date.now().toString(36).toUpperCase();
  const raporNo = "AB0296-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

  /**
   * Ek bilgi sorulari (m², kat sayisi, dedektor adedi...).
   *
   * ⚠️ Bunlar teklif hazirlamak icin ZORUNLU bilgiler; kaybolurlarsa musteriyi
   * arayip tek tek sormak gerekir. Sitenin PHP surumunde bu alanlar bir yol
   * hatasi yuzunden e-postaya HIC girmiyordu ve kimse fark etmemisti — bu
   * yuzden burada hem kayda hem e-postaya ayri ayri isleniyor.
   */
  const bilgiler = Array.isArray(data.bilgiler)
    ? (data.bilgiler as unknown[])
        .map((b) => {
          const o = b as Record<string, unknown>;
          return {
            ekipman: String(o?.ekipman ?? ""),
            soru: String(o?.soru ?? ""),
            cevap: String(o?.cevap ?? "").trim(),
          };
        })
        .filter((b) => b.soru && b.cevap)
        .slice(0, 60)
    : [];

  const kayit = {
    ref,
    raporNo,
    firma: String(data.firma),
    ad: String(data.ad || ""),
    tel: String(data.tel),
    eposta: String(data.eposta),
    bolge: String(data.bolge || ""),
    ekipmanlar: gelenEkipmanlar,
    tarih,
    durum: "yeni",
    gecerli: "Kontrol sonrası belirlenecek",
    /**
     * Ek bilgiler musterinin notuyla ayni alanda saklaniyor.
     *
     * Neden ayri sutun acilmadi: `teklifler` tablosuna sutun eklemek MySQL'de
     * "IF NOT EXISTS" desteklenmedigi icin ozel gecis kodu gerektiriyor ve bu
     * bilgi yalnizca OKUNUYOR (hicbir yerde sorgulanmiyor, ayristirilmiyor).
     * Metin olarak saklamak hem panelde hem e-postada dogru gorunuyor.
     */
    ek: [
      bilgiler.length
        ? bilgiler.map((b) => `${b.soru} ${b.cevap}`).join("\n")
        : "",
      String(data.not || ""),
      // Fotograflar burada saklanmiyor; panelde bakan kisi bunlarin bildirim
      // e-postasinda oldugunu bilmezse hic aramaz.
      ekler.length ? `📷 ${ekler.length} fotoğraf eklendi (bildirim e-postasının ekinde).` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };

  /**
   * ⚠️ Kayit ve bildirim BIRBIRINDEN BAGIMSIZ denenir.
   *
   * 2026-08-28'de uretimde Vercel Blob deposunun askiya alindigi ("This store
   * has been suspended") gorulду; kayit adimi hata firlatiyordu. Kayit ile
   * bildirim birbirine baglanirsa depo bir sorun yasadiginda musteri talebi
   * TAMAMEN kaybolur. Bu yuzden: kayit basarisiz olsa bile e-posta yine
   * gonderilir ve talep sahibine basari doner. Ikisi birden basarisizsa
   * musteriye dogru soylenir ve telefon numarasi verilir.
   */
  let kaydedildi = true;
  let kayitHata = "";
  try {
    await saveTeklif(kayit);
  } catch (e) {
    kaydedildi = false;
    kayitHata = hataMetni(e);
    console.error("[TEKLIF] Kayit hatasi:", e);
  }

  const epostaVerisi = {
    ref,
    firma: kayit.firma,
    ad: kayit.ad,
    tel: kayit.tel,
    eposta: kayit.eposta,
    bolge: kayit.bolge,
    not: String(data.not || ""),
    ekipmanlar: kayit.ekipmanlar,
    bilgiler,
    tarih,
    ekSayisi: ekler.length,
  };

  const bildirim = await epostaGonder({
    konu: `Yeni teklif talebi — ${kayit.firma} (${ref})`,
    html: teklifEpostaHtml(epostaVerisi),
    metin: teklifEpostaMetin(epostaVerisi),
    yanitla: kayit.eposta,
    ekler,
  });

  if (!bildirim.gonderildi) {
    console.warn("[TEKLIF] Bildirim e-postasi gonderilemedi:", bildirim.hata, "| ref:", ref);
    // ⚠️ Fotograflarin TEK tasiyicisi bu e-posta; gitmediyse kayboldular.
    // Musteriye de soyleniyor (yanittaki `bildirim: false` ile).
    if (ekler.length) {
      console.warn("[TEKLIF] Musterinin", ekler.length, "fotografi iletilemedi | ref:", ref);
    }
  }

  // Ne kaydedilebildi ne de bildirilebildi -> talep gercekten kayboldu.
  // Musteriye bunu soyle ve telefon ver; sessizce "alindi" demek en kotusu.
  if (!kaydedildi && !bildirim.gonderildi) {
    console.error("[TEKLIF] TALEP KAYBEDILDI — ne kayit ne bildirim:", JSON.stringify(kayit));
    return NextResponse.json(
      {
        error:
          "Teknik bir sorun nedeniyle talebiniz iletilemedi. Lütfen 0212 872 52 04 numarasından bize ulaşın.",
      },
      { status: 503 }
    );
  }

  /**
   * `kayitHata` yalnizca kayit DUSTUGUNDE dolar.
   *
   * ⚠️ Gerekcesi: Hostinger uygulamanin `console.error` ciktisini gunluge
   * yazmiyor. Kayit basarisiz oldugunda geriye sadece `kaydedildi:false`
   * kaliyordu ve sebebi ogrenmenin HICBIR yolu yoktu. Sebep olmadan bir
   * veritabani hatasi tahminle aranir; bu projede tam olarak bu yuzden
   * saatler kaybedildi. Musteriye gosterilen formda bu alan kullanilmiyor.
   */
  return NextResponse.json({
    ok: true,
    mesaj: "Talebiniz alındı.",
    referans: ref,
    raporNo,
    bildirim: bildirim.gonderildi,
    kaydedildi,
    // `hataMetni` her zaman dolu doner; kosul yalnizca "kayit basarili" halini eler.
    ...(kaydedildi ? {} : { kayitHata }),
    // Bildirim de ayni sebeple: "gonderilemedi" bilgisi tek basina teshis
    // ettirmiyor, sebep lazim (kimlik hatasi mi, port kapali mi, zaman asimi mi).
    ...(bildirim.gonderildi ? {} : { bildirimHata: (bildirim.hata || "sebep bildirilmedi").slice(0, 300) }),
  });
}
