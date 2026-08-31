/**
 * Panelin sayfa listesi.
 *
 * Panel once ICERIK TURUNE gore bolunmustu (Yazilar / Ekipman / Bloklar /
 * Metinler). Bu yuzden "ana sayfadaki slayt gorsellerini degistir" gibi basit
 * bir is icin hangi ekrana gidilecegi belli olmuyordu — slaytlar "Icerik
 * Bloklari" adli genel bir ekranin icinde gomuluydu.
 *
 * Artik panel SITEDEKI SAYFALARA gore bolunuyor ve sira sitenin menu sirasiyla
 * ayni. Bir sayfayi degistirmek isteyen kisi panelde ayni adi ariyor, tikliyor,
 * o sayfaya ait HER SEYI (yazilar, gorseller, listeler) tek ekranda buluyor.
 *
 * Bir sayfa bolumlerden olusur:
 *  - metin : lib/sayfa-metin.ts icindeki alanlar (baslik, giris yazisi...)
 *  - ayar  : SiteSettings alanlari (heroTitle, phone... — CMS ayarlarinda durur)
 *  - blok  : lib/bloklar.ts koleksiyonu (slayt, referans, ekip, belge, SSS)
 *            -> ekle / duzenle / sil / sirala / gorsel
 *  - kayit : ayri ekrani olan buyuk listeler (yazilar, ekipman, sehirler)
 */
import type { BlokTuru } from "./bloklar";

export type AyarAlani = {
  ad: string;
  etiket: string;
  not?: string;
  uzun?: boolean;
};

export type SayfaBolumu =
  | { tip: "metin"; baslik: string; aciklama?: string; anahtarlar: string[] }
  | { tip: "ayar"; baslik: string; aciklama?: string; alanlar: AyarAlani[] }
  | { tip: "blok"; tur: BlokTuru; baslik: string; aciklama: string }
  | {
      tip: "kayit";
      baslik: string;
      aciklama: string;
      yol: string;
      dugme: string;
    };

export type AdminSayfa = {
  id: string;
  ad: string;
  ikon: string;
  /** Sitedeki adresi — "Sayfayi gor" baglantisi */
  yol: string;
  aciklama: string;
  bolumler: SayfaBolumu[];
};

