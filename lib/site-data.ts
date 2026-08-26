// OTOMATIK URETILDI: scratchpad (PHP inc/site-data.php kaynagindan).
import type { StaticImageData } from "next/image";
import logo_gondol_jpg from "../public/img/referanslar/gondol.jpg";
import logo_checkpoint_png from "../public/img/referanslar/checkpoint.png";
import logo_avek_png from "../public/img/referanslar/avek.png";
import logo_ekol_ofset_jpg from "../public/img/referanslar/ekol-ofset.jpg";
import logo_pelsan_png from "../public/img/referanslar/pelsan.png";
import logo_alfa_metal_png from "../public/img/referanslar/alfa-metal.png";
import logo_tam_hangers_jpg from "../public/img/referanslar/tam-hangers.jpg";
import logo_mashattan_png from "../public/img/referanslar/mashattan.png";

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

export type Uzman = { name: string; title: string };
export const EKIP: Uzman[] = [
  { name: "Tuğrul Tapan", title: "Makine Mühendisi" },
  { name: "Bülent Alkaya", title: "Makine Mühendisi" },
  { name: "Can Görgü", title: "Elektrik Mühendisi" },
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
  telefon: "0212 872 52 04",
  telefonE164: "+902128725204",
  eposta: "info@bilgeteknikkontrol.com",
  ilce: "Beylikdüzü",
  il: "İstanbul",
  ulke: "TR",
  kurulus: "2014",
};
