/**
 * E-posta gonderimi.
 *
 * ⚠️ Bu dosya yazilana kadar site HIC e-posta gondermiyordu. app/api/teklif
 * icinde yalnizca "Uretimde burada e-posta bildirimi" diye bir not vardi;
 * gelen teklif talepleri sessizce bir dosyaya yaziliyor ve kimseye
 * bildirilmiyordu.
 *
 * IKI YOL destekleniyor, hangisi tanimliysa o kullaniliyor:
 *
 *  A) SMTP (onerilen) — firmanin KENDI posta kutusu.
 *     bilgeteknikkontrol.com postasi Hostinger'da (MX: mx1.hostinger.com).
 *     Kendi kutusundan gonderdigi icin SPF/DKIM dogal olarak gecerli,
 *     e-postalar spam'e dusmez ve ek bir servise kayit olmak gerekmez.
 *       SMTP_HOST=smtp.hostinger.com
 *       SMTP_PORT=465
 *       SMTP_USER=info@bilgeteknikkontrol.com
 *       SMTP_PASS=<posta kutusu sifresi>
 *
 *  B) RESEND_API_KEY — HTTP API. SMTP kullanilamiyorsa.
 *
 * Ortak (istege bagli):
 *       TEKLIF_ALICI    -> bildirimlerin gidecegi adres(ler), virgulle
 *       TEKLIF_GONDEREN -> gonderen adi/adresi
 *
 * Hicbiri tanimli degilse gonderim atlanir ve sebep `hata` alaninda doner;
 * cagiran taraf buna gore davranir (bkz. app/api/teklif/route.ts).
 */

export type EpostaSonuc = { gonderildi: boolean; hata?: string; yol?: "smtp" | "resend" };

/**
 * SMTP ayarlarini panel kopyalama kazalarina karsi temizler.
 *
 * ⚠️ 2026-08-29: Hostinger'da gonderim `535 5.7.8 authentication failed` ile
 * dusuyordu, AYNI bilgiler Vercel'de calisiyorken. Yani deger dogru, kopyasi
 * bozuk. Bu projede tam olarak ayni sey `MYSQL_USER` degerinde de yasandi
 * (`u238725264_ bilgekontrol1`) ve sebebi bulmak saatler aldi — bosluk gozle
 * gorunmuyor, hata da "kimlik hatasi" diye ciktigi icin herkes sifreyi sorgular.
 *
 * Sunucu adi, port ve kullanici adinda bosluk ASLA gecerli degildir; tamamen
 * kirpiliyor. Sifrede bosluk gecerli OLABILIR, o yuzden ona dokunulmuyor —
 * yalnizca satir sonlari atiliyor: bir SMTP sifresinde satir sonu bulunamaz,
 * varsa kesin kopyalama artigidir.
 */
function smtpAyar(ad: "SMTP_HOST" | "SMTP_PORT" | "SMTP_USER"): string | undefined {
  const v = process.env[ad]?.trim();
  return v ? v : undefined;
}

function smtpSifre(): string | undefined {
  const v = process.env.SMTP_PASS?.replace(/[\r\n]/g, "");
  return v ? v : undefined;
}

/** Bildirimlerin gidecegi adres. Kullanici acikca bu adresi istedi. */
export const VARSAYILAN_ALICI = "info@bilgeteknikkontrol.com";

export function alicilar(): string[] {
  return (process.env.TEKLIF_ALICI || VARSAYILAN_ALICI)
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}

/**
 * Panelde gosterilecek kurulum durumu.
 *
 * `eksik` alani ONEMLI: "kurulu degil" demek yeterli degildi, kullanicinin
 * hangi degerin eksik oldugunu tahmin etmesi gerekiyordu. Artik tam olarak
 * hangi ortam degiskeninin girilmedigi yaziliyor.
 */
export function epostaAyari(): {
  hazir: boolean;
  yol: "smtp" | "resend" | "yok";
  alici: string[];
  eksik: string[];
} {
  const smtpAlanlari = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;
  // Yalnizca bosluk iceren bir deger "girilmis" sayilmamali.
  const smtpEksik = smtpAlanlari.filter((a) =>
    a === "SMTP_PASS" ? !smtpSifre() : !smtpAyar(a as "SMTP_HOST" | "SMTP_USER")
  );

  if (smtpEksik.length === 0) {
    return { hazir: true, yol: "smtp", alici: alicilar(), eksik: [] };
  }
  if (process.env.RESEND_API_KEY) {
    return { hazir: true, yol: "resend", alici: alicilar(), eksik: [] };
  }
  // SMTP kismen girilmisse eksik olani soyle; hic girilmemisse hepsini iste.
  return {
    hazir: false,
    yol: "yok",
    alici: alicilar(),
    eksik: smtpEksik.length === smtpAlanlari.length ? [...smtpAlanlari, "SMTP_PORT"] : smtpEksik,
  };
}

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
  const ayar = epostaAyari();
  if (!ayar.hazir) {
    return {
      gonderildi: false,
      hata: "E-posta gönderimi kurulu değil (SMTP_* veya RESEND_API_KEY tanımlı değil).",
    };
  }

  const alici = ayar.alici;
  const gonderenAdi = process.env.TEKLIF_GONDEREN || "Bilge Teknik Kontrol";

  // ---------- A) SMTP ----------
  if (ayar.yol === "smtp") {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const port = Number(smtpAyar("SMTP_PORT") || 465);
      const kullanici = smtpAyar("SMTP_USER")!;
      const tasiyici = nodemailer.createTransport({
        host: smtpAyar("SMTP_HOST"),
        port,
        // 465 dogrudan TLS; 587 STARTTLS ile yukseltiliyor.
        secure: port === 465,
        auth: { user: kullanici, pass: smtpSifre()! },
        // Sunucusuz ortamda asili kalmasin.
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
      await tasiyici.sendMail({
        // Gonderen, kimlik dogrulanan kutuyla AYNI olmali; aksi halde sunucu
        // reddeder veya e-posta spam'e duser.
        from: `"${gonderenAdi}" <${kullanici}>`,
        to: alici.join(", "),
        subject: konu,
        html,
        text: metin,
        ...(yanitla ? { replyTo: yanitla } : {}),
      });
      return { gonderildi: true, yol: "smtp" };
    } catch (e) {
      return {
        gonderildi: false,
        yol: "smtp",
        hata: e instanceof Error ? e.message : "SMTP gönderimi başarısız",
      };
    }
  }

  // ---------- B) Resend ----------
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.TEKLIF_GONDEREN || "Bilge Teknik Kontrol <onboarding@resend.dev>",
        to: alici,
        subject: konu,
        html,
        text: metin,
        ...(yanitla ? { reply_to: yanitla } : {}),
      }),
    });
    if (!res.ok) {
      const govde = await res.text().catch(() => "");
      return { gonderildi: false, yol: "resend", hata: `Resend ${res.status}: ${govde.slice(0, 200)}` };
    }
    return { gonderildi: true, yol: "resend" };
  } catch (e) {
    return { gonderildi: false, yol: "resend", hata: e instanceof Error ? e.message : "bilinmeyen hata" };
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
