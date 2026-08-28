"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { KATEGORILER } from "@/lib/data";
import { KURUM } from "@/lib/site-data";
import logo from "../../public/img/marka/logo.png";

type AltLink = { href: string; label: string; not?: string };

/** Ust seviye menu: en fazla 5 oge. Fazlasi 1024px'de sigmiyor ve
 *  cok kelimeli etiketler kendi icinde alt satira kayiyordu. */
const MENU: { label: string; href?: string; alt?: AltLink[] }[] = [
  { label: "Hizmetler" }, // mega menu, asagida ayrica isleniyor
  {
    label: "Kurumsal",
    alt: [
      { href: "/kurumsal", label: "Hakkımızda", not: "Akreditasyon ve ekip" },
      { href: "/sertifikalar", label: "Akreditasyon & Sertifikalar", not: "TÜRKAK AB-0296-M" },
      { href: "/referanslar", label: "Referanslarımız", not: "Çalıştığımız firmalar" },
      { href: "/bolge", label: "Hizmet Bölgeleri", not: "20 şehirde yerinde muayene" },
      { href: "/sss", label: "Sık Sorulan Sorular", not: "Süre, kapsam, mevzuat" },
    ],
  },
  { label: "Bilgi Merkezi", href: "/yazilar" },
  {
    label: "Araçlar",
    alt: [
      { href: "/hesapla", label: "Yasal Süre Hesaplayıcı", not: "Sonraki kontrol tarihiniz" },
      { href: "/periyodik-kontrol-sureleri", label: "Periyodik Kontrol Süreleri", not: "Hangi ekipman ne sıklıkla" },
      { href: "/teklif", label: "Online Teklif", not: "Ekipman seçip talep oluşturun" },
    ],
  },
  { label: "İletişim", href: "/iletisim" },
];

