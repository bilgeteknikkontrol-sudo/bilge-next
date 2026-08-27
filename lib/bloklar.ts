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
import { getContent, setContent } from "./cms";

export const BLOK_TURLERI = ["hero", "referans", "ekip", "sertifika", "sss"] as const;
export type BlokTuru = (typeof BLOK_TURLERI)[number];

export const TUR_ETIKET: Record<BlokTuru, string> = {
  hero: "Ana Sayfa Slayt Görselleri",
  referans: "Referans Logoları",
  ekip: "Ekip / Mühendis Kadrosu",
  sertifika: "Sertifika ve Belgeler",
  sss: "Sık Sorulan Sorular",
};

/** Her tur icin hangi alanlarin anlamli oldugu — panelde ipucu olarak gosterilir. */
export const TUR_IPUCU: Record<BlokTuru, string> = {
  hero: "Görsel zorunlu. Başlık/metin boş bırakılabilir; slayt yalnızca arka plan görselidir.",
  referans: "Başlık = firma adı, Görsel = logo. Bağlantı isteğe bağlı.",
  ekip: "Başlık = ad soyad, Metin = unvan. Görsel isteğe bağlı.",
  sertifika: "Başlık = belge adı, Metin = açıklama, Görsel = belge görseli, Bağlantı = PDF adresi.",
  sss: "Başlık = soru, Metin = cevap.",
};

export type Blok = {
  id: string;
  tur: BlokTuru;
  baslik: string;
  metin: string;
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

/** Bir turdeki AKTIF bloklar, sira sonra baslik olarak siralanmis. */
export async function bloklar(tur: BlokTuru): Promise<Blok[]> {
  return (await tumBloklar())
    .filter((b) => b.tur === tur && b.aktif)
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, "tr"));
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
