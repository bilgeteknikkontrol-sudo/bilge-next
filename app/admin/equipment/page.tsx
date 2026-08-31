import Link from "next/link";
import { getEquipment, getEquipmentBySlug } from "@/lib/cms";
import { saveEquipmentAction, deleteEquipmentAction, hizmetMetinleriniAktarAction } from "../actions";
import { guard } from "@/lib/auth";
import GorselSecici from "../GorselSecici";

export default async function EquipmentAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string; hata?: string; aktarildi?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const list = await getEquipment();
  const item = sp.edit ? await getEquipmentBySlug(sp.edit) : null;
  const isNew = Boolean(sp.new) && !item;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          {/* Sitede "Hizmetlerimiz" yaziyor; panelde "Ekipmanlar" deniyordu ve
              kullanici hizmet ekleme ekranini bulamadi. Iki terim de basliqta. */}
          <h1 className="text-2xl font-black tracking-tight text-navy">Hizmetler (Ekipmanlar)</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sitedeki <b>Hizmetlerimiz</b> sayfasında ve menüde görünen hizmetler. Buradan yeni
            hizmet ekleyebilir, adını, periyodunu ve görselini değiştirebilirsiniz.
          </p>
        </div>
        <Link href="/admin/equipment?new=1" className="shrink-0 rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Yeni hizmet
        </Link>
      </div>

      {sp.aktarildi && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          ✓ {sp.aktarildi} hizmetin sayfa metni panele aktarıldı. Artık aşağıdaki formdan
          düzenleyebilirsiniz.
        </p>
      )}

      {/**
       * ⚠️ Hizmet sayfasi metinleri kodda (lib/ekipman-icerik.ts) duruyor.
       * Bu dugme onlari veritabanina kopyalar; ancak ondan sonra panelden
       * duzenlenebilir hale gelirler. Yoksa alanlar bos gorunur ve kullanici
       * sayfa dolusu metni sifirdan yazmak zorunda kalir.
       */}
      <details className="mt-4 rounded-xl border border-blue/30 bg-blue-soft/50 p-4">
        <summary className="cursor-pointer text-sm font-bold text-navy">
          Sayfa metinlerini panele aktar
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-navy">
          Hizmet sayfalarındaki uzun metinler (giriş, gövde, sık sorulan sorular) şu an kod
          içinde tanımlı ve panelde <b>boş görünüyor</b>. Bu düğme onları panele kopyalar;
          ardından buradan düzenleyebilirsiniz.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-navy">
          <b>Güvenli:</b> yalnızca boş olan alanları doldurur, panelden daha önce
          düzenlediğiniz metinleri <b>ezmez</b>. Birden fazla kez çalıştırabilirsiniz.
        </p>
        <form action={hizmetMetinleriniAktarAction} className="mt-3">
          <button className="rounded-lg bg-blue px-4 py-2 text-sm font-bold text-white hover:brightness-110">
            Aktar
          </button>
        </form>
      </details>

      {sp.hata === "buyuk" && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <b>Görsel çok büyük.</b> En fazla 6 MB. Görseli küçültüp tekrar deneyin.{" "}
          <b>Diğer alanlar kaydedilmedi.</b>
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-700">Mevcut ({list.length})</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {list.map((e) => (
              <li key={e.slug} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-semibold text-slate-700">{e.ad}</div>
                  <div className="text-xs text-slate-400">
                    /{e.slug} · {e.kategori} {e.aktif ? "" : "· PASİF"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/equipment?edit=${e.slug}`} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                    Düzenle
                  </Link>
                  <form action={deleteEquipmentAction}>
                    <input type="hidden" name="slug" value={e.slug} />
                    <button className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100">
                      Sil
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-700">{item || isNew ? "Düzenle" : "Yeni Ekipman"}</h2>
          {/* encType: gorsel dosya alani var; yoksa dosya bos gelir. */}
          <form action={saveEquipmentAction} encType="multipart/form-data" className="mt-4 space-y-3">
            <input type="hidden" name="slug" defaultValue={item?.slug || ""} />
            <Field label="Ad" name="ad" value={item?.ad} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kategori" name="kategori" value={item?.kategori} />
              <Field label="Standart" name="standart" value={item?.standart} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Periyot (ay)" name="periyot" value={item?.periyot} />
              <Field label="Sıra" name="sira" value={item?.sira} />
              <label className="flex items-center gap-2 pt-6 text-sm text-slate-600">
                <input type="checkbox" name="aktif" defaultChecked={item ? item.aktif : true} /> Aktif
              </label>
            </div>
            <Field label="Periyot notu" name="periyotNot" value={item?.periyotNot} />

            {/**
             * ⚠️ Hizmet gorseli: onceden ekipmanda gorsel alani HIC YOKTU.
             * Gorseller yalnizca kodda (lib/images.ts) slug eslesmesiyle
             * duruyordu; panelden yeni bir hizmet eklendiginde gorseli
             * olmuyordu ve degistirmenin tek yolu kod dagitimiydi.
             */}
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-xs font-semibold text-slate-600">Hizmet görseli</span>

              {item?.image && (
                <div className="mt-2 h-24 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}

              <label className="mt-2 block">
                <span className="mb-1 block text-xs text-slate-500">Bilgisayarınızdan seçin</span>
                <GorselSecici
                  name="gorselDosya"
                  ipucu={
                    <>
                      Büyük fotoğraflar tarayıcıda otomatik küçültülür.
                      {item?.image
                        ? " Yeni dosya seçmezseniz mevcut görsel korunur."
                        : " Boş bırakırsanız hizmetin kendi varsayılan görseli kullanılır."}
                    </>
                  }
                />
              </label>

              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-slate-500">
                  veya adres gir
                </summary>
                <input
                  name="image"
                  defaultValue={item?.image || ""}
                  placeholder="/img/ornek.webp veya https://…"
                  className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </details>
            </div>

            {/**
             * ⚠️ SAYFA METNI ALANLARI: onceden panelde YOKTU. Hizmet sayfasinda
             * sayfa dolusu metin goruluyordu ama duzenlenecek bir yer yoktu;
             * icerik yalnizca kodda (lib/ekipman-icerik.ts) duruyordu ve
             * degistirmenin tek yolu kod dagitimiydi.
             *
             * Bos birakilan alan koddaki varsayilana duser — alanlar tek tek
             * degerlendirildigi icin yalnizca girisi degistirip govdeyi
             * oldugu gibi birakmak mumkun.
             */}
            <details className="rounded-lg border border-slate-200 p-3" open={Boolean(item?.lead || item?.body)}>
              <summary className="cursor-pointer text-xs font-bold text-navy">
                Sayfa metni (giriş, gövde, SSS)
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Hizmet sayfasında görünen yazılar. <b>Boş bırakılan alan</b>, sitedeki mevcut
                (kod içindeki) metniyle görünmeye devam eder. Mevcut metni düzenlemek için önce
                yukarıdaki <b>&quot;Sayfa metinlerini panele aktar&quot;</b> düğmesini kullanın.
              </p>

              <label className="mt-3 block">
                <span className="text-xs font-semibold text-slate-600">Giriş yazısı</span>
                <textarea
                  name="lead"
                  rows={3}
                  defaultValue={item?.lead || ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </label>

              <label className="mt-3 block">
                <span className="text-xs font-semibold text-slate-600">Gövde (HTML)</span>
                <textarea
                  name="body"
                  rows={12}
                  defaultValue={item?.body || ""}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
                />
                <span className="mt-1 block text-xs text-slate-400">
                  Başlık için &lt;h2&gt;, paragraf için &lt;p&gt;, liste için &lt;ul&gt;&lt;li&gt;
                  kullanın.
                </span>
              </label>

              <label className="mt-3 block">
                <span className="text-xs font-semibold text-slate-600">
                  Sık sorulan sorular
                </span>
                <textarea
                  name="faq"
                  rows={6}
                  defaultValue={JSON.stringify(item?.faq || [], null, 0)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
                />
                <span className="mt-1 block text-xs text-slate-400">
                  JSON dizisi ya da satır satır: bir satır soru, bir satır cevap.
                </span>
              </label>
            </details>

            <button className="rounded-lg bg-blue px-5 py-2.5 font-bold text-white hover:brightness-110">
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  required,
}: {
  label: string;
  name: string;
  value?: string | number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <input name={name} defaultValue={value ?? ""} required={required} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
    </div>
  );
}
