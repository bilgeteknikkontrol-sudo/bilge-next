import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getEquipment, type Equipment } from "@/lib/cms";
import { KURUM } from "@/lib/site-data";

/**
 * "FENNI MUAYENE" MERKEZ SAYFASI
 *
 * ⚠️ NEDEN VAR: 2026-08-30 denetiminde sitenin 144 sayfasinin HICBIRINDE
 * "fenni muayene" ifadesi gecmiyordu. Oysa mevzuattaki adi periyodik kontrol
 * olan islemin sahada ve Google'da hala en cok kullanilan adi bu. Rakiplerden
 * teknikperiyodikkontrol.com ayni ekipman icin "Fenni Muayene", "Periyodik
 * Muayene" ve "Periyodik Kontrol" adiyla UC AYRI sayfa acmis durumda ve o
 * aramalarin tamamini tek basina topluyor.
 *
 * Ayni oyunu oynayip her ekipmanin ucer kopyasini uretmek yanlis olurdu:
 * Google bunu kapi sayfasi (doorway page) sayar ve yaptirim uygular. Dogru
 * karsilik, terimi TEK bir sayfada gercekten aciklamak ve oradan mevcut
 * hizmet sayfalarina dagitmak. Sayfa ayni zamanda 90+ ekipman sayfasina link
 * veren bir dagitim noktasi gorevi goruyor.
 *
 * ⚠️ Sayfadaki mevzuat iddialari 23.12.2025 tarihli degisiklik sonrasi
 * yururlukteki metne gore yazildi (EKIPNET tanimi, IS-KATIP sozlesme sarti,
 * e-imzali kayit gecerliligi). Mevzuat degisirse burasi da guncellenmeli.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fenni Muayene Nedir?",
  description:
    "Fenni muayene, mevzuattaki adıyla periyodik kontroldür. Kimler yapabilir, hangi ekipmanlar zorunlu, rapor nasıl geçerli olur? TÜRKAK akredite kuruluştan yanıtlar.",
  alternates: { canonical: "/fenni-muayene" },
};

function grupla(list: Equipment[]): [string, Equipment[]][] {
  const m = new Map<string, Equipment[]>();
  for (const e of list) {
    if (!m.has(e.kategori)) m.set(e.kategori, []);
    m.get(e.kategori)!.push(e);
  }
  return [...m.entries()];
}

/** Sayfada GORUNEN sorular; FAQPage schema birebir bunlardan uretiliyor. */
const SORULAR = [
  {
    q: "Fenni muayene ile periyodik kontrol arasında fark var mı?",
    a: "Hayır, ikisi aynı işlemi anlatır. Mevzuattaki resmî terim periyodik kontroldür; fenni muayene ise sahada ve günlük kullanımda yerleşmiş eski adıdır. Düzenlenen rapor, hangi adla anılırsa anılsın aynı yasal geçerliliğe sahiptir.",
  },
  {
    q: "Fenni muayeneyi kimler yapabilir?",
    a: "İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği, kontrolü yapacak kişiyi EKİPNET'e kayıtlı ilgili branştan mühendis, teknik öğretmen, tekniker veya yüksek tekniker olarak tanımlar. Ekipman türüne göre aranan branş değişir.",
  },
  {
    q: "Fenni muayene raporu ne zaman geçersiz sayılır?",
    a: "23 Aralık 2025 tarihli değişiklikle birlikte, İSG-KATİP üzerinden sözleşme olmaksızın düzenlenen periyodik kontrol raporları geçersiz kabul edilir. Ayrıca kontrolü yapan kişinin EKİPNET kaydının bulunması gerekir.",
  },
  {
    q: "Fenni muayene ne sıklıkta yaptırılır?",
    a: "İmalatçı veya standart aksini belirtmedikçe periyot bir yılı aşamaz. Bazı ekipmanlarda süre daha kısadır; örneğin yangın pompalarında haftalık çalıştırma testi istenir. Ekipmanınıza özel süreyi süre hesaplama aracımızdan görebilirsiniz.",
  },
  {
    q: "Fenni muayene raporu ıslak imzalı mı saklanmalı?",
    a: "İşveren raporu ıslak imzalı saklayabileceği gibi, 5070 sayılı Kanuna uygun güvenli elektronik imza ile imzalanıp elektronik ortamda saklanan kayıtlar da geçerlidir.",
  },
];

