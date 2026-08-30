import { KATEGORILER } from "./data";
import { ARTICLES, LOCATIONS } from "./content";
import { readCmsState, writeCmsState } from "./store";
import { isDbOn, isMysql, run, sql, type Sql } from "./db";

// Baglanti katmani `lib/db.ts`'e tasindi (bkz. oradaki not). Cagri yerlerinin
// `@/lib/cms`'ten almaya devam edebilmesi icin buradan yeniden ihrac ediliyor.
export { isDbOn, isMysql, sql };

export type Article = {
  slug: string;
  title: string;
  /** Arama sonucu basligi (bos ise `title`). bkz. lib/seo-baslik.ts */
  seoTitle?: string;
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
  /**
   * Hizmet gorseli. Bos ise `lib/images.ts` icindeki slug eslesmeli varsayilan
   * gorsel kullanilir.
   *
   * ⚠️ Onceden ekipmanda gorsel alani HIC YOKTU; gorseller yalnizca kodda
   * (EKIPMAN_GORSEL) tanimliydi. Panelden yeni bir hizmet eklendiginde o
   * hizmetin gorseli olmuyordu ve degistirmenin tek yolu kod dagitimiydi.
   */
  image?: string;
  /**
   * Hizmet sayfasinin METNI — giris, govde ve SSS.
   *
   * ⚠️ Bunlar da onceden yalnizca kodda (`lib/ekipman-icerik.ts`) duruyordu.
   * Hizmet sayfasinda sayfa dolusu metin vardi ama panelde yalnizca ad,
   * kategori, standart ve periyot alanlari goruluyordu; kullanici "bu yazilari
   * nerede duzenleyebilirim" diye sordu ve duzenleyebilecegi bir yer yoktu.
   *
   * Bos birakilirsa koddaki varsayilan icerik kullanilmaya devam eder.
   */
  lead?: string;
  body?: string;
  faq?: { q: string; a: string }[];
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

let _schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!isDbOn()) return Promise.resolve();
  if (_schemaReady) return _schemaReady;
  _schemaReady = (async () => {
    const s = sql();
    if (isMysql()) {
      /**
       * MySQL semasi. Postgres'ten farklari:
       *  - TEXT sutunu anahtar olamaz (uzunluk ister) -> VARCHAR(191)
       *    191: utf8mb4'te dizin anahtari sinirina (767 bayt) sigan en buyuk deger.
       *  - jsonb -> JSON
       *  - serial -> INT AUTO_INCREMENT
       *  - timestamptz DEFAULT now() -> TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       *  - `lead` ve `key` MySQL'de AYRILMIS KELIME; ters tirnak sart.
       */
      await run(s`CREATE TABLE IF NOT EXISTS equipment (slug VARCHAR(191) PRIMARY KEY, ad TEXT, kategori TEXT, standart TEXT, periyot INT, periyot_not TEXT, aktif TINYINT(1) DEFAULT 1, sira INT DEFAULT 0)`);
      await run(s`CREATE TABLE IF NOT EXISTS locations (slug VARCHAR(191) PRIMARY KEY, il TEXT, ilce TEXT, title TEXT, description TEXT, intro TEXT, hizmetler JSON, aktif TINYINT(1) DEFAULT 1, sira INT DEFAULT 0)`);
      await run(s`CREATE TABLE IF NOT EXISTS articles (slug VARCHAR(191) PRIMARY KEY, title TEXT, description TEXT, category TEXT, date TEXT, readmin INT, keywords JSON, \`lead\` TEXT, body LONGTEXT, faq JSON, aktif TINYINT(1) DEFAULT 1, sira INT DEFAULT 0, image LONGTEXT)`);
      await run(s`CREATE TABLE IF NOT EXISTS site_settings (id INT PRIMARY KEY, data JSON)`);
      await run(s`CREATE TABLE IF NOT EXISTS site_content (\`key\` VARCHAR(191) PRIMARY KEY, value LONGTEXT)`);
      await run(s`CREATE TABLE IF NOT EXISTS media (id INT AUTO_INCREMENT PRIMARY KEY, name TEXT, url LONGTEXT, data_url LONGTEXT, alt TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      /**
       * ⚠️ MySQL'de "ADD COLUMN IF NOT EXISTS" YOK; ikinci calismada
       * "Duplicate column name" hatasi normaldir ve yutuluyor.
       * (Ayni desen CREATE INDEX icin de kullaniliyor.)
       * Sutun sonradan eklendi: tablo zaten olusmus kurulumlarda CREATE TABLE
       * bir daha calismadigi icin ALTER sart.
       */
      await run(s`ALTER TABLE articles ADD COLUMN seo_title TEXT`).catch(() => {});
      await run(s`ALTER TABLE equipment ADD COLUMN image LONGTEXT`).catch(() => {});
      await run(s`ALTER TABLE equipment ADD COLUMN \`lead\` TEXT`).catch(() => {});
      await run(s`ALTER TABLE equipment ADD COLUMN body LONGTEXT`).catch(() => {});
      await run(s`ALTER TABLE equipment ADD COLUMN faq JSON`).catch(() => {});
    } else {
      await run(s`CREATE TABLE IF NOT EXISTS equipment (slug text PRIMARY KEY, ad text, kategori text, standart text, periyot int, periyot_not text, aktif boolean DEFAULT true, sira int DEFAULT 0)`);
      await run(s`CREATE TABLE IF NOT EXISTS locations (slug text PRIMARY KEY, il text, ilce text, title text, description text, intro text, hizmetler jsonb, aktif boolean DEFAULT true, sira int DEFAULT 0)`);
      await run(s`CREATE TABLE IF NOT EXISTS articles (slug text PRIMARY KEY, title text, description text, category text, date text, readmin int, keywords jsonb, lead text, body text, faq jsonb, aktif boolean DEFAULT true, sira int DEFAULT 0, image text)`);
      // Onceden olusturulmus kurulumlarda sutun yoksa ekle
      await run(s`ALTER TABLE articles ADD COLUMN IF NOT EXISTS image text`);
      await run(s`CREATE TABLE IF NOT EXISTS site_settings (id int PRIMARY KEY, data jsonb)`);
      await run(s`CREATE TABLE IF NOT EXISTS site_content (key text PRIMARY KEY, value text)`);
      await run(s`CREATE TABLE IF NOT EXISTS media (id serial PRIMARY KEY, name text, url text, data_url text, alt text, created timestamptz DEFAULT now())`);
      await run(s`ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_title text`);
      await run(s`ALTER TABLE equipment ADD COLUMN IF NOT EXISTS image text`);
      await run(s`ALTER TABLE equipment ADD COLUMN IF NOT EXISTS lead text`);
      await run(s`ALTER TABLE equipment ADD COLUMN IF NOT EXISTS body text`);
      await run(s`ALTER TABLE equipment ADD COLUMN IF NOT EXISTS faq jsonb`);
    }
    await seedIfEmpty(s);
  })().catch((e) => {
    _schemaReady = null;
    throw e;
  });
  return _schemaReady;
}

