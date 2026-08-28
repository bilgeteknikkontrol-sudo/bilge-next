/**
 * E-posta gonderimi.
 *
 * ⚠️ Bu dosya yazilana kadar site HIC e-posta gondermiyordu. app/api/teklif
 * icinde yalnizca "Uretimde burada e-posta bildirimi" diye bir not vardi;
 * gelen teklif talepleri sessizce bir dosyaya yaziliyor ve kimseye
 * bildirilmiyordu.
 *
 * Gonderim Resend'in HTTP API'siyle yapiliyor — ek bir paket kurulmadi,
 * duz bir fetch cagrisi. SMTP yerine HTTP secildi cunku Vercel'in sunucusuz
 * ortaminda SMTP baglantilari sik sik zaman asimina ugruyor.
 *
 * KURULUM (kullanicinin yapmasi gereken):
 *   Vercel > Settings > Environment Variables
 *     RESEND_API_KEY   -> resend.com'dan alinan anahtar
 *     TEKLIF_ALICI     -> bildirimlerin gidecegi adres (bos ise site e-postasi)
 *     TEKLIF_GONDEREN  -> gonderen adres; alan adi Resend'de dogrulanmali
 *
 * Anahtar tanimli DEGILSE: gonderim sessizce atlanir ve `false` doner.
 * Talep yine kaydedilir ve panelde gorunur — yani anahtar eklenene kadar
 * hicbir talep kaybolmaz.
 */

export type EpostaSonuc = { gonderildi: boolean; hata?: string };

export async function epostaGonder({
  konu,
  html,
  metin,
  yanitla,
}: {
  konu: string;
  html: string;
  metin: string;
  /** Musterinin adresi — "Yanitla" dendiginde ona gitsin */
  yanitla?: string;
}): Promise<EpostaSonuc> {
  const anahtar = process.env.RESEND_API_KEY;
  if (!anahtar) return { gonderildi: false, hata: "RESEND_API_KEY tanımlı değil" };

  const alici = process.env.TEKLIF_ALICI || "info@bilgeteknikkontrol.com";
  const gonderen = process.env.TEKLIF_GONDEREN || "Bilge Teknik Kontrol <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anahtar}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: gonderen,
        to: alici.split(",").map((a) => a.trim()).filter(Boolean),
        subject: konu,
        html,
        text: metin,
        ...(yanitla ? { reply_to: yanitla } : {}),
      }),
    });
    if (!res.ok) {
      const govde = await res.text().catch(() => "");
      return { gonderildi: false, hata: `Resend ${res.status}: ${govde.slice(0, 200)}` };
    }
    return { gonderildi: true };
  } catch (e) {
    return { gonderildi: false, hata: e instanceof Error ? e.message : "bilinmeyen hata" };
  }
}

/* ------------------------------------------------------------------ */
/*  Teklif talebi e-postasi                                            */
/* ------------------------------------------------------------------ */

export type TeklifEposta = {
  ref: string;
  firma: string;
  ad: string;
  tel: string;
  eposta: string;
  bolge: string;
  not: string;
  ekipmanlar: string[];
  tarih: string;
};

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Tablo duzeninde HTML e-posta.
 *
 * E-posta istemcileri (Outlook, Gmail) modern CSS'i buyuk olcude yok sayar:
 * flexbox/grid calismaz, <style> blogu Gmail'de kirpilir. Bu yuzden duzen
 * <table> ile ve TUM stiller satir ici (inline) yazildi — 2026'da da e-posta
 * icin dogru yontem bu.
 */
