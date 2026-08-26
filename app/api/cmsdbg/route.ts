import { NextResponse } from "next/server";
import { del, list } from "@vercel/blob";
import { readCmsState, writeCmsState } from "@/lib/store";

const CMS_PATH = "cms-state.json";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const info: Record<string, unknown> = {};
  info.hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  info.blobTokenLen = process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.length : 0;

  try {
    const v = await readCmsState();
    info.readResult = v ? "OK heroTitle=" + (v as any).settings?.heroTitle : "NULL(seed)";
  } catch (e) {
    info.readResult = "ERR " + String(e);
  }

  // round-trip test on real CMS state: write, then read back
  const url = new URL(req.url);
  if (url.searchParams.get("writetest") === "1") {
    try {
      const testState = { settings: { heroTitle: "BLOBTEST_" + Date.now() }, n: 1 };
      await writeCmsState(testState);
      const back = (await readCmsState()) as any;
      info.writeTest = back?.settings?.heroTitle === testState.settings.heroTitle ? "ROUNDTRIP_OK" : "ROUNDTRIP_MISMATCH got=" + (back?.settings?.heroTitle ?? "null");
    } catch (e) {
      info.writeTest = "WRITE_ERR " + String(e);
    }
  }

  if (url.searchParams.get("reset") === "1") {
    try {
      const lst = await list({ prefix: CMS_PATH, token: process.env.BLOB_READ_WRITE_TOKEN! });
      const found = lst.blobs.find((b) => b.pathname === CMS_PATH);
      if (found) {
        await del(found.url, { token: process.env.BLOB_READ_WRITE_TOKEN! });
        info.reset = "DELETED " + found.url;
      } else {
        info.reset = "NOT_FOUND";
      }
    } catch (e) {
      info.reset = "ERR " + String(e);
    }
  }

  return NextResponse.json(info);
}
