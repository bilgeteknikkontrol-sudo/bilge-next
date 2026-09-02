import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ReferansSeridi from "./components/ReferansSeridi";
import HeroSlayt from "./components/HeroSlayt";
import { getSettings, getEquipment, getLocations, type Equipment } from "@/lib/cms";
import { bloklar } from "@/lib/bloklar";
// CMS Equipment tipinde gorsel alani yok; gorsel slug uzerinden statik haritadan gelir.
import { EKIPMAN_GORSEL } from "@/lib/images";
import { UZMANLIK_ALANLARI, KURUM } from "@/lib/site-data";
import { KATEGORILER } from "@/lib/data";
import { metinleriOku } from "@/lib/sayfa-metin";
// Hero arka plani: saha fotografi. Genis (1000x486) oldugu icin tam genislikte net kaliyor.
import heroGorsel from "../public/img/yangin-kontrolu.webp";

/** Kategori adi -> ikon. CMS kategori adi dondururken ikonu tasimadigi icin
 *  ikonlar statik veriden ad eslesmesiyle bulunur; bulunamazsa genel ikon kullanilir. */
const KATEGORI_IKON: Record<string, string> = Object.fromEntries(
  KATEGORILER.map((k) => [k.baslik, k.ikon])
);

/**
 * Sayfa onbellekleniyor (ISR).
 *
 * ⚠️ Onceden `force-dynamic` idi: HER ziyarette sayfa sifirdan uretiliyor,
 * hicbir sey onbelleklenmiyordu. Turkiye den olculen ilk bayt suresi
 * 285-750 ms idi; bunun ~220 ms si zaten ag, gerisi her istekte tekrar
 * yapilan uretim ve CMS okumasiydi. Sayfa hizi Google icin bir siralama
 * faktoru oldugundan bu dogrudan SEO kaybiydi.
 *
 * Bayatlik riski yok: paneldeki her kaydetme eylemi revalidatePath cagirip
 * ilgili sayfalari aninda tazeliyor (bkz. app/admin/actions.ts). Sure yalnizca
 * hicbir degisiklik olmadiginda ust sinir olarak devrede.
 */
export const revalidate = 300;

/**
 * Ana sayfanin kendi metadata'si yoktu; kok layout'takini miras aliyordu ve
 * en onemlisi CANONICAL adresi hic basilmiyordu. Ana sayfaya birden fazla
 * adresten ulasilabildigi icin (/, /?utm=..., /index) Google bunlari ayri
 * sayfa sanabiliyor ve siralama gucu bolunuyordu.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/", type: "website" },
};

/**
 * ⚠️ ASAGIDAKI DORT LISTE ARTIK YALNIZCA VARSAYILANDIR.
 *
 * Panelde (Ana Sayfa ekrani) ilgili blok turunden en az bir kayit varsa liste
 * ORADAN gelir; hic kayit yoksa buradaki hali kullanilir. Boylece panel bos
 * bile olsa sayfa bugunku goruntusunu koruyor, ilk kayit eklendigi anda
 * yonetim tamamen panele geciyor.
 */
const HERO_MADDELERI = [
  ["🛡️", "Bağımsız ve tarafsız muayene", "A Tipi kuruluş; rapor satış kaygısı olmadan düzenlenir."],
  ["📋", "TS EN ISO/IEC 17020", "Akredite kapsam; denetim ve ihalelerde sorunsuz kabul."],
  ["🇹🇷", "Türkiye geneli yerinde hizmet", "Mühendis kadro sahaya gelir, üretiminizi durdurmadan test eder."],
];

