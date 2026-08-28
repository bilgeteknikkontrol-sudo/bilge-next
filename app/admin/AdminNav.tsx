"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Panel menusu.
 *
 * Onceki hali duz bir liste idi ("Yazilar, Ekipman, Bolgeler, Ayarlar,
 * Metinler, Icerik Bloklari, Medya") — hangisinin ne oldugu belli degildi ve
 * mobilde 240px'lik sabit sutun ekranin yarisini yiyordu.
 *
 * Simdi: isin turune gore UC grup, her maddede ne ise yaradigini soyleyen bir
 * alt satir, ve mobilde <details> ile acilir kapanir baslik. Acilir menu icin
 * JavaScript yazilmadi; <details> tarayicinin kendi davranisi.
 */

type Madde = { href: string; etiket: string; not: string; ikon: string };
type Grup = { baslik: string; maddeler: Madde[] };

const GRUPLAR: Grup[] = [
  {
    baslik: "İçerik",
    maddeler: [
      { href: "/admin/sayfalar", etiket: "Sayfa Metinleri", not: "Başlıklar ve giriş yazıları", ikon: "📄" },
      { href: "/admin/articles", etiket: "Yazılar", not: "Bilgi Merkezi makaleleri", ikon: "✍️" },
      { href: "/admin/equipment", etiket: "Ekipman & Hizmetler", not: "Kontrol edilen ekipman listesi", ikon: "🔧" },
      { href: "/admin/locations", etiket: "Şehir Sayfaları", not: "İl bazlı hizmet sayfaları", ikon: "📍" },
      { href: "/admin/bloklar", etiket: "Görsel Bloklar", not: "Slayt, referans, ekip, belge, SSS", ikon: "🧩" },
    ],
  },
  {
    baslik: "Görünüm",
    maddeler: [
      { href: "/admin/menu", etiket: "Menü", not: "Üst menü başlıkları ve bağlantılar", ikon: "🧭" },
      { href: "/admin/settings", etiket: "Renkler & Ayarlar", not: "Palet, yazı boyutu, iletişim", ikon: "🎨" },
      { href: "/admin/media", etiket: "Medya", not: "Yüklenen görseller", ikon: "🖼️" },
    ],
  },
  {
    baslik: "Gelişmiş",
    maddeler: [
      { href: "/admin/content", etiket: "Ham Metin Anahtarları", not: "Teknik: anahtar-değer kayıtları", ikon: "⚙️" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  const govde = (
    <>
      <nav className="flex flex-col gap-5" aria-label="Panel menüsü">
        {GRUPLAR.map((g) => (
          <div key={g.baslik}>
            <p className="px-3 text-[.68rem] font-bold uppercase tracking-[.12em] text-slate-400">
              {g.baslik}
            </p>
            <div className="mt-1.5 flex flex-col gap-0.5">
              {g.maddeler.map((m) => {
                const aktif = pathname === m.href || pathname.startsWith(m.href + "/");
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    aria-current={aktif ? "page" : undefined}
                    className={`flex items-start gap-2.5 rounded-lg px-3 py-2 transition ${
                      aktif ? "bg-blue text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span aria-hidden className="mt-px text-base leading-none">{m.ikon}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight">{m.etiket}</span>
                      <span className={`block text-[.7rem] leading-tight ${aktif ? "text-white/70" : "text-slate-400"}`}>
                        {m.not}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-600 transition hover:border-blue hover:text-blue"
        >
          Siteyi aç ↗
        </a>
        <form action="/admin/logout" method="post">
          <button className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100">
            Çıkış Yap
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* MOBIL — acilir baslik */}
      <details className="border-b border-slate-200 bg-white lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
          <span className="font-black text-navy">Bilge Yönetim</span>
          <span className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Menü
          </span>
        </summary>
        <div className="px-4 pb-5">{govde}</div>
      </details>

      {/* MASAUSTU — sabit sutun */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
        <Link href="/admin" className="mb-5 block px-3">
          <span className="block text-lg font-black leading-tight text-navy">Bilge Yönetim</span>
          <span className="block text-[.7rem] text-slate-400">bilgekontrol.com</span>
        </Link>
        {govde}
      </aside>
    </>
  );
}
