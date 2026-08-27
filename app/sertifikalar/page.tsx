import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { bloklar } from "@/lib/bloklar";
import { KURUM } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Akreditasyon ve Sertifikalarımız",
  description:
    "TÜRKAK akreditasyon belgemiz (AB-0296-M) ve TS EN ISO/IEC 17020 kapsamındaki yetkilerimiz. Belgelerimizi inceleyebilir, doğrulayabilirsiniz.",
  alternates: { canonical: "/sertifikalar" },
};

export default function SertifikalarPage() {
  return <Sayfa />;
}

async function Sayfa() {
  const belgeler = await bloklar("sertifika").catch(() => []);

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
          <nav className="mb-3 text-sm text-[#c7d6f0]">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> /{" "}
            <span>Akreditasyon ve Sertifikalar</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Akreditasyon ve Sertifikalarımız</h1>
          <p className="mt-3 max-w-3xl text-[#c7d6f0]">
            Düzenlediğimiz raporların denetimlerde ve ihale süreçlerinde kabul görmesi,
            akreditasyonumuza dayanır. Yetki kapsamımızı ve belgelerimizi burada
            inceleyebilirsiniz.
          </p>
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
                  TÜRKAK Akreditasyon No: {KURUM.akreditasyon}
                </h2>
                <p className="mt-2 text-muted">
                  {KURUM.ad}, Türk Akreditasyon Kurumu (TÜRKAK) tarafından{" "}
                  <strong>{KURUM.standart}</strong> standardına göre akredite edilmiş bağımsız{" "}
                  <strong>A Tipi muayene kuruluşu</strong>dur.
                </p>
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
              <h3 className="font-bold text-navy">Akreditasyonumuzu nasıl doğrularsınız?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Akreditasyon durumu, TÜRKAK&apos;ın kendi resmî kayıtları üzerinden
                doğrulanabilir. Akredite kuruluş sorgulaması için{" "}
                <a
                  href="https://www.turkak.org.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue underline"
                >
                  turkak.org.tr
                </a>{" "}
                adresindeki akredite kuruluş listesinden <strong>{KURUM.akreditasyon}</strong>{" "}
                numarasıyla arama yapabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BELGELER */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-[720px] text-center">
            <span className="chip">Belgelerimiz</span>
            <h2 className="mt-4 text-3xl font-black text-navy">Sertifika ve belgeler</h2>
          </div>

          {belgeler.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {belgeler.map((b) => {
                const icerik = (
                  <>
                    {b.gorsel && (
                      <span className="block aspect-[3/4] overflow-hidden rounded-xl border border-line bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.gorsel} alt={b.baslik} className="h-full w-full object-contain p-3" />
                      </span>
                    )}
                    <span className="mt-4 block font-bold text-navy">{b.baslik}</span>
                    {b.metin && <span className="mt-1 block text-sm text-muted">{b.metin}</span>}
                    {b.url && (
                      <span className="mt-3 block text-sm font-bold text-blue">Belgeyi aç →</span>
                    )}
                  </>
                );
                return (
                  <div key={b.id} className="card p-5">
                    {b.url ? (
                      <a href={b.url} target="_blank" rel="noopener noreferrer" className="block">
                        {icerik}
                      </a>
                    ) : (
                      icerik
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Panelden belge eklenene kadar gosterilen durum. Var olmayan belge iddia edilmiyor. */
            <div className="mx-auto max-w-[720px] rounded-card border border-line bg-white p-8 text-center">
              <p className="text-4xl" aria-hidden>📄</p>
              <h3 className="mt-3 text-lg font-bold text-navy">Belge görselleri hazırlanıyor</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Akreditasyon sertifikamızın ve diğer belgelerimizin kopyalarını talep üzerine
                paylaşıyoruz. Belge talebi için bizimle iletişime geçebilirsiniz.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/iletisim" className="btn-primary">Belge Talep Et</Link>
                <a href={`tel:${KURUM.telefonE164}`} className="btn-ghost">{KURUM.telefon}</a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEDEN ÖNEMLİ */}
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black text-navy">Akreditasyon neden önemli?</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Periyodik kontrol raporunuz, bir denetimde veya iş kazası sonrası incelemede
              delil niteliği taşır. Raporu düzenleyen kuruluşun yetkinliği tartışmaya açıksa,
              raporun kendisi de tartışmaya açılır.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Akreditasyon, kuruluşun teknik yeterliliğinin ve tarafsızlığının bağımsız bir
              kurum tarafından düzenli olarak denetlendiği anlamına gelir. A Tipi olmak ise
              muayene ettiğimiz ekipmanın satışı, montajı veya bakımıyla hiçbir ticari
              ilişkimizin bulunmadığını gösterir.
            </p>
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
