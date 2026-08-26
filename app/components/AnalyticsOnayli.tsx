"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { tercihiOku, tercihiDinle } from "@/lib/cerez";

/**
 * Vercel Analytics yalnizca kullanici "Tumunu kabul et" dediginde yuklenir.
 * Saglayici cerezsiz calistigini beyan etse de IP isledigi icin onaya bagliyoruz;
 * cerez politikasindaki beyanla tutarli olmasi acisindan da dogru olan bu.
 */
export default function AnalyticsOnayli() {
  const [izinli, setIzinli] = useState(false);

  useEffect(() => {
    setIzinli(tercihiOku() === "tumu");
    return tercihiDinle((t) => setIzinli(t === "tumu"));
  }, []);

  if (!izinli) return null;
  return <Analytics />;
}
