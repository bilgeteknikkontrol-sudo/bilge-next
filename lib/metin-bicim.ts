/**
 * PANELDEN GIRILEN DUZ METNI HTML'E CEVIRIR.
 *
 * ⚠️ NEDEN VAR: sayfa govdeleri (Kurumsal, KVKK, Cerez Politikasi, Fenni
 * Muayene...) koda gomuluydu; panele tasinmalari icin bir metin alanina
 * sigmalari gerekiyor. Iki kotu secenek vardi:
 *   1) Her paragraf icin ayri alan  -> KVKK sayfasi panelde 40+ kutu demek.
 *   2) Ham HTML yazdirmak           -> kullanici gelistirici degil; bir etiketi
 *                                      kapatmayi unutunca sayfa bozulur.
 * Bu yuzden araya kucuk bir bicimlendirici konuldu: kullanici duz yazi yazar,
 * birkac basit isaret ogrenir, sayfa duzgun HTML uretir.
 *
 * KURALLAR (panelde de bu sekilde anlatiliyor):
 *   bos satir      -> yeni paragraf
 *   "## " ile baslayan satir  -> ara baslik
 *   "### " ile baslayan satir -> alt baslik
 *   "- " ile baslayan satirlar -> madde listesi
 *   "1. " ile baslayan satirlar -> numarali liste
 *   **kalin**      -> kalin yazi
 *   [yazi](/adres) -> baglanti
 *
 * ⚠️ Metin zaten HTML ile basliyorsa (ornek: yazi govdeleri veritabaninda HTML
 * olarak duruyor) hicbir sey yapilmaz, oldugu gibi birakilir. Boylece ayni
 * fonksiyon hem eski HTML icerikte hem yeni duz metinde calisiyor.
 */

/** Metnin zaten HTML oldugunu gosteren baslangic. */
const HTML_BASLANGICI = /^\s*<(p|h[1-6]|ul|ol|div|section|table|figure|blockquote)\b/i;

/**
 * ⚠️ KACIS SART: kullanici metnine "<" ya da "&" yazabilir. Kacirilmazsa
 * sayfa bozulur; ustelik panele erisimi olan biri istemeden script
 * yapistirabilir.
 */
function kacir(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Satir ici isaretler. Once kacirilir, sonra isaretler etikete cevrilir —
 * ters sirada yapilirsa uretilen etiketler de kacirilirdi.
 */
function satirIci(s: string): string {
  return kacir(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    /* Baglanti adresinde tirnak/bosluk kabul edilmiyor: bozuk bir deger
       oznitelikten tasip etiketi kiramasin. */
    .replace(/\[([^\]]+)\]\(([^)\s"']+)\)/g, '<a href="$2">$1</a>');
}

export function metniHtml(ham: string | null | undefined): string {
  const metin = (ham ?? "").trim();
  if (!metin) return "";
  if (HTML_BASLANGICI.test(metin)) return metin;

  /* Baslik satirlari kendi bloklarina ayrilsin: kullanici basligin altina
     bos satir birakmayi unutsa bile baslik paragrafa yapismasin. */
  const hazir = metin.replace(/\r\n/g, "\n").replace(/^(#{2,3}\s.*)$/gm, "\n$1\n");

  const cikti: string[] = [];
  for (const blok of hazir.split(/\n\s*\n/)) {
    const satirlar = blok
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (satirlar.length === 0) continue;

    if (satirlar.length === 1 && satirlar[0].startsWith("### ")) {
      cikti.push(`<h3>${satirIci(satirlar[0].slice(4))}</h3>`);
      continue;
    }
    if (satirlar.length === 1 && satirlar[0].startsWith("## ")) {
      cikti.push(`<h2>${satirIci(satirlar[0].slice(3))}</h2>`);
      continue;
    }
    if (satirlar.every((s) => s.startsWith("- "))) {
      cikti.push(`<ul>${satirlar.map((s) => `<li>${satirIci(s.slice(2))}</li>`).join("")}</ul>`);
      continue;
    }
    if (satirlar.every((s) => /^\d+[.)]\s/.test(s))) {
      cikti.push(
        `<ol>${satirlar.map((s) => `<li>${satirIci(s.replace(/^\d+[.)]\s*/, ""))}</li>`).join("")}</ol>`
      );
      continue;
    }
    /* Blok icindeki tek satir sonlari <br> olur: adres gibi kisa satirlar
       ayni paragrafta alt alta yazilabilsin. */
    cikti.push(`<p>${satirlar.map(satirIci).join("<br />")}</p>`);
  }
  return cikti.join("\n");
}

/** Panelde metin alanlarinin altinda gosterilen kisa kullanim notu. */
export const BICIM_IPUCU =
  "Boş satır = yeni paragraf · satır başına ## = ara başlık · - = madde listesi · **kalın** · [yazı](/adres) = bağlantı";
