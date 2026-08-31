import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GENEL_SSS } from "@/lib/site-data";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import { ARTICLES } from "@/lib/content";
import { metinleriOku } from "@/lib/sayfa-metin";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "Periyodik kontrol neden zorunlu, periyot nasıl belirlenir, kontrolü kim yapabilir, İSG-KATİP sözleşmesi nasıl işler? En sık sorulan soruların yanıtları.",
  alternates: { canonical: "/sss" },
};

export default async function SssPage() {
  const bilgi = await iletisimBilgi();
  const m = await metinleriOku();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GENEL_SSS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Sık Sorulan Sorular", item: "https://bilgekontrol.com/sss" },
    ],
  };

  const rehberler = ARTICLES.filter((a) => a.category === "Mevzuat" || a.category === "Rehber").slice(0, 6);

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>{m("sss_baslik")}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Sık Sorulan Sorular</h1>
          <p className="mt-3 max-w-2xl text-onnavy">{m("sss_giris")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            {GENEL_SSS.map((f, i) => (
              <details key={i} className="group rounded-xl border border-line bg-white p-5 open:border-blue" open={i === 0}>
                <summary className="cursor-pointer list-none text-lg font-bold text-navy marker:content-none">
                  <span className="mr-2 text-blue">+</span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-6 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line bg-bgsoft p-6">
              <h2 className="text-lg font-bold text-navy">Sorunuz burada yok mu?</h2>
              <p className="mt-2 text-sm text-muted">
                İşletmenize özel durumlar için doğrudan bize sorabilirsiniz.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <a href={`tel:${bilgi.telefonE164}`} className="block font-bold text-blue hover:underline">📞 {bilgi.telefon}</a>
                <a href={`mailto:${bilgi.eposta}`} className="block font-bold text-blue hover:underline">✉️ {bilgi.eposta}</a>
              </div>
              <Link href="/iletisim" className="btn-primary mt-4 w-full">İletişim Sayfası</Link>
            </div>

            <div className="rounded-card border border-line bg-white p-6">
              <h2 className="text-lg font-bold text-navy">Daha ayrıntılı rehberler</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {rehberler.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/yazilar/${a.slug}`} className="text-ink transition hover:text-blue">{a.title}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/yazilar" className="mt-4 block text-sm font-bold text-blue hover:underline">Bilgi Merkezi →</Link>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
