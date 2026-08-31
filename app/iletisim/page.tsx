import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HaritaGomulu from "../components/HaritaGomulu";
import { KURUM, EKIP } from "@/lib/site-data";
import { metinleriOku } from "@/lib/sayfa-metin";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import { bloklar } from "@/lib/bloklar";

export const metadata: Metadata = {
  title: "İletişim",
  // ⚠️ 160 karakteri asmiyor: adresin tamami sigmadigi icin ilce/il yeterli.
  // Uzun aciklama arama sonucunda kirpilip yarim cumleyle bitiyordu.
  description: `${KURUM.kisaAd} iletişim: Beylikdüzü / İstanbul. Telefon ${KURUM.telefon}. TÜRKAK akredite (${KURUM.akreditasyon}) A Tipi muayene kuruluşu.`,
  alternates: { canonical: "/iletisim" },
};

export default async function IletisimPage() {
  const m = await metinleriOku();
  /* Gorunen iletisim bilgileri artik PANELDEN (bkz. lib/iletisim-bilgi.ts). */
  const b = await iletisimBilgi();
  /* Teknik ekip de panelden; kayit yoksa liste hic basilmaz. */
  const ekipBloklari = await bloklar("ekip").catch(() => []);
  const ekipListesi = ekipBloklari.length
    ? ekipBloklari.map((u) => ({ name: u.baslik, title: u.metin }))
    : EKIP;
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: KURUM.ad,
    alternateName: KURUM.kisaAd,
    url: "https://bilgekontrol.com/iletisim",
    telephone: b.telefonE164,
    email: b.eposta,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: b.adres,
      addressLocality: KURUM.ilce,
      addressRegion: KURUM.il,
      addressCountry: KURUM.ulke,
    },
    geo: { "@type": "GeoCoordinates", latitude: KURUM.geo.lat, longitude: KURUM.geo.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: KURUM.calismaSaatleriSchema.acilis,
        closes: KURUM.calismaSaatleriSchema.kapanis,
      },
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      identifier: KURUM.akreditasyon,
      credentialCategory: "TÜRKAK Akreditasyonu",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "İletişim", item: "https://bilgekontrol.com/iletisim" },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>{m("iletisim_baslik")}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{m("iletisim_baslik")}</h1>
          <p className="mt-3 max-w-2xl text-onnavy">{m("iletisim_giris")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-black text-navy">{m("iletisim_bolum_baslik")}</h2>

            <dl className="mt-6 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">📍</span>
                <div>
                  <dt className="text-sm font-bold text-navy">Adres</dt>
                  <dd className="text-muted">{b.adresTekSatir}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">📞</span>
                <div>
                  <dt className="text-sm font-bold text-navy">Telefon</dt>
                  <dd>
                    <a href={`tel:${b.telefonE164}`} className="text-blue hover:underline">{b.telefon}</a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">✉️</span>
                <div>
                  <dt className="text-sm font-bold text-navy">E-posta</dt>
                  <dd>
                    <a href={`mailto:${b.eposta}`} className="text-blue hover:underline">{b.eposta}</a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">🕘</span>
                <div>
                  <dt className="text-sm font-bold text-navy">Çalışma saatleri</dt>
                  <dd className="text-muted">{b.calismaSaatleri}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-soft text-xl">🛡️</span>
                <div>
                  <dt className="text-sm font-bold text-navy">Akreditasyon</dt>
                  <dd className="text-muted">TÜRKAK {KURUM.akreditasyon} · {KURUM.standart}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 rounded-card border border-line bg-bgsoft p-6">
              <h3 className="text-lg font-bold text-navy">{m("iletisim_teklif_baslik")}</h3>
              <p className="mt-2 text-sm text-muted">{m("iletisim_teklif_yazi")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/teklif" className="btn-primary">{m("iletisim_teklif_btn1")}</Link>
                <Link href="/hesapla" className="btn-ghost">{m("iletisim_teklif_btn2")}</Link>
              </div>
            </div>

            {/* Teknik ekip listesi yalnizca kayit varsa basiliyor. */}
            {ekipListesi.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-navy">{m("iletisim_ekip_baslik")}</h3>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {ekipListesi.map((u) => (
                    <li key={u.name}>
                      <span className="font-semibold text-ink">{u.name}</span> — {u.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <HaritaGomulu
            lat={KURUM.geo.lat}
            lng={KURUM.geo.lng}
            baslik={`${KURUM.kisaAd} konum haritası`}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
