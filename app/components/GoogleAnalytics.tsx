"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useCerezTercihi } from "@/lib/cerez";

/**
 * GOOGLE ETIKETI (GA4) — Consent Mode v2, GELISMIS mod.
 *
 * ⚠️ NEDEN VAR: Sitenin PHP surumunde GA4 tum sayfalardaydi. Next.js surumune
 * tasinirken DUSTU ve 2026-08-30'a kadar kimse fark etmedi: 26 Agustos'tan
 * beri hicbir ziyaretci verisi toplanmiyordu.
 *
 * ⚠️ 2026-09-02'DE DEGISEN SEY. Once etiket ONAY VERILMEDIKCE HIC
 * YUKLENMIYORDU. Bu, olcumu tamamen kapatiyordu: onay vermeyen ziyaretci
 * Google icin hic var olmuyordu. Reklam verilecegi icin sorun buyudu —
 * Google Ads, donusmeyen tiklamayi da donuseni de goremezse teklif
 * stratejilerini ogretemezsiniz.
 *
 * Yeni durum (Consent Mode v2, gelismis):
 *   - Etiket HER sayfada yukleniyor, ama once TUM izinler "denied"
 *     varsayilaniyla baslatiliyor.
 *   - Onay verilmediginde CEREZ YAZILMAZ; yalnizca kimlik tasimayan
 *     ("cookieless") bir ping gider. Google donusumleri bundan modeller.
 *   - Ziyaretci "Tumunu kabul et" derse `consent update` ile izinler
 *     "granted" olur ve normal olcum baslar.
 *
 * ⚠️ GIZLILIK DENGESI — bilerek verilmis bir karar: gelismis modda, onay
 * verilmese bile Google'a bir istek gider (cerez yok, kimlik saklanmaz; IP ve
 * sayfa adresi ulasir). Google bunu ePrivacy acisindan uygun sayiyor cunku
 * cihazda saklama yok. Kullaniciya anlatildi ve bu mod istendi. Cerez
 * politikasi metninin bunu ANLATMASI gerekir; degistirilirse orasi da
 * guncellenmeli.
 *
 * ⚠️ SIRA ONEMLI: izin varsayilanlari gtag.js YUKLENMEDEN once dataLayer'a
 * girmeli. Bu yuzden varsayilanlar `beforeInteractive` (kok duzende calisir),
 * kutuphanenin kendisi `afterInteractive`. Ters sirada calisirsa varsayilan
 * gec kalir ve ilk sayfa goruntulemesi izinsiz olcuulmus olur.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics({ id }: { id: string }) {
  const tercih = useCerezTercihi();

  // Tercih degistiginde (banner'daki iki dugme) izinleri guncelle.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const izin = tercih === "tumu" ? "granted" : "denied";
    window.gtag("consent", "update", {
      ad_storage: izin,
      ad_user_data: izin,
      ad_personalization: izin,
      analytics_storage: izin,
    });
  }, [tercih]);

  if (!id) return null;

  return (
    <>
      <Script id="gtag-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="gtag-kurulum" strategy="afterInteractive">
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
