import { put, list, get } from "@vercel/blob";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const CMS_PATH = "cms-state.json";
const TEKLIF_PATH = "teklif-state.json";

async function readBlob(pathname: string): Promise<string | null> {
  if (!BLOB_TOKEN) return null;
  try {
    const res = await list({ prefix: pathname, token: BLOB_TOKEN });
    const found = res.blobs.find((b) => b.pathname === pathname);
    if (!found) return null;
    const g = await get(found.url, { access: "private", token: BLOB_TOKEN, useCache: false });
    if (!g || g.statusCode !== 200) return null;
    return await new Response(g.stream).text();
  } catch {
    return null;
  }
}

async function writeBlob(pathname: string, value: string): Promise<void> {
  if (!BLOB_TOKEN) return;
  await put(pathname, value, { access: "private", token: BLOB_TOKEN, allowOverwrite: true });
}

function parseState<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ---------------- CMS state ----------------
export async function readCmsState(): Promise<unknown | null> {
  return parseState<unknown>(await readBlob(CMS_PATH));
}

export async function writeCmsState(state: unknown): Promise<void> {
  await writeBlob(CMS_PATH, JSON.stringify(state));
}

// ---------------- Teklif (quote) requests ----------------
export type TeklifKayit = {
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
};

export async function saveTeklif(kayit: TeklifKayit): Promise<void> {
  const arr = (parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || []) as TeklifKayit[];
  arr.push(kayit);
  await writeBlob(TEKLIF_PATH, JSON.stringify(arr));
}

export async function findTeklif(no: string): Promise<TeklifKayit | null> {
  const arr = parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || [];
  return arr.find((t) => t.raporNo === no) || null;
}

/** Tum teklif taleplerini doner (en yeni once). Panel ekrani icin. */
export async function tumTeklifler(): Promise<TeklifKayit[]> {
  const arr = parseState<TeklifKayit[]>(await readBlob(TEKLIF_PATH)) || [];
  return [...arr].reverse();
}
