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

/**
 * ESKI PDF'LER -> en yakin guncel sayfa (kalici 301)
 *
 * ⚠️ 2026-09-02: Google'da hala eski statik surumun PDF'leri cikiyor ve
 * hepsi 404 veriyor. Aramada goruldu:
 *
 *   /assets/images/demo/teknikimg/sikca-sorulan-sorular.pdf   404
 *   /assets/images/demo/teknikimg/gizlilik-sozlesmesi.pdf     404
 *
 * ESKI_SAYFALAR tablosu yalnizca SAYFALARI kapsiyordu; kurumsal PDF'ler
 * gozden kacmisti. Dosyalarin tam listesi eski yedekten alindi
 * (`Desktop/ftp degisikligi/.../assets/images/demo/teknikimg`).
 *
 * PDF'i HTML sayfaya yonlendirmek dogru: dosyalar artik yayinda degil, ama
 * icerikleri sitede karsiliksiz da degil (SSS -> /sss, gizlilik -> /kvkk,
 * on hazirliklar -> hazirlik rehberi). 404 birakmak, o adreslere gelen
 * baglantilari ve arama sonucundaki tiklamalari cope atmak olurdu.
 */
const ESKI_PDF_KLASORU = "/assets/images/demo/teknikimg";
const ESKI_PDFLER = {
  "sikca-sorulan-sorular": "/sss",
  "gizlilik-sozlesmesi": "/kvkk",
  "bilge-teknik-kontrol-brosur": "/dosya/bilge-teknik-kontrol-katalog.pdf",
  "on-hazirliklar-talimati": "/yazilar/periyodik-kontrole-hazirlik",
  "kalite-politikasi": "/kurumsal",
  "musteri-memnuniyeti": "/kurumsal",
  "organizasyon-semasi-rev03": "/kurumsal",
  "personel-taahhutnamesi": "/kurumsal",
  personel1: "/kurumsal",
  "sikayet-itiraz-is-akis-semasi": "/iletisim",
  "sikayet-itiraz-ve-oneri-formu": "/iletisim",
  isemri: "/teklif",
};

function eskiPdfYonlendirmeleri() {
  return Object.entries(ESKI_PDFLER).map(([ad, hedef]) => ({
    source: `${ESKI_PDF_KLASORU}/${ad}.pdf`,
    destination: hedef,
    permanent: true,
  }));
}

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
           * ⚠️ HTTP/3 (QUIC) BOZUK — bu baslik bir DENEME.
           *
           * Sunucu her yanita `alt-svc` ile "bu adres HTTP/3 konusuyor" diyor
           * ama o QUIC baglantisi calismiyor: 2026-09-01 olcumunde sayfa
           * yuklemelerinin neredeyse hepsinde tarayici konsolunda
           * `net::ERR_QUIC_PROTOCOL_ERROR` cikti, h3 uzerinden giden kaynak
           * yarida kesilip HTTP/2 ile tekrar istendi. Android'de yenilemede
           * gorulen beyaz ekranin en guclu supheli sebebi bu.
           *
           * ⚠️ Hata AGDA DEGIL SUNUCUDA: ayni tarayici ve ayni agdan
           * cloudflare.com (112 kaynak) ve google.com (27 kaynak) tamamen h3
           * uzerinden TEK hata olmadan yukleniyor.
           *
           * ⚠️ `Alt-Svc: clear` IKI KEZ DENENDI, IKISI DE BASARISIZ. UCUNCUYU
           * DENEME — olculdu, uygulamanin denetiminde degil:
           *
           *  1. deneme (CDN acikken, surum 50): `Server: hcdn` basligi tamamen
           *     EZDI; tarayiciya yalnizca kendi `h3=":443"; ma=86400` ulasti.
           *     Iki origin IP'sine (77.37.83.223 / 77.37.53.62) dogrudan
           *     gidildiginde de yanit `Server: hcdn` — atlayan yol yok.
           *
           *  2. deneme (CDN kapatildiktan sonra, surum 54): Hostinger destegi
           *     2026-09-01'de CDN'i kapatti, sunucu artik `Server: LiteSpeed`.
           *     LiteSpeed de EZIYOR: yanitta tek bir alt-svc basligi var ve
           *     icinde `clear` gecmiyor. Ustelik deger KOTULESTI —
           *     `h3=":443"; ma=2592000, h3-29=":443"; ma=2592000`
           *     yani 1 gun yerine 30 gun ve ek olarak eski h3-29 taslagi.
           *
           * Cozum yalnizca Hostinger tarafinda: LiteSpeed'de vhost bazinda
           * QUIC ayari var, destek kapatabilir.
           *
           * Durumu olcmek icin:
           *   curl -sI https://bilgekontrol.com | grep -i alt-svc
           */
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
      ...eskiPdfYonlendirmeleri(),

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
      /**
       * ⚠️ 2026-09-02: BU KURAL SU AN CALISMIYOR — kod yanlis degil, alan adi
       * buraya gelmiyor. `bilgeteknikkontrol.com` A kaydi 84.32.84.91'i
       * gosteriyor (ayri bir Hostinger konagi); uygulama 89.116.147.247'de.
       * Olculdu: kok adres 301 ile bilgekontrol.com'a gidiyor ama
       * `/kurumsal.html`, `/forklift`, `/hizmetlerimiz.php` gibi DERIN yollarin
       * hepsi 404. Eski alan adina gelen her derin baglanti cope gidiyor.
       *
       * Cozum hPanel'de: alan adi Node uygulamasina baglanirsa bu kural
       * kendiliginde devreye girer ve tam joker yonlendirme olur.
       * ⚠️ E-posta etkilenmez: MX kayitlari A kaydindan bagimsizdir
       * (bilgeteknikkontrol.com'da mx1/mx2.hostinger.com duruyor).
       */
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
