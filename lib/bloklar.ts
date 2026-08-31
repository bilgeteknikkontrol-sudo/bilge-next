/**
 * Genel "blok" koleksiyonu — panelden yonetilen kucuk icerik parcalari.
 *
 * Referanslar, ekip, sertifikalar, hero slaytlari ve genel SSS icin ayri ayri
 * tablo/modul yazmak yerine tek bir koleksiyon kullaniliyor. Her kaydin bir
 * `tur`u var; panel tek ekrandan hepsini yonetiyor (ekle / duzenle / sil /
 * pasife al / sirala).
 *
 * Depolama: mevcut anahtar-deger icerik deposu (`site_content`) icinde tek bir
 * JSON. Boylece hem Vercel Blob hem Postgres arka ucunda sema degisikligi
 * gerekmeden calisiyor.
 */
import { getContent, setContent, getMedia } from "./cms";

export const BLOK_TURLERI = [
  "hero",
  "ozellik",
  "rakam",
  "avantaj",
  "surec",
  "referans",
  "sektor",
  "uzmanlik",
  "sertifika",
  "sss",
  "fennisss",
] as const;
export type BlokTuru = (typeof BLOK_TURLERI)[number];

export const TUR_ETIKET: Record<BlokTuru, string> = {
  hero: "Ana Sayfa Slayt Görselleri",
  ozellik: "Ana Sayfa — Üst Bölüm Maddeleri",
  rakam: "Ana Sayfa — Rakam Şeridi",
  avantaj: "Ana Sayfa — Fark Kartları",
  surec: "Ana Sayfa — Süreç Adımları",
  referans: "Referans Logoları",
  sektor: "Hizmet Verilen Sektörler",
  uzmanlik: "Uzmanlık Alanları",
  sertifika: "Sertifika ve Belgeler",
  sss: "Sık Sorulan Sorular",
  fennisss: "Fenni Muayene Sayfası — Sorular",
};

/** Her tur icin hangi alanlarin anlamli oldugu — panelde ipucu olarak gosterilir. */
export const TUR_IPUCU: Record<BlokTuru, string> = {
  hero: "Görsel zorunlu. Başlık/metin boş bırakılabilir; slayt yalnızca arka plan görselidir.",
  ozellik: "İkon = emoji (🛡️ 📋 🇹🇷), Başlık = kalın yazan kısa cümle, Metin = altındaki açıklama.",
  rakam: "Başlık = rakamın kendisi (2014, 500+, 92), Metin = altındaki etiket (Yılından beri).",
  avantaj: "İkon = emoji, Başlık = kart başlığı, Metin = açıklama. Dört kart yan yana en iyi görünür.",
  surec: "Başlık = adımın adı, Metin = açıklaması. Numara sıraya göre otomatik verilir.",
  referans: "Başlık = firma adı, Görsel = logo. Bağlantı isteğe bağlı.",
  sektor: "İkon = emoji, Başlık = sektör adı, Metin = o sektörde hangi ekipmanlara baktığınız.",
  uzmanlik:
    "Görsel = kartın üstündeki saha fotoğrafı (yüklemezseniz hazır fotoğraf kullanılır), İkon = fotoğrafın köşesindeki emoji, Başlık = branş adı, Metin = o branşın hangi ekipmanlara baktığı. ⚠️ Kişi adı yazmayın — burası kişi değil uzmanlık alanı listesidir.",
  sertifika: "Başlık = belge adı, Metin = açıklama, Görsel = belge görseli, Bağlantı = PDF adresi.",
  sss: "Başlık = soru, Metin = cevap.",
  fennisss:
    "Başlık = soru, Metin = cevap. Bu sorular ayrıca Google'a yapısal veri olarak gönderilir; arama sonucunda çıkabilir.",
};

/**
 * Hangi turlerde EMOJI IKON alani gosterilir.
 *
 * Ikon yalnizca birkac turde anlamli; her formda gostermek geri kalan
 * ekranlari gereksiz yere kalabaliklastirirdi.
 */
export const IKONLU_TURLER: ReadonlySet<BlokTuru> = new Set<BlokTuru>([
  "ozellik",
  "avantaj",
  "sektor",
  "uzmanlik",
]);

/** Gorsel alani anlamsiz olan turler — formda gizlenir. */
export const GORSELSIZ_TURLER: ReadonlySet<BlokTuru> = new Set<BlokTuru>([
  "rakam",
  "avantaj",
  "surec",
  "sektor",
  "sss",
  "fennisss",
]);