async function seedIfEmpty(s: Sql) {
  const eq = await run(s`SELECT count(*) AS c FROM equipment`);
  if (Number(eq[0].c) === 0) {
    let sira = 0;
    for (const kat of KATEGORILER) {
      for (const e of kat.ekipmanlar) {
        await run(
          isMysql()
            ? s`INSERT IGNORE INTO equipment (slug, ad, kategori, standart, periyot, periyot_not, aktif, sira) VALUES (${e.slug}, ${e.ad}, ${kat.baslik}, ${e.standart}, ${e.periyot}, ${e.periyotNot ?? null}, 1, ${sira++})`
            : s`INSERT INTO equipment (slug, ad, kategori, standart, periyot, periyot_not, aktif, sira) VALUES (${e.slug}, ${e.ad}, ${kat.baslik}, ${e.standart}, ${e.periyot}, ${e.periyotNot ?? null}, true, ${sira++}) ON CONFLICT (slug) DO NOTHING`
        );
      }
    }
  }
  const lq = await run(s`SELECT count(*) AS c FROM locations`);
  if (Number(lq[0].c) === 0) {
    let sira = 0;
    for (const l of LOCATIONS) {
      await run(
        isMysql()
          ? s`INSERT IGNORE INTO locations (slug, il, ilce, title, description, intro, hizmetler, aktif, sira) VALUES (${l.slug}, ${l.il}, ${l.ilce ?? null}, ${l.title}, ${l.description}, ${l.intro}, ${JSON.stringify(l.hizmetler)}, 1, ${sira++})`
          : s`INSERT INTO locations (slug, il, ilce, title, description, intro, hizmetler, aktif, sira) VALUES (${l.slug}, ${l.il}, ${l.ilce ?? null}, ${l.title}, ${l.description}, ${l.intro}, ${JSON.stringify(l.hizmetler)}::jsonb, true, ${sira++}) ON CONFLICT (slug) DO NOTHING`
      );
    }
  }
  const aq = await run(s`SELECT count(*) AS c FROM articles`);
  if (Number(aq[0].c) === 0) {
    let sira = 0;
    for (const a of ARTICLES) {
      // image: tohum verisinde gorsel yok; slug eslesmeli varsayilan kullanilir.
      await run(
        isMysql()
          ? s`INSERT IGNORE INTO articles (slug, title, description, category, date, readmin, keywords, \`lead\`, body, faq, aktif, sira, image) VALUES (${a.slug}, ${a.title}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}, 1, ${sira++}, ${null})`
          : s`INSERT INTO articles (slug, title, description, category, date, readmin, keywords, lead, body, faq, aktif, sira, image) VALUES (${a.slug}, ${a.title}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}::jsonb, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}::jsonb, true, ${sira++}, ${null}) ON CONFLICT (slug) DO NOTHING`
      );
    }
  }
  const sq = await run(s`SELECT count(*) AS c FROM site_settings`);
  if (Number(sq[0].c) === 0) {
    await run(
      isMysql()
        ? s`INSERT IGNORE INTO site_settings (id, data) VALUES (1, ${JSON.stringify(defaultSettings())})`
        : s`INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(defaultSettings())}::jsonb) ON CONFLICT (id) DO NOTHING`
    );
  }
}