export default async function FenniMuayenePage() {
  const hepsi = (await getEquipment().catch(() => [])).filter((e) => e.aktif);
  const kategoriler = grupla(hepsi);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Fenni Muayene", item: "https://bilgekontrol.com/fenni-muayene" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SORULAR.map((f) => ({
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

      <section className="bg-gradient-to-br from-navy to-navy2 py-12 text-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>Fenni Muayene</span>
          </nav>
          <h1 className="max-w-3xl text-3xl font-black md:text-4xl">
            Fenni Muayene Nedir? Periyodik Kontrolden Farkı Var mı?
          </h1>
          <p className="mt-3 max-w-2xl text-onnavy">
            Kısa cevap: fark yok. İkisi aynı işlemin iki adı. Uzun cevap ve hangi ekipmanın
            hangi sıklıkta muayene edilmesi gerektiği aşağıda.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <p className="text-lg font-medium leading-relaxed text-ink">
              <b>Fenni muayene</b>, iş ekipmanlarının güvenli kullanılıp kullanılamayacağını
              belirlemek için belirli aralıklarla yapılan test, deney ve muayene faaliyetidir.
              Mevzuattaki resmî adı <b>periyodik kontrol</b>&apos;dür. &quot;Fenni muayene&quot;,
              &quot;periyodik muayene&quot; ve &quot;periyodik kontrol&quot; ifadelerinin üçü de
              aynı işlemi anlatır; düzenlenen rapor da aynı yasal geçerliliğe sahiptir.
            </p>

            <h2 className="mt-8 text-2xl font-black text-navy">Yasal dayanak</h2>
            <p className="mt-3 leading-relaxed text-muted">
              İşlemin dayanağı, 25 Nisan 2013 tarihli ve 28628 sayılı Resmî Gazete&apos;de
              yayımlanan <b>İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları
              Yönetmeliği</b>&apos;dir. Yönetmelik <b>23 Aralık 2025</b> tarihinde önemli
              ölçüde değiştirildi. Değişiklikle birlikte:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
              <li>
                EKİPNET, İSG-KATİP içinde yer alan bir modül olarak yeniden tanımlandı.
              </li>
              <li>
                <b>İSG-KATİP üzerinden sözleşme olmaksızın periyodik kontrol raporu
                düzenlenemez</b>; sözleşmesiz düzenlenen raporlar geçersizdir.
              </li>
              <li>
                Raporlar ıslak imzalı saklanabileceği gibi, 5070 sayılı Kanuna uygun güvenli
                elektronik imzayla imzalanıp elektronik ortamda da saklanabilir.
              </li>
              <li>
                İdari yaptırımlar denetim başına uygulanır; aykırılık hâlinde yetkili kişinin
                yetkisi bir ay süreyle askıya alınabilir.
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted">
              Ayrıntılar için:{" "}
              <Link href="/yazilar/periyodik-kontrol-yeni-yonetmelik-2025" className="font-semibold text-blue hover:underline">
                23 Aralık 2025 yönetmelik değişikliği neler getirdi?
              </Link>{" "}
              ve{" "}
              <Link href="/yazilar/ekipnet-nedir" className="font-semibold text-blue hover:underline">
                EKİPNET nedir?
              </Link>
            </p>

            <h2 className="mt-8 text-2xl font-black text-navy">Fenni muayeneyi kim yapabilir?</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Yönetmelik, kontrolü yapacak kişiyi <b>EKİPNET&apos;e kayıtlı ilgili branştan
              mühendis, teknik öğretmen, tekniker veya yüksek tekniker</b> olarak tanımlar.
              Aranan branş ekipmana göre değişir: basınçlı bir kabı makine mühendisi,
              topraklama ölçümünü elektrik mühendisi yapar.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              {KURUM.kisaAd}, TÜRKAK tarafından <b>{KURUM.standart}</b> kapsamında akredite
              edilmiş <b>A Tipi muayene kuruluşu</b>dur (akreditasyon no {KURUM.akreditasyon}).
              Akreditasyon kapsamımızı{" "}
              <Link href="/sertifikalar" className="font-semibold text-blue hover:underline">
                sertifikalar sayfasından
              </Link>{" "}
              görebilirsiniz.
            </p>

            <h2 className="mt-8 text-2xl font-black text-navy">Hangi ekipmanın fenni muayenesi zorunlu?</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Aşağıda muayenesini yaptığımız ekipmanlar kategori kategori listelenmiştir.
              Her başlık, o ekipmanın kontrol kapsamını, uygulanan standardı ve yasal
              periyodunu anlatan sayfaya gider.
            </p>

            <div className="mt-6 space-y-7">
              {kategoriler.map(([kategori, liste]) => (
                <div key={kategori}>
                  <h3 className="text-lg font-bold text-navy">{kategori}</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {liste.map((e) => (
                      <li key={e.slug}>
                        <Link
                          href={`/ekipman/${e.slug}`}
                          className="inline-block rounded-full border border-line bg-white px-3 py-1 text-sm text-ink transition hover:border-blue hover:text-blue"
                        >
                          {e.ad} fenni muayenesi
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="mt-10 text-2xl font-black text-navy">Sıkça Sorulan Sorular</h2>
            <div className="mt-4 space-y-3">
              {SORULAR.map((f, i) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-line bg-white p-5 open:border-blue"
                  open={i === 0}
                >
                  <summary className="cursor-pointer list-none font-bold text-navy marker:content-none">
                    <span className="mr-2 text-blue">+</span>
                    {f.q}
                  </summary>
                  <p className="mt-3 pl-6 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/teklif" className="btn-primary">Fenni Muayene Teklifi Al →</Link>
              <Link href="/hesapla" className="btn-ghost">Süremi Hesapla</Link>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-36 lg:self-start">
            <div className="rounded-card border border-line bg-bgsoft p-6">
              <h2 className="text-lg font-bold text-navy">Kısaca</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">Resmî adı</dt>
                  <dd className="text-right font-semibold text-navy">Periyodik kontrol</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">Yaygın adı</dt>
                  <dd className="text-right font-semibold text-navy">Fenni muayene</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-muted">Azami periyot</dt>
                  <dd className="text-right font-semibold text-navy">1 yıl</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Kayıt sistemi</dt>
                  <dd className="text-right font-semibold text-navy">EKİPNET / İSG-KATİP</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-card border border-line bg-white p-6">
              <h2 className="text-lg font-bold text-navy">İlgili sayfalar</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/periyodik-kontrol-sureleri" className="text-ink hover:text-blue">Periyodik kontrol süreleri tablosu</Link></li>
                <li><Link href="/ekipman" className="text-ink hover:text-blue">Tüm kontrol hizmetlerimiz</Link></li>
                <li><Link href="/yazilar/periyodik-kontrolu-kimler-yapabilir" className="text-ink hover:text-blue">Periyodik kontrolü kimler yapabilir?</Link></li>
                <li><Link href="/yazilar/periyodik-kontrol-raporu-nasil-okunur" className="text-ink hover:text-blue">Muayene raporu nasıl okunur?</Link></li>
                <li><Link href="/bolge" className="text-ink hover:text-blue">Hizmet bölgelerimiz</Link></li>
              </ul>
            </div>

            <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-6 text-white">
              <h2 className="text-lg font-bold text-white">Hemen bilgi alın</h2>
              <p className="mt-1 text-sm text-onnavy">{KURUM.calismaSaatleri}</p>
              <a href={`tel:${KURUM.telefonE164}`} className="mt-3 block text-xl font-black text-accent">
                {KURUM.telefon}
              </a>
              <a href={`mailto:${KURUM.eposta}`} className="mt-1 block text-sm text-onnavy hover:text-white">
                {KURUM.eposta}
              </a>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
