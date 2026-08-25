import { NextResponse } from "next/server";
import { appendJSON } from "@/lib/store";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data?.firma || !data?.tel || !data?.eposta || !Array.isArray(data.ekipmanlar) || data.ekipmanlar.length === 0) {
    return NextResponse.json({ error: "Eksik bilgi. Firma, telefon, e-posta ve en az bir ekipman zorunludur." }, { status: 400 });
  }

  const referans = "BLG-" + Date.now().toString(36).toUpperCase();
  const kayit = {
    referans,
    firma: data.firma,
    ad: data.ad,
    tel: data.tel,
    eposta: data.eposta,
    bolge: data.bolge,
    ekipmanlar: data.ekipmanlar,
    tarih: new Date().toISOString(),
    durum: "yeni",
  };

  // Sunucu tarafı kalıcı depolama (Node sunucu/Docker deploy'da kalıcı).
  // Vercel gibi sunucusuz ortamda dosya yazımı geçici olur; üretimde DB'ye geçilmeli.
  const ok = await appendJSON("teklifler.json", kayit);
  if (ok) {
    await appendJSON("raporlar.json", {
      no: referans,
      firma: data.firma,
      ekipman: data.ekipmanlar.join(", "),
      tarih: new Date().toLocaleDateString("tr-TR"),
      gecerli: "Kontrol sonrası belirlenecek",
      durum: "yeni",
      ek: "AB-0296-M",
    });
  }
  console.log("[TEKLIF] Yeni talep:", referans, data.firma);

  // Üretimde burada: İSG-KATİP entegrasyonu + e-posta/WhatsApp bildirimi.
  return NextResponse.json({ ok: true, mesaj: "Talebiniz alındı.", referans });
}