export function defaultSettings(): SiteSettings {
  return {
    // v4 — kurumsal mavi + turuncu vurgu. Degerler app/globals.css @theme ile
    // aynidir; birini degistirirken digerini de guncelle.
    colors: {
      navy: "#0B2A4A",
      navy2: "#14406E",
      blue: "#0F5AA8",
      blueSoft: "#E4EEF9",
      accent: "#EF7F2D",
      accent2: "#B2540A",
      amberSoft: "#E4EEF9",
      emeraldSoft: "#E4EEF9",
      bgsoft: "#F5F8FC",
      ink: "#10202F",
      muted: "#566B7E",
      line: "#DFE7EF",
      white: "#ffffff",
      // Koyu zemin (navy gradyanli kartlar, footer) uzerindeki metin. Eskiden
      // 16 dosyada elle yazilmis sabit renklerdi (#c7d6f0 vb.) ve panelden
      // degistirilemiyordu; artik paletin parcasi.
      onNavy: "#C3D6EA",
      onNavyDim: "#93AECB",
      // Bolge renkleri: genel paletten bagimsiz, panelden tek tek ayarlanir.
      headerBg: "#FFFFFF",
      headerTopBg: "#0B2A4A",
      footerBg: "#0B2A4A",
      buttonBg: "#0F5AA8",
      heroFrom: "#FFFFFF",
      heroTo: "#EDF3FA",
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
    // ⚠️ Yalnizca SOKAK kismi ve gorunur metinle AYNI yazim. Onceden burada
    // ", Beylikdüzü / İstanbul" da vardi ve bosluklar farkliydi; sema ilce/il'i
    // zaten ayri alanlarda yaziyor, yani ikisi tekrar ediyor ve adres sitede iki
    // farkli sekilde gorunuyordu. Bkz. lib/site-data.ts semaSokakAdresi().
    address: "Yakuplu Mah. 65. Sk. No: 35 İç Kapı No: 4",
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

/**
 * CMS durumunun bellekte tutulma suresi.
 *
 * ⚠️ Onceden 15 saniyeydi ve BU, Vercel Blob kotasinin dolup deponun askiya
 * alinmasinin muhtemel sebebi. Sitede 18 sayfa CMS'i okuyor ve 9'u
 * force-dynamic (onbelleksiz). Her ziyaretci, onbellek 15 saniyede bir
 * bayatladigi icin yeni bir blob okumasi tetikliyordu; her okuma da iki
 * islem (list + get). Google taramasi ve normal trafik eklenince ucretsiz
 * kotanin dolmasi kacinilmazdi. Depo yeniden acilsa bile ayni yere gelirdi.
 *
 * 5 dakika: okuma sayisi ~20 kat azaliyor. Panelden kaydeden kisi kendi
 * degisikligini ANINDA goruyor (setState bellegi hemen tazeliyor ve
 * revalidatePath sayfayi yeniden uretiyor); diger sunucu ornekleri en gec
 * bu sure icinde yetisiyor.
 */
const STATE_TTL = 5 * 60 * 1000;

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
    /**
     * ⚠️ OKUMADAN ONCE SEMA.
     *
     * `ensureSchema()` yalnizca YAZMA yolunda (dbPersist) cagriliyordu. Bos bir
     * veritabaniyla ilk acilista okuma once geldigi icin site
     * "Table '...equipment' doesn't exist" ile duser — Hostinger'da ilk derleme
     * tam olarak boyle patladi. Sema kurulumu tek seferlik ve sonucu
     * onbellekleniyor, bu yuzden her okumada maliyeti yok.
     */
    /**
     * ⚠️ VERITABANI HATASI SITEYI OLDURMEZ.
     *
     * Eskiden buradaki her hata dogrudan yukari firliyordu. Sonucu: derleme
     * sirasinda veritabani bos ya da erisilemez oldugunda `next build`
     * "Error occurred prerendering page" ile TAMAMEN dusuyor ve ortada
     * yayinlanacak hicbir sey kalmiyordu. Bir icerik deposunun gecici sorunu
     * sitenin hic var olmamasina yol acmamali.
     *
     * Artik kod icindeki varsayilanlara duseriyoruz: site ayakta kaliyor,
     * ISR bir sonraki tazelemede (en gec 5 dk) gercek veriyi cekiyor.
     * Sessiz kalmiyor: sunucu gunlugune yaziliyor ve panelin tepesindeki
     * depo uyarisi (bkz. store.ts depoDurumu) kirmizi yaniyor.
     */
    try {
      await ensureSchema();
      const [equipment, locations, articles, settings, content, media] = await Promise.all([
        dbGetEquipment(),
        dbGetLocations(),
        dbGetArticles(false),
        dbGetSettings(),
        dbGetAllContent(),
        dbGetMedia(),
      ]);
      return { equipment, locations, articles, settings, content, media };
    } catch (e) {
      console.error(
        "[CMS] Veritabani okunamadi — kod icindeki varsayilan icerik kullaniliyor.",
        e instanceof Error ? e.message : e
      );
      return seedState();
    }
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
/**
 * JSON sutununu diziye cevirir.
 *
 * Surucuye gore JSON sutunu ya cozulmus nesne ya da dize olarak geliyor
 * (mysql2 vs neon, sutun tipi JSON vs TEXT). Onceki kod yalnizca
 * Array.isArray kontrol ediyordu; dize gelen durumda sessizce BOS DIZI
 * donuyordu — yani anahtar kelimeler, SSS ve hizmet listeleri kaybolurdu.
 */
function jsonDizi<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (typeof v === "string" && v.trim()) {
    try {
      const c = JSON.parse(v);
      return Array.isArray(c) ? (c as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
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
    image: r.image ? String(r.image) : undefined,
    lead: r.lead ? String(r.lead) : undefined,
    body: r.body ? String(r.body) : undefined,
    faq: jsonDizi<{ q: string; a: string }>(r.faq),
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
    hizmetler: jsonDizi<string>(r.hizmetler),
    aktif: Boolean(r.aktif ?? true),
    sira: Number(r.sira ?? 0),
  };
}

function rowToArticle(r: Record<string, unknown>): Article {
  return {
    slug: String(r.slug),
    title: String(r.title),
    seoTitle: r.seo_title ? String(r.seo_title) : undefined,
    description: String(r.description),
    category: String(r.category),
    date: String(r.date),
    readMin: Number(r.readmin ?? r.readMin ?? 0),
    keywords: jsonDizi<string>(r.keywords),
    lead: r.lead ? String(r.lead) : undefined,
    body: String(r.body ?? ""),
    faq: jsonDizi<{ q: string; a: string }>(r.faq),
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
  /**
   * ⚠️ `key` MySQL'de AYRILMIS KELIME — ters tirnaksiz yazilirsa sozdizimi
   * hatasi verir. Sema ve yazma sorgularinda bu zaten dusunulmustu, okuma
   * sorgusunda atlanmisti. Postgres'te ters tirnak gecersiz oldugu icin iki
   * surum ayri duruyor.
   */
  const rows = isMysql()
    ? await run(sql()`SELECT \`key\`, value FROM site_content ORDER BY \`key\``)
    : await run(sql()`SELECT key, value FROM site_content ORDER BY key`);
  return rows.map((r) => ({ key: String(r.key), value: String(r.value) }));
}

/**
 * ⚠️ `data_url` BILEREK secilmiyor.
 *
 * Onceden `SELECT *` yapiliyordu; yuklenen her gorselin base64 govdesi CMS
 * durumuna giriyor ve durum HER okundugunda (her sunucu ornegi, en gec 5
 * dakikada bir, ayrica her derlemede 46 sayfa icin) veritabanindan bastan
 * cekiliyordu. Birkac fotograf bunu megabaytlarca gereksiz aktarima cevirir.
 * Gorselin kendisi artik /api/gorsel/<id> ile, yalnizca istendiginde ve tek
 * satir okunarak servis ediliyor.
 */
async function dbGetMedia(): Promise<MediaItem[]> {
  const rows = await run(sql()`SELECT id, name, url, alt, created FROM media ORDER BY created DESC`);
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    url: String(r.url ?? ""),
    dataUrl: null,
    alt: String(r.alt ?? ""),
    created: String(r.created),
  }));
}

/**
 * Tek bir gorselin ham govdesi. Yalnizca /api/gorsel/<id> kullanir.
 * Liste sorgusu bu sutunu hic okumadigi icin buyuk veri sayfa uretimine
 * hic girmiyor.
 */
export async function getMediaBytes(
  id: number
): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!isDbOn()) return null;
  await ensureSchema();
  const rows = await run(sql()`SELECT data_url FROM media WHERE id = ${id} LIMIT 1`);
  const ham = rows.length ? String(rows[0].data_url ?? "") : "";
  // `s` (dotAll) bayragi projenin TS hedefinde yok; [\s\S] ayni isi goruyor.
  const m = /^data:([^;,]+);base64,([\s\S]*)$/.exec(ham);
  if (!m) return null;
  return { mime: m[1], bytes: Buffer.from(m[2], "base64") };
}

