import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "bilge_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

/**
 * ⚠️ GUVENLIK — burada sabit bir varsayilan OLAMAZ.
 *
 * Onceki hali `process.env.ADMIN_SECRET || "bilge-kontrol-admin-gizli-anahtar-2026"`
 * idi. Bu depo GitHub'da HERKESE ACIK oldugu icin o dize de herkese acikti;
 * oturum cerezi `<bitis>.<HMAC(bitis, SECRET)>` bicimindeyken anahtari bilen
 * herkes gecerli bir cerez URETEBILIR ve sifreyi hic bilmeden panele girebilirdi.
 * Yani ADMIN_PASSWORD tamamen devre disi kaliyordu.
 *
 * Yeni davranis: ADMIN_SECRET tanimliysa o kullanilir; degilse imza anahtari
 * ADMIN_PASSWORD'dan turetilir (o gercekten gizli). Ikisi de yoksa surec
 * gelistirme moduna dusuyor demektir; o durumda sabit bir gelistirme anahtari
 * kullanilir ama URETIMDE bu mumkun degil (asagidaki kontrol hata firlatir).
 */
function imzaAnahtari(): string {
  const s = process.env.ADMIN_SECRET;
  if (s) return s;
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) return `turetilmis:${crypto.createHash("sha256").update(pw).digest("hex")}`;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SECRET veya ADMIN_PASSWORD tanimli degil — yonetici oturumu guvenle imzalanamaz."
    );
  }
  return "yerel-gelistirme-anahtari";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", imzaAnahtari()).update(payload).digest("base64url");
}

/**
 * Yonetici sifresi. Uretimde sabit varsayilan kullanilamaz: depo acik oldugu
 * icin "bilgeadmin2026" herkesin gorebilecegi bir sifre olurdu.
 */
export function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) return pw;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD tanimli degil — yonetici girisi kapali.");
  }
  return "bilgeadmin2026"; // yalnizca yerel gelistirme
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
