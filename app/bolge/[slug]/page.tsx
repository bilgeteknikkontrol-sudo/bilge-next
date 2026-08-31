import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getLocationBySlug, getLocations, getEquipment } from "@/lib/cms";
import { BOLGE_ICERIK } from "@/lib/bolge-icerik";
import { metinleriOku } from "@/lib/sayfa-metin";
import { metniHtml } from "@/lib/metin-bicim";
import { BOLGE_EKIPMAN, VARSAYILAN_BOLGE_EKIPMAN, hizmetBasligi } from "@/lib/icerik-baglari";

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

/**
 * Sayfanin kendi adi: ilce varsa ILCE, yoksa il.
 *
 * ⚠️ Onceden her yerde `l.il` yaziliyordu ve `ilce` alani hic kullanilmiyordu.
 * Sonuc: Beylikduzu sayfasi kendini bastan asagi "Istanbul" diye tanitiyordu —
 * baslik, H1, breadcrumb, JSON-LD, buton metni. `/bolge/istanbul` ile
 * `/bolge/beylikduzu` AYNI title'a sahipti (144 sayfa icindeki tek kopya
 * basliktil). Google icin bu iki sayfa birbirinin kopyasi gorunuyordu ve
 * "Beylikduzu periyodik kontrol" aramasinda sayfanin hicbir sinyali yoktu.
 */
function bolgeAdi(l: { il: string; ilce?: string }): string {
  return l.ilce || l.il;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getLocationBySlug(slug);
  if (!l) return {};
  const ad = bolgeAdi(l);
  return {
    title: `${ad} Periyodik Kontrol Hizmeti`,
    description: `${ad} bölgesinde periyodik teknik kontrol, muayene ve TÜRKAK akredite rapor hizmeti. ${l.description}`,
    alternates: { canonical: `/bolge/${l.slug}` },
  };
}

