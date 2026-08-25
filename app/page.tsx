import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { KATEGORILER } from "@/lib/data";
import { slugify } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy2 to-navy text-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-[#cfe0ff]">
              🛡️ TÜRKAK Akredite A Tipi Muayene Kuruluşu
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
              İş Ekipmanınızın Güvenliği, Kanıtlanmış Uzmanlıkla
            </h1>
            <p className="mt-4 text-lg text-[#c7d6f0]">
              Basınçlı kap, kaldırma, elektrik, yangın ve iş makineleri periyodik kontrolünü
              uluslararası geçerli raporlarla belgeliyoruz. Rakiplerden farklı olarak;{" "}
              <b>online teklif</b>, <b>yasal süre hesaplayıcı</b> ve{" "}
              <b>müşteri rapor portalı</b> ile süreci şeffaf yönetiyoruz.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/teklif" className="rounded-full bg-accent px-7 py-3.5 font-bold text-navy transition hover:-translate-y-0.5">
                Ücretsiz Teklif Al →
              </Link>
              <Link href="/hesapla" className="rounded-full border border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10">
                Süremi Hesapla
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <h3 className="text-white">Haydi başlayalım</h3>
            <p className="text-sm text-[#c7d6f0]">Aşağıdaki araçlardan biriyle 2 dakikada ilerleyin:</p>
            <div className="mt-3 grid gap-2.5">
              <Link href="/teklif" className="rounded-xl bg-blue px-5 py-3 font-bold text-white">📝 Online Teklif &amp; Randevu</Link>
              <Link href="/hesapla" className="rounded-xl border border-white/40 px-5 py-3 font-bold text-white">📅 Yasal Süre Hesaplayıcı</Link>
              <Link href="/portal" className="rounded-xl border border-white/40 px-5 py-3 font-bold text-white">🔎 Rapor Sorgulama</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[["2014", "Yılından beri"], ["10.000+", "Tamamlanan muayene"], ["500+", "Müşteri firma"], ["AB-0296-M", "Akreditasyon no"]].map(([b, s]) => (
                <div key={s} className="rounded-xl bg-white/10 p-4">
                  <b className="block text-xl">{b}</b>
                  <span className="text-[.8rem] text-[#b9cae8]">{s}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* HİZMETLER */}
      <section id="hizmetler" className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="inline-flex rounded-full bg-[#fff4e0] px-4 py-1.5 text-sm font-bold text-[#b9791a]">Zorunlu Periyodik Muayeneler</span>
            <h2 className="mt-4 text-3xl font-black text-navy md:text-4xl">Tüm İş Ekipmanınız Tek Çatı Altında</h2>
            <p className="mt-3 text-muted">TS EN ISO/IEC 17020 kapsamında, yasal mevzuata tam uyumlu ve uluslararası geçerli raporlar.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {KATEGORILER.map((kat) => (
              <Link key={kat.baslik} href={`/ekipman/${slugify(kat.ekipmanlar[0].ad)}`} className="group rounded-card border border-line bg-white p-6 shadow-[0_10px_30px_-12px_rgba(11,31,58,.25)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(11,31,58,.35)]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft text-2xl text-blue">{kat.ikon}</div>
                <h3 className="text-xl group-hover:text-blue">{kat.baslik}</h3>
                <p className="mt-1 text-sm">{kat.ekipmanlar.length} ekipman türü · {kat.ekipmanlar[0].standart} ve ilgili standartlar</p>
              </Link>
            ))}
          </div>
          <div className="mt-9 text-center">
            <Link href="/teklif" className="rounded-full bg-blue px-8 py-3.5 font-bold text-white shadow-[0_12px_24px_-10px_rgba(28,95,214,.7)] transition hover:-translate-y-0.5">
              Ekipmanınızı Seçip Teklif Alın
            </Link>
          </div>
        </div>
      </section>

      {/* FARK */}
      <section className="bg-bgsoft py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="inline-flex rounded-full bg-[#e2faf2] px-4 py-1.5 text-sm font-bold text-[#0c8f6e]">Neden Bilge?</span>
            <h2 className="mt-4 text-3xl font-black text-navy md:text-4xl">Rakiplerden Ayıran 4 Fark</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["📝", "Online Teklif Sistemi", "Ekipmanınızı seçin, saniyeler içinde ön bilgi ve randevu talebi oluşturun."],
              ["📅", "Yasal Süre Hesaplayıcı", "Son kontrol tarihini girin; bir sonraki yasal tarihi ve gecikme riskini anında görün."],
              ["🔎", "Müşteri Rapor Portalı", "Rapor numaranızla geçmişinizi, geçerliliği ve yenileme hatırlatmasını görüntüleyin."],
              ["🛡️", "Bağımsız Akreditasyon", "TÜRKAK AB-0296-M ile tarafsız, denetimlerde sorunsuz kabul gören raporlar."],
            ].map(([i, t, d]) => (
              <div key={t} className="rounded-card border border-line bg-white p-6 shadow-[0_10px_30px_-12px_rgba(11,31,58,.25)]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft text-2xl text-blue">{i}</div>
                <h3 className="text-lg">{t}</h3>
                <p className="mt-1 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="inline-flex rounded-full bg-blue-soft px-4 py-1.5 text-sm font-bold text-blue">Süreç</span>
            <h2 className="mt-4 text-3xl font-black text-navy md:text-4xl">4 Adımda Güvenli Kontrol</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              ["Talep ve Sözleşme", "İSG-KATİP üzerinden hizmet sözleşmesi oluşturulur, ekipman envanteri alınır."],
              ["Yerinde Muayene", "Uzman mühendis kadro ile ekipmanınızda test, deney ve görsel muayene yapılır."],
              ["Akredite Rapor", "TS EN ISO/IEC 17020 kapsamında e-imzalı, uluslararası geçerli rapor düzenlenir."],
              ["Takip ve Hatırlatma", "Rapor portalı ile bir sonraki kontrol tarihinizde size hatırlatma yapılır."],
            ].map(([t, d], i) => (
              <div key={t} className="flex gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-navy font-bold text-white">{i + 1}</div>
                <div>
                  <h3 className="text-lg">{t}</h3>
                  <p className="mt-1 text-sm">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-navy to-navy2 py-16 text-center text-white">
        <div className="mx-auto max-w-[680px] px-5">
          <h2 className="text-3xl font-black">İş Güvenliğinizi Sıraya Koymayın</h2>
          <p className="mt-3 text-[#c7d6f0]">2 dakikada online teklif alın veya yasal sürenizi hesaplayın. TÜRKAK akredite farkıyla tanışın.</p>
          <Link href="/teklif" className="mt-5 inline-block rounded-full bg-accent px-8 py-3.5 font-bold text-navy transition hover:-translate-y-0.5">
            Hemen Başla →
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                "name": "Periyodik kontrol neden zorunludur?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "6331 Sayılı İSG Kanunu ve İş Ekipmanları Yönetmeliği (Ek-III) gereği iş ekipmanları uzmanlarca belirli aralıklarla muayene edilmelidir. Yaptırılmadığında idari para cezası ve işin durdurulması riski doğar.",
                },
              },
              {
                "@type": "Question",
                "name": "Bilge Teknik Kontrol akredite midir?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evet. TÜRKAK tarafından TS EN ISO/IEC 17020 standardına göre AB-0296-M numarasıyla akredite edilmiş bağımsız A Tipi muayene kuruluşudur.",
                },
              },
              {
                "@type": "Question",
                "name": "Raporlarımı nasıl takip edebilirim?",
                acceptedAnswer: {
                  "@type": "Answer",
                  "text": "Müşteri Rapor Portalı ile rapor numaranızı girerek kontrol geçmişinizi, geçerlilik tarihini ve yenileme hatırlatmasını görüntüleyebilirsiniz.",
                },
              },
            ],
          }),
        }}
      />

      <Footer />
    </>
  );
}
