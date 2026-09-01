/**
 * SEO DENETIM MOTORU
 *
 * ⚠️ NEDEN VAR: 2026-09-01'de canli site elle tarandiginda 153 sayfanin
 * 9'unun aciklamasi 160, birinin basligi 60 karakteri asiyordu. Hicbiri gozle
 * fark edilmiyordu cunku baslik ve aciklama SABLONDAN uretiliyor: panelde uzun
 * bir sehir aciklamasi ya da ekipman adi yazan kisi, sonucun arama sayfasinda
 * kirpilacagini goremiyor. Dokuz hatanin sekizi TEK bir sablondan (bolge)
 * geliyordu — yani hata sayisi degil, sablon sayisi onemli.
 *
 * Bu dosya o taramayi KALICI hale getiriyor. Panel (/admin/seo) bunu calistirip
 * sonucu gosteriyor, boylece ayni denetim icin bir gelistiriciye ihtiyac kalmiyor.
 *
 * ⚠️ TASARIM KURALI: burada uretilen baslik/aciklama, sayfalarin GERCEKTEN
 * urettigiyle birebir ayni olmali. Bu yuzden sayfalarla ayni yardimcilar
 * (seoBaslik / seoAciklama / hizmetBasligi / sadeAd) kullaniliyor. Bu dosyada
 * ikinci bir kopya mantik YAZILMAZ; yazilirsa panel bir sey, site baska bir sey
 * gosterir ve arac guvenilmez olur.
 *
 * Ag istegi YOK: veriler zaten CMS'te. 153 sayfayi HTTP ile taramak paylasimli
 * hostingde 30-60 saniye surerdi ve panel her acilista siteyi doverdi.
 */

import type { Article, Equipment, Location } from "./cms";
import { seoAciklama, ACIKLAMA_SINIRI, BASLIK_SINIRI } from "./seo-baslik";
import { hizmetBasligi, sadeAd } from "./icerik-baglari";
import { EKIPMAN_ICERIK } from "./ekipman-icerik";
import { KURUM } from "./site-data";
import { yaziGorselAdresi } from "./images";

/** Marka eki: " | Bilge Teknik Kontrol" — bkz. lib/seo-baslik.ts */
const MARKA_EKI_UZUNLUK = " | Bilge Teknik Kontrol".length;

/**
 * Aciklamanin ALT siniri. Google cok kisa aciklamayi genellikle yok sayip
 * sayfadan kendi metnini secer — yani yazdiginiz aciklama hic kullanilmaz.
 */
export const ACIKLAMA_ALT_SINIR = 70;

/** Basligin alt siniri: 30 karakterin altina anahtar kelime sigmiyor. */
export const BASLIK_ALT_SINIR = 30;

export type Onem = "hata" | "uyari" | "bilgi";

export type Bulgu = {
  onem: Onem;
  /** Kisa kural adi — listede rozet olarak gosteriliyor */
  kural: string;
  /** Kullaniciya ne yapmasi gerektigini soyleyen cumle */
  mesaj: string;
};

export type SayfaDenetim = {
  /** Sitedeki adres */
  yol: string;
  /** Insan tarafindan okunur ad (listede gorunen) */
  ad: string;
  /** Panelde bu kaydin duzenlendigi ekran */
  duzenleYolu: string;
  tur: "Yazı" | "Hizmet" | "Bölge";
  baslik: string;
  aciklama: string;
  bulgular: Bulgu[];
};

export type DenetimOzeti = {
  sayfalar: SayfaDenetim[];
  toplamSayfa: number;
  hata: number;
  uyari: number;
  /** 0-100. Yalnizca kaba bir gosterge; hata agir, uyari hafif sayilir. */
  puan: number;
};

/* ------------------------------------------------------------------ kurallar */

