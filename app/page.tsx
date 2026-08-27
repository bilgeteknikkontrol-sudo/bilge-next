import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSettings, getEquipment, type Equipment } from "@/lib/cms";
// CMS Equipment tipinde gorsel alani yok; gorsel slug uzerinden statik haritadan gelir.
import { EKIPMAN_GORSEL } from "@/lib/images";
import { REFERANSLAR, EKIP, KURUM } from "@/lib/site-data";
import { KATEGORILER } from "@/lib/data";
// Hero arka plani: saha fotografi. Genis (1000x486) oldugu icin tam genislikte net kaliyor.
import heroGorsel from "../public/img/yangin-kontrolu.webp";

/** Kategori adi -> ikon. CMS kategori adi dondururken ikonu tasimadigi icin
 *  ikonlar statik veriden ad eslesmesiyle bulunur; bulunamazsa genel ikon kullanilir. */
const KATEGORI_IKON: Record<string, string> = Object.fromEntries(
  KATEGORILER.map((k) => [k.baslik, k.ikon])
);

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
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {/* Katman 1: gercek saha fotografi, koyu zeminle harmanlanmis */}
        <Image
          src={heroGorsel}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[.22]"
          placeholder="blur"
        />
        {/* Katman 2: metnin okunurlugunu garantileyen yonlu gradyan */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
        {/* Katman 3: sag ustte yumusak isik — duz zeminin monotonlugunu kiriyor */}
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(45,110,235,.55), transparent 70%)" }}
        />

        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[#cfe0ff] backdrop-blur-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent2 text-[.7rem] text-navy">✓</span>
              TÜRKAK Akredite A Tipi Muayene Kuruluşu · {KURUM.akreditasyon}
            </span>

            <h1 className="mt-6 font-black tracking-tight md:text-5xl" style={{ fontSize: "var(--fs-hero)", lineHeight: 1.08 }}>
              {heroTitle}
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#c7d6f0]">{heroSubtitle}</p>

            {/* Guven isaretleri: iddiadan once dogrulanabilir olgular */}
            <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
              {[
                ["🛡️", "Bağımsız ve tarafsız"],
                ["📋", "TS EN ISO/IEC 17020"],
                ["🇹🇷", "Türkiye geneli yerinde muayene"],
              ].map(([i, t]) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-[#c7d6f0]">
                  <span aria-hidden>{i}</span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/teklif" className="btn-primary px-7 py-3.5">Ücretsiz Teklif Al →</Link>
              <Link href="/hesapla" className="btn-ghost border-white/40 px-7 py-3.5 text-white hover:bg-white/10 hover:text-white">
                Yasal Sürenizi Hesaplayın
              </Link>
            </div>
          </div>

          {/* Sag kart: uc arac yerine tek net eylem + kanit */}
          <aside className="rounded-card border border-white/15 bg-white/[.07] p-7 backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#9db4de]">Kontrol zamanı geldi mi?</p>
            <h2 className="mt-2 text-2xl font-black leading-snug text-white">
              Ekipmanınızı seçin, kapsam ve fiyatı size dönelim
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#c7d6f0]">
              92 ekipman türünde akredite periyodik kontrol. Formu doldurmanız 2 dakika sürüyor.
            </p>
            <Link
              href="/teklif"
              className="mt-5 block rounded-xl bg-accent px-5 py-3.5 text-center font-bold text-navy transition hover:-translate-y-0.5"
            >
              Teklif Formunu Aç →
            </Link>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-6">
              {[
                ["2014", "Yılından beri"],
                ["500+", "Müşteri firma"],
                ["92", "Ekipman türü"],
                [KURUM.akreditasyon, "Akreditasyon no"],
              ].map(([b, s]) => (
                <div key={s}>
                  <b className="block text-xl leading-tight text-white">{b}</b>
                  <span className="text-[.78rem] text-[#9db4de]">{s}</span>
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
            <span className="chip">Hizmetlerimiz</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>Tüm İş Ekipmanınız Tek Çatı Altında</h2>
            <p className="mt-3 text-muted">TS EN ISO/IEC 17020 kapsamında, yasal mevzuata tam uyumlu ve uluslararası geçerli raporlar.</p>
          </div>
          {/* Ana sayfada en fazla 9 hizmet gosterilir; tamami /ekipman sayfasinda. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kategoriler.slice(0, 9).map(([kat, items]) => {
              const g = EKIPMAN_GORSEL[items[0].slug];
              return (
                <Link key={kat} href={`/ekipman/${items[0].slug}`} className="group card flex flex-col overflow-hidden transition hover:-translate-y-1">
                  {g && (
                    <span className="relative block aspect-[16/9] overflow-hidden bg-bgsoft">
                      <Image
                        src={g}
                        alt=""
                        aria-hidden
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        placeholder="blur"
                      />
                      <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-xl shadow">
                        {KATEGORI_IKON[kat] || "🛠️"}
                      </span>
                    </span>
                  )}
                  <span className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl text-navy group-hover:text-blue">{kat}</h3>
                    <span className="mt-1 block text-sm text-muted">{items.length} ekipman türü · {items[0].standart} ve ilgili standartlar</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/ekipman" className="btn-ghost">Tüm Hizmetleri Gör ({equipment.length})</Link>
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

          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {REFERANSLAR.map((r) => (
              <li key={r.name} className="flex h-24 items-center justify-center rounded-xl border border-line bg-white p-4">
                <Image
                  src={r.logo}
                  alt={r.name}
                  sizes="200px"
                  className="max-h-14 w-auto object-contain opacity-80 transition hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EKİP */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-[720px] text-center">
            <span className="chip">Uzman Kadro</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>
              Raporunuzun arkasında gerçek mühendisler var
            </h2>
            <p className="mt-3 text-muted">
              Muayeneleriniz, kendi alanında yetkili mühendis kadromuz tarafından yerinde yapılır;
              rapor bu kişilerin teknik değerlendirmesine dayanır.
            </p>
          </div>
          <div className="mx-auto grid max-w-[820px] gap-5 sm:grid-cols-3">
            {EKIP.map((u) => (
              <div key={u.name} className="card p-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-soft text-2xl">👷</div>
                <h3 className="text-lg text-navy">{u.name}</h3>
                <p className="mt-1 text-sm text-muted">{u.title}</p>
              </div>
            ))}
          </div>
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
