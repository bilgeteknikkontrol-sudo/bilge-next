import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CihazSimge from "../components/CihazSimge";
import { CIHAZ_GRUPLARI, CIHAZ_SAYISI, type Cihaz } from "@/lib/cihazlar";
import { KURUM } from "@/lib/site-data";

/**
 * OLCUM CIHAZLARIMIZ
 *
 * ⚠️ DUZEN: kullanicinin istegi — SOLDA elektrik, SAGDA mekanik, her cihaz
 * ayri kutu, kutunun ustunde gorsel, altinda kisa maddeler. Mobilde iki
 * sutun yan yana sigmadigi icin alt alta diziliyor; sira degismiyor
 * (once elektrik, sonra mekanik).
 *
 * ⚠️ Kutulardaki cizimler bu proje icin yazilmis SVG simgeler
 * (app/components/CihazSimge.tsx). Uretici/satici urun fotograflari telif
 * korumali oldugu icin kullanilmadi. Kendi cekilmis fotograf eklendiginde
 * `Cihaz.gorsel` doldurulur; kutu kendiliginden fotografa geciyor, burada
 * degisiklik gerekmiyor.
 *
 * Veri: lib/cihazlar.ts
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  // ⚠️ 160 karakter siniri: ilk yazimda 161 idi ve canlida olculdu.
  // Google fazlasini kirpiyor, aciklama cumlenin ortasinda kesiliyor.
  title: "Ölçüm Cihazlarımız",
  description:
    "Periyodik kontrollerde sahada kullandığımız ölçüm cihazları: termal kamera, tesisat test cihazı, topraklama ölçer, dedektör testi ve basınç pompaları.",
  alternates: { canonical: "/cihazlar" },
};

function CihazKutusu({ c }: { c: Cihaz }) {
  return (
    <li className="rounded-card border border-line bg-white p-5">
      {/* Gorsel alani: fotograf varsa fotograf, yoksa cizim. Oran sabit
          oldugu icin fotograf eklendiginde kutu zipllamiyor. */}
      <div className="flex aspect-[5/3] items-center justify-center overflow-hidden rounded-xl bg-bgsoft">
        {c.gorsel ? (
          <Image
            src={c.gorsel}
            alt={c.ad}
            width={420}
            height={252}
            className="h-full w-full object-contain"
          />
        ) : (
          <CihazSimge tip={c.tip} className="h-20 w-20 text-blue" />
        )}
      </div>

      <h3 className="mt-4 font-bold leading-snug text-navy">
        {c.ad}
        {c.adet && c.adet > 1 && (
          <span className="ml-2 whitespace-nowrap rounded-full border border-accent/40 px-2 py-0.5 text-xs font-semibold text-muted">
            {c.adet} adet
          </span>
        )}
      </h3>

      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
        {c.ozellikler.map((o) => (
          <li key={o} className="flex gap-2">
            <span aria-hidden className="mt-[.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

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
        <div className="mx-auto max-w-[1200px] px-5">
          {/* ⚠️ "Duzenli olarak" yaziyordu; kullanici 2026-09-02'de periyodu
              verdi: yilda bir. Somut sure, belirsiz ifadeden daha guclu bir
              guven sinyali. Periyot degisirse burasi guncellenir. */}
          <p className="max-w-3xl text-lg font-medium leading-relaxed text-ink">
            Ölçüm cihazlarımız <strong>yılda bir kez kalibre edilir</strong> ve kalibrasyon
            kayıtları saklanır. Raporda yer alan her değer, aşağıdaki cihazlarla sahada bizzat
            alınmış ölçümlerden gelir.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {CIHAZ_GRUPLARI.map((grup) => (
              <div key={grup.baslik}>
                <h2 className="text-2xl font-black text-navy">{grup.baslik}</h2>
                <p className="mt-2 leading-relaxed text-muted">{grup.aciklama}</p>

                <ul className="mt-5 space-y-5">
                  {grup.cihazlar.map((c) => (
                    <CihazKutusu key={c.ad} c={c} />
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

          <div className="mt-12 max-w-3xl rounded-card border border-line bg-bgsoft p-6">
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

          <p className="mt-8 max-w-3xl text-sm text-muted">
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
