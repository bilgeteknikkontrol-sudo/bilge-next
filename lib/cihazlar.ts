/**
 * SAHADA KULLANILAN OLCUM CIHAZLARI
 *
 * ⚠️ NEDEN VAR: bir periyodik kontrol raporu, arkasindaki olcum kadar
 * saglamdir. Musteri tarafinda en cok merak edilen ama sitenin hicbir
 * yerinde yazmayan sey, olcumun HANGI CIHAZLA yapildigiydi. Ayni zamanda
 * akredite bir muayene kurulusu icin guclu bir yetkinlik sinyali.
 *
 * ⚠️ Liste KODDA, panelde degil. Cihaz listesi sik degismedigi icin bilincli
 * bir tercih; degisirse bir dagitim yeterli. Panelden yonetilmesi istenirse
 * makale/blok deseniyle tasinabilir — bkz. lib/content.ts ustundeki not.
 *
 * ⚠️ Aciklamalar uretici/satici sayfalarindan DOGRULANARAK yazildi
 * (2026-09-02). Model bilgisi degistirilecekse once kaynagindan teyit edin;
 * teknik bir sayfada yanlis model ya da yanlis ozellik yazmak, sayfanin
 * amaci olan guveni dogrudan zedeler.
 *
 * ⚠️ Gruplama, kullanicinin gonderdigi "elektrik / mekanik" ayrimina gore
 * DEGIL, cihazin ne olctugune gore yapildi: Fluke 1621 (topraklama) ve
 * Fluke 302+ (pens ampermetre) mekanik listesinde gelmisti, ikisi de
 * elektriksel olcum cihazi.
 */

export type Cihaz = {
  ad: string;
  /** Cihazin tek cumlelik en belirgin ozelligi. */
  ozet: string;
  /** Birden fazla varsa yazilir; 1 ise gosterilmez. */
  adet?: number;
};

export type CihazGrubu = {
  baslik: string;
  /** Grubun hangi kontrollerde kullanildigini anlatan tek cumle. */
  aciklama: string;
  /** Grubun dogal karsiligi olan hizmet sayfasi. */
  hizmet?: { yol: string; ad: string };
  cihazlar: Cihaz[];
};

