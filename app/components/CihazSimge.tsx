import type { CihazTipi } from "@/lib/cihazlar";

/**
 * CIHAZ SIMGELERI
 *
 * ⚠️ NEDEN CIZIM: uretici ve satici sitelerindeki urun fotograflari telif
 * korumali; ticari bir sitede izinsiz kullanilamaz. Bu simgeler bu proje
 * icin sifirdan yazildi, dolayisiyla telif sorunu yok ve sitenin paletiyle
 * uyumlu (tek renk, currentColor).
 *
 * ⚠️ Amac fotograf taklidi degil, kutunun ne oldugunu bir bakista soylemek.
 * Cihazin kendi fotografi eklendiginde bu simge gorunmez olur; karar
 * `Cihaz.gorsel` alaninda (bkz. lib/cihazlar.ts).
 *
 * Cizim kurallari: 64x64 kutu, yalnizca kontur, strokeWidth 1.6,
 * yuvarlatilmis uc ve kose. Dolgu YOK — koyu/acik temada da ayni duruyor.
 */

const CIZIMLER: Record<CihazTipi, React.ReactNode> = {
  // Cok fonksiyonlu tesisat test cihazi: ekran + dondurme dugmesi + prob kablosu
  "tesisat-test": (
    <>
      <rect x="16" y="8" width="28" height="44" rx="4" />
      <rect x="21" y="14" width="18" height="10" rx="1.5" />
      <circle cx="30" cy="36" r="6" />
      <path d="M30 32v4" />
      <path d="M44 44c6 0 8 4 8 8" />
      <path d="M21 46h4M33 46h4" />
    </>
  ),

  // Topraklama olcum cihazi: govde + kablo + toprak sembolu
  topraklama: (
    <>
      <rect x="10" y="14" width="26" height="22" rx="3" />
      <rect x="14" y="19" width="18" height="8" rx="1" />
      <circle cx="19" cy="31" r="2.5" />
      <circle cx="28" cy="31" r="2.5" />
      <path d="M36 26h8v12" />
      <path d="M38 38h12M40.5 43h7M43 48h2" />
    </>
  ),

  // Pens ampermetre: govdenin ustunde kapali cene halkasi
  pens: (
    <>
      <ellipse cx="32" cy="16" rx="11" ry="10" />
      <ellipse cx="32" cy="16" rx="5.5" ry="4.5" />
      <rect x="22" y="26" width="20" height="30" rx="4" />
      <rect x="26" y="31" width="12" height="8" rx="1.5" />
      <circle cx="32" cy="47" r="4" />
      <path d="M32 43v4" />
    </>
  ),

  // Dijital multimetre: ekran + dugme + prob girisleri
  multimetre: (
    <>
      <rect x="18" y="6" width="28" height="48" rx="4" />
      <rect x="23" y="11" width="18" height="11" rx="1.5" />
      <circle cx="32" cy="34" r="7" />
      <path d="M32 29v5" />
      <circle cx="26" cy="47" r="2" />
      <circle cx="38" cy="47" r="2" />
      <path d="M26 54c-4 3-6 6-6 9M38 54c4 3 6 6 6 9" />
    </>
  ),

  // Zemin/duvar yalitim probu: uc ayakli ucgen plaka
  prob: (
    <>
      <path d="M32 12 52 46H12z" />
      <circle cx="32" cy="34" r="5" />
      <circle cx="32" cy="34" r="9" />
      <circle cx="15" cy="46" r="3" />
      <circle cx="49" cy="46" r="3" />
      <circle cx="32" cy="15" r="3" />
    </>
  ),

  // Termal kamera: lens + ekran + tutamak
  termal: (
    <>
      <rect x="10" y="12" width="34" height="22" rx="4" />
      <rect x="15" y="17" width="14" height="12" rx="1.5" />
      <circle cx="38" cy="23" r="7" />
      <circle cx="38" cy="23" r="3" />
      <path d="M22 34v10a6 6 0 0 0 6 6h2" />
      <path d="M30 44h6" />
    </>
  ),

  // Dedektor test cihazi: tavandaki dedektor + uzatma cubugu + baslik
  dedektor: (
    <>
      <path d="M12 8h40" />
      <path d="M26 8v3a6 6 0 0 0 12 0V8" />
      <path d="M28 20h8l2 6H26z" />
      <path d="M32 26v22" />
      <path d="M27 34h10M27 42h10" />
      <path d="M28 48h8v8h-8z" />
    </>
  ),

  // Anemometre: pervane + el cihazi
  anemometre: (
    <>
      <circle cx="42" cy="20" r="12" />
      <circle cx="42" cy="20" r="3" />
      <path d="M42 8v9M54 20h-9M42 32v-9M30 20h9" />
      <path d="M42 32v8" />
      <rect x="10" y="24" width="18" height="30" rx="3" />
      <rect x="14" y="29" width="10" height="8" rx="1" />
      <circle cx="19" cy="45" r="2.5" />
    </>
  ),

  // Elektrikli basinc test pompasi: motor govdesi + pompa kafasi + hortum
  "pompa-elektrikli": (
    <>
      <rect x="10" y="18" width="28" height="20" rx="9" />
      <path d="M17 18v20M23 18v20M29 18v20" />
      <rect x="38" y="22" width="11" height="13" rx="2" />
      <path d="M14 38v5h20v-5" />
      <path d="M49 28h3c4 0 6 4 6 8v8" />
    </>
  ),

  // El tipi basinc test pompasi: depo + kol + gosterge + hortum
  "pompa-manuel": (
    <>
      <rect x="8" y="36" width="34" height="16" rx="2" />
      <path d="M18 36V25" />
      <circle cx="18" cy="24" r="2" />
      <path d="M19.5 23 42 15" />
      <path d="M36 13v5" />
      <circle cx="50" cy="34" r="6" />
      <path d="M50 34v-3" />
      <path d="M50 40v4c0 3-2 5-5 5" />
    </>
  ),

  // Manometre: kadran + ibre + baglanti
  manometre: (
    <>
      <circle cx="32" cy="28" r="18" />
      <circle cx="32" cy="28" r="14" />
      <path d="M32 28 41 20" />
      <circle cx="32" cy="28" r="2" />
      <path d="M20 22v-1M44 22v-1M32 14v-2M20 36v1M44 36v1" />
      <path d="M28 46h8v8h-8z" />
    </>
  ),

  // Lazer metre: govde + ekran + isin
  lazermetre: (
    <>
      <rect x="12" y="10" width="26" height="44" rx="4" />
      <rect x="17" y="15" width="16" height="14" rx="1.5" />
      <circle cx="20" cy="38" r="2" />
      <circle cx="30" cy="38" r="2" />
      <circle cx="25" cy="46" r="2" />
      <path d="M38 18h6M46 18h4M52 18h4" />
      <path d="M52 14l4 4-4 4" />
    </>
  ),

  // Kumpas: kizak + sabit cene (solda) + hareketli cene (surgu)
  kumpas: (
    <>
      <rect x="10" y="29" width="46" height="6" rx="1" />
      <path d="M12 29V15h5v14" />
      <path d="M12 35v12h5V35" />
      <rect x="30" y="25" width="13" height="14" rx="2" />
      <path d="M34 25V15h4v10" />
      <path d="M34 39v10h4V39" />
      <path d="M46 29v3M50 29v3M54 29v3" />
    </>
  ),
};

export default function CihazSimge({ tip, className = "" }: { tip: CihazTipi; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {CIZIMLER[tip]}
    </svg>
  );
}
