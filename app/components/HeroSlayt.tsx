"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Panelden gelen slayt görselleri. Boşsa bileşen hiçbir şey çizmez. */
  gorseller: string[];
  /** Slayt başına saniye */
  saniye?: number;
  /** Aktif karenin opaklığı. Koyu zemine gömülü kullanımda düşürülür. */
  opaklik?: number;
};

/**
 * Hero arka planinda yumusak gecisli slayt.
 *
 * Tum kareler ust uste duruyor; yalnizca opaklik degisiyor (transform/opacity
 * animasyonu, layout hesabi yapilmadigi icin akici). Tek gorsel varsa zamanlayici
 * hic kurulmuyor. "Hareketi azalt" tercihinde gecis yapilmaz, ilk gorsel sabit kalir.
 */
export default function HeroSlayt({ gorseller, saniye = 6, opaklik = 0.22 }: Props) {
  const [aktif, setAktif] = useState(0);

  useEffect(() => {
    if (gorseller.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setAktif((i) => (i + 1) % gorseller.length);
    }, saniye * 1000);
    return () => clearInterval(t);
  }, [gorseller.length, saniye]);

  if (gorseller.length === 0) return null;

  return (
    <div aria-hidden className="absolute inset-0">
      {gorseller.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${JSON.stringify(src)})`,
            opacity: i === aktif ? opaklik : 0,
          }}
        />
      ))}
    </div>
  );
}