async function dbPersist(st: CmsState): Promise<void> {
  await ensureSchema();
  for (const e of st.equipment) await dbSaveEquipment(e);
  for (const l of st.locations) await dbSaveLocation(l);
  for (const a of st.articles) await dbSaveArticle(a);
  await dbSaveSettings(st.settings);
  for (const c of st.content) await dbSetContent(c.key, c.value);
  /**
   * ⚠️ MEDYA BURADA YAZILMIYOR — ve bu bir eksik degil, bir HATA DUZELTMESI.
   *
   * Onceden burada `for (const m of st.media) await dbSaveMedia(m)` vardi.
   * `dbSaveMedia` duz bir INSERT ve `media.id` AUTO_INCREMENT; yani upsert
   * degil. `setState` panelde YAPILAN HER KAYITTA cagrildigi icin (ekipman,
   * yazi, ayar, blok...) tum medya tablosu her seferinde bastan ekleniyordu:
   * 3 gorsel varken bir ayar kaydetmek 3 kopya daha yaratiyordu ve tablo
   * katlanarak buyuyordu. Medyanin kendi ekleme/silme yolu var (saveMedia /
   * deleteMedia), toplu yazmada isi yok.
   */
}

async function dbSaveEquipment(e: Equipment): Promise<void> {
  await ensureSchema();
  const q = sql();
  await run(
    isMysql()
      ? q`INSERT INTO equipment (slug, ad, kategori, standart, periyot, periyot_not, aktif, sira, image, \`lead\`, body, faq)
          VALUES (${e.slug}, ${e.ad}, ${e.kategori}, ${e.standart}, ${e.periyot}, ${e.periyotNot ?? null}, ${e.aktif}, ${e.sira}, ${e.image ?? null}, ${e.lead ?? null}, ${e.body ?? null}, ${JSON.stringify(e.faq ?? [])})
          ON DUPLICATE KEY UPDATE ad=${e.ad}, kategori=${e.kategori}, standart=${e.standart}, periyot=${e.periyot}, periyot_not=${e.periyotNot ?? null}, aktif=${e.aktif}, sira=${e.sira}, image=${e.image ?? null}, \`lead\`=${e.lead ?? null}, body=${e.body ?? null}, faq=${JSON.stringify(e.faq ?? [])}`
      : q`INSERT INTO equipment (slug, ad, kategori, standart, periyot, periyot_not, aktif, sira, image, lead, body, faq)
          VALUES (${e.slug}, ${e.ad}, ${e.kategori}, ${e.standart}, ${e.periyot}, ${e.periyotNot ?? null}, ${e.aktif}, ${e.sira}, ${e.image ?? null}, ${e.lead ?? null}, ${e.body ?? null}, ${JSON.stringify(e.faq ?? [])}::jsonb)
          ON CONFLICT (slug) DO UPDATE SET ad=${e.ad}, kategori=${e.kategori}, standart=${e.standart}, periyot=${e.periyot}, periyot_not=${e.periyotNot ?? null}, aktif=${e.aktif}, sira=${e.sira}, image=${e.image ?? null}, lead=${e.lead ?? null}, body=${e.body ?? null}, faq=${JSON.stringify(e.faq ?? [])}::jsonb`
  );
}

