import Link from "next/link";
import { getSettings } from "@/lib/cms";
import { saveSettingsAction } from "../actions";
import { guard } from "@/lib/auth";
import RenkPaneli from "./RenkPaneli";

export default async function SettingsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string; hata?: string }>;
}) {
  await guard();
  const { kaydedildi, hata } = await searchParams;
  const s = await getSettings().catch(() => null);
  if (!s) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-700">
        Veritabanı bağlantısı yok. Ayarları düzenlemek için DATABASE_URL ekleyin.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-navy">Site Ayarları</h1>
      <p className="mt-1 text-sm text-slate-500">
        Renk paleti, yazı boyutları, logo ve sosyal medya adresleri. Sayfa yazıları için soldaki “Sayfalar” bölümünü kullanın.
      </p>

      {kaydedildi && (
        <div className="mt-4 rounded-xl border border-blue/25 bg-blue-soft px-4 py-3 text-sm text-navy">
          ✓ Ayarlar kaydedildi.
        </div>
      )}

      {hata === "buyuk" && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <b>Görsel çok büyük.</b> En fazla 6 MB yükleyebilirsiniz. Görseli küçültüp tekrar
          deneyin. <b>Diğer ayarlar kaydedilmedi.</b>
        </div>
      )}

      {/* encType: logo/favicon dosya alanlari var; sunucu eylemi FormData'yi
          coklu parca olarak almali, yoksa dosya bos gelir. */}
      <form action={saveSettingsAction} encType="multipart/form-data" className="mt-6 space-y-8">
        {/* Renkler: gruplu, aciklamali ve canli onizlemeli panel (istemci bileseni) */}
        <RenkPaneli colors={s.colors} />

        <Section title="Yazı Boyutları">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(s.fonts).map(([key, val]) => (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-600">{key}</label>
                <input name={`font_${key}`} defaultValue={val} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Logo ve sosyal medya">
          {/**
           * ⚠️ Logo ve favicon da diger gorsel alanlari gibi DOSYA SECEREK
           * yuklenebiliyor. Onceden yalnizca adres yazilabiliyordu; gorsel
           * eklemek icin Medya ekranina gidip adresi kopyalamak gerekiyordu.
           * Ayni tutarsizlik makale ve blok formlarinda da vardi, giderildi.
           */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { ad: "logo", etiket: "Logo", deger: s.logo, ipucu: "Tercihen SVG veya şeffaf PNG." },
              { ad: "favicon", etiket: "Favicon", deger: s.favicon, ipucu: "Kare, en az 512×512 px." },
            ].map((g) => (
              <div key={g.ad} className="rounded-lg border border-slate-200 p-3">
                <span className="text-xs font-semibold text-slate-600">{g.etiket}</span>

                {g.deger && (
                  <div className="mt-2 flex h-16 w-32 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.deger} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                )}

                <label className="mt-2 block">
                  <span className="mb-1 block text-xs text-slate-500">Bilgisayarınızdan seçin</span>
                  <input
                    type="file"
                    name={`${g.ad}Dosya`}
                    accept="image/*"
                    className="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
                  />
                  <span className="mt-1 block text-xs text-slate-400">
                    En fazla 6 MB. {g.ipucu} Yeni dosya seçmezseniz mevcut görsel korunur.
                  </span>
                </label>

                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-500">
                    veya adres gir
                  </summary>
                  <input
                    name={g.ad}
                    defaultValue={g.deger || ""}
                    placeholder="/img/logo.svg veya https://…"
                    className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </details>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-600">Sosyal medya (her satıra bir adres)</label>
            <textarea name="sameAs" rows={2} defaultValue={(s.sameAs || []).join("\n")} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
          </div>
          {/* ⚠️ Telefon, e-posta, adres ve ana sayfa metinleri bu ekrandan
              KALDIRILDI: ayni alanlar Admin > Sayfalar altinda da vardi ve
              iki ayri yerden duzenlenebiliyordu. Tek yer birakildi.
              (saveSettingsAction bu alanlar gonderilmediginde eski degeri
              koruyor, o yuzden kaldirmak veri kaybettirmiyor.) */}
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
            <b>Telefon, e-posta ve adres</b> artık{" "}
            <Link href="/admin/sayfa/iletisim" className="font-semibold text-blue underline">
              Sayfalar → İletişim
            </Link>{" "}
            ekranında.
            <br />
            <b>Ana sayfa yazıları</b> ise{" "}
            <Link href="/admin/sayfa/anasayfa" className="font-semibold text-blue underline">
              Sayfalar → Ana Sayfa
            </Link>{" "}
            ekranında.
          </p>
        </Section>


        <button className="rounded-lg bg-blue px-6 py-3 font-bold text-white hover:brightness-110">
          Ayarları Kaydet
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-3 font-bold text-slate-700">{title}</h2>
      {children}
    </div>
  );
}
