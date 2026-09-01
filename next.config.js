// @ts-check

/**
 * ESKI ADRESLER -> YENI ADRESLER (kalici 301)
 *
 * ⚠️ NEDEN VAR: bilgekontrol.com iki kez bastan yazildi (statik .html -> PHP ->
 * Next.js) ve HICBIR yonlendirme birakilmadi. 2026-08-30 denetiminde Google'in
 * hala indeksinde tuttugu eski adreslerin tamami 404 donuyordu:
 *
 *   /kurumsal.html          404   (Google arama sonucunda hala GORUNUYOR)
 *   /index.php              404
 *   /hizmetlerimiz.php      404
 *   /blog.php               404
 *   /forklift               404   (PHP surumunde ekipman sayfalari KOKTE idi)
 *   /buhar-kazani           404
 *
 * Yani 2014'ten beri biriken ne kadar baglanti ve siralama gucu varsa
 * tamami cope gitti. Siteyi teknik olarak ne kadar iyilestirirsek
 * iyilestirelim, bu kayip telafi edilmeden rakiplerin onune gecilemez.
 *
 * Buradaki tablo, slug'i DEGISEN adresler icindir. Slug'i ayni kalanlar
 * (yazilar ve ekipmanlar) `app/[slug]/page.tsx` icinde CMS'e bakilarak
 * cozuluyor — boylece panelden eklenen yeni icerik de otomatik kapsanir.
 */
const ESKI_SAYFALAR = {
  // Kurumsal sayfalar
  index: "/",
  kurumsal: "/kurumsal",
  teknik: "/kurumsal",
  iletisim: "/iletisim",
  referanslar: "/referanslar",
  "cerez-politikasi": "/cerez-politikasi",
  sss: "/sss",
  // Akreditasyon/belge sayfalari tek bir sertifikalar sayfasinda toplandi
  akreditasyon: "/sertifikalar",
  belgeler: "/sertifikalar",
  // Hizmet listeleri
  hizmetlerimiz: "/ekipman",
  "hizmet-detay": "/ekipman",
  detay: "/ekipman",
  "hizmet-bolgelerimiz": "/bolge",
  blog: "/yazilar",
  // Teklif akisi: eski "zorunlu ekipman listesi" formunun yerini online teklif aldi
  "zorunlu-ekipman-listesi": "/teklif",
  // Kategori/hizmet sayfalari -> yeni ekipman adresleri
  egitimler: "/ekipman/egitim",
  "basincli-kaplar": "/ekipman/basincli-kaplar",
  "basincli-kapilar": "/ekipman/basincli-kaplar", // eski statik surumdeki yazim hatasi
  "elektrik-olcumleri": "/ekipman/elektrik-tesisat",
  "elektirik-olcumleri": "/ekipman/elektrik-tesisat", // eski statik surumdeki yazim hatasi
  "havalandirma-kontrolu": "/ekipman/havalandirma",
  "is-hijyeni-olcumleri": "/ekipman/is-hijyeni-olcumleri",
  "is-makineleri": "/ekipman/is-makineleri",
  "kaldirma-araclari": "/ekipman/kaldirma-iletme",
  "makina-ve-tezgah": "/ekipman/makina-tezgah",
  "patlamadan-korunma-dokumani": "/ekipman/patlamadan-korunma",
  "patlamadan-karuma-dokumani": "/ekipman/patlamadan-korunma", // eski statik surumdeki yazim hatasi
  "raf-sistemleri-kontrolu": "/ekipman/raf-sistemleri",
  "yangin-algilama-uyari-sistemleri": "/ekipman/yangin-algilama",
  "yangin-tesisati-kontrol": "/ekipman/yangin-tesisati",
  "yuruyen-merdivenleri": "/ekipman/yuruyen-merdiven",
  // ⚠️ Ayni slug hem yazi hem sayfa olarak var. Yasal sureler tablosu daha
  // guclu sayfa oldugu icin eski adres yaziya degil ona gidiyor.
  "periyodik-kontrol-sureleri": "/periyodik-kontrol-sureleri",
};

