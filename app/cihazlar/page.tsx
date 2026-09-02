import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CIHAZ_GRUPLARI, CIHAZ_SAYISI } from "@/lib/cihazlar";
import { KURUM } from "@/lib/site-data";

/**
 * OLCUM CIHAZLARIMIZ
 *
 * ⚠️ Sayfa bilerek SADE: tek sutun, gruplanmis kartlar, her cihaz icin tek
 * cumle. Kullanicinin istegi "cok kafa karistirmadan" idi; teknik bir
 * listede tablo/ikon/rozet kalabaligi okumayi zorlastirir, guveni artirmaz.
 *
 * ⚠️ Cihaz fotografi KONULMADI. Uretici ve satici sitelerindeki urun
 * gorselleri telif korumali; ticari bir sitede izinsiz kullanilamaz.
 * Sahada cekilmis kendi fotograflarimiz geldiginde her karta gorsel alani
 * eklenebilir — o fotograflar zaten stok gorselden daha ikna edici olur.
 *
 * Veri: lib/cihazlar.ts
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ölçüm Cihazlarımız",
  description:
    "Periyodik kontrollerde sahada kullandığımız ölçüm cihazları: termal kamera, tesisat test cihazı, topraklama ölçer, dedektör test cihazı ve basınç test pompaları.",
  alternates: { canonical: "/cihazlar" },
};

export default function CihazlarPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Ölçüm Cihazlarımız", item: "https://bilgekontrol.com/cihazlar" },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-12 text-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>Ölçüm Cihazlarımız</span>
          </nav>
          <h1 className="max-w-3xl text-3xl font-black md:text-4xl">Ölçüm Cihazlarımız</h1>
          <p className="mt-3 max-w-2xl text-onnavy">
            Bir periyodik kontrol raporu, arkasındaki ölçüm kadar sağlamdır. Sahaya çıkarken
            kullandığımız {CIHAZ_SAYISI} cihazı ve her birinin ne işe yaradığını burada açıkça
            paylaşıyoruz.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[900px] px-5">
          <p className="text-lg font-medium leading-relaxed text-ink">
            Ölçüm cihazları, akreditasyon şartları gereği düzenli olarak kalibre edilir ve
            kalibrasyon kayıtları saklanır. Raporda yer alan her değer, aşağıdaki cihazlarla
            sahada bizzat alınmış ölçümlerden gelir.
          </p>

          <div className="mt-10 space-y-12">
            {CIHAZ_GRUPLARI.map((grup) => (
              <div key={grup.baslik}>
                <h2 className="text-2xl font-black text-navy">{grup.baslik}</h2>
                <p className="mt-2 leading-relaxed text-muted">{grup.aciklama}</p>

                <ul className="mt-5 space-y-4">
                  {grup.cihazlar.map((c) => (
                    <li key={c.ad} className="rounded-card border border-line bg-white p-5">
                      <h3 className="font-bold text-navy">
                        {c.ad}
                        {c.adet && c.adet > 1 && (
                          <span className="ml-2 rounded-full border border-accent/40 px-2 py-0.5 text-xs font-semibold text-muted">
                            {c.adet} adet
                          </span>
                        )}
                      </h3>
                      <p className="mt-2 leading-relaxed text-muted">{c.ozet}</p>
                    </li>
                  ))}
                </ul>

                {grup.hizmet && (
                  <p className="mt-4 text-sm text-muted">
                    İlgili hizmet:{" "}
                    <Link href={grup.hizmet.yol} className="font-semibold text-blue hover:underline">
                      {grup.hizmet.ad}
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-card border border-line bg-bgsoft p-6">
            <h2 className="text-lg font-bold text-navy">Cihaz listesi neden önemli?</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Aynı kontrol, farklı cihazlarla farklı derinlikte yapılabilir. Örneğin bir pano
              kontrolü gözle de yapılabilir, termal kamerayla da; ikincisi henüz arıza vermemiş
              bir ısınmayı da yakalar. Teklifleri karşılaştırırken ölçümün hangi cihazla
              yapılacağını sormanızı öneririz.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/teklif" className="btn-primary">Teklif Al →</Link>
              <Link href="/sertifikalar" className="btn-ghost">Akreditasyon Belgelerimiz</Link>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted">
            Kontrol edilecek ekipmanınız listede olmayan özel bir ölçüm gerektiriyorsa{" "}
            <Link href="/iletisim" className="font-semibold text-blue hover:underline">
              bize ulaşın
            </Link>
            {KURUM.telefon ? ` veya ${KURUM.telefon} numarasından arayın.` : "."}
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
