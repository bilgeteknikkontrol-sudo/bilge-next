import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getEquipmentBySlug, getEquipment, getLocations, getArticles } from "@/lib/cms";
import {
  EKIPMAN_YAZI,
  ELEKTRIK_RAPOR_FORMATI_SLUGLARI,
  esAnlamliAdlar,
  hizmetBasligi,
  sadeAd,
} from "@/lib/icerik-baglari";
// Ekipmana ozel uzun icerik ve gorseller CMS'te tutulmuyor; slug uzerinden
// statik kaynaklardan geliyor. Panelden eklenen yeni bir ekipmanin slug'i
// bu kaynaklarda yoksa sayfa genel metinle calismaya devam eder.
import { EKIPMAN_ICERIK } from "@/lib/ekipman-icerik";
import { EKIPMAN_GORSEL, EKIPMAN_FOTO } from "@/lib/images";
import { KURUM } from "@/lib/site-data";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import { metinleriOku } from "@/lib/sayfa-metin";
import { metniHtml, yerlestir } from "@/lib/metin-bicim";
import { seoBaslik, seoAciklama } from "@/lib/seo-baslik";

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
  const e = await getEquipmentBySlug(slug);
  if (!e) return {};
  const icerik = EKIPMAN_ICERIK[slug];
  return {
    // seoBaslik/seoAciklama sarmalayicilari ONLEYICI: 2026-09-01 taramasinda
    // 92 hizmet sayfasinin HICBIRI siniri asmiyordu (en uzun baslik 60).
    // Ama baslik da aciklama da SABLONDAN uretiliyor ve ekipman adini panelden
    // yazan kisi uzunlugu goremiyor — uzunca bir ad girildigi anda sinir
    // sessizce asilir. Sarmalayici o riski kapatiyor. bkz. lib/seo-baslik.ts
    // Panelde ayni denetim: /admin/seo
    title: seoBaslik(icerik?.seoTitle || hizmetBasligi(e.ad)),
    description: seoAciklama(
      icerik?.seoDesc ||
        `${sadeAd(e.ad)} periyodik kontrolü ${e.standart} kapsamında TÜRKAK akredite (${KURUM.akreditasyon}) muayene kuruluşu tarafından yapılır.`,
    ),
    alternates: { canonical: `/ekipman/${e.slug}` },
  };
}