async function dbSaveLocation(l: Location): Promise<void> {
  await ensureSchema();
  const q = sql();
  await run(
    isMysql()
      ? q`INSERT INTO locations (slug, il, ilce, title, description, intro, hizmetler, aktif, sira)
          VALUES (${l.slug}, ${l.il}, ${l.ilce ?? null}, ${l.title}, ${l.description}, ${l.intro}, ${JSON.stringify(l.hizmetler)}, ${l.aktif}, ${l.sira})
          ON DUPLICATE KEY UPDATE il=${l.il}, ilce=${l.ilce ?? null}, title=${l.title}, description=${l.description}, intro=${l.intro}, hizmetler=${JSON.stringify(l.hizmetler)}, aktif=${l.aktif}, sira=${l.sira}`
      : q`INSERT INTO locations (slug, il, ilce, title, description, intro, hizmetler, aktif, sira)
          VALUES (${l.slug}, ${l.il}, ${l.ilce ?? null}, ${l.title}, ${l.description}, ${l.intro}, ${JSON.stringify(l.hizmetler)}::jsonb, ${l.aktif}, ${l.sira})
          ON CONFLICT (slug) DO UPDATE SET il=${l.il}, ilce=${l.ilce ?? null}, title=${l.title}, description=${l.description}, intro=${l.intro}, hizmetler=${JSON.stringify(l.hizmetler)}::jsonb, aktif=${l.aktif}, sira=${l.sira}`
  );
}

