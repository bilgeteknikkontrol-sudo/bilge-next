"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import {
  saveArticle,
  deleteArticle,
  saveEquipment,
  deleteEquipment,
  saveLocation,
  deleteLocation,
  saveSettings,
  getSettings,
  setContent,
  deleteContent,
  saveMedia,
  deleteMedia,
  defaultSettings,
  type Article,
  type Equipment,
  type Location,
  type SiteSettings,
} from "@/lib/cms";
import { slugify } from "@/lib/content";
import { menuYaz, type MenuOge, type MenuAlt } from "@/lib/menu";
import { TUM_ALANLAR } from "@/lib/sayfa-metin";
import {
  blokKaydet,
  blokSil,
  blokDurumDegistir,
  yeniId,
  BLOK_TURLERI,
  type Blok,
  type BlokTuru,
} from "@/lib/bloklar";

function num(v: unknown, d = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

async function guard() {
  if (!(await isAuthenticated())) throw new Error("Yetkisiz erişim");
}

export async function loginAction(formData: FormData) {
  const pw = String(formData.get("password") || "");
  if (!verifyPassword(pw)) {
    redirect("/admin/login?error=1");
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- ARTICLES ----------
export async function saveArticleAction(formData: FormData) {
  await guard();
  const slugRaw = String(formData.get("slug") || "");
  const title = String(formData.get("title") || "");
  const slug = slugRaw.trim() ? slugRaw.trim() : slugify(title) || `makale-${Date.now()}`;
  const article: Article = {
    slug,
    title,
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || "Genel"),
    date: String(formData.get("date") || new Date().toISOString().slice(0, 10)),
    readMin: num(formData.get("readMin"), 5),
    keywords: String(formData.get("keywords") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    lead: String(formData.get("lead") || "") || undefined,
    body: String(formData.get("body") || ""),
    faq: parseFaq(String(formData.get("faq") || "")),
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
    sira: num(formData.get("sira")),
    // Bos birakilirsa undefined -> sayfada slug eslesmeli varsayilan gorsel kullanilir
    image: String(formData.get("image") || "").trim() || undefined,
  };
  await saveArticle(article);
  revalidatePath("/");
  revalidatePath("/yazilar");
  revalidatePath(`/yazilar/${slug}`);
  redirect("/admin/articles");
}

export async function deleteArticleAction(formData: FormData) {
  await guard();
  const slug = String(formData.get("slug") || "");
  if (slug) await deleteArticle(slug);
  revalidatePath("/");
  revalidatePath("/yazilar");
}

function parseFaq(text: string) {
  if (!text.trim()) return [];
  try {
    const arr = JSON.parse(text);
    if (Array.isArray(arr)) return arr;
  } catch {
    /* satır satır ayrıştır */
  }
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const out: { q: string; a: string }[] = [];
  for (let i = 0; i < lines.length; i += 2) {
    out.push({ q: lines[i], a: lines[i + 1] || "" });
  }
  return out;
}

// ---------- EQUIPMENT ----------
export async function saveEquipmentAction(formData: FormData) {
  await guard();
  const slugRaw = String(formData.get("slug") || "");
  const ad = String(formData.get("ad") || "");
  const slug = slugRaw.trim() ? slugRaw.trim() : slugify(ad) || `ekipman-${Date.now()}`;
  const e: Equipment = {
    slug,
    ad,
    kategori: String(formData.get("kategori") || "Genel"),
    standart: String(formData.get("standart") || ""),
    periyot: num(formData.get("periyot"), 12),
    periyotNot: String(formData.get("periyotNot") || "") || undefined,
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
    sira: num(formData.get("sira")),
  };
  await saveEquipment(e);
  revalidatePath("/");
  revalidatePath("/ekipman");
  redirect("/admin/equipment");
}

export async function deleteEquipmentAction(formData: FormData) {
  await guard();
  const slug = String(formData.get("slug") || "");
  if (slug) await deleteEquipment(slug);
  revalidatePath("/");
  revalidatePath("/ekipman");
}

// ---------- LOCATIONS ----------
export async function saveLocationAction(formData: FormData) {
  await guard();
  const slugRaw = String(formData.get("slug") || "");
  const il = String(formData.get("il") || "");
  const title = String(formData.get("title") || il);
  const slug = slugRaw.trim() ? slugRaw.trim() : slugify(title) || `bolge-${Date.now()}`;
  const l: Location = {
    slug,
    il,
    ilce: String(formData.get("ilce") || "") || undefined,
    title,
    description: String(formData.get("description") || ""),
    intro: String(formData.get("intro") || ""),
    hizmetler: String(formData.get("hizmetler") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
    sira: num(formData.get("sira")),
  };
  await saveLocation(l);
  revalidatePath("/");
  revalidatePath("/bolge");
  redirect("/admin/locations");
}

export async function deleteLocationAction(formData: FormData) {
  await guard();
  const slug = String(formData.get("slug") || "");
  if (slug) await deleteLocation(slug);
  revalidatePath("/");
  revalidatePath("/bolge");
}

// ---------- SETTINGS ----------
export async function saveSettingsAction(formData: FormData) {
  await guard();
  const cur = await getSettings().catch(() => defaultSettings());
  const colors = { ...cur.colors };
  const fonts = { ...cur.fonts };
  // Formdaki TUM color_* alanlari okunur. Kayitli ayarin anahtarlari uzerinden
  // donmek yetmiyordu: yeni eklenen renkler (headerBg, footerBg ...) kayitli
  // veride bulunmadigi icin panelden degistirilse de kaydedilmiyordu.
  for (const [alan, deger] of formData.entries()) {
    if (!alan.startsWith("color_")) continue;
    const key = alan.slice("color_".length);
    const v = String(deger).trim();
    // Yalnizca gecerli hex kabul edilir; bozuk deger tum siteyi bozabilir.
    if (/^#[0-9a-fA-F]{6}$/.test(v)) colors[key] = v;
  }
  for (const key of Object.keys(fonts)) {
    const v = formData.get(`font_${key}`);
    if (v !== null && v !== "") fonts[key] = String(v);
  }
  const s: SiteSettings = {
    colors,
    fonts,
    logo: String(formData.get("logo") || cur.logo),
    favicon: String(formData.get("favicon") || cur.favicon),
    phone: String(formData.get("phone") || cur.phone),
    email: String(formData.get("email") || cur.email),
    address: String(formData.get("address") || cur.address),
    sameAs: String(formData.get("sameAs") || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean),
    heroTitle: String(formData.get("heroTitle") || cur.heroTitle),
    heroSubtitle: String(formData.get("heroSubtitle") || cur.heroSubtitle),
    aboutTitle: String(formData.get("aboutTitle") || cur.aboutTitle),
    aboutText: String(formData.get("aboutText") || cur.aboutText),
    ctaTitle: String(formData.get("ctaTitle") || cur.ctaTitle),
    ctaText: String(formData.get("ctaText") || cur.ctaText),
  };
  await saveSettings(s);
  revalidatePath("/");
  redirect("/admin/settings");
}

// ---------- CONTENT ----------
export async function saveContentAction(formData: FormData) {
  await guard();
  const key = String(formData.get("key") || "").trim();
  const value = String(formData.get("value") || "");
  if (key) await setContent(key, value);
  revalidatePath("/");
  redirect("/admin/content");
}

// ---------- CONTENT DELETE ----------
export async function deleteContentAction(formData: FormData) {
  await guard();
  const key = String(formData.get("key") || "");
  if (key) await deleteContent(key);
  revalidatePath("/");
  redirect("/admin/content");
}

// ---------- MEDIA ----------
export async function saveMediaAction(formData: FormData) {
  await guard();
  const name = String(formData.get("name") || "gorsel");
  const alt = String(formData.get("alt") || "");
  const url = String(formData.get("url") || "").trim();
  const file = formData.get("file");
  let dataUrl: string | null = null;
  let finalUrl = url;
  if (file && typeof file === "object" && "arrayBuffer" in file) {
    const buf = Buffer.from(await (file as File).arrayBuffer());
    const mime = (file as File).type || "image/png";
    dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    finalUrl = dataUrl;
  }
  await saveMedia({ name, url: finalUrl, dataUrl, alt });
  redirect("/admin/media");
}

export async function deleteMediaAction(formData: FormData) {
  await guard();
  const id = num(formData.get("id"));
  if (id) await deleteMedia(id);
}

// ---------------- Bloklar (referans / ekip / sertifika / hero / sss) ----------------

export async function saveBlokAction(formData: FormData) {
  await guard();
  const tur = String(formData.get("tur") || "referans") as BlokTuru;
  const blok: Blok = {
    id: String(formData.get("id") || "") || yeniId(),
    tur: BLOK_TURLERI.includes(tur) ? tur : "referans",
    baslik: String(formData.get("baslik") || "").trim(),
    metin: String(formData.get("metin") || "").trim(),
    gorsel: String(formData.get("gorsel") || "").trim(),
    url: String(formData.get("url") || "").trim(),
    sira: num(formData.get("sira")),
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
  };
  await blokKaydet(blok);
  revalidateBloklar();
  redirect(`/admin/bloklar?tur=${blok.tur}`);
}

export async function deleteBlokAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const tur = String(formData.get("tur") || "referans");
  if (id) await blokSil(id);
  revalidateBloklar();
  redirect(`/admin/bloklar?tur=${tur}`);
}

export async function toggleBlokAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const tur = String(formData.get("tur") || "referans");
  if (id) await blokDurumDegistir(id);
  revalidateBloklar();
  redirect(`/admin/bloklar?tur=${tur}`);
}

/** Bloklar birden fazla sayfada kullanildigi icin hepsi tazeleniyor. */
function revalidateBloklar() {
  for (const p of ["/", "/referanslar", "/kurumsal", "/sertifikalar", "/sss", "/iletisim"]) {
    revalidatePath(p);
  }
}

// ---------- SAYFA METINLERI ----------
/**
 * Sayfa metinleri ekrani tum alanlari tek formda gonderiyor.
 * Bos birakilan alan SILINIYOR (setContent yerine deleteContent) ki sayfa
 * varsayilan metnine geri donsun — bos bir baslik yayinlanmasin.
 */
export async function saveSayfaMetinleriAction(formData: FormData) {
  await guard();
  for (const alan of TUM_ALANLAR) {
    const deger = String(formData.get(alan.anahtar) ?? "").trim();
    if (deger === "" || deger === alan.varsayilan) await deleteContent(alan.anahtar);
    else await setContent(alan.anahtar, deger);
  }
  revalidatePath("/", "layout");
  redirect("/admin/sayfalar?kaydedildi=1");
}

// ---------- MENU ----------
/**
 * Menu duzenleyici. Form alanlari duz isimli geliyor:
 *   ust_<i>_etiket / ust_<i>_href / ust_<i>_ozel
 *   alt_<i>_<j>_etiket / alt_<i>_<j>_href / alt_<i>_<j>_not
 * Etiketi bos birakilan ust oge ve etiketi/adresi bos alt oge atlanir —
 * silme islemi boylece "kutuyu bosalt" ile yapiliyor, ayri bir dugme gerekmiyor.
 */
export async function saveMenuAction(formData: FormData) {
  await guard();
  const menu: MenuOge[] = [];
  for (let i = 0; i < 8; i++) {
    const etiket = String(formData.get(`ust_${i}_etiket`) ?? "").trim();
    if (!etiket) continue;
    const oge: MenuOge = { label: etiket };
    if (String(formData.get(`ust_${i}_ozel`) ?? "") === "hizmetler") oge.ozel = "hizmetler";
    const href = String(formData.get(`ust_${i}_href`) ?? "").trim();
    if (href) oge.href = href;
    const alt: MenuAlt[] = [];
    for (let j = 0; j < 8; j++) {
      const ae = String(formData.get(`alt_${i}_${j}_etiket`) ?? "").trim();
      const ah = String(formData.get(`alt_${i}_${j}_href`) ?? "").trim();
      if (!ae || !ah) continue;
      const an = String(formData.get(`alt_${i}_${j}_not`) ?? "").trim();
      alt.push({ href: ah, label: ae, not: an || undefined });
    }
    if (alt.length) oge.alt = alt;
    menu.push(oge);
  }
  if (menu.length) await menuYaz(menu);
  revalidatePath("/", "layout");
  redirect("/admin/menu?kaydedildi=1");
}
