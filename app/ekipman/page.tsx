import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { KATEGORILER } from "@/lib/data";
import { ALL_EKIPMAN } from "@/lib/content";

export const metadata: Metadata = {
  title: "Periyodik Kontrol Hizmetlerimiz",
  description:
    "Basınçlı kaplar, kaldırma ekipmanları, iş makineleri, elektrik ve yangın tesisatı dâhil tüm periyodik kontrol hizmetlerimiz. TÜRKAK akredite (AB-0296-M) muayene kuruluşu.",
  alternates: { canonical: "/ekipman" },
};

export default function EkipmanIndex() {
  const toplam = ALL_EKIPMAN.length;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Hizmetlerimiz", item: "https://bilgekontrol.com/ekipman" },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Periyodik Kontrol Hizmetleri",
    numberOfItems: toplam,
    itemListElement: ALL_EKIPMAN.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.ad,
      url: `https://bilgekontrol.com/ekipman/${e.slug}`,
    })),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-[#c7d6f0]">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>Hizmetlerimiz</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Periyodik Kontrol Hizmetlerimiz</h1>
          <p className="mt-3 max-w-3xl text-[#c7d6f0]">
            TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu olarak {toplam} ayrı ekipman ve tesisat
            grubunda periyodik kontrol hizmeti veriyoruz. Aradığınız ekipmanı seçerek kapsam, süre ve
            rapor sürecine dair ayrıntılı bilgiye ulaşabilirsiniz.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x space-y-12">
          {KATEGORILER.map((kat) => (
            <div key={kat.baslik}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-soft text-2xl">{kat.ikon}</span>
                <div>
                  <h2 className="text-2xl font-black text-navy">{kat.baslik}</h2>
                  <p className="text-sm text-muted">{kat.ekipmanlar.length} hizmet</p>
                </div>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {kat.ekipmanlar.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/ekipman/${e.slug}`}
                      className="block h-full rounded-xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue"
                    >
                      <span className="block font-semibold text-navy">{e.ad}</span>
                      <span className="mt-1 block text-xs text-muted">
                        {e.standart} · {e.periyot === 1 ? "aylık test" : `${e.periyot} ayda bir`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-8 text-center text-white">
            <h2 className="text-2xl font-black text-white">Ekipmanınızı listede bulamadınız mı?</h2>
            <p className="mt-2 text-[#c7d6f0]">
              Kapsamımız listelenenlerle sınırlı değildir. Ekipman listenizi iletin, uygunluk ve teklif
              bilgisini birlikte değerlendirelim.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/teklif" className="rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5">Ücretsiz Teklif Al →</Link>
              <Link href="/hesapla" className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10">Süremi Hesapla</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
