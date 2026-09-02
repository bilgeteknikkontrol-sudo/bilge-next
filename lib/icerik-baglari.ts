/**
 * ICERIK BAGLARI — hizmet / rehber / bolge sayfalarini birbirine baglar.
 *
 * ⚠️ NEDEN VAR: 2026-08-30 denetiminde site 144 sayfaya ulasmisti ama sayfa
 * gruplari birbirine HIC baglanmiyordu:
 *
 *   - Ekipman sayfasi yalnizca AYNI KATEGORIDEKI ekipmanlara link veriyordu.
 *     Hicbir ekipman sayfasindan bir bolge sayfasina ya da konuyu anlatan
 *     rehber yaziya gecis yoktu.
 *   - Bolge sayfalarinda tek bir hizmet linki bile yoktu; "Hizmet Verdigimiz
 *     Alanlar" basligi altindakiler tiklanamayan etiketlerdi.
 *   - Yazilar yalnizca baska yazilara baglaniyordu.
 *
 * Iki sonucu vardi. Birincisi, ic link gucu ekipman sayfalarina hic akmiyordu.
 * Ikincisi ve daha kotusu, YAMYAMLASMA: `/yazilar/forklift-periyodik-kontrolu`
 * ile `/ekipman/forklift` neredeyse ayni baslikla ("Forklift Periyodik
 * Kontrolu") ayni aramaya giriyor, Google hangisini gosterecegini bilemiyor
 * ve ikisi birden zayifliyordu. Ayni cakisma vinc, kompresor, basincli kap ve
 * topraklama icin de vardi.
 *
 * Cozum sayfayi silmek degil, ROLLERI AYIRMAK: rehber yazi bilgilendirir ve
 * ilgili hizmet sayfasina belirgin bir baglantiyla gonderir; hizmet sayfasi
 * satis yapar ve derinlesmek isteyeni yaziya gonderir. Google icin de hangi
 * sayfanin ticari hedef oldugu boylece netlesir.
 */

/** Rehber yazi slug'i -> anlattigi konunun hizmet (ekipman) sayfalari. */
export const YAZI_EKIPMAN: Record<string, string[]> = {
  "forklift-periyodik-kontrolu": ["forklift", "istif-makinasi", "transpalet"],
  "vinc-periyodik-kontrol": ["mobil-vinc", "monoray-vinc", "kaldirma-iletme"],
  "kompresor-periyodik-kontrol": ["kompresor-hava-tanki", "basincli-kaplar"],
  "basincli-kap-hidrostatik-test": ["basincli-kaplar", "kompresor-hava-tanki"],
  "hidrostatik-test-nedir": ["basincli-kaplar", "buhar-kazani"],
  "topraklama-direnci-kac-ohm-olmali": ["topraklama-olcumu", "elektrik-tesisat"],
  "yuk-testi-nedir": ["kaldirma-iletme", "mobil-vinc"],
  "celik-halat-ne-zaman-degistirilir": ["sapan-ve-kaldirma-aksesuarlari", "monoray-vinc"],
  "kazan-dairesi-guvenlik-sartlari": ["buhar-kazani", "kalorifer-kazani", "sicak-su-ve-kizgin-su-kazani"],
  "preslerde-is-guvenligi": ["hidrolik-pres", "eksantrik-pres", "abkant-pres"],
  "rops-fops-nedir": ["is-makineleri", "kazici-yukleyici"],
  "yangin-pompasi-haftalik-test": ["yangin-pompasi", "sprinkler-yagmurlama-sistemi"],
  "yangin-tesisati-projesi-zorunlu-mu": ["yangin-tesisati", "yangin-dolabi-ve-hidrant"],
  "yangin-algilama-projesi-zorunlu-mu": ["yangin-algilama", "duman-tahliye-sistemi"],
  "havalandirma-projesi-zorunlu-mu": ["havalandirma", "duman-tahliye-sistemi"],
  "elektrik-tesisat-projesi-zorunlu-mu": ["elektrik-tesisat", "makinalarda-elektriksel-kontrol"],
  "periyodik-kontrol-yaptirmamanin-cezasi": ["mekanik-periyodik-kontrol"],
  "periyodik-kontrol-cezasi-2026": ["mekanik-periyodik-kontrol"],
  "isg-denetiminde-istenen-belgeler": ["mekanik-periyodik-kontrol", "elektrik-tesisat"],

  /* ---- 2026-09-02'de eklenenler ----------------------------------------
     Canli site tarandiginda 30 rehber yazinin 11'i bu tabloda YOKTU; yani
     hicbir hizmet sayfasindan onlara link gitmiyordu. Ucu (17020, operator
     belgesi, en sik uygunsuzluklar) tum sitede YALNIZCA /yazilar listesinden
     link aliyordu — Search Console'da 45 sayfanin "kesfedildi/tarandi ama
     dizine eklenmedi" durumunda beklemesinin bilinen sebeplerinden biri
     tam olarak budur.

     ⚠️ Bunlar konu olarak GENEL yazilar (mevzuat, sozlesme, rapor okuma).
     Hepsini ayni "genel" hizmet sayfasina bagli birakmak o sayfada 10
     maddelik bir liste, digerlerinde ise hic liste birakirdi; bu yuzden
     her yazi en dogal karsiligi olan 1-2 hizmete dagitildi. Sayfa basina
     dusen yazi sayisi en fazla 5. ---- */
  "periyodik-kontrol-nedir": ["mekanik-periyodik-kontrol"],
  "periyodik-kontrolu-kimler-yapabilir": ["mekanik-periyodik-kontrol"],
  "periyodik-kontrol-yeni-yonetmelik-2025": ["is-makineleri"],
  "ekipnet-nedir": ["is-makineleri"],
  "isg-katip-periyodik-kontrol-sozlesmesi": ["forklift"],
  "iso-iec-17020-2026-yenilikleri": ["basincli-kaplar"],
  "periyodik-kontrol-raporu-nasil-okunur": ["kaldirma-iletme"],
  "periyodik-kontrol-sureleri": ["kompresor-hava-tanki", "havalandirma"],
  "periyodik-kontrolde-en-sik-cikan-uygunsuzluklar": ["makina-tezgah", "topraklama-olcumu"],
  "periyodik-kontrole-hazirlik": ["buhar-kazani"],
  "operator-belgesi-mi-periyodik-kontrol-mu": ["mobil-vinc", "egitim"],

  /* Ayni gun eklenen iki yeni elektrik yazisi. Ikisi de dogrudan bir hizmet
     sayfasinin konusunu anlattigi icin bagi mekanik: rapor formati dort
     tesisat sayfasini birden ilgilendiriyor. */
  "elektrik-periyodik-kontrol-rapor-formati": [
    "elektrik-tesisat", "topraklama-olcumu", "paratoner-yildirimdan-korunma", "yangin-algilama",
  ],
  "elektrik-ic-tesisat-uygunluk-belgesi": ["elektrik-tesisat", "makinalarda-elektriksel-kontrol"],
};

