// Ilk hali PHP inc/site-data.php'den uretildi; artik ELLE bakim yapiliyor.
// Kurum kunyesi bilgileri sitenin onceki surumunun canli iletisim sayfasindan alindi.
import type { StaticImageData } from "next/image";
import logo_gondol_jpg from "../public/img/referanslar/gondol.jpg";
import logo_checkpoint_png from "../public/img/referanslar/checkpoint.png";
import logo_avek_png from "../public/img/referanslar/avek.png";
import logo_ekol_ofset_jpg from "../public/img/referanslar/ekol-ofset.jpg";
import logo_pelsan_png from "../public/img/referanslar/pelsan.png";
import logo_alfa_metal_png from "../public/img/referanslar/alfa-metal.png";
import logo_tam_hangers_jpg from "../public/img/referanslar/tam-hangers.jpg";
import logo_mashattan_png from "../public/img/referanslar/mashattan.png";
// Uzmanlik alani kartlarinin varsayilan saha fotograflari.
import img_basincli_kap_kontrolu from "../public/img/basincli-kaplarin-periyodik-kontrolu.webp";
import img_elektrik_olcum_kontrolu from "../public/img/elektirik-tesisati-olcum-kontrolleri.webp";

export type Referans = { name: string; logo: StaticImageData };
export const REFERANSLAR: Referans[] = [
  { name: "Gondol", logo: logo_gondol_jpg },
  { name: "Check Point", logo: logo_checkpoint_png },
  { name: "Avek", logo: logo_avek_png },
  { name: "Ekol Ofset", logo: logo_ekol_ofset_jpg },
  { name: "Pelsan", logo: logo_pelsan_png },
  { name: "Alfa Metal Aluminium", logo: logo_alfa_metal_png },
  { name: "Tam Hangers", logo: logo_tam_hangers_jpg },
  { name: "Mashattan", logo: logo_mashattan_png },
];

/**
 * UZMANLIK ALANLARI — kisi adi yerine BRANS.
 *
 * ⚠️ 2026-08-31: burada calisan adlari ve unvanlari duruyordu (EKIP dizisi).
 * Kullanici personelin sitede gorunmesini istemedi. Isimleri silmek tek
 * basina bir kayipti: "raporun arkasinda gercek muhendis var" mesaji sitenin
 * en onemli guven sinyallerinden biriydi ve akredite muayenede kontrolu KIMIN
 * yaptigi mevzuatin da sordugu bir sey (EKIPNET'e kayitli ilgili brans).
 *
 * Cozum: kisi degil BRANS gosteriliyor. Kisisel veri yayinlanmiyor, mesaj
 * korunuyor — ve kadro degistiginde sitede guncellenecek bir sey kalmiyor.
 *
 * ⚠️ Aciklamalarda YALNIZCA sitenin zaten sundugu hizmetler anlatiliyor.
 * Buraya akreditasyon kapsami disinda bir muayene turu (ornek: tahribatsiz
 * muayene) yazilmamali — yetkisiz hizmet iddiasi olur.
 */
export type UzmanlikAlani = {
  ikon: string;
  ad: string;
  aciklama: string;
  /**
   * Kart gorseli. Panelden gorsel yuklenirse ORASI kazanir; buradaki foto
   * yalnizca varsayilan. Statik import oldugu icin Next boyutlandirip
   * bulanik yer tutucu (blur) uretebiliyor — panelden gelen adres icin bu
   * mumkun degil, o yuzden iki durum sayfada ayri ele aliniyor.
   */
  foto: StaticImageData;
};

export const UZMANLIK_ALANLARI: UzmanlikAlani[] = [
  {
    ikon: "⚙️",
    ad: "Makine Mühendisliği",
    aciklama:
      "Basınçlı kaplar, kaldırma ve iletme ekipmanları, iş makineleri ile makina ve tezgâhların periyodik kontrolü. Statik ve dinamik yük testleri ile hidrostatik testler bu kapsamda, sahada yapılır.",
    foto: img_basincli_kap_kontrolu,
  },
  {
    ikon: "⚡",
    ad: "Elektrik Mühendisliği",
    aciklama:
      "Elektrik iç tesisatı, topraklama ve paratoner ölçümleri ile yangın algılama ve ihbar sistemlerinin kontrolü. Ölçümler kalibrasyonu geçerli cihazlarla yapılır ve değerleriyle birlikte rapora işlenir.",
    foto: img_elektrik_olcum_kontrolu,
  },
];