export const ADMIN_SAYFALAR: AdminSayfa[] = [
  {
    id: "anasayfa",
    ad: "Ana Sayfa",
    ikon: "🏠",
    yol: "/",
    aciklama: "Sitenin giriş sayfası: üst bölüm, slayt görselleri, hizmet kartları, referanslar ve ekip.",
    bolumler: [
      {
        tip: "ayar",
        baslik: "Üst bölüm (hero)",
        aciklama: "Sayfanın en üstündeki büyük başlık ve altındaki yazı.",
        alanlar: [
          { ad: "heroTitle", etiket: "Büyük başlık" },
          { ad: "heroSubtitle", etiket: "Başlık altı yazı", uzun: true },
        ],
      },
      {
        tip: "blok",
        tur: "hero",
        baslik: "Üst bölüm slayt görselleri",
        aciklama:
          "Sağdaki büyük fotoğraf. Birden fazla görsel eklerseniz yumuşak geçişle döner. Hiç eklemezseniz varsayılan saha fotoğrafı görünür.",
      },
      {
        tip: "metin",
        baslik: "Üst bölüm yazıları",
        aciklama: "Büyük başlığın etrafındaki rozet, butonlar ve fotoğrafın üstündeki yazılar.",
        anahtarlar: [
          "as_hero_rozet",
          "as_hero_btn1",
          "as_hero_btn2",
          "as_hero_gorsel_rozet",
          "as_hero_gorsel_yazi",
        ],
      },
      {
        tip: "blok",
        tur: "ozellik",
        baslik: "Üst bölüm maddeleri",
        aciklama:
          "Büyük başlığın altındaki ikonlu üç madde. Hiç kayıt eklemezseniz bugünkü üç madde görünmeye devam eder.",
      },
      {
        tip: "blok",
        tur: "rakam",
        baslik: "Rakam şeridi",
        aciklama:
          "Üst bölümün altındaki ince şerit (2014 · 500+ · 92 · AB-0296-M). Başlık = rakam, Metin = altındaki etiket.",
      },
      {
        tip: "metin",
        baslik: "Teklif kartı",
        aciklama: "Fotoğrafın üzerine binen beyaz kart.",
        anahtarlar: ["as_kart_etiket", "as_kart_baslik", "as_kart_buton", "as_kart_not"],
      },
      {
        tip: "metin",
        baslik: "Hizmetler bölümü",
        aciklama: "Ana sayfadaki hizmet kartlarının üstündeki başlık, açıklama ve alttaki butonlar.",
        anahtarlar: [
          "as_hizmet_etiket",
          "as_hizmet_baslik",
          "as_hizmet_giris",
          "as_hizmet_btn1",
          "as_hizmet_btn2",
        ],
      },
      {
        tip: "metin",
        baslik: "Hizmet bölgeleri bölümü",
        aciklama: "Şehir listesinin üstündeki başlık ve açıklama. Şehirler Hizmet Bölgelerimiz ekranından yönetilir.",
        anahtarlar: ["as_bolge_etiket", "as_bolge_baslik", "as_bolge_giris", "as_bolge_buton"],
      },
      {
        tip: "metin",
        baslik: "Fark kartları — başlık",
        anahtarlar: ["as_neden_etiket", "as_neden_baslik"],
      },
      {
        tip: "blok",
        tur: "avantaj",
        baslik: "Fark kartları",
        aciklama:
          "\"Rakiplerden Ayıran 4 Fark\" bölümündeki kartlar. İkon = emoji, Başlık = kart başlığı, Metin = açıklama.",
      },
      {
        tip: "metin",
        baslik: "Süreç bölümü — başlık",
        anahtarlar: ["as_surec_etiket", "as_surec_baslik"],
      },
      {
        tip: "blok",
        tur: "surec",
        baslik: "Süreç adımları",
        aciklama: "Numaralı adımlar. Numara sıraya göre otomatik verilir; siz yalnızca başlık ve açıklama yazarsınız.",
      },
      {
        tip: "ayar",
        baslik: "Hakkımızda bölümü",
        aciklama: "Ana sayfadaki kısa tanıtım bölümü.",
        alanlar: [
          { ad: "aboutTitle", etiket: "Başlık" },
          { ad: "aboutText", etiket: "Yazı", uzun: true },
        ],
      },
      {
        tip: "metin",
        baslik: "Referanslar bölümü",
        aciklama: "Logo şeridinin üstündeki başlık ve açıklama.",
        anahtarlar: ["as_referans_etiket", "as_referans_baslik", "as_referans_giris", "as_referans_buton"],
      },
      {
        tip: "blok",
        tur: "referans",
        baslik: "Referans logoları",
        aciklama: "Ana sayfada ve Referanslar sayfasında kayan logo şeridi. Başlık = firma adı, Görsel = logo.",
      },
      {
        tip: "metin",
        baslik: "Katalog bölümü",
        aciklama: "Kataloğun tanıtıldığı kart. PDF dosyasını değiştirmek için geliştiriciye söyleyin.",
        anahtarlar: [
          "as_katalog_etiket",
          "as_katalog_baslik",
          "as_katalog_giris",
          "as_katalog_btn1",
          "as_katalog_btn2",
        ],
      },
      {
        tip: "metin",
        baslik: "Ekip bölümü — başlık",
        anahtarlar: ["as_ekip_etiket", "as_ekip_baslik", "as_ekip_giris"],
      },
      {
        tip: "blok",
        tur: "ekip",
        baslik: "Ekip / mühendis kadrosu",
        aciklama: "Ana sayfadaki uzman kadro kartları. Başlık = ad soyad, Metin = unvan.",
      },
      {
        tip: "metin",
        baslik: "Akreditasyon şeridi",
        aciklama: "Sayfanın sonuna yakın, yeşil onay işaretli şerit.",
        anahtarlar: ["as_akr_baslik", "as_akr_yazi"],
      },
      {
        tip: "ayar",
        baslik: "Alt çağrı bölümü",
        aciklama: "Sayfanın sonundaki teklif çağrısı.",
        alanlar: [
          { ad: "ctaTitle", etiket: "Başlık" },
          { ad: "ctaText", etiket: "Yazı", uzun: true },
        ],
      },
      {
        tip: "metin",
        baslik: "Alt çağrı butonu",
        anahtarlar: ["as_cta_buton"],
      },
    ],
  },
  {
    id: "hizmetler",
    ad: "Hizmetlerimiz",
    ikon: "🔧",
    yol: "/ekipman",
    aciklama: "Periyodik kontrolünü yaptığınız ekipmanların listesi ve her birinin kendi sayfası.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["ekipman_baslik", "ekipman_giris", "ekipman_yol_adi", "ekipman_rozet"] },
      {
        tip: "metin",
        baslik: "Sol sütun ve alt çağrı",
        aciklama: "Kategori listesinin başlığı, altındaki lacivert kutu ve sayfanın sonundaki çağrı.",
        anahtarlar: [
          "ekipman_kategori_baslik",
          "ekipman_kutu_baslik",
          "ekipman_kutu_yazi",
          "ekipman_kutu_buton",
          "ekipman_cta_baslik",
          "ekipman_cta_yazi",
          "ekipman_cta_btn1",
          "ekipman_cta_btn2",
        ],
      },
      {
        tip: "kayit",
        baslik: "Ekipman listesi",
        aciklama:
          "Her ekipman ayrı bir sayfaya sahip. Buradan ekleyebilir, kategorisini ve kontrol periyodunu değiştirebilir, pasife alabilir veya silebilirsiniz.",
        yol: "/admin/equipment",
        dugme: "Ekipman listesini aç",
      },
      {
        tip: "metin",
        baslik: "Hizmet sayfalarının ortak metinleri",
        aciklama:
          "⚠️ Buradaki bir değişiklik 92 hizmet sayfasında birden görünür. {ad}, {standart}, {periyot} yazdığınız yere o hizmetin kendi bilgisi gelir.",
        anahtarlar: [
          "hizmet_yol_adi",
          "hizmet_sss_baslik",
          "hizmet_kapsam_baslik",
          "hizmet_kapsam_p1",
          "hizmet_kapsam_p2",
          "hizmet_liste_baslik",
          "hizmet_liste",
          "hizmet_btn1",
          "hizmet_btn2",
          "hizmet_rehber_baslik",
          "hizmet_kunye_kategori",
          "hizmet_kunye_standart",
          "hizmet_kunye_periyot",
          "hizmet_kunye_akreditasyon",
          "hizmet_kunye_digerad",
          "hizmet_diger_baslik",
          "hizmet_tum_link",
          "hizmet_kutu_baslik",
        ],
      },
    ],
  },
  {
    id: "hakkimizda",
    ad: "Hakkımızda",
    ikon: "🏢",
    yol: "/kurumsal",
    aciklama: "Kurumsal tanıtım sayfası.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["kurumsal_baslik", "kurumsal_giris"] },
      {
        tip: "metin",
        baslik: "Sayfanın ana metni",
        aciklama: "Sol taraftaki uzun yazı. Başlık ekleyip madde listesi yazabilirsiniz.",
        anahtarlar: ["kurumsal_govde"],
      },
      {
        tip: "metin",
        baslik: "Butonlar ve sağdaki kutular",
        anahtarlar: [
          "kurumsal_btn1",
          "kurumsal_btn2",
          "kurumsal_kunye_baslik",
          "kurumsal_ekip_baslik",
          "kurumsal_ref_etiket",
          "kurumsal_ref_baslik",
        ],
      },
      {
        tip: "blok",
        tur: "ekip",
        baslik: "Ekip / mühendis kadrosu",
        aciklama: "Ana sayfayla aynı listedir; birinde yaptığınız değişiklik ikisinde de görünür.",
      },
    ],
  },
  {
    id: "akreditasyon",
    ad: "Akreditasyon",
    ikon: "📜",
    yol: "/sertifikalar",
    aciklama: "TÜRKAK akreditasyon sayfası ve belge görselleri.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["sertifika_baslik", "sertifika_giris", "sertifika_yol_adi"] },
      {
        tip: "metin",
        baslik: "Akreditasyon künyesi",
        aciklama: "Yeşil onaylı kutu ve altındaki doğrulama açıklaması.",
        anahtarlar: [
          "sertifika_no_baslik",
          "sertifika_no_yazi",
          "sertifika_dogrula_baslik",
          "sertifika_dogrula_yazi",
        ],
      },
      {
        tip: "metin",
        baslik: "Belgeler bölümü başlıkları",
        anahtarlar: ["sertifika_belge_etiket", "sertifika_belge_baslik"],
      },
      {
        tip: "metin",
        baslik: "“Akreditasyon neden önemli?” bölümü",
        anahtarlar: ["sertifika_neden_baslik", "sertifika_neden_yazi"],
      },
      {
        tip: "metin",
        baslik: "Hiç belge eklenmemişse görünen metin",
        anahtarlar: ["sertifika_bos_baslik", "sertifika_bos_yazi", "sertifika_bos_buton"],
      },
      {
        tip: "blok",
        tur: "sertifika",
        baslik: "Sertifika görselleri",
        aciklama:
          "Sayfada gösterilen belgeler. Sıra numarasına göre dizilir. Başlık görselin altında görünür; Metin alanını boş bırakırsanız görselin altında ek açıklama çıkmaz.",
      },
    ],
  },
  {
    id: "referanslar",
    ad: "Referanslar",
    ikon: "🤝",
    yol: "/referanslar",
    aciklama: "Çalıştığınız firmalar.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["referans_baslik", "referans_giris"] },
      {
        tip: "metin",
        baslik: "Logolar bölümü",
        anahtarlar: ["referans_logo_etiket", "referans_logo_baslik", "referans_logo_not"],
      },
      {
        tip: "blok",
        tur: "referans",
        baslik: "Referans logoları",
        aciklama: "Ana sayfayla aynı listedir; birinde yaptığınız değişiklik ikisinde de görünür.",
      },
      {
        tip: "metin",
        baslik: "Sektörler bölümü — başlık",
        anahtarlar: ["referans_sektor_etiket", "referans_sektor_baslik", "referans_sektor_giris"],
      },
      {
        tip: "blok",
        tur: "sektor",
        baslik: "Hizmet verilen sektörler",
        aciklama: "Sektör kartları. İkon = emoji, Başlık = sektör adı, Metin = hangi ekipmanlara baktığınız.",
      },
      {
        tip: "metin",
        baslik: "Alt çağrı bölümü",
        anahtarlar: ["referans_cta_baslik", "referans_cta_yazi", "referans_cta_buton"],
      },
    ],
  },
  {
    id: "bolgeler",
    ad: "Hizmet Bölgelerimiz",
    ikon: "📍",
    yol: "/bolge",
    aciklama: "Hizmet verdiğiniz şehirler ve her şehrin kendi sayfası.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["bolge_baslik", "bolge_giris"] },
      {
        tip: "metin",
        baslik: "İlçe bölümü ve alt çağrı",
        anahtarlar: [
          "bolge_ilce_baslik",
          "bolge_ilce_yazi",
          "bolge_kart_link",
          "bolge_cta_baslik",
          "bolge_cta_yazi",
          "bolge_cta_btn1",
          "bolge_cta_btn2",
        ],
      },
      {
        tip: "kayit",
        baslik: "Şehir sayfaları",
        aciklama:
          "Her şehir ayrı bir sayfa. Arama motorlarında şehir bazlı sorgular için en önemli sayfalar bunlar.",
        yol: "/admin/locations",
        dugme: "Şehir listesini aç",
      },
      {
        tip: "metin",
        baslik: "Şehir sayfalarının ortak metinleri",
        aciklama: "⚠️ Buradaki bir değişiklik 12 bölge sayfasında birden görünür.",
        anahtarlar: [
          "bolgeAlt_rozet",
          "bolgeAlt_alan_baslik",
          "bolgeAlt_neden_baslik",
          "bolgeAlt_neden_liste",
          "bolgeAlt_btn1",
          "bolgeAlt_btn2",
          "bolgeAlt_diger_baslik",
        ],
      },
    ],
  },
  {
    id: "sss",
    ad: "Sık Sorulan Sorular",
    ikon: "❓",
    yol: "/sss",
    aciklama: "Soru-cevap sayfası.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["sss_baslik", "sss_giris"] },
      {
        tip: "metin",
        baslik: "Sağdaki kutular",
        anahtarlar: [
          "sss_kutu1_baslik",
          "sss_kutu1_yazi",
          "sss_kutu1_buton",
          "sss_kutu2_baslik",
          "sss_kutu2_buton",
        ],
      },
      {
        tip: "blok",
        tur: "sss",
        baslik: "Sorular ve cevaplar",
        aciklama: "Başlık = soru, Metin = cevap. Sıra numarasıyla dizilir.",
      },
    ],
  },
  {
    id: "bilgimerkezi",
    ad: "Bilgi Merkezi",
    ikon: "✍️",
    yol: "/yazilar",
    aciklama: "Makaleler ve rehberler.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["yazilar_baslik", "yazilar_giris"] },
      {
        tip: "kayit",
        baslik: "Yazılar",
        aciklama:
          "Yeni yazı eklemek arama motorlarında görünürlük için en etkili işlerden biri. Her yazının kendi görseli, özeti ve SSS bölümü var.",
        yol: "/admin/articles",
        dugme: "Yazı listesini aç",
      },
    ],
  },
  {
    id: "hesapla",
    ad: "Yasal Süre Hesaplama",
    ikon: "🧮",
    yol: "/hesapla",
    aciklama: "Ziyaretçinin sonraki kontrol tarihini hesapladığı araç sayfası.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["hesapla_baslik", "hesapla_giris"] },
      {
        tip: "kayit",
        baslik: "Hesaplamanın kullandığı veriler",
        aciklama:
          "Hesaplayıcı, ekipman listesindeki kontrol periyotlarını kullanır. Bir periyodu değiştirmek için ekipman listesini açın.",
        yol: "/admin/equipment",
        dugme: "Ekipman listesini aç",
      },
    ],
  },
  {
    id: "sureler",
    ad: "Periyodik Kontrol Süreleri",
    ikon: "📊",
    yol: "/periyodik-kontrol-sureleri",
    aciklama: "Hangi ekipmanın ne sıklıkla kontrol edileceğini gösteren tablo.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["sureler_baslik", "sureler_giris"] },
      {
        tip: "kayit",
        baslik: "Tablodaki veriler",
        aciklama: "Tablo, ekipman listesinden otomatik oluşur. Süreleri değiştirmek için ekipman listesini açın.",
        yol: "/admin/equipment",
        dugme: "Ekipman listesini aç",
      },
    ],
  },
  {
    id: "teklif",
    ad: "Online Teklif",
    ikon: "📝",
    yol: "/teklif",
    aciklama: "Ziyaretçilerin ekipman seçip teklif istediği form.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["teklif_baslik", "teklif_giris"] },
      {
        tip: "kayit",
        baslik: "Ek bilgi soruları",
        aciklama:
          "Bazı ekipmanlara teklif verebilmek için adet yetmiyor: m², kat sayısı, dedektör adedi gibi bilgiler gerekiyor. Bu sorular müşteri o ekipmanı seçtiğinde formda beliriyor.",
        yol: "/admin/teklif-sorulari",
        dugme: "Soruları yönet",
      },
      {
        tip: "kayit",
        baslik: "Gelen teklif talepleri",
        aciklama: "Formdan gelen talepler burada listelenir.",
        yol: "/admin/teklifler",
        dugme: "Talepleri gör",
      },
    ],
  },
  {
    id: "yasal",
    ad: "Yasal Metinler",
    ikon: "⚖️",
    yol: "/kvkk",
    aciklama:
      "KVKK aydınlatma metni ve çerez politikası. Metinlerin gövdesi güvenlik gereği kodda tutuluyor; değişiklik gerekirse geliştiriciye söyleyin.",
    bolumler: [
      {
        tip: "metin",
        baslik: "Son güncelleme tarihi",
        aciklama: "Her iki yasal sayfanın üstünde görünür.",
        anahtarlar: ["yasal_son_guncelleme"],
      },
    ],
  },
  {
    id: "fenni",
    ad: "Fenni Muayene Nedir?",
    ikon: "📘",
    yol: "/fenni-muayene",
    aciklama:
      "“Fenni muayene” diye arayan ziyaretçiyi karşılayan bilgi sayfası. Arama motorlarında bu terim için en güçlü sayfanız.",
    bolumler: [
      {
        tip: "metin",
        baslik: "Sayfa yazıları",
        anahtarlar: ["fenni_baslik", "fenni_giris", "fenni_lead"],
      },
      {
        tip: "metin",
        baslik: "Sayfanın ana metni",
        aciklama: "“Yasal dayanak” ve “Kim yapabilir?” bölümleri.",
        anahtarlar: ["fenni_govde"],
      },
      {
        tip: "metin",
        baslik: "Ekipman listesi bölümü",
        aciklama: "Listenin kendisi ekipman kayıtlarından otomatik oluşur.",
        anahtarlar: ["fenni_zorunlu_baslik", "fenni_zorunlu_yazi", "fenni_sss_baslik"],
      },
      {
        tip: "blok",
        tur: "fennisss",
        baslik: "Sayfadaki sorular",
        aciklama:
          "Başlık = soru, Metin = cevap. Bu sorular Google'a yapısal veri olarak da gönderilir. Hiç kayıt eklemezseniz bugünkü beş soru görünmeye devam eder.",
      },
      {
        tip: "metin",
        baslik: "Sağdaki kutular",
        anahtarlar: ["fenni_kisaca_baslik", "fenni_ilgili_baslik", "fenni_kutu_baslik"],
      },
    ],
  },
  {
    id: "iletisim",
    ad: "İletişim",
    ikon: "📞",
    yol: "/iletisim",
    aciklama: "İletişim bilgileri. Buradaki bilgiler sitenin her yerinde (header, footer, harita) kullanılır.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["iletisim_baslik", "iletisim_giris"] },
      {
        tip: "metin",
        baslik: "Sayfadaki başlıklar",
        anahtarlar: [
          "iletisim_bolum_baslik",
          "iletisim_teklif_baslik",
          "iletisim_teklif_yazi",
          "iletisim_teklif_btn1",
          "iletisim_teklif_btn2",
          "iletisim_ekip_baslik",
        ],
      },
      {
        tip: "ayar",
        baslik: "İletişim bilgileri",
        aciklama:
          "Burada yazdıklarınız sitenin HER YERİNDE geçerlidir: üst şerit, footer, iletişim sayfası, teklif formu ve arama motorlarına verilen bilgiler.",
        alanlar: [
          { ad: "phone", etiket: "Telefon" },
          { ad: "whatsapp", etiket: "WhatsApp numarası", not: "Teklif formundaki WhatsApp bağlantısında kullanılır." },
          { ad: "email", etiket: "E-posta" },
          {
            ad: "address",
            etiket: "Adres",
            uzun: true,
            /**
             * ⚠️ Eskiden burada "sayfalarda görünen adres buradan gelmez"
             * yaziyordu — dogruydu ve tam olarak duzeltilmesi gereken seydi.
             * Artik gorunen adres de bu alandan okunuyor
             * (bkz. lib/iletisim-bilgi.ts).
             */
            not: "Yalnızca sokak/cadde kısmını yazın — ilçe ve il ayrıca ekleniyor.",
          },
          { ad: "hours", etiket: "Çalışma saatleri" },
        ],
      },
    ],
  },
];

export function sayfaBul(id: string): AdminSayfa | undefined {
  return ADMIN_SAYFALAR.find((s) => s.id === id);
}
