import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import YaziGorseli from "../../components/YaziGorseli";
import { getArticleBySlug, getArticles, getEquipment } from "@/lib/cms";
import { seoBaslik } from "@/lib/seo-baslik";
import { YAZI_EKIPMAN, hizmetBasligi } from "@/lib/icerik-baglari";

/**
 * Sayfa onbellekleniyor (ISR).
 *
 * ⚠️ Onceden `force-dynamic` idi: HER ziyarette sayfa sifirdan uretiliyor,
 * hicbir sey onbelleklenmiyordu. Turkiye den olculen ilk bayt suresi
 * 285-750 ms idi; bunun ~220 ms si zaten ag, gerisi her istekte tekrar
 * yapilan uretim ve CMS okumasiydi. Sayfa hizi Google icin bir siralama
 * faktoru oldugundan bu dogrudan SEO kaybiydi.
 *
 * Bayatlik riski yok: paneldeki her kaydetme eylemi revalidatePath cagirip
 * ilgili sayfalari aninda tazeliyor (bkz. app/admin/actions.ts). Sure yalnizca
 * hicbir degisiklik olmadiginda ust sinir olarak devrede.
 */
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return {};
  return {
    // Arama sonucu basligi: `seoTitle` doluysa o, degilse H1. Marka eki
    // yalnizca 60 karaktere sigdiginda ekleniyor — bkz. lib/seo-baslik.ts
    title: seoBaslik(a.seoTitle?.trim() || a.title),
    description: a.description,
    alternates: { canonical: `/yazilar/${a.slug}` },
  };
}

export default async function YaziPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) notFound();

  const related = (await getArticles(true)).filter((x) => x.slug !== a.slug).slice(0, 3);

  /**
   * YAZI -> HIZMET SAYFASI — bkz. lib/icerik-baglari.ts
   *
   * ⚠️ Bazi yazilar hizmet sayfasiyla AYNI aramaya giriyordu:
   * `/yazilar/forklift-periyodik-kontrolu` ile `/ekipman/forklift` neredeyse
   * ayni baslikta. Google hangisinin hedef sayfa oldugunu bilemedigi icin
   * ikisi de zayifliyordu (yamyamlasma). Yaziyi silmek yerine ROLLERI
   * ayirmak dogru: yazi bilgilendirir ve okuyucuyu belirgin sekilde hizmet
   * sayfasina gonderir.
   */
  const hizmetSluglari = YAZI_EKIPMAN[a.slug] ?? [];
  const hizmetler = hizmetSluglari.length
    ? (await getEquipment().catch(() => []))
        .filter((e) => hizmetSluglari.includes(e.slug) && e.aktif)
        // Siralama tabloda yazildigi gibi kalsin: ilk sirada yazinin asil konusu var.
        .sort((x, y) => hizmetSluglari.indexOf(x.slug) - hizmetSluglari.indexOf(y.slug))
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    // ⚠️ Yoktu. Google, tarihi olmayan rehber icerigi "ne zaman yazildigi
    // belirsiz" sayiyor; guncellik bu konuda (mevzuat degisiyor) siralama
    // sinyali. Yazinin kendi tarihi tek kaynak.
    dateModified: a.date,
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

  /**
   * ⚠️ SSS'ler VERIDE VARDI AMA SAYFADA HIC BASILMIYORDU.
   *
   * 30 yazinin tamaminda `faq` alani dolu; sablon bu alani hic kullanmiyordu.
   * Yani hem okuyucu icin hazir cevaplar hem de 30 sayfalik FAQPage zengin
   * sonuc firsati bosa gidiyordu. 2026-08-30 denetiminde fark edildi.
   *
   * Schema, sayfada GORUNEN sorularla birebir ayni olmak zorunda; Google
   * gorunmeyen soruyu yaptirim sebebi sayiyor. Bu yuzden ayni dizi hem
   * akordiyonu hem JSON-LD'yi besliyor.
   */
  const sss = a.faq ?? [];
  const faqLd = sss.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: sss.map((f) => ({
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
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <article className="mx-auto max-w-[820px] px-5 py-12">
        <nav className="mb-4 text-sm text-muted">
          <Link href="/yazilar" className="hover:text-blue">Bilgi Merkezi</Link> / <span className="text-navy">{a.category}</span>
        </nav>
        <span className="chip">{a.category}</span>
        <h1 className="mt-3 text-3xl font-black text-navy md:text-4xl">{a.title}</h1>
        {a.date && <p className="mt-2 text-sm text-muted">{a.date}</p>}
        {a.lead && <p className="mt-4 text-lg text-muted">{a.lead}</p>}
        <YaziGorseli slug={a.slug} cmsImage={a.image} bicim="makale" oncelikli />
        <div className="prose mt-6 max-w-none text-ink" dangerouslySetInnerHTML={{ __html: a.body }} />

        {sss.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy">Sık sorulan sorular</h2>
            <div className="mt-3 space-y-2">
              {sss.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-line bg-white px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-semibold text-navy">
                    {f.q}
                    <span className="float-right text-blue transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/*
          Yazinin anlattigi konunun HIZMET sayfasi. Okuyucu icin dogal bir
          sonraki adim; arama motoru icin de "ticari hedef sayfa bu" sinyali.
        */}
        {hizmetler.length > 0 && (
          <section className="mt-10 rounded-card border border-blue/30 bg-blue-soft/40 p-6">
            <h2 className="text-lg font-bold text-navy">
              Bu kontrolü sizin için yapalım
            </h2>
            <p className="mt-1 text-sm text-muted">
              TÜRKAK akredite (AB-0296-M) muayene kuruluşu olarak yerinde muayene ve
              İSG-KATİP uyumlu e-imzalı rapor:
            </p>
            <ul className="mt-3 space-y-2">
              {hizmetler.map((h) => (
                <li key={h.slug}>
                  <Link
                    href={`/ekipman/${h.slug}`}
                    className="font-bold text-blue hover:underline"
                  >
                    {hizmetBasligi(h.ad)} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
