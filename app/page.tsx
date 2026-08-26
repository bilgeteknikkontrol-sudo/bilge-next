import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSettings, getEquipment, type Equipment } from "@/lib/cms";

export const dynamic = "force-dynamic";

const AVANTAJLAR = [
  ["📝", "Online Teklif Sistemi", "Ekipmanınızı seçin, saniyeler içinde ön bilgi ve randevu talebi oluşturun."],
  ["📅", "Yasal Süre Hesaplayıcı", "Son kontrol tarihini girin; bir sonraki yasal tarihi ve gecikme riskini anında görün."],
  ["🔎", "Müşteri Rapor Portalı", "Rapor numaranızla geçmişinizi, geçerliliği ve yenileme hatırlatmasını görüntüleyin."],
  ["🛡️", "Bağımsız Akreditasyon", "TÜRKAK AB-0296-M ile tarafsız, denetimlerde sorunsuz kabul gören raporlar."],
];

const SUREC = [
  ["Talep ve Sözleşme", "İSG-KATİP üzerinden hizmet sözleşmesi oluşturulur, ekipman envanteri alınır."],
  ["Yerinde Muayene", "Uzman mühendis kadro ile ekipmanınızda test, deney ve görsel muayene yapılır."],
  ["Akredite Rapor", "TS EN ISO/IEC 17020 kapsamında e-imzalı, uluslararası geçerli rapor düzenlenir."],
  ["Takip ve Hatırlatma", "Rapor portalı ile bir sonraki kontrol tarihinizde size hatırlatma yapılır."],
];

function groupByKategori(items: Equipment[]) {
  const map = new Map<string, Equipment[]>();
  for (const e of items) {
    if (!map.has(e.kategori)) map.set(e.kategori, []);
    map.get(e.kategori)!.push(e);
  }
  return Array.from(map.entries());
}

