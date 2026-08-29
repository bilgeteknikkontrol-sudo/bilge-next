/**
 * Hata nesnesini teshis edilebilir tek satira cevirir.
 *
 * ⚠️ NEDEN VAR: 2026-08-29'da teklif kaydi duserken sebebi ogrenmek icin
 * yanita `e.message` eklendi ve alan BOS geldi — hata mesaji bos oldugu icin.
 * Elde yine hicbir bilgi kalmadi, bir dagitim turu bosa gitti.
 *
 * mysql2 hatalari bilgiyi cogu zaman `message` yerine `code` / `errno` /
 * `sqlState` / `sqlMessage` alanlarinda tasir (ornegin
 * `ER_USER_LIMIT_REACHED`, `ER_NO_SUCH_TABLE`, `PROTOCOL_CONNECTION_LOST`).
 * Bu yuzden tek bir alana guvenmek yerine ne bulunursa toplaniyor ve hicbiri
 * yoksa nesnenin kendisi son care olarak yaziliyor. Sonuc HER ZAMAN dolu bir
 * metindir; "bos hata" diye bir cikti olamaz.
 */
export function hataMetni(e: unknown): string {
  const p: string[] = [];
  const o = e as Record<string, unknown> | null | undefined;

  if (o && typeof o === "object") {
    for (const alan of ["name", "code", "errno", "sqlState", "sqlMessage", "message"]) {
      const d = o[alan];
      if (d !== undefined && d !== null && String(d) !== "") p.push(`${alan}=${String(d)}`);
    }
  }

  if (p.length === 0) {
    // Error olmayan bir sey firlatilmis olabilir (string, undefined, nesne).
    try {
      p.push(typeof e === "object" && e !== null ? JSON.stringify(e) : String(e));
    } catch {
      p.push(Object.prototype.toString.call(e));
    }
  }

  const metin = p.join(" | ").trim();
  return (metin === "" ? Object.prototype.toString.call(e) : metin).slice(0, 400);
}
