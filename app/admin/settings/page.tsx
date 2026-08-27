import { getSettings } from "@/lib/cms";
import { saveSettingsAction } from "../actions";
import { guard } from "@/lib/auth";
import RenkPaneli from "./RenkPaneli";

export default async function SettingsAdmin() {
  await guard();
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
      <h1 className="text-2xl font-black text-slate-800">Site Ayarları</h1>
      <p className="mt-1 text-sm text-slate-500">
        Renkler, yazı boyutları, logo, iletişim ve ana sayfa metinleri buradan yönetilir.
      </p>

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

        <Section title="Logo / İletişim">
          <div className="grid grid-cols-2 gap-3">
            <TextField name="logo" label="Logo URL" value={s.logo} />
            <TextField name="favicon" label="Favicon URL" value={s.favicon} />
            <TextField name="phone" label="Telefon" value={s.phone} />
            <TextField name="email" label="E-posta" value={s.email} />
          </div>
          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-600">Adres</label>
            <input name="address" defaultValue={s.address} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
          </div>
          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-600">Sosyal medya (her satıra bir URL)</label>
            <textarea name="sameAs" rows={2} defaultValue={(s.sameAs || []).join("\n")} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
          </div>
        </Section>

        <Section title="Ana Sayfa Metinleri">
          <div className="space-y-3">
            <TextField name="heroTitle" label="Hero Başlık" value={s.heroTitle} />
            <div>
              <label className="text-xs font-semibold text-slate-600">Hero Alt Başlık</label>
              <textarea name="heroSubtitle" rows={2} defaultValue={s.heroSubtitle} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
            </div>
            <TextField name="aboutTitle" label="Hakkımızda Başlık" value={s.aboutTitle} />
            <div>
              <label className="text-xs font-semibold text-slate-600">Hakkımızda Yazısı</label>
              <textarea name="aboutText" rows={3} defaultValue={s.aboutText} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
            </div>
            <TextField name="ctaTitle" label="CTA Başlık" value={s.ctaTitle} />
            <div>
              <label className="text-xs font-semibold text-slate-600">CTA Yazısı</label>
              <textarea name="ctaText" rows={2} defaultValue={s.ctaText} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" />
            </div>
          </div>
        </Section>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">
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
