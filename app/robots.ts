import type { MetadataRoute } from "next";

/**
 * ⚠️ `/admin/` de dislaniyor.
 *
 * Onceki halinde yalnizca `/api/` vardi; panel adresleri taranabilir
 * durumdaydi ve `/admin/login` arama sonuclarina cikabilirdi. Sayfanin
 * kendisinde `noindex` var ve `next.config.js` panel altina `X-Robots-Tag`
 * gonderiyor — bu satir ucuncu katman: tarayici botu oraya hic ugramasin.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }],
    sitemap: "https://bilgekontrol.com/sitemap.xml",
    host: "https://bilgekontrol.com",
  };
}
