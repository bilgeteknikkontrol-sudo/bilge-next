import type { MetadataRoute } from "next";
import { getArticles, getEquipment, getLocations } from "@/lib/cms";
import { ARTICLES, LOCATIONS, ALL_EKIPMAN } from "@/lib/content";

/**
 * Site haritasi.
 *
 * ⚠️ Onceki hali lib/content.ts icindeki SABIT listeleri okuyordu. Yani
 * panelden eklenen bir yazi, ekipman veya sehir sayfasi site haritasina
 * HIC girmiyordu; Google yeni icerigi kendiliginden bulana kadar bekliyordu.
 * Panelden silinen icerik ise haritada kalmaya devam ediyor, 404 veriyordu.
 *
 * Artik CMS'ten okunuyor. CMS'e ulasilamazsa (gecici hata) sabit listeye
 * dusuluyor — site haritasi hicbir zaman bos donmuyor.
 *
 * Yalnizca `aktif` kayitlar giriyor: pasife alinan bir yazi haritadan da cikar.
 */
export const revalidate = 3600; // saatte bir yenilensin; her istekte CMS okumaya gerek yok

const base = "https://bilgekontrol.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [yazilar, ekipmanlar, sehirler] = await Promise.all([
    getArticles().catch(() => null),
    getEquipment().catch(() => null),
    getLocations().catch(() => null),
  ]);

  const core: MetadataRoute.Sitemap = [
    { url: base + "/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: base + "/ekipman", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: base + "/periyodik-kontrol-sureleri", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // "Fenni muayene" — periyodik kontrolun sahadaki yaygin adi. Terimi
    // karsilayan tek sayfa; ayni zamanda 90+ ekipman sayfasina link dagitiyor.
    { url: base + "/fenni-muayene", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/teklif", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/bolge", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/hesapla", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/kurumsal", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/sertifikalar", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/iletisim", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/yazilar", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: base + "/sss", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/referanslar", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/kvkk", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: base + "/cerez-politikasi", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const yaziGirdileri: MetadataRoute.Sitemap = (yazilar ?? ARTICLES)
    .filter((a) => !("aktif" in a) || a.aktif)
    .map((a) => ({
      url: `${base}/yazilar/${a.slug}`,
      // Yazinin kendi tarihi — "hepsi bugun" demek Google'a yanlis sinyal veriyordu.
      lastModified: new Date(a.date || now),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const sehirGirdileri: MetadataRoute.Sitemap = (sehirler ?? LOCATIONS)
    .filter((l) => !("aktif" in l) || l.aktif)
    .map((l) => ({
      url: `${base}/bolge/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      // Sehir sayfalari yerel aramalarin giris kapisi; yazilardan onemli.
      priority: 0.8,
    }));

  const ekipmanGirdileri: MetadataRoute.Sitemap = (ekipmanlar ?? ALL_EKIPMAN)
    .filter((e) => !("aktif" in e) || e.aktif)
    .map((e) => ({
      url: `${base}/ekipman/${e.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...core, ...yaziGirdileri, ...sehirGirdileri, ...ekipmanGirdileri];
}