export default async function BolgePage({ params }: { params: Promise<{ slug: string }> }) {
  /* ⚠️ Bu sablon 12 bolge sayfasinda birden kullaniliyor; metinler panelde
     "Bölge alt sayfaları" grubundan tek yerden yonetiliyor. */
  const m = await metinleriOku();
  const { slug } = await params;
  const l = await getLocationBySlug(slug);
  if (!l) notFound();

  const diger = (await getLocations()).filter((x) => x.slug !== l.slug).slice(0, 6);
  const ad = bolgeAdi(l);
  /**
   * Bolgeye ozgu zengin icerik. Yoksa sayfa eski (kisa) haliyle calismaya
   * devam eder — panelden yeni bir bolge eklendiginde sayfa kirilmasin.
   */
  const zengin = BOLGE_ICERIK[l.slug];

  /**
   * BOLGEDE ONE CIKAN HIZMETLER — bkz. lib/icerik-baglari.ts
   *
   * ⚠️ Bu sayfada daha once TEK BIR hizmet linki bile yoktu: "Hizmet
   * Verdigimiz Alanlar" altindakiler tiklanamayan etiketlerdi. Oysa sitenin
   * en degerli sorgu tipi hizmet+sehir birlesimi ("forklift periyodik kontrol
   * Istanbul"); iki sayfa grubunu birbirine baglamadan o sorgulara girmek
   * mumkun degil.
   *
   * Siralama BOLGE_EKIPMAN'daki oncelige gore; alfabetik degil, cunku listeyi
   * sehrin sanayi profili belirliyor (Kocaeli agir sanayi, Bursa uretim...).
   */
  const oncelik = BOLGE_EKIPMAN[l.slug] ?? VARSAYILAN_BOLGE_EKIPMAN;
  const tumEkipman = await getEquipment().catch(() => []);
  const oneCikan = oncelik
    .map((s) => tumEkipman.find((e) => e.slug === s && e.aktif))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${ad} Periyodik Kontrol Hizmeti`,
    // Ilce sayfalarinda hizmet alani ilcedir; ili de belirtmek arama motoruna
    // "bu ilce su ilin icinde" bilgisini verir.
    areaServed: l.ilce ? { "@type": "Place", name: l.ilce, containedInPlace: { "@type": "City", name: l.il } } : l.il,
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
      { "@type": "ListItem", position: 3, name: ad, item: `https://bilgekontrol.com/bolge/${l.slug}` },
    ],
  };

  /**
   * FAQPage schema — yalnizca sayfada GORUNEN sorularla birebir ayni.
   * Google, yapisal veride gecen sorunun sayfada da gorunur olmasini sart
   * kosuyor; gorunmeyen soru eklemek yaptirim sebebi.
   */
  const faqLd = zengin?.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: zengin.faq.map((f) => ({
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
      <section className="bg-gradient-to-br from-navy to-navy2 py-12 text-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <Link href="/bolge" className="hover:text-white">Hizmet Bölgeleri</Link> / <span>{ad}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{ad} Periyodik Kontrol Hizmeti</h1>
          <p className="mt-2 text-onnavy">{m("bolgeAlt_rozet")}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-muted">{zengin?.lead || l.intro || l.description}</p>
            {!zengin && (
              <p className="mt-3 text-muted">
                {ad} ve çevresinde; iş ekipmanlarınız için yerinde periyodik kontrol ve akredite
                rapor hizmeti sunuyoruz.
              </p>
            )}

            <h2 className="mt-7 text-xl font-bold text-navy">{m("bolgeAlt_alan_baslik")}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {l.hizmetler.map((h: string) => (
                <span key={h} className="rounded-full bg-blue-soft px-3 py-1 text-sm font-semibold text-blue">{h}</span>
              ))}
            </div>

            {/* Bolge -> hizmet baglantilari; sayfanin en degerli kismi. */}
            {oneCikan.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-navy">
                  {ad} bölgesinde en çok talep edilen periyodik kontroller
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {oneCikan.map((e) => (
                    <li key={e.slug}>
                      <Link
                        href={`/ekipman/${e.slug}`}
                        className="block rounded-xl border border-line bg-white px-4 py-3 transition hover:border-blue"
                      >
                        <span className="font-semibold text-navy">{hizmetBasligi(e.ad)}</span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {e.standart} · {e.periyot === 1 ? "aylık" : `${e.periyot} ayda bir`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/ekipman" className="mt-3 inline-block text-sm font-bold text-blue hover:underline">
                  {ad} için tüm kontrol hizmetleri →
                </Link>
              </section>
            )}

            <h2 className="mt-7 text-xl font-bold text-navy">{m("bolgeAlt_neden_baslik")}</h2>
            <div
              className="prose mt-3 max-w-none"
              dangerouslySetInnerHTML={{ __html: metniHtml(m("bolgeAlt_neden_liste")) }}
            />

            {/* Bolgeye ozgu govde: her sehir icin farkli yazildi. Sekiz sayfaya
                ayni paragrafi kopyalamak ince icerigi yinelenen icerige cevirirdi. */}
            {zengin && (
              <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: zengin.bodyHtml }} />
            )}

            {zengin && zengin.faq.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-navy">
                  {ad} için sık sorulan sorular
                </h2>
                <div className="mt-3 space-y-2">
                  {zengin.faq.map((f) => (
                    <details
                      key={f.q}
                      className="group rounded-xl border border-line bg-white px-4 py-3"
                    >
                      <summary className="cursor-pointer list-none font-semibold text-navy">
                        {f.q}
                        <span className="float-right text-blue transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/teklif" className="rounded-full bg-blue px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">{ad} {m("bolgeAlt_btn1")}</Link>
              <Link href="/bolge" className="rounded-full border border-line px-6 py-3 font-bold text-navy transition hover:border-blue">{m("bolgeAlt_btn2")}</Link>
            </div>
          </div>

          <aside className="rounded-card border border-line bg-bgsoft p-6">
            <h3 className="text-lg font-bold text-navy">{m("bolgeAlt_diger_baslik")}</h3>
            <ul className="mt-3 space-y-2">
              {diger.length ? diger.map((d) => (
                <li key={d.slug}><Link href={`/bolge/${d.slug}`} className="text-blue hover:underline">{bolgeAdi(d)}</Link></li>
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
