import { notFound } from "next/navigation";
import { guard } from "@/lib/auth";
import { getAllContent, getSettings } from "@/lib/cms";
import { sayfaBul, ADMIN_SAYFALAR } from "@/lib/admin-sayfalar";
import { TUM_ALANLAR } from "@/lib/sayfa-metin";
import { tumBloklar } from "@/lib/bloklar";
import { saveSayfaIcerikAction, sertifikalariAktarAction } from "../../actions";
import BlokYonetici from "../../BlokYonetici";
import { SayfaBasligi, Kart, Buton, Bilgi, Alan, ButonLink } from "../../ui";

export const dynamic = "force-dynamic";

/**
 * Tek bir SITE SAYFASININ panel ekrani.
 *
 * Amac: "ana sayfayi degistireceğim" diyen kisinin tek bir yere gidip o
 * sayfaya ait her seyi bulmasi — yazilar, gorseller, listeler.
 * Hangi sayfanin nelerden olustugu lib/admin-sayfalar.ts icinde tanimli.
 *
 * Metin ve ayar alanlari TEK formda kaydediliyor; bloklar kendi formlarini
 * kullaniyor (her blok ayri bir kayit oldugu icin).
 */
export async function generateStaticParams() {
  return ADMIN_SAYFALAR.map((s) => ({ id: s.id }));
}

export default async function AdminSayfaEkrani({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kaydedildi?: string; duzenle?: string }>;
}) {
  await guard();
  const { id } = await params;
  const sp = await searchParams;
  const sayfa = sayfaBul(id);
  if (!sayfa) notFound();

  const [satirlar, ayarlar, bloklarHepsi] = await Promise.all([
    getAllContent().catch(() => []),
    getSettings().catch(() => null),
    tumBloklar().catch(() => []),
  ]);
  const sertifikaSayisi = bloklarHepsi.filter((b) => b.tur === "sertifika").length;
  const kayitli = Object.fromEntries(satirlar.map((s) => [s.key, s.value]));
  const varsayilan = Object.fromEntries(TUM_ALANLAR.map((a) => [a.anahtar, a]));

  // Metin + ayar bolumleri tek formda; hangi alanlarin gonderildigini
  // kaydetme eylemi bilsin diye anahtar listesi gizli alanda tasiniyor.
  const metinAnahtarlari = sayfa.bolumler.flatMap((b) => (b.tip === "metin" ? b.anahtarlar : []));
  const ayarAlanlari = sayfa.bolumler.flatMap((b) => (b.tip === "ayar" ? b.alanlar.map((a) => a.ad) : []));
  const formVar = metinAnahtarlari.length > 0 || ayarAlanlari.length > 0;
  const donusYolu = `/admin/sayfa/${sayfa.id}`;

  return (
    <div>
      <SayfaBasligi
        baslik={`${sayfa.ikon} ${sayfa.ad}`}
        aciklama={sayfa.aciklama}
        onizleme={sayfa.yol}
      />

      {sp.kaydedildi && (
        <div className="mb-5">
          <Bilgi>✓ Kaydedildi. Sayfayı yenilediğinizde yeni hâli görünür.</Bilgi>
        </div>
      )}

      <div className="space-y-4">
        {/* --- Yazılar ve ayarlar: tek form --- */}
        {formVar && (
          <form action={saveSayfaIcerikAction} className="space-y-4">
            <input type="hidden" name="sayfaId" value={sayfa.id} />

            {sayfa.bolumler.map((b, i) => {
              if (b.tip === "metin") {
                return (
                  <Kart key={i} baslik={b.baslik} aciklama={b.aciklama}>
                    <div className="grid gap-4">
                      {b.anahtarlar.map((anahtar) => {
                        const alan = varsayilan[anahtar];
                        if (!alan) return null;
                        return (
                          <Alan
                            key={anahtar}
                            ad={anahtar}
                            etiket={alan.etiket}
                            not={alan.not}
                            uzun={alan.uzun}
                            satir={alan.uzun ? 3 : undefined}
                            deger={kayitli[anahtar] ?? alan.varsayilan}
                            yerTutucu={alan.varsayilan}
                          />
                        );
                      })}
                    </div>
                  </Kart>
                );
              }
              if (b.tip === "ayar") {
                return (
                  <Kart key={i} baslik={b.baslik} aciklama={b.aciklama}>
                    <div className="grid gap-4">
                      {b.alanlar.map((a) => (
                        <Alan
                          key={a.ad}
                          ad={`ayar_${a.ad}`}
                          etiket={a.etiket}
                          not={a.not}
                          uzun={a.uzun}
                          satir={a.uzun ? 3 : undefined}
                          deger={(ayarlar as Record<string, unknown> | null)?.[a.ad] as string | undefined}
                        />
                      ))}
                    </div>
                  </Kart>
                );
              }
              return null;
            })}

            <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
              <Buton type="submit">Yazıları kaydet</Buton>
            </div>
          </form>
        )}

        {/* --- Görsel / liste bölümleri: kendi formları --- */}
        {sayfa.bolumler.map((b, i) => {
          if (b.tip === "blok") {
            return (
              <div key={i}>
                {/* Sertifikalar ilk basta kodda gomulu geliyor; kullanicinin
                    panelden duzenleyebilmesi icin once gercek kayda cevrilmeli. */}
                {b.tur === "sertifika" && sertifikaSayisi === 0 && (
                  <div className="mb-3">
                    <Bilgi>
                      Şu an sayfada kodda tanımlı 5 belge görünüyor; bunlar panelden
                      düzenlenemiyor. Aşağıdaki düğmeye basarsanız beşi de düzenlenebilir kayda
                      dönüşür — sonra başlıklarını, sıralarını ve görsellerini değiştirebilirsiniz.
                      <form action={sertifikalariAktarAction} className="mt-3">
                        <Buton type="submit">Belgeleri panele aktar</Buton>
                      </form>
                    </Bilgi>
                  </div>
                )}
                <BlokYonetici
                  tur={b.tur}
                  baslik={b.baslik}
                  aciklama={b.aciklama}
                  donusYolu={donusYolu}
                  duzenlenenId={sp.duzenle}
                />
              </div>
            );
          }
          if (b.tip === "kayit") {
            return (
              <Kart key={i} baslik={b.baslik} aciklama={b.aciklama}>
                <ButonLink href={b.yol} tur="birincil">
                  {b.dugme} →
                </ButonLink>
              </Kart>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
