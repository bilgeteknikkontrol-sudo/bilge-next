import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { KATEGORILER } from "./data";
import { ARTICLES, LOCATIONS } from "./content";

type Sql = NeonQueryFunction<false, boolean>;

async function run(q: Promise<unknown>): Promise<Record<string, unknown>[]> {
  return (await q) as Record<string, unknown>[];
}

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readMin: number;
  keywords: string[];
  lead?: string;
  body: string;
  faq?: { q: string; a: string }[];
  aktif: boolean;
  sira: number;
};

export type Equipment = {
  slug: string;
  ad: string;
  kategori: string;
  standart: string;
  periyot: number;
  periyotNot?: string;
  aktif: boolean;
  sira: number;
};

export type Location = {
  slug: string;
  il: string;
  ilce?: string;
  title: string;
  description: string;
  intro: string;
  hizmetler: string[];
  aktif: boolean;
  sira: number;
};

export type MediaItem = {
  id: number;
  name: string;
  url: string;
  dataUrl: string | null;
  alt: string;
  created: string;
};

export type SiteSettings = {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  logo: string;
  favicon: string;
  phone: string;
  email: string;
  address: string;
  sameAs: string[];
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  ctaTitle: string;
  ctaText: string;
};

let _sql: Sql | null = null;

export function dbUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function isDbOn(): boolean {
  return Boolean(dbUrl());
}

export function sql(): Sql {
  const url = dbUrl();
  if (!url) throw new Error("DATABASE_URL tanimli degil");
  if (!_sql) _sql = neon(url);
  return _sql as Sql;
}

let _schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!isDbOn()) return Promise.resolve();
  if (_schemaReady) return _schemaReady;
  _schemaReady = (async () => {
    const s = sql();
    await run(s`CREATE TABLE IF NOT EXISTS equipment (slug text PRIMARY KEY, ad text, kategori text, standart text, periyot int, periyot_not text, aktif boolean DEFAULT true, sira int DEFAULT 0)`);
    await run(s`CREATE TABLE IF NOT EXISTS locations (slug text PRIMARY KEY, il text, ilce text, title text, description text, intro text, hizmetler jsonb, aktif boolean DEFAULT true, sira int DEFAULT 0)`);
    await run(s`CREATE TABLE IF NOT EXISTS articles (slug text PRIMARY KEY, title text, description text, category text, date text, readmin int, keywords jsonb, lead text, body text, faq jsonb, aktif boolean DEFAULT true, sira int DEFAULT 0)`);
    await run(s`CREATE TABLE IF NOT EXISTS site_settings (id int PRIMARY KEY, data jsonb)`);
    await run(s`CREATE TABLE IF NOT EXISTS site_content (key text PRIMARY KEY, value text)`);
    await run(s`CREATE TABLE IF NOT EXISTS media (id serial PRIMARY KEY, name text, url text, data_url text, alt text, created timestamptz DEFAULT now())`);
    await run(seedIfEmpty(s));
  })().catch((e) => {
    _schemaReady = null;
    throw e;
  });
  return _schemaReady;
}

