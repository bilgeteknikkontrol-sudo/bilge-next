import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { KURUM, UZMANLIK_ALANLARI, REFERANSLAR } from "@/lib/site-data";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import { KATEGORILER } from "@/lib/data";
import { metinleriOku } from "@/lib/sayfa-metin";
import { metniHtml } from "@/lib/metin-bicim";
import { bloklar } from "@/lib/bloklar";

export const metadata: Metadata = {
  title: "Kurumsal — Hakkımızda",
  // 160 karakter siniri: arama sonucunda kirpilmasin.
  description: `${KURUM.kisaAd}, TÜRKAK akredite (${KURUM.akreditasyon}) A Tipi muayene kuruluşu. ${KURUM.kurulus}'ten bu yana bağımsız ve tarafsız periyodik kontrol raporları.`,
  alternates: { canonical: "/kurumsal" },
};

export default async function KurumsalPage() {
  const bilgi = await iletisimBilgi();
  const m = await metinleriOku();
  const toplamHizmet = KATEGORILER.reduce((n, k) => n + k.ekipmanlar.length, 0);

  /**
   * Uzmanlik alanlari (kisi degil brans) PANELDEN okunuyor.
   *
   * ⚠️ Onceden bu sayfa kadroyu dogrudan koddan basiyordu, ana sayfa ise
   * panelden okuyordu: panelden bir kayit eklendiginde iki sayfa FARKLI sey
   * gosteriyordu. Ucu de (ana sayfa, burasi, iletisim) artik ayni kaynaktan
   * okuyor. Kayit yoksa kutu hic basilmaz.
   */
  const uzmanlikBloklari = await bloklar("uzmanlik").catch(() => []);
  const uzmanlikListesi = uzmanlikBloklari.length
    ? uzmanlikBloklari.map((b) => ({ ikon: b.ikon || "🛠️", ad: b.baslik, aciklama: b.metin }))
    : UZMANLIK_ALANLARI;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: KURUM.ad,
    alternateName: KURUM.kisaAd,
    url: "https://bilgekontrol.com/kurumsal",
    telephone: bilgi.telefonE164,
    email: bilgi.eposta,
    foundingDate: KURUM.kurulus,
    address: {
      "@type": "PostalAddress",
      streetAddress: KURUM.adres,
      addressLocality: KURUM.ilce,
      addressRegion: KURUM.il,
      addressCountry: KURUM.ulke,
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      identifier: KURUM.akreditasyon,
      credentialCategory: "TÜRKAK Akreditasyonu",
    },
    /**
     * ⚠️ `employee` ALANI BILEREK YOK.
     *
     * Onceden calisan adlari burada Person olarak arama motorlarina da
     * gonderiliyordu — yani gorunen metni silmek tek basina yetmezdi.
     * Kisi adi artik hic yayinlanmadigi icin alan tamamen kaldirildi;
     * uzmanlik alanlari kisi DEGIL, onlari Person olarak gondermek yanlis
     * yapisal veri olurdu.
     */
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Kurumsal", item: "https://bilgekontrol.com/kurumsal" },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>{m("kurumsal_baslik")}</span>
          </nav>
          {/* ⚠️ H1 sabit "Kurumsal" yaziyordu; panelde "Sayfa başlığı (H1)" diye
              bir alan olmasina ragmen o alan yalnizca ust satirdaki yol
              gostergesine baglanmisti. Artik ikisi de ayni alandan geliyor. */}
          <h1 className="text-3xl font-black md:text-4xl">{m("kurumsal_baslik")}</h1>
          <p className="mt-3 max-w-3xl text-onnavy">{m("kurumsal_giris")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="leading-relaxed text-ink">
            {/* Govde artik PANELDEN geliyor (Admin > Hakkımızda > Sayfanın ana
                metni). Duz metin olarak yazilip lib/metin-bicim.ts ile HTML'e
                cevriliyor; boylece kullanici etiket yazmak zorunda kalmiyor. */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: metniHtml(m("kurumsal_govde")) }}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ekipman" className="btn-ghost">{m("kurumsal_btn1")} ({toplamHizmet})</Link>
              <Link href="/iletisim" className="btn-primary">{m("kurumsal_btn2")}</Link>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-card border border-line bg-bgsoft p-6">
              <h3 className="text-lg font-bold text-navy">{m("kurumsal_kunye_baslik")}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="border-b border-line pb-2">
                  <dt className="text-muted">Unvan</dt>
                  <dd className="font-semibold text-navy">{KURUM.ad}</dd>
                </div>
                <div className="border-b border-line pb-2">
                  <dt className="text-muted">Akreditasyon</dt>
                  <dd className="font-semibold text-navy">TÜRKAK {KURUM.akreditasyon}</dd>
                </div>
                <div className="border-b border-line pb-2">
                  <dt className="text-muted">Standart</dt>
                  <dd className="font-semibold text-navy">{KURUM.standart}</dd>
                </div>
                <div className="border-b border-line pb-2">
                  <dt className="text-muted">Adres</dt>
                  <dd className="font-semibold text-navy">{bilgi.adresTekSatir}</dd>
                </div>
                <div>
                  <dt className="text-muted">Telefon</dt>
                  <dd className="font-semibold text-navy">{bilgi.telefon}</dd>
                </div>
              </dl>
            </div>

            {/* Kadro kutusu YALNIZCA kayit varsa basiliyor — panel de kod da
                bossa bomboş bir "Mühendis kadromuz" kutusu kalmasin. */}
            {uzmanlikListesi.length > 0 && (
              <div className="rounded-card border border-line bg-white p-6">
                <h3 className="text-lg font-bold text-navy">{m("kurumsal_ekip_baslik")}</h3>
                <ul className="mt-3 space-y-3">
                  {uzmanlikListesi.map((u) => (
                    <li key={u.ad} className="flex items-start gap-3">
                      <span aria-hidden className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-soft text-lg">
                        {u.ikon}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-navy">{u.ad}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{u.aciklama}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="section bg-bgsoft">
        <div className="container-x text-center">
          <span className="chip">{m("kurumsal_ref_etiket")}</span>
          <h2 className="mt-4 text-3xl font-black text-navy">{m("kurumsal_ref_baslik")}</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {REFERANSLAR.map((r) => (
              <li key={r.name} className="flex h-24 items-center justify-center rounded-xl border border-line bg-white p-4">
                <Image src={r.logo} alt={r.name} sizes="200px" className="max-h-14 w-auto object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}