export function teklifEpostaHtml(t: TeklifEposta): string {
  const satir = (etiket: string, deger: string, vurgu = false) => `
    <tr>
      <td style="padding:11px 16px;border-bottom:1px solid #e6ecf3;font:600 13px/1.4 Arial,Helvetica,sans-serif;color:#5a6b7c;width:150px;vertical-align:top;">${esc(etiket)}</td>
      <td style="padding:11px 16px;border-bottom:1px solid #e6ecf3;font:${vurgu ? "700" : "400"} 15px/1.5 Arial,Helvetica,sans-serif;color:#0b2a4a;">${deger}</td>
    </tr>`;

  const ekipmanListesi = t.ekipmanlar
    .map(
      (e) =>
        `<tr><td style="padding:7px 16px;border-bottom:1px solid #eef3f8;font:400 14px/1.4 Arial,Helvetica,sans-serif;color:#0b2a4a;">• ${esc(e)}</td></tr>`
    )
    .join("");

  const tarih = new Date(t.tarih).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f5f8fc;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8fc;padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dfe7ef;">

    <!-- Baslik -->
    <tr><td style="background:#0b2a4a;padding:22px 24px;">
      <div style="font:800 19px/1.3 Arial,Helvetica,sans-serif;color:#ffffff;">Yeni Teklif Talebi</div>
      <div style="font:400 13px/1.5 Arial,Helvetica,sans-serif;color:#c3d6ea;margin-top:4px;">
        Referans <strong style="color:#ef7f2d;">${esc(t.ref)}</strong> &nbsp;·&nbsp; ${esc(tarih)}
      </div>
    </td></tr>

    <!-- Musteri bilgileri -->
    <tr><td style="padding:20px 24px 4px;">
      <div style="font:700 12px/1 Arial,Helvetica,sans-serif;color:#566b7e;letter-spacing:1px;text-transform:uppercase;">Müşteri bilgileri</div>
    </td></tr>
    <tr><td style="padding:8px 8px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e6ecf3;border-radius:10px;border-collapse:separate;overflow:hidden;">
        ${satir("Firma", esc(t.firma), true)}
        ${satir("Yetkili", esc(t.ad) || "—")}
        ${satir("Telefon", `<a href="tel:${esc(t.tel)}" style="color:#0f5aa8;text-decoration:none;font-weight:700;">${esc(t.tel)}</a>`)}
        ${satir("E-posta", `<a href="mailto:${esc(t.eposta)}" style="color:#0f5aa8;text-decoration:none;font-weight:700;">${esc(t.eposta)}</a>`)}
        ${satir("Bölge", esc(t.bolge) || "—")}
      </table>
    </td></tr>

    <!-- Ekipmanlar -->
    <tr><td style="padding:22px 24px 4px;">
      <div style="font:700 12px/1 Arial,Helvetica,sans-serif;color:#566b7e;letter-spacing:1px;text-transform:uppercase;">
        Seçilen ekipmanlar (${t.ekipmanlar.length})
      </div>
    </td></tr>
    <tr><td style="padding:8px 8px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e6ecf3;border-radius:10px;border-collapse:separate;overflow:hidden;background:#f8fbfe;">
        ${ekipmanListesi || '<tr><td style="padding:10px 16px;font:400 14px Arial;color:#566b7e;">—</td></tr>'}
      </table>
    </td></tr>

    ${
      t.not
        ? `<tr><td style="padding:22px 24px 4px;">
             <div style="font:700 12px/1 Arial,Helvetica,sans-serif;color:#566b7e;letter-spacing:1px;text-transform:uppercase;">Müşteri notu</div>
           </td></tr>
           <tr><td style="padding:8px 24px 0;">
             <div style="border-left:3px solid #ef7f2d;background:#fff6ef;padding:12px 14px;border-radius:0 8px 8px 0;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:#0b2a4a;">${esc(t.not)}</div>
           </td></tr>`
        : ""
    }

    <!-- Eylem -->
    <tr><td style="padding:24px;">
      <a href="tel:${esc(t.tel)}" style="display:inline-block;background:#0f5aa8;color:#ffffff;font:700 15px Arial,Helvetica,sans-serif;text-decoration:none;padding:13px 26px;border-radius:999px;">Müşteriyi ara</a>
      <a href="mailto:${esc(t.eposta)}" style="display:inline-block;margin-left:8px;border:1px solid #dfe7ef;color:#0b2a4a;font:700 15px Arial,Helvetica,sans-serif;text-decoration:none;padding:12px 24px;border-radius:999px;">E-posta yaz</a>
    </td></tr>

    <tr><td style="background:#f8fbfe;border-top:1px solid #e6ecf3;padding:16px 24px;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#7d8b99;">
      Bu bildirim bilgekontrol.com üzerindeki online teklif formundan otomatik oluşturuldu.
      Talep, yönetim panelindeki <strong>Teklif Talepleri</strong> ekranında da kayıtlıdır.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

/** HTML gosteremeyen istemciler icin duz metin karsiligi. */
export function teklifEpostaMetin(t: TeklifEposta): string {
  return [
    `YENİ TEKLİF TALEBİ — ${t.ref}`,
    new Date(t.tarih).toLocaleString("tr-TR"),
    "",
    `Firma   : ${t.firma}`,
    `Yetkili : ${t.ad || "—"}`,
    `Telefon : ${t.tel}`,
    `E-posta : ${t.eposta}`,
    `Bölge   : ${t.bolge || "—"}`,
    "",
    `Ekipmanlar (${t.ekipmanlar.length}):`,
    ...t.ekipmanlar.map((e) => `  - ${e}`),
    ...(t.not ? ["", `Not: ${t.not}`] : []),
  ].join("\n");
}
