import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { KATEGORILER } from "./data";
import { ARTICLES, LOCATIONS } from "./content";
import { readCmsState, writeCmsState } from "./store";

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
  /**
   * Yazi gorseli. Panelden yonetilir; Medya Kutuphanesi'ndeki bir gorselin
   * adresi, base64 data URL'i veya harici bir URL olabilir.
   * Bos birakilirsa lib/images.ts icindeki slug eslesmeli varsayilan kullanilir.
   */
  image?: string;
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

type CmsState = {
  articles: Article[];
  equipment: Equipment[];
  locations: Location[];
  settings: SiteSettings;
  content: { key: string; value: string }[];
  media: MediaItem[];
};

function dbUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function isDbOn(): boolean {
  return Boolean(dbUrl());
}

let _sql: Sql | null = null;

export function sql(): Sql {
  const url = dbUrl();
  if (!url) throw new Error("DATABASE_URL tanimli degil");
  if (!_sql) _sql = neon(url);
  return _sql as Sql;
}

let _schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!isDbOn()) return Promise.resolve();
  if (_schemaReady) return _schemaReady;
  _schemaReady = (async () => {
    const s = sql();
    await run(s`CREATE TABLE IF NOT EXISTS equipment (slug text PRIMARY KEY, ad text, kategori text, standart text, periyot int, periyot_not text, aktif boolean DEFAULT true, sira int DEFAULT 0)`);
    await run(s`CREATE TABLE IF NOT EXISTS locations (slug text PRIMARY KEY, il text, ilce text, title text, description text, intro text, hizmetler jsonb, aktif boolean DEFAULT true, sira int DEFAULT 0)`);
    await run(s`CREATE TABLE IF NOT EXISTS articles (slug text PRIMARY KEY, title text, description text, category text, date text, readmin int, keywords jsonb, lead text, body text, faq jsonb, aktif boolean DEFAULT true, sira int DEFAULT 0, image text)`);
    // Onceden olusturulmus kurulumlarda sutun yoksa ekle
    await run(s`ALTER TABLE articles ADD COLUMN IF NOT EXISTS image text`);
    await run(s`CREATE TABLE IF NOT EXISTS site_settings (id int PRIMARY KEY, data jsonb)`);
    await run(s`CREATE TABLE IF NOT EXISTS site_content (key text PRIMARY KEY, value text)`);
    await run(s`CREATE TABLE IF NOT EXISTS media (id serial PRIMARY KEY, name text, url text, data_url text, alt text, created timestamptz DEFAULT now())`);
    await seedIfEmpty(s);
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
      // image: tohum verisinde gorsel yok; slug eslesmeli varsayilan kullanilir.
      await run(s`INSERT INTO articles (slug, title, description, category, date, readmin, keywords, lead, body, faq, aktif, sira, image) VALUES (${a.slug}, ${a.title}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}::jsonb, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}::jsonb, true, ${sira++}, ${null}) ON CONFLICT (slug) DO NOTHING`);
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
      navy: "#241E4E",
      navy2: "#3A3170",
      blue: "#2E5BE8",
      blueSoft: "#dbeafe",
      accent: "#EF7F2D",
      accent2: "#10b981",
      amberSoft: "#ffedd5",
      emeraldSoft: "#d1fae5",
      bgsoft: "#f8fafc",
      ink: "#241F3D",
      muted: "#5B5675",
      line: "#e2e8f0",
      white: "#ffffff",
    },
    fonts: {
      hero: "3.5rem",
      h2: "2.25rem",
      body: "1rem",
      nav: "0.95rem",
    },
    // app/icon.svg (yer tutucu "B") marka logosu eklenirken silindi.
    // Gercek marka dosyalari: public/img/marka/logo.png ve app/favicon.ico
    logo: "/img/marka/logo.png",
    favicon: "/favicon.ico",
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

// ---------------- STATE (Vercel Blob JSON) backend ----------------
let _state: CmsState | null = null;
let _stateTs = 0;
const STATE_TTL = 15000;

function seedState(): CmsState {
  const equipment: Equipment[] = [];
  let sira = 0;
  for (const kat of KATEGORILER) {
    for (const e of kat.ekipmanlar) {
      equipment.push({ slug: e.slug, ad: e.ad, kategori: kat.baslik, standart: e.standart, periyot: e.periyot, periyotNot: e.periyotNot, aktif: true, sira: sira++ });
    }
  }
  return {
    equipment,
    locations: LOCATIONS.map((l, i) => ({ ...l, ilce: l.ilce, hizmetler: l.hizmetler, aktif: true, sira: i })),
    articles: ARTICLES.map((a, i) => ({ ...a, aktif: true, sira: i })),
    settings: defaultSettings(),
    content: [],
    media: [],
  };
}

async function getState(): Promise<CmsState> {
  if (isDbOn()) {
    const [equipment, locations, articles, settings, content, media] = await Promise.all([
      dbGetEquipment(),
      dbGetLocations(),
      dbGetArticles(false),
      dbGetSettings(),
      dbGetAllContent(),
      dbGetMedia(),
    ]);
    return { equipment, locations, articles, settings, content, media };
  }
  const now = Date.now();
  if (!_state || now - _stateTs > STATE_TTL) {
    const fresh = await readCmsState();
    _state = (fresh as CmsState) ?? seedState();
    _stateTs = now;
  }
  return _state;
}

async function setState(st: CmsState): Promise<void> {
  if (isDbOn()) {
    await dbPersist(st);
    return;
  }
  _state = st;
  _stateTs = Date.now();
  await writeCmsState(st);
}

// ---------------- SQL (Postgres) backend ----------------
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
    image: r.image ? String(r.image) : undefined,
  };
}