export type Bolge = { ad: string; not: string; iller: { il: string; aciklama: string }[] };
export const BOLGELER: Bolge[] = [
  {
    ad: "Marmara Bölgesi",
    not: "Merkez ofisimizin bulunduğu bölge; yoğun sanayi ve lojistik tesislerine en hızlı erişim burada.",
    iller: [
      { il: "İstanbul", aciklama: "Merkez ofisimizin bulunduğu şehir. Sanayi tesisleri, AVM'ler, depo ve lojistik merkezleri için düzenli periyodik kontrol hizmeti veriyoruz." },
      { il: "Kocaeli", aciklama: "Yoğun ağır sanayi ve otomotiv üretim tesislerinin bulunduğu bölgede basınçlı kap, kaldırma ekipmanı ve elektrik tesisatı kontrolleri." },
      { il: "Bursa", aciklama: "Otomotiv, tekstil ve makine imalat sektörlerinde makine-tezgah ve iş ekipmanı periyodik kontrolleri." },
      { il: "Balıkesir", aciklama: "Gıda ve enerji sektörü tesislerinde periyodik teknik kontrol ve elektrik ölçümleri." },
      /**
       * ⚠️ Tekirdağ BU LISTEDE YOKTU ama `/bolge/tekirdag` sayfası ve CMS
       * kaydı vardı. Sonuç: sayfa canlıda duruyor, `/bolge` listesinden ona
       * hiç link verilmiyor ve kurumsal yapısal veride hizmet verilen iller
       * arasında geçmiyordu — yani Google için Tekirdağ'da hizmet
       * vermiyormuşuz gibi görünüyordu. 2026-08-30 tam taramasında bulundu.
       */
      { il: "Tekirdağ", aciklama: "Çorlu ve Çerkezköy hattındaki tekstil, gıda ve plastik üretim tesislerinde periyodik kontrol ve raf sistemi muayeneleri." },
    ],
  },
  {
    ad: "İç Anadolu Bölgesi",
    not: "",
    iller: [
      { il: "Ankara", aciklama: "Kamu kurumları ve sanayi tesislerinde periyodik kontrol, İSG-KATİP sözleşme süreçlerine uygun raporlama." },
      { il: "Konya", aciklama: "Tarım makineleri ve imalat sanayindeki iş ekipmanlarının periyodik kontrolleri." },
      { il: "Kayseri", aciklama: "Mobilya ve tekstil üretim tesislerinde makine-tezgah ve elektrik tesisatı kontrolleri." },
    ],
  },
  {
    ad: "Ege Bölgesi",
    not: "",
    iller: [
      { il: "İzmir", aciklama: "Liman, lojistik ve sanayi tesislerinde kaldırma-iletme ekipmanları ve basınçlı kap muayeneleri." },
      { il: "Manisa", aciklama: "Organize sanayi bölgesindeki üretim tesislerinde periyodik teknik kontrol." },
      { il: "Aydın", aciklama: "Tarım ve gıda işleme tesislerinde iş ekipmanı ve elektrik tesisatı kontrolleri." },
    ],
  },
  {
    ad: "Akdeniz Bölgesi",
    not: "",
    iller: [
      { il: "Antalya", aciklama: "Otel, AVM ve turizm tesislerinde yürüyen merdiven, asansör ve yangın tesisatı kontrolleri." },
      { il: "Adana", aciklama: "Tarım makineleri ve tekstil sanayinde periyodik kontrol hizmetleri." },
      { il: "Mersin", aciklama: "Liman ve lojistik tesislerinde kaldırma ekipmanları ve raf sistemleri kontrolü." },
      { il: "Hatay", aciklama: "Sanayi ve lojistik tesislerinde periyodik teknik kontrol ve muayene." },
      { il: "Kahramanmaraş", aciklama: "Tekstil ve halı sanayindeki iş ekipmanlarının periyodik kontrolleri." },
    ],
  },
  {
    ad: "Güneydoğu Anadolu Bölgesi",
    not: "",
    iller: [
      { il: "Gaziantep", aciklama: "Bölgenin en yoğun sanayi merkezlerinden birinde tekstil, gıda ve plastik üretim tesislerine periyodik kontrol." },
      { il: "Şanlıurfa", aciklama: "Tarım ve enerji sektörü tesislerinde iş ekipmanı ve elektrik tesisatı kontrolleri." },
      { il: "Diyarbakır", aciklama: "Sanayi ve ticaret tesislerinde periyodik teknik kontrol hizmetleri." },
    ],
  },
  {
    ad: "Karadeniz Bölgesi",
    not: "",
    iller: [
      { il: "Samsun", aciklama: "Liman ve sanayi tesislerinde basınçlı kap ve kaldırma ekipmanı muayeneleri." },
    ],
  },
  {
    ad: "Doğu Anadolu Bölgesi",
    not: "",
    iller: [
      { il: "Van", aciklama: "Bölgedeki sanayi ve ticaret tesislerinde periyodik teknik kontrol hizmetleri." },
    ],
  },
];

