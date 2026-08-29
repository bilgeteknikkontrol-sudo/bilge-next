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
function imzaAnahtari(): string | null {
  const s = process.env.ADMIN_SECRET?.trim();
  if (s) return s;
  const pw = process.env.ADMIN_PASSWORD?.trim();
  if (pw) return `turetilmis:${crypto.createHash("sha256").update(pw).digest("hex")}`;
  if (process.env.NODE_ENV === "production") return null;
  return "yerel-gelistirme-anahtari";
}

/**
 * Panel kurulu mu? (ADMIN_PASSWORD / ADMIN_SECRET tanimli mi)
 *
 * ⚠️ 2026-08-29: Hostinger'da bu degiskenlerin ikisi de yoktu ve kod hata
 * FIRLATIYORDU. Sonuc: cerezi olan her istek 500 aliyordu, panele giris
 * tamamen imkansizdi ve ekranda sebebi soyleyen hicbir sey yoktu — Hostinger
 * uygulama gunlugu de tutmadigi icin teshis edilemez bir "bozuk panel"
 * olusuyordu. Artik hata firlatilmiyor: giris yine IMKANSIZ (guvenlik ayni),
 * ama giris ekrani neyin eksik oldugunu yaziyor.
 */
export function panelKurulu(): boolean {
  return imzaAnahtari() !== null && Boolean(process.env.ADMIN_PASSWORD?.trim());
}

function sign(payload: string): string | null {
  const anahtar = imzaAnahtari();
  if (!anahtar) return null;
  return crypto.createHmac("sha256", anahtar).update(payload).digest("base64url");
}

/**
 * Yonetici sifresi. Uretimde sabit varsayilan kullanilamaz: depo acik oldugu
 * icin "bilgeadmin2026" herkesin gorebilecegi bir sifre olurdu.
 */
export function adminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  if (pw) return pw;
  if (process.env.NODE_ENV === "production") return null;
  return "bilgeadmin2026"; // yalnizca yerel gelistirme
}

/**
 * ⚠️ Karsilastirma once SHA-256'dan geciriliyor.
 *
 * Onceki hali uzunluklar farkliysa hemen `false` donuyordu; bu, denemenin ne
 * kadar surdugune bakan birine sifrenin UZUNLUGUNU sizdirir. Ozetler her zaman
 * 32 bayt oldugu icin `timingSafeEqual` gercekten sabit surede calisiyor ve
 * uzunluk bilgisi disari cikmiyor.
 */
export function verifyPassword(pw: string): boolean {
  const a = adminPassword();
  if (!a) return false; // panel kurulu degil -> giris yok
  const ozet = (s: string) => crypto.createHash("sha256").update(s).digest();
  return crypto.timingSafeEqual(ozet(a), ozet(pw || ""));
}

export async function createSession(): Promise<void> {
  const expiry = Date.now() + MAX_AGE * 1000;
  const payload = String(expiry);
  const imza = sign(payload);
  if (!imza) return; // anahtar yoksa oturum acilmaz
  const token = `${payload}.${imza}`;
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
  const beklenen = sign(payload);
  // Anahtar yoksa dogrulanamaz -> yetkisiz say (hata firlatma; bkz. panelKurulu)
  if (!beklenen || beklenen !== sig) return false;
  const expiry = Number(payload);
  return !Number.isNaN(expiry) && expiry > Date.now();
}

export async function guard(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
