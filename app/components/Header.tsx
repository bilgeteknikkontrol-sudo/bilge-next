"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#hizmetler", label: "Hizmetler" },
  { href: "/yazilar", label: "Bilgi Merkezi" },
  { href: "/bolge/istanbul", label: "Hizmet Bölgeleri" },
  { href: "/hesapla", label: "Süre Hesaplayıcı" },
  { href: "/teklif", label: "Online Teklif" },
  { href: "/portal", label: "Rapor Portalı" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-navy font-black text-white shadow-lg">
            B
          </span>
          <span className="font-extrabold text-navy leading-tight">
            Bilge Teknik Kontrol
            <small className="block text-[.7rem] font-semibold tracking-wide text-muted">
              TÜRKAK Akredite · AB-0296-M
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/teklif"
            className="hidden rounded-full bg-blue px-5 py-2.5 font-bold text-white shadow-[0_12px_24px_-10px_rgba(28,95,214,.7)] transition hover:-translate-y-0.5 md:inline-block"
          >
            Hemen Teklif Al
          </Link>
          <button
            className="text-2xl text-navy md:hidden"
            aria-label="Menü"
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-3 border-t border-line bg-white px-5 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-semibold text-ink" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
