"use client";

import { useState } from "react";
import Link from "next/link";
import { KATEGORILER } from "@/lib/data";

export default function TeklifForm() {
  const [selected, setSelected] = useState<string[]>([]);
  // "sent" artik referans numarasini da tasiyor; musteri elinde bir takip
  // numarasiyla ayrilsin diye.
  const [sent, setSent] = useState<{ referans: string } | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggle(ad: string) {
    setSelected((s) => (s.includes(ad) ? s.filter((x) => x !== ad) : [...s, ad]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected.length === 0) return alert("Lütfen en az bir ekipman seçin.");
    const fd = new FormData(e.currentTarget);
    const payload = {
      firma: fd.get("firma"),
      ad: fd.get("ad"),
      tel: fd.get("tel"),
      eposta: fd.get("eposta"),
      bolge: fd.get("bolge"),
      not: fd.get("not"),
      ekipmanlar: selected,
    };
    setBusy(true);
    setHata(null);
    try {
      // ⚠️ Onceki hali yanitin BASARILI olup olmadigina hic bakmiyordu:
      // sunucu 400/500 donse bile "Talebiniz alindi" yaziyordu ve musteri
      // hicbir sey iletilmedigini bilmiyordu.
      const res = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const veri = await res.json().catch(() => null);
      if (!res.ok) {
        setHata(veri?.error || "Talebiniz gönderilemedi. Lütfen tekrar deneyin.");
        return;
      }
      setSent({ referans: veri?.referans || "" });
    } catch {
      setHata(
        "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin veya 0212 872 52 04 numarasından bize ulaşın."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div>
        <h3 className="mb-3 mt-0 text-xl font-bold text-navy">1) Ekipmanları seçin</h3>
        <div className="space-y-3">
          {KATEGORILER.map((kat) => (
            <details key={kat.baslik} className="group overflow-hidden rounded-xl border border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between bg-bgsoft px-4 py-3 font-bold text-navy">
                <span>{kat.ikon} {kat.baslik}</span>
                <span className="text-blue transition group-open:rotate-90">›</span>
              </summary>
              <div className="px-3 pb-3">
                {kat.ekipmanlar.map((e) => (
                  <label
                    key={e.ad}
                    className="flex items-center gap-3 border-b border-line py-2 last:border-0"
                  >
                    <input
                      type="checkbox"
                      className="h-[18px] w-[18px] accent-blue"
                      checked={selected.includes(e.ad)}
                      onChange={() => toggle(e.ad)}
                    />
                    <span className="flex-1 text-[.96rem]">
                      {e.ad}{" "}
                      <span className="text-[.8rem] text-muted">· {e.standart}</span>
                    </span>
                  </label>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 mt-0 text-xl font-bold text-navy">2) İletişim bilgileri</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Firma adı *</label>
            <input required name="firma" placeholder="Örn. Örnek Sanayi A.Ş." className="w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">İlgili kişi</label>
            <input name="ad" placeholder="Ad Soyad" className="w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Telefon *</label>
            <input required name="tel" placeholder="0212 ..." className="w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft" />
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">E-posta *</label>
            <input required type="email" name="eposta" placeholder="info@firma.com" className="w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft" />
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">İl / Bölge</label>
            <input name="bolge" placeholder="İstanbul / Beylikdüzü" className="w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft" />
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Ek not</label>
            <textarea name="not" rows={3} placeholder="Ekipman adedi, aciliyet vb." className="w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft" />
          </div>

          <div className="col-span-2 rounded-xl border border-dashed border-blue bg-bgsoft p-4">
            <strong className="text-navy">Seçilen ekipman ({selected.length}):</strong>
            {selected.length ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {selected.map((s) => (
                  <li key={s} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted">Henüz ekipman seçmediniz.</p>
            )}
          </div>

          {/* KVKK md. 10 aydinlatma yukumlulugu: veri toplanan noktada bilgilendirme
              gorunur olmali. Isleme dayanagi sozlesmenin ifasi (md. 5/2-c) oldugu icin
              acik riza kutusu degil, bilgilendirme baglantisi kullaniliyor. */}
          <div className="col-span-2">
            <p className="text-xs leading-relaxed text-muted">
              Formu göndererek iletmiş olduğunuz kimlik ve iletişim bilgileriniz, yalnızca teklif
              hazırlanması ve talebinizle ilgili sizinle iletişime geçilmesi amacıyla işlenir.
              Ayrıntılı bilgi için{" "}
              <Link href="/kvkk" className="font-semibold text-blue underline">
                KVKK Aydınlatma Metni
              </Link>{" "}
              ve{" "}
              <Link href="/cerez-politikasi" className="font-semibold text-blue underline">
                Çerez Politikası
              </Link>
              .
            </p>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-blue px-6 py-3.5 font-bold text-white shadow-[0_12px_24px_-10px_color-mix(in_srgb,var(--color-blue)_70%,transparent)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "Gönderiliyor…" : "Talebi Gönder →"}
            </button>
          </div>
        </form>

        {hata && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            {hata}
          </div>
        )}

        {sent && (
          <div role="status" className="mt-4 rounded-xl border border-blue/25 bg-blue-soft p-4 text-sm text-navy">
            <b className="block text-base">✅ Talebiniz alındı.</b>
            {sent.referans && (
              <span className="mt-1 block">
                Referans numaranız: <b className="font-mono">{sent.referans}</b>
              </span>
            )}
            <span className="mt-1 block">
              Ekibimiz kapsam ve fiyat için en kısa sürede size dönüş yapacak. Acil durumlar için{" "}
              <a href="tel:+902128725204" className="font-bold underline">0212 872 52 04</a>.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
