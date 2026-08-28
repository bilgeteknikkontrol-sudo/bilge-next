"use client";

import { useState } from "react";

/**
 * Renk yonetimi paneli.
 *
 * Onceki hali renk anahtarlarini ("navy", "blueSoft") ham haliyle listeliyordu;
 * hangisinin siteyi nerede etkiledigi belli degildi ve hex kutusu salt okunurdu.
 * Burada renkler kullanildiklari yere gore gruplaniyor, her birinin ne oldugu
 * yaziyor, hem renk secici hem hex kutusu duzenlenebiliyor ve degisiklik
 * ustteki onizlemede aninda gorunuyor.
 *
 * Form alan adlari `color_<anahtar>` — saveSettingsAction bu adlari okuyor.
 */

type Alan = { key: string; label: string; not: string };
type Grup = { baslik: string; aciklama: string; alanlar: Alan[] };

const GRUPLAR: Grup[] = [
  {
    baslik: "Bölgeler",
    aciklama: "Sitenin belirli bölümlerinin zemin renkleri. Genel paletten bağımsızdır.",
    alanlar: [
      { key: "headerBg", label: "Header arka planı", not: "Üst menü çubuğunun zemini" },
      { key: "headerTopBg", label: "Header üst şeridi", not: "Menünün üstündeki ince iletişim şeridi" },
      { key: "footerBg", label: "Footer arka planı", not: "Sayfa altı koyu alan" },
      { key: "buttonBg", label: "Buton rengi", not: "“Teklif Al” gibi birincil butonlar" },
      { key: "heroFrom", label: "Hero zemin (üst)", not: "Ana sayfa ilk bölümün gradyan başlangıcı" },
      { key: "heroTo", label: "Hero zemin (alt)", not: "Ana sayfa ilk bölümün gradyan bitişi" },
    ],
  },
  {
    baslik: "Ana palet",
    aciklama: "Tüm sayfalarda kullanılan temel renkler. Bunları değiştirmek siteyi baştan sona etkiler.",
    alanlar: [
      { key: "blue", label: "Vurgu rengi", not: "Bağlantılar, etiketler, ikon zeminleri (turuncu)" },
      { key: "navy", label: "Başlık rengi", not: "Başlıklar ve koyu bölümlerin zemini" },
      { key: "navy2", label: "Başlık rengi (açık ton)", not: "Koyu gradyanların ikinci ucu" },
      { key: "accent", label: "İkincil vurgu", not: "Koyu zemin üzerindeki açık turuncu rozetler" },
      { key: "accent2", label: "Onay rengi", not: "✓ işaretleri, doğrulama rozetleri" },
      { key: "ink", label: "Metin rengi", not: "Gövde yazısının ana rengi" },
      { key: "muted", label: "Soluk metin", not: "Açıklama ve yardımcı yazılar" },
      { key: "line", label: "Çizgi rengi", not: "Kart kenarları ve ayraçlar" },
      { key: "bgsoft", label: "Yumuşak zemin", not: "Açık gri/krem bölüm zeminleri" },
    ],
  },
  {
    baslik: "Yumuşak tonlar",
    aciklama:
      "Rozet ve ikon zeminlerinde kullanılan açık tonlar. Üçü de aynı değerde geliyor; " +
      "farklı yapmak isterseniz tek tek değiştirebilirsiniz.",
    alanlar: [
      { key: "blueSoft", label: "Vurgu (açık)", not: "Etiket ve ikon kutularının zemini" },
      { key: "amberSoft", label: "Amber (açık)", not: "Uyarı/vurgu zeminleri" },
      { key: "emeraldSoft", label: "Onay (açık)", not: "Akreditasyon rozetinin zemini" },
    ],
  },
  {
    baslik: "Koyu zemin üzerindeki metin",
    aciklama:
      "Lacivert gradyanlı kartlarda ve footer'da kullanılan yazı renkleri. " +
      "Bunlar önceden kodun içine sabit yazılmıştı ve panelden değiştirilemiyordu.",
    alanlar: [
      { key: "onNavy", label: "Koyu zemin metni", not: "Koyu kartlardaki normal yazı" },
      { key: "onNavyDim", label: "Koyu zemin metni (soluk)", not: "Tarih, ikincil açıklama" },
    ],
  },
];

const BILINEN = new Set(GRUPLAR.flatMap((g) => g.alanlar.map((a) => a.key)));