async function seedIfEmpty(s: Sql) {
  const eq = await run(s`SELECT count(*)::int AS c FROM equipment`);
  if (Number(eq[0].c) === 0) {
    let sira = 0;
    for (const kat of KATEGORILER) {
      for (const e of kat.ekipmanlar) {
        await run(s`INSERT INTO equipment (slug, ad, kategori, standart, periyot, periyot_not, aktif, sira) VALUES (${e.slug}, ${e.ad}, ${kat.baslik}, ${e.standart}, ${e.periyot}, ${e.periyotNot ?? null}, true, ${sira++}) ON CONFLICT (slug) DO NOTHING`);
      }
    }
  }
  const lq = await run(s`SELECT count(*)::int AS c FROM locations`);
  if (Number(lq[0].c) === 0) {
    let sira = 0;
    for (const l of LOCATIONS) {
      await run(s`INSERT INTO locations (slug, il, ilce, title, description, intro, hizmetler, aktif, sira) VALUES (${l.slug}, ${l.il}, ${l.ilce ?? null}, ${l.title}, ${l.description}, ${l.intro}, ${JSON.stringify(l.hizmetler)}::jsonb, true, ${sira++}) ON CONFLICT (slug) DO NOTHING`);
    }
  }
  const aq = await run(s`SELECT count(*)::int AS c FROM articles`);
  if (Number(aq[0].c) === 0) {
    let sira = 0;
    for (const a of ARTICLES) {
      await run(s`INSERT INTO articles (slug, title, description, category, date, readmin, keywords, lead, body, faq, aktif, sira) VALUES (${a.slug}, ${a.title}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}::jsonb, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}::jsonb, true, ${sira++}) ON CONFLICT (slug) DO NOTHING`);
    }
  }
  const sq = await run(s`SELECT count(*)::int AS c FROM site_settings`);
  if (Number(sq[0].c) === 0) {
    await run(s`INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(defaultSettings())}::jsonb) ON CONFLICT (id) DO NOTHING`);
  }
}

export function defaultSettings(): SiteSettings {
  return {
    colors: {
      navy: "#0f172a",
      navy2: "#1e293b",
      blue: "#1d4ed8",
      blueSoft: "#dbeafe",
      accent: "#ea580c",
      accent2: "#10b981",
      amberSoft: "#ffedd5",
      emeraldSoft: "#d1fae5",
      bgsoft: "#f8fafc",
      ink: "#0f172a",
      muted: "#475569",
      line: "#e2e8f0",
      white: "#ffffff",
    },
    fonts: {
      hero: "3.5rem",
      h2: "2.25rem",
      body: "1rem",
      nav: "0.95rem",
    },
    logo: "/icon.svg",
    favicon: "/icon.svg",
    phone: "0212 872 52 04",
    email: "info@bilgeteknikkontrol.com",
    address: "Yakuplu Mah. 65. Sk. No:35 İç Kapı No:4, Beylikdüzü / İstanbul",
    sameAs: ["https://www.linkedin.com/company/bilgeteknikkontrol"],
    heroTitle: "İş Ekipmanınızın Güvenliği, Kanıtlanmış Uzmanlıkla",
    heroSubtitle:
      "Basınçlı kap, kaldırma, elektrik, yangın ve iş makineleri periyodik kontrolünü uluslararası geçerli raporlarla belgeliyoruz.",
    aboutTitle: "2014'ten beri iş güvenliğinin yanında",
    aboutText:
      "Bilge Teknik Kontrol; iş ekipmanlarının periyodik kontrolünde TÜRKAK akreditasyonuyla (AB-0296-M) bağımsız, tarafsız ve yasal olarak geçerli raporlar sunar.",
    ctaTitle: "İş Güvenliğinizi Sıraya Koymayın",
    ctaText:
      "2 dakikada online teklif alın veya yasal sürenizi hesaplayın. TÜRKAK akredite farkıyla tanışın.",
  };
}

// ---------------- EQUIPMENT ----------------
export async function getEquipment(): Promise<Equipment[]> {
  if (!isDbOn()) {
    const list: Equipment[] = [];
    let sira = 0;
    for (const kat of KATEGORILER) {
      for (const e of kat.ekipmanlar) {
        list.push({ slug: e.slug, ad: e.ad, kategori: kat.baslik, standart: e.standart, periyot: e.periyot, periyotNot: e.periyotNot, aktif: true, sira: sira++ });
      }
    }
    return list;
  }
  await ensureSchema();
  const s = sql();
  const rows = await run(s`SELECT * FROM equipment ORDER BY sira, ad`);
  return rows.map(rowToEquipment);
}

export async function getEquipmentBySlug(slug: string): Promise<Equipment | null> {
  if (!isDbOn()) return (await getEquipment()).find((e) => e.slug === slug) ?? null;
  await ensureSchema();
  const rows = await run(sql()`SELECT * FROM equipment WHERE slug = ${slug} LIMIT 1`);
  return rows[0] ? rowToEquipment(rows[0]) : null;
}

