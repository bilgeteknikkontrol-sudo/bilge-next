import Link from "next/link";
import { getArticles, getEquipment, getLocations, getMedia, isDbOn } from "@/lib/cms";
import { guard } from "@/lib/auth";
import { SayfaBasligi, Kart, Bilgi } from "./ui";

/**
 * Panel ana sayfasi.
 *
 * Onceki hali dort sayi kutusu ve "Hizli Islemler" dugmeleriydi; panele
 * girildiginde ne yapilabilecegi belli olmuyordu. Simdi ust sirada durum
 * ozeti, altinda YAPILACAK ISE gore kartlar var — her kart ne ise yaradigini
 * bir cumleyle soyluyor.
 */

const ISLER = [
  {
    href: "/admin/sayfalar",
    ikon: "📄",
    baslik: "Sayfa yazılarını değiştir",
    not: "Her sayfanın başlığı ve giriş yazısı. Kod bilgisi gerekmez, kutuya yazıp kaydedin.",
  },
  {
    href: "/admin/articles",
    ikon: "✍️",
    baslik: "Yazı ekle veya düzenle",
    not: "Bilgi Merkezi'ndeki makaleler. Yeni yazı eklemek SEO için en etkili işlerden biri.",
  },
  {
    href: "/admin/menu",
    ikon: "🧭",
    baslik: "Üst menüyü düzenle",
    not: "Menüdeki başlıkları yeniden adlandırın, bağlantı ekleyin veya sırasını değiştirin.",
  },
  {
    href: "/admin/bloklar",
    ikon: "🧩",
    baslik: "Görsel blokları yönet",
    not: "Ana sayfa slaytları, referans logoları, ekip kartları, belgeler ve SSS.",
  },
  {
    href: "/admin/settings",
    ikon: "🎨",
    baslik: "Renk ve iletişim ayarları",
    not: "Site paleti, yazı boyutları, telefon, e-posta ve adres.",
  },
  {
    href: "/admin/equipment",
    ikon: "🔧",
    baslik: "Ekipman listesini güncelle",
    not: "Kontrol edilen ekipmanlar, kategorileri ve kontrol periyotları.",
  },
];

export default async function Panel() {
  await guard();
  const dbAcik = isDbOn();

  let sayi = { yazi: 0, ekipman: 0, sehir: 0, medya: 0 };
  let hata: string | null = null;
  try {
    const [a, e, l, m] = await Promise.all([getArticles(), getEquipment(), getLocations(), getMedia()]);
    sayi = { yazi: a.length, ekipman: e.length, sehir: l.length, medya: m.length };
  } catch (e) {
    hata = e instanceof Error ? e.message : "Veri okunamadı";
  }

  return (
    <div>
      <SayfaBasligi
        baslik="Yönetim Paneli"
        aciklama="Sitenin içeriğini buradan yönetiyorsunuz. Ne yapmak istediğinizi aşağıdan seçin."
        onizleme="/"
      />

      {!dbAcik && (
        <div className="mb-5">
          <Bilgi tur="uyari">
            <b>Veritabanı bağlantısı yok.</b> İçerik şu an koddaki sabit verilerle görüntüleniyor.
            Canlı düzenleme için <code>DATABASE_URL</code> tanımlanmalı.
          </Bilgi>
        </div>
      )}
      {hata && (
        <div className="mb-5">
          <Bilgi tur="hata">Veri okunamadı: {hata}</Bilgi>
        </div>
      )}

      {/* DURUM ÖZETİ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { etiket: "Yazı", v: sayi.yazi, href: "/admin/articles" },
          { etiket: "Ekipman", v: sayi.ekipman, href: "/admin/equipment" },
          { etiket: "Şehir sayfası", v: sayi.sehir, href: "/admin/locations" },
          { etiket: "Görsel", v: sayi.medya, href: "/admin/media" },
        ].map((k) => (
          <Link
            key={k.href}
            href={k.href}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue"
          >
            <div className="text-2xl font-black tabular-nums text-blue">{k.v}</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-500">{k.etiket}</div>
          </Link>
        ))}
      </div>

      {/* YAPILACAK İŞLER */}
      <h2 className="mb-3 mt-8 text-sm font-bold uppercase tracking-[.1em] text-slate-400">
        Ne yapmak istiyorsunuz?
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ISLER.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue hover:shadow-[0_10px_24px_-16px_rgba(11,42,74,.5)]"
          >
            <span aria-hidden className="text-2xl leading-none">{i.ikon}</span>
            <span className="min-w-0">
              <span className="block font-bold text-navy group-hover:text-blue">{i.baslik}</span>
              <span className="mt-0.5 block text-sm leading-snug text-slate-500">{i.not}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Kart
          baslik="Yaptığınız değişiklik ne zaman görünür?"
          aciklama="Kaydettiğiniz anda. Sayfayı yenilediğinizde yeni hâli gelir; ayrıca bir yayınlama adımı yok."
        >
          <p className="text-sm leading-relaxed text-slate-600">
            Bir şeyi yanlışlıkla sildiyseniz veya bozduysanız endişelenmeyin: sayfa metinlerinde
            bir kutuyu <b>boş bırakırsanız o alan ilk hâline döner</b>. Menüde de aynısı geçerli —
            menüyü tamamen silerseniz site varsayılan menüyle çalışmaya devam eder.
          </p>
        </Kart>
      </div>
    </div>
  );
}
