"use client";

import { useState } from "react";
import Link from "next/link";
import { KATEGORILER } from "@/lib/data";

const links = [
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/yazilar", label: "Bilgi Merkezi" },
  { href: "/bolge", label: "Hizmet Bölgeleri" },
  { href: "/hesapla", label: "Süre Hesaplayıcı" },
  { href: "/portal", label: "Rapor Portalı" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [serv, setServ] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="container-x flex h-[74px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy font-black text-white shadow-lg">
            B
          </span>
          <span className="font-extrabold text-navy leading-tight">
            Bilge Teknik Kontrol
            <small className="block text-[.7rem] font-semibold tracking-wide text-muted">
              TÜRKAK Akredite · AB-0296-M
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServ(true)}
            onMouseLeave={() => setServ(false)}
          >
            <button className="nav-link flex items-center gap-1">
              Hizmetler <span className="text-xs">▾</span>
            </button>
            {serv && (
              <div className="absolute left-0 top-full w-[720px] rounded-2xl border border-line bg-white p-5 shadow-[0_24px_50px_-20px_rgba(15,23,42,.4)]">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Periyodik Kontrol Kategorileri</p>
                <div className="grid grid-cols-2 gap-4">
                  {KATEGORILER.map((k) => (
                    <div key={k.baslik}>
                      <Link
                        href={`/ekipman/${k.ekipmanlar[0].slug}`}
                        className="flex items-start gap-2 rounded-xl p-2 transition hover:bg-bgsoft"
                      >
                        <span className="text-xl">{k.ikon}</span>
                        <span className="text-sm font-bold text-navy">{k.baslik}</span>
                      </Link>
                      <ul className="mt-0.5 space-y-0.5 pl-9">
                        {k.ekipmanlar.slice(1, 5).map((e) => (
                          <li key={e.slug}>
                            <Link href={`/ekipman/${e.slug}`} className="block truncate text-[.8rem] text-muted transition hover:text-blue">
                              {e.ad}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link href="/ekipman" className="mt-4 block rounded-xl bg-bgsoft px-4 py-2.5 text-center text-sm font-bold text-blue transition hover:bg-blue-soft">
                  Tüm hizmetleri gör →
                </Link>
              </div>
            )}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/teklif" className="btn-primary hidden md:inline-flex">
            Hemen Teklif Al
          </Link>
          <button
            className="text-2xl text-navy lg:hidden"
            aria-label="Menü"
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-2 border-t border-line bg-white px-5 py-4 lg:hidden">
          <span className="px-1 text-xs font-bold uppercase tracking-wide text-muted">Hizmetler</span>
          {KATEGORILER.map((k) => (
            <Link
              key={k.baslik}
              href={`/ekipman/${k.ekipmanlar[0].slug}`}
              className="rounded-lg px-1 py-1.5 font-semibold text-ink"
              onClick={() => setOpen(false)}
            >
              {k.ikon} {k.baslik}
            </Link>
          ))}
          <Link href="/ekipman" className="rounded-lg px-1 py-1.5 font-bold text-blue" onClick={() => setOpen(false)}>
            Tüm hizmetleri gör →
          </Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-semibold text-ink" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/teklif" className="btn-primary mt-2" onClick={() => setOpen(false)}>
            Hemen Teklif Al
          </Link>
        </nav>
      )}
    </header>
  );
}