/**
 * Tersi: ekipman slug'i -> o ekipmani anlatan rehber yazilar.
 * YAZI_EKIPMAN tek kaynak; bu tablo ondan uretiliyor ki ikisi birbirinden
 * kopmasin.
 */
export const EKIPMAN_YAZI: Record<string, string[]> = Object.entries(YAZI_EKIPMAN).reduce(
  (acc, [yazi, ekipmanlar]) => {
    for (const e of ekipmanlar) (acc[e] ??= []).push(yazi);
    return acc;
  },
  {} as Record<string, string[]>,
);

/**
 * ELEKTRIK GRUBU ZORUNLU RAPOR FORMATI
 *
 * ⚠️ 1 Eylul 2025'ten beri, CSGB Is Sagligi ve Guvenligi Genel Mudurlugu
 * onayli "Elektrik Grubu Is Ekipmanlari Zorunlu Periyodik Kontrol Rapor
 * Formati"nin sekil ve icerik olarak eksiksiz kullanilmasi zorunlu
 * (dayanak: Is Ekipmanlari Yonetmeligi md. 14/B). Kapsam Bakanligin
 * duyurusunda sayilan basliklarla sinirli — bu yuzden liste tum elektrik
 * sayfalarini degil, YALNIZCA duyuruda gecen kontrolleri iceriyor.
 *
 * ⚠️ NEDEN SAYFADA YAZIYOR: 2026-09-02 taramasinda sitenin 153 sayfasinin
 * HICBIRINDE "rapor formati" ifadesi gecmiyordu; oysa kural bir yildir
 * yururlukte ve kurulus raporlarini bu formatta duzenliyor (kullanici
 * teyit etti). Musteri icin ayirt edici bir bilgi ve E-E-A-T sinyali;
 * dogru yer, karar verilen sayfa.
 *
 * ⚠️ Bu liste KODDA: ekipman sayfasinin govde metni panelden yonetiliyor
 * ama bu not sablonda duruyor, boylece panelde metin degistirildiginde
 * kaybolmuyor ve tek yerden guncelleniyor.
 */
export const ELEKTRIK_RAPOR_FORMATI_SLUGLARI = [
  "elektrik-tesisat", // elektrik tesisati gozle kontrol ve fonksiyon testleri
  "topraklama-olcumu", // alcak gerilim topraklama tesisati
  "paratoner-yildirimdan-korunma", // yildirimdan korunma tesisati
  "yangin-algilama", // yangin algilama ve uyari sistemleri
  // ⚠️ `makinalarda-elektriksel-kontrol` BILEREK YOK: duyurudaki basliklarla
  // birebir eslesmiyor. Duyuruda ayrica 1-36 kV transformator geciyor, sitede
  // ona karsilik gelen bir ekipman sayfasi bulunmuyor.
];

