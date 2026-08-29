/**
 * ARAMA SONUCU BASLIGI (title etiketi)
 *
 * ⚠️ NEDEN VAR: `app/layout.tsx` icindeki title sablonu her sayfa basligina
 * " | Bilge Teknik Kontrol" ekliyor — 23 karakter. Blog basliklari zaten uzun
 * soru cumleleri oldugu icin 2026-08-30 denetiminde 31 sayfanin basligi 60
 * karakteri asiyordu (en uzunu 107). Google arama sonucunda basligi kirpiyor;
 * kirpilan baslik yarim kaliyor ve tiklama oranini dusuruyor.
 *
 * Cozum: marka eki YALNIZCA sigdiginda ekleniyor. Sigmiyorsa Next.js'in
 * `absolute` alani ile sablon devre disi birakilip baslik oldugu gibi
 * kullaniliyor. Marka zaten arama sonucunda alan adi olarak gorunuyor.
 */

/** Sablonun ekledigi son ek: " | Bilge Teknik Kontrol" */
const MARKA_EKI_UZUNLUK = " | Bilge Teknik Kontrol".length;

/** Google'in masaustu arama sonucunda kirpmadan gosterdigi pratik sinir. */
export const BASLIK_SINIRI = 60;

/**
 * Metadata `title` alanini uretir.
 *
 * - Baslik + marka eki 60 karaktere siginiyorsa: duz metin doner, sablon
 *   markayi ekler.
 * - Sigmiyorsa: `{ absolute }` doner, sablon devre disi kalir.
 */
export function seoBaslik(baslik: string): string | { absolute: string } {
  const temiz = baslik.trim();
  if (temiz.length + MARKA_EKI_UZUNLUK <= BASLIK_SINIRI) return temiz;
  return { absolute: temiz };
}
