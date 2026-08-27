"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type CerezTercihi,
  tercihiYaz,
  useCerezTercihi,
  useCerezHazir,
  CEREZ_AC_OLAYI,
} from "@/lib/cerez";

export default function CerezOnay() {
  const tercih = useCerezTercihi();
  const hazir = useCerezHazir();
  // Footer'daki "Çerez Tercihleri" düğmesi banner'ı yeniden açar.
  const [zorlaAc, setZorlaAc] = useState(false);

  useEffect(() => {
    const ac = () => setZorlaAc(true);
    window.addEventListener(CEREZ_AC_OLAYI, ac);
    return () => window.removeEventListener(CEREZ_AC_OLAYI, ac);
  }, []);

  // Not: tercih kaydedilince banner'ı kapatan yer sec(); ayrıca bir effect
  // gerekmiyor. (Başka bir sekmede tercih değişirse burada açık kalır —
  // kullanıcı yine seçim yapabildiği için sorun değil.)

  // Sunucuda ve hidrasyon öncesinde hiçbir şey çizilmez (uyuşmazlık olmasın).
  if (!hazir) return null;
  if (!zorlaAc && tercih !== null) return null;

  function sec(t: CerezTercihi) {
    tercihiYaz(t);
    setZorlaAc(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-white/98 shadow-[0_-10px_30px_-12px_rgba(15,23,42,.3)] backdrop-blur-md"
    >
      <div className="container-x flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-sm leading-relaxed text-muted">
          Sitenin çalışması için gerekli çerezleri kullanıyoruz. İzin verirseniz anonim kullanım
          istatistiği topluyor ve haritayı otomatik yüklüyoruz.{" "}
          <Link href="/cerez-politikasi" className="font-semibold text-blue underline">
            Çerez Politikası
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => sec("zorunlu")}
            className="flex-1 whitespace-nowrap rounded-full border border-line px-5 py-3 text-sm font-bold text-navy transition hover:border-blue hover:text-blue md:flex-none"
          >
            Sadece zorunlu
          </button>
          <button
            type="button"
            onClick={() => sec("tumu")}
            className="flex-1 whitespace-nowrap rounded-full bg-blue px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 md:flex-none"
          >
            Tümünü kabul et
          </button>
        </div>
      </div>
    </div>
  );
}
