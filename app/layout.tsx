import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bilgekontrol.com"),
  title: {
    default: "Periyodik Teknik Kontrol & Muayene | Bilge Teknik Kontrol",
    template: "%s | Bilge Teknik Kontrol",
  },
  description:
    "TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu. Basınçlı kap, vinç, kaldırma, elektrik, yangın ve iş makineleri periyodik kontrolü. Online teklif, yasal süre hesaplama ve rapor portalı.",
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
      "TÜRKAK akredite A Tipi muayene kuruluşu. Online teklif, yasal süre hesaplama ve rapor portalı ile işinizi güvence altına alın.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Bilge Teknik Kontrol",
  legalName: "Bilge Teknik Kontrol Muayene Gözetim Denetim Ltd. Şti.",
  url: "https://bilgekontrol.com",
  logo: "https://bilgekontrol.com/img/marka/logo.png",
  image: "https://bilgekontrol.com/img/marka/logo.png",
  telephone: "+902128725204",
  email: "info@bilgeteknikkontrol.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yakuplu Mah. 65. Sk. No:35 İç Kapı No:4",
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
  sameAs: ["https://www.linkedin.com/company/bilgeteknikkontrol"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bilge Teknik Kontrol",
  url: "https://bilgekontrol.com",
  publisher: { "@type": "Organization", name: "Bilge Teknik Kontrol" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
