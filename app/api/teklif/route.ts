import { NextResponse } from "next/server";
import { saveTeklif } from "@/lib/store";
import { epostaGonder, teklifEpostaHtml, teklifEpostaMetin } from "@/lib/eposta";

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
  const data = await req.json().catch(() => null);

  const eksik: string[] = [];
  if (!data?.firma) eksik.push("firma adı");
  if (!data?.tel) eksik.push("telefon");
  if (!data?.eposta) eksik.push("e-posta");
  if (!Array.isArray(data?.ekipmanlar) || data.ekipmanlar.length === 0) eksik.push("en az bir ekipman");
  if (eksik.length) {
    return NextResponse.json(
      { error: `Şu alanlar eksik: ${eksik.join(", ")}.` },
      { status: 400 }
    );
  }

  const tarih = new Date().toISOString();
  const ref = "BLG-" + Date.now().toString(36).toUpperCase();
  const raporNo = "AB0296-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

  const kayit = {
    ref,
    raporNo,
    firma: String(data.firma),
    ad: String(data.ad || ""),
    tel: String(data.tel),
    eposta: String(data.eposta),
    bolge: String(data.bolge || ""),
    ekipmanlar: data.ekipmanlar.map(String),
    tarih,
    durum: "yeni",
    gecerli: "Kontrol sonrası belirlenecek",
    ek: String(data.not || ""),
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
  try {
    await saveTeklif(kayit);
  } catch (e) {
    kaydedildi = false;
    console.error("[TEKLIF] Kayit hatasi:", e);
  }

  const epostaVerisi = {
    ref,
    firma: kayit.firma,
    ad: kayit.ad,
    tel: kayit.tel,
    eposta: kayit.eposta,
    bolge: kayit.bolge,
    not: kayit.ek,
    ekipmanlar: kayit.ekipmanlar,
    tarih,
  };

  const bildirim = await epostaGonder({
    konu: `Yeni teklif talebi — ${kayit.firma} (${ref})`,
    html: teklifEpostaHtml(epostaVerisi),
    metin: teklifEpostaMetin(epostaVerisi),
    yanitla: kayit.eposta,
  });

  if (!bildirim.gonderildi) {
    console.warn("[TEKLIF] Bildirim e-postasi gonderilemedi:", bildirim.hata, "| ref:", ref);
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

  return NextResponse.json({
    ok: true,
    mesaj: "Talebiniz alındı.",
    referans: ref,
    raporNo,
    bildirim: bildirim.gonderildi,
    kaydedildi,
  });
}
