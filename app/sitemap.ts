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

/**
 * ⚠️ `lastModified` ARTIK YALNIZCA GERCEK TARIHI OLANA YAZILIYOR.
 *
 * Onceki hali her girdiye `new Date()` koyuyordu. Site haritasi saatte bir
 * yeniden uretildigi icin bu, Google'a "153 sayfanin HEPSI bir saat once
 * degisti" demek oluyordu — ve bunu her saat tekrar soyluyordu.
 *
 * Google `lastmod`'u yalnizca GUVENILIRSE kullanir; surekli "her sey yeni"
 * diyen bir harita, degeri tamamen yok sayilan bir haritaya doner. Yani
 * gercekten guncellenen bir sayfa da sinyalini kaybeder. Bos birakmak
 * (alan istege bagli) yanlis tarih yazmaktan iyidir.
 *
 * Yazilarin kendi `date` alani var, onlar tarihini korur. Ekipman ve bolge
 * tablolarinda guncelleme tarihi sutunu YOK; eklendiginde buraya da baglanir.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [yazilar, ekipmanlar, sehirler] = await Promise.all([
    getArticles().catch(() => null),
    getEquipment().catch(() => null),
    getLocations().catch(() => null),
  ]);

  const core: MetadataRoute.Sitemap = [
    { url: base + "/", changeFrequency: "weekly", priority: 1 },
    { url: base + "/ekipman", changeFrequency: "weekly", priority: 0.9 },
    { url: base + "/periyodik-kontrol-sureleri", changeFrequency: "monthly", priority: 0.9 },
    // "Fenni muayene" — periyodik kontrolun sahadaki yaygin adi. Terimi
    // karsilayan tek sayfa; ayni zamanda 90+ ekipman sayfasina link dagitiyor.
    { url: base + "/fenni-muayene", changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/teklif", changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/bolge", changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/hesapla", changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/kurumsal", changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/sertifikalar", changeFrequency: "monthly", priority: 0.8 },
    // Sahada kullanilan olcum cihazlari — yetkinlik sayfasi, sertifikalarla ayni seviyede.
    { url: base + "/cihazlar", changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/iletisim", changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/yazilar", changeFrequency: "weekly", priority: 0.7 },
    { url: base + "/sss", changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/referanslar", changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/kvkk", changeFrequency: "yearly", priority: 0.3 },
    { url: base + "/cerez-politikasi", changeFrequency: "yearly", priority: 0.3 },
  ];

  const yaziGirdileri: MetadataRoute.Sitemap = (yazilar ?? ARTICLES)
    .filter((a) => !("aktif" in a) || a.aktif)
    .map((a) => {
      // Yazinin kendi tarihi — "hepsi bugun" demek Google'a yanlis sinyal veriyordu.
      // ⚠️ Once `a.date || now` yaziyordu; `now` kaldirilinca gecersiz bir tarih
      // `Invalid Date` uretip site haritasinin TAMAMINI dusurebilirdi. Tarih
      // okunamiyorsa alan hic basilmiyor.
      const t = a.date ? new Date(a.date) : null;
      const gecerli = t && !Number.isNaN(t.getTime());
      return {
        url: `${base}/yazilar/${a.slug}`,
        ...(gecerli ? { lastModified: t } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });

  const sehirGirdileri: MetadataRoute.Sitemap = (sehirler ?? LOCATIONS)
    .filter((l) => !("aktif" in l) || l.aktif)
    .map((l) => ({
      url: `${base}/bolge/${l.slug}`,
      changeFrequency: "monthly" as const,
      // Sehir sayfalari yerel aramalarin giris kapisi; yazilardan onemli.
      priority: 0.8,
    }));

  const ekipmanGirdileri: MetadataRoute.Sitemap = (ekipmanlar ?? ALL_EKIPMAN)
    .filter((e) => !("aktif" in e) || e.aktif)
    .map((e) => ({
      url: `${base}/ekipman/${e.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...core, ...yaziGirdileri, ...sehirGirdileri, ...ekipmanGirdileri];
}
