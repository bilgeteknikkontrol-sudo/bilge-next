"use client";

import { Analytics } from "@vercel/analytics/react";
import { useCerezTercihi } from "@/lib/cerez";

/**
 * Vercel Analytics yalnizca kullanici "Tumunu kabul et" dediginde yuklenir.
 * Saglayici cerezsiz calistigini beyan etse de IP isledigi icin onaya bagliyoruz;
 * cerez politikasindaki beyanla tutarli olmasi acisindan da dogru olan bu.
 */
export default function AnalyticsOnayli() {
  const tercih = useCerezTercihi();
  if (tercih !== "tumu") return null;
  return <Analytics />;
}