export type Blok = {
  id: string;
  tur: BlokTuru;
  baslik: string;
  metin: string;
  /**
   * Emoji ikon (ornek: "🛡️"). Yalnizca IKONLU_TURLER icin anlamli.
   * ⚠️ Sonradan eklendi: eski kayitlarda YOK, bu yuzden opsiyonel ve okuyan
   * taraf mutlaka bir varsayilana dusmeli.
   */
  ikon?: string;
  /** Gorsel adresi: /img/... , https://... veya base64 data URL */
  gorsel: string;
  /** Ilgili baglanti (sertifikada PDF, referansta firma sitesi vb.) */
  url: string;
  sira: number;
  aktif: boolean;
};

const ANAHTAR = "bloklar";

function tumunuAyristir(ham: string | null): Blok[] {
  if (!ham) return [];
  try {
    const d = JSON.parse(ham);
    return Array.isArray(d) ? (d as Blok[]) : [];
  } catch {
    // Bozuk JSON sitenin comesine yol acmamali; bos liste ile devam.
    return [];
  }
}

export async function tumBloklar(): Promise<Blok[]> {
  return tumunuAyristir(await getContent(ANAHTAR));
}

/**
 * PANELDEN SILINMIS GORSELE YAPILAN ATIFI TEMIZLER.
 *
 * ⚠️ NEDEN VAR: 2026-08-30'da canli anasayfada `/api/gorsel/1` isteginin 404
 * dondugu goruldu. Hero slayt blogu, medya kutuphanesinden SILINMIS bir
 * gorseli isaret ediyordu. Kod bunu bilmedigi icin "slayt var" sayip statik
 * yedek gorseli atliyordu; sonuc, sitenin en gorunur alani olan anasayfa
 * hero'sunun BOS gorunmesiydi. Tarayici konsolunda tek satirlik bir 404
 * disinda hicbir belirti yoktu.
 *
 * Cozum blok okuma yolunda: gecersiz atif bos dizeye cevriliyor, boylece
 * cagiran taraf "gorsel yok" durumunu normal sekilde ele aliyor ve varsa
 * kendi yedegine dusuyor. Ayni koruma referans logolari, ekip fotograflari ve
 * sertifika gorselleri icin de gecerli — hepsi ayni koleksiyondan okunuyor.
 *
 * ⚠️ Yalnizca `/api/gorsel/<id>` bicimindeki atiflar dogrulanir; `/img/...`,
 * `https://...` ve `data:` adresleri oldugu gibi birakilir.
 *
 * ⚠️ `tumBloklar()` TEMIZLENMEZ: panelin bozuk atifi gormesi gerekiyor ki
 * kullanici duzeltebilsin.
 */
const GORSEL_ATIF = /^\/api\/gorsel\/(\d+)$/;

async function gecersizGorselleriTemizle(list: Blok[]): Promise<Blok[]> {
  const atifli = list.filter((b) => GORSEL_ATIF.test(b.gorsel?.trim() ?? ""));
  if (atifli.length === 0) return list;

  // Medya listesi okunamazsa hicbir seyi silme: gecici bir hata yuzunden
  // calisan gorselleri kaybetmek, bozuk bir atifi birakmaktan kotudur.
  const medya = await getMedia().catch(() => null);
  if (!medya) return list;

  const idler = new Set(medya.map((m) => m.id));
  return list.map((b) => {
    const e = GORSEL_ATIF.exec(b.gorsel?.trim() ?? "");
    if (e && !idler.has(Number(e[1]))) return { ...b, gorsel: "" };
    return b;
  });
}

/** Bir turdeki AKTIF bloklar, sira sonra baslik olarak siralanmis. */
export async function bloklar(tur: BlokTuru): Promise<Blok[]> {
  const secilen = (await tumBloklar())
    .filter((b) => b.tur === tur && b.aktif)
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, "tr"));
  return gecersizGorselleriTemizle(secilen);
}

async function yaz(list: Blok[]): Promise<void> {
  await setContent(ANAHTAR, JSON.stringify(list));
}

export async function blokKaydet(b: Blok): Promise<void> {
  const list = await tumBloklar();
  const i = list.findIndex((x) => x.id === b.id);
  if (i >= 0) list[i] = b;
  else list.push(b);
  await yaz(list);
}

export async function blokSil(id: string): Promise<void> {
  await yaz((await tumBloklar()).filter((b) => b.id !== id));
}

/** Aktif/pasif durumunu tersine cevirir. */
export async function blokDurumDegistir(id: string): Promise<void> {
  const list = await tumBloklar();
  const b = list.find((x) => x.id === id);
  if (!b) return;
  b.aktif = !b.aktif;
  await yaz(list);
}

export function yeniId(): string {
  return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
