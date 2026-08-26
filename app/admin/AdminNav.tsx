"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Yazılar" },
  { href: "/admin/equipment", label: "Ekipman" },
  { href: "/admin/locations", label: "Bölgeler" },
  { href: "/admin/settings", label: "Ayarlar" },
  { href: "/admin/content", label: "Metinler" },
  { href: "/admin/media", label: "Medya" },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-4">
      <Link href="/admin" className="block px-2 py-2 text-lg font-black text-navy">
        ⚙️ Bilge Admin
      </Link>
      <nav className="mt-4 flex flex-col gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active ? "bg-blue text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <form action="/admin/logout" method="post" className="mt-6">
        <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
          Çıkış Yap
        </button>
      </form>
    </aside>
  );
}
