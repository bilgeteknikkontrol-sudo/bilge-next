"use client";

import { useState } from "react";
import Link from "next/link";
import { KATEGORILER, YASA } from "@/lib/data";

const all = KATEGORILER.flatMap((k) => k.ekipmanlar);

function addMonths(date: Date, m: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + m);
  return d;
}
function fmt(date: Date) {
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function Calculator() {
  const [ad, setAd] = useState(all[0].ad);
  const [last, setLast] = useState("");
  const [res, setRes] = useState<null | {
    periyot: number; standart: string; not?: string; due: Date; kalan: number; gecikti: boolean;
  }>(null);

  const current = all.find((e) => e.ad === ad)!;

  function calc() {
    const l = last ? new Date(last) : new Date();
    const due = addMonths(l, current.periyot);
    const kalan = Math.round((due.getTime() - Date.now()) / 86400000);
    setRes({
      periyot: current.periyot,
      standart: current.standart,
      not: current.periyotNot,
      due,
      kalan,
      gecikti: kalan < 0,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="rounded-card border border-line bg-white p-6 shadow-[0_10px_30px_-12px_rgba(11,31,58,.25)]">
        <label className="mb-1.5 block text-sm font-semibold">Ekipman *</label>
        <select
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          className="mb-4 w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft"
        >
          {KATEGORILER.map((kat) => (
            <optgroup key={kat.baslik} label={kat.baslik}>
              {kat.ekipmanlar.map((e) => (
                <option key={e.ad} value={e.ad}>{e.ad}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <label className="mb-1.5 block text-sm font-semibold">Son kontrol tarihi *</label>
        <input
          type="date"
          value={last}
          onChange={(e) => setLast(e.target.value)}
          className="mb-5 w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft"
        />

        <button
          onClick={calc}
          className="w-full rounded-full bg-blue px-6 py-3.5 font-bold text-white shadow-[0_12px_24px_-10px_rgba(28,95,214,.7)] transition hover:-translate-y-0.5"
        >
          Hesapla →
        </button>
        <p className="mt-3 text-[.82rem] text-muted">
          Dayanak: {YASA.standart} ve İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları
          Yönetmeliği. Üretici talimatı daha kısa periyot belirlerse o geçerlidir.
        </p>
      </div>

      <div className="rounded-card bg-gradient-to-br from-navy to-navy2 p-7 text-white shadow-[0_30px_60px_-20px_rgba(11,31,58,.35)]">
        {!res ? (
          <>
            <h3 className="text-white">Sonucunuz burada görünecek</h3>
            <p className="text-[#b9cae8]">Sol formu doldurduğunuzda; periyot, yasal bir sonraki tarih ve denetim riski burada belirecek.</p>
            <ul className="mt-4 grid gap-2.5">
              <li className="text-[#d6e2f7]">📜 Üretici aksini belirtmedikçe çoğu ekipman <b>yılda 1 kez</b> kontrol edilir.</li>
              <li className="text-[#d6e2f7]">⚠️ Yaptırılmayan kontrol; <b>idari para cezası</b> ve işin durdurulması riski doğurur.</li>
            </ul>
          </>
        ) : (
          <>
            <h3 className="text-white">{res ? ad : ""}</h3>
            <div className="text-3xl font-black text-accent">
              {res.periyot === 1 ? "Aylık test" : `${res.periyot} ayda bir`}
            </div>
            <p className="m-0 text-[#b9cae8]">Dayanak: <b>{res.standart}</b></p>
            {res.not && <p className="mt-1.5 text-[.9rem] text-[#ffd9a3]">ℹ️ {res.not}</p>}
            <ul className="mt-4 grid gap-2.5">
              <li className="text-[#d6e2f7]">📅 Son kontrol: <b>{last ? fmt(new Date(last)) : fmt(new Date())}</b></li>
              <li className="text-[#d6e2f7]">⏰ Yasal bir sonraki: <b>{fmt(res.due)}</b></li>
              <li className="text-[#d6e2f7]">
                ⏳ {res.gecikti
                  ? `⚠️ ${Math.abs(res.kalan)} gün gecikmiş — denetim riski`
                  : `Kontrole ${res.kalan} gün var`}
              </li>
              <li className="text-[#d6e2f7]">📜 {YASA.cezaNotu}</li>
            </ul>
            <Link href="/teklif" className="mt-4 inline-block rounded-full bg-accent px-6 py-3 font-bold text-navy transition hover:-translate-y-0.5">
              Hemen Teklif Al →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
