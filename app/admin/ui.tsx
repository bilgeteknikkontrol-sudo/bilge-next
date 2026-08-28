/**
 * Panelin ortak arayuz parcalari.
 *
 * Once her ekran kendi butonunu ve kartini yaziyordu; bir yerde bg-blue-600,
 * baska yerde bg-blue, baska yerde slate kullanilmisti ve ekranlar birbirine
 * benzemiyordu. Buradaki parcalar tek kaynak: yeni ekran yazarken bunlari
 * kullan, gorunum kendiliginden tutarli olur.
 *
 * Renkler sitenin paletinden geliyor (navy/blue/line...), panelden renk
 * degistirilince panel de onunla birlikte degisiyor.
 */
import Link from "next/link";

/* ---------------------------------------------------------------- baslik */

export function SayfaBasligi({
  baslik,
  aciklama,
  onizleme,
  eylem,
}: {
  baslik: string;
  aciklama?: string;
  /** Sitedeki karsiligi — "Sayfayi gor" baglantisi */
  onizleme?: string;
  eylem?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-black tracking-tight text-navy">{baslik}</h1>
        {aciklama && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{aciklama}</p>}
      </div>
      <div className="flex flex-none flex-wrap items-center gap-2">
        {onizleme && (
          <a
            href={onizleme}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue hover:text-blue"
          >
            Sayfayı gör ↗
          </a>
        )}
        {eylem}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ kart */

export function Kart({
  baslik,
  aciklama,
  children,
  sag,
}: {
  baslik?: string;
  aciklama?: string;
  children: React.ReactNode;
  sag?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(11,42,74,.04)]">
      {(baslik || sag) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {baslik && <h2 className="font-bold text-navy">{baslik}</h2>}
            {aciklama && <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{aciklama}</p>}
          </div>
          {sag}
        </div>
      )}
      {children}
    </section>
  );
}

/* --------------------------------------------------------------- butonlar */

const BUTON_TEMEL =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50";

export function Buton({
  children,
  tur = "birincil",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tur?: "birincil" | "ikincil" | "tehlike" }) {
  const stil =
    tur === "birincil"
      ? "bg-blue text-white hover:brightness-110"
      : tur === "tehlike"
        ? "bg-red-50 text-red-700 hover:bg-red-100"
        : "border border-slate-300 bg-white text-slate-700 hover:border-blue hover:text-blue";
  return (
    <button {...rest} className={`${BUTON_TEMEL} ${stil} ${rest.className ?? ""}`}>
      {children}
    </button>
  );
}

export function ButonLink({ href, children, tur = "ikincil" }: { href: string; children: React.ReactNode; tur?: "birincil" | "ikincil" }) {
  const stil =
    tur === "birincil"
      ? "bg-blue text-white hover:brightness-110"
      : "border border-slate-300 bg-white text-slate-700 hover:border-blue hover:text-blue";
  return (
    <Link href={href} className={`${BUTON_TEMEL} ${stil}`}>
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------------- alanlar */

const GIRDI =
  "w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/20";

export function Alan({
  ad,
  etiket,
  not,
  deger,
  uzun,
  satir = 3,
  yerTutucu,
  gerekli,
}: {
  ad: string;
  etiket: string;
  not?: string;
  deger?: string;
  uzun?: boolean;
  satir?: number;
  yerTutucu?: string;
  gerekli?: boolean;
}) {
  return (
    <div>
      <label htmlFor={ad} className="block text-sm font-semibold text-slate-700">
        {etiket}
        {gerekli && <span className="text-red-500"> *</span>}
      </label>
      {not && <p className="mb-1.5 mt-0.5 text-xs leading-snug text-slate-400">{not}</p>}
      {uzun ? (
        <textarea id={ad} name={ad} rows={satir} defaultValue={deger} placeholder={yerTutucu} required={gerekli} className={`${not ? "" : "mt-1.5"} ${GIRDI}`} />
      ) : (
        <input id={ad} name={ad} defaultValue={deger} placeholder={yerTutucu} required={gerekli} className={`${not ? "" : "mt-1.5"} ${GIRDI}`} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------ bilgi kutusu */

export function Bilgi({ children, tur = "bilgi" }: { children: React.ReactNode; tur?: "bilgi" | "uyari" | "hata" }) {
  const stil =
    tur === "uyari"
      ? "border-amber-300 bg-amber-50 text-amber-800"
      : tur === "hata"
        ? "border-red-300 bg-red-50 text-red-700"
        : "border-blue/25 bg-blue-soft text-navy";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${stil}`}>{children}</div>
  );
}

/** Icerigi olmayan liste ekranlarinda gosterilen bos durum. */
export function BosDurum({ ikon, baslik, aciklama, children }: { ikon: string; baslik: string; aciklama: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="text-4xl" aria-hidden>{ikon}</div>
      <h3 className="mt-3 font-bold text-navy">{baslik}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-slate-500">{aciklama}</p>
      {children && <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
