/**
 * Sayfa metinleri — her sayfanin basligi ve giris yazisi panelden duzenlenir.
 *
 * Onceden bu metinler sayfa dosyalarina sabit yazilmisti; degistirmek icin kod
 * degisikligi gerekiyordu. Panelde ise yalnizca ham anahtar-deger ekrani vardi
 * (/admin/content) ve kullanicinin "footer_yazi" gibi anahtarlari ezberlemesi
 * gerekiyordu.
 *
 * Burasi o anahtarlarin KAYITLI LISTESI. Admin > Sayfa Metinleri ekrani bu
 * listeyi okuyup her alan icin etiketli bir kutu ciziyor; sayfalar da ayni
 * listedeki varsayilanla birlikte degeri okuyor. Yani tek kaynak burasi.
 *
 * Yeni alan eklemek icin: buraya bir satir ekle, sayfada `m("anahtar")` cagir.
 * Panelde otomatik gorunur, ayrica bir sey yapmak gerekmez.
 */
import { getAllContent } from "./cms";

export type MetinAlani = {
  /** Icerik deposundaki anahtar. Degistirilirse kayitli deger kaybolur. */
  anahtar: string;
  etiket: string;
  /** Alanin ne oldugunu anlatan kisa not — panelde etiketin altinda cikar. */
  not?: string;
  /** Cok satirli mi? */
  uzun?: boolean;
  /**
   * Bicimlendirme isaretleri (## baslik, - madde, **kalin**) gecerli mi?
   * Panelde alanin altina kullanim notu ekleniyor ve kutu buyuk aciliyor;
   * sayfa tarafinda deger lib/metin-bicim.ts ile HTML'e ceviriliyor.
   */
  bicimli?: boolean;
  varsayilan: string;
};

export type MetinGrubu = {
  baslik: string;
  /** Sayfanin adresi — panelde "sayfayi ac" baglantisi icin. */
  yol: string;
  alanlar: MetinAlani[];
};

/** Bir sayfanin H1 + giris ciftini uretir; kalip her sayfada ayni. */
const sayfa = (
  baslik: string,
  yol: string,
  on: string,
  h1: string,
  giris: string,
  ekstra: MetinAlani[] = []
): MetinGrubu => ({
  baslik,
  yol,
  alanlar: [
    { anahtar: `${on}_baslik`, etiket: "Sayfa başlığı (H1)", not: "Sayfanın en üstündeki büyük başlık", varsayilan: h1 },
    { anahtar: `${on}_giris`, etiket: "Giriş yazısı", not: "Başlığın altındaki açıklama paragrafı", uzun: true, varsayilan: giris },
    ...ekstra,
  ],
});

