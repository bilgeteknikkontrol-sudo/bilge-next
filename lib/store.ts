const TOKEN = process.env.VERCEL_API_TOKEN;
const TEAM = process.env.VERCEL_TEAM_ID;
const PROJECT = process.env.VERCEL_PROJECT_ID || "prj_GuwENTTkYUfZouhURsI7oDLRGVS7";
const REPO_ID = "1346231192";
const TARGETS = ["production", "preview", "development"];

function readEnvVar(key: string): unknown | null {
  const v = process.env[key];
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

async function writeEnvVar(key: string, value: unknown): Promise<void> {
  if (!TOKEN || !TEAM) return;
  const val = JSON.stringify(value);
  let id: string | null = null;
  try {
    const res = await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = await res.json();
    id = (json.envs || []).find((e: { key: string; id: string }) => e.key === key)?.id || null;
  } catch {
    id = null;
  }
  try {
    if (id) {
      await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env/${id}?teamId=${TEAM}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value: val, type: "encrypted", target: TARGETS }),
      });
    } else {
      await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: val, type: "encrypted", target: TARGETS }),
      });
    }
  } catch {
    /* env yazılamadıysa sessizce geç */
  }
  try {
    await fetch(`https://api.vercel.com/v13/deployments?projectId=${PROJECT}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "bilge-next", target: "production", gitSource: { type: "github", repoId: REPO_ID, ref: "main" } }),
    });
  } catch {
    /* redeploy başarısızsa sonraki deploy'da uygulanır */
  }
}

// ---------------- CMS state ----------------
export function readCmsState(): unknown | null {
  return readEnvVar("CMS_STATE");
}

export async function writeCmsState(state: unknown): Promise<void> {
  await writeEnvVar("CMS_STATE", state);
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
  const arr = (readEnvVar("TEKLIF_STATE") as TeklifKayit[]) || [];
  arr.push(kayit);
  await writeEnvVar("TEKLIF_STATE", arr);
}

export async function findTeklif(no: string): Promise<TeklifKayit | null> {
  const arr = (readEnvVar("TEKLIF_STATE") as TeklifKayit[]) || [];
  return arr.find((t) => t.raporNo === no) || null;
}
