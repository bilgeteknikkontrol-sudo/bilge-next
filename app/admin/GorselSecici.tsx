"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Gorsel secme alani — dosyayi TARAYICIDA kucultup gonderir.
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

/** Kucultme hedefi: sitede kullanilan en genis gorsel alani ~1600 px. */
const HEDEF_GENISLIK = 1600;
/** Bu boyutun altina inildiginde daha fazla kalite feda edilmiyor. */
const HEDEF_BOYUT = 900 * 1024;
/** Sunucu tarafindaki sinir (bkz. app/admin/actions.ts YUKLEME_SINIRI). */
const SUNUCU_SINIRI = 6 * 1024 * 1024;

function boyutYaz(b: number): string {
  return b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
}

/**
 * Gorseli olcekleyip WebP'ye cevirir. Cevrilemiyorsa null doner.
 *
 * Kademeli deneme: once 1600 px / 0.82 kalite. Sonuc hala buyukse daha dar ve
 * daha dusuk kaliteyle tekrarlaniyor — cunku asil amac dosyayi istek govdesine
 * sigdirmak; son kademede sonuc ne cikarsa kabul ediliyor.
 */
async function kucult(dosya: File): Promise<File | null> {
  if (!dosya.type.startsWith("image/")) return null;
  // SVG vektorel: canvas'a cizmek onu buyutur, kucultmez.
  if (dosya.type === "image/svg+xml") return null;
  if (typeof createImageBitmap !== "function") return null;

  const kare = await createImageBitmap(dosya);
  try {
    const kademeler: [number, number][] = [
      [HEDEF_GENISLIK, 0.82],
      [1200, 0.75],
      [900, 0.7],
    ];
    for (const [genislik, kalite] of kademeler) {
      const olcek = Math.min(1, genislik / kare.width);
      const tuval = document.createElement("canvas");
      tuval.width = Math.max(1, Math.round(kare.width * olcek));
      tuval.height = Math.max(1, Math.round(kare.height * olcek));
      const ctx = tuval.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(kare, 0, 0, tuval.width, tuval.height);

      const blob = await new Promise<Blob | null>((coz) =>
        tuval.toBlob(coz, "image/webp", kalite)
      );
      // toBlob WebP'yi desteklemiyorsa null doner; dosya oldugu gibi gider.
      if (!blob) return null;
      if (blob.size <= HEDEF_BOYUT || genislik === 900) {
        const ad = dosya.name.replace(/\.[^.]+$/, "") + ".webp";
        return new File([blob], ad, { type: "image/webp" });
      }
    }
    return null;
  } finally {
    kare.close();
  }
}

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
