import { getMedia } from "@/lib/cms";
import { saveMediaAction, deleteMediaAction } from "../actions";
import { guard } from "@/lib/auth";

export default async function MediaAdmin({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const items = await getMedia().catch(() => []);
  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-navy">Medya Kütüphanesi</h1>
      <p className="mt-1 text-sm text-slate-500">
        Görsel yükleyin veya harici bir adres ekleyin. Yükledikten sonra karttaki adresi
        (<code className="font-mono">/api/gorsel/…</code>) kopyalayıp içerik bloklarına
        yapıştırın.
      </p>

      {sp.hata === "buyuk" && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <b>Dosya çok büyük.</b> En fazla 6 MB yükleyebilirsiniz. Görseli küçültüp
          (tercihen WebP olarak) tekrar deneyin.
        </p>
      )}
      {sp.hata === "bos" && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Ne dosya ne de adres verildi.
        </p>
      )}

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-700">Yeni Görsel</h2>
        <form action={saveMediaAction} className="mt-3 space-y-3" encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-3">
            <input name="name" placeholder="Görsel adı" className="rounded-lg border border-slate-300 p-2 text-sm" />
            <input name="alt" placeholder="Alt metin" className="rounded-lg border border-slate-300 p-2 text-sm" />
          </div>
          <input type="file" name="file" accept="image/*" className="block w-full text-sm" />
          <div className="text-center text-xs text-slate-400">— veya —</div>
          <input name="url" placeholder="Harici görsel URL'si" className="w-full rounded-lg border border-slate-300 p-2 text-sm" />
          <button className="rounded-lg bg-blue px-5 py-2 font-bold text-white hover:brightness-110">
            Ekle
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="aspect-video overflow-hidden rounded-lg bg-slate-100">
              {/* Adres artik /api/gorsel/<id>; base64 govdesi listeye hic gelmiyor. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt} className="h-full w-full object-cover" />
            </div>
            <div className="mt-2 truncate text-xs font-semibold text-slate-700">{m.name}</div>
            <div className="mt-1 flex items-center gap-2">
              <input
                readOnly
                value={m.url}
                className="w-full rounded border border-slate-200 bg-slate-50 p-1 text-[10px] text-slate-500"
              />
              <form action={deleteMediaAction}>
                <input type="hidden" name="id" value={m.id} />
                <button className="shrink-0 text-xs text-red-600 hover:underline">Sil</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
