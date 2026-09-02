import Link from "next/link";

/**
 * KIRINTI YOLU (breadcrumb) — gorunur bag + BreadcrumbList yapisal verisi.
 *
 * ⚠️ NEDEN VAR: 2026-09-02 tam taramasinda 158 sayfanin 154'unde
 * BreadcrumbList vardi; eksik dortlu `/`, `/teklif`, `/hesapla`, `/yazilar`
 * idi. Ana sayfada breadcrumb OLMAMASI dogru (kok sayfa), digerlerinde
 * eksiklikti. Denetim araclari bunu "eksik yapisal veri" olarak isaretliyor,
 * Google da arama sonucunda site yolu gostermek icin kullaniyor.
 *
 * ⚠️ Gorunur yol ve yapisal veri AYNI kaynaktan uretiliyor. Google, yalnizca
 * yapisal veride var olup sayfada gorunmeyen kirinti yolunu uygunsuz sayar;
 * ikisini tek bilesende tutmak bu ikisinin birbirinden ayrilmasini onluyor.
 */
export default function KirintiYolu({
  ad,
  yol,
  merkez = false,
}: {
  /** Bulundugumuz sayfanin adi. */
  ad: string;
  /** Bulundugumuz sayfanin yolu, "/teklif" gibi. */
  yol: string;
  /** Ortalanmis kahraman bolumlerinde sola yaslamak yerine ortalar. */
  merkez?: boolean;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: ad, item: `https://bilgekontrol.com${yol}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav
        aria-label="Site yolu"
        className={`text-sm text-muted ${merkez ? "flex justify-center" : ""}`}
      >
        <Link href="/" className="hover:text-blue">
          Ana Sayfa
        </Link>
        <span className="mx-1.5">/</span>
        <span>{ad}</span>
      </nav>
    </>
  );
}
