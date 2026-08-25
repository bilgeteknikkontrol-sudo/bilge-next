import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone çıktısı yalnızca Docker/self-host için. Vercel kendi runtime'ını kullanır.
  output: process.env.STANDALONE === "1" ? "standalone" : undefined,
  async redirects() {
    return [
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
