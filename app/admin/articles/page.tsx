import Link from "next/link";
import { getArticles, getArticleBySlug } from "@/lib/cms";
import { saveArticleAction, deleteArticleAction } from "../actions";
import { guard } from "@/lib/auth";

export default async function ArticlesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
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
          <form action={saveArticleAction} className="mt-4 space-y-3">
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
            <div>
              <label className="text-xs font-semibold text-slate-600">Görsel adresi</label>
              <input
                name="image"
                defaultValue={item?.image || ""}
                placeholder="/img/ornek.webp  ·  https://…  ·  Medya Kütüphanesi'nden kopyalanan adres"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
              />
              <p className="mt-1 text-xs text-slate-500">
                Boş bırakırsanız yazının kendi varsayılan görseli kullanılır. Görsel yüklemek için{" "}
                <a href="/admin/media" className="font-semibold text-blue underline">
                  Medya Kütüphanesi
                </a>
                &apos;ni kullanıp adresi buraya yapıştırın.
              </p>
              {item?.image && (
                <div className="mt-2 h-24 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
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