async function dbGetEquipment(): Promise<Equipment[]> {
  const rows = await run(sql()`SELECT * FROM equipment ORDER BY sira, ad`);
  return rows.map(rowToEquipment);
}

async function dbGetLocations(): Promise<Location[]> {
  const rows = await run(sql()`SELECT * FROM locations ORDER BY sira, il`);
  return rows.map(rowToLocation);
}

async function dbGetArticles(onlyActive: boolean): Promise<Article[]> {
  const rows = onlyActive
    ? await run(sql()`SELECT * FROM articles WHERE aktif = true ORDER BY date DESC`)
    : await run(sql()`SELECT * FROM articles ORDER BY sira, date DESC`);
  return rows.map(rowToArticle);
}

async function dbGetSettings(): Promise<SiteSettings> {
  const rows = await run(sql()`SELECT data FROM site_settings WHERE id = 1 LIMIT 1`);
  if (!rows[0]) return defaultSettings();
  return { ...defaultSettings(), ...(rows[0].data as SiteSettings) };
}

async function dbGetAllContent(): Promise<{ key: string; value: string }[]> {
  const rows = await run(sql()`SELECT key, value FROM site_content ORDER BY key`);
  return rows.map((r) => ({ key: String(r.key), value: String(r.value) }));
}

async function dbGetMedia(): Promise<MediaItem[]> {
  const rows = await run(sql()`SELECT * FROM media ORDER BY created DESC`);
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    url: String(r.url ?? ""),
    dataUrl: r.data_url ? String(r.data_url) : null,
    alt: String(r.alt ?? ""),
    created: String(r.created),
  }));
}

async function dbPersist(st: CmsState): Promise<void> {
  await ensureSchema();
  for (const e of st.equipment) await dbSaveEquipment(e);
  for (const l of st.locations) await dbSaveLocation(l);
  for (const a of st.articles) await dbSaveArticle(a);
  await dbSaveSettings(st.settings);
  for (const c of st.content) await dbSetContent(c.key, c.value);
  for (const m of st.media) await dbSaveMedia(m);
}

