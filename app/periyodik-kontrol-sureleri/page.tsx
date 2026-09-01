import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getEquipment, type Equipment } from "@/lib/cms";
import { KATEGORILER } from "@/lib/data";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import { metinleriOku } from "@/lib/sayfa-metin";

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
  title: "Periyodik Kontrol Süreleri Tablosu",
  description:
    // 160 karakter siniri. (2026-09-01'de 156 idi — sinirdaydi ama asmiyordu;
    // yine de bir miktar pay birakildi.)
    "Hangi iş ekipmanı ne sıklıkla kontrol edilmeli? Kaldırma araçları, basınçlı kaplar, elektrik ve iş makineleri için yasal süreler tek tabloda.",
  alternates: { canonical: "/periyodik-kontrol-sureleri" },
};

const KATEGORI_IKON: Record<string, string> = Object.fromEntries(
  KATEGORILER.map((k) => [k.baslik, k.ikon])
);

function periyotMetni(p: number) {
  if (p === 1) return "Ayda 1";
  if (p === 12) return "Yılda 1";
  if (p < 12) return `${p} ayda 1`;
  return `${p / 12} yılda 1`;
}

function grupla(list: Equipment[]): [string, Equipment[]][] {
  const m = new Map<string, Equipment[]>();
  for (const e of list) {
    if (!m.has(e.kategori)) m.set(e.kategori, []);
    m.get(e.kategori)!.push(e);
  }
  return [...m.entries()];
}

const SSS = [
  {
    q: "Periyodik kontrol süresi neye göre belirlenir?",
    a: "Süre üç kaynaktan belirlenir: İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği'nin ilgili eki, ekipmanın tabi olduğu standart ve imalatçının kullanma talimatı. Bunlardan hangisi daha kısa bir süre öngörüyorsa o uygulanır.",
  },
  {
    q: "Tabloda yazan süreler her işletme için aynı mı?",
    a: "Hayır. Tablodaki değerler, aksi belirtilmedikçe uygulanan genel periyotlardır. Ağır çalışma koşulları, yoğun vardiya, korozif ortam veya imalatçının daha sık kontrol öngörmesi hâlinde süre kısalır. Risk değerlendirmeniz daha sık kontrol gerektirebilir.",
  },
  {
    q: "Süresi dolmuş ekipmanı kullanmaya devam edebilir miyim?",
    a: "Periyodik kontrolü yapılmamış veya süresi dolmuş iş ekipmanının kullanılması mevzuata aykırıdır. Denetimlerde idari yaptırım uygulanabilir; ayrıca bir iş kazası hâlinde işverenin sorumluluğu ağırlaşır.",
  },
  {
    q: "Kontrolü kim yapabilir?",
    a: "Periyodik kontroller, ilgili yönetmelikte tanımlanan ve ekipman türüne göre yetkilendirilmiş kişiler tarafından yapılır. Akredite bir muayene kuruluşundan alınan rapor, denetim ve ihale süreçlerinde kabul açısından avantaj sağlar.",
  },
  {
    q: "Yeni alınan ekipmanın kontrolü ne zaman yapılır?",
    a: "Yeni ekipmanda ilk periyodik kontrol, kullanılmaya başlandığı tarih esas alınarak ilgili periyot sonunda yapılır. Ayrıca ekipman büyük bir tamirat, kaza veya uzun süreli duruş sonrası yeniden kullanıma alınacaksa, periyot beklenmeden kontrol edilmesi gerekir.",
  },
];

