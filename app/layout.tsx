import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Analytics dogrudan degil, cerez onayina bagli sarmalayici uzerinden yuklenir.
import AnalyticsOnayli from "./components/AnalyticsOnayli";
import CerezOnay from "./components/CerezOnay";
import "./globals.css";
import { getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bilgekontrol.com"),
  title: {
    default: "Periyodik Teknik Kontrol & Muayene | Bilge Teknik Kontrol",
    template: "%s | Bilge Teknik Kontrol",
  },
  description:
    "TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu. Basınçlı kap, vinç, kaldırma, elektrik, yangın ve iş makineleri periyodik kontrolü. Online teklif ve yasal süre hesaplama.",
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
    telephone: settings?.phone || "+902128725204",
    email: settings?.email || "info@bilgeteknikkontrol.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address || "Yakuplu Mah. 65. Sk. No:35 İç Kapı No:4",
      addressLocality: "Beylikdüzü",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    areaServed: "TR",
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
        {settings?.favicon && settings.favicon !== "/icon.svg" && (
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
        <CerezOnay />
        <AnalyticsOnayli />
      </body>
    </html>
  );
}