async function dbSaveEquipment(e: Equipment): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO equipment (slug, ad, kategori, standart, periyot, periyot_not, aktif, sira)
    VALUES (${e.slug}, ${e.ad}, ${e.kategori}, ${e.standart}, ${e.periyot}, ${e.periyotNot ?? null}, ${e.aktif}, ${e.sira})
    ON CONFLICT (slug) DO UPDATE SET ad=${e.ad}, kategori=${e.kategori}, standart=${e.standart}, periyot=${e.periyot}, periyot_not=${e.periyotNot ?? null}, aktif=${e.aktif}, sira=${e.sira}`);
}

async function dbSaveLocation(l: Location): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO locations (slug, il, ilce, title, description, intro, hizmetler, aktif, sira)
    VALUES (${l.slug}, ${l.il}, ${l.ilce ?? null}, ${l.title}, ${l.description}, ${l.intro}, ${JSON.stringify(l.hizmetler)}::jsonb, ${l.aktif}, ${l.sira})
    ON CONFLICT (slug) DO UPDATE SET il=${l.il}, ilce=${l.ilce ?? null}, title=${l.title}, description=${l.description}, intro=${l.intro}, hizmetler=${JSON.stringify(l.hizmetler)}::jsonb, aktif=${l.aktif}, sira=${l.sira}`);
}

async function dbSaveArticle(a: Article): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO articles (slug, title, description, category, date, readmin, keywords, lead, body, faq, aktif, sira)
    VALUES (${a.slug}, ${a.title}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}::jsonb, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}::jsonb, ${a.aktif}, ${a.sira}, ${a.image ?? null})
    ON CONFLICT (slug) DO UPDATE SET title=${a.title}, description=${a.description}, category=${a.category}, date=${a.date}, readmin=${a.readMin}, keywords=${JSON.stringify(a.keywords)}::jsonb, lead=${a.lead ?? null}, body=${a.body}, faq=${JSON.stringify(a.faq ?? [])}::jsonb, aktif=${a.aktif}, sira=${a.sira}, image=${a.image ?? null}`);
}

async function dbSaveSettings(s: SiteSettings): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(s)}::jsonb) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(s)}::jsonb`);
}