export default async function Home() {
  const settings = await getSettings().catch(() => null);
  const equipment = await getEquipment().catch(() => []);
  const kategoriler = groupByKategori(equipment.filter((e) => e.aktif));

  const heroTitle = settings?.heroTitle || "İş Ekipmanınızın Güvenliği, Kanıtlanmış Uzmanlıkla";
  const heroSubtitle =
    settings?.heroSubtitle ||
    "Basınçlı kap, kaldırma, elektrik, yangın ve iş makineleri periyodik kontrolünü uluslararası geçerli raporlarla belgeliyoruz.";
  const aboutTitle = settings?.aboutTitle || "2014'ten beri iş güvenliğinin yanında";
  const aboutText =
    settings?.aboutText ||
    "Bilge Teknik Kontrol; iş ekipmanlarının periyodik kontrolünde TÜRKAK akreditasyonuyla (AB-0296-M) bağımsız, tarafsız ve yasal olarak geçerli raporlar sunar.";
  const ctaTitle = settings?.ctaTitle || "İş Güvenliğinizi Sıraya Koymayın";
  const ctaText =
    settings?.ctaText ||
    "2 dakikada online teklif alın veya yasal sürenizi hesaplayın. TÜRKAK akredite farkıyla tanışın.";

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy2 to-navy text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <span className="chip bg-white/10 text-[#cfe0ff]">🛡️ TÜRKAK Akredite A Tipi Muayene Kuruluşu · AB-0296-M</span>
            <h1 className="mt-5 font-black tracking-tight md:text-5xl" style={{ fontSize: "var(--fs-hero)", lineHeight: 1.1 }}>
              {heroTitle}
            </h1>
            <p className="mt-4 text-lg text-[#c7d6f0]">{heroSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/teklif" className="btn-primary">Ücretsiz Teklif Al →</Link>
              <Link href="/hesapla" className="btn-ghost border-white/40 text-white hover:bg-white/10 hover:text-white">Süremi Hesapla</Link>
            </div>
          </div>

          <aside className="card border-white/15 bg-white/10 p-6 text-white backdrop-blur-md">
            <h3 className="text-lg font-bold">Haydi başlayalım</h3>
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

      {/* HAKKINDA */}
      <section id="hakkinda" className="section">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="chip">Kurumsal</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>{aboutTitle}</h2>
            <p className="mt-4 text-muted">{aboutText}</p>
            <p className="mt-3 text-muted">
              Amacımız yalnızca bir kontrol belgesi vermek değil; işletmenizin İSG risklerini azaltmak
              ve yasal yükümlülüklerini zamanında karşılamasını sağlamaktır.
            </p>
            <Link href="/yazilar" className="btn-ghost mt-5">Bilgi Merkezi →</Link>
          </div>
          <div className="card grid grid-cols-2 gap-4 p-6">
            {[["TS EN ISO/IEC 17020", "Akreditasyon standardı"], ["6331 İSG Kanunu", "Yasal dayanak"], ["Ek-III Yönetmeliği", "Periyodik muayene aralıkları"], ["İSG-KATİP", "Resmî sözleşme entegrasyonu"]].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-bgsoft p-4">
                <b className="block text-navy">{t}</b>
                <span className="text-xs text-muted">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section id="hizmetler" className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="chip">Zorunlu Periyodik Muayeneler</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>Tüm İş Ekipmanınız Tek Çatı Altında</h2>
            <p className="mt-3 text-muted">TS EN ISO/IEC 17020 kapsamında, yasal mevzuata tam uyumlu ve uluslararası geçerli raporlar.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kategoriler.map(([kat, items]) => (
              <Link key={kat} href={`/ekipman/${items[0].slug}`} className="group card flex flex-col p-6 transition hover:-translate-y-1">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft text-2xl text-blue">🛠️</div>
                <h3 className="text-xl text-navy group-hover:text-blue">{kat}</h3>
                <p className="mt-1 text-sm text-muted">{items.length} ekipman türü · {items[0].standart} ve ilgili standartlar</p>
              </Link>
            ))}
          </div>
          <div className="mt-9 text-center">
            <Link href="/teklif" className="btn-primary">Ekipmanınızı Seçip Teklif Alın</Link>
          </div>
        </div>
      </section>

      {/* NEDEN BİZ */}
      <section id="neden" className="section">
        <div className="container-x">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="chip">Neden Bilge?</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>Rakiplerden Ayıran 4 Fark</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AVANTAJLAR.map(([i, t, d]) => (
              <div key={t} className="card p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft text-2xl text-blue">{i}</div>
                <h3 className="text-lg text-navy">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="chip">Süreç</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>4 Adımda Güvenli Kontrol</h2>
          </div>
          <div className="mx-auto grid max-w-[820px] gap-6 md:grid-cols-2">
            {SUREC.map(([t, d], i) => (
              <div key={t} className="flex gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-navy font-bold text-white">{i + 1}</div>
                <div>
                  <h3 className="text-lg text-navy">{t}</h3>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERANSLAR */}
      <section id="referans" className="section">
        <div className="container-x text-center">
          <span className="chip">Referanslarımız</span>
          <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>500+ firma bize güveniyor</h2>
          <p className="mx-auto mt-3 max-w-[640px] text-muted">
            Üretimden lojistiğe, enerjiden kamuya kadar birçok sektörde; periyodik kontrol ve
            akreditasyon raporlarıyla iş ortaklarımızın yasal yükümlülüklerini güvence altına alıyoruz.
          </p>
        </div>
      </section>

      {/* AKREDİTASYON */}
      <section id="akreditasyon" className="section bg-bgsoft">
        <div className="container-x">
          <div className="card mx-auto max-w-[820px] flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-3xl text-accent2">✓</div>
            <div>
              <h2 className="text-2xl font-black text-navy">TÜRKAK Akreditasyon No: AB-0296-M</h2>
              <p className="mt-2 text-muted">
                TS EN ISO/IEC 17020 standardına göre akredite edilmiş bağımsız A Tipi muayene kuruluşuyuz.
                Raporlarımız Çalışma Bakanlığı denetimlerinde ve ihale süreçlerinde geçerlidir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-navy to-navy2 py-16 text-center text-white">
        <div className="container-x mx-auto max-w-[680px]">
          <h2 className="font-black" style={{ fontSize: "var(--fs-h2)" }}>{ctaTitle}</h2>
          <p className="mt-3 text-[#c7d6f0]">{ctaText}</p>
          <Link href="/teklif" className="btn-primary mt-5 bg-accent text-navy hover:bg-amber-soft">Hemen Başla →</Link>
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
                name: "Periyodik kontrol neden zorunludur?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "6331 Sayılı İSG Kanunu ve İş Ekipmanları Yönetmeliği (Ek-III) gereği iş ekipmanları uzmanlarca belirli aralıklarla muayene edilmelidir. Yaptırılmadığında idari para cezası ve işin durdurulması riski doğar.",
                },
              },
              {
                "@type": "Question",
                name: "Bilge Teknik Kontrol akredite midir?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Evet. TÜRKAK tarafından TS EN ISO/IEC 17020 standardına göre AB-0296-M numarasıyla akredite edilmiş bağımsız A Tipi muayene kuruluşudur.",
                },
              },
              {
                "@type": "Question",
                name: "Raporlarımı nasıl takip edebilirim?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Müşteri Rapor Portalı ile rapor numaranızı girerek kontrol geçmişinizi, geçerlilik tarihini ve yenileme hatırlatmasını görüntüleyebilirsiniz.",
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
