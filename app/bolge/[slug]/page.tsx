import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getLocationBySlug, getLocations } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getLocationBySlug(slug);
  if (!l) return {};
  return {
    title: `${l.il} Periyodik Kontrol Hizmeti`,
    description: `${l.il} bölgesinde periyodik teknik kontrol, muayene ve TÜRKAK akredite rapor hizmeti. ${l.description}`,
    alternates: { canonical: `/bolge/${l.slug}` },
  };
}

export default async function BolgePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await getLocationBySlug(slug);
  if (!l) notFound();

  const diger = (await getLocations()).filter((x) => x.slug !== l.slug).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${l.il} Periyodik Kontrol Hizmeti`,
    areaServed: l.il,
    provider: {
      "@type": "ProfessionalService",
      name: "Bilge Teknik Kontrol",
      hasCredential: { "@type": "EducationalOccupationalCredential", identifier: "AB-0296-M" },
    },
    url: `https://bilgekontrol.com/bolge/${l.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Hizmet Bölgeleri", item: "https://bilgekontrol.com/bolge" },
      { "@type": "ListItem", position: 3, name: l.il, item: `https://bilgekontrol.com/bolge/${l.slug}` },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="bg-gradient-to-br from-navy to-navy2 py-12 text-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <nav className="mb-3 text-sm text-[#c7d6f0]">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <Link href="/bolge" className="hover:text-white">Hizmet Bölgeleri</Link> / <span>{l.il}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{l.il} Periyodik Kontrol Hizmeti</h1>
          <p className="mt-2 text-[#c7d6f0]">TÜRKAK akredite (AB-0296-M)</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-muted">{l.intro || l.description}</p>
            <p className="mt-3 text-muted">{l.il} ve çevresinde; iş ekipmanlarınız için yerinde periyodik kontrol ve akredite rapor hizmeti sunuyoruz.</p>

            <h2 className="mt-7 text-xl font-bold text-navy">Hizmet Verdiğimiz Alanlar</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {l.hizmetler.map((h: string) => (
                <span key={h} className="rounded-full bg-blue-soft px-3 py-1 text-sm font-semibold text-blue">{h}</span>
              ))}
            </div>

            <h2 className="mt-7 text-xl font-bold text-navy">Neden Bölgenizde Bilge?</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-muted">
              <li>Yakın bölge ekipleriyle hızlı randevu</li>
              <li>Sanayi ve üretim tesislerine özel planlama</li>
              <li>İSG-KATİP uyumlu, e-imzalı raporlar</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/teklif" className="rounded-full bg-blue px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">{l.il} için Teklif Al</Link>
              <Link href="/bolge" className="rounded-full border border-line px-6 py-3 font-bold text-navy transition hover:border-blue">Diğer Bölgeler</Link>
            </div>
          </div>

          <aside className="rounded-card border border-line bg-bgsoft p-6">
            <h3 className="text-lg font-bold text-navy">Diğer hizmet bölgeleri</h3>
            <ul className="mt-3 space-y-2">
              {diger.length ? diger.map((d) => (
                <li key={d.slug}><Link href={`/bolge/${d.slug}`} className="text-blue hover:underline">{d.il}</Link></li>
              )) : <li className="text-sm text-muted">Başka bölge bulunmuyor.</li>}
            </ul>
            <div className="mt-5 rounded-xl bg-white p-4 text-sm">
              📞 <b>0212 872 52 04</b><br />✉️ info@bilgeteknikkontrol.com
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
