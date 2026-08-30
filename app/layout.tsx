import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Analytics dogrudan degil, cerez onayina bagli sarmalayici uzerinden yuklenir.
import AnalyticsOnayli from "./components/AnalyticsOnayli";
import GoogleAnalytics from "./components/GoogleAnalytics";
import CerezOnay from "./components/CerezOnay";
import WhatsappButon from "./components/WhatsappButon";
import "./globals.css";
import { getSettings } from "@/lib/cms";
import { KURUM, BOLGELER, semaSokakAdresi } from "@/lib/site-data";

/**
 * Kok duzen onbellekleniyor (ISR).
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

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bilgekontrol.com"),
  title: {
    default: "Periyodik Teknik Kontrol & Muayene | Bilge Teknik Kontrol",
    template: "%s | Bilge Teknik Kontrol",
  },
  // ⚠️ 160 karakteri asmiyor: arama sonucunda kirpilan aciklama yarim cumleyle
  // bitiyor ve tiklama oranini dusuruyor.
  description:
    "TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu. Basınçlı kap, vinç, elektrik, yangın ve iş makineleri periyodik kontrolü. Online teklif alın.",
  keywords: [
    "periyodik teknik kontrol", "periyodik muayene", "TÜRKAK akredite", "basınçlı kap muayenesi",
    "vinç periyodik kontrol", "elektrik tesisatı kontrolü", "iş ekipmanı muayenesi",
  ],
  authors: [{ name: "Bilge Teknik Kontrol" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Bilge Teknik Kontrol",
    title: "Periyodik Teknik Kontrol & Muayene | Bilge Teknik Kontrol",
    description:
      "TÜRKAK akredite A Tipi muayene kuruluşu. Online teklif, yasal süre hesaplama ve periyodik kontrol süreleri tablosu ile işinizi güvence altına alın.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },

  /**
   * GOOGLE SEARCH CONSOLE DOGRULAMASI
   *
   * ⚠️ 2026-08-30 denetiminde site Search Console'a HIC bagli degildi:
   * ne dogrulama etiketi, ne alan adinda `google-site-verification` TXT
   * kaydi vardi. Yani sitenin hangi aramalarda kacinci sirada ciktigi,
   * hangi sayfalarin indekslenemedigi, hangi eski adreslerin 404 verdigi
   * bilgisinin TAMAMI olculmuyordu. Siralama sorusunun tek %100 dogru
   * kaynagi bu; disaridan yapilan her olcum tahmindir.
   *
   * Deger ortam degiskeninden okunuyor (hPanel -> Ortam degiskenleri ->
   * GOOGLE_SITE_VERIFICATION). Boylece dogrulama kodu icin yeni bir kod
   * dagitimi gerekmez. Tanimli degilse etiket hic basilmaz.
   *
   * NOT: sitede zaten GA4 kurulu (bkz. GoogleAnalytics bileseni). Ayni
   * Google hesabi GA4 mulkunun sahibiyse Search Console dogrulamayi
   * kendiliginden yapar ve buraya hic deger girmek gerekmez.
   */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const COLOR_VAR: Record<string, string> = {
  navy: "--color-navy",
  navy2: "--color-navy2",
  blue: "--color-blue",
  blueSoft: "--color-blue-soft",
  accent: "--color-accent",
  accent2: "--color-accent2",
  amberSoft: "--color-amber-soft",
  emeraldSoft: "--color-emerald-soft",
  ink: "--color-ink",
  onNavy: "--color-onnavy",
  onNavyDim: "--color-onnavydim",
  muted: "--color-muted",
  line: "--color-line",
  bgsoft: "--color-bgsoft",
  // Bolge renkleri (Admin > Site Ayarlari > Renkler > Bolgeler)
  headerBg: "--color-header",
  headerTopBg: "--color-headertop",
  footerBg: "--color-footer",
  buttonBg: "--color-btn",
  heroFrom: "--color-herofrom",
  heroTo: "--color-heroto",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings;
  try {
    settings = await getSettings();
  } catch {
    settings = null;
  }
  const colors = settings?.colors ?? {};
  const fonts = settings?.fonts ?? { hero: "3.5rem", h2: "2.25rem", body: "1rem" };

  const cssVars = Object.entries(COLOR_VAR)
    .map(([k, v]) => (colors[k] ? `${v}:${colors[k]}` : null))
    .filter(Boolean)
    .concat([`--fs-hero:${fonts.hero}`, `--fs-h2:${fonts.h2}`, `--fs-body:${fonts.body}`])
    .join(";");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Bilge Teknik Kontrol",
    legalName: "Bilge Teknik Kontrol Muayene Gözetim Denetim Ltd. Şti.",
    url: "https://bilgekontrol.com",
    /**
     * ⚠️ Kurulus yili ve logo yoktu. Ikisi de E-E-A-T (deneyim/uzmanlik/
     * otorite/guvenilirlik) sinyali: 2014'ten beri faaliyette olan bir
     * kurulusun bunu arama motoruna soylememesi karsiliksiz kayip.
     * Yil lib/site-data.ts KURUM.kurulus'tan — tek kaynak.
     */
    foundingDate: KURUM.kurulus,
    logo: "https://bilgekontrol.com/icon.png",
    image: "https://bilgekontrol.com/opengraph-image",
    telephone: settings?.phone || "+902128725204",
    email: settings?.email || "info@bilgeteknikkontrol.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      // ⚠️ Gorunur metinle AYNI yazim, ilce/il tekrari olmadan.
      // Gerekcesi lib/site-data.ts semaSokakAdresi() basinda.
      streetAddress: semaSokakAdresi(settings?.address),
      addressLocality: "Beylikdüzü",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    // Konum: yerel aramalarda ("periyodik kontrol Beylikduzu") isletmeyi
    // haritaya baglar. Koordinatlar lib/site-data.ts KURUM.geo'dan.
    geo: {
      "@type": "GeoCoordinates",
      latitude: KURUM.geo.lat,
      longitude: KURUM.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: KURUM.calismaSaatleriSchema.acilis,
      closes: KURUM.calismaSaatleriSchema.kapanis,
    },
    // ⚠️ Onceden yalnizca "TR" yaziyordu. Sehir bazli aramalarda hangi ile
    // hizmet verildigi bilgisi hic verilmiyordu; artik hizmet verilen iller
    // tek tek listeleniyor (lib/site-data.ts BOLGELER tek kaynak).
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      ...BOLGELER.flatMap((b) => b.iller.map((i) => ({ "@type": "City", name: i.il }))),
    ],
    // Akreditasyon kapsamindaki hizmetler — arama motoruna "bu firma tam
    // olarak neyi yapiyor" bilgisini veriyor.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Periyodik kontrol hizmetleri",
      itemListElement: [
        "Kaldırma ve iletme makineleri periyodik kontrolü",
        "Basınçlı kap periyodik kontrolü",
        "Kazan periyodik kontrolü",
        "Yangından korunma sistemleri periyodik kontrolü",
      ].map((ad) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: ad },
      })),
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "TÜRKAK Akredite Muayene Kuruluşu",
      competencyRequired: "TS EN ISO/IEC 17020",
      identifier: "AB-0296-M",
    },
    sameAs: settings?.sameAs?.length ? settings.sameAs : ["https://www.linkedin.com/company/bilgeteknikkontrol"],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bilge Teknik Kontrol",
    url: "https://bilgekontrol.com",
    publisher: { "@type": "Organization", name: "Bilge Teknik Kontrol" },
  };

  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {/*
          Favicon'u normalde Next.js kendisi uretiyor (app/favicon.ico + app/icon.png,
          ikisi de marka logosu). Buradaki <link> yalnizca panelden OZEL bir favicon
          secildiginde gerekli ve o zaman digerlerini ezer.
          "/icon.svg" eski yer tutucu ikondu; marka logosu eklenirken silindi ama
          CMS'in kayitli ayarinda deger olarak kalmisti ve 404'e giden bir link
          basiliyordu. Kayitli bu eski deger yok sayilir; panelden gercek bir dosya
          secilirse otomatik olarak devreye girer.
        */}
        {settings?.favicon &&
          !["/icon.svg", "/favicon.ico"].includes(settings.favicon) && (
            <link rel="icon" href={settings.favicon} />
          )}
        <style dangerouslySetInnerHTML={{ __html: `:root{${cssVars}}` }} />
      </head>
      <body style={{ fontSize: "var(--fs-body)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        {/* Her sayfada sag altta sabit duran WhatsApp butonu */}
        <WhatsappButon />
        <CerezOnay />
        {/*
          Vercel Analytics yalnizca Vercel'de calisir: olcum istekleri
          `/_vercel/insights/*` adresine gider ve bunu Vercel'in kenar sunucusu
          karsilar. Site Hostinger'da calisirken bu adres 404 doner — yani her
          ziyaretcide bosuna istek atilir ve konsolda hata birikir. Bu yuzden
          bilesen yalnizca Vercel ortaminda basiliyor.
        */}
        {process.env.VERCEL ? <AnalyticsOnayli /> : null}

        {/**
         * GA4 — barindirmadan bagimsiz, her ortamda calisir.
         *
         * ⚠️ Olcum kimligi ortam degiskeninden okunuyor; tanimli degilse
         * varsayilan olarak sitenin mevcut mulku kullaniliyor. Boylece
         * degistirmek icin kod dagitimi gerekmez (hPanel -> Ortam degiskenleri
         * -> NEXT_PUBLIC_GA_ID). `NEXT_PUBLIC_` oneki sart: deger tarayiciya
         * gonderilecek.
         */}
        <GoogleAnalytics id={process.env.NEXT_PUBLIC_GA_ID || "G-GX722H5K2F"} />
      </body>
    </html>
  );
}
