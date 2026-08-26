import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getArticleBySlug, getArticles } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/yazilar/${a.slug}` },
  };
}

export default async function YaziPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) notFound();

  const related = (await getArticles(true)).filter((x) => x.slug !== a.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    author: { "@type": "Organization", name: "Bilge Teknik Kontrol" },
    publisher: { "@type": "Organization", name: "Bilge Teknik Kontrol" },
    mainEntityOfPage: `https://bilgekontrol.com/yazilar/${a.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Bilgi Merkezi", item: "https://bilgekontrol.com/yazilar" },
      { "@type": "ListItem", position: 3, name: a.title, item: `https://bilgekontrol.com/yazilar/${a.slug}` },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article className="mx-auto max-w-[820px] px-5 py-12">
        <nav className="mb-4 text-sm text-muted">
          <Link href="/yazilar" className="hover:text-blue">Bilgi Merkezi</Link> / <span className="text-navy">{a.category}</span>
        </nav>
        <span className="chip">{a.category}</span>
        <h1 className="mt-3 text-3xl font-black text-navy md:text-4xl">{a.title}</h1>
        {a.date && <p className="mt-2 text-sm text-muted">{a.date}</p>}
        {a.lead && <p className="mt-4 text-lg text-muted">{a.lead}</p>}
        <div className="prose mt-6 max-w-none text-ink" dangerouslySetInnerHTML={{ __html: a.body }} />
        <div className="mt-10 rounded-card border border-line bg-bgsoft p-6">
          <h3 className="text-lg font-bold text-navy">Periyodik kontrolünüzü erteleyeyim mi?</h3>
          <p className="mt-2 text-sm text-muted">2 dakikada online teklif alın veya yasal sürenizi hesaplayın.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/teklif" className="rounded-full bg-blue px-6 py-3 font-bold text-white">Teklif Al</Link>
            <Link href="/hesapla" className="rounded-full border border-line px-6 py-3 font-bold text-navy">Süremi Hesapla</Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line py-12">
          <div className="mx-auto max-w-[1200px] px-5">
            <h2 className="mb-6 text-xl font-bold text-navy">İlgili Yazılar</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/yazilar/${r.slug}`} className="card p-5 transition hover:-translate-y-1">
                  <span className="chip">{r.category}</span>
                  <h3 className="mt-2 font-bold text-navy hover:text-blue">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
