import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone çıktısı yalnızca Docker/self-host için. Vercel kendi runtime'ını kullanır.
  output: process.env.STANDALONE === "1" ? "standalone" : undefined,
  async redirects() {
    return [
      // /portal (sahte demo verisiyle calisan rapor sorgulama sayfasi) kaldirildi.
      // Yerine periyodik kontrol sureleri tablosu geldi. Eski adres 404 vermesin:
      // CMS'te saklanan yazi govdelerinde ve disaridan gelen baglantilarda hala
      // /portal geciyor.
      {
        source: "/portal",
        destination: "/periyodik-kontrol-sureleri",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "bilgeteknikkontrol.com" }],
        destination: "https://bilgekontrol.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bilgekontrol.com" }],
        destination: "https://bilgekontrol.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