async function dbSaveArticle(a: Article): Promise<void> {
  await ensureSchema();
  const q = sql();
  await run(
    isMysql()
      ? q`INSERT INTO articles (slug, title, seo_title, description, category, date, readmin, keywords, \`lead\`, body, faq, aktif, sira, image)
          VALUES (${a.slug}, ${a.title}, ${a.seoTitle ?? null}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}, ${a.aktif}, ${a.sira}, ${a.image ?? null})
          ON DUPLICATE KEY UPDATE title=${a.title}, seo_title=${a.seoTitle ?? null}, description=${a.description}, category=${a.category}, date=${a.date}, readmin=${a.readMin}, keywords=${JSON.stringify(a.keywords)}, \`lead\`=${a.lead ?? null}, body=${a.body}, faq=${JSON.stringify(a.faq ?? [])}, aktif=${a.aktif}, sira=${a.sira}, image=${a.image ?? null}`
      : q`INSERT INTO articles (slug, title, seo_title, description, category, date, readmin, keywords, lead, body, faq, aktif, sira, image)
          VALUES (${a.slug}, ${a.title}, ${a.seoTitle ?? null}, ${a.description}, ${a.category}, ${a.date}, ${a.readMin}, ${JSON.stringify(a.keywords)}::jsonb, ${a.lead ?? null}, ${a.body}, ${JSON.stringify(a.faq ?? [])}::jsonb, ${a.aktif}, ${a.sira}, ${a.image ?? null})
          ON CONFLICT (slug) DO UPDATE SET title=${a.title}, seo_title=${a.seoTitle ?? null}, description=${a.description}, category=${a.category}, date=${a.date}, readmin=${a.readMin}, keywords=${JSON.stringify(a.keywords)}::jsonb, lead=${a.lead ?? null}, body=${a.body}, faq=${JSON.stringify(a.faq ?? [])}::jsonb, aktif=${a.aktif}, sira=${a.sira}, image=${a.image ?? null}`
  );
}