function baslikBulgulari(ham: string): Bulgu[] {
  const b: Bulgu[] = [];
  const n = ham.trim().length;

  if (n === 0) {
    b.push({ onem: "hata", kural: "Başlık yok", mesaj: "Sayfanın arama sonucu başlığı boş." });
    return b;
  }
  if (n > BASLIK_SINIRI) {
    b.push({
      onem: "hata",
      kural: "Başlık uzun",
      mesaj: `${n} karakter. Google ${BASLIK_SINIRI} karakterden fazlasını kırpıyor — başlık yarım görünecek. ${n - BASLIK_SINIRI} karakter kısaltın.`,
    });
  } else if (n + MARKA_EKI_UZUNLUK > BASLIK_SINIRI) {
    // Hata degil: seoBaslik bu durumda marka ekini dusuruyor ve baslik tam
    // gorunuyor. Ama kullanici "neden marka gorunmuyor" diye sormasin diye
    // sebebi yaziliyor.
    b.push({
      onem: "bilgi",
      kural: "Marka eki düştü",
      mesaj: `${n} karakter. Sığmadığı için sonuna “| Bilge Teknik Kontrol” eklenmiyor; başlık tam görünüyor. Sorun değil.`,
    });
  }
  if (n > 0 && n < BASLIK_ALT_SINIR) {
    b.push({
      onem: "uyari",
      kural: "Başlık kısa",
      mesaj: `${n} karakter. ${BASLIK_ALT_SINIR} karakterin altındaki başlığa aranan kelimeler sığmıyor; arama sonucunda da zayıf duruyor.`,
    });
  }
  return b;
}

function aciklamaBulgulari(ham: string): Bulgu[] {
  const b: Bulgu[] = [];
  const n = ham.trim().length;

  if (n === 0) {
    b.push({
      onem: "hata",
      kural: "Açıklama yok",
      mesaj: "Açıklama boş. Google sayfadan rastgele bir cümle seçiyor; tıklama oranını siz belirleyemiyorsunuz.",
    });
    return b;
  }
  if (n > ACIKLAMA_SINIRI) {
    b.push({
      onem: "uyari",
      kural: "Açıklama uzun",
      mesaj: `${n} karakter. Site bunu otomatik olarak ${ACIKLAMA_SINIRI} karaktere kısaltıp gösteriyor, ama kendiniz kısaltırsanız cümle daha iyi biter. ${n - ACIKLAMA_SINIRI} karakter fazla.`,
    });
  } else if (n < ACIKLAMA_ALT_SINIR) {
    b.push({
      onem: "uyari",
      kural: "Açıklama kısa",
      mesaj: `${n} karakter. ${ACIKLAMA_ALT_SINIR} karakterin altındaki açıklamayı Google çoğu zaman yok sayıp kendi metnini kullanıyor.`,
    });
  }
  return b;
}

/**
 * Ayni baslik ya da aciklama birden fazla sayfada kullanilmis mi?
 *
 * ⚠️ Bu, sablonla uretilen sitelerde en kolay gozden kacan hata: iki sehir
 * sayfasi ayni aciklamayi tasiyorsa Google ikisini "ayni sayfa" sayip birini
 * indeksten dusurebilir.
 */
