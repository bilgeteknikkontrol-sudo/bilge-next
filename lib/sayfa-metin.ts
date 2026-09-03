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
    baslik: "Ana sayfa — uzmanlık alanları bölümü",
    yol: "/",
    alanlar: [
      { anahtar: "as_ekip_etiket", etiket: "Küçük etiket", varsayilan: "Uzmanlık Alanlarımız" },
      { anahtar: "as_ekip_baslik", etiket: "Başlık", varsayilan: "Raporunuzun arkasında gerçek mühendisler var" },
      {
        anahtar: "as_ekip_giris",
        etiket: "Açıklama",
        uzun: true,
        varsayilan:
          "Muayeneleriniz, ekipmanın türüne göre ilgili branştan yetkili mühendis tarafından yerinde yapılır; rapor bu teknik değerlendirmeye dayanır.",
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

2009 yılından bu yana iş ekipmanlarının periyodik kontrolü alanında hizmet veriyoruz. Beylikdüzü / İstanbul'daki merkez ofisimizden hareketle Türkiye genelindeki işletmelere yerinde muayene hizmeti sunuyoruz.

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
      { anahtar: "kurumsal_ekip_baslik", etiket: "Sağdaki uzmanlık kutusunun başlığı", varsayilan: "Uzmanlık alanlarımız" },
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
    "TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu olarak iş ekipmanı ve tesisat gruplarında periyodik kontrol hizmeti veriyoruz. Soldaki listeden kategoriye, oradan aradığınız ekipmana ulaşabilirsiniz.",
    [
      {
        anahtar: "ekipman_yol_adi",
        etiket: "Üst satırdaki yol adı",
        not: "“Ana Sayfa / …” satırında görünen kısa ad.",
        varsayilan: "Hizmetlerimiz",
      },
      {
        anahtar: "ekipman_rozet",
        etiket: "Başlık altındaki üçüncü rozet",
        not: "İlk ikisi (kategori ve hizmet sayısı) otomatik hesaplanır.",
        varsayilan: "Türkiye geneli yerinde muayene",
      },
      { anahtar: "ekipman_kategori_baslik", etiket: "Sol listenin başlığı", varsayilan: "Kategoriler" },
      { anahtar: "ekipman_kutu_baslik", etiket: "Sol alttaki kutu — başlık", varsayilan: "Ekipmanınız listede yok mu?" },
      {
        anahtar: "ekipman_kutu_yazi",
        etiket: "Sol alttaki kutu — yazı",
        uzun: true,
        varsayilan: "Kapsamımız listeyle sınırlı değil. Listenizi iletin, birlikte değerlendirelim.",
      },
      { anahtar: "ekipman_kutu_buton", etiket: "Sol alttaki kutu — buton", varsayilan: "Teklif Al →" },
      { anahtar: "ekipman_cta_baslik", etiket: "Alt çağrı — başlık", varsayilan: "Kapsamı birlikte belirleyelim" },
      {
        anahtar: "ekipman_cta_yazi",
        etiket: "Alt çağrı — yazı",
        uzun: true,
        varsayilan:
          "Ekipman listenizi iletin; hangi muayenelerin yasal olarak zorunlu olduğunu, periyotları ve toplam maliyeti tek bir teklifte size sunalım.",
      },
      { anahtar: "ekipman_cta_btn1", etiket: "Alt çağrı — birinci buton", varsayilan: "Teklif Al →" },
      { anahtar: "ekipman_cta_btn2", etiket: "Alt çağrı — ikinci buton", varsayilan: "Süremi Hesapla" },
    ]
  ),
  sayfa(
    "Akreditasyon ve Sertifikalar",
    "/sertifikalar",
    "sertifika",
    "Akreditasyon ve Sertifikalarımız",
    "Düzenlediğimiz raporların denetimlerde ve ihale süreçlerinde kabul görmesi, akreditasyonumuza dayanır. Yetki kapsamımızı ve belgelerimizi burada inceleyebilirsiniz.",
    [
      { anahtar: "sertifika_yol_adi", etiket: "Üst satırdaki yol adı", varsayilan: "Akreditasyon ve Sertifikalar" },
      {
        anahtar: "sertifika_no_baslik",
        etiket: "Akreditasyon kutusu — başlık",
        not: "Akreditasyon numarası sonuna otomatik eklenir.",
        varsayilan: "TÜRKAK Akreditasyon No:",
      },
      {
        anahtar: "sertifika_no_yazi",
        etiket: "Akreditasyon kutusu — yazı",
        uzun: true,
        bicimli: true,
        varsayilan:
          "Bilge Teknik Kontrol Muayene Gözetim Denetim Ltd. Şti., Türk Akreditasyon Kurumu (TÜRKAK) tarafından **TS EN ISO/IEC 17020** standardına göre akredite edilmiş bağımsız **A Tipi muayene kuruluşu**dur.",
      },
      {
        anahtar: "sertifika_dogrula_baslik",
        etiket: "Doğrulama kutusu — başlık",
        varsayilan: "Akreditasyonumuzu nasıl doğrularsınız?",
      },
      {
        anahtar: "sertifika_dogrula_yazi",
        etiket: "Doğrulama kutusu — yazı",
        uzun: true,
        bicimli: true,
        varsayilan:
          "Akreditasyon durumu, TÜRKAK'ın kendi resmî kayıtları üzerinden doğrulanabilir. Akredite kuruluş sorgulaması için [turkak.org.tr](https://www.turkak.org.tr) adresindeki akredite kuruluş listesinden **AB-0296-M** numarasıyla arama yapabilirsiniz.",
      },
      { anahtar: "sertifika_belge_etiket", etiket: "Belgeler bölümü — küçük etiket", varsayilan: "Belgelerimiz" },
      { anahtar: "sertifika_belge_baslik", etiket: "Belgeler bölümü — başlık", varsayilan: "Sertifika ve belgeler" },
      {
        anahtar: "sertifika_bos_baslik",
        etiket: "Hiç belge yokken — başlık",
        not: "Yalnızca panele hiç belge eklenmemişse görünür.",
        varsayilan: "Belge görselleri hazırlanıyor",
      },
      {
        anahtar: "sertifika_bos_yazi",
        etiket: "Hiç belge yokken — yazı",
        uzun: true,
        varsayilan:
          "Akreditasyon sertifikamızın ve diğer belgelerimizin kopyalarını talep üzerine paylaşıyoruz. Belge talebi için bizimle iletişime geçebilirsiniz.",
      },
      { anahtar: "sertifika_bos_buton", etiket: "Hiç belge yokken — buton", varsayilan: "Belge Talep Et" },
      { anahtar: "sertifika_neden_baslik", etiket: "“Neden önemli” — başlık", varsayilan: "Akreditasyon neden önemli?" },
      {
        anahtar: "sertifika_neden_yazi",
        etiket: "“Neden önemli” — yazı",
        uzun: true,
        bicimli: true,
        varsayilan: `Periyodik kontrol raporunuz, bir denetimde veya iş kazası sonrası incelemede delil niteliği taşır. Raporu düzenleyen kuruluşun yetkinliği tartışmaya açıksa, raporun kendisi de tartışmaya açılır.

Akreditasyon, kuruluşun teknik yeterliliğinin ve tarafsızlığının bağımsız bir kurum tarafından düzenli olarak denetlendiği anlamına gelir. A Tipi olmak ise muayene ettiğimiz ekipmanın satışı, montajı veya bakımıyla hiçbir ticari ilişkimizin bulunmadığını gösterir.`,
      },
    ]
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
    "Merkez ofisimiz Beylikdüzü / İstanbul’dadır. Türkiye genelinde, birçok şehirde yerinde periyodik kontrol hizmeti veriyoruz. Listede şehriniz görünmüyorsa da planlama yapabiliriz — bize sormanız yeterli.",
    [
      {
        anahtar: "bolge_ilce_baslik",
        etiket: "İlçe bölümü başlığı",
        not: "Başına şehrin adı otomatik eklenir: “İstanbul ilçeleri”.",
        varsayilan: "ilçeleri",
      },
      {
        anahtar: "bolge_ilce_yazi",
        etiket: "İlçe bölümü açıklaması",
        not: "Başına “İstanbul'un” gibi şehir adı otomatik eklenir.",
        uzun: true,
        varsayilan:
          "tamamında yerinde muayene yapıyoruz. Aşağıdaki ilçeler için, bölgedeki sanayi yapısına ve orada en çok kontrol edilen ekipmanlara göre hazırlanmış ayrı sayfalarımız var.",
      },
      { anahtar: "bolge_kart_link", etiket: "Kartlardaki bağlantı yazısı", varsayilan: "Ayrıntılı sayfa →" },
      { anahtar: "bolge_cta_baslik", etiket: "Alt çağrı — başlık", varsayilan: "Şehriniz listede yok mu?" },
      {
        anahtar: "bolge_cta_yazi",
        etiket: "Alt çağrı — yazı",
        uzun: true,
        varsayilan:
          "Türkiye genelinde planlama yapıyoruz. Ekipman listenizi iletin, bölgenize uygun takvimi birlikte belirleyelim.",
      },
      { anahtar: "bolge_cta_btn1", etiket: "Alt çağrı — birinci buton", varsayilan: "Teklif Al →" },
      { anahtar: "bolge_cta_btn2", etiket: "Alt çağrı — ikinci buton", varsayilan: "İletişim" },
    ]
  ),
  sayfa(
    "Sık Sorulan Sorular",
    "/sss",
    "sss",
    "Sık Sorulan Sorular",
    "Periyodik kontrol süreciyle ilgili en çok sorulan sorular ve kısa yanıtları.",
    [
      { anahtar: "sss_kutu1_baslik", etiket: "Sağdaki ilk kutu — başlık", varsayilan: "Sorunuz burada yok mu?" },
      {
        anahtar: "sss_kutu1_yazi",
        etiket: "Sağdaki ilk kutu — yazı",
        uzun: true,
        varsayilan: "İşletmenize özel durumlar için doğrudan bize sorabilirsiniz.",
      },
      { anahtar: "sss_kutu1_buton", etiket: "Sağdaki ilk kutu — buton", varsayilan: "İletişim Sayfası" },
      { anahtar: "sss_kutu2_baslik", etiket: "Sağdaki ikinci kutu — başlık", varsayilan: "Daha ayrıntılı rehberler" },
      { anahtar: "sss_kutu2_buton", etiket: "Sağdaki ikinci kutu — bağlantı", varsayilan: "Bilgi Merkezi →" },
    ]
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
      { anahtar: "iletisim_ekip_baslik", etiket: "Uzmanlık alanları başlığı", varsayilan: "Uzmanlık alanlarımız" },

      /**
       * GOOGLE YORUM KUTUSU
       *
       * ⚠️ Metin BILEREK filtresiz. "Memnun kaldiysaniz Google'a, memnun
       * kalmadiysaniz bize yazin" tarzi bir ayrim (review gating) Google'in
       * politikasina aykiri ve isletme profilinin cezalandirilmasina yol acar.
       * Herkese ayni cagri gosterilir.
       */
      {
        anahtar: "iletisim_yorum_baslik",
        etiket: "Google yorum kutusu — başlık",
        not: "Yalnızca panelde Google yorum bağlantısı girilmişse görünür.",
        varsayilan: "Bizi Google'da değerlendirin",
      },
      {
        anahtar: "iletisim_yorum_yazi",
        etiket: "Google yorum kutusu — yazı",
        uzun: true,
        varsayilan:
          "Hizmetimizle ilgili deneyiminizi paylaşmanız, bizi arayan diğer işletmelere yol gösteriyor. Bir dakikanızı ayırırsanız çok memnun oluruz.",
      },
      {
        anahtar: "iletisim_yorum_buton",
        etiket: "Google yorum kutusu — buton",
        varsayilan: "Google'da yorum yazın",
      },
    ]
  ),

  /**
   * DEGERLENDIRME SAYFASI — /degerlendir
   *
   * ⚠️ NEDEN AYRI SAYFA: bu adres musteriye ELDEN gonderiliyor (e-posta,
   * WhatsApp, rapor teslimi). "bilgekontrol.com/degerlendir" yazmak, Google'in
   * uzun g.page baglantisini yapistirmaktan hem daha temiz hem daha guvenilir
   * gorunuyor — musteri tanidigi alan adini goruyor.
   *
   * Sayfa arama motoruna KAPALI (noindex): tek isi olan, kisa bir yonlendirme
   * sayfasi; indekslenirse hem "ince icerik" sayilir hem de arama sonucunda
   * isi olmayan bir sayfa cikar.
   */
  sayfa(
    "Değerlendirme Sayfası",
    "/degerlendir",
    "degerlendir",
    "Bizi Google'da değerlendirin",
    "Periyodik kontrol sürecimizle ilgili deneyiminizi paylaşmanız bizim için çok değerli. Yazacağınız birkaç cümle, bizi arayan diğer işletmelere de yol gösteriyor.",
    [
      { anahtar: "degerlendir_buton", etiket: "Buton", varsayilan: "Google'da değerlendir" },
      {
        anahtar: "degerlendir_buton_not",
        etiket: "Butonun altındaki küçük not",
        varsayilan: "Google hesabınızla açılır · yaklaşık 1 dakika sürer",
      },
      /* ⚠️ "Nasil yapilir?" bolumu ve degerlendir_adim_* alanlari kaldirildi:
         sayfa tek butonluk, adimlar dikkati dagitiyordu. */
      {
        anahtar: "degerlendir_tesekkur",
        etiket: "Alt bölüm yazısı",
        uzun: true,
        varsayilan:
          "Ayırdığınız zaman için teşekkür ederiz. Görüşleriniz, hizmetimizi geliştirmemize doğrudan yardımcı oluyor.",
      },
    ]
  ),
  {
    /**
     * ⚠️ BU GRUP 92 SAYFAYI BIRDEN ETKILER. Her hizmet sayfasi ayni sablonu
     * kullaniyor; buradaki bir kelime degisikligi 92 sayfada birden goruluyor.
     * Yer tutucular: {ad} = hizmetin adi, {standart}, {periyot}, {kategori}.
     */
    baslik: "Hizmet alt sayfaları (92 sayfanın ortak metinleri)",
    yol: "/ekipman",
    alanlar: [
      { anahtar: "hizmet_yol_adi", etiket: "Üst satırdaki yol adı", varsayilan: "Hizmetlerimiz" },
      { anahtar: "hizmet_sss_baslik", etiket: "SSS bölümü başlığı", varsayilan: "Sıkça Sorulan Sorular" },
      {
        anahtar: "hizmet_kapsam_baslik",
        etiket: "Kapsam başlığı",
        not: "Yalnızca kendi özel metni yazılmamış hizmetlerde görünür.",
        varsayilan: "Kontrol Kapsamı",
      },
      {
        anahtar: "hizmet_kapsam_p1",
        etiket: "Kapsam — birinci paragraf",
        not: "{ad} = hizmetin adı, {standart} = standart, {periyot} = kontrol sıklığı.",
        uzun: true,
        bicimli: true,
        varsayilan:
          "{ad}, **{standart}** ve ilgili mevzuat gereği periyodik olarak muayene edilir. Üretici aksini belirtmedikçe kontrol sıklığı **{periyot}** şeklindedir.",
      },
      {
        anahtar: "hizmet_kapsam_p2",
        etiket: "Kapsam — ikinci paragraf",
        uzun: true,
        bicimli: true,
        varsayilan:
          "{ad} ekipmanınızı yerinde, uzman mühendis kadromuzla muayene ediyor; uluslararası geçerli e-imzalı raporu İSG-KATİP uyumlu şekilde düzenliyoruz.",
      },
      {
        anahtar: "hizmet_liste_baslik",
        etiket: "Madde listesi başlığı",
        varsayilan: "Genelde Neler Değerlendirilir?",
      },
      {
        anahtar: "hizmet_liste",
        etiket: "Madde listesi",
        uzun: true,
        bicimli: true,
        varsayilan: `- Görsel muayene ve güvenlik işaretleri
- Standartlara uygun test ve deney prosedürleri
- Belgelerin ve etiketlerin kontrolü
- Uygunsuzluk tespiti ve raporlanması`,
      },
      { anahtar: "hizmet_btn1", etiket: "Birinci buton", varsayilan: "Bu Ekipman İçin Teklif Al →" },
      { anahtar: "hizmet_btn2", etiket: "İkinci buton", varsayilan: "Süremi Hesapla" },
      {
        anahtar: "hizmet_rehber_baslik",
        etiket: "İlgili yazılar bölümü başlığı",
        varsayilan: "Bu konuyu ayrıntılı anlatan rehberler",
      },
      { anahtar: "hizmet_kunye_kategori", etiket: "Künye — kategori etiketi", varsayilan: "Kategori" },
      { anahtar: "hizmet_kunye_standart", etiket: "Künye — standart etiketi", varsayilan: "Standart" },
      { anahtar: "hizmet_kunye_periyot", etiket: "Künye — periyot etiketi", varsayilan: "Periyot" },
      { anahtar: "hizmet_kunye_akreditasyon", etiket: "Künye — akreditasyon etiketi", varsayilan: "Akreditasyon" },
      { anahtar: "hizmet_kunye_digerad", etiket: "Künye — diğer ad etiketi", varsayilan: "Diğer adı" },
      {
        anahtar: "hizmet_diger_baslik",
        etiket: "Sağdaki “diğer hizmetler” başlığı",
        not: "Başına kategori adı otomatik eklenir.",
        varsayilan: "içindeki diğer hizmetler",
      },
      { anahtar: "hizmet_tum_link", etiket: "“Tüm hizmetler” bağlantısı", varsayilan: "Tüm hizmetler →" },
      { anahtar: "hizmet_kutu_baslik", etiket: "Sağdaki lacivert kutu başlığı", varsayilan: "Hemen bilgi alın" },
    ],
  },
  {
    /**
     * ⚠️ HUKUKI METINLER BILEREK PANELE TASINMADI.
     *
     * KVKK aydinlatma metni ve cerez politikasinin GOVDESI kodda kaliyor:
     * hukuki yukumluluk doguran, yilda bir kez ve mevzuat degisikligine bagli
     * olarak degisen metinler. Panelden serbestce duzenlenebilir olmasi
     * kolaylik degil, RISK olur.
     *
     * Buna karsilik pratikte bayatlayan iki sey panelde:
     *  - "Son guncelleme" tarihi (metni guncelleyince degistirilmesi gereken),
     *  - iletisim bilgileri (zaten lib/iletisim-bilgi.ts uzerinden panelden).
     * Barindirma ve analitik saglayici beyanlari 31.08.2026'da gercege gore
     * duzeltildi (bkz. lib/legal.ts ve app/kvkk/page.tsx notlari).
     */
    baslik: "Yasal metinler (KVKK · Çerez Politikası)",
    yol: "/kvkk",
    alanlar: [
      {
        anahtar: "yasal_son_guncelleme",
        etiket: "“Son güncelleme” tarihi",
        not: "Her iki yasal sayfanın üstünde görünür. Metinlerin gövdesi güvenlik gereği kodda tutuluyor; değişiklik gerekirse söyleyin. Metnin içeriği her değiştiğinde bu tarih de güncellenmeli — yasal metinde gerçeğe aykırı tarih bırakılmaz.",
        varsayilan: "3 Eylül 2026",
      },
    ],
  },
  {
    baslik: "Fenni Muayene Nedir? sayfası",
    yol: "/fenni-muayene",
    alanlar: [
      {
        anahtar: "fenni_baslik",
        etiket: "Sayfa başlığı (H1)",
        varsayilan: "Fenni Muayene Nedir? Periyodik Kontrolden Farkı Var mı?",
      },
      {
        anahtar: "fenni_giris",
        etiket: "Başlık altı yazı",
        uzun: true,
        varsayilan:
          "Kısa cevap: fark yok. İkisi aynı işlemin iki adı. Uzun cevap ve hangi ekipmanın hangi sıklıkta muayene edilmesi gerektiği aşağıda.",
      },
      {
        anahtar: "fenni_lead",
        etiket: "İlk paragraf (kalın, büyük punto)",
        uzun: true,
        bicimli: true,
        varsayilan:
          "**Fenni muayene**, iş ekipmanlarının güvenli kullanılıp kullanılamayacağını belirlemek için belirli aralıklarla yapılan test, deney ve muayene faaliyetidir. Mevzuattaki resmî adı **periyodik kontrol**'dür. \"Fenni muayene\", \"periyodik muayene\" ve \"periyodik kontrol\" ifadelerinin üçü de aynı işlemi anlatır; düzenlenen rapor da aynı yasal geçerliliğe sahiptir.",
      },
      {
        anahtar: "fenni_govde",
        etiket: "Sayfanın ana metni",
        not: "“Yasal dayanak” ve “Kim yapabilir?” bölümleri.",
        uzun: true,
        bicimli: true,
        varsayilan: `## Yasal dayanak

İşlemin dayanağı, 25 Nisan 2013 tarihli ve 28628 sayılı Resmî Gazete'de yayımlanan **İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği**'dir. Yönetmelik **23 Aralık 2025** tarihinde önemli ölçüde değiştirildi. Değişiklikle birlikte:

- EKİPNET, İSG-KATİP içinde yer alan bir modül olarak yeniden tanımlandı.
- **İSG-KATİP üzerinden sözleşme olmaksızın periyodik kontrol raporu düzenlenemez**; sözleşmesiz düzenlenen raporlar geçersizdir.
- Raporlar ıslak imzalı saklanabileceği gibi, 5070 sayılı Kanuna uygun güvenli elektronik imzayla imzalanıp elektronik ortamda da saklanabilir.
- İdari yaptırımlar denetim başına uygulanır; aykırılık hâlinde yetkili kişinin yetkisi bir ay süreyle askıya alınabilir.

Ayrıntılar için: [23 Aralık 2025 yönetmelik değişikliği neler getirdi?](/yazilar/periyodik-kontrol-yeni-yonetmelik-2025) ve [EKİPNET nedir?](/yazilar/ekipnet-nedir)

## Fenni muayeneyi kim yapabilir?

Yönetmelik, kontrolü yapacak kişiyi **EKİPNET'e kayıtlı ilgili branştan mühendis, teknik öğretmen, tekniker veya yüksek tekniker** olarak tanımlar. Aranan branş ekipmana göre değişir: basınçlı bir kabı makine mühendisi, topraklama ölçümünü elektrik mühendisi yapar.

Bilge Teknik Kontrol, TÜRKAK tarafından **TS EN ISO/IEC 17020** kapsamında akredite edilmiş **A Tipi muayene kuruluşu**dur (akreditasyon no AB-0296-M). Akreditasyon kapsamımızı [sertifikalar sayfasından](/sertifikalar) görebilirsiniz.`,
      },
      {
        anahtar: "fenni_zorunlu_baslik",
        etiket: "Ekipman listesi bölümü — başlık",
        varsayilan: "Hangi ekipmanın fenni muayenesi zorunlu?",
      },
      {
        anahtar: "fenni_zorunlu_yazi",
        etiket: "Ekipman listesi bölümü — açıklama",
        uzun: true,
        varsayilan:
          "Aşağıda muayenesini yaptığımız ekipmanlar kategori kategori listelenmiştir. Her başlık, o ekipmanın kontrol kapsamını, uygulanan standardı ve yasal periyodunu anlatan sayfaya gider.",
      },
      { anahtar: "fenni_sss_baslik", etiket: "Sorular bölümü başlığı", varsayilan: "Sıkça Sorulan Sorular" },
      { anahtar: "fenni_kisaca_baslik", etiket: "Sağdaki özet kutusu başlığı", varsayilan: "Kısaca" },
      { anahtar: "fenni_ilgili_baslik", etiket: "Sağdaki bağlantı listesi başlığı", varsayilan: "İlgili sayfalar" },
      { anahtar: "fenni_kutu_baslik", etiket: "Sağdaki lacivert kutu başlığı", varsayilan: "Hemen bilgi alın" },
    ],
  },
  {
    /** ⚠️ Bu grup 12 bolge sayfasini birden etkiler. {ad} = şehir/ilçe adı. */
    baslik: "Bölge alt sayfaları (12 sayfanın ortak metinleri)",
    yol: "/bolge",
    alanlar: [
      { anahtar: "bolgeAlt_rozet", etiket: "Başlık altındaki yazı", varsayilan: "TÜRKAK akredite (AB-0296-M)" },
      { anahtar: "bolgeAlt_alan_baslik", etiket: "“Hizmet verdiğimiz alanlar” başlığı", varsayilan: "Hizmet Verdiğimiz Alanlar" },
      { anahtar: "bolgeAlt_neden_baslik", etiket: "“Neden biz” başlığı", not: "Başına bölge adı eklenmez.", varsayilan: "Neden Bölgenizde Bilge?" },
      {
        anahtar: "bolgeAlt_neden_liste",
        etiket: "“Neden biz” maddeleri",
        uzun: true,
        bicimli: true,
        varsayilan: `- Yakın bölge ekipleriyle hızlı randevu
- Sanayi ve üretim tesislerine özel planlama
- İSG-KATİP uyumlu, e-imzalı raporlar`,
      },
      {
        anahtar: "bolgeAlt_btn1",
        etiket: "Birinci buton",
        not: "Başına bölge adı otomatik eklenir: “Kocaeli için Teklif Al”.",
        varsayilan: "için Teklif Al",
      },
      { anahtar: "bolgeAlt_btn2", etiket: "İkinci buton", varsayilan: "Diğer Bölgeler" },
      { anahtar: "bolgeAlt_diger_baslik", etiket: "Sağdaki liste başlığı", varsayilan: "Diğer hizmet bölgeleri" },
    ],
  },
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
          "TÜRKAK tarafından TS EN ISO/IEC 17020 standardına göre akredite edilmiş bağımsız A Tipi muayene kuruluşu. 2009’ten bu yana iş ekipmanlarının periyodik kontrolünde uzmanız.",
      },
      { anahtar: "footer_kurumsal_baslik", etiket: "Birinci sütun başlığı", varsayilan: "Kurumsal" },
      { anahtar: "footer_hizmet_baslik", etiket: "İkinci sütun başlığı", varsayilan: "Hizmetler" },
      {
        anahtar: "footer_hizmet_tumu",
        etiket: "İkinci sütun — “tümü” bağlantısı",
        not: "Hizmet sayısı parantez içinde otomatik eklenir.",
        varsayilan: "Tümü",
      },
      { anahtar: "footer_iletisim_baslik", etiket: "Üçüncü sütun başlığı", varsayilan: "İletişim" },
      { anahtar: "footer_araclar_baslik", etiket: "Üçüncü sütun — alt başlık", varsayilan: "Hızlı İşlemler" },
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
