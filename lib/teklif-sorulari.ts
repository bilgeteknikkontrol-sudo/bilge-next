/**
 * TEKLIF FORMU EK BILGI SORULARI
 *
 * Bazi ekipmanlara fiyat verebilmek icin adet yetmiyor: yangin tesisatinda
 * binanin m2'si, yangin algilamada dedektor sayisi, raf sisteminde sira ve kat
 * sayisi gerekiyor. Bu bilgiler sorulmazsa teklif hazirlanamiyor ve musteriye
 * geri donup tek tek sormak gerekiyor.
 *
 * ⚠️ Sitenin onceki PHP surumunde bu alanlar VARDI, Next.js surumune tasinirken
 * kayboldu (form yalnizca onay kutusuna dustu). Eski yapinin tam dokumu:
 * `eski-teklif-formu-yapisi.md`. Bu modul o ozelligi geri getiriyor.
 *
 * ⭐ ESKISINDEN FARKI: sorular KATEGORIYE degil EKIPMANA bagli. Eski formda
 * "Yangin Sondurme Tesisati" grubunu acan herkes dort soruyu birden goruyordu;
 * yeni kategoriler daha genis oldugu icin ayni yaklasim "Yangin ve Guvenlik
 * Sistemleri"ni secen birine dokuz alakasiz soru gosterirdi. Ekipman bazli
 * olunca yalnizca gercekten secilen ekipmanin sorulari cikiyor.
 *
 * Depolama: `bloklar` ile ayni desen — `site_content` icinde tek JSON.
 * Sema degisikligi gerektirmiyor.
 */
import { getContent, setContent } from "./cms";

export type SoruTipi = "sayi" | "metin";

export type TeklifSoru = {
  id: string;
  /** Hangi ekipman secilince sorulacak (lib/data.ts icindeki slug) */
  ekipmanSlug: string;
  /** Musteriye gosterilen soru */
  etiket: string;
  tip: SoruTipi;
  /** Kutunun icindeki ornek metin */
  ornek: string;
  sira: number;
  aktif: boolean;
};

const ANAHTAR = "teklif_sorulari";

/**
 * Depo bosken kullanilan varsayilanlar.
 *
 * Boylece ozellik dagitildigi anda calisiyor; panelden tek tek girmek
 * gerekmiyor. Panelden ilk kayit yapildiginda bu liste devreden cikar
 * (site genelindeki "kod varsayilani / panel kaydi" mantiginin aynisi).
 *
 * Kaynak: eski PHP formundaki 17 alan. Ikisi bilerek alinmadi:
 *  - "Sprinkler sistemi var mi? (Var/Yok)" -> sprinkler ekipmani zaten
 *    secilebiliyor, secilmesi cevabin kendisi.
 *  - "Portatif yangin sondurme cihazi: Adet" -> artik her ekipmanin yaninda
 *    adet kutusu var, ayri soru gereksiz.
 */
