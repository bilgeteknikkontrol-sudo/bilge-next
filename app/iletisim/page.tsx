import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HaritaGomulu from "../components/HaritaGomulu";
import { KURUM, ADRES_TEK_SATIR, EKIP } from "@/lib/site-data";
import { metinleriOku } from "@/lib/sayfa-metin";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${KURUM.kisaAd} iletişim: ${ADRES_TEK_SATIR}. Telefon ${KURUM.telefon}, e-posta ${KURUM.eposta}. TÜRKAK akredite (${KURUM.akreditasyon}) muayene kuruluşu.`,
  alternates: { canonical: "/iletisim" },
};

export default async function IletisimPage() {
  const m = await metinleriOku();
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: KURUM.ad,
    alternateName: KURUM.kisaAd,
    url: "https://bilgekontrol.com/iletisim",
    telephone: KURUM.telefonE164,
    email: KURUM.eposta,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: KURUM.adres,
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
          <h1 className="text-3xl font-black md:text-4xl">İletişim</h1>
          <p className="mt-3 max-w-2xl text-onnavy">{m("iletisim_giris")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-black text-navy">Bize ulaşın</h2>

            <dl className="mt-6 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">📍</span>
                <div>
                  <dt className="text-sm font-bold text-navy">Adres</dt>
                  <dd className="text-muted">{ADRES_TEK_SATIR}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">📞</span>
                <div>
                  <dt className="text-sm font-bold text-navy">Telefon</dt>
                  <dd>
                    <a href={`tel:${KURUM.telefonE164}`} className="text-blue hover:underline">{KURUM.telefon}</a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">✉️</span>
                <div>
                  <dt className="text-sm font-bold text-navy">E-posta</dt>
                  <dd>
                    <a href={`mailto:${KURUM.eposta}`} className="text-blue hover:underline">{KURUM.eposta}</a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-xl">🕘</span>
                <div>
                  <dt className="text-sm font-bold text-navy">Çalışma saatleri</dt>
                  <dd className="text-muted">{KURUM.calismaSaatleri}</dd>
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
              <h3 className="text-lg font-bold text-navy">Teklif mi almak istiyorsunuz?</h3>
              <p className="mt-2 text-sm text-muted">
                Ekipmanlarınızı seçip online form üzerinden ilettiğinizde, kapsam ve fiyat için
                size dönüş yapıyoruz.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/teklif" className="btn-primary">Online Teklif Al →</Link>
                <Link href="/hesapla" className="btn-ghost">Süremi Hesapla</Link>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-navy">Teknik ekip</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {EKIP.map((u) => (
                  <li key={u.name}>
                    <span className="font-semibold text-ink">{u.name}</span> — {u.title}
                  </li>
                ))}
              </ul>
            </div>
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
