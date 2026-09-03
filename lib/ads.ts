/**
 * GOOGLE ADS DONUSUM OLCUMU
 *
 * Uc donusum olculuyor: teklif formunun BASARIYLA gonderilmesi, telefon
 * numarasina tiklanmasi, WhatsApp baglantisina tiklanmasi.
 *
 * ⚠️ Etiketler (`AW-<hesap>/<etiket>`) Google Ads'de dogrudan bu isimlerle
 * degil, olusturulma sirasiyla duruyor — hesapta adlari "Fiyat teklifi
 * isteyin", "Kişi" ve "Kişi (1)" olarak kaydedildi (03.09.2026). Panelde ad
 * degistirmek ETIKETI DEGISTIRMEZ, bu yuzden buradaki degerler adlar
 * duzeltilse de gecerlidir.
 *
 * ⚠️ Deger/para birimi BILEREK GONDERILMIYOR. Google'in verdigi ornek kod
 * "1.0 TRY" iceriyordu; bu uydurma bir degerdir. Deger gonderilmediginde
 * donusum isleminin kendi ayari uygulanir. Gercek is degeri (ornegin teklifin
 * ortalama tutari) belirlenirse buraya eklenir.
 *
 * ⚠️ Onay verilmemis ziyaretcide de calisir: Consent Mode v2 gelismis modda
 * etiket yuklu ve izinler "denied" ile basliyor; cerez yazilmadan kimlik
 * tasimayan bir sinyal gidiyor, Google donusumu bundan modelliyor
 * (bkz. app/components/GoogleAnalytics.tsx).
 */

/** Ads hesap kimligi. Ortam degiskeni tanimliysa o kullanilir. */
export const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID || "AW-875922297";

export type DonusumTuru = "teklif" | "telefon" | "whatsapp";

const ETIKETLER: Record<DonusumTuru, string> = {
  // Ads'de "Fiyat teklifi isteyin" (Fiyat teklifi isteme kategorisi)
  teklif: "xDWeCJXaqu0cEPmG1qED",
  // Ads'de "Kişi" — sitedeki tel: baglantilarina tiklama
  telefon: "zXzOCJjaqu0cEPmG1qED",
  // Ads'de "Kişi (1)" — wa.me baglantilarina tiklama
  whatsapp: "lbDQCJvaqu0cEPmG1qED",
};

/**
 * Donusumu Google Ads'e bildirir.
 *
 * Sessizce cikilan durumlar (hicbiri hata degil): sunucu tarafi, etiketin
 * yuklenmemis olmasi (reklam engelleyici, ag hatasi) ve panel sayfalari.
 *
 * ⚠️ PANEL DISLANIYOR: /admin altindaki teklif listesinde musteri telefon
 * numaralari tel: baglantisi olarak duruyor. Firma calisani musteriyi aramak
 * icin tikladiginda bu bir donusum DEGILDIR; sayilirsa hem rakamlar sisirilir
 * hem de teklif verme algoritmasi yanlis ogrenir.
 */
export function adsDonusum(tur: DonusumTuru): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: `${ADS_ID}/${ETIKETLER[tur]}` });
}
