import type { MetadataRoute } from "next";
import { ARTICLES, LOCATIONS, ALL_EKIPMAN } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bilgekontrol.com";
  const now = new Date();
  const core = [
    { url: base + "/", lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    { url: base + "/teklif", lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: base + "/hesapla", lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: base + "/portal", lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: base + "/yazilar", lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: base + "/ekipman", lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
  ];
  const articles = ARTICLES.map((a) => ({
    url: `${base}/yazilar/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const locations = LOCATIONS.map((l) => ({
    url: `${base}/bolge/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const equipment = ALL_EKIPMAN.map((e) => ({
    url: `${base}/ekipman/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...core, ...articles, ...locations, ...equipment];
}
