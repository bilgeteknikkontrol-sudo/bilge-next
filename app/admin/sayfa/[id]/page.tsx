import { notFound } from "next/navigation";
import { guard } from "@/lib/auth";
import { getAllContent, getSettings } from "@/lib/cms";
import { sayfaBul, ADMIN_SAYFALAR } from "@/lib/admin-sayfalar";
import { TUM_ALANLAR } from "@/lib/sayfa-metin";
import { BICIM_IPUCU } from "@/lib/metin-bicim";
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
  searchParams: Promise<{ kaydedildi?: string; duzenle?: string; hata?: string }>;
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

  const donusYolu = `/admin/sayfa/${sayfa.id}`;

  /**
   * BOLUMLER TANIMLANDIKLARI SIRAYLA basiliyor.
   *
   * ⚠️ Onceden once TUM metin/ayar bolumleri tek formda, sonra TUM blok
   * bolumleri basiliyordu. Ana sayfada sonuc suydu:
   *   Üst bölüm (hero) → Hizmetler → Hakkımızda → Alt çağrı → [Yazıları kaydet]
   *   → Üst bölüm slayt görselleri
   * Yani hero gorseli, hero yazilarindan dort bolum ve bir kaydet dugmesi
   * asagida kaliyordu. "Üst bölüm (hero)" kartina bakan kisi orada gorsel
   * alani goremeyip "panelden gorsel eklenemiyor" sonucuna variyordu — nitekim
   * oyle oldu.
   *
   * Artik ardisik metin/ayar bolumleri bir gruba toplanip kendi formunu
   * aliyor; araya bir blok bolumu girdiginde grup kapaniyor. Boylece hero
   * gorseli hero yazilarinin hemen altinda.
   *
   * Formu bolmek GUVENLI: saveSayfaIcerikAction her alani `formData.has()` ile
   * kontrol ediyor, gonderilmeyen alanlara dokunmuyor (silmiyor).
   */
  type Bolum = (typeof sayfa.bolumler)[number];
  type Grup = { tip: "form"; bolumler: Bolum[] } | { tip: "tekil"; bolum: Bolum };
  const gruplar: Grup[] = [];
  for (const b of sayfa.bolumler) {
    if (b.tip === "metin" || b.tip === "ayar") {
      const son = gruplar[gruplar.length - 1];
      if (son && son.tip === "form") son.bolumler.push(b);
      else gruplar.push({ tip: "form", bolumler: [b] });
    } else {
      gruplar.push({ tip: "tekil", bolum: b });
    }
  }

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
        {gruplar.map((g, gi) => {
          if (g.tip === "form") {
            return (
              <form key={gi} action={saveSayfaIcerikAction} className="space-y-4">
                <input type="hidden" name="sayfaId" value={sayfa.id} />

                {g.bolumler.map((b, i) => {
                  if (b.tip === "metin") {
                return (
                  <Kart key={i} baslik={b.baslik} aciklama={b.aciklama}>
                    <div className="grid gap-4">
                      {b.anahtarlar.map((anahtar) => {
                        const alan = varsayilan[anahtar];
                        if (!alan) return null;
                        /**
                         * ⚠️ Uzun govde alanlari 3 satirlik kutuya sigmiyor:
                         * Kurumsal metni 2000+ karakter ve kullanici yazinin
                         * tamamini goremeden duzenlemek zorunda kaliyordu.
                         * Bicimlendirilebilir alanlar hem buyuk aciliyor hem
                         * de altinda isaretlerin ne ise yaradigi yaziyor.
                         */
                        const satirSayisi = alan.bicimli ? 18 : alan.uzun ? 3 : undefined;
                        const not = alan.bicimli
                          ? `${alan.not ? alan.not + " " : ""}${BICIM_IPUCU}`
                          : alan.not;
                        return (
                          <Alan
                            key={anahtar}
                            ad={anahtar}
                            etiket={alan.etiket}
                            not={not}
                            uzun={alan.uzun}
                            satir={satirSayisi}
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

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Buton type="submit">Yazıları kaydet</Buton>
                </div>
              </form>
            );
          }

          const b = g.bolum;
          if (b.tip === "blok") {
            return (
              <div key={gi}>
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
                  hata={sp.hata}
                />
              </div>
            );
          }
          if (b.tip === "kayit") {
            return (
              <Kart key={gi} baslik={b.baslik} aciklama={b.aciklama}>
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
