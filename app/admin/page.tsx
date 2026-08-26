import Link from "next/link";
import { getArticles, getEquipment, getLocations, getMedia, isDbOn } from "@/lib/cms";
import { guard } from "@/lib/auth";

export default async function Dashboard() {
  await guard();
  const dbOn = isDbOn();
  let counts = { articles: 0, equipment: 0, locations: 0, media: 0 };
  let err: string | null = null;
  try {
    const [a, e, l, m] = await Promise.all([
      getArticles(),
      getEquipment(),
      getLocations(),
      getMedia(),
    ]);
    counts = { articles: a.length, equipment: e.length, locations: l.length, media: m.length };
  } catch (e) {
    err = e instanceof Error ? e.message : "Veritabanı hatası";
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800">Genel Bakış</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bilge Teknik Kontrol içerik yönetim paneli
      </p>

      {!dbOn && (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <b>Veritabanı bağlantısı yok.</b> İçerik şu an kod içindeki sabit verilerle görüntüleniyor.
          Canlı düzenleme için Vercel ortam değişkenine <code>DATABASE_URL</code> (Neon Postgres)
          eklemeniz ve <code>ADMIN_PASSWORD</code> belirlemeniz gerekiyor.
        </div>
      )}
      {err && (
        <div className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          Hata: {err}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Makaleler", v: counts.articles, href: "/admin/articles" },
          { label: "Ekipmanlar", v: counts.equipment, href: "/admin/equipment" },
          { label: "Bölgeler", v: counts.locations, href: "/admin/locations" },
          { label: "Medya", v: counts.media, href: "/admin/media" },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md"
          >
            <div className="text-3xl font-black text-blue-700">{c.v}</div>
            <div className="mt-1 text-sm text-slate-500">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-700">Hızlı İşlemler</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/articles?new=1" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            + Yeni Makale
          </Link>
          <Link href="/admin/equipment?new=1" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            + Yeni Ekipman
          </Link>
          <Link href="/admin/locations?new=1" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            + Yeni Bölge
          </Link>
          <Link href="/admin/settings" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Site Ayarları
          </Link>
        </div>
      </div>
    </div>
  );
}