export default async function EkipmanPage({ params }: { params: Promise<{ slug: string }> }) {
  /* ⚠️ Bu sablon 92 sayfada birden kullaniliyor: buradaki metinler panelde
     "Hizmet alt sayfaları" grubunda tek yerden yonetiliyor. */
  const m = await metinleriOku();
  const bilgi = await iletisimBilgi();
  const { slug } = await params;
  const e = await getEquipmentBySlug(slug);
  if (!e) notFound();

  /**
   * Sayfa metni: PANELDEN gelen doluysa o, degilse koddaki varsayilan.
   *
   * ⚠️ Onceden yalnizca koddaki `EKIPMAN_ICERIK` vardi. Hizmet sayfasinda
   * sayfa dolusu metin goruluyordu ama panelde bunlari duzenleyecek hicbir
   * alan yoktu; degistirmenin tek yolu kod dagitimiydi.
   *
   * Alanlar TEK TEK karsilastiriliyor: kullanici yalnizca girisi degistirmis
   * olabilir, o zaman govde ve SSS koddaki haliyle kalmali.
   */
  const kodIcerik = EKIPMAN_ICERIK[slug];
  const panelDolu = Boolean(e.lead?.trim() || e.body?.trim() || e.faq?.length);
  const icerik =
    kodIcerik || panelDolu
      ? {
          lead: e.lead?.trim() || kodIcerik?.lead || "",
          bodyHtml: e.body?.trim() || kodIcerik?.bodyHtml || "",
          faq: (e.faq?.length ? e.faq : kodIcerik?.faq) ?? [],
        }
      : undefined;
  const gorsel = EKIPMAN_GORSEL[slug];
  const foto = EKIPMAN_FOTO[slug];

  /**
   * Panelden yuklenen hizmet gorseli. Varsa koddaki varsayilanin yerine gecer.
   *
   * ⚠️ `next/image` yerine duz `<img>`: panelden gelen adres bir dize
   * (`/api/gorsel/3` veya harici https). `placeholder="blur"` statik import
   * gerektiriyor, harici adres icin de `remotePatterns` yapilandirmasi
   * gerekirdi. Duz etiket her adresle calisir; yukleme boyutu zaten panelde
   * 6 MB ile sinirli.
   */
  const cmsGorsel = e.image?.trim() || null;

  const periyotText =
    e.periyot === 1 ? "Aylık çalıştırma testi (imalatçı talimatı)" : `Yılda en az 1 kez (${e.periyot} ayda bir)`;
  const related = (await getEquipment())
    .filter((x) => x.kategori === e.kategori && x.slug !== e.slug && x.aktif)
    .slice(0, 6);

  /**
   * IC BAGLANTI AGI — bkz. lib/icerik-baglari.ts
   *
   * ⚠️ Bu sayfa daha once YALNIZCA ayni kategorideki ekipmanlara link
   * veriyordu. Bir bolge sayfasina ya da konuyu anlatan rehber yaziya hicbir
   * gecis yoktu; siteyi olusturan uc sayfa grubu birbirinden kopuktu.
   */
  const bolgeler = (await getLocations().catch(() => [])).filter((b) => b.aktif);
  const yaziSluglari = EKIPMAN_YAZI[slug] ?? [];
  // ⚠️ Ust sinir: tablo buyudukce bu kutu sinirsiz uzuyordu. Hizmet sayfasinin
  // isi satis; rehber listesi sayfayi bastirmamali. Siralama tablodaki gibi
  // kalsin (ilk sirada ekipmanin kendi konusu var), fazlasi kirpilsin.
  const ilgiliYazilar = yaziSluglari.length
    ? (await getArticles(true).catch(() => []))
        .filter((a) => yaziSluglari.includes(a.slug))
        .sort((x, y) => yaziSluglari.indexOf(x.slug) - yaziSluglari.indexOf(y.slug))
        .slice(0, 5)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: hizmetBasligi(e.ad),
    // Sahada ve aramalarda kullanilan es anlamli adlar. Ayri kopya sayfa
    // acmadan ayni sorgulari karsilamanin dogru yolu — bkz. icerik-baglari.ts
    alternateName: esAnlamliAdlar(e.ad),
    serviceType: "Periyodik Muayene",
    category: e.kategori,
    // seoDesc yalnizca kod icerigin de var; panelden gelen metin bu alani
    // tasimadigi icin dogrudan koddaki kaynaktan okunuyor.
    description: kodIcerik?.seoDesc || undefined,
    provider: {
      "@type": "ProfessionalService",
      name: KURUM.ad,
      telephone: KURUM.telefonE164,
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        identifier: KURUM.akreditasyon,
      },
    },
    /**
     * ⚠️ Onceden yalnizca "TR" yaziyordu. Sitenin en degerli sorgu tipi
     * hizmet+sehir birlesimi ("forklift periyodik kontrol Istanbul"); arama
     * motoruna bu hizmetin hangi yerlerde verildigini soylemeden o sorgulara
     * girmek zor. Liste CMS'ten geliyor, sabit degil: panelden bir bolge
     * eklenince buraya da kendiliginden yansir.
     */
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      // ⚠️ "Türkiye geneli" kaydi disarida: ustteki Country girdisi onu zaten
      // karsiliyor, City olarak yazilirsa "Türkiye adinda bir sehir" demis olurduk.
      ...bolgeler
        .filter((b) => b.il !== "Türkiye")
        .map((b) =>
        b.ilce
          ? {
              "@type": "Place",
              name: b.ilce,
              containedInPlace: { "@type": "City", name: b.il },
            }
          : { "@type": "City", name: b.il },
      ),
    ],
    url: `https://bilgekontrol.com/ekipman/${e.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Hizmetlerimiz", item: "https://bilgekontrol.com/ekipman" },
      { "@type": "ListItem", position: 3, name: hizmetBasligi(e.ad), item: `https://bilgekontrol.com/ekipman/${e.slug}` },
    ],
  };

  // FAQPage yalnizca sayfada GORUNEN sorular icin uretilir (Google sarti).
  const faqLd = icerik?.faq?.length
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

      {/* KAHRAMAN */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {(cmsGorsel || gorsel) && (
          <>
            {cmsGorsel ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cmsGorsel} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
            ) : (
              <Image src={gorsel} alt="" aria-hidden fill priority sizes="100vw" className="object-cover opacity-25" placeholder="blur" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/60" />
          </>
        )}
        <div className="container-x relative py-14">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>{" "}/{" "}
            <Link href="/ekipman" className="hover:text-white">{m("hizmet_yol_adi")}</Link>{" "}/{" "}
            <span>{e.kategori}</span>
          </nav>
          {/*
            ⚠️ Burada "{e.ad} Periyodik Kontrolü" yaziyordu ve 92 sayfanin
            63'unde baslik "Forklift Periyodik Kontrolü Periyodik Kontrolü"
            diye cift cikiyordu — bkz. hizmetBasligi().
          */}
          <h1 className="max-w-3xl text-3xl font-black leading-tight md:text-4xl">{hizmetBasligi(e.ad)}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-onnavy">
            <span>🛡️ TÜRKAK akredite · {KURUM.akreditasyon}</span>
            <span>📋 {e.standart}</span>
            <span>🗓️ {periyotText}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1.55fr_1fr]">
          <div>
            {icerik ? (
              <>
                <p className="text-lg font-medium leading-relaxed text-ink">{icerik.lead}</p>

                {(cmsGorsel || gorsel) && (
                  <figure className="mt-7">
                    {cmsGorsel ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cmsGorsel}
                        alt={`${e.ad} — yerinde periyodik muayene`}
                        className="h-auto w-full rounded-card border border-line object-cover"
                      />
                    ) : (
                      <Image
                        src={gorsel}
                        alt={`${e.ad} — yerinde periyodik muayene`}
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className="h-auto w-full rounded-card border border-line object-cover"
                        placeholder="blur"
                      />
                    )}
                    <figcaption className="mt-2 text-xs text-muted">
                      {e.ad} · TÜRKAK akredite ({KURUM.akreditasyon}) muayene kapsamında
                    </figcaption>
                  </figure>
                )}

                <div
                  className="ekipman-govde mt-8"
                  dangerouslySetInnerHTML={{ __html: icerik.bodyHtml }}
                />

                {icerik.faq?.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-black text-navy">{m("hizmet_sss_baslik")}</h2>
                    <div className="mt-4 space-y-3">
                      {icerik.faq.map((f, i) => (
                        <details key={i} className="group rounded-xl border border-line bg-white p-5 open:border-blue" open={i === 0}>
                          <summary className="cursor-pointer list-none font-bold text-navy marker:content-none">
                            <span className="mr-2 text-blue">+</span>
                            {f.q}
                          </summary>
                          <p className="mt-3 pl-6 leading-relaxed text-muted">{f.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Panelden eklenmis, ozel icerigi henuz yazilmamis ekipmanlar */
              <>
                <h2 className="text-2xl font-black text-navy">{m("hizmet_kapsam_baslik")}</h2>
                {/* Yer tutucular ({ad}, {standart}, {periyot}) panelde yazilan
                    cumlenin icinde duruyor; deger burada yerlestiriliyor. */}
                <div
                  className="prose mt-3 max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      metniHtml(
                        yerlestir(m("hizmet_kapsam_p1"), {
                          ad: e.ad,
                          standart: e.standart,
                          periyot: periyotText,
                          kategori: e.kategori,
                        })
                      ) +
                      metniHtml(
                        yerlestir(m("hizmet_kapsam_p2"), {
                          ad: e.ad,
                          standart: e.standart,
                          periyot: periyotText,
                          kategori: e.kategori,
                        })
                      ),
                  }}
                />
                <h3 className="mt-7 text-xl font-bold text-navy">{m("hizmet_liste_baslik")}</h3>
                <div
                  className="prose mt-3 max-w-none"
                  dangerouslySetInnerHTML={{ __html: metniHtml(m("hizmet_liste")) }}
                />
              </>
            )}

            {/*
              ZORUNLU RAPOR FORMATI NOTU — bkz. lib/icerik-baglari.ts

              Yalnizca Bakanligin duyurusunda sayilan elektrik grubu
              kontrollerinde gorunur. Teklif dugmelerinin hemen ustunde
              duruyor: karar anindan once okunmasi gereken bilgi bu.
            */}
            {ELEKTRIK_RAPOR_FORMATI_SLUGLARI.includes(slug) && (
              <p className="mt-10 rounded-card border border-accent/40 bg-white p-5 text-sm leading-relaxed text-muted">
                <strong className="text-navy">Raporunuz zorunlu formatta düzenlenir.</strong>{" "}
                Elektrik grubu iş ekipmanlarında, Çalışma ve Sosyal Güvenlik Bakanlığı onaylı
                standart periyodik kontrol rapor formatının kullanılması 1 Eylül 2025&apos;ten
                beri zorunludur. Raporlarımızı bu formatta düzenliyoruz.{" "}
                <Link
                  href="/yazilar/elektrik-periyodik-kontrol-rapor-formati"
                  className="font-semibold text-blue hover:underline"
                >
                  Formatın kapsamı ve ne değiştiği
                </Link>
                .
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/teklif" className="btn-primary">{m("hizmet_btn1")}</Link>
              <Link href="/hesapla" className="btn-ghost">{m("hizmet_btn2")}</Link>
            </div>

            {/*
              ILGILI REHBER YAZILAR — bkz. lib/icerik-baglari.ts

              ⚠️ Bazi yazilarin basligi bu sayfayla neredeyse ayniydi
              (`/yazilar/forklift-periyodik-kontrolu` ile `/ekipman/forklift`
              ikisi de "Forklift Periyodik Kontrolu"). Google hangisini
              gosterecegini bilemedigi icin ikisi birden zayifliyordu. Burada
              rollerin ayrildigi acikca yaziliyor: derinlemesine anlatim
              yazida, hizmet bu sayfada.
            */}
            {ilgiliYazilar.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-black text-navy">{m("hizmet_rehber_baslik")}</h2>
                <ul className="mt-4 space-y-3">
                  {ilgiliYazilar.map((y) => (
                    <li key={y.slug} className="rounded-xl border border-line bg-white p-4">
                      <Link href={`/yazilar/${y.slug}`} className="font-bold text-navy hover:text-blue">
                        {y.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{y.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/*
              HIZMET BOLGELERI — "forklift periyodik kontrol Istanbul" gibi
              hizmet+sehir aramalari, sitenin en degerli sorgu tipi. Bu iki
              sayfa grubu daha once birbirine hic baglanmiyordu.
            */}
            {bolgeler.length > 0 && (
              <div className="mt-10 rounded-card border border-line bg-bgsoft p-6">
                <h2 className="text-lg font-bold text-navy">
                  {sadeAd(e.ad)} periyodik kontrolü verdiğimiz bölgeler
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Ekiplerimiz ekipmanınızın bulunduğu tesise gelir; muayene yerinde yapılır.
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {bolgeler.map((b) => (
                    <li key={b.slug}>
                      <Link
                        href={`/bolge/${b.slug}`}
                        className="inline-block rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold text-navy transition hover:border-blue hover:text-blue"
                      >
                        {b.ilce || b.il}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-36 lg:self-start">
            <div className="rounded-card border border-line bg-bgsoft p-6">
              {foto && (
                <Image
                  src={foto}
                  alt={e.ad}
                  sizes="160px"
                  className="mx-auto mb-4 h-40 w-40 rounded-xl border border-line bg-white object-contain p-2"
                  placeholder="blur"
                />
              )}
              <h2 className="text-lg font-bold text-navy">Künye</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">{m("hizmet_kunye_kategori")}</dt>
                  <dd className="text-right font-semibold text-navy">{e.kategori}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">{m("hizmet_kunye_standart")}</dt>
                  <dd className="text-right font-semibold text-navy">{e.standart}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">{m("hizmet_kunye_periyot")}</dt>
                  <dd className="text-right font-semibold text-navy">
                    {e.periyot === 1 ? "Aylık" : `${e.periyot} ayda bir`}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">{m("hizmet_kunye_akreditasyon")}</dt>
                  <dd className="text-right font-semibold text-navy">{KURUM.akreditasyon}</dd>
                </div>
                {/*
                  ⚠️ "Fenni muayene", mevzuattaki adi periyodik kontrol olan
                  islemin sahada hala en cok kullanilan adi — ve sitenin 144
                  sayfasinin HICBIRINDE gecmiyordu. Rakipler ayni ekipman icin
                  "fenni muayene" adiyla ayri kopya sayfalar aciyor; dogrusu
                  es anlamliyi mevcut sayfada dogal sekilde karsilamak.
                */}
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{m("hizmet_kunye_digerad")}</dt>
                  <dd className="text-right font-semibold text-navy">{sadeAd(e.ad)} fenni muayenesi</dd>
                </div>
              </dl>
            </div>

            {related.length > 0 && (
              <div className="rounded-card border border-line bg-white p-6">
                <h2 className="text-lg font-bold text-navy">{e.kategori} {m("hizmet_diger_baslik")}</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/ekipman/${r.slug}`} className="text-ink transition hover:text-blue">{r.ad}</Link>
                    </li>
                  ))}
                </ul>
                <Link href="/ekipman" className="mt-4 block text-sm font-bold text-blue hover:underline">
                  {m("hizmet_tum_link")}
                </Link>
              </div>
            )}

            <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-6 text-white">
              <h2 className="text-lg font-bold text-white">{m("hizmet_kutu_baslik")}</h2>
              <p className="mt-1 text-sm text-onnavy">{bilgi.calismaSaatleri}</p>
              <a href={`tel:${bilgi.telefonE164}`} className="mt-3 block text-xl font-black text-accent">
                {bilgi.telefon}
              </a>
              <a href={`mailto:${bilgi.eposta}`} className="mt-1 block text-sm text-onnavy hover:text-white">
                {bilgi.eposta}
              </a>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
