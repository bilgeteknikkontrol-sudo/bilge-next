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

/* ---------------------------------------------------------------------------
   ARAMA SONUCU ACIKLAMASI (meta description)

   ⚠️ NEDEN VAR: 2026-09-01 taramasinda 153 sayfanin 9'unun aciklamasi 160
   karakteri asiyordu (en uzunu 177: /bolge/tuzla). Google fazlasini kirpiyor;
   kirpilan aciklama cumlenin ortasinda "..." ile bitiyor ve tiklama orani
   dusuyor.

   ⚠️ OLCERKEN DIKKAT: asanlarin 8'i bolge sayfasiydi ve hepsi SABLONDAN
   uretiliyordu — "<il> bolgesinde ... hizmeti. <panelden gelen aciklama>".
   Panelden girilen metnin uzunlugu bilinmedigi icin sonuc her sehirde farkli
   cikiyor; yani sorun tek tek sayfalarda degil, sablonda.

   ⚠️ Bu sayilar TEKRAR olculurken `wc -m` KULLANMAYIN: Git Bash'te yerel ayar
   C oldugu icin bayt sayiyor ve Turkce karakterli metni sisiriyor (ilk olcumde
   9 yerine 16 sayfa "asiyor" gorundu). Gercek karakter sayisi icin PowerShell
   `$s.Length` ya da UTF-8 farkindaligi olan bir arac kullanin.

   Bu yuzden kirpma KELIME sinirinda yapiliyor ve mumkunse CUMLE sinirinda:
   yarim kelimeyle biten aciklama, kirpilmis aciklamadan daha kotudur.
--------------------------------------------------------------------------- */

/** Google'in arama sonucunda kirpmadan gosterdigi pratik sinir. */
export const ACIKLAMA_SINIRI = 160;

/**
 * Meta description uretir; sinira sigmiyorsa akilli kirpar.
 *
 * Sirasiyla dener:
 *   1. Zaten siginiyorsa oldugu gibi birak.
 *   2. Sinira kadar olan kisimda TAM bir cumle bitisi (. ! ?) varsa oradan kes
 *      — sonuc noktayla biten, tam bir cumle olur, uc nokta gerekmez.
 *   3. Yoksa son tam kelimeden kes ve "…" ekle.
 */
export function seoAciklama(metin: string, sinir: number = ACIKLAMA_SINIRI): string {
  const temiz = metin.replace(/\s+/g, " ").trim();
  if (temiz.length <= sinir) return temiz;

  const pencere = temiz.slice(0, sinir);

  // 2. Cumle sinirini ara. Sinira cok yakin degilse (yarisindan kisa kalirsa)
  //    kullanma; aksi halde aciklama gereksiz yere kisalir.
  const cumleSonu = Math.max(
    pencere.lastIndexOf(". "),
    pencere.lastIndexOf("! "),
    pencere.lastIndexOf("? "),
  );
  if (cumleSonu > sinir * 0.6) return pencere.slice(0, cumleSonu + 1).trim();

  // 3. Kelime sinirindan kes. "…" tek karakter, sinira dahil.
  const bosluk = pencere.lastIndexOf(" ");
  const kesim = bosluk > 0 ? pencere.slice(0, bosluk) : pencere.slice(0, sinir - 1);
  return kesim.replace(/[.,;:\-–—]$/, "").trim() + "…";
}