export async function saveEquipment(e: Equipment): Promise<void> {
  await ensureSchema();
  const s = sql();
  await run(s`INSERT INTO equipment (slug, ad, kategori, standart, periyot, periyot_not, aktif, sira)
    VALUES (${e.slug}, ${e.ad}, ${e.kategori}, ${e.standart}, ${e.periyot}, ${e.periyotNot ?? null}, ${e.aktif}, ${e.sira})
    ON CONFLICT (slug) DO UPDATE SET ad=${e.ad}, kategori=${e.kategori}, standart=${e.standart}, periyot=${e.periyot}, periyot_not=${e.periyotNot ?? null}, aktif=${e.aktif}, sira=${e.sira}`);
}

export async function deleteEquipment(slug: string): Promise<void> {
  await ensureSchema();
  await run(sql()`DELETE FROM equipment WHERE slug = ${slug}`);
}

function rowToEquipment(r: Record<string, unknown>): Equipment {
  return {
    slug: String(r.slug),
    ad: String(r.ad),
    kategori: String(r.kategori),
    standart: String(r.standart ?? ""),
    periyot: Number(r.periyot ?? 12),
    periyotNot: r.periyot_not ? String(r.periyot_not) : undefined,
    aktif: Boolean(r.aktif ?? true),
    sira: Number(r.sira ?? 0),
  };
}

// ---------------- LOCATIONS ----------------
export async function getLocations(): Promise<Location[]> {
  if (!isDbOn()) {
    return LOCATIONS.map((l, i) => ({ ...l, ilce: l.ilce, hizmetler: l.hizmetler, aktif: true, sira: i }));
  }
  await ensureSchema();
  const rows = await run(sql()`SELECT * FROM locations ORDER BY sira, il`);
  return rows.map(rowToLocation);
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  if (!isDbOn()) return (await getLocations()).find((l) => l.slug === slug) ?? null;
  await ensureSchema();
  const rows = await run(sql()`SELECT * FROM locations WHERE slug = ${slug} LIMIT 1`);
  return rows[0] ? rowToLocation(rows[0]) : null;
}

export async function saveLocation(l: Location): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO locations (slug, il, ilce, title, description, intro, hizmetler, aktif, sira)
    VALUES (${l.slug}, ${l.il}, ${l.ilce ?? null}, ${l.title}, ${l.description}, ${l.intro}, ${JSON.stringify(l.hizmetler)}::jsonb, ${l.aktif}, ${l.sira})
    ON CONFLICT (slug) DO UPDATE SET il=${l.il}, ilce=${l.ilce ?? null}, title=${l.title}, description=${l.description}, intro=${l.intro}, hizmetler=${JSON.stringify(l.hizmetler)}::jsonb, aktif=${l.aktif}, sira=${l.sira}`);
}

export async function deleteLocation(slug: string): Promise<void> {
  await ensureSchema();
  await run(sql()`DELETE FROM locations WHERE slug = ${slug}`);
}

function rowToLocation(r: Record<string, unknown>): Location {
  return {
    slug: String(r.slug),
    il: String(r.il),
    ilce: r.ilce ? String(r.ilce) : undefined,
    title: String(r.title),
    description: String(r.description),
    intro: String(r.intro),
    hizmetler: Array.isArray(r.hizmetler) ? (r.hizmetler as string[]) : [],
    aktif: Boolean(r.aktif ?? true),
    sira: Number(r.sira ?? 0),
  };
}

// ---------------- ARTICLES ----------------
export async function getArticles(onlyActive = false): Promise<Article[]> {
  if (!isDbOn()) {
    return ARTICLES.map((a, i) => ({ ...a, aktif: true, sira: i }));
  }
  await ensureSchema();
  const rows = onlyActive
    ? await run(sql()`SELECT * FROM articles WHERE aktif = true ORDER BY date DESC`)
    : await run(sql()`SELECT * FROM articles ORDER BY sira, date DESC`);
  return rows.map(rowToArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isDbOn()) return (await getArticles()).find((a) => a.slug === slug) ?? null;
  await ensureSchema();
  const rows = await run(sql()`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`);
  return rows[0] ? rowToArticle(rows[0]) : null;
}

export async function saveArticle(a: Article): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO articles (slug, title, description, category, date, readmin, keywords, lead, body, faq, aktif, sira)
    VALUES (${a.slug}, ${a.title}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}::jsonb, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}::jsonb, ${a.aktif}, ${a.sira})
    ON CONFLICT (slug) DO UPDATE SET title=${a.title}, description=${a.description}, category=${a.category}, date=${a.date}, readmin=${a.readMin}, keywords=${JSON.stringify(a.keywords)}::jsonb, lead=${a.lead ?? null}, body=${a.body}, faq=${JSON.stringify(a.faq ?? [])}::jsonb, aktif=${a.aktif}, sira=${a.sira}`);
}

