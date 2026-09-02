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
    baslik: "1 · Belirli bölgeler",
    aciklama:
      "Sadece tek bir bölümü etkiler. Bir yeri değiştirmek istiyorsanız önce buraya bakın — " +
      "ana paletten bağımsızdır, yani buradaki bir değişiklik sitenin geri kalanını bozmaz.",
    alanlar: [
      { key: "headerBg", label: "Menü çubuğu zemini", not: "En üstteki logo + menü şeridinin arka planı (şu an beyaz)" },
      { key: "headerTopBg", label: "Menü üstü ince şerit", not: "Telefon, e-posta ve TÜRKAK rozetinin olduğu koyu şerit" },
      { key: "footerBg", label: "Sayfa altı (footer) zemini", not: "Her sayfanın en altındaki koyu alan" },
      { key: "buttonBg", label: "Ana buton zemini", not: "“Teklif Al”, “Teklif Formunu Aç” gibi dolu butonlar" },
      { key: "heroFrom", label: "Ana sayfa üst zemin", not: "Ana sayfa ilk bölümün gradyan BAŞLANGICI (üst sol)" },
      { key: "heroTo", label: "Ana sayfa alt zemin", not: "Aynı gradyanın BİTİŞİ (alt sağ)" },
    ],
  },
  {
    baslik: "2 · Ana palet",
    aciklama:
      "Bunlar sitenin her yerinde kullanılır; birini değiştirmek baştan sona etkiler. " +
      "Site iki renk ailesinden oluşuyor: KOYU MAVİ (ciddiyet) ve TURUNCU (yalnızca vurgu, logodan geliyor).",
    alanlar: [
      {
        key: "navy",
        label: "Koyu mavi — ana marka rengi",
        not: "Başlıklar (H1, H2, H3), koyu kartların zemini, footer. Sitenin en çok görülen koyu rengi.",
      },
      { key: "navy2", label: "Koyu mavi — açık tonu", not: "Koyu kartlardaki gradyanın diğer ucu. Tek başına hiçbir yerde kullanılmaz." },
      {
        key: "blue",
        label: "Mavi — bağlantı ve vurgu",
        not: "Tıklanabilir yazılar, yazı içi bağlantılar, rakamlar (2009 / 500+ / 92), küçük etiketler.",
      },
      {
        key: "accent",
        label: "Turuncu — vurgu",
        not: "KOYU zemin üzerinde kullanılır: footer telefonu, akreditasyon rozeti, uyarı notları. ⚠️ Beyaz zeminde yazı rengi olarak kullanılmaz, okunmaz.",
      },
      { key: "accent2", label: "Turuncu — koyu tonu", not: "Açık zemindeki ✓ işaretleri. Beyaz üzerinde okunacak kadar koyu seçilmeli." },
      { key: "ink", label: "Gövde yazı rengi", not: "Normal paragraf metninin rengi. Neredeyse siyah olmalı." },
      { key: "muted", label: "Soluk yazı rengi", not: "Açıklama satırları, kart altı notlar, tarihler. Gövdeden bir ton açık." },
      { key: "line", label: "Çizgi ve kenarlık", not: "Kart kenarları, ayraç çizgileri, form kutularının çerçevesi." },
      { key: "bgsoft", label: "Açık bölüm zemini", not: "Beyazla dönüşümlü kullanılan çok açık zemin (Hizmetler, Belgeler bölümleri)." },
    ],
  },
  {
    baslik: "3 · Açık tonlar (rozet zeminleri)",
    aciklama:
      "Küçük etiket ve ikon kutularının arka planı. Üçü de bilerek AYNI değerde: " +
      "eskiden üç farklı açık ton vardı ve site alacalı duruyordu. Ayırmak isterseniz tek tek değiştirebilirsiniz.",
    alanlar: [
      { key: "blueSoft", label: "Etiket zemini", not: "“Hizmetlerimiz”, “Bilgi Merkezi” gibi küçük yuvarlak etiketler ve ikon kutuları" },
      { key: "amberSoft", label: "Uyarı zemini", not: "Bilgi/uyarı kutularının arka planı" },
      { key: "emeraldSoft", label: "Onay zemini", not: "✓ işaretinin arkasındaki kare kutu" },
    ],
  },
  {
    baslik: "4 · Koyu zemin üzerindeki yazı",
    aciklama:
      "Lacivert kartların ve footer'ın üzerindeki yazı renkleri. Bunlar eskiden 16 dosyaya sabit " +
      "yazılmıştı ve panelden değiştirilemiyordu; artık buradan yönetiliyor.",
    alanlar: [
      { key: "onNavy", label: "Koyu zeminde normal yazı", not: "Hesaplayıcı sonucu, sayfa üstü koyu başlık altındaki açıklama, footer metinleri" },
      { key: "onNavyDim", label: "Koyu zeminde soluk yazı", not: "Tarih, “son güncelleme” gibi ikincil satırlar" },
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
