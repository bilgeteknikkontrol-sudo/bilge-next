/**
 * SAHADA KULLANILAN OLCUM CIHAZLARI
 *
 * ⚠️ NEDEN VAR: bir periyodik kontrol raporu, arkasindaki olcum kadar
 * saglamdir. Musteri tarafinda en cok merak edilen ama sitenin hicbir
 * yerinde yazmayan sey, olcumun HANGI CIHAZLA yapildigiydi. Ayni zamanda
 * akredite bir muayene kurulusu icin guclu bir yetkinlik sinyali.
 *
 * ⚠️ Liste KODDA, panelde degil. Cihaz listesi sik degismedigi icin bilincli
 * bir tercih; degisirse bir dagitim yeterli.
 *
 * ⚠️ GORSELLER: 2026-09-02'de kullanicinin verdigi 16 fotograf eklendi
 * (`public/img/cihazlar/`). Fotograflar uretici/satici urun cekimleridir;
 * telif riski kullaniciya iki kez yazili olarak bildirildi, kullanici
 * eklenmesini istedi. ⚠️ Gorseli "taninmayacak sekilde degistirme" istegi
 * KARSILANMADI: isleme eser yine ihlaldir ve gizleme cabasina donusur.
 * Fotograf kaldirilmak istenirse tek yapilacak `gorsel` alanini silmek —
 * kutu kendiliginden SVG simgeye doner (app/components/CihazSimge.tsx).
 *
 * ⚠️ Fotograflarin ikisi cihazla BIREBIR ORTUSMUYOR, kullaniciya bildirildi:
 * Sanwa fotografinda cihazin yuzunde DCM301 yaziyor (kayit DCM60R),
 * manometre fotografi 0-160 bar Pakkens gosteriyor (kayit 0-25 bar Ø60).
 *
 * ⚠️ Aciklamalar uretici/satici sayfalarindan DOGRULANARAK yazildi
 * (2026-09-02) ve modellerin bir kismi kullanici tarafindan teyit edildi.
 * Teknik bir sayfada yanlis model ya da yanlis deger yazmak, sayfanin amaci
 * olan guveni dogrudan zedeler: emin olunmayan sayi YAZILMAZ.
 */

/** CihazSimge bilesenindeki cizim anahtarlari. */
export type CihazTipi =
  | "tesisat-test"
  | "topraklama"
  | "pens"
  | "multimetre"
  | "prob"
  | "termal"
  | "dedektor"
  | "anemometre"
  | "pompa-elektrikli"
  | "pompa-manuel"
  | "manometre"
  | "lazermetre"
  | "kumpas";

export type Cihaz = {
  ad: string;
  tip: CihazTipi;
  /** Kutunun altindaki kisa maddeler. 2-3 tane; cumle degil, madde. */
  ozellikler: string[];
  /** Birden fazla varsa yazilir; 1 ise gosterilmez. */
  adet?: number;
  /** Kendi cekilmis fotograf eklendiginde: "/img/cihazlar/<dosya>.webp" */
  gorsel?: string;
};

export type CihazGrubu = {
  baslik: string;
  /** Grubun hangi kontrollerde kullanildigini anlatan tek cumle. */
  aciklama: string;
  /** Grubun dogal karsiligi olan hizmet sayfasi. */
  hizmet?: { yol: string; ad: string };
  /**
   * Kartin sol tarafindaki gorsel karesinin zemin rengi (Tailwind sinifi).
   * Ornek tasarimda her kartin gorseli yumusak pastel bir zemin uzerinde
   * duruyor; burada renk gruba bagli, boylece iki sutun bir bakista ayriliyor.
   */
  zemin: string;
  cihazlar: Cihaz[];
};

/**
 * ⚠️ SUTUN AYRIMI KULLANICININ KARARI, teknik siniflandirma degil.
 * Onceki turda cihazlar ne olctuklerine gore ayrilmisti; kullanici
 * 2026-09-02'de elektrik sutununda su ALTI cihazin kalmasini istedi:
 * Ti480 PRO, Ti200, 1664 FC, 1621, Sonel PRS-1, Testifire 9202.
 * Multimetre ve iki pens ampermetre bu yuzden mekanik sutununda —
 * belirleyici olan, ekiplerin cihazi hangi kontrole goturdugu.
 * Yer degistirmek: kaydi diger grubun `cihazlar` dizisine tasimak yeterli.
 */
