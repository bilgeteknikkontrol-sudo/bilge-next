import { NextResponse } from "next/server";
import { readCmsState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const info: Record<string, unknown> = {
    hasCMS_STATE_0: !!process.env.CMS_STATE_0,
    hasCMS_STATE_1: !!process.env.CMS_STATE_1,
    chunksRaw: process.env.CMS_STATE__CHUNKS ?? "(none)",
    len0: process.env.CMS_STATE_0 ? process.env.CMS_STATE_0.length : 0,
  };

  try {
    const v = readCmsState();
    info.readResult = v ? "OK heroTitle=" + (v as any).settings?.heroTitle : "NULL(seed)";
  } catch (e) {
    info.readResult = "ERR " + String(e);
  }

  if (url.searchParams.get("writetest") === "1") {
    const TOKEN = process.env.VERCEL_API_TOKEN;
    const TEAM = process.env.VERCEL_TEAM_ID;
    const PROJECT = process.env.VERCEL_PROJECT_ID || "prj_GuwENTTkYfZUouhURsI7oDLRGVS7";
    const body = JSON.stringify({ key: "CMS_DBG_TEST", value: "hello", type: "encrypted", target: ["production", "preview", "development"] });
    try {
      const res = await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body,
      });
      const txt = await res.text();
      info.writeTest = { status: res.status, body: txt };
    } catch (e) {
      info.writeTest = "FETCH_ERR " + String(e);
    }
    // also try a second var with a large-ish value to probe size limit
    const big = "x".repeat(60000);
    try {
      const res2 = await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ key: "CMS_DBG_BIG", value: big, type: "encrypted", target: ["production", "preview", "development"] }),
      });
      const txt2 = await res2.text();
      info.writeBig = { status: res2.status, len: big.length, body: txt2.slice(0, 300) };
    } catch (e) {
      info.writeBig = "FETCH_ERR " + String(e);
    }
  }

  return NextResponse.json(info);
}
