"use client";

import { useState } from "react";
import Link from "next/link";

type Rapor = {
  firma: string; ekipman: string; tarih: string; gecerli: string;
  durum: "ok" | "warn"; ek: string;
};

export default function Portal() {
  const [no, setNo] = useState("");
  const [rapor, setRapor] = useState<Rapor | null>(null);
  const [hata, setHata] = useState("");
  const [busy, setBusy] = useState(false);

  async function sorgula(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setHata(""); setRapor(null);
    try {
      const r = await fetch(`/api/portal?no=${encodeURIComponent(no.trim().toUpperCase())}`);
      const d = await r.json();
      if (d.error) setHata(d.error);
      else setRapor(d);
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-[460px]">
      <form onSubmit={sorgula} className="rounded-card border border-line bg-white p-6 shadow-[0_10px_30px_-12px_rgba(11,31,58,.25)]">
        <label className="mb-1.5 block text-sm font-semibold">Rapor Numarası *</label>
        <input
          value={no}
          onChange={(e) => setNo(e.target.value)}
          placeholder="Örn. AB0296-2026-0412"
          className="mb-4 w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft"
        />
        <button className="w-full rounded-full bg-blue px-6 py-3.5 font-bold text-white shadow-[0_12px_24px_-10px_rgba(28,95,214,.7)] transition hover:-translate-y-0.5">
          {busy ? "Sorgulanıyor…" : "Raporu Sorgula →"}
        </button>
        <p className="mt-3 text-[.82rem] text-muted">
          Demo: <b>AB0296-2026-0412</b> (geçerli) veya <b>AB0296-2025-1180</b> (süresi dolmuş).
        </p>
      </form>

      {hata && (
        <div className="mt-4 rounded-xl border border-[#f3d29a] bg-[#fff4e0] p-4 text-sm text-[#8a5a10]">{hata}</div>
      )}

      {rapor && (
        <div className="mt-4 rounded-card border border-line bg-white p-6 shadow-[0_10px_30px_-12px_rgba(11,31,58,.25)]">
          <span className="inline-flex rounded-full bg-[#e2faf2] px-3 py-1.5 text-sm font-bold text-[#0c8f6e]">
            ✓ TÜRKAK Akredite Rapor · {rapor.ek}
          </span>
          <div className="mt-4 divide-y divide-line">
            <div className="flex justify-between py-2.5"><span className="text-muted">Firma</span><b>{rapor.firma}</b></div>
            <div className="flex justify-between py-2.5"><span className="text-muted">Ekipman</span><b>{rapor.ekipman}</b></div>
            <div className="flex justify-between py-2.5"><span className="text-muted">Kontrol Tarihi</span><b>{rapor.tarih}</b></div>
            <div className="flex justify-between py-2.5"><span className="text-muted">Geçerlilik</span><b>{rapor.gecerli}</b></div>
            <div className="flex justify-between py-2.5">
              <span className="text-muted">Durum</span>
              <b className={rapor.durum === "warn" ? "text-accent" : "text-accent2"}>
                {rapor.durum === "warn" ? "⚠ Süresi doldu" : "✓ Geçerli"}
              </b>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full bg-blue px-5 py-2.5 font-bold text-white">📄 Raporu İndir (PDF)</button>
            <button className="rounded-full border border-line px-5 py-2.5 font-bold text-navy">🔔 Hatırlatma Kur</button>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-muted">
        Müşteri değil misiniz? <Link href="/teklif" className="text-blue underline">Hemen teklif alın</Link>.
      </p>
    </div>
  );
}