export default async function SurelerPage() {
  const bilgi = await iletisimBilgi();
  const m = await metinleriOku();
  const hepsi = (await getEquipment().catch(() => [])).filter((e) => e.aktif);
  const kategoriler = grupla(hepsi);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Periyodik Kontrol Süreleri",
        item: "https://bilgekontrol.com/periyodik-kontrol-sureleri",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SSS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>Periyodik Kontrol Süreleri</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{m("sureler_baslik")}</h1>
          <p className="mt-3 max-w-3xl text-onnavy">{m("sureler_giris")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/hesapla" className="rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5">
              Kendi Sürenizi Hesaplayın →
            </Link>
            <Link href="/teklif" className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10">
              Teklif Al
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sol: kategori kısayolları */}
          <aside className="lg:sticky lg:top-36 lg:self-start">
            <nav aria-label="Kategoriler" className="rounded-card border border-line bg-bgsoft p-4">
              <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-muted">Kategoriler</p>
              <ul className="space-y-1">
                {kategoriler.map(([kat, items]) => (
                  <li key={kat}>
                    <a
                      href={`#t-${kat.replace(/\s+/g, "-").toLowerCase()}`}
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
          </aside>

          <div className="min-w-0">
            {/* Uyarı — tablonun bağlayıcı olmadığını baştan söyle */}
            <div className="rounded-card border border-amber-soft bg-amber-soft/40 p-5">
              <p className="text-sm leading-relaxed text-ink">
                <strong>Tabloyu nasıl okumalı?</strong> Buradaki değerler, ilgili mevzuat ve
                standartlarda <em>aksi belirtilmedikçe</em> uygulanan genel periyotlardır.
                İmalatçının kullanma talimatı veya işletmenizin risk değerlendirmesi daha kısa bir
                süre öngörüyorsa <strong>kısa olan uygulanır</strong>. Bağlayıcı olan, ekipmanınızın
                kendi teknik dosyası ve yürürlükteki mevzuattır.
              </p>
            </div>

            {kategoriler.map(([kat, items]) => (
              <div
                key={kat}
                id={`t-${kat.replace(/\s+/g, "-").toLowerCase()}`}
                className="mt-12 scroll-mt-40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-soft text-2xl">
                    {KATEGORI_IKON[kat] || "🛠️"}
                  </span>
                  <h2 className="text-2xl font-black text-navy">{kat}</h2>
                </div>

                <div className="mt-4 overflow-x-auto rounded-card border border-line">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-bgsoft">
                        <th scope="col" className="p-3 text-left font-bold text-navy">Ekipman</th>
                        <th scope="col" className="p-3 text-left font-bold text-navy">Standart</th>
                        <th scope="col" className="whitespace-nowrap p-3 text-left font-bold text-navy">Kontrol Sıklığı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((e) => (
                        <tr key={e.slug} className="border-t border-line">
                          <td className="p-3">
                            <Link href={`/ekipman/${e.slug}`} className="font-semibold text-ink transition hover:text-blue">
                              {e.ad}
                            </Link>
                          </td>
                          <td className="p-3 text-muted">{e.standart}</td>
                          <td className="whitespace-nowrap p-3">
                            <span className="rounded-full bg-blue-soft px-2.5 py-1 text-xs font-bold text-blue">
                              {periyotMetni(e.periyot)}
                            </span>
                            {e.periyotNot && (
                              <span className="mt-1 block text-xs text-muted">{e.periyotNot}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* SSS */}
            <div className="mt-16">
              <h2 className="text-2xl font-black text-navy">Sıkça Sorulan Sorular</h2>
              <div className="mt-4 space-y-3">
                {SSS.map((f, i) => (
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

            <div className="mt-12 rounded-card bg-gradient-to-br from-navy to-navy2 p-8 text-center text-white">
              <h2 className="text-2xl font-black text-white">Süreniz dolmak üzere mi?</h2>
              <p className="mx-auto mt-2 max-w-2xl text-onnavy">
                Son kontrol tarihinizi girin, bir sonraki yasal tarihi anında görün. Gerekirse aynı
                ekrandan teklif oluşturun.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/hesapla" className="rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5">
                  Süremi Hesapla →
                </Link>
                <a href={`tel:${bilgi.telefonE164}`} className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                  {bilgi.telefon}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
