import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * CALISAN KODUN SURUMU.
 *
 * ⚠️ NEDEN VAR: Hostinger paneli bir dagitim icin "Tamamlandi / Akim" yazip
 * commit numarasini gostermesine ragmen, uygulama ESKI KODLA calismaya devam
 * edebiliyor — panelin etiketi webhook'tan geliyor, diskteki koddan degil.
 * 2026-08-29'da bu yuzden ust uste dagitim yapildi ve her seferinde "yeni kod
 * canlida mi?" sorusu ancak gercek bir teklif gonderip (yani gercek bir
 * e-posta harcayarak) olculebildi.
 *
 * Bu uc nokta o soruyu bedelsiz yanitliyor:
 *   curl -s https://bilgekontrol.com/api/surum
 *
 * KURAL: her dagitimdan once `SURUM` degeri elle guncellenir. Degismediyse
 * calisan kod eskidir — panel ne yazarsa yazsin.
 */
const SURUM = "2026-08-30-15-ince-yazilar";

export async function GET() {
  return NextResponse.json({ surum: SURUM });
}
