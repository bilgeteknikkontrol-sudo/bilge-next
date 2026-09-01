import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSettings } from "@/lib/cms";
import { metinleriOku } from "@/lib/sayfa-metin";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import { KURUM } from "@/lib/site-data";

/**
 * DEĞERLENDİRME SAYFASI — /degerlendir
 *
 * ⚠️ NEDEN VAR: bu adres müşteriye ELDEN gönderiliyor (rapor teslim e-postası,
 * WhatsApp, imza). "bilgekontrol.com/degerlendir" yazmak, Google'ın uzun
 * `g.page/r/CR3l…` bağlantısını yapıştırmaktan iki bakımdan iyi:
 *   - müşteri tanıdığı alan adını görüyor, bağlantı güvenilir duruyor
 *   - telefonda okunabiliyor, kartvizite/rapora yazılabiliyor
 *
 * İletişim sayfasındaki kutu Google'a DOĞRUDAN gidiyor (orada bir adım fazla
 * atlatmanın anlamı yok); burası ise paylaşım için yapılmış duran sayfa.
 */

/**
 * ⚠️ Sitedeki diger sayfalar ISR ile onbellekleniyor; bu sayfa BILEREK dinamik.
 *
 * Sayfa, panelden girilen yorum baglantisina bagli: baglanti yoksa `notFound()`
 * calisiyor. ISR ile uretilseydi, DERLEME aninda veritabanina bir an
 * ulasilamadigi durumda sayfa 404 olarak PISIRILIR ve o hali onbellekte
 * kalirdi — musteriye gonderilmis bir baglantinin 404 vermesi, kazanilacak
 * yorumdan cok daha pahali.
 *
 * Maliyeti onemsiz: bu sayfa arama motoruna kapali ve yalnizca elden
 * paylasildiginda aciliyor, yani trafigi cok dusuk. Istek basina tek bir
 * ayar okumasi (~20 ms) kabul edilebilir.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bizi Değerlendirin",
  description:
    "Bilge Teknik Kontrol'ün periyodik kontrol hizmetiyle ilgili deneyiminizi Google'da paylaşın.",
  alternates: { canonical: "/degerlendir" },
  /**
   * ⚠️ ARAMA MOTORUNA KAPALI — bilerek.
   *
   * Tek işi olan, birkaç cümlelik bir yönlendirme sayfası. İndekslenirse
   * "ince içerik" sayılır ve arama sonucunda işi olmayan bir sayfa çıkar.
   * `follow` açık bırakıldı: sayfadaki iç bağlantılar taranabilsin.
   * Aynı sebeple site haritasına da EKLENMEDİ (bkz. app/sitemap.ts).
   */
  robots: { index: false, follow: true },
};

/** Google'ın resmi dört renkli "G" işareti. */
function GoogleG({ boyut = 28 }: { boyut?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={boyut} height={boyut} aria-hidden focusable="false">
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.57-5.17 3.57-8.87z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.86-3c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

export default async function DegerlendirPage() {
  const m = await metinleriOku();
  const b = await iletisimBilgi();
  const ayarlar = await getSettings().catch(() => null);
  const link = ayarlar?.googleYorumLinki?.trim();

  /**
   * ⚠️ Bağlantı girilmemişse sayfa HİÇ AÇILMAZ.
   *
   * Alternatifi, butonsuz bir "bizi değerlendirin" sayfası olurdu — müşteriye
   * gönderilip tıklanacak yeri olmayan bir sayfa, hiç olmamasından kötüdür.
   * Bağlantı Admin > İletişim ekranından girilir.
   */
  if (!link) notFound();

  return (
    <>
      <Header />

      {/*
        TEK BÖLÜM — kart, lacivert panelin üzerinde duruyor.

        Önceki hâli soluk bir gradyan üzerinde üç ayrı bloktu (üst bölüm,
        yalnız kalmış teşekkür satırı, gri künye kutusu) ve dağınık duruyordu.
        Artık tek bir odak var: kart. Sitenin kendi tasarım dili kullanıldı —
        lacivert zemin (diğer sayfa başlıklarıyla aynı), beyaz kart, turuncu
        vurgu. Yeni bir görsel dil icat edilmedi.
      */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy to-navy2">
        {/* Kartın arkasında yumuşak bir aydınlanma — zemini düz bir blok
            olmaktan çıkarıyor. Salt dekor, içeriği etkilemiyor. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-70"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--color-blue) 45%, transparent), transparent 70%)",
          }}
        />

        <div className="container-x relative py-16 md:py-24">
          <div className="mx-auto max-w-xl">
            {/* Google işareti kartın üst kenarına biniyor: kartı zeminden
                ayıran ve bakışı en tepeye çeken küçük bir ayrıntı. */}
            <div className="flex justify-center">
              <span className="relative z-10 flex h-16 w-16 translate-y-8 items-center justify-center rounded-full border border-line bg-white shadow-[0_16px_36px_-14px_color-mix(in_srgb,var(--color-navy)_70%,transparent)]">
                <GoogleG boyut={30} />
              </span>
            </div>

            <div className="rounded-[28px] bg-white px-6 pb-8 pt-14 text-center shadow-[0_40px_80px_-30px_rgba(0,0,0,.45)] sm:px-10">
              {/*
                ⚠️ Yıldızlar BOŞ (yalnızca çerçeve) — bilerek.
                Dolu yıldız "bizim puanımız 5" iddiası gibi okunur; bu sayfada
                puan bildirmiyoruz (kendi sitesinde kendi işletmesi hakkında
                puan yayınlamak Google kurallarına aykırı). Boş yıldız
                "doldurmanızı bekliyoruz" demek — davet, iddia değil.
              */}
              <div className="flex justify-center gap-1.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M12 3.5l2.6 5.55 5.9.83-4.3 4.3 1.05 6.07L12 17.4l-5.25 2.85L7.8 14.18l-4.3-4.3 5.9-.83L12 3.5z" />
                  </svg>
                ))}
              </div>

              <h1 className="mt-5 text-2xl font-black leading-tight text-navy sm:text-3xl">
                {m("degerlendir_baslik")}
              </h1>

              <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
                {m("degerlendir_giris")}
              </p>

              <a
                href={link}
                target="_blank"
                /* ⚠️ noopener: target="_blank" ile açılan sayfa window.opener
                   üzerinden bu sayfayı yönlendirebilir (tabnabbing). */
                rel="noopener noreferrer"
                className="btn-primary mt-7 w-full px-8 py-4 text-base sm:w-auto"
              >
                <GoogleG boyut={20} />
                {m("degerlendir_buton")}
              </a>

              <p className="mt-3 text-sm text-muted">{m("degerlendir_buton_not")}</p>

              <p className="mt-7 border-t border-line pt-6 text-sm leading-relaxed text-muted">
                {m("degerlendir_tesekkur")}
              </p>
            </div>

            {/* Künye kartın DIŞINDA, lacivert üzerinde: paylaşılan bir
                bağlantıya tıklayan kişi doğru firmada olduğunu görsün ama
                bu bilgi butonla yarışmasın. */}
            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-white">{KURUM.ad}</p>
              <p className="mt-1 text-sm text-onnavydim">
                TÜRKAK {KURUM.akreditasyon} · {KURUM.standart}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
                <a href={`tel:${b.telefonE164}`} className="font-bold text-white hover:underline">
                  {b.telefon}
                </a>
                <a href={`mailto:${b.eposta}`} className="text-onnavy hover:text-white">
                  {b.eposta}
                </a>
                <Link href="/iletisim" className="text-onnavy hover:text-white">
                  İletişim sayfası →
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
