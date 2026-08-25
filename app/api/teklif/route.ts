import { NextResponse } from "next/server";
import { saveTeklif } from "@/lib/store";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data?.firma || !data?.tel || !data?.eposta || !Array.isArray(data.ekipmanlar) || data.ekipmanlar.length === 0) {
    return NextResponse.json({ error: "Eksik bilgi. Firma, telefon, e-posta ve en az bir ekipman zorunludur." }, { status: 400 });
  }

  const ref = "BLG-" + Date.now().toString(36).toUpperCase();
  const raporNo = "AB0296-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
  const kayit = {
    ref,
    raporNo,
    firma: data.firma,
    ad: data.ad || "",
    tel: data.tel,
    eposta: data.eposta,
    bolge: data.bolge || "",
    ekipmanlar: data.ekipmanlar,
    tarih: new Date().toISOString(),
    durum: "yeni",
    gecerli: "Kontrol sonrası belirlenecek",
    ek: "AB-0296-M",
  };

  await saveTeklif(kayit);
  console.log("[TEKLIF] Yeni talep:", ref, data.firma);

  // Üretimde burada: İSG-KATİP entegrasyonu + e-posta/WhatsApp bildirimi.
  return NextResponse.json({ ok: true, mesaj: "Talebiniz alındı.", referans: ref, raporNo });
}
