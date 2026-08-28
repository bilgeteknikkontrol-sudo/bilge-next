import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getEquipment, type Equipment } from "@/lib/cms";
import { EKIPMAN_GORSEL } from "@/lib/images";
import { EKIPMAN_ICERIK } from "@/lib/ekipman-icerik";
import { KATEGORILER } from "@/lib/data";
import { KURUM } from "@/lib/site-data";
import { metinleriOku } from "@/lib/sayfa-metin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Periyodik Kontrol Hizmetlerimiz",
  description:
    "Basınçlı kaplar, kaldırma ekipmanları, iş makineleri, elektrik ve yangın tesisatı dâhil tüm periyodik kontrol hizmetlerimiz. TÜRKAK akredite (AB-0296-M) muayene kuruluşu.",
  alternates: { canonical: "/ekipman" },
};

/** Kategori adi -> ikon; CMS kategori adini donduruyor ama ikonu tasimiyor. */
const KATEGORI_IKON: Record<string, string> = Object.fromEntries(
  KATEGORILER.map((k) => [k.baslik, k.ikon])
);

/** Bolum bagi icin guvenli id (Turkce karakterler sadelestirilir). */
function kategoriId(ad: string) {
  return (
    "k-" +
    ad
      .toLowerCase()
      .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
      .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

function grupla(list: Equipment[]): [string, Equipment[]][] {
  const m = new Map<string, Equipment[]>();
  for (const e of list) {
    if (!m.has(e.kategori)) m.set(e.kategori, []);
    m.get(e.kategori)!.push(e);
  }
  return [...m.entries()];
}

export default async function EkipmanIndex() {
  const m = await metinleriOku();
  const hepsi = (await getEquipment().catch(() => [])).filter((e) => e.aktif);
  const kategoriler = grupla(hepsi);
  const toplam = hepsi.length;

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
    itemListElement: hepsi.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${e.ad} Periyodik Kontrolü`,
      url: `https://bilgekontrol.com/ekipman/${e.slug}`,
    })),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* KAHRAMAN */}
      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>Hizmetlerimiz</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{m("ekipman_baslik")}</h1>
          <p className="mt-3 max-w-3xl text-onnavy">{m("ekipman_giris")}</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-onnavy">
            <span>📋 {kategoriler.length} kategori</span>
            <span>🔧 {toplam} hizmet</span>
            <span>🇹🇷 Türkiye geneli yerinde muayene</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* SOL: kategori listesi */}
          <aside className="lg:sticky lg:top-36 lg:self-start">
            <nav aria-label="Hizmet kategorileri" className="rounded-card border border-line bg-bgsoft p-4">
              <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-muted">Kategoriler</p>
              <ul className="space-y-1">
                {kategoriler.map(([kat, items]) => (
                  <li key={kat}>
                    <a
                      href={`#${kategoriId(kat)}`}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-ink transition hover:bg-white hover:text-blue"
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden>{KATEGORI_IKON[kat] || "🛠️"}</span>
                        {kat}
                      </span>
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[.7rem] font-bold text-muted">
                        {items.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 rounded-card bg-gradient-to-br from-navy to-navy2 p-5 text-white">
              <h2 className="text-base font-bold text-white">Ekipmanınız listede yok mu?</h2>
              <p className="mt-1 text-sm text-onnavy">
                Kapsamımız listeyle sınırlı değil. Listenizi iletin, birlikte değerlendirelim.
              </p>
              <Link
                href="/teklif"
                className="mt-3 block rounded-full bg-accent px-4 py-2.5 text-center text-sm font-bold text-navy transition hover:-translate-y-0.5"
              >
                Teklif Al →
              </Link>
              <a href={`tel:${KURUM.telefonE164}`} className="mt-3 block text-center text-sm font-bold text-accent">
                {KURUM.telefon}
              </a>
            </div>
          </aside>

          {/* SAĞ: kategori bölümleri */}
          <div className="min-w-0 space-y-14">
            {kategoriler.map(([kat, items]) => (
              <div key={kat} id={kategoriId(kat)} className="scroll-mt-40">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft text-2xl">
                    {KATEGORI_IKON[kat] || "🛠️"}
                  </span>
                  <div>
                    <h2 className="text-2xl font-black text-navy">{kat}</h2>
                    <p className="text-sm text-muted">{items.length} hizmet</p>
                  </div>
                </div>

                <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((e) => {
                    const g = EKIPMAN_GORSEL[e.slug];
                    const ic = EKIPMAN_ICERIK[e.slug];
                    return (
                      <li key={e.slug}>
                        <Link
                          href={`/ekipman/${e.slug}`}
                          className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-blue hover:shadow-[0_18px_36px_-20px_color-mix(in_srgb,var(--color-navy)_40%,transparent)]"
                        >
                          {g && (
                            <span className="block aspect-[16/10] overflow-hidden bg-bgsoft">
                              <Image
                                src={g}
                                alt=""
                                aria-hidden
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 320px"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                placeholder="blur"
                              />
                            </span>
                          )}
                          <span className="flex flex-1 flex-col p-4">
                            <span className="block font-bold text-navy group-hover:text-blue">{e.ad}</span>
                            {ic?.seoDesc && (
                              <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-muted">
                                {ic.seoDesc}
                              </span>
                            )}
                            <span className="mt-auto flex flex-wrap gap-x-3 pt-3 text-[.7rem] font-semibold text-muted">
                              <span>{e.standart}</span>
                              <span>·</span>
                              <span>{e.periyot === 1 ? "aylık test" : `${e.periyot} ayda bir`}</span>
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-8 text-center text-white">
              <h2 className="text-2xl font-black text-white">Kapsamı birlikte belirleyelim</h2>
              <p className="mx-auto mt-2 max-w-2xl text-onnavy">
                Ekipman listenizi iletin; hangi muayenelerin yasal olarak zorunlu olduğunu,
                periyotları ve toplam maliyeti tek bir teklifte size sunalım.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/teklif" className="rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5">
                  Teklif Al →
                </Link>
                <Link href="/hesapla" className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                  Süremi Hesapla
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