export const METIN_GRUPLARI: MetinGrubu[] = [
  {
    baslik: "Ana sayfa — üst bölüm (hero)",
    yol: "/",
    alanlar: [
      {
        anahtar: "as_hero_rozet",
        etiket: "Üstteki küçük rozet",
        not: "Akreditasyon numarası sonuna otomatik eklenir; buraya yazmayın.",
        varsayilan: "TÜRKAK Akredite A Tipi Muayene Kuruluşu",
      },
      { anahtar: "as_hero_btn1", etiket: "Birinci buton", varsayilan: "Teklif Al →" },
      { anahtar: "as_hero_btn2", etiket: "İkinci buton", varsayilan: "Yasal Sürenizi Hesaplayın" },
      {
        anahtar: "as_hero_gorsel_rozet",
        etiket: "Fotoğrafın üstündeki rozet",
        not: "Akreditasyon numarası sonuna otomatik eklenir.",
        varsayilan: "Yerinde muayene · TÜRKAK",
      },
      {
        anahtar: "as_hero_gorsel_yazi",
        etiket: "Fotoğrafın üstündeki yazı",
        uzun: true,
        varsayilan:
          "Basınçlı kap, kaldırma, elektrik, yangın ve iş makineleri — tek ekipten akredite periyodik kontrol.",
      },
    ],
  },
  {
    baslik: "Ana sayfa — teklif kartı",
    yol: "/",
    alanlar: [
      { anahtar: "as_kart_etiket", etiket: "Üstteki küçük yazı", varsayilan: "Kontrol zamanı geldi mi?" },
      {
        anahtar: "as_kart_baslik",
        etiket: "Kart başlığı",
        uzun: true,
        varsayilan: "Ekipmanınızı seçin, kapsam ve fiyatı size dönelim",
      },
      { anahtar: "as_kart_buton", etiket: "Buton yazısı", varsayilan: "Teklif Formunu Aç →" },
      { anahtar: "as_kart_not", etiket: "Butonun yanındaki not", varsayilan: "2 dakika sürer · 92 ekipman türü" },
    ],
  },
  {
    baslik: "Ana sayfa — hizmetler bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_hizmet_etiket", etiket: "Hizmetler — küçük etiket", varsayilan: "Hizmetlerimiz" },
      { anahtar: "as_hizmet_baslik", etiket: "Hizmetler — başlık", varsayilan: "Tüm İş Ekipmanınız Tek Çatı Altında" },
      {
        anahtar: "as_hizmet_giris",
        etiket: "Hizmetler — açıklama",
        uzun: true,
        varsayilan: "TS EN ISO/IEC 17020 kapsamında, yasal mevzuata tam uyumlu ve uluslararası geçerli raporlar.",
      },
      {
        anahtar: "as_hizmet_btn1",
        etiket: "Birinci buton",
        not: "Hizmet sayısı parantez içinde otomatik eklenir.",
        varsayilan: "Tüm Hizmetleri Gör",
      },
      { anahtar: "as_hizmet_btn2", etiket: "İkinci buton", varsayilan: "Ekipmanınızı Seçip Teklif Alın" },
    ],
  },
  {
    baslik: "Ana sayfa — hizmet bölgeleri bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_bolge_etiket", etiket: "Küçük etiket", varsayilan: "Hizmet Bölgelerimiz" },
      { anahtar: "as_bolge_baslik", etiket: "Başlık", varsayilan: "Ekipmanınızın bulunduğu yere geliyoruz" },
      {
        anahtar: "as_bolge_giris",
        etiket: "Açıklama",
        uzun: true,
        varsayilan:
          "Merkezimiz Beylikdüzü'nde; muayene işletmenizde, yerinde yapılıyor. Aşağıdaki bölgeler için sanayi yapısına göre hazırlanmış ayrı sayfalarımız var.",
      },
      { anahtar: "as_bolge_buton", etiket: "Alttaki buton", varsayilan: "Tüm Hizmet Bölgeleri" },
    ],
  },
  {
    baslik: "Ana sayfa — fark kartları bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_neden_etiket", etiket: "Küçük etiket", varsayilan: "Neden Bilge?" },
      { anahtar: "as_neden_baslik", etiket: "Başlık", varsayilan: "Rakiplerden Ayıran 4 Fark" },
    ],
  },
  {
    baslik: "Ana sayfa — süreç bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_surec_etiket", etiket: "Küçük etiket", varsayilan: "Süreç" },
      { anahtar: "as_surec_baslik", etiket: "Başlık", varsayilan: "4 Adımda Güvenli Kontrol" },
    ],
  },
  {
    baslik: "Ana sayfa — referanslar bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_referans_etiket", etiket: "Küçük etiket", varsayilan: "Referanslarımız" },
      { anahtar: "as_referans_baslik", etiket: "Başlık", varsayilan: "500+ firma bize güveniyor" },
      {
        anahtar: "as_referans_giris",
        etiket: "Açıklama",
        uzun: true,
        varsayilan:
          "Üretimden lojistiğe, enerjiden kamuya kadar birçok sektörde; periyodik kontrol ve akreditasyon raporlarıyla iş ortaklarımızın yasal yükümlülüklerini güvence altına alıyoruz.",
      },
      { anahtar: "as_referans_buton", etiket: "Alttaki buton", varsayilan: "Tüm Referanslarımız →" },
    ],
  },
  {
    baslik: "Ana sayfa — katalog bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_katalog_etiket", etiket: "Küçük etiket", varsayilan: "Kurumsal Katalog" },
      { anahtar: "as_katalog_baslik", etiket: "Başlık", varsayilan: "Hizmet kataloğumuzu indirin" },
      {
        anahtar: "as_katalog_giris",
        etiket: "Açıklama",
        uzun: true,
        varsayilan:
          "Akreditasyon kapsamımız, muayene ettiğimiz ekipman grupları, uyguladığımız standartlar ve çalışma sürecimiz tek dosyada. Satın alma ve İSG birimlerinizle paylaşabileceğiniz kurumsal tanıtım dokümanı.",
      },
      { anahtar: "as_katalog_btn1", etiket: "Birinci buton", varsayilan: "Kataloğu Aç (PDF) →" },
      { anahtar: "as_katalog_btn2", etiket: "İkinci buton", varsayilan: "Teklif İste" },
    ],
  },
  {
    baslik: "Ana sayfa — ekip bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_ekip_etiket", etiket: "Küçük etiket", varsayilan: "Uzman Kadro" },
      { anahtar: "as_ekip_baslik", etiket: "Başlık", varsayilan: "Raporunuzun arkasında gerçek mühendisler var" },
      {
        anahtar: "as_ekip_giris",
        etiket: "Açıklama",
        uzun: true,
        varsayilan:
          "Muayeneleriniz, kendi alanında yetkili mühendis kadromuz tarafından yerinde yapılır; rapor bu kişilerin teknik değerlendirmesine dayanır.",
      },
    ],
  },
  {
    baslik: "Ana sayfa — akreditasyon şeridi ve alt çağrı",
    yol: "/",
    alanlar: [
      {
        anahtar: "as_akr_baslik",
        etiket: "Akreditasyon şeridi başlığı",
        not: "Akreditasyon numarası sonuna otomatik eklenir.",
        varsayilan: "TÜRKAK Akreditasyon No:",
      },
      {
        anahtar: "as_akr_yazi",
        etiket: "Akreditasyon şeridi yazısı",
        uzun: true,
        varsayilan:
          "TS EN ISO/IEC 17020 standardına göre akredite edilmiş bağımsız A Tipi muayene kuruluşuyuz. Raporlarımız Çalışma Bakanlığı denetimlerinde ve ihale süreçlerinde geçerlidir.",
      },
      { anahtar: "as_cta_buton", etiket: "En alttaki buton", varsayilan: "Hemen Başla →" },
    ],
  },
  sayfa(
    "Hakkımızda",
    "/kurumsal",
    "kurumsal",
    "Kurumsal",
    "Bilge Teknik Kontrol Muayene Gözetim Denetim Ltd. Şti. — TÜRKAK tarafından TS EN ISO/IEC 17020 standardına göre akredite edilmiş (AB-0296-M) bağımsız A Tipi muayene kuruluşu.",
    [
      {
        anahtar: "kurumsal_govde",
        etiket: "Sayfanın ana metni",
        not: "Sayfanın sol tarafındaki uzun yazı.",
        uzun: true,
        bicimli: true,
        varsayilan: `## Biz kimiz?

2014 yılından bu yana iş ekipmanlarının periyodik kontrolü alanında hizmet veriyoruz. Beylikdüzü / İstanbul'daki merkez ofisimizden hareketle Türkiye genelindeki işletmelere yerinde muayene hizmeti sunuyoruz.

Amacımız yalnızca bir kontrol belgesi düzenlemek değil; işletmenizin iş sağlığı ve güvenliği risklerini gerçek anlamda azaltmak ve yasal yükümlülüklerini zamanında karşılamasını sağlamaktır. Bu nedenle raporlarımızda yalnızca "uygundur" ibaresi değil, tespit edilen uygunsuzluklar ve giderilme önerileri de yer alır.

## A Tipi muayene kuruluşu ne demek?

TS EN ISO/IEC 17020 standardı muayene kuruluşlarını tarafsızlık düzeyine göre A, B ve C tiplerine ayırır. **A Tipi**, muayene ettiği ekipmanın tasarımı, imalatı, satışı, montajı veya bakımıyla hiçbir ilgisi olmayan, tamamen bağımsız üçüncü taraf kuruluş anlamına gelir.

Pratikte bunun anlamı şudur: size ekipman satmıyor, bakımını üstlenmiyoruz. Bu yüzden raporumuzda çıkan bir uygunsuzluğun bizim için ticari bir karşılığı yok — sadece teknik bir tespit. Denetimlerde ve ihale süreçlerinde A Tipi raporun ayrıca aranmasının sebebi de budur.

## Nasıl çalışıyoruz?

1. Ekipman envanteriniz çıkarılır, İSG-KATİP üzerinden hizmet sözleşmesi düzenlenir.
2. Uzman mühendis kadromuz tesisinizde görsel muayene, test ve ölçümleri yapar.
3. TS EN ISO/IEC 17020 kapsamında, EKİPNET numaralı ve e-imzalı rapor düzenlenir.
4. Bir sonraki yasal kontrol tarihiniz için hatırlatma yapılır.`,
      },
      {
        anahtar: "kurumsal_btn1",
        etiket: "Birinci buton",
        not: "Hizmet sayısı parantez içinde otomatik eklenir.",
        varsayilan: "Hizmetlerimiz",
      },
      { anahtar: "kurumsal_btn2", etiket: "İkinci buton", varsayilan: "İletişime Geç →" },
      { anahtar: "kurumsal_kunye_baslik", etiket: "Sağdaki künye kutusunun başlığı", varsayilan: "Künye" },
      { anahtar: "kurumsal_ekip_baslik", etiket: "Sağdaki kadro kutusunun başlığı", varsayilan: "Mühendis kadromuz" },
      { anahtar: "kurumsal_ref_etiket", etiket: "Referanslar — küçük etiket", varsayilan: "Referanslarımız" },
      {
        anahtar: "kurumsal_ref_baslik",
        etiket: "Referanslar — başlık",
        varsayilan: "Bize güvenen firmalardan bazıları",
      },
    ]
  ),
  sayfa(
    "Hizmetler / Ekipman listesi",
    "/ekipman",
    "ekipman",
    "Periyodik Kontrol Hizmetlerimiz",
    "TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu olarak iş ekipmanı ve tesisat gruplarında periyodik kontrol hizmeti veriyoruz. Soldaki listeden kategoriye, oradan aradığınız ekipmana ulaşabilirsiniz."
  ),
  sayfa(
    "Akreditasyon ve Sertifikalar",
    "/sertifikalar",
    "sertifika",
    "Akreditasyon ve Sertifikalarımız",
    "Düzenlediğimiz raporların denetimlerde ve ihale süreçlerinde kabul görmesi, akreditasyonumuza dayanır. Yetki kapsamımızı ve belgelerimizi burada inceleyebilirsiniz."
  ),
  sayfa(
    "Referanslar",
    "/referanslar",
    "referans",
    "Referanslarımız",
    "Üretimden lojistiğe, enerjiden inşaata kadar birçok sektörde işletmelerin periyodik kontrol yükümlülüklerini karşılıyoruz. Aşağıda bizimle çalışan firmalardan bazıları yer alıyor.",
    [
      { anahtar: "referans_logo_etiket", etiket: "Logolar — küçük etiket", varsayilan: "Bize güvenen firmalar" },
      { anahtar: "referans_logo_baslik", etiket: "Logolar — başlık", varsayilan: "Çalıştığımız markalardan bazıları" },
      {
        anahtar: "referans_logo_not",
        etiket: "Logoların altındaki not",
        uzun: true,
        varsayilan: "Müşteri gizliliği gereği tüm firma isimleri paylaşılmamaktadır.",
      },
      { anahtar: "referans_sektor_etiket", etiket: "Sektörler — küçük etiket", varsayilan: "Sektörler" },
      {
        anahtar: "referans_sektor_baslik",
        etiket: "Sektörler — başlık",
        varsayilan: "Hangi sektörlere hizmet veriyoruz?",
      },
      {
        anahtar: "referans_sektor_giris",
        etiket: "Sektörler — açıklama",
        not: "Hizmet sayısı cümlenin başına otomatik eklenir.",
        uzun: true,
        varsayilan:
          "ayrı hizmet kapsamımızla, ekipman parkı hangi sektörde olursa olsun periyodik kontrol yükümlülüğünü tek elden karşılıyoruz.",
      },
      { anahtar: "referans_cta_baslik", etiket: "Alt çağrı — başlık", varsayilan: "Siz de aramıza katılın" },
      {
        anahtar: "referans_cta_yazi",
        etiket: "Alt çağrı — yazı",
        uzun: true,
        varsayilan:
          "TÜRKAK akredite (AB-0296-M) raporlarımızla, denetimlerde ve ihale süreçlerinde sorun yaşamayın. Ekipman listenizi iletin, kapsamı birlikte belirleyelim.",
      },
      { anahtar: "referans_cta_buton", etiket: "Alt çağrı — buton", varsayilan: "Teklif Al →" },
    ]
  ),
  sayfa(
    "Hizmet Bölgeleri",
    "/bolge",
    "bolge",
    "Hizmet Bölgelerimiz",
    "Merkez ofisimiz Beylikdüzü / İstanbul’dadır. Türkiye genelinde, birçok şehirde yerinde periyodik kontrol hizmeti veriyoruz. Listede şehriniz görünmüyorsa da planlama yapabiliriz — bize sormanız yeterli."
  ),
  sayfa(
    "Sık Sorulan Sorular",
    "/sss",
    "sss",
    "Sık Sorulan Sorular",
    "Periyodik kontrol süreciyle ilgili en çok sorulan sorular ve kısa yanıtları."
  ),
  sayfa(
    "Yasal Süre Hesaplayıcı",
    "/hesapla",
    "hesapla",
    "Yasal Süre & Uygunluk Hesaplayıcı",
    "Son kontrol tarihini girin; bir sonraki zorunlu kontrol tarihini ve gecikme riskini anında görün."
  ),
  sayfa(
    "Online Teklif",
    "/teklif",
    "teklif",
    "Online Teklif & Randevu Talebi",
    "Sol kategoriden ekipmanlarınızı işaretleyin; sağdaki özet anında güncellenir. Bilgilerinizi bırakın, ekibimiz en kısa sürede dönüş yapsın."
  ),
  sayfa(
    "Periyodik Kontrol Süreleri",
    "/periyodik-kontrol-sureleri",
    "sureler",
    "Periyodik Kontrol Süreleri Tablosu",
    "Hangi iş ekipmanının ne sıklıkla kontrol edilmesi gerektiğini, tabi olduğu standartla birlikte tek tabloda topladık."
  ),
  sayfa(
    "Bilgi Merkezi (yazılar)",
    "/yazilar",
    "yazilar",
    "Makaleler & Rehberler",
    "Periyodik kontrol, mevzuat ve iş güvenliği üzerine yazılar."
  ),
  sayfa(
    "İletişim",
    "/iletisim",
    "iletisim",
    "İletişim",
    "Merkez ofisimiz Beylikdüzü / İstanbul’dadır; Türkiye genelinde yerinde muayene hizmeti veriyoruz. Ekipman listenizi iletin, planlamayı birlikte yapalım.",
    [
      { anahtar: "iletisim_bolum_baslik", etiket: "Bilgi listesinin başlığı", varsayilan: "Bize ulaşın" },
      {
        anahtar: "iletisim_teklif_baslik",
        etiket: "Teklif kutusu — başlık",
        varsayilan: "Teklif mi almak istiyorsunuz?",
      },
      {
        anahtar: "iletisim_teklif_yazi",
        etiket: "Teklif kutusu — yazı",
        uzun: true,
        varsayilan:
          "Ekipmanlarınızı seçip online form üzerinden ilettiğinizde, kapsam ve fiyat için size dönüş yapıyoruz.",
      },
      { anahtar: "iletisim_teklif_btn1", etiket: "Teklif kutusu — birinci buton", varsayilan: "Online Teklif Al →" },
      { anahtar: "iletisim_teklif_btn2", etiket: "Teklif kutusu — ikinci buton", varsayilan: "Süremi Hesapla" },
      { anahtar: "iletisim_ekip_baslik", etiket: "Teknik ekip kutusunun başlığı", varsayilan: "Teknik ekip" },
    ]
  ),
  {
    baslik: "Footer (sayfa altı)",
    yol: "/",
    alanlar: [
      {
        anahtar: "footer_yazi",
        etiket: "Footer tanıtım yazısı",
        not: "Logonun altındaki kısa kurum açıklaması",
        uzun: true,
        varsayilan:
          "TÜRKAK tarafından TS EN ISO/IEC 17020 standardına göre akredite edilmiş bağımsız A Tipi muayene kuruluşu. 2014’ten bu yana iş ekipmanlarının periyodik kontrolünde uzmanız.",
      },
      { anahtar: "footer_cta_baslik", etiket: "Footer CTA başlığı", varsayilan: "Periyodik kontrol zamanınız geldi mi?" },
      {
        anahtar: "footer_cta_metin",
        etiket: "Footer CTA açıklaması",
        uzun: true,
        varsayilan: "Ekipman listenizi iletin, kapsam ve fiyatı aynı gün değerlendirelim.",
      },
    ],
  },
];