export type SSS = { q: string; a: string };
export const GENEL_SSS: SSS[] = [
  { q: "Periyodik teknik kontroller neden yasal olarak zorunludur?", a: "İş ekipmanlarının periyodik kontrollerini yaptırmak kanuni bir zorunluluktur; bu zorunluluk 25.04.2013 tarihli ve 28628 sayılı Resmî Gazete'de yayımlanan \"İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği\"nde tanımlanmıştır. Basınçlı kaplar ve kaldırma-iletme makineleri zaman içinde bozulmaya ve deforme olmaya başlar; bu ekipmanların emniyetli çalışıp çalışmadığı ancak periyodik kontrollerle belirlenebilir. Kontrol sırasında cihazın kritik noktaları incelenir, gerekli ölçümler yapılır, deneyler gerçekleştirilir ve sonuçlar yürürlükteki kanun, yönetmelik ve standartlara göre raporlanarak firmaya teslim edilir." },
  { q: "Periyodik kontrol periyotları (süreleri) nasıl belirlenir?", a: "Kontrol periyodu, İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği Ek-III'te yer alan madde 1.4 ve 1.10'a göre belirlenir. Ekipmanın periyodik kontrol aralığı önce imalatçının öngördüğü süreye, o belirtilmemişse ilgili ulusal/uluslararası standarda, o da yoksa yönetmelikteki azami sürelere göre belirlenir. İşyeri ortam koşulları, kullanım sıklığı, ekipmanın yaşı ve önceki kontrol sonuçları gibi faktörlere göre yapılacak risk değerlendirmesiyle kontrol sıklığı azami süreyi aşmamak koşuluyla artırılabilir." },
  { q: "Yaygın ekipmanlar için genel kontrol periyodu nedir?", a: "Yönetmelik Ek-III tablolarında, ilgili standartta ayrıca bir süre belirtilmediği sürece çoğu ekipman için azami periyot 1 yıldır: basınçlı kaplar (kazanlar, tanklar), kren/vinç ve kaldırma-iletme ekipmanları, forklift ve endüstriyel araçlar, elektrik ve topraklama tesisatı, yangın söndürme sistemleri, endüstriyel raf sistemleri, yürüyen merdiven ve bantlar. Yapı iskeleleri ve katodik koruma tesisatı için azami süre 6 aydır. Bilge Teknik Kontrol olarak ayrıca, kaldırma-iletme makinelerinin üç ayda bir, basınçlı kapların ise yılda bir kontrol edilmesini tavsiye ediyoruz." },
  { q: "İSG-KATİP sözleşme uygulaması nedir, nasıl uygulanır?", a: "04.02.2024 tarihli ve 32450 sayılı Resmî Gazete'de yayımlanan yönetmelik değişikliği uyarınca, işveren ile periyodik kontrol yapmaya yetkili kişiler arasında sözleşme imzalanması gerekliliği hükme bağlanmıştır. Bu kapsamda, kamu kurumları ile periyodik kontrol yetkilisi kişiler arasında düzenlenecek iş ekipmanı periyodik kontrol sözleşmelerinin İSG-KATİP üzerinden yapılması gerekmektedir. Ayrıntılı bilgiye <a href=\"https://isekipmanlari.csgb.gov.tr/detay.aspx?d=1028\" target=\"_blank\" rel=\"noopener noreferrer\">isekipmanlari.csgb.gov.tr</a> adresinden ulaşabilirsiniz." },
  { q: "Bilge Teknik Kontrol ile çalışmanın avantajları nelerdir?", a: "TS EN ISO/IEC 17020 kapsamında TÜRKAK'tan akredite A Tipi Muayene Kuruluşuyuz. Periyodik kontrol raporlarımızı yazılım programı üzerinden hazırlıyor ve resimli olarak teslim ediyoruz; kontroller sırasında görülen eksiklik, hata ve kusurlar test/kontrol fotoğrafları ve ekipmanın genel görünüm resimleriyle birlikte rapora ekleniyor. Raporlar e-imzalı olarak verildiği için istediğiniz zaman ve yerden raporlarınıza ulaşabilirsiniz. 2014 yılından bu yana değişmeyen uzman mühendis kadromuzla hizmet vermeye devam ediyoruz." },
];