async function dbSetContent(key: string, value: string): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO site_content (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = ${value}`);
}

async function dbSaveMedia(m: Omit<MediaItem, "id" | "created">): Promise<void> {
  await ensureSchema();
  await run(sql()`INSERT INTO media (name, url, data_url, alt) VALUES (${m.name}, ${m.url}, ${m.dataUrl ?? null}, ${m.alt})`);
}

// ---------------- PUBLIC API (backend-agnostic) ----------------
export async function getEquipment(): Promise<Equipment[]> {
  return (await getState()).equipment;
}

export async function getEquipmentBySlug(slug: string): Promise<Equipment | null> {
  const s = await getState();
  return s.equipment.find((e) => e.slug === slug) ?? null;
}

export async function saveEquipment(e: Equipment): Promise<void> {
  const s = await getState();
  const i = s.equipment.findIndex((x) => x.slug === e.slug);
  if (i >= 0) s.equipment[i] = e;
  else s.equipment.push(e);
  await setState(s);
}

export async function deleteEquipment(slug: string): Promise<void> {
  const s = await getState();
  s.equipment = s.equipment.filter((x) => x.slug !== slug);
  await setState(s);
}

export async function getLocations(): Promise<Location[]> {
  return (await getState()).locations;
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const s = await getState();
  return s.locations.find((l) => l.slug === slug) ?? null;
}

export async function saveLocation(l: Location): Promise<void> {
  const s = await getState();
  const i = s.locations.findIndex((x) => x.slug === l.slug);
  if (i >= 0) s.locations[i] = l;
  else s.locations.push(l);
  await setState(s);
}

export async function deleteLocation(slug: string): Promise<void> {
  const s = await getState();
  s.locations = s.locations.filter((x) => x.slug !== slug);
  await setState(s);
}

export async function getArticles(onlyActive = false): Promise<Article[]> {
  const s = await getState();
  return onlyActive ? s.articles.filter((a) => a.aktif) : s.articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const s = await getState();
  return s.articles.find((a) => a.slug === slug) ?? null;
}

export async function saveArticle(a: Article): Promise<void> {
  const s = await getState();
  const i = s.articles.findIndex((x) => x.slug === a.slug);
  if (i >= 0) s.articles[i] = a;
  else s.articles.push(a);
  await setState(s);
}

export async function deleteArticle(slug: string): Promise<void> {
  const s = await getState();
  s.articles = s.articles.filter((x) => x.slug !== slug);
  await setState(s);
}

/**
 * Marka paletine gecis.
 *
 * Ilk palet slate tonlariydi (navy #0f172a = neredeyse siyah) ve logonun kendi
 * laciverti (#31285d) ile hic uyusmuyordu. Palet logodan turetilen indigo
 * tonlariyla degistirildi.
 *
 * Ayarlar CMS'te KALICI saklandigi icin defaultSettings()'i degistirmek yeterli
 * degil; kayitli deger onu eziyor. Bu yuzden: kayitli renk ESKI VARSAYILANLA
 * birebir ayniysa (yani kullanici hic elle degistirmemisse) yenisi uygulanir.
 * Kullanici panelden kendi rengini secmisse ona dokunulmaz.
 */
const ESKI_PALET: Record<string, string> = {
  navy: "#241E4E",
  navy2: "#3A3170",
  ink: "#241F3D",
  accent: "#EF7F2D",
  blue: "#2E5BE8",
  muted: "#5B5675",
};

const YENI_PALET: Record<string, string> = {
  navy: "#241E4E",   // logo laciverti (#31285d) ailesinden, koyu indigo
  navy2: "#3A3170",
  ink: "#241F3D",
  accent: "#EF7F2D", // logonun turuncusu, birebir
  blue: "#2E5BE8",   // eylem rengi; indigo zeminden ayrilsin diye bir tik acildi
  muted: "#5B5675",
};

function paletiGuncelle(s: SiteSettings): SiteSettings {
  let degisti = false;
  const colors = { ...s.colors };
  for (const [k, eski] of Object.entries(ESKI_PALET)) {
    if (colors[k]?.toLowerCase() === eski.toLowerCase()) {
      colors[k] = YENI_PALET[k];
      degisti = true;
    }
  }
  return degisti ? { ...s, colors } : s;
}

export async function getSettings(): Promise<SiteSettings> {
  return paletiGuncelle((await getState()).settings);
}

export async function saveSettings(s: SiteSettings): Promise<void> {
  const st = await getState();
  st.settings = s;
  await setState(st);
}

export async function getContent(key: string): Promise<string | null> {
  const s = await getState();
  return s.content.find((c) => c.key === key)?.value ?? null;
}

export async function getAllContent(): Promise<{ key: string; value: string }[]> {
  return (await getState()).content;
}

export async function setContent(key: string, value: string): Promise<void> {
  const s = await getState();
  const i = s.content.findIndex((c) => c.key === key);
  if (i >= 0) s.content[i].value = value;
  else s.content.push({ key, value });
  await setState(s);
}

export async function deleteContent(key: string): Promise<void> {
  const s = await getState();
  s.content = s.content.filter((c) => c.key !== key);
  await setState(s);
}

export async function getMedia(): Promise<MediaItem[]> {
  return (await getState()).media;
}

export async function saveMedia(m: Omit<MediaItem, "id" | "created">): Promise<void> {
  const s = await getState();
  const id = s.media.reduce((mx, x) => Math.max(mx, x.id), 0) + 1;
  s.media.push({ ...m, id, created: new Date().toISOString() });
  await setState(s);
}

export async function deleteMedia(id: number): Promise<void> {
  const s = await getState();
  s.media = s.media.filter((x) => x.id !== id);
  await setState(s);
}
