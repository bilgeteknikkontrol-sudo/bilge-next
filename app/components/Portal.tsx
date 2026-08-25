"use client";

import { useState } from "react";
import Link from "next/link";

type Rapor = {
  no: string;
  firma: string;
  ekipman: string;
  tarih: string;
  gecerli: string;
  durum: "ok" | "warn" | "yeni";
  ek: string;
};

const ORNEKLER = [
  { no: "AB0296-2026-0412", label: "Geçerli rapor" },
  { no: "AB0296-2025-1180", label: "Süresi dolan" },
];

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-muted">{k}</span>
      <b className="text-right text-navy">{v}</b>
    </div>
  );
}

export default function Portal() {
  const [no, setNo] = useState("");
  const [rapor, setRapor] = useState<Rapor | null>(null);
  const [hata, setHata] = useState("");
  const [busy, setBusy] = useState(false);

  async function sorgula(aranan?: string) {
    const val = (aranan ?? no).trim().toUpperCase();
    if (!val) return;
    setNo(val);
    setBusy(true);
    setHata("");
    setRapor(null);
    try {
      const r = await fetch(`/api/portal?no=${encodeURIComponent(val)}`);
      const d = await r.json();
      if (d.error) setHata(d.error);
      else setRapor(d as Rapor);
    } finally {
      setBusy(false);
    }
  }

  const durumStil =
    rapor?.durum === "warn"
      ? "border-l-accent bg-[#fff4e0] text-[#8a5a10]"
      : rapor?.durum === "yeni"
        ? "border-l-blue bg-blue-soft text-blue"
        : "border-l-accent2 bg-[#e2faf2] text-[#0c8f6e]";

  const durumYazi =
    rapor?.durum === "warn"
      ? "⚠ Süresi Doldu"
      : rapor?.durum === "yeni"
        ? "• Yeni Kayıt"
        : "✓ Geçerli";

  return (
    <div className="mx-auto max-w-[560px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sorgula();
        }}
        className="rounded-2xl border border-line bg-white p-7 shadow-[0_20px_50px_-18px_rgba(11,31,58,.35)]"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-soft text-2xl">🔒</div>
          <div>
            <p className="font-bold text-navy">Rapor Sorgulama</p>
            <p className="text-xs text-muted">TÜRKAK Akredite · AB-0296-M</p>
          </div>
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-navy">Rapor Numarası</label>
        <div className="flex gap-2">
          <input
            value={no}
            onChange={(e) => setNo(e.target.value)}
            placeholder="AB0296-2026-0412"
            className="w-full rounded-xl border border-line px-4 py-3.5 outline-none focus:border-blue focus:ring-4 focus:ring-blue-soft"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-blue px-6 py-3.5 font-bold text-white shadow-[0_12px_24px_-10px_rgba(28,95,214,.7)] transition hover:-translate-y-0.5"
          >
            {busy ? "…" : "Sorgula"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {ORNEKLER.map((o) => (
            <button
              key={o.no}
              type="button"
              onClick={() => sorgula(o.no)}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-blue hover:text-blue"
            >
              {o.label}: {o.no}
            </button>
          ))}
        </div>
      </form>

      {hata && (
        <div className="mt-4 rounded-xl border border-[#f3d29a] bg-[#fff4e0] p-4 text-sm text-[#8a5a10]">{hata}</div>
      )}

      {rapor && (
        <div
          className={`mt-4 overflow-hidden rounded-2xl border border-line border-l-4 bg-white shadow-[0_20px_50px_-18px_rgba(11,31,58,.35)] ${durumStil.split(" ")[0]}`}
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-soft to-white px-6 py-4">
            <div>
              <p className="text-xs font-semibold text-muted">Rapor No</p>
              <p className="font-black text-navy">{rapor.no}</p>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ${durumStil}`}>
              {durumYazi}
            </span>
          </div>

          <div className="divide-y divide-line px-6">
            <Row k="Firma" v={rapor.firma} />
            <Row k="Ekipman" v={rapor.ekipman} />
            <Row k="Kontrol Tarihi" v={rapor.tarih} />
            <Row k="Geçerlilik" v={rapor.gecerli} />
            <Row k="Akreditasyon" v={rapor.ek} />
          </div>

          <div className="flex flex-wrap gap-2 px-6 py-4">
            <button
              onClick={() => window.print()}
              className="rounded-full bg-blue px-5 py-2.5 font-bold text-white"
            >
              📄 PDF İndir
            </button>
            <Link
              href="/teklif"
              className="rounded-full border border-line px-5 py-2.5 font-bold text-navy"
            >
              🔔 Yenileme Teklifi Al
            </Link>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-muted">
        Müşteri değil misiniz? <Link href="/teklif" className="text-blue underline">Hemen teklif alın</Link>.
      </p>
    </div>
  );
}
