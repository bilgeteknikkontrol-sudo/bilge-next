import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ALL_EKIPMAN, ARTICLES } from "@/lib/content";
import { EKIPMAN_ICERIK } from "@/lib/ekipman-icerik";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_EKIPMAN.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = ALL_EKIPMAN.find((x) => x.slug === slug);
  if (!e) return {};
  const icerik = EKIPMAN_ICERIK[e.slug];
  return {
    title: icerik ? icerik.seoTitle : e.ad,
    description: icerik ? icerik.seoDesc : `${e.ad}: ${e.standart} kapsamında, TÜRKAK akredite (AB-0296-M) muayene. Süre, kapsam ve rapor süreci.`,
    alternates: { canonical: `/ekipman/${e.slug}` },
  };
}

export default async function EkipmanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = ALL_EKIPMAN.find((x) => x.slug === slug);
  if (!e) notFound();
  const icerik = EKIPMAN_ICERIK[e.slug];

  const periyotText = e.periyot === 1 ? "Aylık çalıştırma testi (imalatçı talimatı)" : `Yılda en az 1 kez (${e.periyot} ayda bir)`;
  const related = ALL_EKIPMAN.filter((x) => x.kategori === e.kategori && x.slug !== e.slug);
  // Ayni kategorideki hub sayfasi (kategori girisi) — ic linklemenin omurgasi
  const hub = ALL_EKIPMAN.find((x) => x.kategori === e.kategori);
  // Baslik kelimeleri uzerinden konu olarak ortusen yazilar
  const konuKelimeleri = e.ad
    .toLowerCase()
    .replace(/[^a-zçğıöşü\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const ilgiliYazilar = ARTICLES.filter((a) => {
    const hay = (a.title + " " + a.description).toLowerCase();
    return konuKelimeleri.some((w) => hay.includes(w));
  }).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: e.ad,
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
      { "@type": "ListItem", position: 3, name: e.ad, item: `https://bilgekontrol.com/ekipman/${e.slug}` },
    ],
  };

  const faqLd =
    icerik && icerik.faq.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: icerik.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <section className="bg-gradient-to-br from-navy to-navy2 py-12 text-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <nav className="mb-3 text-sm text-[#c7d6f0]">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <Link href="/#hizmetler" className="hover:text-white">Hizmetler</Link> / <span>{e.kategori}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{e.ad}</h1>
          <p className="mt-2 text-[#c7d6f0]">TÜRKAK akredite (AB-0296-M) · {e.standart}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {icerik ? (
              <>
                <p className="text-lg font-medium text-ink">{icerik.lead}</p>
                <div
                  className="prose-content mt-6 leading-relaxed text-ink [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_a]:text-blue [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-line [&_th]:bg-bgsoft [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-line [&_td]:p-2"
                  dangerouslySetInnerHTML={{ __html: icerik.bodyHtml }}
                />
              </>
            ) : (
              <>
                <p className="mt-3 text-muted">{e.ad}, <b>{e.standart}</b> ve ilgili mevzuat gereği periyodik olarak muayene edilir. Üretici aksini belirtmedikçe kontrol sıklığı <b>{periyotText}</b> şeklindedir.</p>
                <p className="mt-3 text-muted">Bilge Teknik Kontrol olarak; {e.ad} ekipmanınızı yerinde, uzman mühendis kadromuzla muayene ediyor, uluslararası geçerli e-imzalı raporu İSG-KATİP uyumlu şekilde düzenliyoruz.</p>
                <h3 className="mt-7 text-xl font-bold text-navy">Genelde Neler Değerlendirilir?</h3>
                <ul className="mt-3 list-disc space-y-1 pl-6 text-muted">
                  <li>Görsel muayene ve güvenlik işaretleri</li>
                  <li>Standartlara uygun test ve deney prosedürleri</li>
                  <li>Belgelerin ve etiketlerin kontrolü</li>
                  <li>Uygunsuzluk tespiti ve raporlanması</li>
                </ul>
              </>
            )}

            {icerik && icerik.faq.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-navy">Sık Sorulan Sorular</h3>
                <div className="mt-3 space-y-2">
                  {icerik.faq.map((f, i) => (
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

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/teklif" className="rounded-full bg-blue px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">Bu Ekipman İçin Teklif Al</Link>
              <Link href="/hesapla" className="rounded-full border border-line px-6 py-3 font-bold text-navy transition hover:border-blue">Süremi Hesapla</Link>
            </div>

            {related.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-navy">İlgili Kontroller</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/ekipman/${r.slug}`} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink transition hover:border-blue hover:text-blue">
                        {r.ad}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ilgiliYazilar.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-navy">Bu Konuda Bilgi Merkezi Yazıları</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {ilgiliYazilar.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/yazilar/${a.slug}`} className="block rounded-xl border border-line p-3 text-sm font-semibold text-navy transition hover:border-blue">
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line bg-bgsoft p-6">
              <h3 className="text-lg font-bold text-navy">Künye</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">Kategori</dt>
                  <dd className="text-right font-semibold text-navy">{e.kategori}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">Dayanak</dt>
                  <dd className="text-right font-semibold text-navy">{e.standart}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Periyot</dt>
                  <dd className="text-right font-semibold text-navy">{periyotText}</dd>
                </div>
              </dl>
              {e.periyotNot && <p className="mt-3 rounded-lg bg-amber-soft p-3 text-xs text-ink">ℹ️ {e.periyotNot}</p>}
            </div>

            <div className="rounded-card border border-line bg-bgsoft p-6">
              <h3 className="text-lg font-bold text-navy">{e.kategori}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {hub && hub.slug !== e.slug && (
                  <li>
                    <Link href={`/ekipman/${hub.slug}`} className="font-semibold text-blue hover:underline">
                      ← {hub.ad}
                    </Link>
                  </li>
                )}
                {related.slice(0, 8).map((r) => (
                  <li key={r.slug}><Link href={`/ekipman/${r.slug}`} className="text-ink transition hover:text-blue">{r.ad}</Link></li>
                ))}
              </ul>
              <Link href="/ekipman" className="mt-4 block text-sm font-bold text-blue hover:underline">Tüm hizmetler →</Link>
            </div>

            <div className="rounded-card border border-line bg-white p-5 text-sm">
              📞 <b>0212 872 52 04</b><br />✉️ info@bilgeteknikkontrol.com
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
