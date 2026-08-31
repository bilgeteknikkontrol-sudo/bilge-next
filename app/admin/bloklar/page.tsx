import Link from "next/link";
import { guard } from "@/lib/auth";
import { tumBloklar, BLOK_TURLERI, TUR_ETIKET, TUR_IPUCU, IKONLU_TURLER, type BlokTuru } from "@/lib/bloklar";
import { saveBlokAction, deleteBlokAction, toggleBlokAction } from "../actions";
import GorselSecici from "../GorselSecici";

export const dynamic = "force-dynamic";

/**
 * Tek ekrandan bes koleksiyon yonetiliyor: hero slaytlari, referanslar, ekip,
 * sertifikalar ve genel SSS. Her biri icin ayri modul yazmak yerine ortak
 * "blok" yapisi kullaniliyor (bkz. lib/bloklar.ts).
 */
export default async function BloklarAdmin({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string; duzenle?: string; hata?: string }>;
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

        {sp.hata === "buyuk" && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <b>Görsel çok büyük.</b> En fazla 6 MB. Görseli küçültüp (tercihen WebP,
            1600 px genişlik) tekrar deneyin. Diğer alanlar kaydedilmedi.
          </p>
        )}

        <form action={saveBlokAction} encType="multipart/form-data" className="mt-4 space-y-3">
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

          {IKONLU_TURLER.has(tur) && (
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">İkon (emoji)</span>
              <input
                name="ikon"
                defaultValue={duzenlenen?.ikon || ""}
                placeholder="🛡️"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
              />
            </label>
          )}

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Metin</span>
            <textarea
              name="metin"
              rows={3}
              defaultValue={duzenlenen?.metin || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
          </label>

          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-xs font-semibold text-slate-600">Görsel</span>

            <label className="mt-2 block">
              <span className="mb-1 block text-xs text-slate-500">Bilgisayarınızdan seçin</span>
              <GorselSecici
                name="gorselDosya"
                ipucu={
                  <>
                    Büyük fotoğraflar tarayıcıda otomatik küçültülür.
                    {duzenlenen?.gorsel && " Yeni dosya seçmezseniz mevcut görsel korunur."}
                  </>
                }
              />
            </label>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-500">
                veya adres gir (harici görsel)
              </summary>
              <input
                name="gorsel"
                defaultValue={duzenlenen?.gorsel || ""}
                placeholder="/img/ornek.webp veya https://…"
                className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm"
              />
              <span className="mt-1 block text-xs text-slate-500">
                <Link href="/admin/media" className="font-semibold text-blue underline">
                  Medya Kütüphanesi
                </Link>
                &apos;ne yüklediğiniz bir görselin adresini de yapıştırabilirsiniz.
              </span>
            </details>
          </div>

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
