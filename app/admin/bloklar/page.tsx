import Link from "next/link";
import { guard } from "@/lib/auth";
import { tumBloklar, BLOK_TURLERI, TUR_ETIKET, TUR_IPUCU, type BlokTuru } from "@/lib/bloklar";
import { saveBlokAction, deleteBlokAction, toggleBlokAction } from "../actions";

export const dynamic = "force-dynamic";

/**
 * Tek ekrandan bes koleksiyon yonetiliyor: hero slaytlari, referanslar, ekip,
 * sertifikalar ve genel SSS. Her biri icin ayri modul yazmak yerine ortak
 * "blok" yapisi kullaniliyor (bkz. lib/bloklar.ts).
 */
export default async function BloklarAdmin({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string; duzenle?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const tur = (BLOK_TURLERI as readonly string[]).includes(sp.tur || "")
    ? (sp.tur as BlokTuru)
    : "referans";

  const hepsi = await tumBloklar();
  const liste = hepsi
    .filter((b) => b.tur === tur)
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, "tr"));
  const duzenlenen = sp.duzenle ? liste.find((b) => b.id === sp.duzenle) : undefined;

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-navy">İçerik Blokları</h1>
      <p className="mt-1 text-sm text-slate-500">
        Referanslar, ekip, sertifikalar, ana sayfa slaytları ve sık sorulan sorular buradan
        yönetilir. Her kayıt eklenebilir, düzenlenebilir, pasife alınabilir veya silinebilir.
      </p>

      {/* Tür sekmeleri */}
      <div className="mt-5 flex flex-wrap gap-2">
        {BLOK_TURLERI.map((t) => {
          const adet = hepsi.filter((b) => b.tur === t).length;
          const aktifSekme = t === tur;
          return (
            <Link
              key={t}
              href={`/admin/bloklar?tur=${t}`}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                aktifSekme ? "bg-blue text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {TUR_ETIKET[t]} <span className="opacity-70">({adet})</span>
            </Link>
          );
        })}
      </div>

      {/* Form */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-700">
          {duzenlenen ? "Kaydı Düzenle" : "Yeni Kayıt"} — {TUR_ETIKET[tur]}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{TUR_IPUCU[tur]}</p>

        <form action={saveBlokAction} className="mt-4 space-y-3">
          <input type="hidden" name="tur" value={tur} />
          <input type="hidden" name="id" value={duzenlenen?.id || ""} />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Başlık</span>
              <input
                name="baslik"
                defaultValue={duzenlenen?.baslik || ""}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Bağlantı (isteğe bağlı)</span>
              <input
                name="url"
                defaultValue={duzenlenen?.url || ""}
                placeholder="https://… veya /dosya/belge.pdf"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Metin</span>
            <textarea
              name="metin"
              rows={3}
              defaultValue={duzenlenen?.metin || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Görsel adresi</span>
            <input
              name="gorsel"
              defaultValue={duzenlenen?.gorsel || ""}
              placeholder="/img/ornek.webp · https://… · Medya Kütüphanesi'nden kopyalanan adres"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Görsel yüklemek için{" "}
              <Link href="/admin/media" className="font-semibold text-blue underline">
                Medya Kütüphanesi
              </Link>
              &apos;ni kullanıp adresi buraya yapıştırın.
            </span>
          </label>

          {duzenlenen?.gorsel && (
            <div className="h-28 w-48 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={duzenlenen.gorsel} alt="" className="h-full w-full object-contain" />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Sıra</span>
              <input
                name="sira"
                type="number"
                defaultValue={duzenlenen?.sira ?? liste.length}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
              />
            </label>
            <label className="flex items-end gap-2 pb-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="aktif"
                defaultChecked={duzenlenen ? duzenlenen.aktif : true}
              />
              Aktif (sitede görünsün)
            </label>
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg bg-blue px-5 py-2.5 font-bold text-white hover:brightness-110">
              {duzenlenen ? "Güncelle" : "Ekle"}
            </button>
            {duzenlenen && (
              <Link
                href={`/admin/bloklar?tur=${tur}`}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100"
              >
                Vazgeç
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="mt-6 space-y-2">
        {liste.length === 0 && (
          <p className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">
            Bu türde henüz kayıt yok. Yukarıdaki formdan ekleyebilirsiniz.
          </p>
        )}
        {liste.map((b) => (
          <div
            key={b.id}
            className={`flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ${
              b.aktif ? "" : "opacity-60"
            }`}
          >
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              {b.gorsel ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.gorsel} alt="" className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">—</div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-slate-700">{b.baslik || "(başlıksız)"}</div>
              <div className="truncate text-xs text-slate-500">{b.metin}</div>
              <div className="mt-0.5 text-xs text-slate-400">
                sıra {b.sira}
                {b.aktif ? "" : " · pasif"}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/bloklar?tur=${tur}&duzenle=${b.id}`}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Düzenle
              </Link>
              <form action={toggleBlokAction}>
                <input type="hidden" name="id" value={b.id} />
                <input type="hidden" name="tur" value={tur} />
                <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                  {b.aktif ? "Pasife al" : "Aktif et"}
                </button>
              </form>
              <form action={deleteBlokAction}>
                <input type="hidden" name="id" value={b.id} />
                <input type="hidden" name="tur" value={tur} />
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                  Sil
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