export default function RenkPaneli({ colors }: { colors: Record<string, string> }) {
  const [c, setC] = useState<Record<string, string>>(colors);
  const ayarla = (k: string, v: string) => setC((o) => ({ ...o, [k]: v }));

  // Tanimli gruplara girmeyen anahtarlar (ornegin "white") kaybolmasin
  const digerler = Object.keys(colors).filter((k) => !BILINEN.has(k));

  return (
    <div className="space-y-4">
      <Onizleme c={c} />

      {GRUPLAR.map((g) => (
        <div key={g.baslik} className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-700">{g.baslik}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{g.aciklama}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.alanlar.map((a) => (
              <RenkAlani
                key={a.key}
                alan={a}
                deger={c[a.key] ?? "#ffffff"}
                degistir={(v) => ayarla(a.key, v)}
              />
            ))}
          </div>
        </div>
      ))}

      {digerler.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-700">Diğer</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {digerler.map((k) => (
              <RenkAlani
                key={k}
                alan={{ key: k, label: k, not: "" }}
                deger={c[k]}
                degistir={(v) => ayarla(k, v)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RenkAlani({
  alan,
  deger,
  degistir,
}: {
  alan: Alan;
  deger: string;
  degistir: (v: string) => void;
}) {
  const gecerli = /^#[0-9a-fA-F]{6}$/.test(deger);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700" htmlFor={`color_${alan.key}`}>
        {alan.label}
      </label>
      {alan.not && <span className="block text-[.7rem] leading-tight text-slate-400">{alan.not}</span>}
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          aria-label={`${alan.label} renk seçici`}
          value={gecerli ? deger : "#ffffff"}
          onChange={(e) => degistir(e.target.value.toUpperCase())}
          className="h-9 w-11 flex-none cursor-pointer rounded border border-slate-300"
        />
        {/* Kaydedilen deger bu kutu; hex'i elle de yazabilmek icin duzenlenebilir. */}
        <input
          id={`color_${alan.key}`}
          name={`color_${alan.key}`}
          value={deger}
          onChange={(e) => degistir(e.target.value)}
          spellCheck={false}
          className={`w-full rounded-lg border p-1.5 font-mono text-xs uppercase ${
            gecerli ? "border-slate-300" : "border-red-400 bg-red-50 text-red-700"
          }`}
        />
      </div>
      {!gecerli && (
        <span className="mt-1 block text-[.7rem] text-red-600">
          #RRGGBB biçiminde olmalı (ör. #C25E08); geçersiz değer kaydedilmez.
        </span>
      )}
    </div>
  );
}

/** Kaydetmeden once degisikligin nasil durdugunu gosteren kucuk site maketi. */
function Onizleme({ c }: { c: Record<string, string> }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="font-bold text-slate-700">Önizleme</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Renkleri değiştirdikçe burası güncellenir. Siteye yansıması için “Ayarları Kaydet”e basın.
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <div className="px-4 py-1.5 text-[.65rem] text-white/80" style={{ background: c.headerTopBg }}>
          info@bilgeteknikkontrol.com · TÜRKAK AB-0296-M
        </div>
        <div
          className="flex items-center justify-between border-b border-slate-200 px-4 py-3"
          style={{ background: c.headerBg }}
        >
          <span className="text-sm font-black" style={{ color: c.navy }}>BİLGE</span>
          <span className="flex items-center gap-3 text-[.7rem]" style={{ color: c.muted }}>
            Hizmetler · Kurumsal
            <span className="rounded-full px-3 py-1.5 text-[.7rem] font-bold text-white" style={{ background: c.buttonBg }}>
              Teklif Al
            </span>
          </span>
        </div>

        <div
          className="px-4 py-6"
          style={{ background: `linear-gradient(160deg, ${c.heroFrom} 0%, ${c.bgsoft} 55%, ${c.heroTo} 100%)` }}
        >
          <span
            className="inline-block rounded-full px-2.5 py-1 text-[.65rem] font-bold"
            style={{ background: c.blueSoft, color: c.blue }}
          >
            TÜRKAK Akredite
          </span>
          <p className="mt-2 text-base font-black leading-tight" style={{ color: c.navy }}>
            İş Ekipmanınızın Güvenliği
          </p>
          <p className="mt-1 text-[.72rem]" style={{ color: c.muted }}>
            Basınçlı kap, kaldırma, elektrik ve yangın ekipmanlarında akredite periyodik kontrol.
          </p>
        </div>

        <div className="px-4 py-4 text-[.7rem] text-white/70" style={{ background: c.footerBg }}>
          © Bilge Teknik Kontrol · KVKK · Çerez Politikası
        </div>
      </div>
    </div>
  );
}
