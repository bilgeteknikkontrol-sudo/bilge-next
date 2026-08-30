"use client";

import Script from "next/script";
import { useCerezTercihi } from "@/lib/cerez";

/**
 * GOOGLE ANALYTICS 4 — cerez onayina bagli.
 *
 * ⚠️ NEDEN VAR: Sitenin PHP surumunde GA4 tum sayfalardaydi. Next.js surumune
 * tasinirken DUSTU ve 2026-08-30'a kadar kimse fark etmedi: 26 Agustos'tan
 * beri hicbir ziyaretci verisi toplanmiyordu. Ustelik Search Console mulku
 * GA4 ile dogrulanmisti; etiket sitede olmayinca o dogrulama da risk altina
 * giriyor (Google dogrulamayi duzenli olarak yeniden kontrol eder).
 *
 * ⚠️ ONAY SART: KVKK ve sitenin kendi cerez politikasi geregi, ziyaretci
 * "Tumunu kabul et" demeden analitik CALISMAZ. Bu yuzden etiket kosulsuz
 * basilmiyor; tercih okunup yalnizca "tumu" ise yukleniyor.
 *
 * `afterInteractive`: etiket sayfanin ilk boyanmasini geciktirmesin — sayfa
 * hizi bir siralama faktoru.
 */
export default function GoogleAnalytics({ id }: { id: string }) {
  const tercih = useCerezTercihi();
  if (!id || tercih !== "tumu") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-kurulum" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
