import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getEquipmentBySlug, getEquipment } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEquipmentBySlug(slug);
  if (!e) return {};
  return {
    title: `${e.ad} Periyodik Kontrolü`,
    description: `${e.ad} periyodik kontrolü: ${e.standart} standardında, TÜRKAK akredite (AB-0296-M) muayene. Süre, kapsam ve rapor süreci.`,
    alternates: { canonical: `/ekipman/${e.slug}` },
  };
}

export default async function EkipmanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEquipmentBySlug(slug);
  if (!e) notFound();

  const periyotText = e.periyot === 1 ? "Aylık çalıştırma testi (imalatçı talimatı)" : `Yılda en az 1 kez (${e.periyot} ayda bir)`;
  const related = (await getEquipment()).filter((x) => x.kategori === e.kategori && x.slug !== e.slug && x.aktif).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${e.ad} Periyodik Kontrolü`,
    serviceType: "Periyodik Muayene",
    category: e.kategori,
    provider: {
      "@type": "ProfessionalService",
      name: "Bilge Teknik Kontrol",
      hasCredential: { "@type": "EducationalOccupationalCredential", identifier: "AB-0296-M" },
    },
    areaServed: "TR",
    url: `https://bilgekontrol.com/ekipman/${e.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Hizmetler", item: "https://bilgekontrol.com/#hizmetler" },
      { "@type": "ListItem", position: 3, name: `${e.ad} Periyodik Kontrolü`, item: `https://bilgekontrol.com/ekipman/${e.slug}` },
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
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <Link href="/#hizmetler" className="hover:text-white">Hizmetler</Link> / <span>{e.kategori}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{e.ad} Periyodik Kontrolü</h1>
          <p className="mt-2 text-[#c7d6f0]">TÜRKAK akredite (AB-0296-M) · {e.standart}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-navy">Kontrol Kapsamı</h2>
            <p className="mt-3 text-muted">{e.ad}, <b>{e.standart}</b> ve ilgili mevzuat gereği periyodik olarak muayene edilir. Üretici aksini belirtmedikçe kontrol sıklığı <b>{periyotText}</b> şeklindedir.</p>
            <p className="mt-3 text-muted">Bilge Teknik Kontrol olarak; {e.ad} ekipmanınızı yerinde, uzman mühendis kadromuzla muayene ediyor, uluslararası geçerli e-imzalı raporu İSG-KATİP uyumlu şekilde düzenliyoruz.</p>

            <h3 className="mt-7 text-xl font-bold text-navy">Genelde Neler Değerlendirilir?</h3>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-muted">
              <li>Görsel muayene ve güvenlik işaretleri</li>
              <li>Standartlara uygun test ve deney prosedürleri</li>
              <li>Belgelerin ve etiketlerin kontrolü</li>
              <li>Uygunsuzluk tespiti ve raporlanması</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/teklif" className="rounded-full bg-blue px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">Bu Ekipman İçin Teklif Al</Link>
              <Link href="/hesapla" className="rounded-full border border-line px-6 py-3 font-bold text-navy transition hover:border-blue">Süremi Hesapla</Link>
            </div>
          </div>

          <aside className="rounded-card border border-line bg-bgsoft p-6">
            <h3 className="text-lg font-bold text-navy">{e.kategori} içindeki diğer ekipmanlar</h3>
            <ul className="mt-3 space-y-2">
              {related.length ? related.map((r) => (
                <li key={r.slug}><Link href={`/ekipman/${r.slug}`} className="text-blue hover:underline">{r.ad}</Link></li>
              )) : <li className="text-sm text-muted">Bu kategoride başka ekipman bulunmuyor.</li>}
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
