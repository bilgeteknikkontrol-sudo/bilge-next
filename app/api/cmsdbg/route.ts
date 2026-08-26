import { NextResponse } from "next/server";
import { readCmsState } from "@/lib/store";
import zlib from "zlib";

export const dynamic = "force-dynamic";

export async function GET() {
  const info: Record<string, unknown> = {};
  info.hasCMS_STATE = !!process.env.CMS_STATE;
  info.hasCMS_STATE_0 = !!process.env.CMS_STATE_0;
  info.hasCMS_STATE_1 = !!process.env.CMS_STATE_1;
  info.chunksRaw = process.env.CMS_STATE__CHUNKS ?? "(none)";
  info.len0 = process.env.CMS_STATE_0 ? process.env.CMS_STATE_0.length : 0;

  let readResult = "n/a";
  let readError = "";
  try {
    const v = readCmsState();
    readResult = v ? "OK heroTitle=" + (v as any).settings?.heroTitle : "NULL(seed)";
  } catch (e) {
    readError = String(e) + " | " + (e as Error).stack;
  }
  info.readError = readError;
  info.readResult = readResult;

  // local round-trip test of chunk logic
  try {
    const sample = { settings: { heroTitle: "RTTEST" }, n: 123 };
    const payload = zlib.gzipSync(Buffer.from(JSON.stringify(sample), "utf8")).toString("base64");
    const CHUNK = 50000;
    const parts = payload.length <= CHUNK ? [payload] : payload.match(new RegExp(`.{1,${CHUNK}}`, "g")) || [payload];
    const reJoined = parts.join("");
    const back = JSON.parse(zlib.gunzipSync(Buffer.from(reJoined, "base64")).toString("utf8"));
    info.rt = back.heroTitle === "RTTEST" ? "ROUNDTRIP_OK parts=" + parts.length : "ROUNDTRIP_BAD";
  } catch (e) {
    info.rt = "RT_ERR " + String(e);
  }

  return NextResponse.json(info);
}
