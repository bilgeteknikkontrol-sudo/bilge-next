import Link from "next/link";
import { getArticles, getArticleBySlug } from "@/lib/cms";
import { saveArticleAction, deleteArticleAction, yazilariKoddanAktarAction } from "../actions";
import { guard } from "@/lib/auth";
import GorselSecici from "../GorselSecici";

export default async function ArticlesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string; aktarildi?: string; hata?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const list = await getArticles();
  const editSlug = sp.edit;
  const item = editSlug ? await getArticleBySlug(editSlug) : null;
  const isNew = Boolean(sp.new) && !item;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-navy">Makaleler</h1>
        <Link href="/admin/articles?new=1" className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Yeni
        </Link>
      </div>

      {sp.hata === "buyuk" && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <b>Görsel çok büyük.</b> En fazla 6 MB. Görseli küçültüp (tercihen WebP, 1600 px
          genişlik) tekrar deneyin. <b>Diğer alanlar kaydedilmedi.</b>
        </p>
      )}

      {sp.aktarildi && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          ✓ {sp.aktarildi} yazı koddaki güncel metinle değiştirildi.
        </p>
      )}

      {/**
       * ⚠️ lib/content.ts yalnizca ILK KURULUM TOHUMUDUR. Veritabani bir kez
       * doldurulduktan sonra site yazilari ORADAN okur; kod dosyasindaki
       * degisiklikler canliya yansimaz. 2026-08-30'da dort yazi genisletilip
       * otuz yaziya kisa arama basligi eklendi ama canlida hicbir sey
       * degismedi — sebebi buydu. Bu dugme koddaki guncel metinleri aktarir.
       */}
      <details className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <summary className="cursor-pointer text-sm font-bold text-amber-900">
          Koddaki güncel yazı metinlerini aktar
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-amber-900">
          Yazılar veritabanından okunur. Geliştirme sırasında kod içindeki metinler
          güncellendiğinde bu değişiklikler <b>kendiliğinden canlıya yansımaz</b>; aşağıdaki
          düğmeyle aktarılması gerekir.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-amber-900">
          <b>Dikkat:</b> Kodda tanımlı yazıların başlık, açıklama ve gövde metinleri koddaki
          hâliyle değiştirilir — o yazılarda panelden yaptığınız düzenlemeler kaybolur.
          Sıralama ve yayın durumu korunur. Kodda bulunmayan yazılara dokunulmaz.
        </p>
        <form action={yazilariKoddanAktarAction} className="mt-3">
          <button className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:brightness-110">
            Aktar
          </button>
        </form>
      </details>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-700">Mevcut ({list.length})</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {list.map((a) => (
              <li key={a.slug} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-semibold text-slate-700">{a.title}</div>
                  <div className="text-xs text-slate-400">
                    /{a.slug} · {a.category} {a.aktif ? "" : "· PASİF"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/articles?edit=${a.slug}`} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                    Düzenle
                  </Link>
                  <form action={deleteArticleAction}>
                    <input type="hidden" name="slug" value={a.slug} />
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
          <h2 className="font-bold text-slate-700">{item || isNew ? "Düzenle" : "Yeni Makale"}</h2>
          {/* encType: gorsel dosya alani var; sunucu eylemi FormData'yi coklu
              parca olarak almali, yoksa dosya bos gelir. */}
          <form action={saveArticleAction} encType="multipart/form-data" className="mt-4 space-y-3">
            {/* ⚠️ Adres alani onceden "slug2" adiyla gonderiliyordu ama
                saveArticleAction "slug" okuyor; yani yazilan adres SESSIZCE
                yok sayiliyor, her zaman baslikten uretiliyordu.
                Yeni kayitta alan artik gercekten "slug".
                Duzenlemede adres degistirilmiyor: eski adres 404'e duser ve
                arama motorundaki siralamasi kaybolur. Mevcut adres salt
                okunur gosteriliyor ve gizli alanla gonderiliyor. */}
            {item ? (
              <>
                <input type="hidden" name="slug" defaultValue={item.slug} />
                <div>
                  <label className="text-xs font-semibold text-slate-600">Adres (değiştirilemez)</label>
                  <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs text-slate-500">
                    /yazilar/{item.slug}
                  </p>
                </div>
              </>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Başlık" name="title" value={item?.title} required />
              <Field label="Kategori" name="category" value={item?.category} />
            </div>
            {/* Arama sonucu basligi: H1 uzun ve aciklayici olabilir ama title
                etiketi 60 karakteri gecerse Google kirpar. bkz. lib/seo-baslik.ts */}
            <Field
              label="Arama sonucu başlığı (boş = yukarıdaki başlık)"
              name="seoTitle"
              value={item?.seoTitle}
              placeholder="En fazla 60 karakter"
            />
            <Field label="Kısa Açıklama (SEO)" name="description" value={item?.description} textarea />
            <div className="grid grid-cols-3 gap-3">
              {!item && (
                <Field label="Adres (boş=otomatik)" name="slug" value="" placeholder="baslikten-uretilir" />
              )}
              <Field label="Tarih" name="date" value={item?.date} />
              <Field label="Okuma dk" name="readMin" value={item?.readMin} />
            </div>
            <Field label="Anahtar kelimeler (virgülle)" name="keywords" value={item?.keywords?.join(", ")} />

            {/* Yazi gorseli — bos birakilirsa slug'a gore varsayilan gorsel kullanilir */}
            {/**
             * ⚠️ Onceden yalnizca ADRES alani vardi: gorsel eklemek icin Medya
             * ekranina gidip yukleyip adresi kopyalayip buraya donmek
             * gerekiyordu. Blok (slayt) formunda dosya secme zaten vardi;
             * makale formunda olmamasi tutarsizdi. Ayni `dosyaYukle` yardimcisi
             * burada da kullaniliyor.
             */}
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-xs font-semibold text-slate-600">Yazı görseli</span>

              <label className="mt-2 block">
                <span className="mb-1 block text-xs text-slate-500">Bilgisayarınızdan seçin</span>
                <GorselSecici
                  name="gorselDosya"
                  ipucu={
                    <>
                      Büyük fotoğraflar tarayıcıda otomatik küçültülür.
                      {item?.image
                        ? " Yeni dosya seçmezseniz mevcut görsel korunur."
                        : " Boş bırakırsanız yazının kendi varsayılan görseli kullanılır."}
                    </>
                  }
                />
              </label>

              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-semibold text-slate-500">
                  veya adres gir (harici görsel)
                </summary>
                <input
                  name="image"
                  defaultValue={item?.image || ""}
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

              {item?.image && (
                <div className="mt-3 h-24 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <Field label="Giriş (lead)" name="lead" value={item?.lead} textarea />
            <div>
              <label className="text-xs font-semibold text-slate-600">İçerik (HTML)</label>
              <textarea name="body" rows={10} defaultValue={item?.body || ""} className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">SSS (JSON dizisi veya satır: soru / cevap)</label>
              <textarea name="faq" rows={5} defaultValue={JSON.stringify(item?.faq || [], null, 0)} className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sıra" name="sira" value={item?.sira} />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="aktif" defaultChecked={item ? item.aktif : true} /> Aktif (yayında)
              </label>
            </div>
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
  textarea,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  value?: string | number;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={value ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
      ) : (
        <input name={name} defaultValue={value ?? ""} placeholder={placeholder} required={required} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
      )}
    </div>
  );
}