export const KURUM = {
  ad: "Bilge Teknik Kontrol Muayene Gözetim Denetim Ltd. Şti.",
  kisaAd: "Bilge Teknik Kontrol",
  akreditasyon: "AB-0296-M",
  standart: "TS EN ISO/IEC 17020",
  telefon: "0212 872 52 04",
  telefonE164: "+902128725204",
  // WhatsApp hatti ayri bir numara (kullanici 2026-08-28'de verdi).
  // wa.me bicimi: basinda + ve bosluk olmadan.
  whatsapp: "0507 133 18 34",
  whatsappE164: "905071331834",
  eposta: "info@bilgeteknikkontrol.com",
  adres: "Yakuplu Mah. 65. Sk. No: 35 İç Kapı No: 4",
  ilce: "Beylikdüzü",
  il: "İstanbul",
  ulke: "TR",
  kurulus: "2014",
  geo: { lat: 41.0027, lng: 28.675 },
  // Kullanici 2026-08-27'de dogruladi: acilis 08:00.
  // (Eski PHP sitesinde iki farkli yerde 09:00 ve 08:00 yaziyordu, celiski cozuldu.)
  calismaSaatleri: "Pazartesi – Cuma, 08:00 – 18:00",
  calismaSaatleriSchema: { acilis: "08:00", kapanis: "18:00" },
};

/** Tam posta adresi, tek satir. */
export const ADRES_TEK_SATIR = `${KURUM.adres}, ${KURUM.ilce} / ${KURUM.il}`;

/**
 * ADRESIN SOKAK KISMI — yapisal veri (schema.org) icin.
 *
 * ⚠️ NEDEN VAR: 2026-08-30 denetiminde sitenin adresi IKI FARKLI SEKILDE
 * yazildigi goruldu:
 *
 *   Gorunur metin (153 sayfa) : Yakuplu Mah. 65. Sk. No: 35 İç Kapı No: 4
 *   Kurumsal sema (153 sayfa) : Yakuplu Mah. 65. Sk. No:35 İç Kapı No:4
 *
 * Yani ziyaretcinin gordugu adres ile Google'a gonderilen adres ayni degildi.
 * `/iletisim` ve `/kurumsal` sayfalarinda durum daha keskindi: ayni sayfada
 * iki ayri sema, ayni isletmenin adresini farkli yaziyordu. Isletme adi,
 * adres ve telefonun her yerde birebir ayni olmasi yerel aramada guven
 * sinyali; iki yazim bu sinyali zayiflatiyordu.
 *
 * Sebep iki ayri kaynakti: gorunur metin `KURUM.adres` sabitinden,
 * `app/layout.tsx` semasi ise veritabanindaki `settings.address` alanindan
 * okuyordu. Ikisi farkli tohumlanmisti.
 *
 * ⚠️ Ayrica `settings.address` degeri ", Beylikdüzü / İstanbul" kismini da
 * iceriyordu; sema zaten `addressLocality` ve `addressRegion` alanlarini ayri
 * yaziyor, yani ilce ve il IKI KEZ gonderiliyordu.
 *
 * Bu yardimci ikisini de cozuyor:
 *  - Paneldeki adres bosSA kod sabitine duser.
 *  - Panel degeri ilce/il de iceriyorsa o kisim atilir (tekrar onlenir).
 *  - Panel degeri, kod sabitiyle AYNI adresin farkli yazimiysa (yalnizca
 *    bosluk/noktalama farki) kanonik yazim kullanilir — gorunur metinle
 *    birebir ayni olur.
 *  - Panelden GERCEKTEN baska bir adres girilmisse o kazanir; boylece
 *    tasinma durumunda panel hala calisir.
 */
function adresSadelestir(s: string): string {
  return s.toLocaleLowerCase("tr").replace(/[\s.,:/-]/g, "");
}

export function semaSokakAdresi(panelAdresi?: string | null): string {
  const ham = panelAdresi?.trim();
  if (!ham) return KURUM.adres;

  // Sondaki ", Beylikdüzü / İstanbul" gibi ilce/il ekini at.
  const ilceIl = new RegExp(`,\\s*${KURUM.ilce}\\s*/\\s*${KURUM.il}\\s*$`, "i");
  const sokak = ham.replace(ilceIl, "").trim();
  if (!sokak) return KURUM.adres;

  // Ayni adresin farkli yazimi ise gorunur metindeki yazimi kullan.
  return adresSadelestir(sokak) === adresSadelestir(KURUM.adres) ? KURUM.adres : sokak;
}
