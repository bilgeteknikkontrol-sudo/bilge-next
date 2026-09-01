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

  const adimlar = [m("degerlendir_adim1"), m("degerlendir_adim2"), m("degerlendir_adim3")];

  return (
    <>
      <Header />

      {/* ÜST BÖLÜM — tek iş, tek buton. Sayfada başka çağrı yok ki dikkat dağılmasın. */}
      <section className="bg-gradient-to-br from-herofrom to-heroto">
        <div className="container-x py-16 text-center md:py-20">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-white shadow-[0_18px_40px_-22px_color-mix(in_srgb,var(--color-navy)_35%,transparent)]">
            <GoogleG boyut={32} />
          </span>

          <h1 className="mt-6 text-3xl font-black leading-tight text-navy md:text-4xl">
            {m("degerlendir_baslik")}
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            {m("degerlendir_giris")}
          </p>

          <a
            href={link}
            target="_blank"
            /* ⚠️ noopener: target="_blank" ile açılan sayfa window.opener
               üzerinden bu sayfayı yönlendirebilir (tabnabbing). */
            rel="noopener noreferrer"
            className="btn-primary mt-8 px-8 py-4 text-base"
          >
            <GoogleG boyut={20} />
            {m("degerlendir_buton")}
          </a>

          <p className="mt-3 text-sm text-muted">{m("degerlendir_buton_not")}</p>
        </div>
      </section>

      {/* NASIL YAPILIR — çoğu kişi Google'da yorumu nereden yazacağını bilmiyor;
          üç adım, tıklama oranını doğrudan artırıyor. */}
      <section className="section">
        <div className="container-x max-w-3xl">
          <h2 className="text-center text-xl font-black text-navy">
            {m("degerlendir_adim_baslik")}
          </h2>

          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {adimlar.map((adim, i) => (
              <li key={i} className="card p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-soft text-sm font-black text-blue">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted">{adim}</p>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-10 max-w-xl text-center leading-relaxed text-muted">
            {m("degerlendir_tesekkur")}
          </p>

          {/* Güven şeridi + iletişim: müşteri doğru firmada olduğundan emin olsun.
              Paylaşılan bir bağlantıya tıklayan kişi için bu doğrulama önemli. */}
          <div className="mt-10 rounded-card border border-line bg-bgsoft p-6 text-center">
            <p className="text-sm font-bold text-navy">{KURUM.ad}</p>
            <p className="mt-1 text-sm text-muted">
              TÜRKAK {KURUM.akreditasyon} · {KURUM.standart}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              <a href={`tel:${b.telefonE164}`} className="font-bold text-blue hover:underline">
                {b.telefon}
              </a>
              <a href={`mailto:${b.eposta}`} className="text-muted hover:text-blue">
                {b.eposta}
              </a>
              <Link href="/iletisim" className="text-muted hover:text-blue">
                İletişim sayfası →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
