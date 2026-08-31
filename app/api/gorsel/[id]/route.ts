import { getMediaBytes } from "@/lib/cms";

/**
 * Panelden yuklenen gorselleri GERCEK DOSYA gibi servis eder.
 *
 * ⚠️ NEDEN VAR: yuklenen dosyalar veritabaninda base64 "data:" dizesi olarak
 * duruyor. Panel eskiden bu dizeyi "kopyalanacak adres" olarak veriyordu ve
 * blok/hero alanlarina yapistiginda gorsel HER sayfa isteginde HTML'in
 * ICINDE iniyordu:
 *   - HTML ~1.3 kat sisiyor (base64 sismesi)
 *   - tarayici gorseli ayri bir kaynak olarak onbellege ALAMIYOR
 *   - ayni gorsel her ziyarette bastan iniyor
 * Buradan servis edildiginde gorsel normal bir dosya gibi davraniyor: bir kez
 * inip uzun sure onbellekte kaliyor, HTML kucuk kaliyor.
 *
 * Icerik degismez kabul ediliyor (`immutable`): yeni bir gorsel her zaman yeni
 * bir id aliyor, ayni id'nin govdesi hic degismiyor.
 */
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    return new Response("Geçersiz görsel", { status: 400 });
  }

  /**
   * ⚠️ VERITABANI HATASI 404 DEGILDIR.
   *
   * Onceden her hata `.catch(() => null)` ile 404'e cevriliyordu. 404 ise
   * "bu gorsel silinmis" anlamina gelir ve arayan taraf (lib/bloklar.ts
   * gecersizGorselleriTemizle) atfi TEMIZLER. Yani veritabanina bir anlik
   * erisim sorunu, calisan bir gorseli "silinmis" saydirabiliyordu. Ayrica
   * teshis imkansizlasiyordu: 2026-08-31'de ayni gorsel arka arkaya kimi
   * istekte 200 kimi istekte 404 donuyordu ve sebebin veritabani mi yoksa
   * silinmis kayit mi oldugu disaridan ayirt edilemiyordu.
   */
  let g: Awaited<ReturnType<typeof getMediaBytes>>;
  try {
    g = await getMediaBytes(n);
  } catch {
    return new Response("Görsel şu an okunamadı", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
  if (!g) return new Response("Görsel bulunamadı", { status: 404 });

  return new Response(new Uint8Array(g.bytes), {
    headers: {
      "Content-Type": g.mime,
      "Content-Length": String(g.bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
