import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { KURUM, ADRES_TEK_SATIR, EKIP, REFERANSLAR } from "@/lib/site-data";
import { KATEGORILER } from "@/lib/data";
import { metinleriOku } from "@/lib/sayfa-metin";

export const metadata: Metadata = {
  title: "Kurumsal — Hakkımızda",
  // 160 karakter siniri: arama sonucunda kirpilmasin.
  description: `${KURUM.kisaAd}, TÜRKAK akredite (${KURUM.akreditasyon}) A Tipi muayene kuruluşu. ${KURUM.kurulus}'ten bu yana bağımsız ve tarafsız periyodik kontrol raporları.`,
  alternates: { canonical: "/kurumsal" },
};

export default async function KurumsalPage() {
  const m = await metinleriOku();
  const toplamHizmet = KATEGORILER.reduce((n, k) => n + k.ekipmanlar.length, 0);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: KURUM.ad,
    alternateName: KURUM.kisaAd,
    url: "https://bilgekontrol.com/kurumsal",
    telephone: KURUM.telefonE164,
    email: KURUM.eposta,
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
    employee: EKIP.map((u) => ({ "@type": "Person", name: u.name, jobTitle: u.title })),
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
          <h1 className="text-3xl font-black md:text-4xl">Kurumsal</h1>
          <p className="mt-3 max-w-3xl text-onnavy">{m("kurumsal_giris")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="leading-relaxed text-ink">
            <h2 className="text-2xl font-black text-navy">Biz kimiz?</h2>
            <p className="mt-4 text-muted">
              {KURUM.kurulus} yılından bu yana iş ekipmanlarının periyodik kontrolü alanında
              hizmet veriyoruz. {KURUM.ilce} / {KURUM.il}&apos;daki merkez ofisimizden hareketle
              Türkiye genelindeki işletmelere yerinde muayene hizmeti sunuyoruz.
            </p>
            <p className="mt-3 text-muted">
              Amacımız yalnızca bir kontrol belgesi düzenlemek değil; işletmenizin iş sağlığı ve
              güvenliği risklerini gerçek anlamda azaltmak ve yasal yükümlülüklerini zamanında
              karşılamasını sağlamaktır. Bu nedenle raporlarımızda yalnızca &quot;uygundur&quot;
              ibaresi değil, tespit edilen uygunsuzluklar ve giderilme önerileri de yer alır.
            </p>

            <h2 className="mt-10 text-2xl font-black text-navy">A Tipi muayene kuruluşu ne demek?</h2>
            <p className="mt-4 text-muted">
              {KURUM.standart} standardı muayene kuruluşlarını tarafsızlık düzeyine göre A, B ve C
              tiplerine ayırır. <strong>A Tipi</strong>, muayene ettiği ekipmanın tasarımı, imalatı,
              satışı, montajı veya bakımıyla hiçbir ilgisi olmayan, tamamen bağımsız üçüncü taraf
              kuruluş anlamına gelir.
            </p>
            <p className="mt-3 text-muted">
              Pratikte bunun anlamı şudur: size ekipman satmıyor, bakımını üstlenmiyoruz. Bu yüzden
              raporumuzda çıkan bir uygunsuzluğun bizim için ticari bir karşılığı yok — sadece
              teknik bir tespit. Denetimlerde ve ihale süreçlerinde A Tipi raporun ayrıca aranmasının
              sebebi de budur.
            </p>

            <h2 className="mt-10 text-2xl font-black text-navy">Nasıl çalışıyoruz?</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted">
              <li>Ekipman envanteriniz çıkarılır, İSG-KATİP üzerinden hizmet sözleşmesi düzenlenir.</li>
              <li>Uzman mühendis kadromuz tesisinizde görsel muayene, test ve ölçümleri yapar.</li>
              <li>{KURUM.standart} kapsamında, EKİPNET numaralı ve e-imzalı rapor düzenlenir.</li>
              <li>Bir sonraki yasal kontrol tarihiniz için hatırlatma yapılır.</li>
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ekipman" className="btn-ghost">Hizmetlerimiz ({toplamHizmet})</Link>
              <Link href="/iletisim" className="btn-primary">İletişime Geç →</Link>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-card border border-line bg-bgsoft p-6">
              <h3 className="text-lg font-bold text-navy">Künye</h3>
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
                  <dd className="font-semibold text-navy">{ADRES_TEK_SATIR}</dd>
                </div>
                <div>
                  <dt className="text-muted">Telefon</dt>
                  <dd className="font-semibold text-navy">{KURUM.telefon}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-card border border-line bg-white p-6">
              <h3 className="text-lg font-bold text-navy">Mühendis kadromuz</h3>
              <ul className="mt-3 space-y-3">
                {EKIP.map((u) => (
                  <li key={u.name} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-soft">👷</span>
                    <span>
                      <span className="block font-semibold text-navy">{u.name}</span>
                      <span className="block text-xs text-muted">{u.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-bgsoft">
        <div className="container-x text-center">
          <span className="chip">Referanslarımız</span>
          <h2 className="mt-4 text-3xl font-black text-navy">Bize güvenen firmalardan bazıları</h2>
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
