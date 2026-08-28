import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { REFERANSLAR, KURUM } from "@/lib/site-data";
import { KATEGORILER } from "@/lib/data";
import { metinleriOku } from "@/lib/sayfa-metin";

export const metadata: Metadata = {
  title: "Referanslarımız",
  description:
    "Üretimden lojistiğe, enerjiden inşaata birçok sektörde periyodik kontrol hizmeti verdiğimiz firmalar. TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu.",
  alternates: { canonical: "/referanslar" },
};

/** Sektorler: referans listesindeki firmalarin faaliyet alanlarindan turetildi. */
const SEKTORLER = [
  { ikon: "🏭", ad: "Üretim ve İmalat", not: "Makine parkı, pres, tezgâh ve kaldırma ekipmanları" },
  { ikon: "📦", ad: "Lojistik ve Depolama", not: "Forklift, transpalet, raf sistemleri" },
  { ikon: "🏗️", ad: "İnşaat ve Altyapı", not: "Vinç, iş makinesi, cephe asansörü" },
  { ikon: "🏢", ad: "Site ve Toplu Yapılar", not: "Yangın tesisatı, elektrik ölçümleri, jeneratör" },
  { ikon: "🖨️", ad: "Matbaa ve Ambalaj", not: "Kesim, dilme ve baskı makineleri" },
  { ikon: "⚡", ad: "Elektrik ve Enerji", not: "Topraklama, paratoner, katodik koruma" },
];

export default async function ReferanslarPage() {
  const m = await metinleriOku();
  const toplamHizmet = KATEGORILER.reduce((n, k) => n + k.ekipmanlar.length, 0);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Referanslarımız", item: "https://bilgekontrol.com/referanslar" },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>{m("referans_baslik")}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Referanslarımız</h1>
          <p className="mt-3 max-w-3xl text-onnavy">{m("referans_giris")}</p>
        </div>
      </section>

      {/* LOGOLAR */}
      <section className="section">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-[720px] text-center">
            <span className="chip">Bize güvenen firmalar</span>
            <h2 className="mt-4 text-3xl font-black text-navy">Çalıştığımız markalardan bazıları</h2>
          </div>
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {REFERANSLAR.map((r) => (
              <li
                key={r.name}
                className="flex h-32 flex-col items-center justify-center gap-3 rounded-card border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue"
              >
                <Image src={r.logo} alt={r.name} sizes="220px" className="max-h-16 w-auto object-contain" />
                <span className="text-center text-xs font-semibold text-muted">{r.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-muted">
            Müşteri gizliliği gereği tüm firma isimleri paylaşılmamaktadır.
          </p>
        </div>
      </section>

      {/* SEKTÖRLER */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-[720px] text-center">
            <span className="chip">Sektörler</span>
            <h2 className="mt-4 text-3xl font-black text-navy">Hangi sektörlere hizmet veriyoruz?</h2>
            <p className="mt-3 text-muted">
              {toplamHizmet} ayrı hizmet kapsamımızla, ekipman parkı hangi sektörde olursa olsun
              periyodik kontrol yükümlülüğünü tek elden karşılıyoruz.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SEKTORLER.map((s) => (
              <div key={s.ad} className="card p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft text-2xl">{s.ikon}</div>
                <h3 className="text-lg font-bold text-navy">{s.ad}</h3>
                <p className="mt-1 text-sm text-muted">{s.not}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-x">
          <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-10 text-center text-white">
            <h2 className="text-2xl font-black text-white md:text-3xl">Siz de aramıza katılın</h2>
            <p className="mx-auto mt-3 max-w-2xl text-onnavy">
              TÜRKAK akredite ({KURUM.akreditasyon}) raporlarımızla, denetimlerde ve ihale
              süreçlerinde sorun yaşamayın. Ekipman listenizi iletin, kapsamı birlikte belirleyelim.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/teklif" className="rounded-full bg-accent px-7 py-3.5 font-bold text-navy transition hover:-translate-y-0.5">
                Teklif Al →
              </Link>
              <a href={`tel:${KURUM.telefonE164}`} className="rounded-full border border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10">
                {KURUM.telefon}
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