export const VARSAYILAN_SORULAR: TeklifSoru[] = [
  // --- Yangın tesisatı ---
  { id: "v1", ekipmanSlug: "yangin-tesisati", etiket: "Bina kaç m²?", tip: "metin", ornek: "Örn: 2000 m²", sira: 1, aktif: true },
  { id: "v2", ekipmanSlug: "yangin-tesisati", etiket: "Bina kaç katlı?", tip: "sayi", ornek: "Kat sayısı", sira: 2, aktif: true },

  // --- Yangın dolabı / hidrant ---
  { id: "v3", ekipmanSlug: "yangin-dolabi-ve-hidrant", etiket: "Kaç adet yangın dolabı var?", tip: "sayi", ornek: "0", sira: 1, aktif: true },

  // --- Yangın algılama ---
  { id: "v4", ekipmanSlug: "yangin-algilama", etiket: "Panel var mı? Varsa kaç adet?", tip: "metin", ornek: "Örn: 1 adet", sira: 1, aktif: true },
  { id: "v5", ekipmanSlug: "yangin-algilama", etiket: "Dedektör sayısı (panelde yazar)", tip: "sayi", ornek: "0", sira: 2, aktif: true },
  { id: "v6", ekipmanSlug: "yangin-algilama", etiket: "Kaç m²?", tip: "metin", ornek: "Örn: 1500 m²", sira: 3, aktif: true },
  { id: "v7", ekipmanSlug: "yangin-algilama", etiket: "Kaç kat?", tip: "sayi", ornek: "Kat sayısı", sira: 4, aktif: true },

  // --- Havalandırma ---
  { id: "v8", ekipmanSlug: "havalandirma", etiket: "Santral sayısı", tip: "sayi", ornek: "0", sira: 1, aktif: true },
  { id: "v9", ekipmanSlug: "havalandirma", etiket: "Bölümlerin m²", tip: "metin", ornek: "Örn: üretim 500 m², depo 300 m²", sira: 2, aktif: true },

  // --- Raf sistemleri ---
  { id: "v10", ekipmanSlug: "raf-sistemleri", etiket: "Kaç sıra raf var?", tip: "sayi", ornek: "0", sira: 1, aktif: true },
  { id: "v11", ekipmanSlug: "raf-sistemleri", etiket: "Her sıradaki raf çerçeve sayısı", tip: "sayi", ornek: "0", sira: 2, aktif: true },
  { id: "v12", ekipmanSlug: "raf-sistemleri", etiket: "Raf kaç katlı?", tip: "sayi", ornek: "Kat sayısı", sira: 3, aktif: true },

  // --- Elektrik ---
  { id: "v13", ekipmanSlug: "elektrik-tesisat", etiket: "Elektrik pano sayısı", tip: "sayi", ornek: "0", sira: 1, aktif: true },
  { id: "v14", ekipmanSlug: "elektrik-tesisat", etiket: "Tesis kaç m²?", tip: "metin", ornek: "Örn: 1500 m²", sira: 2, aktif: true },
  { id: "v15", ekipmanSlug: "topraklama-olcumu", etiket: "Topraklama nokta sayısı", tip: "sayi", ornek: "0", sira: 1, aktif: true },
];

function ayristir(ham: string | null): TeklifSoru[] | null {
  if (!ham) return null;
  try {
    const d = JSON.parse(ham);
    return Array.isArray(d) ? (d as TeklifSoru[]) : null;
  } catch {
    // Bozuk JSON formu comertmesin; varsayilanlara dusulur.
    return null;
  }
}

/** Panelde gosterilen tam liste (pasifler dahil). */
export async function tumSorular(): Promise<TeklifSoru[]> {
  const kayitli = ayristir(await getContent(ANAHTAR).catch(() => null));
  return (kayitli ?? VARSAYILAN_SORULAR).slice().sort((a, b) => a.sira - b.sira);
}

/** Formda kullanilan: ekipman slug -> aktif sorular. */
export async function sorularHaritasi(): Promise<Record<string, TeklifSoru[]>> {
  const harita: Record<string, TeklifSoru[]> = {};
  for (const s of await tumSorular()) {
    if (!s.aktif || !s.ekipmanSlug) continue;
    (harita[s.ekipmanSlug] ||= []).push(s);
  }
  for (const k of Object.keys(harita)) harita[k].sort((a, b) => a.sira - b.sira);
  return harita;
}

async function yaz(liste: TeklifSoru[]): Promise<void> {
  await setContent(ANAHTAR, JSON.stringify(liste));
}

export function yeniSoruId(): string {
  return `s${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

export async function soruKaydet(soru: TeklifSoru): Promise<void> {
  const liste = await tumSorular();
  const i = liste.findIndex((x) => x.id === soru.id);
  if (i >= 0) liste[i] = soru;
  else liste.push(soru);
  await yaz(liste);
}

export async function soruSil(id: string): Promise<void> {
  await yaz((await tumSorular()).filter((x) => x.id !== id));
}

export async function soruDurumDegistir(id: string): Promise<void> {
  const liste = await tumSorular();
  const s = liste.find((x) => x.id === id);
  if (s) s.aktif = !s.aktif;
  await yaz(liste);
}
