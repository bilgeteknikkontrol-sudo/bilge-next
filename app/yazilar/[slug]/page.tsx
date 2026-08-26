import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ARTICLES } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: `/yazilar/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.description, publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

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

  const faqLd =
    a.faq && a.faq.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: a.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <article className="py-12">
        <div className="mx-auto max-w-[760px] px-5">
          <nav className="mb-4 text-sm text-muted">
            <Link href="/" className="hover:text-blue">Ana Sayfa</Link> / <Link href="/yazilar" className="hover:text-blue">Bilgi Merkezi</Link> / <span className="text-navy">{a.category}</span>
          </nav>
          <span className="text-sm font-bold text-blue">{a.category}</span>
          <h1 className="mt-2 text-3xl font-black text-navy md:text-4xl">{a.title}</h1>
          <div className="mt-2 text-sm text-muted">{new Date(a.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })} · {a.readMin} dk okuma</div>
          {a.lead && <p className="mt-4 text-lg font-medium text-ink">{a.lead}</p>}

          <div className="mt-6 leading-relaxed text-ink [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:bg-bgsoft [&_blockquote]:p-4 [&_blockquote]:rounded-r-lg [&_a]:text-blue [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-line [&_th]:bg-bgsoft [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-line [&_td]:p-2" dangerouslySetInnerHTML={{ __html: a.body }} />

          {a.faq && a.faq.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-navy">Sık Sorulan Sorular</h3>
              <div className="mt-3 space-y-2">
                {a.faq.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-line bg-white p-4 open:border-blue">
                    <summary className="cursor-pointer list-none font-semibold text-navy marker:content-none">
                      <span className="mr-2 text-blue">+</span>{f.q}
                    </summary>
                    <p className="mt-2 pl-5 text-sm text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-card bg-gradient-to-br from-navy to-navy2 p-6 text-center text-white">
            <h3 className="text-white">Hemen harekete geçin</h3>
            <p className="text-[#c7d6f0]">EKİPNET numaralı akredite rapor için <Link href="/teklif" className="font-bold text-accent underline">online teklif alın</Link> veya <Link href="/hesapla" className="font-bold text-accent underline">sürenizi hesaplayın</Link>.</p>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-navy">İlgili İçerikler</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/yazilar/${r.slug}`} className="rounded-xl border border-line p-3 text-sm font-semibold text-navy hover:border-blue">
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