/** Tum alanlarin duz listesi — kaydetme ve varsayilan cozumu icin. */
export const TUM_ALANLAR: MetinAlani[] = METIN_GRUPLARI.flatMap((g) => g.alanlar);

const VARSAYILANLAR: Record<string, string> = Object.fromEntries(
  TUM_ALANLAR.map((a) => [a.anahtar, a.varsayilan])
);

export type MetinOkuyucu = (anahtar: string) => string;

/**
 * Sayfa metinlerini tek seferde okur ve `m("anahtar")` seklinde bir okuyucu doner.
 *
 * Kayitli deger yoksa veya bossa varsayilan doner — yani panelde bir alani
 * silmek sayfayi bos birakmaz, ilk haline dondurur.
 * Depo okunamazsa da varsayilanlarla calisir.
 */
export async function metinleriOku(): Promise<MetinOkuyucu> {
  let kayitli: Record<string, string> = {};
  try {
    const satirlar = await getAllContent();
    kayitli = Object.fromEntries(satirlar.map((s) => [s.key, s.value]));
  } catch {
    /* depo okunamadi; varsayilanlarla devam */
  }
  return (anahtar: string) => {
    const v = kayitli[anahtar];
    return v !== undefined && v.trim() !== "" ? v : VARSAYILANLAR[anahtar] ?? "";
  };
}
