/**
 * Cerez tercihi yonetimi (istemci tarafi).
 *
 * Iki durum var:
 *   "zorunlu" -> yalnizca sitenin calismasi icin gerekli olanlar. Analitik yuklenmez,
 *                Google harita otomatik acilmaz (kullanici tek tek tiklayabilir).
 *   "tumu"    -> analitik ve ucuncu taraf gomululere de izin verilir.
 *
 * Tercih localStorage'da tutulur. Degisiklikler ayni sekmedeki diger bilesenlere
 * ozel bir event ile, diger sekmelere tarayicinin "storage" event'i ile duyurulur.
 */

import { useSyncExternalStore } from "react";

export type CerezTercihi = "zorunlu" | "tumu";

export const CEREZ_ANAHTARI = "btk-cerez-tercihi";
export const CEREZ_OLAYI = "btk-cerez-degisti";
/** Footer'daki "Çerez tercihleri" dugmesi banneri yeniden acmak icin bunu tetikler. */
export const CEREZ_AC_OLAYI = "btk-cerez-ac";

export function tercihiOku(): CerezTercihi | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CEREZ_ANAHTARI);
    return v === "tumu" || v === "zorunlu" ? v : null;
  } catch {
    // localStorage kapaliysa (gizli mod, katı gizlilik ayari) tercih hatirlanmaz;
    // banner her ziyarette gosterilir, bu guvenli taraftir.
    return null;
  }
}

export function tercihiYaz(t: CerezTercihi) {
  try {
    window.localStorage.setItem(CEREZ_ANAHTARI, t);
  } catch {
    /* yazilamazsa sessizce gec */
  }
  window.dispatchEvent(new CustomEvent(CEREZ_OLAYI, { detail: t }));
}

export function tercihiTemizle() {
  try {
    window.localStorage.removeItem(CEREZ_ANAHTARI);
  } catch {
    /* yoksay */
  }
  window.dispatchEvent(new CustomEvent(CEREZ_OLAYI, { detail: null }));
}

/** Tercih degisimlerini dinler; aboneligi kaldiran fonksiyonu dondurur. */
export function tercihiDinle(f: (t: CerezTercihi | null) => void): () => void {
  const yerel = () => f(tercihiOku());
  const digerSekme = (e: StorageEvent) => {
    if (e.key === CEREZ_ANAHTARI) f(tercihiOku());
  };
  window.addEventListener(CEREZ_OLAYI, yerel);
  window.addEventListener("storage", digerSekme);
  return () => {
    window.removeEventListener(CEREZ_OLAYI, yerel);
    window.removeEventListener("storage", digerSekme);
  };
}

/* ---------------------------------------------------------------------------
   React baglayicisi

   localStorage bir DIS DEPO; React state'i degil. Bu yuzden useEffect + setState
   yerine useSyncExternalStore kullaniyoruz:
     - Sunucuda ve ilk cizimde daima null doner  -> hidrasyon uyusmazligi olmaz,
     - Degisiklikler abonelik uzerinden gelir    -> effect icinde setState yok
       (cascading render'a yol acan react-hooks/set-state-in-effect sorunu).
--------------------------------------------------------------------------- */

/** Sunucu anligi: SSR sirasinda tercih bilinemez. Sabit referans dondurulmeli. */
function sunucuAnlik(): CerezTercihi | null {
  return null;
}

export function useCerezTercihi(): CerezTercihi | null {
  return useSyncExternalStore(tercihiDinle, tercihiOku, sunucuAnlik);
}

/**
 * Tercih okundu mu? Ilk cizimde (ve sunucuda) false, hidrasyondan sonra true.
 * "Henuz bilmiyorum" ile "tercih yok" durumlarini ayirmak icin kullanilir.
 */
export function useCerezHazir(): boolean {
  return useSyncExternalStore(
    tercihiDinle,
    () => true,
    () => false
  );
}
