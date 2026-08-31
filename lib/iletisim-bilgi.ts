/**
 * GORUNEN ILETISIM BILGILERI — panel once, kod sonra.
 *
 * ⚠️ NEDEN VAR: panelde telefon, e-posta ve adres alanlari VARDI ama sitede
 * gorunen degerler koddaki `KURUM` sabitinden geliyordu. Yani kullanici
 * panelden telefonu degistiriyor, sayfalarda hicbir sey degismiyordu; panelin
 * kendi aciklamasinda bile "sayfalarda görünen adres buradan gelmez" yaziyordu.
 * Tasindiginizda ya da numara degistirdiginizde 12 ayri dosyada kod
 * degisikligi gerekiyordu.
 *
 * Artik tek kaynak burasi: panelde bir deger varsa O kullanilir, yoksa koddaki
 * sabite dusulur. Boylece panel bos kalsa bile site dogru bilgiyi gosterir.
 */
import { getSettings } from "./cms";
import { KURUM, semaSokakAdresi } from "./site-data";

export type IletisimBilgi = {
  /** Gorunen telefon, panelde yazildigi gibi. */
  telefon: string;
  /** tel: baglantisi icin +90... bicimi. */
  telefonE164: string;
  eposta: string;
  /** Yalnizca sokak kismi. */
  adres: string;
  /** Sokak + ilce / il. */
  adresTekSatir: string;
  calismaSaatleri: string;
  whatsapp: string;
  whatsappE164: string;
};

/**
 * Panelde yazilan telefonu tel:/wa.me icin uluslararasi bicime cevirir.
 *
 * ⚠️ Kullanici numarayi "0212 872 52 04", "+90 212 ...", "(0212) ..." gibi
 * cok farkli yazabilir; tel: baglantisinin calismasi bicime bagli olmamali.
 * Rakam disi her sey atiliyor, sonra Turkiye kodu tamamlaniyor.
 */
export function e164(ham: string, yedek: string): string {
  const rakam = (ham || "").replace(/\D/g, "");
  if (rakam.length < 10) return yedek;
  if (rakam.startsWith("90")) return "+" + rakam;
  if (rakam.startsWith("0")) return "+90" + rakam.slice(1);
  return "+90" + rakam;
}

/** wa.me bicimi: bastaki + olmadan. */
function waBicimi(ham: string, yedek: string): string {
  const t = e164(ham, "");
  return t ? t.replace(/^\+/, "") : yedek;
}

export async function iletisimBilgi(): Promise<IletisimBilgi> {
  /* Ayarlar okunamazsa site ayakta kalmali: her alan kod sabitine duser. */
  const s = await getSettings().catch(() => null);

  const telefon = s?.phone?.trim() || KURUM.telefon;
  const whatsapp = s?.whatsapp?.trim() || KURUM.whatsapp;
  /* Adreste panelin ilce/il tekrarini temizleyen mevcut kural kullaniliyor
     (bkz. site-data.ts semaSokakAdresi) — gorunen adres ile arama
     motorlarina giden adres boylece ayni kaliyor. */
  const adres = semaSokakAdresi(s?.address);

  return {
    telefon,
    telefonE164: e164(telefon, KURUM.telefonE164),
    eposta: s?.email?.trim() || KURUM.eposta,
    adres,
    adresTekSatir: `${adres}, ${KURUM.ilce} / ${KURUM.il}`,
    calismaSaatleri: s?.hours?.trim() || KURUM.calismaSaatleri,
    whatsapp,
    whatsappE164: waBicimi(whatsapp, KURUM.whatsappE164),
  };
}
