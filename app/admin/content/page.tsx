import { getAllContent } from "@/lib/cms";
import { saveContentAction, deleteContentAction } from "../actions";
import { guard } from "@/lib/auth";

export default async function ContentAdmin() {
  await guard();
  const rows = await getAllContent().catch(() => []);
  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800">Metinler (site geneli)</h1>
      <p className="mt-1 text-sm text-slate-500">
        Sayfalarda kullanılan serbest metinleri anahtar (key) ile yönetin. Örnek key: footer_yazi,
        neden_baslik, referans_metin.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-700">Yeni / Güncelle</h2>
        <form action={saveContentAction} className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="key" placeholder="anahtar (key)" className="rounded-lg border border-slate-300 p-2 text-sm" required />
            <input name="value" placeholder="değer (metin)" className="rounded-lg border border-slate-300 p-2 text-sm" />
          </div>
          <button className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700">
            Kaydet
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-700">Mevcut ({rows.length})</h2>
        {rows.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">Henüz kayıtlı metin yok.</p>
        )}
        <ul className="mt-3 divide-y divide-slate-100">
          {rows.map((r) => (
            <li key={r.key} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-blue-700">{r.key}</div>
                  <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{r.value}</div>
                </div>
                <form action={deleteContentAction}>
                  <input type="hidden" name="key" value={r.key} />
                  <button className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100">
                    Sil
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
