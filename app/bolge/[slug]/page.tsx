import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { LOCATIONS } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = LOCATIONS.find((x) => x.slug === slug);
  if (!l) return {};
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: `/bolge/${l.slug}` },
  };
}

export default async function BolgePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = LOCATIONS.find((x) => x.slug === slug);
  if (!l) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: l.title,
    areaServed: l.il,
    provider: {
      "@type": "ProfessionalService",
      name: "Bilge Teknik Kontrol",
      telephone: "+902128725204",
      hasCredential: { "@type": "EducationalOccupationalCredential", identifier: "AB-0296-M" },
    },
    url: `https://bilgekontrol.com/bolge/${l.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: l.title, item: `https://bilgekontrol.com/bolge/${l.slug}` },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-[#cfe0ff]">Hizmet Bölgesi</span>
          <h1 className="mt-4 text-3xl font-black md:text-4xl">{l.title}</h1>
          <p className="mt-3 max-w-2xl text-[#c7d6f0]">{l.description}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-navy">{l.ilce ? `${l.il} / ${l.ilce}` : l.il} için Periyodik Kontrol</h2>
            <p className="mt-3 text-muted">{l.intro}</p>
            <p className="mt-3 text-muted">TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu olarak; {l.il} bölgesindeki işletmelere yasal mevzuata tam uyumlu, uluslararası geçerli raporlar sunuyoruz. Tüm kontroller yerinde, uzman mühendis kadromuz tarafından gerçekleştirilir.</p>

            <h3 className="mt-8 text-xl font-bold text-navy">Sunulan Hizmetler</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {l.hizmetler.map((h) => (
                <li key={h} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink">{h}</li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/teklif" className="rounded-full bg-blue px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">Bu Bölge İçin Teklif Al</Link>
              <Link href="/hesapla" className="rounded-full border border-line px-6 py-3 font-bold text-navy transition hover:border-blue">Süremi Hesapla</Link>
            </div>
          </div>

          <aside className="rounded-card border border-line bg-bgsoft p-6">
            <h3 className="text-lg font-bold text-navy">Diğer Bölgeler</h3>
            <ul className="mt-3 space-y-2">
              {LOCATIONS.filter((x) => x.slug !== l.slug).map((x) => (
                <li key={x.slug}>
                  <Link href={`/bolge/${x.slug}`} className="text-blue hover:underline">{x.title}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-white p-4 text-sm">
              📞 <b>0212 872 52 04</b><br />
              ✉️ info@bilgeteknikkontrol.com
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