export const CIHAZ_GRUPLARI: CihazGrubu[] = [
  {
    baslik: "Elektrik ölçüm cihazları",
    aciklama:
      "Elektrik tesisatı, topraklama ve yıldırımdan korunma kontrollerinde kullanılır.",
    hizmet: { yol: "/ekipman/elektrik-tesisat", ad: "Elektrik tesisatı periyodik kontrolü" },
    zemin: "bg-blue/10",
    cihazlar: [
      /* ⚠️ SIRA: kullanici "oncelik Fluke cihazlari olsun" dedi (2026-09-02).
         Once Fluke'lar (once termal kameralar, sonra test cihazlari), ardindan
         diger markalar. Kutular tabloyu sirayla bastigi icin sira burada
         degistirilir; sayfada ayrica siralama yok. */
      {
        ad: "Fluke Ti480 PRO — Termal kamera",
        tip: "termal",
        gorsel: "/img/cihazlar/fluke-ti480-pro.webp",
        ozellikler: [
          "640×480 dedektör, 50 mK termal hassasiyet",
          "MultiSharp Focus: farklı mesafedeki noktalar tek karede net",
          "Pano ve klemens ısınmasını arıza oluşmadan yakalar",
        ],
      },
      {
        ad: "Fluke Ti200 — Termal kamera",
        tip: "termal",
        gorsel: "/img/cihazlar/fluke-ti200.webp",
        ozellikler: [
          "LaserSharp otomatik odaklama",
          "IR-Fusion: termal görüntüyü gerçek görüntüyle bindirir",
          "Isınan elemanı tam yerinde gösterir",
        ],
      },
      {
        ad: "Fluke 1664 FC — Tesisat test cihazı",
        tip: "tesisat-test",
        gorsel: "/img/cihazlar/fluke-1664-fc.webp",
        adet: 2,
        ozellikler: [
          "Yalıtım direnci, çevrim empedansı, RCD ve topraklama testi tek cihazda",
          "Insulation PreTest: hatta bağlı hassas cihazı algılar, testi durdurur",
          "Auto Test ile yedi testi tek sırada çalıştırır",
        ],
      },
      {
        ad: "Fluke 1621 — Topraklama ölçüm cihazı",
        tip: "topraklama",
        gorsel: "/img/cihazlar/fluke-1621.webp",
        ozellikler: [
          "3 kutuplu gerilim düşümü ve 2 kutuplu direnç yöntemi",
          "Gürültü gerilimini otomatik algılar, yanıltıcı okumayı önler",
          "Ayarlanabilir limit uyarısı",
        ],
      },
      /* ---- Fluke disi cihazlar buradan sonra ---- */
      {
        ad: "Sonel PRS-1 — Zemin ve duvar yalıtım probu",
        tip: "prob",
        gorsel: "/img/cihazlar/sonel-prs-1.webp",
        ozellikler: [
          "Zemin ve duvar yalıtım direnci ölçümü",
          "Yaklaşık 900 mm² temas yüzeyi",
          "EN 1081'e uygun ölçüm",
        ],
      },
      {
        ad: "Testifire 9202 — Dedektör test cihazı",
        tip: "dedektor",
        gorsel: "/img/cihazlar/testifire-9202.webp",
        ozellikler: [
          "Duman, ısı ve karbon monoksit dedektörü tek üniteyle test edilir",
          "Basınçlı gaz tüpü yok; kapsüllü, güvenli sistem",
          "Uzatma çubuklarıyla 9 metre yüksekliğe ulaşır",
        ],
      },
    ],
  },
  {
    baslik: "Mekanik ölçüm cihazları",
    // ⚠️ Aciklama, grubun icerigi degisince guncellendi: artik multimetre,
    // pens ampermetreler ve dedektor test cihazi da bu sutunda.
    aciklama:
      "Basınçlı kap, kazan, kaldırma ekipmanı, havalandırma ve yangın sistemleri kontrollerinde kullanılır.",
    hizmet: { yol: "/ekipman/basincli-kaplar", ad: "Basınçlı kapların periyodik kontrolü" },
    zemin: "bg-accent/10",
    cihazlar: [
      /* ⚠️ 2026-09-02: kullanici elektrik sutununda YALNIZCA su besinin
         kalmasini istedi — Ti480 PRO, Ti200, 1664 FC, 1621, Sonel PRS-1.
         Multimetre, iki pens ampermetre ve dedektor test cihazi bu yuzden
         buraya alindi. Teknik siniflandirmadan cok ekiplerin cihazi hangi
         kontrole goturdugu belirleyici; karar kullanicinin. */
      {
        ad: "Fluke 179 — Dijital multimetre",
        tip: "multimetre",
        gorsel: "/img/cihazlar/fluke-179.webp",
        ozellikler: [
          "True-RMS gerilim ve akım ölçümü",
          "Sıcaklık probuyla −40…400 °C",
          "CAT III 1000 V / CAT IV 600 V",
        ],
      },
      {
        ad: "Fluke 302+ — Pens ampermetre",
        tip: "pens",
        gorsel: "/img/cihazlar/fluke-302-plus.webp",
        ozellikler: [
          "400 A'e kadar AC akım",
          "30 mm çene: pano içindeki dar aralıklarda ölçüm",
          "CAT III 600 V",
        ],
      },
      {
        ad: "Sanwa DCM60R — Pens ampermetre",
        tip: "pens",
        gorsel: "/img/cihazlar/sanwa-dcm60r.webp",
        ozellikler: [
          "True-RMS; 600 A akım, 600 V gerilim",
          "Direnç ve süreklilik ölçümü",
          "İkinci ölçüm noktası için kompakt gövde",
        ],
      },
      {
        ad: "REMS E-Push 2 — Elektrikli basınç test pompası",
        tip: "pompa-elektrikli",
        gorsel: "/img/cihazlar/rems-e-push-2.webp",
        ozellikler: [
          "60 bara kadar basınç",
          "6,5 l/dak debi, 1300 W motor",
          "Boru, tank ve yangın tesisatı sızdırmazlık testi",
        ],
      },
      {
        // ⚠️ Marka/model teyit bekliyor: kullanicinin fotografi Turk yapimi
        // ERYIL pompa gosteriyordu, gonderdigi bag ise baska bir ureticinin
        // (ATO) urunuydu. O bagdaki degerler baska urune ait oldugu icin
        // yazilmadi.
        ad: "El tipi basınç test pompası",
        tip: "pompa-manuel",
        gorsel: "/img/cihazlar/el-tipi-basinc-test-pompasi.webp",
        ozellikler: [
          "Manometreli manuel pompa",
          "Elektrik bulunmayan sahalarda basınç testi",
          "Depodan besleme, kademeli basınç yükseltme",
        ],
      },
      {
        // ⭐ Kullanici kadrani okudu: 0/25 bar, Ø60 mm, KL 1,6, gliserinli.
        // Ne gonderilen bag (Mitalub, 100 mm) ne de fotograf (Pakkens
        // 0-160 bar) dogruymus. "1,6" da basinc degil DOGRULUK SINIFI.
        ad: "Gliserinli manometre",
        tip: "manometre",
        gorsel: "/img/cihazlar/gliserinli-manometre.webp",
        adet: 2,
        ozellikler: [
          "0–25 bar, Ø60 mm kadran",
          "Doğruluk sınıfı KL 1,6",
          "Gliserin dolgusu ibre titremesini keser, değer sıçramadan okunur",
        ],
      },
      {
        ad: "Bosch GLM 150-27 C — Lazer metre",
        tip: "lazermetre",
        gorsel: "/img/cihazlar/bosch-glm-150-27c.webp",
        ozellikler: [
          "150 m menzil, ±1,5 mm doğruluk",
          "Yakınlaştırmalı kamera hedefleme",
          "Bluetooth ile veri aktarımı",
        ],
      },
      {
        ad: "Bosch GLM 50-22 — Lazer metre",
        tip: "lazermetre",
        gorsel: "/img/cihazlar/bosch-glm-50-22.webp",
        ozellikler: [
          "50 m menzil",
          "Yükseklik, geçiş genişliği ve güvenlik mesafesi",
          "Tek kişiyle hızlı ölçüm",
        ],
      },
      {
        ad: "Mitutoyo kumpas — dijital ve sürmeli",
        tip: "kumpas",
        gorsel: "/img/cihazlar/mitutoyo-kumpas.webp",
        adet: 2,
        ozellikler: [
          "150 mm ölçüm aralığı",
          "Dijital olanı 0,01 mm çözünürlükte okur",
          "Halat, zincir ve kanca aşınmasını ölçüyle değerlendirir",
        ],
      },
      {
        ad: "CEM DT-619 — Anemometre",
        tip: "anemometre",
        gorsel: "/img/cihazlar/cem-dt-619.webp",
        ozellikler: [
          "0,4–30 m/s hava hızı ölçümü",
          "Hava debisi ve min/max hafıza",
          "Menfezin gerçekten çektiğini sayıyla gösterir",
        ],
      },
    ],
  },
];

/** Sayfa girisinde kullanilan toplam cihaz sayisi (adetler dahil). */
export const CIHAZ_SAYISI = CIHAZ_GRUPLARI.reduce(
  (t, g) => t + g.cihazlar.reduce((s, c) => s + (c.adet ?? 1), 0),
  0,
);