function yinelenenleriIsaretle(sayfalar: SayfaDenetim[]): void {
  const say = (secici: (s: SayfaDenetim) => string) => {
    const m = new Map<string, number>();
    for (const s of sayfalar) {
      const k = secici(s).trim().toLowerCase();
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  };

  const baslikSayisi = say((s) => s.baslik);
  const aciklamaSayisi = say((s) => s.aciklama);

  for (const s of sayfalar) {
    if ((baslikSayisi.get(s.baslik.trim().toLowerCase()) ?? 0) > 1) {
      s.bulgular.push({
        onem: "hata",
        kural: "Başlık yinelenmiş",
        mesaj: "Aynı başlık başka bir sayfada da kullanılıyor. Google hangisini göstereceğini seçemiyor; ikisi de zayıflıyor.",
      });
    }
    if ((aciklamaSayisi.get(s.aciklama.trim().toLowerCase()) ?? 0) > 1) {
      s.bulgular.push({
        onem: "hata",
        kural: "Açıklama yinelenmiş",
        mesaj: "Aynı açıklama başka bir sayfada da kullanılıyor. Her sayfanın kendine özel açıklaması olmalı.",
      });
    }
  }
}

/* ----------------------------------------------------------------- denetim */

/**
 * ⚠️ Buradaki baslik/aciklama uretimi, ilgili sayfanin `generateMetadata`
 * fonksiyonuyla AYNI olmali. Sayfada degistirirseniz burayi da degistirin;
 * yoksa panel gercekte yayinlanandan farkli bir sey gosterir.
 */
export function denetle(veri: {
  yazilar: Article[];
  ekipmanlar: Equipment[];
  bolgeler: Location[];
}): DenetimOzeti {
  const sayfalar: SayfaDenetim[] = [];

  // --- Yazilar: app/yazilar/[slug]/page.tsx ---
  for (const a of veri.yazilar.filter((x) => x.aktif)) {
    const baslik = (a.seoTitle?.trim() || a.title).trim();
    const aciklama = (a.description ?? "").trim();
    const bulgular = [...baslikBulgulari(baslik), ...aciklamaBulgulari(aciklama)];

    if (!yaziGorselAdresi(a.slug, a.image)) {
      bulgular.push({
        onem: "uyari",
        kural: "Görsel yok",
        mesaj:
          "Yazının Google'a bildirilebilecek bir görseli yok. Görselsiz makale arama sonucunda küçük resim almıyor ve Google Discover'a girmiyor.",
      });
    }
    if (!a.keywords?.length) {
      bulgular.push({
        onem: "bilgi",
        kural: "Anahtar kelime yok",
        mesaj: "Anahtar kelime girilmemiş. Sıralamayı doğrudan etkilemez ama ilgili yazı bağlantılarında kullanılıyor.",
      });
    }

    sayfalar.push({
      yol: `/yazilar/${a.slug}`,
      ad: a.title,
      duzenleYolu: "/admin/articles",
      tur: "Yazı",
      baslik,
      aciklama,
      bulgular,
    });
  }

  // --- Hizmetler: app/ekipman/[slug]/page.tsx ---
  for (const e of veri.ekipmanlar.filter((x) => x.aktif)) {
    const icerik = EKIPMAN_ICERIK[e.slug];
    const baslik = (icerik?.seoTitle || hizmetBasligi(e.ad)).trim();
    const aciklama = (
      icerik?.seoDesc ||
      `${sadeAd(e.ad)} periyodik kontrolü ${e.standart} kapsamında TÜRKAK akredite (${KURUM.akreditasyon}) muayene kuruluşu tarafından yapılır.`
    ).trim();

    sayfalar.push({
      yol: `/ekipman/${e.slug}`,
      ad: e.ad,
      duzenleYolu: "/admin/equipment",
      tur: "Hizmet",
      baslik,
      aciklama,
      bulgular: [...baslikBulgulari(baslik), ...aciklamaBulgulari(aciklama)],
    });
  }

  // --- Bolgeler: app/bolge/[slug]/page.tsx ---
  for (const l of veri.bolgeler.filter((x) => x.aktif)) {
    const ad = l.ilce || l.il;
    const baslik = `${ad} Periyodik Kontrol Hizmeti`;
    const aciklama = `${ad} bölgesinde periyodik kontrol ve TÜRKAK akredite muayene. ${l.description ?? ""}`.trim();

    sayfalar.push({
      yol: `/bolge/${l.slug}`,
      ad,
      duzenleYolu: "/admin/locations",
      tur: "Bölge",
      baslik,
      aciklama,
      bulgular: [...baslikBulgulari(baslik), ...aciklamaBulgulari(aciklama)],
    });
  }

  yinelenenleriIsaretle(sayfalar);

  // Sorunlu sayfalar uste: once hatasi olanlar, sonra uyarisi olanlar.
  const agirlik = (s: SayfaDenetim) =>
    s.bulgular.filter((b) => b.onem === "hata").length * 10 +
    s.bulgular.filter((b) => b.onem === "uyari").length;
  sayfalar.sort((x, y) => agirlik(y) - agirlik(x));

  const hata = sayfalar.reduce((t, s) => t + s.bulgular.filter((b) => b.onem === "hata").length, 0);
  const uyari = sayfalar.reduce((t, s) => t + s.bulgular.filter((b) => b.onem === "uyari").length, 0);

  /**
   * Puan kaba bir gosterge: her sayfa 1 puan, hata tam kayip, uyari yarim.
   * Amaci siralamayi tahmin etmek DEGIL — "duzelttikce yukselen" bir sayi
   * vermek. Bu yuzden ekranda "Google puani" gibi sunulmuyor.
   */
  const sorunlu = sayfalar.reduce((t, s) => {
    if (s.bulgular.some((b) => b.onem === "hata")) return t + 1;
    if (s.bulgular.some((b) => b.onem === "uyari")) return t + 0.5;
    return t;
  }, 0);
  const puan = sayfalar.length ? Math.round(100 - (sorunlu / sayfalar.length) * 100) : 100;

  return { sayfalar, toplamSayfa: sayfalar.length, hata, uyari, puan };
}

/** Aciklamanin arama sonucunda GERCEKTEN nasil gorunecegi (kirpilmis hali). */
export function aciklamaOnizleme(ham: string): string {
  return seoAciklama(ham);
}
