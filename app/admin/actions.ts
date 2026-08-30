"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import {
  saveArticle,
  getArticles,
  deleteArticle,
  saveEquipment,
  getEquipment,
  deleteEquipment,
  saveLocation,
  getLocations,
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
  tumBloklar,
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

  /**
   * Yazi gorseli DOGRUDAN bu formdan yuklenebiliyor.
   *
   * ⚠️ Onceden tek yol Medya ekranina gidip yukleyip adresi kopyalamakti.
   * Blok (slayt) formunda dosya secme zaten vardi; makale formunda olmamasi
   * tutarsizdi. Dosya secilmezse alanda yazan adres korunur.
   */
  const yuklenenGorsel = await dosyaYukle(formData, "gorselDosya", title || slug, title);
  if (yuklenenGorsel === "buyuk") {
    redirect(`/admin/articles?edit=${encodeURIComponent(slug)}&hata=buyuk`);
  }

  const article: Article = {
    slug,
    title,
    // Bos birakilirsa undefined -> arama sonucunda `title` kullanilir.
    seoTitle: String(formData.get("seoTitle") || "").trim() || undefined,
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
    // Yeni dosya varsa o kazanir; yoksa alanda yazan adres korunur.
    // Ikisi de bossa undefined -> sayfada slug eslesmeli varsayilan gorsel kullanilir.
    image: yuklenenGorsel || String(formData.get("image") || "").trim() || undefined,
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
  redirect("/admin/articles");
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

  // Hizmet gorseli dosya secerek yuklenebiliyor; secilmezse adres alani,
  // o da bossa koddaki slug eslesmeli varsayilan gorsel kullanilir.
  const yuklenen = await dosyaYukle(formData, "gorselDosya", ad || slug, ad);
  if (yuklenen === "buyuk") {
    redirect(`/admin/equipment?edit=${encodeURIComponent(slug)}&hata=buyuk`);
  }

  const e: Equipment = {
    slug,
    ad,
    kategori: String(formData.get("kategori") || "Genel"),
    standart: String(formData.get("standart") || ""),
    periyot: num(formData.get("periyot"), 12),
    periyotNot: String(formData.get("periyotNot") || "") || undefined,
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
    sira: num(formData.get("sira")),
    image: yuklenen || String(formData.get("image") || "").trim() || undefined,
    // Bos birakilan alan koddaki varsayilana duser (bkz. app/ekipman/[slug]).
    lead: String(formData.get("lead") || "").trim() || undefined,
    body: String(formData.get("body") || "").trim() || undefined,
    faq: parseFaq(String(formData.get("faq") || "")),
  };
  await saveEquipment(e);
  revalidatePath("/");
  revalidatePath("/ekipman");
  revalidatePath(`/ekipman/${slug}`);
  redirect("/admin/equipment");
}

