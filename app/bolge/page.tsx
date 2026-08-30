import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BOLGELER, KURUM } from "@/lib/site-data";
import { getLocations } from "@/lib/cms";
import { metinleriOku } from "@/lib/sayfa-metin";

/**
 * ⚠️ Aciklamadaki rakamlar ELLE yazilmisti ("7 bölge, 20 şehir") ve listeden
 * kopmustu: Tekirdağ eklendiginde sehir sayisi degisti ama arama sonucunda
 * gorunen metin eski kaldi. Artik listeden hesaplaniyor, bir daha bayatlamaz.
 * (Ayni sayilar sayfanin ust bandinda zaten hesaplanarak gosteriliyordu —
 * meta aciklamasi tek elle yazilan yerdi.)
 */
const SEHIR_SAYISI = BOLGELER.reduce((n, b) => n + b.iller.length, 0);

export const metadata: Metadata = {
  title: "Hizmet Bölgelerimiz",
  description:
    `İstanbul merkezli, Türkiye genelinde periyodik teknik kontrol ve muayene hizmeti. ` +
    `${BOLGELER.length} bölge, ${SEHIR_SAYISI} şehirde yerinde akredite muayene.`,
  alternates: { canonical: "/bolge" },
};

export default async function BolgeIndex() {
  const m = await metinleriOku();
  // Ayni sayi meta aciklamasinda da kullaniliyor; tek kaynak yukarida.
  const toplamIl = SEHIR_SAYISI;
  /**
   * Ayri sayfasi olan sehirler icin il adi -> slug eslemesi.
   *
   * ⚠️ Kaynak `getLocations()` (CMS), koddaki sabit LOCATIONS degil. Onceden
   * dogrudan LOCATIONS okunuyordu; panelden yeni bir bolge eklendiginde
   * `/bolge/<slug>` sayfasi olusuyor ama BU listede baglantisi cikmiyordu —
   * sayfa yalnizca sitemap uzerinden erisilebilir kaliyordu.
   *
   * Ilceler disarida: bu liste il bazli, ilcelerin kendi sayfalarina il
   * kartindan degil komsu bolge sayfalarindaki listeden gidiliyor.
   */
  const tumBolgeler = (await getLocations().catch(() => [])).filter((l) => l.aktif);
  const sayfaliIl = new Map(
    tumBolgeler.filter((l) => !l.ilce).map((l) => [l.il, l.slug])
  );

  /**
   * ILCE SAYFALARI — il kartlarindan AYRI bir bolum.
   *
   * ⚠️ Ustteki liste il bazli oldugu icin ilceler ona hic girmiyordu. 2026-08-30'da
   * sekiz Istanbul ilce sayfasi acilinca sorun gorunur hale geldi: `/bolge`
   * sitenin bolge merkezi ama Esenyurt, Tuzla, Umraniye sayfalarina oradan
   * gidilemiyordu. (Ic link aliyorlardi — 92 ekipman sayfasinin her biri tum
   * bolgelere link veriyor — ama gezinme akisinda kayiptilar.)
   *
   * Ile gore gruplaniyor: ileride baska bir ilin ilceleri eklenirse
   * kendiliginden kendi basligi altinda cikar.
   */
  const ilceler = tumBolgeler.filter((l) => l.ilce);
  const ilceGruplari = [
    ...ilceler
      .reduce((m, l) => {
        (m.get(l.il) ?? m.set(l.il, []).get(l.il)!).push(l);
        return m;
      }, new Map<string, typeof ilceler>())
      .entries(),
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Hizmet Bölgelerimiz", item: "https://bilgekontrol.com/bolge" },
    ],
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Periyodik Teknik Kontrol ve Muayene",
    provider: {
      "@type": "ProfessionalService",
      name: KURUM.ad,
      telephone: KURUM.telefonE164,
      hasCredential: { "@type": "EducationalOccupationalCredential", identifier: KURUM.akreditasyon },
    },
    areaServed: BOLGELER.flatMap((b) => b.iller.map((i) => ({ "@type": "City", name: i.il }))),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>{m("bolge_baslik")}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Hizmet Bölgelerimiz</h1>
          <p className="mt-3 max-w-3xl text-onnavy">{m("bolge_giris")}</p>
          {/* Sayilar giris yazisindan ayri: giris artik panelden duzenleniyor,
              rakamlar ise listeden otomatik hesaplaniyor ve guncel kaliyor. */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-onnavy">
            <span>🗺️ {BOLGELER.length} coğrafi bölge</span>
            <span>🏙️ {toplamIl} şehir</span>
            <span>🇹🇷 Yerinde muayene</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x space-y-10">
          {BOLGELER.map((b) => (
            <div key={b.ad}>
              <h2 className="text-2xl font-black text-navy">{b.ad}</h2>
              {b.not && <p className="mt-2 max-w-3xl text-muted">{b.not}</p>}
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {b.iller.map((i) => {
                  const slug = sayfaliIl.get(i.il);
                  const govde = (
                    <>
                      <span className="block font-bold text-navy">{i.il}</span>
                      <span className="mt-1 block text-sm text-muted">{i.aciklama}</span>
                    </>
                  );
                  return (
                    <div key={i.il} className="rounded-xl border border-line bg-white p-5">
                      {slug ? (
                        <Link href={`/bolge/${slug}`} className="group block transition hover:text-blue">
                          {govde}
                          <span className="mt-2 block text-xs font-bold text-blue">Ayrıntılı sayfa →</span>
                        </Link>
                      ) : (
                        govde
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Ilce sayfalari — il kartlari il bazli oldugu icin ayri bolum. */}
          {ilceGruplari.map(([il, liste]) => (
            <div key={il}>
              <h2 className="text-2xl font-black text-navy">{il} ilçeleri</h2>
              <p className="mt-2 max-w-3xl text-muted">
                {il}&apos;un tamamında yerinde muayene yapıyoruz. Aşağıdaki ilçeler için,
                bölgedeki sanayi yapısına ve orada en çok kontrol edilen ekipmanlara
                göre hazırlanmış ayrı sayfalarımız var.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {liste.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/bolge/${l.slug}`}
                    className="group rounded-xl border border-line bg-white p-5 transition hover:border-blue"
                  >
                    <span className="block font-bold text-navy group-hover:text-blue">{l.ilce}</span>
                    <span className="mt-1 block text-sm text-muted">{l.intro || l.description}</span>
                    <span className="mt-2 block text-xs font-bold text-blue">Ayrıntılı sayfa →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-8 text-center text-white">
            <h2 className="text-2xl font-black text-white">Şehriniz listede yok mu?</h2>
            <p className="mt-2 text-onnavy">
              Türkiye genelinde planlama yapıyoruz. Ekipman listenizi iletin, bölgenize uygun
              takvimi birlikte belirleyelim.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/teklif" className="rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5">Teklif Al →</Link>
              <Link href="/iletisim" className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10">İletişim</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
