"use client";

import { useRef, useState, type ReactNode } from "react";
import { boyutYaz, kucult } from "@/lib/gorsel-kucult";

/**
 * Gorsel secme alani — dosyayi TARAYICIDA kucultup gonderir.
 *
 * ⚠️ Kucultme kodu artik `lib/gorsel-kucult.ts` icinde; teklif formundaki
 * fotograf ekleme alani da ayni kodu kullaniyor. Nedeni ve kademeleri orada
 * yaziyor. Ozeti:
 *
 * ⚠️ NEDEN VAR: 2026-08-31'de "hero slaytini adminde degistirdim ama degismiyor"
 * sikayeti geldi. Sebep panelde ya da veritabaninda degildi: Next.js'te bir
 * SUNUCU EYLEMININ (server action) istek govdesi varsayilan olarak 1 MB ile
 * sinirli. Panel "en fazla 6 MB" yaziyordu, ama 1 MB'i asan her fotograf
 * uygulamanin kendi kontrolune HIC ULASMADAN reddediliyordu: kayit olmuyor,
 * ekranda anlamli bir hata cikmiyor, kullanici "kaydettim, olmadi" diyor.
 * Canli sunucuda ayni sunucu eylemiyle birebir olculdu:
 *     ~1 KB govde -> 303  (islem calisti, yonlendirdi)
 *      3 MB govde -> 500  Internal Server Error
 * Telefonla cekilmis her fotograf 2-8 MB oldugu icin, gorsel yukleme
 * pratikte tamamen kirikti.
 *
 * Cozum iki katmanli:
 *  1) next.config.js -> experimental.serverActions.bodySizeLimit (guvenlik agi),
 *  2) burasi: secilen fotograf gonderilmeden once tarayicida en fazla 1600 px
 *     genislige olceklenip WebP'ye ceviriliyor. 6 MB'lik bir fotograf ~300 KB'a
 *     iniyor; boylece istek govdesi, MySQL paket siniri ve veritabani boyutu
 *     ayni anda rahatliyor.
 *
 * Cevrim yapilamazsa (ornek: tarayici HEIC cozemiyor) dosya OLDUGU GIBI
 * gonderiliyor — sunucu tarafi 6 MB'a kadar zaten kabul ediyor. Yani bu bilesen
 * hicbir durumda yuklemeyi engellemiyor, yalnizca kolaylastiriyor.
 */

/** Sunucu tarafindaki sinir (bkz. app/admin/actions.ts YUKLEME_SINIRI). */
const SUNUCU_SINIRI = 6 * 1024 * 1024;

type Props = {
  /** Form alan adi — sunucu eylemi dosyayi bu adla okuyor. */
  name: string;
  /** Alanin altinda gosterilecek aciklama. */
  ipucu?: ReactNode;
  className?: string;
};

const VARSAYILAN_SINIF =
  "block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2.5 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white";

export default function GorselSecici({ name, ipucu, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [durum, setDurum] = useState<{ tip: "bilgi" | "uyari"; metin: string } | null>(null);
  const [calisiyor, setCalisiyor] = useState(false);

  async function secildi() {
    const alan = ref.current;
    const dosya = alan?.files?.[0];
    if (!alan || !dosya) {
      setDurum(null);
      return;
    }

    setCalisiyor(true);
    setDurum({ tip: "bilgi", metin: `${dosya.name} hazırlanıyor…` });

    let yeni: File | null = null;
    try {
      yeni = await kucult(dosya);
    } catch {
      // Cozulemedi (bozuk dosya, desteklenmeyen bicim...). Orijinali gonderilir.
      yeni = null;
    }

    let degisti = false;
    if (yeni && yeni.size < dosya.size) {
      try {
        const dt = new DataTransfer();
        dt.items.add(yeni);
        alan.files = dt.files;
        degisti = true;
      } catch {
        // Eski tarayici: dosya listesi degistirilemedi, orijinal gonderilir.
        degisti = false;
      }
    }

    if (degisti && yeni) {
      setDurum({
        tip: "bilgi",
        metin: `Görsel otomatik küçültüldü: ${boyutYaz(dosya.size)} → ${boyutYaz(
          yeni.size
        )} (WebP). Şimdi kaydedebilirsiniz.`,
      });
    } else if (dosya.size > SUNUCU_SINIRI) {
      setDurum({
        tip: "uyari",
        metin: `Bu dosya ${boyutYaz(
          dosya.size
        )} ve tarayıcı küçültemedi. Lütfen 6 MB altında (tercihen JPG/WebP) bir görsel seçin.`,
      });
    } else {
      setDurum({ tip: "bilgi", metin: `${dosya.name} · ${boyutYaz(dosya.size)} seçildi.` });
    }

    setCalisiyor(false);
  }

  return (
    <>
      <input
        ref={ref}
        type="file"
        name={name}
        accept="image/*"
        onChange={secildi}
        className={className ?? VARSAYILAN_SINIF}
      />
      {ipucu && <span className="mt-1 block text-xs text-slate-400">{ipucu}</span>}
      {durum && (
        <span
          className={`mt-1 block text-xs font-semibold ${
            durum.tip === "uyari" ? "text-red-600" : "text-blue"
          }`}
        >
          {calisiyor ? "⏳ " : durum.tip === "uyari" ? "⚠️ " : "✓ "}
          {durum.metin}
        </span>
      )}
    </>
  );
}