async function dbSaveSettings(s: SiteSettings): Promise<void> {
  await ensureSchema();
  const q = sql();
  await run(
    isMysql()
      ? q`INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(s)}) ON DUPLICATE KEY UPDATE data = ${JSON.stringify(s)}`
      : q`INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(s)}::jsonb) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(s)}::jsonb`
  );
}

async function dbSetContent(key: string, value: string): Promise<void> {
  await ensureSchema();
  const q = sql();
  await run(
    isMysql()
      ? q`INSERT INTO site_content (\`key\`, value) VALUES (${key}, ${value}) ON DUPLICATE KEY UPDATE value = ${value}`
      : q`INSERT INTO site_content (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = ${value}`
  );
}

/**
 * Medyayi ekler ve olusan id'yi doner.
 *
 * ⚠️ MySQL'de `LAST_INSERT_ID()` KULLANILMIYOR: o deger BAGLANTIYA ozeldir,
 * havuzdan (connectionLimit 2) sonraki sorgu baska bir baglantiya dusebilir ve
 * yanlis/sifir id doner. Bunun yerine en buyuk id okunuyor.
 */
async function dbSaveMedia(m: Omit<MediaItem, "id" | "created">): Promise<number> {
  await ensureSchema();
  const s = sql();
  if (isMysql()) {
    await run(s`INSERT INTO media (name, url, data_url, alt) VALUES (${m.name}, ${m.url}, ${m.dataUrl ?? null}, ${m.alt})`);
    const r = await run(s`SELECT id FROM media ORDER BY id DESC LIMIT 1`);
    return r.length ? Number(r[0].id) : 0;
  }
  const r = await run(
    s`INSERT INTO media (name, url, data_url, alt) VALUES (${m.name}, ${m.url}, ${m.dataUrl ?? null}, ${m.alt}) RETURNING id`
  );
  return r.length ? Number(r[0].id) : 0;
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
 * Palet gecisleri.
 *
 * v1 slate tonlariydi (navy #0f172a = neredeyse siyah), v2 logodan turetilen
 * indigo/mavi paletti, v3 ise sitenin bugunku kimligi: BEYAZ + TURUNCU, acik ton.
 *
 * Ayarlar CMS'te KALICI saklandigi icin defaultSettings()'i degistirmek yeterli
 * degil; kayitli deger onu eziyor. Bu yuzden: kayitli renk ESKI VARSAYILANLARDAN
 * biriyle birebir ayniysa (yani kullanici o rengi hic elle degistirmemisse)
 * yenisi uygulanir. Kullanici panelden kendi rengini secmisse ona dokunulmaz.
 *
 * Not: gecis yalnizca okuma sirasinda uygulanir, veritabanina yazilmaz.
 */
/** Onceki surumlerin paletleri. Bu degerler TARIHSEL sabittir — asla guncellenmez;
 *  yalnizca "kullanici bu rengi hic degistirmemis" tespiti icin kullanilir. */
const PALET_GECMISI: Record<string, string>[] = [
  // v1 — slate
  {
    navy: "#0f172a",
    navy2: "#1e293b",
    ink: "#0f172a",
    accent: "#ea580c",
    blue: "#1d4ed8",
    muted: "#475569",
  },
  // v2 — logo indigosu + mavi eylem rengi
  {
    navy: "#241E4E",
    navy2: "#3A3170",
    ink: "#241F3D",
    accent: "#EF7F2D",
    accent2: "#10b981",
    blue: "#2E5BE8",
    blueSoft: "#dbeafe",
    amberSoft: "#ffedd5",
    emeraldSoft: "#d1fae5",
    muted: "#5B5675",
    line: "#e2e8f0",
    bgsoft: "#f8fafc",
  },
  // v3 — beyaz + kahve/turuncu. Bolge renkleri (headerTopBg, footerBg ...) bu
  // surumde eklendi; v4'e gecerken onlarin da tasinabilmesi icin burada.
  {
    navy: "#3A2C22",
    navy2: "#584334",
    ink: "#2E2620",
    accent: "#F79A47",
    accent2: "#E08A2C",
    blue: "#C25E08",
    blueSoft: "#FFEBD8",
    amberSoft: "#FFF3E6",
    emeraldSoft: "#FFF0DF",
    muted: "#6B5F57",
    line: "#EFE3D8",
    bgsoft: "#FFF8F2",
    headerTopBg: "#3A2C22",
    footerBg: "#3A2C22",
    buttonBg: "#C25E08",
    heroTo: "#FFF1E4",
  },
];

/**
 * v4 — KURUMSAL MAVI + TURUNCU. app/globals.css icindeki @theme ile ayni.
 *
 * Iki renk ailesi: derin mavi (koyu yuzeyler, baglantilar) + logonun turuncusu
 * (yalnizca vurgu). Onceki palette birbirinden farkli UC acik ton vardi
 * (blueSoft/amberSoft/emeraldSoft); ucu de ayni acik maviye indirildi —
 * anahtarlar kod genelinde kullanildigi icin duruyor, degerleri ayni.
 */
const YENI_PALET: Record<string, string> = {
  navy: "#0B2A4A",       // derin mavi: basliklar ve koyu bolumler
  navy2: "#14406E",      // koyu gradyanlarin ikinci ucu
  ink: "#10202F",
  accent: "#EF7F2D",     // logonun turuncusu — KOYU zeminde vurgu olarak
  accent2: "#B2540A",    // onay/dogrulama isaretleri
  blue: "#0F5AA8",       // birincil mavi; beyaz uzerinde 6.89:1 (AAA)
  blueSoft: "#E4EEF9",
  amberSoft: "#E4EEF9",
  emeraldSoft: "#E4EEF9",
  muted: "#566B7E",
  line: "#DFE7EF",
  bgsoft: "#F5F8FC",
  headerTopBg: "#0B2A4A",
  footerBg: "#0B2A4A",
  buttonBg: "#0F5AA8",
  heroTo: "#EDF3FA",
};

function paletiGuncelle(s: SiteSettings): SiteSettings {
  // Kayitli ayar eski surumden kaldigi icin YENI eklenen renk anahtarlarini
  // (headerBg, footerBg, buttonBg ...) icermeyebilir; eksikler varsayilanla
  // tamamlanir, kayitli olanlara dokunulmaz.
  const varsayilan = defaultSettings().colors;
  const eksikVar = Object.keys(varsayilan).some((k) => !s.colors[k]);
  let degisti = eksikVar;
  const colors = { ...varsayilan, ...s.colors };
  for (const [k, yeni] of Object.entries(YENI_PALET)) {
    const kayitli = colors[k]?.toLowerCase();
    if (!kayitli) continue;
    const varsayilanKalmis = PALET_GECMISI.some((p) => p[k]?.toLowerCase() === kayitli);
    if (varsayilanKalmis) {
      colors[k] = yeni;
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

/**
 * Gorseli kaydeder ve sayfalarda kullanilacak ADRESI doner.
 *
 * ⚠️ Dosya yuklendiginde adres artik base64 "data:" dizesi DEGIL,
 * `/api/gorsel/<id>`. Onceki davranista panel, kopyalanacak adres olarak
 * gorselin base64 govdesini veriyordu; o dize bloklara yapistiginda gorsel
 * HER sayfa isteginde HTML'in icinde iniyordu — tarayici ayrica onbellege
 * alamiyor, HTML ~1.3 kat sisiyordu. Gercek bir adres uzerinden servis
 * edildiginde gorsel bir kez inip onbellekte kaliyor.
 *
 * Disaridan bir adres (https://...) verildiyse ona dokunulmuyor.
 */
export async function saveMedia(m: Omit<MediaItem, "id" | "created">): Promise<string> {
  if (isDbOn()) {
    const id = await dbSaveMedia(m);
    if (m.dataUrl && id) {
      const adres = `/api/gorsel/${id}`;
      await run(sql()`UPDATE media SET url = ${adres} WHERE id = ${id}`);
      return adres;
    }
    return m.url;
  }
  const s = await getState();
  const id = s.media.reduce((mx, x) => Math.max(mx, x.id), 0) + 1;
  s.media.push({ ...m, id, created: new Date().toISOString() });
  await setState(s);
  return m.url;
}

export async function deleteMedia(id: number): Promise<void> {
  if (isDbOn()) {
    await ensureSchema();
    await run(sql()`DELETE FROM media WHERE id = ${id}`);
    return;
  }
  const s = await getState();
  s.media = s.media.filter((x) => x.id !== id);
  await setState(s);
}
