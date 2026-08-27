"use client";

import { useState } from "react";
import Link from "next/link";
import { useCerezTercihi } from "@/lib/cerez";

type Props = { lat: number; lng: number; baslik: string };

/**
 * Google Haritalar gomulusu ziyaretcinin IP adresini Google'a iletir ve Google
 * cerezi yerlestirebilir. Bu nedenle iframe SAYFA ACILIR ACILMAZ YUKLENMEZ:
 *  - Cerez tercihi "tumu" ise otomatik yuklenir,
 *  - degilse kullanici tiklayana kadar yalnizca bir yer tutucu gosterilir.
 *
 * Tek seferlik "haritayi yukle" tiklamasi genel cerez tercihini DEGISTIRMEZ;
 * yalnizca bu ziyarette bu haritayi acar.
 */
export default function HaritaGomulu({ lat, lng, baslik }: Props) {
  const tercih = useCerezTercihi();
  const [elleAcildi, setElleAcildi] = useState(false);
  const goster = tercih === "tumu" || elleAcildi;

  const src = `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=15`;
  const yolTarifi = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div>
      <div className="overflow-hidden rounded-card border border-line">
        {goster ? (
          <iframe
            src={src}
            title={baslik}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full border-0"
          />
        ) : (
          <div className="flex h-[420px] flex-col items-center justify-center gap-4 bg-bgsoft px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              🗺️
            </span>
            <div>
              <p className="font-bold text-navy">Harita yüklenmedi</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                Konum haritası Google tarafından sağlanır. Haritayı yüklediğinizde IP adresiniz
                Google&apos;a iletilir ve Google çerez yerleştirebilir.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setElleAcildi(true)}
              className="rounded-full bg-blue px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Haritayı yükle
            </button>
            <Link href="/cerez-politikasi" className="text-xs text-muted underline hover:text-blue">
              Çerez Politikası
            </Link>
          </div>
        )}
      </div>
      <a
        href={yolTarifi}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-bold text-blue hover:underline"
      >
        Yol tarifi al →
      </a>
    </div>
  );
}
