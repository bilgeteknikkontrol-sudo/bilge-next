import { guard } from "@/lib/auth";
import { menuOku } from "@/lib/menu";
import { saveMenuAction } from "../actions";
import { SayfaBasligi, Kart, Buton, Bilgi, Alan } from "../ui";

/**
 * Menu duzenleyici — 3. maddenin cevabi.
 *
 * Ust menude 5 oge var; her biri icin bir kart. Her kartta ust baslik ve
 * (varsa) 8 satirlik alt menu var. Sabit sayida kutu gosteriliyor: bos
 * kutular kaydedilirken atlaniyor, yani "ekleme" = bos kutuyu doldurmak,
 * "silme" = kutuyu bosaltmak. JavaScript'li dinamik satir eklemeye gerek
 * kalmiyor, form basit ve tarayici destegi tam.
 *
 * "Hizmetler" ogesinin ICERIGI koddan geliyor (ekipman kategorileri);
 * panelden yalnizca etiketi degistirilebilir, bu yuzden alt menu kutusu yok.
 */

const UST_SAYISI = 6;
const ALT_SAYISI = 8;

export default async function MenuDuzenle({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  await guard();
  const { kaydedildi } = await searchParams;
  const menu = await menuOku();
  const satirlar = Array.from({ length: UST_SAYISI }, (_, i) => menu[i]);

  return (
    <div>
      <SayfaBasligi
        baslik="Menü"
        aciklama="Sitenin üst menüsü. Başlıkları değiştirebilir, bağlantı ekleyebilir veya çıkarabilirsiniz."
        onizleme="/"
      />

      {kaydedildi && (
        <div className="mb-5">
          <Bilgi>✓ Menü kaydedildi.</Bilgi>
        </div>
      )}

      <div className="mb-5">
        <Bilgi>
          <b>Nasıl çalışır:</b> Bir kutuyu boşaltırsanız o madde menüden kalkar; boş bir kutuyu
          doldurursanız yeni madde eklenir. Adresler <code>/iletisim</code> gibi eğik çizgiyle
          başlamalı. Üst menüde <b>en fazla 5 başlık</b> önerilir; fazlası dar ekranda taşar.
        </Bilgi>
      </div>

      <form action={saveMenuAction} className="space-y-4">
        {satirlar.map((oge, i) => {
          const ozel = oge?.ozel === "hizmetler";
          return (
            <Kart
              key={i}
              baslik={`${i + 1}. menü başlığı`}
              aciklama={
                ozel
                  ? "Bu başlığın açılan listesi ekipman kategorilerinden otomatik oluşur; sadece adını değiştirebilirsiniz."
                  : "Doğrudan bir sayfaya gitsin istiyorsanız adres yazın; alt başlıklar eklerseniz açılır menü olur."
              }
            >
              <input type="hidden" name={`ust_${i}_ozel`} value={ozel ? "hizmetler" : ""} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Alan
                  ad={`ust_${i}_etiket`}
                  etiket="Görünen başlık"
                  not="Boş bırakılırsa bu madde menüden kalkar"
                  deger={oge?.label ?? ""}
                  yerTutucu="örn. Kurumsal"
                />
                {!ozel && (
                  <Alan
                    ad={`ust_${i}_href`}
                    etiket="Adres (isteğe bağlı)"
                    not="Alt başlık eklerseniz boş bırakın"
                    deger={oge?.href ?? ""}
                    yerTutucu="/iletisim"
                  />
                )}
              </div>

              {!ozel && (
                <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4" open={Boolean(oge?.alt?.length)}>
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                    Açılır menü başlıkları ({oge?.alt?.length ?? 0})
                  </summary>
                  <div className="mt-4 space-y-4">
                    {Array.from({ length: ALT_SAYISI }, (_, j) => {
                      const alt = oge?.alt?.[j];
                      return (
                        <div key={j} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-3">
                          <Alan ad={`alt_${i}_${j}_etiket`} etiket="Başlık" deger={alt?.label ?? ""} yerTutucu="örn. Hakkımızda" />
                          <Alan ad={`alt_${i}_${j}_href`} etiket="Adres" deger={alt?.href ?? ""} yerTutucu="/kurumsal" />
                          <Alan ad={`alt_${i}_${j}_not`} etiket="Küçük açıklama" deger={alt?.not ?? ""} yerTutucu="Akreditasyon ve ekip" />
                        </div>
                      );
                    })}
                  </div>
                </details>
              )}
            </Kart>
          );
        })}

        <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <Buton type="submit">Menüyü kaydet</Buton>
        </div>
      </form>
    </div>
  );
}
