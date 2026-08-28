import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ReferansSeridi from "./components/ReferansSeridi";
import HeroSlayt from "./components/HeroSlayt";
import { getSettings, getEquipment, type Equipment } from "@/lib/cms";
import { bloklar } from "@/lib/bloklar";
// CMS Equipment tipinde gorsel alani yok; gorsel slug uzerinden statik haritadan gelir.
import { EKIPMAN_GORSEL } from "@/lib/images";
import { EKIP, KURUM } from "@/lib/site-data";
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
  ["📊", "Kontrol Süreleri Tablosu", "Hangi ekipmanın hangi standarda göre ne sıklıkla kontrol edileceğini tek tabloda görün."],
  ["🛡️", "Bağımsız Akreditasyon", "TÜRKAK AB-0296-M ile tarafsız, denetimlerde sorunsuz kabul gören raporlar."],
];

const SUREC = [
  ["Talep ve Sözleşme", "İSG-KATİP üzerinden hizmet sözleşmesi oluşturulur, ekipman envanteri alınır."],
  ["Yerinde Muayene", "Uzman mühendis kadro ile ekipmanınızda test, deney ve görsel muayene yapılır."],
  ["Akredite Rapor", "TS EN ISO/IEC 17020 kapsamında e-imzalı, uluslararası geçerli rapor düzenlenir."],
  ["Takip ve Hatırlatma", "Bir sonraki yasal kontrol tarihiniz kayda alınır, süre dolmadan size hatırlatılır."],
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

  // Panelden yonetilen bloklar. Bos ise ilgili bolum statik varsayilanini kullanir.
  const [heroBloklari, ekipBloklari] = await Promise.all([
    bloklar("hero").catch(() => []),
    bloklar("ekip").catch(() => []),
  ]);
  const heroSlaytlari = heroBloklari.map((b) => b.gorsel).filter(Boolean);
  const ekipListesi = ekipBloklari.length
    ? ekipBloklari.map((b) => ({ name: b.baslik, title: b.metin, gorsel: b.gorsel }))
    : EKIP.map((u) => ({ name: u.name, title: u.title, gorsel: "" }));

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

      {/* HERO — beyaz/turuncu, acik tema.
          Sol sutun: hizmetin ne oldugunu anlatan metin + kanit + eylem.
          Sag sutun: saha fotografi (panelden slayt) ve uzerine binen teklif karti. */}
      <section className="relative isolate overflow-hidden bg-white text-ink">
        {/* Zemin: beyazdan sicak kreme yumusak gecis.
            Iki ucu da panelden yonetiliyor (Admin > Site Ayarlari > Renkler). */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(160deg, var(--color-herofrom) 0%, var(--color-bgsoft) 55%, var(--color-heroto) 100%)",
          }}
        />
        {/* Sol ustte ve sag altta yumusak turuncu isik — duz zeminin monotonlugunu kiriyor */}
        <div
          aria-hidden
          className="absolute -left-40 -top-48 -z-10 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(247,154,71,.30), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-56 right-[-10rem] -z-10 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,205,160,.45), transparent 70%)" }}
        />

        {/* items-center YOK: sutunlar esnesin (grid varsayilani stretch). Boylece
            sagdaki gorsel sol sutunun tepesinden basliyor ve ayni hizada bitiyor;
            ortalanmis halinde 150px kadar asagi kayip asimetrik duruyordu. */}
        <div className="container-x relative grid gap-10 py-10 lg:grid-cols-[1.05fr_.95fr] lg:py-14">
          {/* --- SOL: anlatim --- */}
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white px-4 py-2 text-sm font-semibold text-blue shadow-[0_10px_24px_-16px_rgba(194,94,8,.6)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue text-[.7rem] text-white">✓</span>
              TÜRKAK Akredite A Tipi Muayene Kuruluşu · {KURUM.akreditasyon}
            </span>

            {/* Panelden gelen --fs-hero (3.5rem) sabit uygulaniyordu; hero sutunu
                ~600px oldugu icin baslik 4 satira sariyor, bolum ekrani asiyordu.
                clamp: panel degeri artik ust sinir, dar ekranda olcekleniyor. */}
            <h1
              className="mt-5 font-black tracking-tight text-navy"
              style={{ fontSize: "clamp(1.9rem, 3.4vw, var(--fs-hero))", lineHeight: 1.1 }}
            >
              {heroTitle}
            </h1>

            <p className="mt-4 max-w-xl leading-relaxed text-muted">{heroSubtitle}</p>

            {/* Hizmetin ne oldugunu somutlastiran uc madde:
                iddia degil, dogrulanabilir olgu. */}
            <ul className="mt-6 grid gap-2.5 sm:max-w-lg">
              {[
                ["🛡️", "Bağımsız ve tarafsız muayene", "A Tipi kuruluş; rapor satış kaygısı olmadan düzenlenir."],
                ["📋", "TS EN ISO/IEC 17020", "Akredite kapsam; denetim ve ihalelerde sorunsuz kabul."],
                ["🇹🇷", "Türkiye geneli yerinde hizmet", "Mühendis kadro sahaya gelir, üretiminizi durdurmadan test eder."],
              ].map(([i, t, d]) => (
                <li key={t} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-blue-soft"
                  >
                    {i}
                  </span>
                  <span>
                    <b className="block text-[.95rem] font-bold text-navy">{t}</b>
                    <span className="block text-sm text-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/teklif" className="btn-primary px-7 py-3">Ücretsiz Teklif Al →</Link>
              <Link href="/hesapla" className="btn-ghost px-7 py-3">Yasal Sürenizi Hesaplayın</Link>
            </div>

            {/* Rakamlar: metnin altinda ince bir serit, karta gerek yok */}
            <dl className="mt-7 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5 sm:grid-cols-4">
              {[
                ["2014", "Yılından beri"],
                ["500+", "Müşteri firma"],
                ["92", "Ekipman türü"],
                [KURUM.akreditasyon, "Akreditasyon no"],
              ].map(([b, s]) => (
                <div key={s}>
                  <dt className="text-xl font-black leading-tight text-blue">{b}</dt>
                  <dd className="text-[.78rem] text-muted">{s}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* --- SAG: saha gorseli + teklif karti ---
              min-w-0: grid sutunlarinin varsayilan min-width:auto degeri, kartin
              icindeki buton+metin satirini "en dar hali" sayip sutunu kabindan
              tasiriyordu. */}
          <div className="relative flex min-w-0 flex-col lg:pb-12">
            {/* Mobilde sabit oran (16/10 — 4/3 telefonda ekranin yarisini yiyordu),
                lg'de sol sutunun boyuna uzayan esnek yukseklik */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-line bg-bgsoft shadow-[0_40px_70px_-40px_rgba(88,67,52,.55)] lg:aspect-auto lg:min-h-[340px] lg:flex-1">
              {/* Panelden slayt eklendiyse yumusak gecisli slayt, eklenmediyse tek
                  varsayilan foto. (Panel: İçerik Blokları -> Ana Sayfa Slayt Görselleri) */}
              {heroSlaytlari.length > 0 ? (
                <HeroSlayt gorseller={heroSlaytlari} opaklik={1} />
              ) : (
                <Image
                  src={heroGorsel}
                  alt="Sahada yangın söndürme sistemi üzerinde periyodik kontrol yapan mühendis"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  placeholder="blur"
                />
              )}
              {/* Ust kenarda yumusak koyulma: beyaz rozet ve metin fotograftan ayrilsin.
                  Alt bolge bos birakildi; oraya teklif karti biniyor. */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-navy/60 to-transparent"
              />
              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-[.78rem] font-bold text-navy shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-blue" aria-hidden />
                Yerinde muayene · TÜRKAK {KURUM.akreditasyon}
              </span>
              <p className="absolute left-4 right-4 top-16 text-sm font-semibold leading-snug text-white drop-shadow">
                Basınçlı kap, kaldırma, elektrik, yangın ve iş makineleri —
                tek ekipten akredite periyodik kontrol.
              </p>
            </div>

            {/* Donusum karti: gorselin uzerine binerek eylemi one cikarir */}
            <aside className="card relative z-10 mx-4 -mt-10 p-6 sm:mx-8 lg:absolute lg:inset-x-6 lg:bottom-0 lg:mx-0 lg:mt-0">
              <p className="text-xs font-bold uppercase tracking-wide text-blue">Kontrol zamanı geldi mi?</p>
              <h2 className="mt-1.5 text-lg font-black leading-snug text-navy">
                Ekipmanınızı seçin, kapsam ve fiyatı size dönelim
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link href="/teklif" className="btn-primary px-5 py-3 text-[.92rem]">Teklif Formunu Aç →</Link>
                <span className="text-xs text-muted">2 dakika sürer · 92 ekipman türü</span>
              </div>
            </aside>
          </div>
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

        </div>

        {/* Kayan logo seridi — container disinda, ekran genisligince */}
        <div className="mt-10">
          <ReferansSeridi />
        </div>

        <div className="container-x mt-8 text-center">
          <Link href="/referanslar" className="btn-ghost">Tüm Referanslarımız →</Link>
        </div>
      </section>

      {/* KATALOG */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="card grid items-center gap-8 overflow-hidden p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <span className="chip">Kurumsal Katalog</span>
              <h2 className="mt-4 font-black text-navy md:text-3xl" style={{ fontSize: "var(--fs-h2)" }}>
                Hizmet kataloğumuzu indirin
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Akreditasyon kapsamımız, muayene ettiğimiz ekipman grupları, uyguladığımız
                standartlar ve çalışma sürecimiz tek dosyada. Satın alma ve İSG birimlerinizle
                paylaşabileceğiniz kurumsal tanıtım dokümanı.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted">
                <li>📄 6 sayfa</li>
                <li>🛡️ TÜRKAK {KURUM.akreditasyon}</li>
                <li>📋 TS EN ISO/IEC 17020</li>
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/dosya/bilge-teknik-kontrol-katalog.pdf"
                  target="_blank"
                  rel="noopener"
                  className="btn-primary"
                >
                  Kataloğu Aç (PDF) →
                </a>
                <Link href="/teklif" className="btn-ghost">Teklif İste</Link>
              </div>
            </div>

            <div className="mx-auto flex h-52 w-40 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy2 text-white shadow-[0_20px_40px_-20px_rgba(15,23,42,.6)]">
              <span className="text-5xl" aria-hidden>📕</span>
              <span className="mt-3 px-3 text-center text-xs font-bold leading-tight">
                Bilge Teknik Kontrol
                <span className="mt-1 block font-normal text-[#c7d6f0]">Hizmet Kataloğu</span>
              </span>
            </div>
          </div>
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
            {ekipListesi.map((u) => (
              <div key={u.name} className="card p-6 text-center">
                {u.gorsel ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.gorsel}
                    alt={u.name}
                    className="mx-auto mb-3 h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-soft text-2xl">👷</div>
                )}
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
                name: "Bir sonraki kontrol tarihimi nasıl takip ederim?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Muayene sonrası bir sonraki yasal kontrol tarihiniz kayda alınır ve süre dolmadan tarafınıza hatırlatma yapılır. Ayrıca sitemizdeki yasal süre hesaplayıcı ile son kontrol tarihinizi girerek bir sonraki tarihi kendiniz de görebilirsiniz.",
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
