import Link from "next/link";
import { getLocations, getLocationBySlug } from "@/lib/cms";
import { saveLocationAction, deleteLocationAction } from "../actions";
import { guard } from "@/lib/auth";

export default async function LocationsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const list = await getLocations();
  const item = sp.edit ? await getLocationBySlug(sp.edit) : null;
  const isNew = Boolean(sp.new) && !item;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">Bölgeler</h1>
        <Link href="/admin/locations?new=1" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          + Yeni
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-700">Mevcut ({list.length})</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {list.map((l) => (
              <li key={l.slug} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-semibold text-slate-700">{l.title}</div>
                  <div className="text-xs text-slate-400">
                    /{l.slug} · {l.il} {l.aktif ? "" : "· PASİF"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/locations?edit=${l.slug}`} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                    Düzenle
                  </Link>
                  <form action={deleteLocationAction}>
                    <input type="hidden" name="slug" value={l.slug} />
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
          <h2 className="font-bold text-slate-700">{item || isNew ? "Düzenle" : "Yeni Bölge"}</h2>
          <form action={saveLocationAction} className="mt-4 space-y-3">
            <input type="hidden" name="slug" defaultValue={item?.slug || ""} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="İl" name="il" value={item?.il} required />
              <Field label="İlçe (opsiyonel)" name="ilce" value={item?.ilce} />
            </div>
            <Field label="Başlık" name="title" value={item?.title} required />
            <Field label="Açıklama (SEO)" name="description" value={item?.description} textarea />
            <Field label="Giriş yazısı" name="intro" value={item?.intro} textarea />
            <div>
              <label className="text-xs font-semibold text-slate-600">Hizmetler (her satıra bir)</label>
              <textarea name="hizmetler" rows={4} defaultValue={(item?.hizmetler || []).join("\n")} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sıra" name="sira" value={item?.sira} />
              <label className="flex items-center gap-2 pt-6 text-sm text-slate-600">
                <input type="checkbox" name="aktif" defaultChecked={item ? item.aktif : true} /> Aktif
              </label>
            </div>
            <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700">
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
}: {
  label: string;
  name: string;
  value?: string | number;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={value ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
      ) : (
        <input name={name} defaultValue={value ?? ""} required={required} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
      )}
    </div>
  );
}
