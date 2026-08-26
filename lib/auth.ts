import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "bilge_admin";
const SECRET = process.env.ADMIN_SECRET || "bilge-kontrol-admin-gizli-anahtar-2026";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "bilgeadmin2026";
}

export function verifyPassword(pw: string): boolean {
  const a = adminPassword();
  const b = pw || "";
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function createSession(): Promise<void> {
  const expiry = Date.now() + MAX_AGE * 1000;
  const payload = String(expiry);
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (sign(payload) !== sig) return false;
  const expiry = Number(payload);
  return !Number.isNaN(expiry) && expiry > Date.now();
}

export async function guard(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
