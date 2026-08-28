import Link from "next/link";
import { getEquipment, getEquipmentBySlug } from "@/lib/cms";
import { saveEquipmentAction, deleteEquipmentAction } from "../actions";
import { guard } from "@/lib/auth";

export default async function EquipmentAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const list = await getEquipment();
  const item = sp.edit ? await getEquipmentBySlug(sp.edit) : null;
  const isNew = Boolean(sp.new) && !item;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-navy">Ekipmanlar</h1>
        <Link href="/admin/equipment?new=1" className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Yeni
        </Link>
      </div>

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
          <form action={saveEquipmentAction} className="mt-4 space-y-3">
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
