// @ts-check

/**
 * ⚠️ Bu dosya bilerek .ts DEGIL .js.
 *
 * Hostinger'in derleme sunucusunda glibc 2.28 var; Next.js 16'nin yerel SWC
 * ikilisi (@next/swc-linux-x64-gnu) glibc 2.29 istiyor. Yuklenemeyince Next
 * WASM surumune dusuyor — ve WASM yolunda `next.config.ts` derlenemiyor:
 *
 *   ⨯ Failed to load next.config.ts
 *   Error: Cannot find module '.../6a920bbf7debe.next.config'
 *
 * Duz JavaScript config hic derlenmeden dogrudan yuklendigi icin bu adim
 * tamamen ortadan kalkiyor. TypeScript'e donmek, ancak Hostinger derleme
 * imajini yeni bir glibc'ye gecirirse mumkun.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Standalone çıktısı yalnızca Docker/self-host için. Vercel kendi runtime'ını kullanır.
  output: process.env.STANDALONE === "1" ? "standalone" : undefined,

  /**
   * ⚠️ DERLEMEDE İŞÇİ SAYISINI SINIRLA.
   *
   * Next varsayilan olarak sayfalari cok sayida ayri surecte uretiyor
   * (Hostinger'da "using 41 workers" yaziyordu). Her surec kendi MySQL
   * baglantisini aciyor; paylasimli hostingde eszamanli baglanti sayisi
   * sinirli oldugu icin bu, derlemenin ortasinda "too many connections"
   * ile dusme riski demek.
   *
   * `staticGenerationMinPagesPerWorker` denendi, isci sayisini DEGISTIRMEDI
   * (yerelde 200'e cekildiginde bile 11 isci acildi). Isci sayisini gercekten
   * belirleyen ayar `experimental.cpus` — next/dist/build/index.js icindeki
   * getNumberOfWorkers() once ona bakiyor.
   */
  experimental: {
    cpus: 2,
  },

  // Sunucu yazilimini duyurmanin faydasi yok, saldirgana ipucu vermenin zarari var.
  poweredByHeader: false,

  /**
   * GUVENLIK BASLIKLARI
   *
   * ⚠️ Site Vercel'den Hostinger'a tasininca HSTS KAYBOLDU: Vercel
   * `Strict-Transport-Security` gonderiyordu, Hostinger gondermiyor. Basliklar
   * platforma birakildigi surece tasima her seferinde sessizce guvenlik
   * kaybettiriyor — bu yuzden artik uygulamanin kendisi gonderiyor.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS'i zorunlu kil. Site zaten tam HTTPS ve HTTP -> HTTPS 301 var.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Tarayici Content-Type'i "tahmin etmeye" calismasin (MIME sniffing).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Siteyi baska bir sayfanin cercevesine gomup tiklama calmayi engeller.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Disariya giden baglantilarda tam adres sizmasin.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Sitenin ihtiyaci olmayan donanim izinlerini bastan kapat.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Panel hicbir durumda onbellege alinmasin ve indekslenmesin.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },

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

module.exports = nextConfig;