export async function deleteArticle(slug: string): Promise<void> {
  await ensureSchema();
  await run(sql()`DELETE FROM articles WHERE slug = ${slug}`);
}

function rowToArticle(r: Record<string, unknown>): Article {
  return {
    slug: String(r.slug),
    title: String(r.title),
    description: String(r.description),
    category: String(r.category),
    date: String(r.date),
    readMin: Number(r.readmin ?? r.readMin ?? 0),
    keywords: Array.isArray(r.keywords) ? (r.keywords as string[]) : [],
    lead: r.lead ? String(r.lead) : undefined,
    body: String(r.body ?? ""),
    faq: Array.isArray(r.faq) ? (r.faq as { q: string; a: string }[]) : [],
    aktif: Boolean(r.aktif ?? true),
    sira: Number(r.sira ?? 0),
  };
}

// ---------------- SETTINGS ----------------
export async function getSettings(): Promise<SiteSettings> {
  if (!isDbOn()) return defaultSettings();
  await ensureSchema();
  const rows = await run(sql()`SELECT data FROM site_settings WHERE id = 1 LIMIT 1`);
  if (!rows[0]) return defaultSettings();
  return { ...defaultSettings(), ...(rows[0].data as SiteSettings) };
}

export async function saveSettings(s: SiteSettings): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(s)}::jsonb) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(s)}::jsonb`);
}

export async function getContent(key: string): Promise<string | null> {
  if (!isDbOn()) return null;
  await ensureSchema();
  const rows = await run(sql()`SELECT value FROM site_content WHERE key = ${key} LIMIT 1`);
  return rows[0] ? String(rows[0].value) : null;
}

export async function getAllContent(): Promise<{ key: string; value: string }[]> {
  if (!isDbOn()) return [];
  await ensureSchema();
  const rows = await run(sql()`SELECT key, value FROM site_content ORDER BY key`);
  return rows.map((r: Record<string, unknown>) => ({ key: String(r.key), value: String(r.value) }));
}

export async function setContent(key: string, value: string): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO site_content (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = ${value}`);
}

export async function deleteContent(key: string): Promise<void> {
  await ensureSchema();
  await run(sql()`DELETE FROM site_content WHERE key = ${key}`);
}

// ---------------- MEDIA ----------------
export async function getMedia(): Promise<MediaItem[]> {
  if (!isDbOn()) return [];
  await ensureSchema();
  const rows = await run(sql()`SELECT * FROM media ORDER BY created DESC`);
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.id),
    name: String(r.name),
    url: String(r.url ?? ""),
    dataUrl: r.data_url ? String(r.data_url) : null,
    alt: String(r.alt ?? ""),
    created: String(r.created),
  }));
}

export async function saveMedia(m: Omit<MediaItem, "id" | "created">): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO media (name, url, data_url, alt) VALUES (${m.name}, ${m.url}, ${m.dataUrl ?? null}, ${m.alt})`);
}

export async function deleteMedia(id: number): Promise<void> {
  await ensureSchema();
  await run(sql()`DELETE FROM media WHERE id = ${id}`);
}
