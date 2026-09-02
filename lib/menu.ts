/**
 * Header menusu — panelden yonetilir.
 *
 * Menu daha once app/components/Header.tsx icine sabit yazilmisti; basligi
 * degistirmek icin kod degisikligi ve yeni dagitim gerekiyordu. Artik menu
 * agaci JSON olarak icerik deposunda duruyor (anahtar: MENU_ANAHTARI) ve
 * Admin > Menu ekranindan duzenleniyor.
 *
 * "Hizmetler" ogesi ozel: acilan panel /lib/data.ts icindeki kategorilerden
 * dinamik olarak kuruluyor. Panelden yalnizca ETIKETI degistirilebilir,
 * icerigi otomatik. Bu yuzden `ozel: "hizmetler"` isaretini tasiyor.
 *
 * Kayitli menu bozuksa veya hic yoksa VARSAYILAN_MENU kullanilir — yani
 * panelde bir hata site menusunu asla yok edemez.
 */
import { getContent, setContent } from "./cms";

export const MENU_ANAHTARI = "menu-json";

export type MenuAlt = { href: string; label: string; not?: string };
export type MenuOge = {
  label: string;
  /** Dogrudan baglanti. `alt` doluysa veya ozel menu ise bos birakilir. */
  href?: string;
  /** Icerigi koddan gelen ozel menu. Su an yalnizca "hizmetler". */
  ozel?: "hizmetler";
  alt?: MenuAlt[];
};

/**
 * Ust seviye menu: en fazla 5 oge sigiyor (1024px'te tasiyor).
 *
 * ⚠️ BU LISTE YALNIZCA VARSAYILAN. Panelden bir menu kaydedilmisse site onu
 * okur ve buradaki degisiklik canliya YANSIMAZ (bkz. menuOku). Koda yeni bir
 * baglanti eklendiginde canlida gorunmuyorsa once Admin > Menu'ye bakin.
 */
export const VARSAYILAN_MENU: MenuOge[] = [
  { label: "Hizmetler", ozel: "hizmetler" },
  {
    label: "Kurumsal",
    alt: [
      { href: "/kurumsal", label: "Hakkımızda", not: "Akreditasyon ve ekip" },
      { href: "/sertifikalar", label: "Akreditasyon & Sertifikalar", not: "TÜRKAK AB-0296-M" },
      { href: "/referanslar", label: "Referanslarımız", not: "Çalıştığımız firmalar" },
      { href: "/bolge", label: "Hizmet Bölgeleri", not: "20 şehirde yerinde muayene" },
      { href: "/sss", label: "Sık Sorulan Sorular", not: "Süre, kapsam, mevzuat" },
      { href: "/cihazlar", label: "Ölçüm Cihazlarımız", not: "Sahada kullandığımız cihazlar" },
      { href: "/degerlendir", label: "Bizi Değerlendirin", not: "Google'da yorum bırakın" },
    ],
  },
  { label: "Bilgi Merkezi", href: "/yazilar" },
  {
    label: "Araçlar",
    alt: [
      { href: "/hesapla", label: "Yasal Süre Hesaplayıcı", not: "Sonraki kontrol tarihiniz" },
      { href: "/periyodik-kontrol-sureleri", label: "Periyodik Kontrol Süreleri", not: "Hangi ekipman ne sıklıkla" },
      { href: "/teklif", label: "Online Teklif", not: "Ekipman seçip talep oluşturun" },
    ],
  },
  { label: "İletişim", href: "/iletisim" },
];

/** Kayitli JSON'u guvenle MenuOge[]'e cevirir. Bozuk kayit varsayilana duser. */
function ayrıstir(ham: string | null): MenuOge[] | null {
  if (!ham) return null;
  try {
    const v = JSON.parse(ham);
    if (!Array.isArray(v) || v.length === 0) return null;
    const temiz: MenuOge[] = [];
    for (const o of v) {
      if (!o || typeof o.label !== "string" || !o.label.trim()) continue;
      const oge: MenuOge = { label: String(o.label).slice(0, 60) };
      if (o.ozel === "hizmetler") oge.ozel = "hizmetler";
      if (typeof o.href === "string" && o.href.trim()) oge.href = o.href.trim();
      if (Array.isArray(o.alt)) {
        const alt = o.alt
          .filter((a: unknown): a is MenuAlt => {
            const x = a as MenuAlt;
            return Boolean(x && typeof x.label === "string" && typeof x.href === "string" && x.label.trim() && x.href.trim());
          })
          .map((a: MenuAlt) => ({
            href: a.href.trim(),
            label: a.label.slice(0, 60),
            not: typeof a.not === "string" ? a.not.slice(0, 90) : undefined,
          }));
        if (alt.length) oge.alt = alt;
      }
      temiz.push(oge);
    }
    return temiz.length ? temiz : null;
  } catch {
    return null;
  }
}

export async function menuOku(): Promise<MenuOge[]> {
  return ayrıstir(await getContent(MENU_ANAHTARI).catch(() => null)) ?? VARSAYILAN_MENU;
}

export async function menuYaz(menu: MenuOge[]): Promise<void> {
  await setContent(MENU_ANAHTARI, JSON.stringify(menu));
}
