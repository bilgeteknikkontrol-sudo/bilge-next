import { NextResponse } from "next/server";
import { findTeklif } from "@/lib/store";

// Demo sabit kayıtlar ( üretimde DB + ekipnet doğrulamadan gelir)
const DEMO: Record<string, unknown> = {
  "AB0296-2026-0412": { no: "AB0296-2026-0412", firma: "Örnek Sanayi A.Ş.", ekipman: "Kompresör Hava Tankı", tarih: "20.06.2026", gecerli: "20.06.2027", durum: "ok", ek: "AB-0296-M" },
  "AB0296-2025-1180": { no: "AB0296-2025-1180", firma: "Yıldız Makine Ltd.", ekipman: "Forklift", tarih: "10.07.2025", gecerli: "10.07.2026", durum: "warn", ek: "AB-0296-M" },
};

export async function GET(req: Request) {
  const no = new URL(req.url).searchParams.get("no")?.toUpperCase();
  if (!no) return NextResponse.json({ error: "Rapor numarası gerekli." }, { status: 400 });

  if (DEMO[no]) return NextResponse.json(DEMO[no]);

  const t = await findTeklif(no);
  if (t) {
    return NextResponse.json({
      no: t.raporNo,
      firma: t.firma,
      ekipman: t.ekipmanlar.join(", "),
      tarih: new Date(t.tarih).toLocaleDateString("tr-TR"),
      gecerli: t.gecerli,
      durum: t.durum,
      ek: t.ek,
    });
  }

  return NextResponse.json({
    error: "Rapor bulunamadı. Geçerli demo no: AB0296-2026-0412 veya AB0296-2025-1180. Bir teklif oluşturduysanız size iletilen BLG- referansını deneyin.",
  }, { status: 404 });
}
