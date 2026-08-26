import zlib from "zlib";

const TOKEN = process.env.VERCEL_API_TOKEN;
const TEAM = process.env.VERCEL_TEAM_ID;
const PROJECT = process.env.VERCEL_PROJECT_ID || "prj_GuwENTTkYUfZouhURsI7oDLRGVS7";
const REPO_ID = "1346231192";
const TARGETS = ["production", "preview", "development"];
const CHUNK = 50000;

function gzip(str: string): string {
  return zlib.gzipSync(Buffer.from(str, "utf8")).toString("base64");
}

function gunzip(str: string): string {
  return zlib.gunzipSync(Buffer.from(str, "base64")).toString("utf8");
}

function readRaw(key: string): string | null {
  const v = process.env[key];
  return v ? v : null;
}

async function listEnvIds(): Promise<Record<string, string>> {
  if (!TOKEN || !TEAM) return {};
  try {
    const res = await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = (await res.json()) as { envs?: { key: string; id: string }[] };
    const out: Record<string, string> = {};
    for (const e of json.envs || []) out[e.key] = e.id;
    return out;
  } catch {
    return {};
  }
}

async function writeEnvValue(key: string, value: string): Promise<void> {
  if (!TOKEN || !TEAM) return;
  const ids = await listEnvIds();
  const id = ids[key] || null;
  try {
    if (id) {
      await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env/${id}?teamId=${TEAM}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value, type: "encrypted", target: TARGETS }),
      });
    } else {
      await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, type: "encrypted", target: TARGETS }),
      });
    }
  } catch {
    /* yok say */
  }
}

async function deleteEnvValue(key: string): Promise<void> {
  if (!TOKEN || !TEAM) return;
  const ids = await listEnvIds();
  const id = ids[key];
  if (!id) return;
  try {
    await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env/${id}?teamId=${TEAM}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  } catch {
    /* yok say */
  }
}

async function triggerRedeploy(): Promise<void> {
  if (!TOKEN || !TEAM) return;
  try {
    await fetch(`https://api.vercel.com/v13/deployments?projectId=${PROJECT}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "bilge-next", target: "production", gitSource: { type: "github", repoId: REPO_ID, ref: "main" } }),
    });
  } catch {
    /* yok say */
  }
}

async function writeState(state: unknown, prefix: string): Promise<void> {
  const payload = gzip(JSON.stringify(state));
  if (payload.length <= CHUNK) {
    await writeEnvValue(prefix, payload);
    const ids = await listEnvIds();
    for (let i = 0; ids[`${prefix}_${i}`]; i++) await deleteEnvValue(`${prefix}_${i}`);
    await deleteEnvValue(`${prefix}__CHUNKS`);
  } else {
    const parts = payload.match(new RegExp(`.{1,${CHUNK}}`, "g")) || [payload];
    for (let i = 0; i < parts.length; i++) await writeEnvValue(`${prefix}_${i}`, parts[i]);
    await writeEnvValue(`${prefix}__CHUNKS`, String(parts.length));
    await deleteEnvValue(prefix);
  }
  await triggerRedeploy();
}

function readState(prefix: string): unknown | null {
  const single = readRaw(prefix);
  if (single) {
    try {
      return JSON.parse(gunzip(single));
    } catch {
      return null;
    }
  }
  const chunks = Number(readRaw(`${prefix}__CHUNKS`) || "0");
  if (chunks > 0) {
    let acc = "";
    for (let i = 0; i < chunks; i++) {
      const c = readRaw(`${prefix}_${i}`);
      if (!c) return null;
      acc += c;
    }
    try {
      return JSON.parse(gunzip(acc));
    } catch {
      return null;
    }
  }
  return null;
}

// ---------------- CMS state ----------------
export function readCmsState(): unknown | null {
  return readState("CMS_STATE");
}

export async function writeCmsState(state: unknown): Promise<void> {
  await writeState(state, "CMS_STATE");
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
  const arr = (readState("TEKLIF_STATE") as TeklifKayit[]) || [];
  arr.push(kayit);
  await writeState(arr, "TEKLIF_STATE");
}

export async function findTeklif(no: string): Promise<TeklifKayit | null> {
  const arr = (readState("TEKLIF_STATE") as TeklifKayit[]) || [];
  return arr.find((t) => t.raporNo === no) || null;
}