export async function deleteEquipmentAction(formData: FormData) {
  await guard();
  const slug = String(formData.get("slug") || "");
  if (slug) await deleteEquipment(slug);
  revalidatePath("/");
  revalidatePath("/ekipman");
  redirect("/admin/equipment");
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
  redirect("/admin/locations");
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
  /**
   * Logo ve favicon dosya secerek yuklenebiliyor.
   * ⚠️ Onceden yalnizca adres yazilabiliyordu; gorsel eklemek icin Medya
   * ekranina gidip adresi kopyalamak gerekiyordu. Dosya secilmezse adres
   * alani, o da bossa mevcut deger korunur.
   */
  const yeniLogo = await dosyaYukle(formData, "logoDosya", "logo", "Logo");
  const yeniFavicon = await dosyaYukle(formData, "faviconDosya", "favicon", "Favicon");
  if (yeniLogo === "buyuk" || yeniFavicon === "buyuk") {
    redirect("/admin/settings?hata=buyuk");
  }

  const s: SiteSettings = {
    colors,
    fonts,
    logo: yeniLogo || String(formData.get("logo") || cur.logo),
    favicon: yeniFavicon || String(formData.get("favicon") || cur.favicon),
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
  // Renk, logo ve iletisim bilgisi TUM sayfalarda kullaniliyor; yalnizca
  // ana sayfayi tazelemek yetmiyordu.
  revalidatePath("/", "layout");
  redirect("/admin/settings?kaydedildi=1");
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

/**
 * Formdan gelen dosyayi kaydeder ve adresini doner.
 *
 * ⚠️ Dosya secilmemis olsa bile tarayici BOS bir File nesnesi gonderiyor;
 * boyut kontrolu olmadan bu "data:...;base64," seklinde BOZUK bir gorsel
 * kaydediyordu. Bu yuzden `size > 0` sart.
 *
 * Boyut siniri 6 MB: gorsel veritabaninda base64 olarak duruyor ve base64 ham
 * dosyayi ~%33 buyutuyor. Sinirsiz birakilirsa tek bir telefon fotografi
 * (8-12 MB) MySQL'in `max_allowed_packet` sinirina takilip kaydi SESSIZCE
 * dusurur.
 *
 * Donus: kaydedildiyse adres (`/api/gorsel/<id>`), dosya yoksa null,
 * cok buyukse "buyuk".
 */
const YUKLEME_SINIRI = 6 * 1024 * 1024;

async function dosyaYukle(
  formData: FormData,
  alan: string,
  ad: string,
  alt: string
): Promise<string | null | "buyuk"> {
  const file = formData.get(alan);
  if (!(file && typeof file === "object" && "arrayBuffer" in file)) return null;
  const f = file as File;
  if (f.size === 0) return null;
  if (f.size > YUKLEME_SINIRI) return "buyuk";
  const buf = Buffer.from(await f.arrayBuffer());
  const mime = f.type || "image/png";
  const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
  return await saveMedia({ name: ad || f.name || "gorsel", url: dataUrl, dataUrl, alt });
}

// ---------- MEDIA ----------
export async function saveMediaAction(formData: FormData) {
  await guard();
  const name = String(formData.get("name") || "gorsel");
  const alt = String(formData.get("alt") || "");
  const url = String(formData.get("url") || "").trim();
  const yuklenen = await dosyaYukle(formData, "file", name, alt);
  if (yuklenen === "buyuk") redirect("/admin/media?hata=buyuk");
  if (yuklenen) {
    revalidatePath("/", "layout");
    redirect("/admin/media");
  }
  // Dosya yok: harici adres verilmis olmali.
  if (!url) {
    redirect("/admin/media?hata=bos");
  }
  await saveMedia({ name, url, dataUrl: null, alt });
  revalidatePath("/", "layout");
  redirect("/admin/media");
}

export async function deleteMediaAction(formData: FormData) {
  await guard();
  const id = num(formData.get("id"));
  if (id) await deleteMedia(id);
  // ⚠️ Onceden ne tazeleme ne yonlendirme vardi; silinen gorsel listede
  // kalmaya devam ediyordu.
  revalidatePath("/", "layout");
  redirect("/admin/media");
}

// ---------------- Bloklar (referans / ekip / sertifika / hero / sss) ----------------

export async function saveBlokAction(formData: FormData) {
  await guard();
  const tur = String(formData.get("tur") || "referans") as BlokTuru;
  const baslik = String(formData.get("baslik") || "").trim();
  const mevcutGorsel = String(formData.get("gorsel") || "").trim();

  /**
   * Gorsel DOGRUDAN bu formdan yuklenebiliyor.
   *
   * ⚠️ Onceden tek yol suydu: Medya ekranina git, yukle, olusan adresi kopyala,
   * buraya don, yapistir. Dort adim ve arada pano gerekiyordu; kullanici haklı
   * olarak "gorsel ekle deyince bilgisayardan secsin" dedi. Adres alani yine
   * duruyor (harici adres veya mevcut gorseli koruma icin) ama artik zorunlu
   * degil: dosya secilirse yuklenip adresi otomatik yaziliyor.
   */
  const yuklenen = await dosyaYukle(formData, "gorselDosya", baslik || "blok-gorsel", baslik);
  if (yuklenen === "buyuk") {
    // donusAdresi ikinci argumani CAPA olarak ekliyor; hata mesaji icin sorgu
    // parametresi gerekiyor, bu yuzden adres burada elle kuruluyor.
    const d = String(formData.get("donus") || "");
    const geri = d.startsWith("/admin/") && !d.includes("//") ? d : `/admin/bloklar?tur=${tur}`;
    redirect(`${geri}${geri.includes("?") ? "&" : "?"}hata=buyuk#${tur}`);
  }

  const blok: Blok = {
    id: String(formData.get("id") || "") || yeniId(),
    tur: BLOK_TURLERI.includes(tur) ? tur : "referans",
    baslik,
    metin: String(formData.get("metin") || "").trim(),
    // Yeni dosya varsa o kazanir; yoksa alanda yazan adres korunur.
    gorsel: yuklenen || mevcutGorsel,
    url: String(formData.get("url") || "").trim(),
    sira: num(formData.get("sira")),
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
  };
  await blokKaydet(blok);
  revalidateBloklar();
  // "donus" doluysa cagiran sayfa ekranina geri don; degilse eski toplu ekran.
  redirect(donusAdresi(formData, `/admin/bloklar?tur=${blok.tur}`, blok.tur));
}

export async function deleteBlokAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const tur = String(formData.get("tur") || "referans");
  if (id) await blokSil(id);
  revalidateBloklar();
  redirect(donusAdresi(formData, `/admin/bloklar?tur=${tur}`, tur));
}

export async function toggleBlokAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const tur = String(formData.get("tur") || "referans");
  if (id) await blokDurumDegistir(id);
  revalidateBloklar();
  redirect(donusAdresi(formData, `/admin/bloklar?tur=${tur}`, tur));
}

