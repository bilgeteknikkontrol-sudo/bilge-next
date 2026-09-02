import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BelgeGoruntuleyici from "../components/BelgeGoruntuleyici";
import { bloklar } from "@/lib/bloklar";
import { KURUM } from "@/lib/site-data";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import { metinleriOku } from "@/lib/sayfa-metin";
import { metniHtml } from "@/lib/metin-bicim";

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

export const metadata: Metadata = {
  title: "Akreditasyon ve Sertifikalarımız",
  description:
    "TÜRKAK akreditasyon belgemiz (AB-0296-M) ve TS EN ISO/IEC 17020 kapsamındaki yetkilerimiz. Belgelerimizi inceleyebilir, doğrulayabilirsiniz.",
  alternates: { canonical: "/sertifikalar" },
};

export default function SertifikalarPage() {
  return <Sayfa />;
}

/**
 * Gercek belgeler — eski PHP sitesinden alindi (sunucu yedegi 2026-08-28).
 * TURKAK sertifikasi + 4 sayfalik akreditasyon kapsam eki.
 *
 * Panelden (Icerik Bloklari > Sertifika) belge eklenirse ORASI kullanilir;
 * bu liste yalnizca panel bosken devreye giren varsayilan. Boylece belgeler
 * her zaman gorunur ama panelden degistirilebilir kalir.
 */
const VARSAYILAN_BELGELER = [
  { id: "belge-1", baslik: "TÜRKAK Akreditasyon Sertifikası 1", metin: "", gorsel: "/img/belgeler/akreditasyon-sertifikasi.webp", url: "" },
  { id: "belge-2", baslik: "TÜRKAK Akreditasyon Sertifikası 2", metin: "", gorsel: "/img/belgeler/kapsam-kaldirma-iletme.webp", url: "" },
  { id: "belge-3", baslik: "TÜRKAK Akreditasyon Sertifikası 3", metin: "", gorsel: "/img/belgeler/kapsam-kazanlar.webp", url: "" },
  { id: "belge-4", baslik: "TÜRKAK Akreditasyon Sertifikası 4", metin: "", gorsel: "/img/belgeler/kapsam-yangin.webp", url: "" },
  { id: "belge-5", baslik: "TÜRKAK Akreditasyon Sertifikası 5", metin: "", gorsel: "/img/belgeler/kapsam-basincli-kaplar.webp", url: "" },
];

