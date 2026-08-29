import { guard } from "@/lib/auth";
import { tumSorular } from "@/lib/teklif-sorulari";
import { KATEGORILER } from "@/lib/data";
import {
  saveTeklifSoruAction,
  deleteTeklifSoruAction,
  toggleTeklifSoruAction,
} from "../actions";
import { SayfaBasligi, Kart, Buton, Bilgi, BosDurum } from "../ui";

export const dynamic = "force-dynamic";

/**
 * Teklif formundaki EK BILGI SORULARI ekrani.
 *
 * Bazi ekipmanlara adet yetmiyor: yangin tesisatinda binanin m2'si, yangin
 * algilamada dedektor sayisi gibi bilgiler olmadan teklif hazirlanamiyor.
 * Bu sorular musteri o ekipmani sectiginde formda beliriyor.
 */
export default async function TeklifSorulariAdmin({
  searchParams,
}: {
  searchParams: Promise<{ duzenle?: string; kaydedildi?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const sorular = await tumSorular().catch(() => []);
  const duzenlenen = sp.duzenle ? sorular.find((s) => s.id === sp.duzenle) : undefined;

  // Slug -> okunabilir ad; listede ham slug yerine ekipman adi gosterilsin.
  const ekipmanAdi = new Map(
    KATEGORILER.flatMap((k) => k.ekipmanlar.map((e) => [e.slug, e.ad] as const))
  );

  return (
    <div>
      <SayfaBasligi
        baslik="📐 Teklif Formu — Ek Bilgi Soruları"
        aciklama="Müşteri bir ekipmanı seçtiğinde sorulacak ek sorular. Teklif hazırlamak için gereken m², kat sayısı, adet gibi bilgiler."
        onizleme="/teklif"
      />

      {sp.kaydedildi && (
        <div className="mb-5">
          <Bilgi>✓ Kaydedildi. Teklif sayfası güncellendi.</Bilgi>
        </div>
      )}

      <div className="mb-5">
        <Bilgi>
          Bu sorular <b>yalnızca ilgili ekipman seçildiğinde</b> forma çıkar. Örneğin
          &quot;Yangın Algılama Kontrolü&quot; seçilmezse dedektör sayısı sorulmaz. Böylece form
          uzamıyor, müşteri de alakasız soru görmüyor.
        </Bilgi>
      </div>

      <Kart baslik={`Tanımlı sorular (${sorular.length})`}>
        {sorular.length === 0 ? (
          <BosDurum
            ikon="📭"
            baslik="Henüz soru yok"
            aciklama="Aşağıdaki formdan ekleyebilirsiniz."
          />
        ) : (
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  {["Ekipman", "Soru", "Tip", "Sıra", ""].map((b) => (
                    <th key={b} className="py-2 pr-3 font-bold text-slate-600">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorular.map((s) => (
                  <tr
                    key={s.id}
                    className={`border-b border-slate-100 ${s.aktif ? "" : "opacity-50"}`}
                  >
                    <td className="py-2 pr-3">
                      {ekipmanAdi.get(s.ekipmanSlug) || (
                        <span className="text-red-600">
                          bilinmeyen: <code className="font-mono">{s.ekipmanSlug}</code>
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 font-semibold text-navy">{s.etiket}</td>
                    <td className="py-2 pr-3">{s.tip === "sayi" ? "sayı" : "metin"}</td>
                    <td className="py-2 pr-3">{s.sira}</td>
                    <td className="py-2 text-right whitespace-nowrap">
                      <a
                        href={`/admin/teklif-sorulari?duzenle=${s.id}`}
                        className="mr-3 text-blue hover:underline"
                      >
                        Düzenle
                      </a>
                      <form action={toggleTeklifSoruAction} className="inline">
                        <input type="hidden" name="id" value={s.id} />
                        <button className="mr-3 text-slate-500 hover:underline">
                          {s.aktif ? "Gizle" : "Göster"}
                        </button>
                      </form>
                      <form action={deleteTeklifSoruAction} className="inline">
                        <input type="hidden" name="id" value={s.id} />
                        <button className="text-red-600 hover:underline">Sil</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Kart>

      <div className="mt-5">
        <Kart baslik={duzenlenen ? "Soruyu düzenle" : "Yeni soru ekle"}>
          <form action={saveTeklifSoruAction} className="space-y-3">
            <input type="hidden" name="id" value={duzenlenen?.id || ""} />

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Hangi ekipman seçilince?</span>
              <select
                name="ekipmanSlug"
                defaultValue={duzenlenen?.ekipmanSlug || ""}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
              >
                <option value="">— seçiniz —</option>
                {KATEGORILER.map((k) => (
                  <optgroup key={k.baslik} label={`${k.ikon} ${k.baslik}`}>
                    {k.ekipmanlar.map((e) => (
                      <option key={e.slug} value={e.slug}>
                        {e.ad}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Soru</span>
              <input
                name="etiket"
                required
                defaultValue={duzenlenen?.etiket || ""}
                placeholder="Örn. Bina kaç m²?"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Cevap tipi</span>
                <select
                  name="tip"
                  defaultValue={duzenlenen?.tip || "metin"}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
                >
                  <option value="metin">Metin (m², serbest yazı)</option>
                  <option value="sayi">Sayı (adet, kat)</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Kutudaki örnek</span>
                <input
                  name="ornek"
                  defaultValue={duzenlenen?.ornek || ""}
                  placeholder="Örn: 2000 m²"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Sıra</span>
                <input
                  name="sira"
                  type="number"
                  defaultValue={duzenlenen?.sira ?? 1}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm"
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="aktif"
                defaultChecked={duzenlenen ? duzenlenen.aktif : true}
              />
              Formda görünsün
            </label>

            <div className="flex gap-3 pt-1">
              <Buton type="submit">{duzenlenen ? "Değişikliği kaydet" : "Ekle"}</Buton>
              {duzenlenen && (
                <a
                  href="/admin/teklif-sorulari"
                  className="self-center text-sm font-semibold text-slate-500 hover:underline"
                >
                  Vazgeç
                </a>
              )}
            </div>
          </form>
        </Kart>
      </div>
    </div>
  );
}
