import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BOLGELER, KURUM } from "@/lib/site-data";
import { LOCATIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hizmet Bölgelerimiz",
  description:
    "İstanbul merkezli, Türkiye genelinde periyodik teknik kontrol ve muayene hizmeti. 7 bölge, 20 şehirde yerinde akredite muayene.",
  alternates: { canonical: "/bolge" },
};

export default function BolgeIndex() {
  const toplamIl = BOLGELER.reduce((n, b) => n + b.iller.length, 0);
  // Ayri sayfasi olan sehirler icin il adi -> slug eslemesi
  const sayfaliIl = new Map(LOCATIONS.filter((l) => !l.ilce).map((l) => [l.il, l.slug]));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Hizmet Bölgelerimiz", item: "https://bilgekontrol.com/bolge" },
    ],
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Periyodik Teknik Kontrol ve Muayene",
    provider: {
      "@type": "ProfessionalService",
      name: KURUM.ad,
      telephone: KURUM.telefonE164,
      hasCredential: { "@type": "EducationalOccupationalCredential", identifier: KURUM.akreditasyon },
    },
    areaServed: BOLGELER.flatMap((b) => b.iller.map((i) => ({ "@type": "City", name: i.il }))),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>Hizmet Bölgelerimiz</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Hizmet Bölgelerimiz</h1>
          <p className="mt-3 max-w-3xl text-onnavy">
            Merkez ofisimiz {KURUM.ilce} / {KURUM.il}&apos;dadır. {BOLGELER.length} coğrafi bölgede,
            {" "}{toplamIl} şehirde yerinde periyodik kontrol hizmeti veriyoruz. Listede şehriniz
            görünmüyorsa da planlama yapabiliriz — bize sormanız yeterli.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x space-y-10">
          {BOLGELER.map((b) => (
            <div key={b.ad}>
              <h2 className="text-2xl font-black text-navy">{b.ad}</h2>
              {b.not && <p className="mt-2 max-w-3xl text-muted">{b.not}</p>}
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {b.iller.map((i) => {
                  const slug = sayfaliIl.get(i.il);
                  const govde = (
                    <>
                      <span className="block font-bold text-navy">{i.il}</span>
                      <span className="mt-1 block text-sm text-muted">{i.aciklama}</span>
                    </>
                  );
                  return (
                    <div key={i.il} className="rounded-xl border border-line bg-white p-5">
                      {slug ? (
                        <Link href={`/bolge/${slug}`} className="group block transition hover:text-blue">
                          {govde}
                          <span className="mt-2 block text-xs font-bold text-blue">Ayrıntılı sayfa →</span>
                        </Link>
                      ) : (
                        govde
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-8 text-center text-white">
            <h2 className="text-2xl font-black text-white">Şehriniz listede yok mu?</h2>
            <p className="mt-2 text-onnavy">
              Türkiye genelinde planlama yapıyoruz. Ekipman listenizi iletin, bölgenize uygun
              takvimi birlikte belirleyelim.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/teklif" className="rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5">Teklif Al →</Link>
              <Link href="/iletisim" className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10">İletişim</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
