import Link from "next/link";
import { getSettings } from "@/lib/cms";
import { saveSettingsAction } from "../actions";
import { guard } from "@/lib/auth";
import RenkPaneli from "./RenkPaneli";

export default async function SettingsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  await guard();
  const { kaydedildi } = await searchParams;
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

      <form action={saveSettingsAction} className="mt-6 space-y-8">
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
          <div className="grid grid-cols-2 gap-3">
            <TextField name="logo" label="Logo adresi" value={s.logo} />
            <TextField name="favicon" label="Favicon adresi" value={s.favicon} />
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

function TextField({ name, label, value }: { name: string; label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <input name={name} defaultValue={value} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
    </div>
  );
}