/**
 * Bolge sayfasinda one cikarilacak hizmetler.
 *
 * Sehre gore secildi: Kocaeli agir sanayi ve liman, Bursa otomotiv/tekstil
 * uretim, Beylikduzu depolama ve lojistik agirlikli. Ayni listeyi sekiz
 * sayfaya kopyalamak, bolge sayfalarini birbirinin kopyasi haline getirirdi.
 */
export const BOLGE_EKIPMAN: Record<string, string[]> = {
  istanbul: [
    "forklift", "kaldirma-iletme", "basincli-kaplar", "elektrik-tesisat",
    "yangin-tesisati", "raf-sistemleri", "havalandirma", "topraklama-olcumu",
  ],
  beylikduzu: [
    "forklift", "transpalet", "raf-sistemleri", "kompresor-hava-tanki",
    "elektrik-tesisat", "yangin-dolabi-ve-hidrant", "istif-makinasi", "topraklama-olcumu",
  ],
  ankara: [
    "kaldirma-iletme", "basincli-kaplar", "elektrik-tesisat", "topraklama-olcumu",
    "yangin-algilama", "buhar-kazani", "forklift", "havalandirma",
  ],
  izmir: [
    "basincli-kaplar", "buhar-kazani", "kaldirma-iletme", "mobil-vinc",
    "yangin-tesisati", "elektrik-tesisat", "forklift", "kompresor-hava-tanki",
  ],
  kocaeli: [
    "basincli-kaplar", "buhar-kazani", "kizgin-yag-kazani", "mobil-vinc",
    "is-makineleri", "kaldirma-iletme", "elektrik-tesisat", "patlamadan-korunma",
  ],
  bursa: [
    "makina-tezgah", "hidrolik-pres", "eksantrik-pres", "kaldirma-iletme",
    "elektrik-tesisat", "kompresor-hava-tanki", "forklift", "havalandirma",
  ],
  tekirdag: [
    "basincli-kaplar", "buhar-kazani", "is-makineleri", "raf-sistemleri",
    "forklift", "elektrik-tesisat", "kaldirma-iletme", "yangin-tesisati",
  ],
  "turkiye-geneli": [
    "kaldirma-iletme", "basincli-kaplar", "elektrik-tesisat", "yangin-tesisati",
    "is-makineleri", "makina-tezgah", "is-hijyeni-olcumleri", "egitim",
  ],

  /* ---- Istanbul ilceleri: liste ilcenin sanayi profiline gore secildi.
     Sekiz ilceye ayni listeyi vermek, sayfalari birbirinin kopyasi
     haline getirirdi — bkz. lib/bolge-icerik.ts basindaki gerekce. ---- */
  esenyurt: [
    "raf-sistemleri", "forklift", "transpalet", "kompresor-hava-tanki",
    "yangin-tesisati", "sprinkler-yagmurlama-sistemi", "elektrik-tesisat", "havalandirma",
  ],
  basaksehir: [
    "makina-tezgah", "torna-tezgahi", "freze-tezgahi", "eksantrik-pres",
    "dairesel-testere", "serit-testere", "kompresor-hava-tanki", "elektrik-tesisat",
  ],
  arnavutkoy: [
    "raf-sistemleri", "forklift", "buhar-kazani", "kompresor-hava-tanki",
    "yangin-tesisati", "sprinkler-yagmurlama-sistemi", "yangin-pompasi", "makina-tezgah",
  ],
  avcilar: [
    "kaldirma-iletme", "sapan-ve-kaldirma-aksesuarlari", "forklift", "mobil-vinc",
    "konveyor-bantli-iletme", "elektrik-tesisat", "topraklama-olcumu", "yangin-algilama",
  ],
  tuzla: [
    "basincli-kaplar", "mobil-vinc", "monoray-vinc", "sapan-ve-kaldirma-aksesuarlari",
    "kizgin-yag-kazani", "patlamadan-korunma", "kaynak-makinasi", "elektrik-tesisat",
  ],
  umraniye: [
    "torna-tezgahi", "freze-tezgahi", "isleme-merkezi-cnc", "abkant-pres",
    "giyotin-makas", "monoray-vinc", "kompresor-hava-tanki", "makinalarda-elektriksel-kontrol",
  ],
  pendik: [
    "hidrolik-pres", "eksantrik-pres", "kaynak-makinasi", "punta-tabanca",
    "konveyor-bantli-iletme", "forklift", "raf-sistemleri", "kompresor-hava-tanki",
  ],
  buyukcekmece: [
    "plastik-enjeksiyon-makinesi", "buhar-kazani", "kalorifer-kazani", "isi-degistirici-esanjor",
    "kompresor-hava-tanki", "raf-sistemleri", "forklift", "yangin-dolabi-ve-hidrant",
  ],
};