/** ESKI_SAYFALAR tablosunu `.php` ve `.html` uzantili iki kurala acar. */
function eskiAdresYonlendirmeleri() {
  return Object.entries(ESKI_SAYFALAR).flatMap(([ad, hedef]) =>
    ["php", "html"].map((uzanti) => ({
      source: `/${ad}.${uzanti}`,
      destination: hedef,
      permanent: true,
    })),
  );
}

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

    /**
     * ⚠️ PANELDEN GORSEL YUKLEMENIN CAN DAMARI.
     *
     * Sunucu eylemlerinin (server action) istek govdesi Next'te VARSAYILAN
     * OLARAK 1 MB. Bu ayar hic verilmemisti; panel ise "en fazla 6 MB"
     * yaziyordu. Sonuc: 1 MB'i asan her fotograf uygulamanin kendi boyut
     * kontrolune ULASMADAN reddediliyor, kayit yapilmiyor ve ekranda anlamli
     * bir hata cikmiyordu. 2026-08-31'de "hero slaytini degistirdim ama
     * degismiyor" sikayetinin sebebi tam olarak buydu; canli sunucuda ayni
     * sunucu eylemine gonderilen ~1 KB govde 303, 3 MB govde 500 donuyordu.
     *
     * 8mb: uygulamanin kendi siniri 6 MB (bkz. app/admin/actions.ts
     * YUKLEME_SINIRI) + multipart bicim yuku icin pay. Boylece "cok buyuk"
     * karari yine UYGULAMADA veriliyor ve kullaniciya anlasilir bir mesaj
     * gosterilebiliyor. Hostinger'in vekil sunucusu 9 MB govdeyi geciriyor
     * (olculdu), yani darbogaz burasi degil.
     *
     * Not: dosyalar ayrica TARAYICIDA kucultuluyor (app/admin/GorselSecici.tsx),
     * bu sinir yalnizca guvenlik agi.
     */
    serverActions: {
      bodySizeLimit: "8mb",
    },
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

          /**
           * ⚠️ HTTP/3 (QUIC) KAPATILIYOR — ANDROID'DE BEYAZ EKRAN SEBEBIYDI.
           *
           * Hostinger'in kenar sunucusu (Server: hcdn) HER yanita
           * `alt-svc: h3=":443"; ma=86400` ekliyor, yani "bu adres HTTP/3
           * konusuyor, 24 saat boyunca onu kullan" diyor. Ama o QUIC baglantisi
           * BOZUK: 2026-09-01'de olculdu, sayfa yuklemelerinin neredeyse
           * hepsinde tarayici konsolunda
           *
           *   net::ERR_QUIC_PROTOCOL_ERROR
           *
           * cikiyor ve h3 uzerinden giden kaynak yarida kesiliyor.
           *
           * Masaustunde fark edilmiyordu: Chrome hemen HTTP/2'ye dusup istegi
           * tekrarliyor. ANDROID/TABLETTE ise QUIC cok daha israrla tercih
           * ediliyor ve mobil sebekede geri dusme uzun suruyor. Ilk ziyaret
           * h2 ile sorunsuz aciliyor, alt-svc onbellege giriyor ve
           * SAYFA YENILENDIGINDE belge istegi h3'e gecip yarida kaliyor —
           * kullanicinin gordugu sey bos/beyaz ekran.
           *
           * `Alt-Svc: clear` (RFC 7838) tarayiciya bu adres icin kayitli tum
           * alternatif servisleri UNUT der; h3 duyurusu gecersiz kalir ve
           * baglanti guvenilir h2 uzerinde durur.
           *
           * NOT: Asil cozum hPanel'den Hostinger CDN'inin (ya da varsa HTTP/3
           * secenegin) kapatilmasidir; bu baslik uygulama tarafindan
           * yapilabilecek olan. Kenar sunucu kendi alt-svc'sini yine de
           * eklerse baslik iki degerli ve gecersiz olur, tarayici da yok sayar
           * — sonuc yine "h3 kullanma" olur.
           */
          { key: "Alt-Svc", value: "clear" },
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

      ...eskiAdresYonlendirmeleri(),

      /**
       * ⚠️ Ekipmanin slug'i `makina-tezgah`, ama bolge sayfasi metinlerinde
       * bes ayri yerde `makina-ve-tezgah` yaziliyordu — hepsi 404 veren ic
       * linklerdi (2026-08-30 tam link taramasinda bulundu). Metinler
       * duzeltildi; bu yonlendirme, CMS'te saklanan ya da disaridan gelen
       * eski yazimlar icin duruyor.
       */
      {
        source: "/ekipman/makina-ve-tezgah",
        destination: "/ekipman/makina-tezgah",
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
