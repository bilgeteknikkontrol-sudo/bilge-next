"use client";

import { CEREZ_AC_OLAYI } from "@/lib/cerez";

/** Kullanicinin daha once verdigi cerez kararini degistirebilmesi icin
 *  footer'daki dugme. Banner'i yeniden acar. */
export default function CerezAyarButonu() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(CEREZ_AC_OLAYI))}
      className="transition hover:text-white"
    >
      Çerez Tercihleri
    </button>
  );
}