/** Bolge tablosunda karsiligi olmayan yeni bir sehir eklenirse kullanilir. */
export const VARSAYILAN_BOLGE_EKIPMAN = [
  "kaldirma-iletme", "forklift", "basincli-kaplar", "elektrik-tesisat",
  "yangin-tesisati", "makina-tezgah",
];

/**
 * HIZMET BASLIGI — "{ad} Periyodik Kontrolü" kalibinin cift yazma hatasi.
 *
 * ⚠️ Ekipman kayitlarinin bir kismi ADINDA zaten hizmet ifadesi tasiyor
 * ("Forklift Periyodik Kontrolü", "Basınçlı Kapların Kontrolü", "Mekanik
 * Periyodik Kontrol"). Sablon bunlarin sonuna kosulsuz "Periyodik Kontrolü"
 * ekliyordu ve 2026-08-30 denetiminde 92 ekipman sayfasinin 63'unde H1 soyle
 * cikiyordu:
 *
 *     Forklift Periyodik Kontrolü Periyodik Kontrolü
 *     Buhar Kazanı Periyodik Kontrolü Periyodik Kontrolü
 *     Havalandırma Kontrolü Periyodik Kontrolü
 *
 * Title etiketleri `seoTitle` alanindan geldigi icin dogruydu; bozuk olan
 * yalnizca H1'di — yani sayfanin en gorunur basligi. Google bu tur tekrari
 * otomatik anahtar kelime doldurmasi sayar; kullaniciya da bakimsiz gorunur.
 *
 * Ayrica bazi kayitlar hic "kontrol" hizmeti degil ("Eğitim Hizmetleri",
 * "Patlamadan Korunma Dokümanı", "Makina Yerleşim Projesi") — onlara ek
 * yapistirilmasi anlamca da yanlisti.
 */
const HIZMET_EKI = "Periyodik Kontrolü";

/**
 * Adin sonu zaten tamamlanmis bir hizmet adi mi?
 * Turkce ekleri de kapsar: kontrol / kontrolu / kontroller, muayene(si),
 * test(i), olcum(u/leri), proje(si), dokuman(i), hizmet(leri).
 */
const ZATEN_HIZMET_ADI =
  /(kontrol|kontrolü|kontrolu|kontrolleri|muayene|muayenesi|test|testi|ölçümü|ölçümleri|projesi|dokümanı|hizmetleri)$/i;

/** Ekipman adindan sayfa/H1 basligi uretir; ek yalnizca gerekiyorsa eklenir. */
export function hizmetBasligi(ad: string): string {
  const temiz = ad.trim();
  return ZATEN_HIZMET_ADI.test(temiz) ? temiz : `${temiz} ${HIZMET_EKI}`;
}

/**
 * Ekipmanin SADE adi: sonundaki hizmet ifadesi atilir.
 * "Forklift Periyodik Kontrolü" -> "Forklift"
 * Es anlamli adlari uretirken gerekli; yoksa "Forklift Periyodik Kontrolü
 * Fenni Muayenesi" gibi anlamsiz dizeler cikiyor.
 */
export function sadeAd(ad: string): string {
  return (
    ad
      .trim()
      .replace(/\s*(periyodik\s+)?(kontrolleri|kontrolü|kontrolu|kontrol|muayenesi|muayene)$/i, "")
      .trim() || ad.trim()
  );
}

/**
 * "Fenni muayene" — mevzuattaki adi periyodik kontrol olan islemin sahada ve
 * aramalarda hala en cok kullanilan adi.
 *
 * ⚠️ 2026-08-30 denetiminde sitenin 144 sayfasinin HICBIRINDE bu ifade
 * gecmiyordu. Rakiplerden teknikperiyodikkontrol.com ayni ekipman icin
 * "Fenni Muayene" / "Periyodik Muayene" / "Periyodik Kontrol" diye ayri ayri
 * sayfalar acmis durumda. Ayni oyunu oynayip ucer kopya sayfa uretmek dogru
 * degil (Google bunu kapi sayfasi sayar); dogru olan es anlamliyi mevcut
 * sayfada dogal sekilde karsilamak: kunyede gorunur bir satir ve yapisal
 * veride `alternateName`.
 */
export function esAnlamliAdlar(ekipmanAdi: string): string[] {
  const sade = sadeAd(ekipmanAdi);
  return [
    `${sade} Fenni Muayenesi`,
    `${sade} Periyodik Muayenesi`,
    `${sade} Muayene Raporu`,
  ];
}