async function Sayfa() {
  const m = await metinleriOku();
  const bilgi = await iletisimBilgi();
  const panelBelgeleri = await bloklar("sertifika").catch(() => []);
  const belgeler = panelBelgeleri.length ? panelBelgeleri : VARSAYILAN_BELGELER;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Akreditasyon ve Sertifikalar",
        item: "https://bilgekontrol.com/sertifikalar",
      },
    ],
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: KURUM.ad,
    url: "https://bilgekontrol.com/sertifikalar",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      identifier: KURUM.akreditasyon,
      name: "TÜRKAK Akreditasyon Sertifikası",
      credentialCategory: "Akreditasyon",
      competencyRequired: KURUM.standart,
      recognizedBy: {
        "@type": "Organization",
        name: "Türk Akreditasyon Kurumu (TÜRKAK)",
        url: "https://www.turkak.org.tr",
      },
    },
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> /{" "}
            <span>{m("sertifika_yol_adi")}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{m("sertifika_baslik")}</h1>
          <p className="mt-3 max-w-3xl text-onnavy">{m("sertifika_giris")}</p>
        </div>
      </section>

      {/* AKREDİTASYON KÜNYESİ */}
      <section className="section">
        <div className="container-x">
          <div className="card mx-auto max-w-[900px] p-8">
            <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-soft text-4xl">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-black text-navy">
                  {m("sertifika_no_baslik")} {KURUM.akreditasyon}
                </h2>
                <div
                  className="prose mt-2 max-w-none"
                  dangerouslySetInnerHTML={{ __html: metniHtml(m("sertifika_no_yazi")) }}
                />
              </div>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Akreditasyon kurumu", "Türk Akreditasyon Kurumu (TÜRKAK)"],
                ["Akreditasyon numarası", KURUM.akreditasyon],
                ["Standart", KURUM.standart],
                ["Kuruluş tipi", "A Tipi (bağımsız üçüncü taraf)"],
              ].map(([b, d]) => (
                <div key={b} className="rounded-xl border border-line bg-bgsoft p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{b}</dt>
                  <dd className="mt-1 font-bold text-navy">{d}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-xl border border-line bg-white p-5">
              <h3 className="font-bold text-navy">{m("sertifika_dogrula_baslik")}</h3>
              <div
                className="prose mt-2 max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: metniHtml(m("sertifika_dogrula_yazi")) }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* BELGELER */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-[720px] text-center">
            <span className="chip">{m("sertifika_belge_etiket")}</span>
            <h2 className="mt-4 text-3xl font-black text-navy">{m("sertifika_belge_baslik")}</h2>
          </div>

          {belgeler.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {belgeler.map((b) => {
                const kucukGorsel = b.gorsel && (
                      <span className="block aspect-[3/4] overflow-hidden rounded-xl border border-line bg-white transition group-hover:border-blue">
                        {/* ⚠️ width/height, gorselin gercek olculeri (1275x1650).
                            Kap zaten aspect-[3/4] oldugu icin kayma riski
                            yoktu ama denetim araclari olcusuz <img> etiketini
                            CLS bulgusu olarak isaretliyor — 2026-09-02 tam
                            taramada sitedeki TEK bulgu buydu.
                            Panelden yuklenen gorseller baska olcude olabilir;
                            object-contain oldugu icin oran bozulmaz.
                            lazy: belgeler her zaman ekranin altinda kaliyor. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.gorsel}
                          alt={b.baslik}
                          width={1275}
                          height={1650}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain p-3"
                        />
                      </span>
                    );

                const yazi = (
                  <>
                    <span className="mt-4 block font-bold text-navy">{b.baslik}</span>
                    {b.metin && <span className="mt-1 block text-sm text-muted">{b.metin}</span>}
                  </>
                );

                /**
                 * ⚠️ Gorsel artik TIKLANINCA TAM EKRAN aciliyor: belgeler
                 * 1275x1650 ve karttaki kucuk kutuda kapsam satirlari
                 * okunmuyordu — oysa "neyi kapsiyor" sorusu bu sayfanin tek
                 * isi. Buyutme/kucultme icin bkz. BelgeGoruntuleyici.
                 *
                 * ⚠️ Panelden bir belgeye DOSYA ADRESI (b.url) girilmisse o
                 * baglanti korunuyor: orada genellikle PDF'in kendisi duruyor
                 * ve onu yeni sekmede acmak goruntuleyiciden iyi. Gorsel yine
                 * de buyutulebiliyor; ikisi ayri eylem.
                 */
                return (
                  <div key={b.id} className="card p-5">
                    {kucukGorsel ? (
                      <BelgeGoruntuleyici gorsel={b.gorsel} baslik={b.baslik}>
                        {kucukGorsel}
                      </BelgeGoruntuleyici>
                    ) : null}
                    {b.url ? (
                      <a href={b.url} target="_blank" rel="noopener noreferrer" className="block">
                        {yazi}
                        <span className="mt-3 block text-sm font-bold text-blue">Belgeyi aç →</span>
                      </a>
                    ) : (
                      yazi
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Panelden belge eklenene kadar gosterilen durum. Var olmayan belge iddia edilmiyor. */
            <div className="mx-auto max-w-[720px] rounded-card border border-line bg-white p-8 text-center">
              <p className="text-4xl" aria-hidden>📄</p>
              <h3 className="mt-3 text-lg font-bold text-navy">{m("sertifika_bos_baslik")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m("sertifika_bos_yazi")}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/iletisim" className="btn-primary">{m("sertifika_bos_buton")}</Link>
                <a href={`tel:${bilgi.telefonE164}`} className="btn-ghost">{bilgi.telefon}</a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEDEN ÖNEMLİ */}
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black text-navy">{m("sertifika_neden_baslik")}</h2>
            <div
              className="prose mt-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: metniHtml(m("sertifika_neden_yazi")) }}
            />
          </div>
          <ul className="space-y-3">
            {[
              ["🛡️", "Denetimlerde kabul", "Çalışma Bakanlığı denetimlerinde raporun geçerliliği tartışılmaz."],
              ["📋", "İhale şartlarına uygunluk", "Birçok ihale şartnamesi akredite kuruluş raporu ister."],
              ["⚖️", "Tarafsızlık güvencesi", "Size ekipman satmıyoruz; bulgularımızın ticari karşılığı yok."],
              ["🔄", "Sürekli denetim", "Akreditasyon bir kez alınıp bırakılmaz, düzenli olarak denetlenir."],
            ].map(([i, b, d]) => (
              <li key={b} className="flex gap-4 rounded-xl border border-line bg-white p-5">
                <span className="text-2xl" aria-hidden>{i}</span>
                <span>
                  <span className="block font-bold text-navy">{b}</span>
                  <span className="mt-1 block text-sm text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}