export default function Header() {
  const [mobilAcik, setMobilAcik] = useState(false);
  const [acikMenu, setAcikMenu] = useState<string | null>(null);
  const kapatmaZamani = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Sayfa degisince acik menuleri kapat.
  // Effect + setState yerine "onceki degeri sakla, cizim sirasinda ayarla"
  // deseni: effect icinde setState cagirmak cascading render'a yol aciyor
  // (react-hooks/set-state-in-effect). React bu durum icin cizim sirasinda
  // setState'e izin veriyor ve ek bir tur cizimle hemen duzeltiyor.
  const [oncekiYol, setOncekiYol] = useState(pathname);
  if (oncekiYol !== pathname) {
    setOncekiYol(pathname);
    setMobilAcik(false);
    setAcikMenu(null);
  }

  // ESC ile kapat
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAcikMenu(null);
        setMobilAcik(false);
      }
    };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, []);

  // Fareyle geziniyorken menunun aninda kapanmamasi icin kucuk gecikme
  function ac(label: string) {
    if (kapatmaZamani.current) clearTimeout(kapatmaZamani.current);
    setAcikMenu(label);
  }
  function kapat() {
    if (kapatmaZamani.current) clearTimeout(kapatmaZamani.current);
    kapatmaZamani.current = setTimeout(() => setAcikMenu(null), 120);
  }

  const aktif = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    // Zemin renkleri panelden yonetiliyor (Admin > Site Ayarlari > Renkler):
    // bg-header = ana cubuk, bg-headertop = ustteki iletisim seridi.
    <header className="sticky top-0 z-50 border-b border-line bg-header/95 backdrop-blur-md">
      {/* ÜST ŞERİT — iletişim ve güven bilgileri.
          Sag tarafta akreditasyon rozeti sertifika sayfasina baglaniyor. */}
      <div className="hidden bg-headertop text-white/80 md:block">
        <div className="container-x flex h-10 items-center justify-between text-[.78rem]">
          <div className="flex items-center gap-6">
            {/* xl'de telefon ana cubukta gorunuyor, burada tekrar etmesin */}
            <a href={`tel:${KURUM.telefonE164}`} className="flex items-center gap-1.5 transition hover:text-white xl:hidden">
              <span aria-hidden>📞</span> {KURUM.telefon}
            </a>
            <a href={`mailto:${KURUM.eposta}`} className="hidden items-center gap-1.5 transition hover:text-white lg:flex">
              <span aria-hidden>✉️</span> {KURUM.eposta}
            </a>
            <span className="hidden items-center gap-1.5 xl:flex">
              <span aria-hidden>🕘</span> {KURUM.calismaSaatleri}
            </span>
          </div>
          <Link
            href="/sertifikalar"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 font-bold text-navy">
              <span aria-hidden>✓</span> TÜRKAK {KURUM.akreditasyon}
            </span>
            <span className="hidden lg:inline">A Tipi Muayene Kuruluşu</span>
          </Link>
        </div>
      </div>

      {/* ANA ÇUBUK */}
      <div className="container-x flex h-[92px] items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label={`${KURUM.kisaAd} — ana sayfa`}>
          <Image src={logo} alt={KURUM.kisaAd} priority sizes="180px" className="h-[62px] w-auto md:h-[68px]" />
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Ana menü">
          {MENU.map((m) => {
            // --- Düz bağlantı ---
            if (m.href && !m.alt) {
              return (
                <Link
                  key={m.label}
                  href={m.href}
                  aria-current={aktif(m.href) ? "page" : undefined}
                  className={`relative whitespace-nowrap px-3.5 py-2 text-[.93rem] font-semibold transition after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform ${
                    aktif(m.href)
                      ? "text-navy after:scale-x-100"
                      : "text-ink/75 after:scale-x-0 hover:text-navy hover:after:scale-x-100"
                  }`}
                >
                  {m.label}
                </Link>
              );
            }

            // --- Açılır menü ---
            const acik = acikMenu === m.label;
            const megaMenu = m.label === "Hizmetler";
            return (
              <div
                key={m.label}
                className="relative"
                onMouseEnter={() => ac(m.label)}
                onMouseLeave={kapat}
              >
                <button
                  type="button"
                  aria-expanded={acik}
                  aria-haspopup="true"
                  onClick={() => setAcikMenu(acik ? null : m.label)}
                  className={`relative flex items-center gap-1 whitespace-nowrap px-3.5 py-2 text-[.93rem] font-semibold transition after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform ${
                    acik ? "text-navy after:scale-x-100" : "text-ink/75 after:scale-x-0 hover:text-navy hover:after:scale-x-100"
                  }`}
                >
                  {m.label}
                  <span className={`text-[.65rem] transition-transform ${acik ? "rotate-180" : ""}`}>▾</span>
                </button>

                {acik && (
                  <div
                    className={`absolute left-0 top-full pt-2 ${megaMenu ? "w-[680px]" : "w-[300px]"}`}
                  >
                    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_24px_50px_-20px_color-mix(in_srgb,var(--color-navy)_450%,transparent)]">
                      {megaMenu ? (
                        <>
                          <div className="grid grid-cols-2 gap-1">
                            {KATEGORILER.map((k) => (
                              <Link
                                key={k.baslik}
                                href={`/ekipman/${k.ekipmanlar[0].slug}`}
                                className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-bgsoft"
                              >
                                <span className="text-xl leading-none">{k.ikon}</span>
                                <span>
                                  <span className="block text-sm font-bold text-navy">{k.baslik}</span>
                                  <span className="block text-xs text-muted">
                                    {k.ekipmanlar.length} hizmet
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/ekipman"
                            className="mt-3 block rounded-xl bg-bgsoft px-4 py-2.5 text-center text-sm font-bold text-blue transition hover:bg-blue-soft"
                          >
                            Tüm hizmetleri gör →
                          </Link>
                        </>
                      ) : (
                        <div className="grid gap-1">
                          {m.alt!.map((a) => (
                            <Link
                              key={a.href}
                              href={a.href}
                              className="rounded-xl p-2.5 transition hover:bg-bgsoft"
                            >
                              <span className="block text-sm font-bold text-navy">{a.label}</span>
                              {a.not && <span className="block text-xs text-muted">{a.not}</span>}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* Telefon: kurumsal sitelerde birincil donusum yolu, CTA'nin yaninda durmali */}
          <a
            href={`tel:${KURUM.telefonE164}`}
            className="hidden items-center gap-2.5 rounded-xl border border-line px-3.5 py-2 transition hover:border-blue xl:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-soft text-base">📞</span>
            <span className="leading-tight">
              <span className="block text-[.68rem] font-semibold uppercase tracking-wide text-muted">Hemen arayın</span>
              <span className="block text-[.92rem] font-bold text-navy">{KURUM.telefon}</span>
            </span>
          </a>
          <Link href="/teklif" className="btn-primary hidden whitespace-nowrap px-6 py-3 text-[.92rem] md:inline-flex">
            Ücretsiz Teklif Al
          </Link>
          <button
            className="rounded-lg p-2 text-2xl leading-none text-navy lg:hidden"
            aria-label={mobilAcik ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobilAcik}
            onClick={() => setMobilAcik((o) => !o)}
          >
            {mobilAcik ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      {mobilAcik && (
        <nav className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-line bg-white px-5 py-4 lg:hidden" aria-label="Mobil menü">
          <p className="px-1 pb-1 text-xs font-bold uppercase tracking-wide text-muted">Hizmetler</p>
          {KATEGORILER.map((k) => (
            <Link
              key={k.baslik}
              href={`/ekipman/${k.ekipmanlar[0].slug}`}
              className="block rounded-lg px-1 py-2 font-semibold text-ink"
            >
              {k.ikon} {k.baslik}
            </Link>
          ))}
          <Link href="/ekipman" className="block rounded-lg px-1 py-2 font-bold text-blue">
            Tüm hizmetleri gör →
          </Link>

          {MENU.filter((m) => m.label !== "Hizmetler").map((m) => (
            <div key={m.label} className="mt-3 border-t border-line pt-3">
              {m.href && !m.alt ? (
                <Link href={m.href} className="block rounded-lg px-1 py-2 font-semibold text-ink">
                  {m.label}
                </Link>
              ) : (
                <>
                  <p className="px-1 pb-1 text-xs font-bold uppercase tracking-wide text-muted">{m.label}</p>
                  {m.alt!.map((a) => (
                    <Link key={a.href} href={a.href} className="block rounded-lg px-1 py-2 font-semibold text-ink">
                      {a.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}

          <div className="mt-4 border-t border-line pt-4">
            <a href={`tel:${KURUM.telefonE164}`} className="block px-1 py-1 text-sm font-bold text-blue">
              📞 {KURUM.telefon}
            </a>
            <a href={`mailto:${KURUM.eposta}`} className="block px-1 py-1 text-sm text-muted">
              ✉️ {KURUM.eposta}
            </a>
            <Link href="/teklif" className="btn-primary mt-3 w-full">
              Ücretsiz Teklif Al
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
