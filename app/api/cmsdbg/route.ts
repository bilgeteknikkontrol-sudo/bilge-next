import { NextResponse } from "next/server";
import { readCmsState, writeCmsState } from "@/lib/store";

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

  return NextResponse.json(info);
}