const RAKAMLAR = [
  ["2009", "Yılından beri"],
  ["500+", "Müşteri firma"],
  ["92", "Ekipman türü"],
  [KURUM.akreditasyon, "Akreditasyon no"],
];

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
  const m = await metinleriOku();
  const settings = await getSettings().catch(() => null);
  const equipment = await getEquipment().catch(() => []);
  const kategoriler = groupByKategori(equipment.filter((e) => e.aktif));
  // Hizmet bolgeleri bolumu icin. CMS'e ulasilamazsa bolum hic basilmaz.
  const bolgeler = (await getLocations().catch(() => [])).filter((b) => b.aktif);

  // Panelden yonetilen bloklar. Bos ise ilgili bolum statik varsayilanini kullanir.
  const [heroBloklari, ozellikBloklari, rakamBloklari, avantajBloklari, surecBloklari, uzmanlikBloklari] =
    await Promise.all([
      bloklar("hero").catch(() => []),
      bloklar("ozellik").catch(() => []),
      bloklar("rakam").catch(() => []),
      bloklar("avantaj").catch(() => []),
      bloklar("surec").catch(() => []),
      bloklar("uzmanlik").catch(() => []),
    ]);
  const heroSlaytlari = heroBloklari.map((b) => b.gorsel).filter(Boolean);
  const heroMaddeleri = ozellikBloklari.length
    ? ozellikBloklari.map((b) => ({ ikon: b.ikon || "•", baslik: b.baslik, metin: b.metin }))
    : HERO_MADDELERI.map(([ikon, baslik, metin]) => ({ ikon, baslik, metin }));
  const rakamlar = rakamBloklari.length
    ? rakamBloklari.map((b) => ({ deger: b.baslik, etiket: b.metin }))
    : RAKAMLAR.map(([deger, etiket]) => ({ deger, etiket }));
  const avantajlar = avantajBloklari.length
    ? avantajBloklari.map((b) => ({ ikon: b.ikon || "✔️", baslik: b.baslik, metin: b.metin }))
    : AVANTAJLAR.map(([ikon, baslik, metin]) => ({ ikon, baslik, metin }));
  const surecAdimlari = surecBloklari.length
    ? surecBloklari.map((b) => ({ baslik: b.baslik, metin: b.metin }))
    : SUREC.map(([baslik, metin]) => ({ baslik, metin }));
  /* Kisi degil BRANS: panelde kayit varsa oradan, yoksa koddaki iki alan. */
  const uzmanlikListesi = uzmanlikBloklari.length
    ? uzmanlikBloklari.map((b) => ({ ikon: b.ikon || "🛠️", ad: b.baslik, aciklama: b.metin }))
    : UZMANLIK_ALANLARI;

  const heroTitle = settings?.heroTitle || "İş Ekipmanınızın Güvenliği, Kanıtlanmış Uzmanlıkla";
  const heroSubtitle =
    settings?.heroSubtitle ||
    "Basınçlı kap, kaldırma, elektrik, yangın ve iş makineleri periyodik kontrolünü uluslararası geçerli raporlarla belgeliyoruz.";
  const aboutTitle = settings?.aboutTitle || "2009'ten beri iş güvenliğinin yanında";
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
        {/* Sol ustte ve sag altta yumusak isik — duz zeminin monotonlugunu kiriyor.
            Ikisi de paletten turetiliyor: ust sol birincil maviden, alt sag
            logonun turuncusundan. Turuncu hero'da sadece burada ve butonda
            gorunuyor; renk yuku maviye birakildi. */}
        <div
          aria-hidden
          className="absolute -left-40 -top-48 -z-10 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-blue) 18%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-56 right-[-10rem] -z-10 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%)",
          }}
        />

        {/* items-center YOK: sutunlar esnesin (grid varsayilani stretch). Boylece
            sagdaki gorsel sol sutunun tepesinden basliyor ve ayni hizada bitiyor;
            ortalanmis halinde 150px kadar asagi kayip asimetrik duruyordu. */}
        <div className="container-x relative grid gap-8 py-7 lg:grid-cols-[1.05fr_.95fr] lg:py-10">
          {/* --- SOL: anlatim --- */}
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white px-4 py-2 text-sm font-semibold text-blue shadow-[0_10px_24px_-16px_color-mix(in_srgb,var(--color-navy)_60%,transparent)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue text-[.7rem] text-white">✓</span>
              {m("as_hero_rozet")} · {KURUM.akreditasyon}
            </span>

            {/* Panelden gelen --fs-hero (3.5rem) sabit uygulaniyordu; hero sutunu
                ~600px oldugu icin baslik 4 satira sariyor, bolum ekrani asiyordu.
                clamp: panel degeri artik ust sinir, dar ekranda olcekleniyor. */}
            <h1
              className="mt-5 font-black tracking-tight text-navy"
              style={{ fontSize: "clamp(1.75rem, 2.9vw, var(--fs-hero))", lineHeight: 1.12 }}
            >
              {heroTitle}
            </h1>

            <p className="mt-3 max-w-xl leading-relaxed text-muted">{heroSubtitle}</p>

            {/* Hizmetin ne oldugunu somutlastiran uc madde:
                iddia degil, dogrulanabilir olgu. */}
            <ul className="mt-5 grid gap-2 sm:max-w-lg">
              {heroMaddeleri.map((madde) => (
                <li key={madde.baslik} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-blue-soft"
                  >
                    {madde.ikon}
                  </span>
                  <span>
                    <b className="block text-[.95rem] font-bold text-navy">{madde.baslik}</b>
                    <span className="block text-sm text-muted">{madde.metin}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/teklif" className="btn-primary px-7 py-3">{m("as_hero_btn1")}</Link>
              <Link href="/hesapla" className="btn-ghost px-7 py-3">{m("as_hero_btn2")}</Link>
            </div>

            {/* Rakamlar: metnin altinda ince bir serit, karta gerek yok */}
            <dl className="mt-6 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 sm:grid-cols-4">
              {rakamlar.map((r) => (
                <div key={r.etiket || r.deger}>
                  {/* text-xl -> text-lg: rakamlar seritte fazla agir duruyordu.
                      Etiket .78rem'de birakildi ki basamak farki korunsun. */}
                  <dt className="text-lg font-black leading-tight text-blue">{r.deger}</dt>
                  <dd className="text-[.78rem] text-muted">{r.etiket}</dd>
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
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-line bg-bgsoft shadow-[0_40px_70px_-40px_color-mix(in_srgb,var(--color-navy)_55%,transparent)] lg:aspect-auto lg:min-h-[300px] lg:flex-1">
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
                {m("as_hero_gorsel_rozet")} {KURUM.akreditasyon}
              </span>
              <p className="absolute left-4 right-4 top-16 text-sm font-semibold leading-snug text-white drop-shadow">
                {m("as_hero_gorsel_yazi")}
              </p>
            </div>

            {/* Donusum karti: gorselin uzerine binerek eylemi one cikarir.
                ⚠️ Zemin rengi BURADA, satir ici olarak veriliyor: `.card` sinifi
                sitedeki tum kartlarda ortak (bg-white) ve kullanici YALNIZCA bu
                kartin yari saydam olmasini istedi. Sinifi degistirmek butun
                kartlari etkilerdi. #fbfdff91 -> ~%57 opaklik; arkadaki saha
                fotografi hafifce goruniyor. */}
            <aside
              className="card relative z-10 mx-4 -mt-10 p-6 sm:mx-8 lg:absolute lg:inset-x-6 lg:bottom-0 lg:mx-0 lg:mt-0"
              style={{ backgroundColor: "#fbfdff91" }}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-blue">{m("as_kart_etiket")}</p>
              <h2 className="mt-1.5 text-lg font-black leading-snug text-navy">
                {m("as_kart_baslik")}
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link href="/teklif" className="btn-primary px-5 py-3 text-[.92rem]">{m("as_kart_buton")}</Link>
                <span className="text-xs text-muted">{m("as_kart_not")}</span>
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
            <span className="chip">{m("as_hizmet_etiket")}</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>{m("as_hizmet_baslik")}</h2>
            <p className="mt-3 text-muted">{m("as_hizmet_giris")}</p>
          </div>
          {/* Ana sayfada en fazla 6 hizmet gosterilir; tamami /ekipman sayfasinda. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kategoriler.slice(0, 6).map(([kat, items]) => {
              const g = EKIPMAN_GORSEL[items[0].slug];
              return (
                <Link key={kat} href={`/ekipman/${items[0].slug}`} className="group card card-hover beliren flex flex-col overflow-hidden">
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
            <Link href="/ekipman" className="btn-ghost">{m("as_hizmet_btn1")} ({equipment.length})</Link>
            <Link href="/teklif" className="btn-primary">{m("as_hizmet_btn2")}</Link>
          </div>
        </div>
      </section>

      {/*
        HİZMET BÖLGELERİ

        ⚠️ NEDEN EKLENDİ: 2026-08-30 taramasında anasayfada TEK BİR şehir adı
        ya da bölge bağlantısı bulunmadığı görüldü — yalnızca alt bilgide
        "/bolge" geçiyordu. Yerinde hizmet veren bir muayene kuruluşu için bu
        büyük bir eksik: sitenin en güçlü sayfası nerede çalıştığını
        söylemiyordu. Bölge sayfaları da anasayfadan hiç iç bağlantı almıyordu.

        Liste CMS'ten geliyor; panelden bölge eklenince burası da güncellenir.
      */}
      {/* Ustteki HIZMETLER de bg-bgsoft: ikisi tek yumusak bant gibi okunuyor,
          boylece sonraki bolumlerin arka plan siralamasi bozulmuyor. */}
      {bolgeler.length > 0 && (
        <section id="bolgeler" className="section bg-bgsoft">
          <div className="container-x">
            <div className="mx-auto mb-9 max-w-[720px] text-center">
              <span className="chip">{m("as_bolge_etiket")}</span>
              <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>
                {m("as_bolge_baslik")}
              </h2>
              <p className="mt-3 text-muted">{m("as_bolge_giris")}</p>
            </div>
            <ul className="mx-auto flex max-w-[900px] flex-wrap justify-center gap-2">
              {bolgeler.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/bolge/${b.slug}`}
                    className="inline-block rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-blue hover:text-blue"
                  >
                    {b.ilce || b.il}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Link href="/bolge" className="btn-ghost">{m("as_bolge_buton")}</Link>
            </div>
          </div>
        </section>
      )}

      {/* NEDEN BİZ */}
      <section id="neden" className="section">
        <div className="container-x">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="chip">{m("as_neden_etiket")}</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>{m("as_neden_baslik")}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {avantajlar.map((a) => (
              <div key={a.baslik} className="card card-hover beliren p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft text-2xl text-blue">{a.ikon}</div>
                <h3 className="text-lg text-navy">{a.baslik}</h3>
                <p className="mt-1 text-sm text-muted">{a.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-11 max-w-[720px] text-center">
            <span className="chip">{m("as_surec_etiket")}</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>{m("as_surec_baslik")}</h2>
          </div>
          <div className="mx-auto grid max-w-[820px] gap-6 md:grid-cols-2">
            {surecAdimlari.map((adim, i) => (
              <div key={adim.baslik} className="flex gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-navy font-bold text-white">{i + 1}</div>
                <div>
                  <h3 className="text-lg text-navy">{adim.baslik}</h3>
                  <p className="mt-1 text-sm text-muted">{adim.metin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERANSLAR */}
      <section id="referans" className="section">
        <div className="container-x text-center">
          <span className="chip">{m("as_referans_etiket")}</span>
          <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>{m("as_referans_baslik")}</h2>
          <p className="mx-auto mt-3 max-w-[640px] text-muted">{m("as_referans_giris")}</p>

        </div>

        {/* Kayan logo seridi — container disinda, ekran genisligince */}
        <div className="mt-10">
          <ReferansSeridi />
        </div>

        <div className="container-x mt-8 text-center">
          <Link href="/referanslar" className="btn-ghost">{m("as_referans_buton")}</Link>
        </div>
      </section>

      {/* KATALOG */}
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="card grid items-center gap-8 overflow-hidden p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <span className="chip">{m("as_katalog_etiket")}</span>
              <h2 className="mt-4 font-black text-navy md:text-3xl" style={{ fontSize: "var(--fs-h2)" }}>
                {m("as_katalog_baslik")}
              </h2>
              <p className="mt-3 max-w-xl text-muted">{m("as_katalog_giris")}</p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted">
                <li>📄 6 sayfa</li>
                <li>🛡️ TÜRKAK {KURUM.akreditasyon}</li>
                <li>📋 TS EN ISO/IEC 17020</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/dosya/bilge-teknik-kontrol-katalog.pdf"
                  target="_blank"
                  rel="noopener"
                  className="btn-primary"
                >
                  {m("as_katalog_btn1")}
                </a>
                <Link href="/teklif" className="btn-ghost">{m("as_katalog_btn2")}</Link>
              </div>
            </div>

            <div className="mx-auto flex h-52 w-40 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy2 text-white shadow-[0_20px_40px_-20px_color-mix(in_srgb,var(--color-navy)_60%,transparent)]">
              <span className="text-5xl" aria-hidden>📕</span>
              <span className="mt-3 px-3 text-center text-xs font-bold leading-tight">
                Bilge Teknik Kontrol
                <span className="mt-1 block font-normal text-onnavy">Hizmet Kataloğu</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* EKİP —
          ⚠️ Bolumun TAMAMI yalnizca kadro varsa basiliyor. Kadro bosken
          baslik ve aciklama basilip altinda bos bir izgara kalsaydi sayfa
          bozuk gorunurdu. Panelden kisi eklenince bolum kendiliginden
          geri gelir. */}
      {uzmanlikListesi.length > 0 && (
      <section className="section bg-bgsoft">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-[720px] text-center">
            <span className="chip">{m("as_ekip_etiket")}</span>
            <h2 className="mt-4 font-black text-navy md:text-4xl" style={{ fontSize: "var(--fs-h2)" }}>
              {m("as_ekip_baslik")}
            </h2>
            <p className="mt-3 text-muted">{m("as_ekip_giris")}</p>
          </div>
          {/* ⚠️ SADE VE DAR — bilerek.
              Once fotografli, 920px genisliginde kartlar denendi; kullanici
              "fotograf olmasin, cok genis olmasin" dedi. Simdi kartlar ustteki
              baslik blogunun genisligiyle (720px) hizali ve fotograf yok:
              ikon basligin YANINDA, boylece kart alcak kaliyor. */}
          <div className="mx-auto grid max-w-[720px] gap-4 sm:grid-cols-2">
            {uzmanlikListesi.map((u) => (
              <article
                key={u.ad}
                className="group card card-hover beliren p-5 transition-colors hover:border-blue"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-soft text-lg"
                  >
                    {u.ikon}
                  </span>
                  <h3 className="text-base font-bold text-navy">{u.ad}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{u.aciklama}</p>
                {/* Tek hareket: uzerine gelince ince turuncu cizgi aciliyor.
                    Kart zaten card-hover ile hafifce kalkiyor. */}
                <span
                  aria-hidden
                  className="mt-4 block h-[3px] w-8 rounded-full bg-accent transition-all duration-500 ease-out group-hover:w-16"
                />
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* AKREDİTASYON */}
      <section id="akreditasyon" className="section bg-bgsoft">
        <div className="container-x">
          <div className="card mx-auto max-w-[820px] flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-3xl text-accent2">✓</div>
            <div>
              <h2 className="text-2xl font-black text-navy">{m("as_akr_baslik")} {KURUM.akreditasyon}</h2>
              <p className="mt-2 text-muted">{m("as_akr_yazi")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-navy to-navy2 py-16 text-center text-white">
        <div className="container-x mx-auto max-w-[680px]">
          <h2 className="font-black" style={{ fontSize: "var(--fs-h2)" }}>{ctaTitle}</h2>
          <p className="mt-3 text-onnavy">{ctaText}</p>
          <Link href="/teklif" className="btn-primary mt-5 bg-accent text-navy hover:bg-amber-soft">{m("as_cta_buton")}</Link>
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
