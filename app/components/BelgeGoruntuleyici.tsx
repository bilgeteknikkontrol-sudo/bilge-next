"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * BELGE GORUNTULEYICI — akreditasyon belgelerini tam ekranda buyutup kucultur.
 *
 * ⚠️ NEDEN VAR: TURKAK sertifikasi ve kapsam ekleri 1275x1650 piksellik
 * belgeler; kartta kucuk kutuda gosterildiginde uzerindeki kapsam satirlari
 * okunmuyordu. Ziyaretcinin "gercekten neyi kapsiyor" sorusunu yanitlamak bu
 * sayfanin tek isi, dolayisiyla belgenin okunabilmesi gerekiyor.
 *
 * Yakinlastirma, gorseli buyutup KAYDIRILABILIR bir kaba koyarak yapiliyor;
 * boylece kaydirma (pan) tarayicinin kendi isi oluyor, ayri bir surukleme
 * kodu yazmaya gerek kalmiyor ve dokunmatikte de dogal calisiyor.
 *
 * Erisilebilirlik: ESC ile kapanir, arka plana tiklayinca kapanir, acikken
 * arka plandaki sayfa kaymaz.
 */

const ADIMLAR = [1, 1.5, 2, 3, 4];

export default function BelgeGoruntuleyici({
  gorsel,
  baslik,
  children,
}: {
  gorsel: string;
  baslik: string;
  /** Kartta gorunen kucuk hali; tiklaninca goruntuleyici aciliyor. */
  children: React.ReactNode;
}) {
  const [acik, setAcik] = useState(false);
  const [adim, setAdim] = useState(0);
  const olcek = ADIMLAR[adim];

  const kapat = useCallback(() => {
    setAcik(false);
    setAdim(0);
  }, []);

  // ESC ile kapatma + acikken arka plani kilitleme.
  useEffect(() => {
    if (!acik) return;
    const tus = (e: KeyboardEvent) => {
      if (e.key === "Escape") kapat();
      if (e.key === "+" || e.key === "=") setAdim((a) => Math.min(a + 1, ADIMLAR.length - 1));
      if (e.key === "-") setAdim((a) => Math.max(a - 1, 0));
    };
    document.addEventListener("keydown", tus);
    const eskiTasma = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tus);
      document.body.style.overflow = eskiTasma;
    };
  }, [acik, kapat]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAcik(true)}
        className="group block w-full cursor-zoom-in text-left"
        aria-label={`${baslik} — belgeyi büyüt`}
      >
        {children}
      </button>

      {acik && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={baslik}
          className="fixed inset-0 z-[100] flex flex-col bg-navy/90 backdrop-blur-sm"
          onClick={kapat}
        >
          {/* Ust cubuk: baslik + yakinlastirma dugmeleri + kapat */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-4 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="min-w-0 truncate text-sm font-bold">{baslik}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdim((a) => Math.max(a - 1, 0))}
                disabled={adim === 0}
                aria-label="Küçült"
                className="h-9 w-9 rounded-lg border border-white/25 text-lg leading-none disabled:opacity-40"
              >
                −
              </button>
              <span className="w-14 text-center text-sm tabular-nums">
                %{Math.round(olcek * 100)}
              </span>
              <button
                type="button"
                onClick={() => setAdim((a) => Math.min(a + 1, ADIMLAR.length - 1))}
                disabled={adim === ADIMLAR.length - 1}
                aria-label="Büyüt"
                className="h-9 w-9 rounded-lg border border-white/25 text-lg leading-none disabled:opacity-40"
              >
                +
              </button>
              <button
                type="button"
                onClick={kapat}
                aria-label="Kapat"
                className="ml-1 h-9 rounded-lg border border-white/25 px-3 text-sm font-bold"
              >
                Kapat ✕
              </button>
            </div>
          </div>

          {/* Kaydirilabilir kap: buyutunce pan'i tarayici yapiyor. */}
          <div className="flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto" style={{ width: `${olcek * 100}%`, maxWidth: olcek === 1 ? "900px" : "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gorsel} alt={baslik} className="mx-auto h-auto w-full rounded-lg bg-white shadow-2xl" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
