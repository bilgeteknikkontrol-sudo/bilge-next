import { notFound, permanentRedirect } from "next/navigation";
import { getArticles, getEquipment, getLocations } from "@/lib/cms";

/**
 * KOK SEVIYEDEKI ESKI ADRESLERI YAKALAYAN YONLENDIRME KATMANI
 *
 * ⚠️ NEDEN VAR: sitenin PHP surumunde ekipman sayfalari KOK dizindeydi —
 * `/forklift`, `/buhar-kazani`, `/torna-tezgahi`... Next.js surumunde bunlar
 * `/ekipman/<slug>` altina tasindi ama yonlendirme birakilmadi. 2026-08-30
 * denetiminde bu adreslerin tamami 404 donuyordu; eski site haritasindaki
 * ~90 ekipman adresi ve ~26 yazi adresi Google'in indeksinde durup
 * "sayfa bulunamadi" veriyordu.
 *
 * Yazi ve ekipman slug'lari degismedigi icin eslesme mekanik: uzantiyi at,
 * CMS'te ara, dogru on ekle yonlendir. Slug'i DEGISEN adresler burada degil,
 * `next.config.js` icindeki ESKI_SAYFALAR tablosunda — o katman render'a hic
 * girmeden cevap verdigi icin daha ucuz, once o calisir.
 *
 * ⚠️ Bu dosya kok seviyede `[slug]` oldugu icin "her seyi yakalar" gibi
 * gorunuyor ama oyle degil: Next.js'te statik segmentler dinamik olanlardan
 * once eslesir. `/ekipman`, `/yazilar`, `/sss`, `/sitemap.xml` ve public
 * altindaki dosyalar bu dosyaya hic ugramaz.
 *
 * CMS'ten okundugu icin panelden EKLENEN yeni ekipman/yazi da kendiliginden
 * kapsanir; sabit liste tutmak gerekmez.
 */
export const revalidate = 3600;

/** `.php` / `.html` uzantisini ve buyuk harfi temizler. */
function slugTemizle(ham: string): string {
  return decodeURIComponent(ham).toLowerCase().replace(/\.(php|html?)$/, "");
}

export default async function EskiAdresPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: ham } = await params;
  const slug = slugTemizle(ham);

  // CMS'e ulasilamazsa 404 dondurmek yerine yonlendirmeyi atlamak daha
  // guvenli: gecici bir veritabani hatasi kalici 301 yazdirmasin.
  const [ekipmanlar, yazilar, bolgeler] = await Promise.all([
    getEquipment().catch(() => []),
    getArticles().catch(() => []),
    getLocations().catch(() => []),
  ]);

  if (ekipmanlar.some((e) => e.slug === slug)) permanentRedirect(`/ekipman/${slug}`);
  if (yazilar.some((a) => a.slug === slug)) permanentRedirect(`/yazilar/${slug}`);
  if (bolgeler.some((l) => l.slug === slug)) permanentRedirect(`/bolge/${slug}`);

  notFound();
}
