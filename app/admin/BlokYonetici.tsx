import Link from "next/link";
import { tumBloklar, TUR_IPUCU, type BlokTuru } from "@/lib/bloklar";
import { saveBlokAction, deleteBlokAction, toggleBlokAction } from "./actions";
import { Kart, Buton, BosDurum } from "./ui";

/**
 * Bir blok koleksiyonunun (slayt / referans / ekip / sertifika / SSS)
 * ekle-duzenle-sil-sirala arayuzu.
 *
 * Once bu arayuz yalnizca /admin/bloklar ekraninda vardi ve bes koleksiyonu
 * sekmelerle gosteriyordu; "ana sayfanin slaytini degistir" isteyen kisi
 * oraya gitmesi gerektigini bilemiyordu. Artik bu bilesen ilgili SAYFANIN
 * kendi ekranina gomuluyor (bkz. app/admin/sayfa/[id]/page.tsx).
 *
 * `donusYolu`: kaydettikten sonra hangi adrese donulecegi. Boylece ayni
 * bilesen hem sayfa ekranlarinda hem eski toplu ekranda calisiyor.
 */
export default async function BlokYonetici({
  tur,
  baslik,
  aciklama,
  donusYolu,
  duzenlenenId,
  hata,
}: {
  tur: BlokTuru;
  baslik: string;
  aciklama: string;
  donusYolu: string;
  duzenlenenId?: string;
  /** Sunucu eyleminden donen hata kodu (ornek: "buyuk" = dosya cok buyuk). */
  hata?: string;
}) {
  const liste = (await tumBloklar().catch(() => []))
    .filter((b) => b.tur === tur)
    .sort((a, b) => a.sira - b.sira || a.baslik.localeCompare(b.baslik, "tr"));
  const duzenlenen = duzenlenenId ? liste.find((b) => b.id === duzenlenenId) : undefined;

  const ayrac = donusYolu.includes("?") ? "&" : "?";

  return (
    <Kart baslik={baslik} aciklama={aciklama}>
      {hata === "buyuk" && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <b>Görsel çok büyük.</b> En fazla 6 MB yükleyebilirsiniz. Görseli küçültüp
          (tercihen WebP, 1600 px genişlik) tekrar deneyin. Diğer alanlar kaydedilmedi.
        </p>
      )}

      {/* ---------------- Liste ---------------- */}
      {liste.length === 0 ? (
        <BosDurum
          ikon="📭"
          baslik="Burada henüz kayıt yok"
          aciklama="Aşağıdaki formdan ilk kaydı ekleyebilirsiniz. Eklemezseniz site varsayılan içeriğiyle çalışmaya devam eder."
        />
      ) : (
        <ul className="mb-5 space-y-2">
          {liste.map((b) => (
            <li
              key={b.id}
              className={`flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 ${
                b.aktif ? "" : "opacity-55"
              }`}
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {b.gorsel ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.gorsel} alt="" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-300">görsel yok</div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-navy">{b.baslik || "(başlıksız)"}</div>
                {b.metin && <div className="truncate text-xs text-slate-500">{b.metin}</div>}
                <div className="mt-0.5 text-[.7rem] text-slate-400">
                  sıra {b.sira}
                  {b.aktif ? "" : " · pasif (sitede görünmüyor)"}
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href={`${donusYolu}${ayrac}duzenle=${b.id}#${tur}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue hover:text-blue"
                >
                  Düzenle
                </Link>
                <form action={toggleBlokAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="tur" value={tur} />
                  <input type="hidden" name="donus" value={donusYolu} />
                  <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue hover:text-blue">
                    {b.aktif ? "Gizle" : "Göster"}
                  </button>
                </form>
                <form action={deleteBlokAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="tur" value={tur} />
                  <input type="hidden" name="donus" value={donusYolu} />
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                    Sil
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------- Ekle / düzenle formu ---------------- */}
      {/**
       * ⚠️ Hic kayit yokken form ACIK geliyor.
       *
       * Onceden yalnizca duzenleme sirasinda aciliyordu; bos bir bolumde
       * kullanici "Burada henüz kayıt yok" yazisini ve kapali bir
       * "+ Yeni ekle" satirini goruyor, dosya secme alanini hic goremiyordu.
       * Eklemenin ilk adimi gorunmez olunca bolum "calismiyor" gibi duruyordu.
       */}
      <details
        id={tur}
        open={Boolean(duzenlenen) || liste.length === 0}
        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <summary className="cursor-pointer text-sm font-bold text-navy">
          {duzenlenen ? "Kaydı düzenle" : "+ Yeni ekle"}
        </summary>

        <p className="mt-2 text-xs leading-relaxed text-slate-500">{TUR_IPUCU[tur]}</p>

        {/* encType: dosya alani var; sunucu eylemi FormData'yi coklu parca
            olarak almali, yoksa dosya bos gelir. */}
        <form action={saveBlokAction} encType="multipart/form-data" className="mt-4 space-y-3">
          <input type="hidden" name="tur" value={tur} />
          <input type="hidden" name="id" value={duzenlenen?.id || ""} />
          <input type="hidden" name="donus" value={donusYolu} />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Başlık</span>
              <input
                name="baslik"
                defaultValue={duzenlenen?.baslik || ""}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Bağlantı (isteğe bağlı)</span>
              <input
                name="url"
                defaultValue={duzenlenen?.url || ""}
                placeholder="https://… veya /belge.pdf"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Metin</span>
            <textarea
              name="metin"
              rows={2}
              defaultValue={duzenlenen?.metin || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <span className="text-sm font-semibold text-slate-700">Görsel</span>

            <label className="mt-2 block">
              <span className="mb-1 block text-xs text-slate-500">
                Bilgisayarınızdan seçin
              </span>
              <input
                type="file"
                name="gorselDosya"
                accept="image/*"
                className="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2.5 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
              />
              <span className="mt-1 block text-xs text-slate-400">
                En fazla 6 MB. Tercihen WebP, 1600 px genişlik.
                {duzenlenen?.gorsel && " Yeni dosya seçmezseniz mevcut görsel korunur."}
              </span>
            </label>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-500">
                veya adres gir (harici görsel)
              </summary>
              <input
                name="gorsel"
                defaultValue={duzenlenen?.gorsel || ""}
                placeholder="/img/ornek.webp veya https://…"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
              <span className="mt-1 block text-xs text-slate-400">
                Daha önce{" "}
                <Link href="/admin/media" className="font-semibold text-blue underline">
                  Medya
                </Link>{" "}
                ekranına yüklediğiniz bir görselin adresini de yapıştırabilirsiniz.
              </span>
            </details>
          </div>

          {duzenlenen?.gorsel && (
            <div className="h-28 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={duzenlenen.gorsel} alt="" className="h-full w-full object-contain p-1" />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Sıra</span>
              <span className="mb-1 mt-0.5 block text-xs text-slate-400">Küçük numara önce görünür</span>
              <input
                name="sira"
                type="number"
                defaultValue={duzenlenen?.sira ?? liste.length + 1}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
            </label>
            <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" name="aktif" defaultChecked={duzenlenen ? duzenlenen.aktif : true} />
              Sitede görünsün
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Buton type="submit">{duzenlenen ? "Değişikliği kaydet" : "Ekle"}</Buton>
            {duzenlenen && (
              <Link
                href={`${donusYolu}#${tur}`}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
              >
                Vazgeç
              </Link>
            )}
          </div>
        </form>
      </details>
    </Kart>
  );
}
