import { guard } from "@/lib/auth";
import { getAllContent } from "@/lib/cms";
import { METIN_GRUPLARI } from "@/lib/sayfa-metin";
import { saveSayfaMetinleriAction } from "../actions";
import { SayfaBasligi, Kart, Buton, Bilgi, Alan } from "../ui";

/**
 * Sayfa Metinleri ekrani — 1. maddenin cevabi.
 *
 * Once bu isi yalnizca /admin/content yapiyordu ve kullanicinin "footer_yazi"
 * gibi anahtarlari ezberlemesi gerekiyordu. Burada her sayfa bir kart, her
 * alan etiketli bir kutu; anahtarlar gorunmuyor bile.
 *
 * Tum alanlar TEK formda; bir kere "Kaydet" yeterli. Bos birakilan alan
 * kayittan silinir ve sayfa varsayilan metnine doner (bkz. saveSayfaMetinleriAction).
 */
export default async function SayfaMetinleri({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  await guard();
  const { kaydedildi } = await searchParams;
  const satirlar = await getAllContent().catch(() => []);
  const kayitli = Object.fromEntries(satirlar.map((s) => [s.key, s.value]));

  return (
    <div>
      <SayfaBasligi
        baslik="Sayfa Metinleri"
        aciklama="Sitedeki her sayfanın başlığı ve giriş yazısı burada. Kutuya yazıp en alttan kaydedin."
      />

      {kaydedildi && (
        <div className="mb-5">
          <Bilgi>✓ Kaydedildi. Siteyi yenilediğinizde yeni hâli görünür.</Bilgi>
        </div>
      )}

      <div className="mb-5">
        <Bilgi>
          Bir kutuyu <b>boş bırakırsanız</b> o alan kendi varsayılan yazısına döner — yani yanlışlıkla
          silmekten korkmayın. Yazının içine HTML etiketi yazmayın, düz metin olarak girin.
        </Bilgi>
      </div>

      <form action={saveSayfaMetinleriAction} className="space-y-4">
        {METIN_GRUPLARI.map((g) => (
          <Kart
            key={g.baslik}
            baslik={g.baslik}
            sag={
              <a
                href={g.yol}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none text-xs font-semibold text-blue hover:underline"
              >
                Sayfayı gör ↗
              </a>
            }
          >
            <div className="grid gap-4">
              {g.alanlar.map((a) => (
                <Alan
                  key={a.anahtar}
                  ad={a.anahtar}
                  etiket={a.etiket}
                  not={a.not}
                  uzun={a.uzun}
                  satir={a.uzun ? 3 : undefined}
                  deger={kayitli[a.anahtar] ?? a.varsayilan}
                  yerTutucu={a.varsayilan}
                />
              ))}
            </div>
          </Kart>
        ))}

        {/* Uzun sayfada dugmenin kaybolmamasi icin alta yapisiyor */}
        <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <Buton type="submit">Tüm metinleri kaydet</Buton>
        </div>
      </form>
    </div>
  );
}
