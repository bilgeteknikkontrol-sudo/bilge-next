import { promises as fs } from "fs";
import path from "path";

export interface TeklifRecord {
  ref: string;
  raporNo: string;
  firma: string;
  ad: string;
  tel: string;
  eposta: string;
  bolge: string;
  ekipmanlar: string[];
  tarih: string;
  durum: string;
  gecerli: string;
  ek: string;
}

const DIR = path.join(process.cwd(), "data");
const FILE = "teklifler.json";

function dbEnabled() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

async function fileAll(): Promise<TeklifRecord[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, FILE), "utf8")) as TeklifRecord[];
  } catch {
    return [];
  }
}

async function fileSave(t: TeklifRecord) {
  await fs.mkdir(DIR, { recursive: true });
  const all = await fileAll();
  all.push(t);
  await fs.writeFile(path.join(DIR, FILE), JSON.stringify(all, null, 2), "utf8");
}

async function dbSave(t: TeklifRecord) {
  const mod = await import("@neondatabase/serverless");
  const sql = mod.neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || "");
  await sql`
    CREATE TABLE IF NOT EXISTS teklifler (
      ref text PRIMARY KEY,
      rapor_no text,
      firma text, ad text, tel text, eposta text, bolge text,
      ekipmanlar jsonb, tarih text, durum text, gecerli text, ek text
    )
  `;
  await sql`
    INSERT INTO teklifler (ref, rapor_no, firma, ad, tel, eposta, bolge, ekipmanlar, tarih, durum, gecerli, ek)
    VALUES (${t.ref}, ${t.raporNo}, ${t.firma}, ${t.ad}, ${t.tel}, ${t.eposta}, ${t.bolge},
      ${JSON.stringify(t.ekipmanlar)}::jsonb, ${t.tarih}, ${t.durum}, ${t.gecerli}, ${t.ek})
    ON CONFLICT (ref) DO NOTHING
  `;
}

async function dbFind(refOrNo: string): Promise<TeklifRecord | null> {
  const mod = await import("@neondatabase/serverless");
  const sql = mod.neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || "");
  const rows = await sql`
    SELECT * FROM teklifler WHERE ref = ${refOrNo} OR rapor_no = ${refOrNo} LIMIT 1
  `;
  if (!rows.length) return null;
  const r = rows[0] as Record<string, unknown>;
  return {
    ref: String(r.ref),
    raporNo: String(r.rapor_no),
    firma: String(r.firma),
    ad: String(r.ad),
    tel: String(r.tel),
    eposta: String(r.eposta),
    bolge: String(r.bolge),
    ekipmanlar: (r.ekipmanlar as string[]) || [],
    tarih: String(r.tarih),
    durum: String(r.durum),
    gecerli: String(r.gecerli),
    ek: String(r.ek),
  };
}

export async function saveTeklif(t: TeklifRecord): Promise<void> {
  if (dbEnabled()) {
    try {
      await dbSave(t);
      return;
    } catch (e) {
      console.error("[store] DB save basarisiz, dosyaya geri donuluyor:", e);
    }
  }
  await fileSave(t);
}

export async function findTeklif(refOrNo: string): Promise<TeklifRecord | null> {
  if (dbEnabled()) {
    try {
      return await dbFind(refOrNo);
    } catch (e) {
      console.error("[store] DB sorgu basarisiz, dosyaya geri donuluyor:", e);
    }
  }
  const q = refOrNo.toUpperCase();
  return (await fileAll()).find((t) => t.ref.toUpperCase() === q || t.raporNo.toUpperCase() === q) || null;
}