/**
 * Blok formu hangi ekrandan gonderildiyse oraya geri donulur.
 * Guvenlik: yalnizca /admin ile baslayan ic adresler kabul edilir; disaridan
 * gelen bir "donus" degeriyle baska siteye yonlendirme yapilamaz.
 */
function donusAdresi(formData: FormData, varsayilan: string, capa?: string): string {
  const d = String(formData.get("donus") || "");
  if (!d.startsWith("/admin/") || d.includes("//")) return varsayilan;
  return capa ? `${d}#${capa}` : d;
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

// ---------- TEK SAYFANIN ICERIGI (Admin > Sayfalar > ...) ----------
/**
 * Bir site sayfasinin yazilarini ve o sayfaya ait ayar alanlarini kaydeder.
 *
 * saveSayfaMetinleriAction TUM alanlari tek formda aliyordu; sayfa ekranlari
 * ise yalnizca kendi alanlarini gonderiyor. Bu yuzden burada "formda gelen
 * alanlar" isleniyor, gelmeyenlere DOKUNULMUYOR — yoksa bir sayfayi
 * kaydetmek diger sayfalarin metinlerini silerdi.
 *
 * Metin alanlari: bos birakilan veya varsayilanla ayni olan kayittan silinir
 * (sayfa varsayilan metnine doner). Ayar alanlari (telefon, hero basligi...)
 * SiteSettings icinde durur ve bos gonderilirse eski degeri korunur.
 */
export async function saveSayfaIcerikAction(formData: FormData) {
  await guard();
  const sayfaId = String(formData.get("sayfaId") || "");
  const { sayfaBul } = await import("@/lib/admin-sayfalar");
  const sayfa = sayfaBul(sayfaId);
  if (!sayfa) redirect("/admin");

  // --- metin alanlari ---
  const metinAnahtarlari = sayfa.bolumler.flatMap((b) => (b.tip === "metin" ? b.anahtarlar : []));
  const varsayilanlar = new Map(TUM_ALANLAR.map((a) => [a.anahtar, a.varsayilan]));
  for (const anahtar of metinAnahtarlari) {
    if (!formData.has(anahtar)) continue;
    const deger = String(formData.get(anahtar) ?? "").trim();
    if (deger === "" || deger === varsayilanlar.get(anahtar)) await deleteContent(anahtar);
    else await setContent(anahtar, deger);
  }

  // --- ayar alanlari (SiteSettings) ---
  const ayarAdlari = sayfa.bolumler.flatMap((b) => (b.tip === "ayar" ? b.alanlar.map((a) => a.ad) : []));
  if (ayarAdlari.length) {
    const mevcut = await getSettings().catch(() => defaultSettings());
    const yeni: SiteSettings = { ...mevcut };
    for (const ad of ayarAdlari) {
      if (!formData.has(`ayar_${ad}`)) continue;
      const v = String(formData.get(`ayar_${ad}`) ?? "").trim();
      if (v !== "") (yeni as unknown as Record<string, unknown>)[ad] = v;
    }
    await saveSettings(yeni);
  }

  revalidatePath("/", "layout");
  redirect(`/admin/sayfa/${sayfaId}?kaydedildi=1`);
}

// ---------- HIZMET METINLERINI KODDAN AKTAR ----------
/**
 * Koddaki hizmet sayfasi metinlerini (lib/ekipman-icerik.ts) veritabanina
 * kopyalar, boylece panelden DUZENLENEBILIR hale gelirler.
 *
 * ⚠️ Bu olmadan panel alanlari BOS gorunur ve kullanicinin sayfa dolusu metni
 * sifirdan yazmasi gerekirdi. Kullanici "bu yazilari nerede duzenleyebilirim"
 * diye sordugunda sorun tam olarak buydu: metin kodda, panelde gorunmuyor.
 *
 * Yalnizca ALANI BOS OLAN kayitlara yaziyor; panelden daha once duzenlenmis
 * bir hizmetin metnini EZMIYOR. Bu yuzden birden fazla kez calistirmak
 * guvenli.
 */
export async function hizmetMetinleriniAktarAction() {
  await guard();
  const { EKIPMAN_ICERIK } = await import("@/lib/ekipman-icerik");
  const hepsi = await getEquipment().catch(() => []);

  let aktarilan = 0;
  for (const e of hepsi) {
    const k = EKIPMAN_ICERIK[e.slug];
    if (!k) continue;
    const bosLead = !e.lead?.trim();
    const bosBody = !e.body?.trim();
    const bosFaq = !e.faq?.length;
    if (!bosLead && !bosBody && !bosFaq) continue;
    await saveEquipment({
      ...e,
      lead: bosLead ? k.lead : e.lead,
      body: bosBody ? k.bodyHtml : e.body,
      faq: bosFaq ? k.faq : e.faq,
    });
    aktarilan++;
  }
  revalidatePath("/", "layout");
  redirect(`/admin/equipment?aktarildi=${aktarilan}`);
}

// ---------- YAZILARI KODDAN AKTAR ----------
/**
 * Kod icindeki guncel yazi metinlerini veritabanina aktarir.
 *
 * ⚠️ NEDEN GEREKLI: `lib/content.ts` yalnizca ILK KURULUM TOHUMUDUR
 * (`seedIfEmpty`). Veritabani bir kez doldurulduktan sonra site yazilari
 * ORADAN okur; kod dosyasindaki degisiklikler canliya HIC yansimaz.
 *
 * 2026-08-30'da bu tam olarak yasandi: dort ince yazi genisletildi ve otuz
 * yaziya kisa arama basligi (`seoTitle`) eklendi, derleme ve dagitim sorunsuz
 * gecti, ama canlida hicbir sey degismedi — veritabanindaki eski satirlar
 * okunuyordu.
 *
 * ⚠️ Bu islem, kodda tanimli slug'lara sahip yazilarin PANELDEKI halini
 * KODDAKI haliyle degistirir. O yazilarda panelden yapilmis duzenlemeler
 * kaybolur. Kodda bulunmayan yazilara dokunulmaz.
 */
export async function yazilariKoddanAktarAction() {
  await guard();
  const { ARTICLES } = await import("@/lib/content");
  const mevcut = await getArticles(false).catch(() => []);
  const siraMap = new Map(mevcut.map((a) => [a.slug, a.sira]));
  const aktifMap = new Map(mevcut.map((a) => [a.slug, a.aktif]));

  for (const [i, a] of ARTICLES.entries()) {
    await saveArticle({
      ...a,
      // Panelden yapilmis siralama ve yayin durumu KORUNUYOR; yalnizca metin
      // alanlari koddaki haliyle degistiriliyor.
      sira: siraMap.get(a.slug) ?? i,
      aktif: aktifMap.get(a.slug) ?? true,
    });
  }
  revalidatePath("/", "layout");
  redirect("/admin/articles?aktarildi=" + ARTICLES.length);
}

// ---------- BOLGELERI KODDAN AKTAR ----------
/**
 * Koddaki bolge listesini veritabanina aktarir.
 *
 * ⚠️ NEDEN GEREKLI: `lib/content.ts` icindeki LOCATIONS yalnizca ilk kurulum
 * tohumudur; `seedIfEmpty()` tablolari bir kez doldurduktan sonra bolgeler
 * VERITABANINDAN okunur. Yani koda yeni bir ilce eklemek canliya HIC
 * yansimaz — makale metinlerinde defalarca yasanan durumun aynisi.
 * Makaleler ve sertifikalar icin bu dugme zaten vardi, bolgeler icin yoktu;
 * 2026-08-30'da sekiz Istanbul ilcesi eklenirken acildi.
 *
 * ⚠️ Panelden yapilmis duzenlemeler KORUNUR: yalnizca kodda olup
 * veritabaninda OLMAYAN bolgeler eklenir. Mevcut bir kaydin metnine
 * dokunulmaz — aksi halde panelden yazilmis bir bolge tanitimi sessizce
 * koddaki haliyle ezilirdi.
 */
export async function bolgeleriKoddanAktarAction() {
  await guard();
  const { LOCATIONS } = await import("@/lib/content");
  const mevcut = await getLocations().catch(() => []);
  const varOlan = new Set(mevcut.map((l) => l.slug));

  let eklenen = 0;
  let sira = mevcut.length;
  for (const l of LOCATIONS) {
    if (varOlan.has(l.slug)) continue;
    await saveLocation({ ...l, ilce: l.ilce, aktif: true, sira: sira++ });
    eklenen++;
  }

  revalidatePath("/", "layout");
  redirect(`/admin/locations?aktarildi=${eklenen}`);
}

// ---------- TEKLIF TALEPLERI ----------
/**
 * Gelen bir teklif talebini siler.
 *
 * ⚠️ Panelde silme yoktu; test kayitlarini temizlemek icin veritabaninda elle
 * SQL calistirmak gerekiyordu. Musteri verisi iceren bir tabloda bu gereksiz
 * bir risk (yanlis WHERE ile tum tablo silinebilir).
 */
export async function deleteTeklifAction(formData: FormData) {
  await guard();
  const { deleteTeklif } = await import("@/lib/store");
  const ref = String(formData.get("ref") || "").trim();
  if (ref) await deleteTeklif(ref);
  redirect("/admin/teklifler?silindi=1");
}

// ---------- TEKLIF FORMU EK BILGI SORULARI ----------
/**
 * Ekipmana bagli ek bilgi sorulari (m², kat sayisi, dedektor adedi...).
 * Panelden yonetilebilir olmasi onemli: yeni bir soru gerektiginde kod
 * degisikligi ve dagitim beklemek gerekmesin.
 */
export async function saveTeklifSoruAction(formData: FormData) {
  await guard();
  const { soruKaydet, yeniSoruId } = await import("@/lib/teklif-sorulari");
  const tip = String(formData.get("tip") || "metin");
  await soruKaydet({
    id: String(formData.get("id") || "") || yeniSoruId(),
    ekipmanSlug: String(formData.get("ekipmanSlug") || "").trim(),
    etiket: String(formData.get("etiket") || "").trim(),
    tip: tip === "sayi" ? "sayi" : "metin",
    ornek: String(formData.get("ornek") || "").trim(),
    sira: num(formData.get("sira")),
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
  });
  revalidatePath("/teklif");
  redirect("/admin/teklif-sorulari?kaydedildi=1");
}

export async function deleteTeklifSoruAction(formData: FormData) {
  await guard();
  const { soruSil } = await import("@/lib/teklif-sorulari");
  const id = String(formData.get("id") || "");
  if (id) await soruSil(id);
  revalidatePath("/teklif");
  redirect("/admin/teklif-sorulari");
}

export async function toggleTeklifSoruAction(formData: FormData) {
  await guard();
  const { soruDurumDegistir } = await import("@/lib/teklif-sorulari");
  const id = String(formData.get("id") || "");
  if (id) await soruDurumDegistir(id);
  revalidatePath("/teklif");
  redirect("/admin/teklif-sorulari");
}

// ---------- SERTIFIKALARI PANELE AKTAR ----------
/**
 * /sertifikalar sayfasi, panelde hic belge yokken koddaki varsayilan 5 belgeyi
 * gosteriyor. Kullanici bunlari panelden duzenlemek istedi; bu eylem onlari
 * gercek kayda cevirir. Zaten kayit varsa hicbir sey yapmaz.
 */
export async function sertifikalariAktarAction() {
  await guard();
  const mevcut = (await tumBloklar().catch(() => [])).filter((b) => b.tur === "sertifika");
  if (mevcut.length === 0) {
    const dosyalar = [
      "akreditasyon-sertifikasi",
      "kapsam-kaldirma-iletme",
      "kapsam-kazanlar",
      "kapsam-yangin",
      "kapsam-basincli-kaplar",
    ];
    for (let i = 0; i < dosyalar.length; i++) {
      await blokKaydet({
        id: yeniId(),
        tur: "sertifika",
        baslik: `TÜRKAK Akreditasyon Sertifikası ${i + 1}`,
        metin: "",
        gorsel: `/img/belgeler/${dosyalar[i]}.webp`,
        url: "",
        sira: i + 1,
        aktif: true,
      });
    }
  }
  revalidatePath("/sertifikalar");
  redirect("/admin/sayfa/akreditasyon?kaydedildi=1#sertifika");
}

// ---------- E-POSTA TESTI ----------
/**
 * Panelden tek tikla test e-postasi gonderir.
 *
 * Boyle bir dugme olmadan kullanicinin kurulumu dogrulamasinin tek yolu
 * siteye sahte bir teklif talebi girmekti; bu da gercek taleplerin arasina
 * cop kayit birakiyordu.
 *
 * Sonuc adres cubugunda donuyor (basari/hata), boylece hata mesaji
 * dogrudan gorunuyor.
 */
export async function testEpostaAction() {
  await guard();
  const { epostaGonder, teklifEpostaHtml, teklifEpostaMetin } = await import("@/lib/eposta");
  const ornek = {
    ref: "TEST-" + Date.now().toString(36).toUpperCase(),
    firma: "TEST — kurulum doğrulama",
    ad: "Panel testi",
    tel: "0212 872 52 04",
    eposta: "info@bilgeteknikkontrol.com",
    bolge: "İstanbul",
    not: "Bu e-postayı görüyorsanız teklif bildirimleri çalışıyor demektir.",
    ekipmanlar: ["Forklift", "Buhar Kazanı"],
    tarih: new Date().toISOString(),
  };
  const sonuc = await epostaGonder({
    konu: "Test — teklif bildirimi kurulumu",
    html: teklifEpostaHtml(ornek),
    metin: teklifEpostaMetin(ornek),
  });
  const p = sonuc.gonderildi
    ? "test=ok"
    : `test=hata&mesaj=${encodeURIComponent(sonuc.hata || "bilinmeyen")}`;
  redirect(`/admin/teklifler?${p}`);
}
