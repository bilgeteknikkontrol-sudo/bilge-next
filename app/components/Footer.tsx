import Link from "next/link";
import Image from "next/image";
import { KATEGORILER } from "@/lib/data";
import { KURUM } from "@/lib/site-data";
import { iletisimBilgi } from "@/lib/iletisim-bilgi";
import CerezAyarButonu from "./CerezAyarButonu";
// Koyu zemin varyanti: logonun lacivert bolumleri beyaza cevrilmis, turuncu korunmus.
import logoLight from "../../public/img/marka/logo-light.png";
import { metinleriOku } from "@/lib/sayfa-metin";

const KURUMSAL = [
  { href: "/kurumsal", label: "Hakkımızda" },
  { href: "/referanslar", label: "Referanslarımız" },
  { href: "/sertifikalar", label: "Akreditasyon & Sertifikalar" },
  { href: "/bolge", label: "Hizmet Bölgeleri" },
  { href: "/sss", label: "Sık Sorulan Sorular" },
  // "Fenni muayene" terimini karsilayan merkez sayfa. Her sayfadan link
  // aldigi icin taranmasi ve indekslenmesi hizlanir.
  { href: "/fenni-muayene", label: "Fenni Muayene Nedir?" },
  { href: "/yazilar", label: "Bilgi Merkezi" },
  { href: "/iletisim", label: "İletişim" },
];

const ARACLAR = [
  { href: "/teklif", label: "Teklif Al" },
  { href: "/hesapla", label: "Yasal Süre Hesaplayıcı" },
  { href: "/ekipman", label: "Tüm Hizmetlerimiz" },
  { href: "/dosya/bilge-teknik-kontrol-katalog.pdf", label: "Hizmet Kataloğu (PDF)", dis: true },
];

export default async function Footer() {
  const bilgi = await iletisimBilgi();
  const m = await metinleriOku();
  const yil = new Date().getFullYear();
  const toplamHizmet = KATEGORILER.reduce((n, k) => n + k.ekipmanlar.length, 0);

  return (
    // bg-footer: zemin rengi panelden yonetiliyor (Admin > Site Ayarlari > Renkler)
    <footer id="iletisim" className="mt-10 bg-footer text-white/75">
      {/* ÜST ŞERİT — kapanış çağrısı */}
      <div className="border-b border-white/10 bg-white/[.03]">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-xl font-black text-white">{m("footer_cta_baslik")}</p>
            <p className="mt-1 text-sm text-white/70">{m("footer_cta_metin")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/teklif"
              className="rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5"
            >
              Teklif Al →
            </Link>
            <a
              href={`tel:${bilgi.telefonE164}`}
              className="rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              {bilgi.telefon}
            </a>
          </div>
        </div>
      </div>

      {/* ANA GÖVDE */}
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
        {/* Marka + künye */}
        <div>
          <Link href="/" aria-label={`${KURUM.kisaAd} — ana sayfa`}>
            <Image src={logoLight} alt={KURUM.kisaAd} sizes="200px" className="h-16 w-auto" />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{m("footer_yazi")}</p>

          <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[.06] px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-soft text-lg text-navy">✓</span>
            <span className="leading-tight">
              <span className="block text-[.7rem] uppercase tracking-wide text-white/60">TÜRKAK Akreditasyon No</span>
              <span className="block font-bold text-white">{KURUM.akreditasyon}</span>
            </span>
          </div>
        </div>

        {/* Kurumsal */}
        <nav aria-label="Kurumsal bağlantılar">
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{m("footer_kurumsal_baslik")}</p>
          <ul className="space-y-2.5 text-sm">
            {KURUMSAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/70 transition hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hizmetler */}
        <nav aria-label="Hizmet kategorileri">
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{m("footer_hizmet_baslik")}</p>
          <ul className="space-y-2.5 text-sm">
            {KATEGORILER.slice(0, 6).map((k) => (
              <li key={k.baslik}>
                <Link href={`/ekipman/${k.ekipmanlar[0].slug}`} className="text-white/70 transition hover:text-white">
                  {k.baslik}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ekipman" className="font-bold text-accent transition hover:text-white">
                {m("footer_hizmet_tumu")} ({toplamHizmet}) →
              </Link>
            </li>
          </ul>
        </nav>

        {/* İletişim + araçlar */}
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{m("footer_iletisim_baslik")}</p>
          <address className="space-y-3 text-sm not-italic">
            <div className="flex gap-3">
              <span aria-hidden>📍</span>
              <span className="text-white/70">{bilgi.adresTekSatir}</span>
            </div>
            <div className="flex gap-3">
              <span aria-hidden>📞</span>
              <a href={`tel:${bilgi.telefonE164}`} className="font-bold text-white transition hover:text-accent">
                {bilgi.telefon}
              </a>
            </div>
            <div className="flex gap-3">
              <span aria-hidden>✉️</span>
              <a href={`mailto:${bilgi.eposta}`} className="break-all text-white/70 transition hover:text-white">
                {bilgi.eposta}
              </a>
            </div>
            <div className="flex gap-3">
              <span aria-hidden>🕘</span>
              <span className="text-white/70">{bilgi.calismaSaatleri}</span>
            </div>
          </address>

          <p className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-white">{m("footer_araclar_baslik")}</p>
          <ul className="space-y-2.5 text-sm">
            {ARACLAR.map((l) =>
              l.dis ? (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener" className="text-white/70 transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ) : (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 transition hover:text-white">{l.label}</Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* ALT ŞERİT */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 md:flex-row">
          <span className="text-center md:text-left">© {yil} {KURUM.ad}</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Yasal bağlantılar">
            <Link href="/kvkk" className="transition hover:text-white">KVKK Aydınlatma Metni</Link>
            <Link href="/cerez-politikasi" className="transition hover:text-white">Çerez Politikası</Link>
            <CerezAyarButonu />
          </nav>
        </div>
      </div>
    </footer>
  );
}