export const CIHAZ_GRUPLARI: CihazGrubu[] = [
  {
    baslik: "Elektrik ve topraklama ölçümleri",
    aciklama:
      "Elektrik tesisatı, topraklama ve yıldırımdan korunma kontrollerinde kullanılan ölçüm cihazları.",
    hizmet: { yol: "/ekipman/elektrik-tesisat", ad: "Elektrik tesisatı periyodik kontrolü" },
    cihazlar: [
      {
        ad: "Fluke 1664 FC — Tesisat test cihazı",
        adet: 2,
        ozet:
          "Yalıtım direnci, çevrim empedansı, RCD ve topraklama testini tek cihazda yapar. Insulation PreTest, hatta bağlı hassas cihazları algılayıp yalıtım testini durdurarak ekipmanın zarar görmesini önler.",
      },
      {
        ad: "Fluke 1621 — Topraklama ölçüm cihazı",
        ozet:
          "3 kutuplu gerilim düşümü ve 2 kutuplu direnç yöntemlerini destekler; ortamdaki gürültü gerilimini otomatik algılayarak yanıltıcı okumanın önüne geçer.",
      },
      {
        ad: "Sonel PRS-1 — Zemin ve duvar yalıtım probu",
        ozet:
          "Zemin ve duvar yalıtım direncini ölçmek için kullanılan üçgen prob; yaklaşık 900 mm² temas yüzeyiyle EN 1081'e uygun ölçüm sağlar.",
      },
      {
        ad: "Fluke 179 — Dijital multimetre",
        ozet:
          "True-RMS gerilim ve akım ölçümü; birlikte gelen probla −40…400 °C sıcaklık ölçer. CAT III 1000 V / CAT IV 600 V güvenlik sınıfında.",
      },
      {
        ad: "Fluke 302+ — Pens ampermetre",
        ozet:
          "400 A'e kadar AC akım ölçer. 30 mm çene açıklığıyla pano içindeki dar aralıklarda, hattı kesmeden ölçüm alınabilir.",
      },
      {
        // ⚠️ 2026-09-02: model kullanici tarafindan teyit edildi -> DCM60R.
        // Gonderilen fotograf DCM301 gosteriyordu (dosya adi da oyleydi) ama
        // sahadaki cihaz DCM60R. Fotograf yaniltmis; model geri kondu.
        ad: "Sanwa DCM60R — Pens ampermetre",
        ozet:
          "True-RMS ölçüm yapar; 600 A akım, 600 V gerilim ve direnç/süreklilik. Hattı kesmeden akım okumak ve ikinci bir ölçüm noktası açmak için kullanılır.",
      },
    ],
  },
  {
    baslik: "Termal görüntüleme",
    aciklama:
      "Panolarda ve makine gruplarında gözle görülmeyen ısınmayı, arıza oluşmadan önce yakalamak için.",
    hizmet: { yol: "/ekipman/makinalarda-elektriksel-kontrol", ad: "Makinalarda elektriksel kontrol" },
    cihazlar: [
      {
        ad: "Fluke Ti480 PRO — Termal kamera",
        ozet:
          "640×480 dedektör ve 50 mK termal hassasiyet. MultiSharp Focus sayesinde farklı mesafedeki noktalar tek karede net çıkar; pano içinde her klemens ayrı ayrı odaklanmadan görüntülenir.",
      },
      {
        ad: "Fluke Ti200 — Termal kamera",
        ozet:
          "LaserSharp otomatik odaklama ve IR-Fusion. Termal görüntüyü gerçek görüntüyle bindirerek ısınan noktanın tam olarak hangi eleman olduğunu gösterir.",
      },
    ],
  },
  {
    baslik: "Yangın ve havalandırma sistemleri",
    aciklama:
      "Yangın algılama ile havalandırma sistemlerinin gerçekten çalıştığını yerinde doğrulamak için.",
    hizmet: { yol: "/ekipman/yangin-algilama", ad: "Yangın algılama sistemleri kontrolü" },
    cihazlar: [
      {
        ad: "Testifire 9202 — Dedektör test cihazı",
        ozet:
          "Duman, ısı ve karbon monoksit dedektörlerini tek üniteyle, basınçlı gaz tüpü kullanmadan test eder. Uzatma çubuklarıyla 9 metre yüksekliğe kadar ulaşır.",
      },
      {
        ad: "CEM DT-619 — Anemometre",
        ozet:
          "0,4–30 m/s hava hızı ve debi ölçer. Havalandırma menfezinin gerçekten çekip çekmediğini tahminle değil sayıyla ortaya koyar.",
      },
    ],
  },
  {
    baslik: "Basınç ve sızdırmazlık testleri",
    aciklama:
      "Basınçlı kaplar, kazanlar ve yangın tesisatında hidrostatik test ve sızdırmazlık kontrolleri.",
    hizmet: { yol: "/ekipman/basincli-kaplar", ad: "Basınçlı kapların periyodik kontrolü" },
    cihazlar: [
      {
        // ⚠️ Model duzeltildi: bag "E-Push" diyordu ama o sayfanin kendi teknik
        // degerleri (1300 W, 60 bar, 6,5 l/dak, 12 kg) E-Push 2'nin degerleri
        // ve kullanicinin fotografi da E-Push 2 gosteriyor. Iki bagimsiz
        // isaret ayni yeri gosterdigi icin bu duzeltme guvenli.
        ad: "REMS E-Push 2 — Elektrikli basınç test pompası",
        ozet:
          "60 bara kadar basınç üretir. Boru, tank ve yangın tesisatında sızdırmazlık testini elle pompalamaya göre çok daha kararlı bir basınçla yapar.",
      },
      {
        // ⚠️ Kullanicinin fotografi Turk yapimi ERYIL marka el pompasi
        // gosteriyor; gonderilen bag ise bambaska bir ureticinin (ATO)
        // urunuydu. O bagdaki degerler (4,5 L depo, 2,5/6,3 MPa) baska bir
        // urune ait oldugu icin YAZILMADI. Marka/model teyit bekliyor.
        ad: "El tipi basınç test pompası",
        ozet:
          "Manometreli manuel pompa. Elektrik bulunmayan ya da elektrikli ekipmanın uygun olmadığı sahalarda basınç ve sızdırmazlık testi için kullanılır.",
      },
      {
        // ⚠️ 2026-09-02: kullanici cihazin kadranini okudu — 0/25 bar, Ø60 mm,
        // KL 1,6, gliserinli. Ne gonderilen bag (Mitalub, 100 mm) ne de
        // fotograf (Pakkens 0-160 bar) dogruymus.
        // ⭐ "1,6" bilmecesi de boylece cozuldu: o basinc degil DOGRULUK
        // SINIFI (KL 1,6). Saticinin "1.6 Bar" basligi buyuk ihtimalle ayni
        // karisiklik. Sinif degeri, gostergenin tam skalasina gore izin
        // verilen sapma yuzdesini anlatir.
        ad: "Gliserinli manometre (0–25 bar, Ø60 mm, KL 1,6)",
        adet: 2,
        ozet:
          "Test hattındaki basıncı okumak için kullanılır. Gliserin dolgusu basınç dalgalanmasında ibrenin titremesini keser; değer sıçramadan, sağlıklı okunur.",
      },
    ],
  },
  {
    baslik: "Boyut ve mesafe ölçümleri",
    aciklama:
      "Kaldırma ekipmanlarında, raf sistemlerinde ve makine yerleşiminde mesafe ile aşınma ölçümleri.",
    hizmet: { yol: "/ekipman/kaldirma-iletme", ad: "Kaldırma ve iletme ekipmanları kontrolü" },
    cihazlar: [
      {
        ad: "Bosch GLM 150-27 C — Lazer metre",
        ozet:
          "150 metreye kadar, ±1,5 mm doğrulukla ölçer. Yakınlaştırmalı kamera hedeflemesi sayesinde uzak noktada bile doğru yere nişan alınır.",
      },
      {
        ad: "Bosch GLM 50-22 — Lazer metre",
        ozet:
          "50 metreye kadar ölçüm. Yükseklik, geçiş genişliği ve güvenlik mesafesi gibi ölçüler için hızlı ve tek kişiyle alınabilir.",
      },
      {
        // ⚠️ 2026-09-02: celiski cozuldu — kullanici "her ikisi" dedi. Bag
        // dijital modele (Mitutoyo 500-181-20, 0,01 mm), fotograf mekanik
        // surmeli kumpasa aitti; ikisi de sahada. Bu yuzden tek kayit,
        // adet 2.
        ad: "Mitutoyo kumpas — dijital ve sürmeli",
        adet: 2,
        ozet:
          "150 mm ölçüm aralığı; dijital olanı 0,01 mm çözünürlükte okur. Halat, zincir ve kanca gibi elemanlardaki aşınmayı gözle değil ölçüyle değerlendirmek için; ölçülen değer rapora yazılır ve bir sonraki kontrolde karşılaştırılır.",
      },
    ],
  },
];

/** Sayfa basliginda ve ozetlerde kullanilan toplam cihaz sayisi. */
export const CIHAZ_SAYISI = CIHAZ_GRUPLARI.reduce(
  (t, g) => t + g.cihazlar.reduce((s, c) => s + (c.adet ?? 1), 0),
  0,
);
