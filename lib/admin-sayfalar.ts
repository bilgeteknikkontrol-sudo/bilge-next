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
        baslik: "Hizmetler bölümü",
        aciklama: "Ana sayfadaki hizmet kartlarının üstündeki başlık ve açıklama.",
        anahtarlar: ["as_hizmet_etiket", "as_hizmet_baslik", "as_hizmet_giris"],
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
        tip: "blok",
        tur: "referans",
        baslik: "Referans logoları",
        aciklama: "Ana sayfada ve Referanslar sayfasında kayan logo şeridi. Başlık = firma adı, Görsel = logo.",
      },
      {
        tip: "blok",
        tur: "ekip",
        baslik: "Ekip / mühendis kadrosu",
        aciklama: "Ana sayfadaki uzman kadro kartları. Başlık = ad soyad, Metin = unvan.",
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
    ],
  },
  {
    id: "hizmetler",
    ad: "Hizmetlerimiz",
    ikon: "🔧",
    yol: "/ekipman",
    aciklama: "Periyodik kontrolünü yaptığınız ekipmanların listesi ve her birinin kendi sayfası.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["ekipman_baslik", "ekipman_giris"] },
      {
        tip: "kayit",
        baslik: "Ekipman listesi",
        aciklama:
          "Her ekipman ayrı bir sayfaya sahip. Buradan ekleyebilir, kategorisini ve kontrol periyodunu değiştirebilir, pasife alabilir veya silebilirsiniz.",
        yol: "/admin/equipment",
        dugme: "Ekipman listesini aç",
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
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["sertifika_baslik", "sertifika_giris"] },
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
        tip: "blok",
        tur: "referans",
        baslik: "Referans logoları",
        aciklama: "Ana sayfayla aynı listedir; birinde yaptığınız değişiklik ikisinde de görünür.",
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
        tip: "kayit",
        baslik: "Şehir sayfaları",
        aciklama:
          "Her şehir ayrı bir sayfa. Arama motorlarında şehir bazlı sorgular için en önemli sayfalar bunlar.",
        yol: "/admin/locations",
        dugme: "Şehir listesini aç",
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
    id: "iletisim",
    ad: "İletişim",
    ikon: "📞",
    yol: "/iletisim",
    aciklama: "İletişim bilgileri. Buradaki bilgiler sitenin her yerinde (header, footer, harita) kullanılır.",
    bolumler: [
      { tip: "metin", baslik: "Sayfa yazıları", anahtarlar: ["iletisim_baslik", "iletisim_giris"] },
      {
        tip: "ayar",
        baslik: "İletişim bilgileri",
        aciklama: "Bu alanlar header üst şeridinde, footer'da ve arama motorlarına verilen bilgilerde kullanılır.",
        alanlar: [
          { ad: "phone", etiket: "Telefon" },
          { ad: "email", etiket: "E-posta" },
          { ad: "address", etiket: "Adres", uzun: true },
        ],
      },
    ],
  },
];

export function sayfaBul(id: string): AdminSayfa | undefined {
  return ADMIN_SAYFALAR.find((s) => s.id === id);
}
