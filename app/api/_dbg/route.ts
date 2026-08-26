import { NextResponse } from "next/server";
import { readCmsState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const present = {
    CMS_STATE: !!process.env.CMS_STATE,
    CMS_STATE_0: !!process.env.CMS_STATE_0,
    CMS_STATE_1: !!process.env.CMS_STATE_1,
    CMS_STATE__CHUNKS: process.env.CMS_STATE__CHUNKS ?? "(none)",
  };
  const len0 = process.env.CMS_STATE_0 ? process.env.CMS_STATE_0.length : 0;
  let readResult: unknown = "n/a";
  let readError = "";
  try {
    const v = readCmsState();
    readResult = v ? "OK heroTitle=" + (v as any).settings?.heroTitle : "NULL(seed)";
  } catch (e) {
    readError = String(e);
  }
  return NextResponse.json({ present, len0, readError, readResult });
}
