"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KATEGORILER } from "@/lib/data";
import { KURUM } from "@/lib/site-data";
import type { TeklifSoru } from "@/lib/teklif-sorulari";
import { boyutYaz, kucult } from "@/lib/gorsel-kucult";
import SesliYazma from "./SesliYazma";

/**
 * Ek not alanina eklenebilecek fotograf sayisi.
 *
 * Fotograflar bildirim e-postasinin EKINE konuyor (veritabaninda saklanmiyor,
 * bkz. app/api/teklif/route.ts). Bir teklif icin 5 kare fazlasiyla yeter;
 * ustu hem posta kutusunu hem istek govdesini gereksiz sisirir.
 */
const EN_FAZLA_GORSEL = 5;
/** Kucultmeden SONRAKI toplam sinir; sunucu tarafi da ayni siniri uyguluyor. */
const TOPLAM_GORSEL_SINIRI = 8 * 1024 * 1024;
/** Kucultulemeyen (ornek: HEIC) dosyalar icin tek dosya siniri. */
const TEK_GORSEL_SINIRI = 6 * 1024 * 1024;

type SecilenGorsel = { dosya: File; onizleme: string };

/**
 * Secilen ekipman: adiyla birlikte ADET tutuluyor.
 *
 * ⚠️ Onceki hali yalnizca isim listesi (string[]) idi; musteri "3 forklift"
 * diyemiyordu, teklif hazirlamak icin geri donup sormak gerekiyordu. Sitenin
 * PHP surumunde adet kutusu VARDI, tasima sirasinda kayboldu.
 */
type Secim = { slug: string; ad: string; adet: number };

export default function TeklifForm({ sorular = {} }: { sorular?: Record<string, TeklifSoru[]> }) {
  const [secimler, setSecimler] = useState<Record<string, Secim>>({});
  const [cevaplar, setCevaplar] = useState<Record<string, string>>({});
  const [arama, setArama] = useState("");
  /** Ek not: sesli yazdirma da bu alani doldurdugu icin kontrollu tutuluyor. */
  const [not, setNot] = useState("");
  const [gorseller, setGorseller] = useState<SecilenGorsel[]>([]);
  const [gorselDurum, setGorselDurum] = useState<{ tip: "bilgi" | "uyari"; metin: string } | null>(
    null
  );
  const [gorselCalisiyor, setGorselCalisiyor] = useState(false);
  // "sent" artik referans numarasini da tasiyor; musteri elinde bir takip
  // numarasiyla ayrilsin diye.
  const [sent, setSent] = useState<{ referans: string; gorselUyari: boolean } | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  /**
   * Sunucuya ulasilamadiginda formun icerigi burada tutulur; musteriye
   * WhatsApp / e-posta ile gonderme secenegi sunulur.
   *
   * Neden: 2026-08-28 tarihinde kayit deposu askiya alinmis durumdaydi ve
   * e-posta anahtari da tanimli degildi. Boyle bir durumda yalnizca "hata"
   * yazip birakmak talebi tamamen kaybettiriyor. Bu iki kanal hicbir sunucu
   * altyapisi gerektirmez; musterinin kendi uygulamasi uzerinden calisir.
   */
  const [yedek, setYedek] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Form icerigini WhatsApp/e-posta ile gonderilebilir duz metne cevirir. */
  function talepMetni(p: Record<string, unknown>): string {
    const satirlar = [
      "Periyodik kontrol teklif talebi",
      "",
      `Firma: ${p.firma || "-"}`,
      `Yetkili: ${p.ad || "-"}`,
      `Telefon: ${p.tel || "-"}`,
      `E-posta: ${p.eposta || "-"}`,
      `Bolge: ${p.bolge || "-"}`,
      "",
      `Ekipmanlar (${(p.ekipmanlar as string[]).length}):`,
      ...(p.ekipmanlar as string[]).map((e) => `- ${e}`),
      ...(((p.bilgiler as { soru: string; cevap: string }[]) || []).length
        ? ["", "Ek bilgiler:", ...((p.bilgiler as { soru: string; cevap: string }[]) || []).map((b) => `- ${b.soru} ${b.cevap}`)]
        : []),
    ];
    if (p.not) satirlar.push("", `Not: ${p.not}`);
    // Fotograflar bu kanaldan otomatik gidemez; musteri onlari kendi
    // uygulamasindan ekleyecek. Soylenmezse ekledigini saniyor.
    if (gorseller.length) {
      satirlar.push("", `(${gorseller.length} fotoğraf seçilmişti — mesaja ekleyebilirsiniz.)`);
    }
    return satirlar.join("\n");
  }

  /**
   * Secilen fotograflar: tarayicida kucultulup JPEG'e ceviriliyor.
   *
   * ⚠️ Neden JPEG: bu dosyalar e-posta EKI olarak gidiyor, sitede
   * gosterilmiyor. WebP daha kucuk ama acamayan posta istemcisi hala var.
   */
  async function gorselSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const alan = e.currentTarget;
    const secilenler = Array.from(alan.files || []);
    if (!secilenler.length) return;
    /**
     * Alan HEMEN bosaltiliyor — kucultme beklenmeden.
     *
     * Iki isi birden yapiyor:
     *  1) ayni dosya ikinci kez secilebilsin (degeri degismezse `change`
     *     tetiklenmez),
     *  2) ⚠️ olay ayni secim icin iki kez gelirse ikinci calisma bos listeyi
     *     gorup cikar. Temizlik sona birakildiginda (olculdu) fotograflarin
     *     kucultulmesi surerken gelen ikinci olay ayni dosyalari BIR DAHA
     *     ekliyordu.
     */
    alan.value = "";

    setGorselCalisiyor(true);
    setGorselDurum({ tip: "bilgi", metin: "Fotoğraflar hazırlanıyor…" });

    const eklenecek: SecilenGorsel[] = [];
    const atlanan: string[] = [];
    let toplam = gorseller.reduce((n, g) => n + g.dosya.size, 0);
    let yer = EN_FAZLA_GORSEL - gorseller.length;

    for (const ham of secilenler) {
      if (yer <= 0) {
        atlanan.push(`${ham.name} (en fazla ${EN_FAZLA_GORSEL} fotoğraf)`);
        continue;
      }
      if (!ham.type.startsWith("image/")) {
        atlanan.push(`${ham.name} (yalnızca fotoğraf eklenebilir)`);
        continue;
      }

      let dosya = ham;
      try {
        const kucuk = await kucult(ham, { bicim: "image/jpeg", hedefBoyut: 700 * 1024 });
        if (kucuk && kucuk.size < ham.size) dosya = kucuk;
      } catch {
        // Tarayici cozemedi (bozuk dosya, HEIC...). Orijinali denenir.
      }

      if (dosya.size > TEK_GORSEL_SINIRI) {
        atlanan.push(`${ham.name} (${boyutYaz(ham.size)} — çok büyük)`);
        continue;
      }
      if (toplam + dosya.size > TOPLAM_GORSEL_SINIRI) {
        atlanan.push(`${ham.name} (toplam boyut sınırı)`);
        continue;
      }

      toplam += dosya.size;
      yer--;
      eklenecek.push({ dosya, onizleme: URL.createObjectURL(dosya) });
    }

    if (eklenecek.length) setGorseller((g) => [...g, ...eklenecek]);

    setGorselDurum(
      atlanan.length
        ? { tip: "uyari", metin: `Eklenemedi: ${atlanan.join(", ")}.` }
        : eklenecek.length
          ? {
              tip: "bilgi",
              metin: `${eklenecek.length} fotoğraf eklendi · toplam ${boyutYaz(toplam)}`,
            }
          : null
    );
    setGorselCalisiyor(false);
  }

  function gorselKaldir(sira: number) {
    setGorseller((g) => {
      const cikan = g[sira];
      if (cikan) URL.revokeObjectURL(cikan.onizleme);
      return g.filter((_, i) => i !== sira);
    });
    setGorselDurum(null);
  }

  /** Onizleme adresleri tarayici belleginde durur; sayfadan ayrilirken birakiliyor. */
  useEffect(() => {
    return () => {
      for (const g of gorseller) URL.revokeObjectURL(g.onizleme);
    };
    // Yalnizca sokulup cikarilirken calissin; her degisimde iptal etmemeli.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sesli yazdirmadan gelen cumleyi notun SONUNA ekler.
   *
   * Islevsel guncelleme sart: tanima olayi eski bir render'in kapanisindan
   * geliyor; `not` degiskenine dogrudan bakilirsa arka arkaya taninan cumleler
   * birbirinin uzerine yazilir.
   */
  const sesliEkle = useCallback((parca: string) => {
    setNot((eski) => (eski && !/\s$/.test(eski) ? `${eski} ${parca}` : `${eski}${parca}`));
  }, []);

  const secilenler = useMemo(() => Object.values(secimler), [secimler]);

  /** Secili ekipmanlarin tetikledigi sorular (tekrarsiz, ekipman sirasiyla). */
  const acikSorular = useMemo(() => {
    const cikti: { ekipman: string; soru: TeklifSoru }[] = [];
    for (const s of secilenler) {
      for (const q of sorular[s.slug] || []) cikti.push({ ekipman: s.ad, soru: q });
    }
    return cikti;
  }, [secilenler, sorular]);

  /**
   * Arama kutusu: 92 ekipman 8 akordiyona dagilmis durumda. Eski formda arama
   * yoktu ve dogru satiri bulmak icin gruplari tek tek acmak gerekiyordu.
   */
  const suzulmus = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    if (!q) return KATEGORILER.map((k) => ({ kat: k, ekipmanlar: k.ekipmanlar }));
    return KATEGORILER.map((k) => ({
      kat: k,
      ekipmanlar: k.ekipmanlar.filter((e) => e.ad.toLocaleLowerCase("tr").includes(q)),
    })).filter((k) => k.ekipmanlar.length > 0);
  }, [arama]);

  function toggle(slug: string, ad: string) {
    setSecimler((s) => {
      const y = { ...s };
      if (y[slug]) delete y[slug];
      else y[slug] = { slug, ad, adet: 1 };
      return y;
    });
  }

  /** Adet kutusu: 0 veya bos yazmak secimi KALDIRIR (eski formun mantigi). */
  function adetDegistir(slug: string, ad: string, ham: string) {
    const n = Math.max(0, Math.floor(Number(ham) || 0));
    setSecimler((s) => {
      const y = { ...s };
      if (n <= 0) delete y[slug];
      else y[slug] = { slug, ad, adet: n };
      return y;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (secilenler.length === 0) {
      setHata("Lütfen en az bir ekipman seçin.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const fd = new FormData(e.currentTarget);
    /**
     * Ekipmanlar metin olarak gonderiliyor: "Forklift Periyodik Kontrolü × 3".
     *
     * ⚠️ Bu metin HICBIR YERDE geri ayristirilmiyor; yalnizca gosterim icin.
     * Sitenin PHP surumunde "(3 adet)" soneki bir regex ile geri sokulup
     * cikariliyordu ve o regex ekipman adinin KENDI icindeki parantezden
     * eslesip 18 ekipmanin adini kesiyordu. Adet ayrica `bilgiler` icinde de
     * yapisal olarak duruyor.
     */
    const payload = {
      firma: fd.get("firma"),
      ad: fd.get("ad"),
      tel: fd.get("tel"),
      eposta: fd.get("eposta"),
      bolge: fd.get("bolge"),
      not,
      ekipmanlar: secilenler.map((s) => (s.adet > 1 ? `${s.ad} × ${s.adet}` : s.ad)),
      bilgiler: acikSorular
        .map(({ ekipman, soru }) => ({
          ekipman,
          soru: soru.etiket,
          cevap: (cevaplar[soru.id] || "").trim(),
        }))
        .filter((b) => b.cevap !== ""),
    };
    setBusy(true);
    setHata(null);
    try {
      // ⚠️ Onceki hali yanitin BASARILI olup olmadigina hic bakmiyordu:
      // sunucu 400/500 donse bile "Talebiniz alindi" yaziyordu ve musteri
      // hicbir sey iletilmedigini bilmiyordu.
      //
      // Fotograf varsa istek `multipart/form-data`; yoksa eskisi gibi JSON.
      // Sunucu iki bicimi de kabul ediyor.
      let govde: BodyInit;
      let basliklar: HeadersInit | undefined;
      if (gorseller.length) {
        const cok = new FormData();
        cok.append("veri", JSON.stringify(payload));
        for (const g of gorseller) cok.append("gorsel", g.dosya, g.dosya.name);
        govde = cok;
      } else {
        govde = JSON.stringify(payload);
        basliklar = { "Content-Type": "application/json" };
      }

      const res = await fetch("/api/teklif", { method: "POST", body: govde, headers: basliklar });
      const veri = await res.json().catch(() => null);
      if (!res.ok) {
        setHata(veri?.error || "Talebiniz gönderilemedi.");
        setYedek(talepMetni(payload));
        return;
      }
      /**
       * ⚠️ Fotograflar YALNIZCA bildirim e-postasiyla gidiyor. Kayit basarili
       * olsa bile e-posta dusmusse talep panelde gorunur ama fotograflar
       * kaybolur. Musteriye bunu soyleyip WhatsApp secenegi veriyoruz;
       * "alindi" deyip susmak, ekledigi fotografin ulastigini sandirir.
       */
      setSent({
        referans: veri?.referans || "",
        gorselUyari: gorseller.length > 0 && veri?.bildirim === false,
      });
    } catch {
      setHata("Bağlantı kurulamadı.");
      setYedek(talepMetni(payload));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div>
        {/* H2: sayfada baslik hiyerarsisi H1'den H3'e atliyordu; arama motoru
            icin ara basligin bulunmasi sayfanin konusunu netlestiriyor. */}
        <h2 className="mb-3 mt-0 text-xl font-bold text-navy">1) Ekipmanları ve adetlerini girin</h2>

        <input
          type="search"
          value={arama}
          onChange={(ev) => setArama(ev.target.value)}
          placeholder="Ekipman ara — örn. forklift, kazan, raf…"
          aria-label="Ekipman ara"
          className="mb-3 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-blue focus:ring-4 focus:ring-blue-soft"
        />

        <div className="space-y-3">
          {suzulmus.map(({ kat, ekipmanlar }) => {
            const katSecim = ekipmanlar.filter((e) => secimler[e.slug]).length;
            return (
              <details
                key={kat.baslik}
                // Arama yapilirken gruplar acik gelsin; yoksa sonuclar gizli kalir.
                open={Boolean(arama) || katSecim > 0}
                className="group overflow-hidden rounded-xl border border-line"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between bg-bgsoft px-4 py-3 font-bold text-navy">
                  <span>
                    {kat.ikon} {kat.baslik}
                    {katSecim > 0 && (
                      <span className="ml-2 rounded-full bg-blue px-2 py-0.5 text-xs font-bold text-white">
                        {katSecim}
                      </span>
                    )}
                  </span>
                  <span className="text-blue transition group-open:rotate-90">›</span>
                </summary>
                <div className="px-3 pb-3">
                  {ekipmanlar.map((e) => {
                    const secili = Boolean(secimler[e.slug]);
                    return (
                      <div key={e.slug} className="border-b border-line py-2 last:border-0">
                        <div className="flex items-center gap-3">
                          <input
                            id={`eq-${e.slug}`}
                            type="checkbox"
                            className="h-[18px] w-[18px] shrink-0 accent-blue"
                            checked={secili}
                            onChange={() => toggle(e.slug, e.ad)}
                          />
                          <label htmlFor={`eq-${e.slug}`} className="flex-1 cursor-pointer text-[.96rem]">
                            {e.ad} <span className="text-[.8rem] text-muted">· {e.standart}</span>
                          </label>
                          {/* Adet kutusu yalnizca secilince cikiyor: 92 satirin
                              hepsinde bos kutu gostermek formu okunmaz yapiyordu. */}
                          {secili && (
                            <span className="flex shrink-0 items-center gap-1.5">
                              <input
                                type="number"
                                min={1}
                                inputMode="numeric"
                                aria-label={`${e.ad} adedi`}
                                value={secimler[e.slug].adet}
                                onChange={(ev) => adetDegistir(e.slug, e.ad, ev.target.value)}
                                className="w-16 rounded-lg border border-line px-2 py-1.5 text-center text-sm focus:border-blue focus:ring-2 focus:ring-blue-soft"
                              />
                              <span className="text-xs text-muted">adet</span>
                            </span>
                          )}
                        </div>

                        {/* Ekipmana ozel ek bilgi sorulari — yalnizca o ekipman
                            secilince ve tam yaninda cikiyor. */}
                        {secili && (sorular[e.slug] || []).length > 0 && (
                          <div className="mt-2 space-y-2 rounded-lg border border-blue/20 bg-blue-soft/40 p-3">
                            <p className="text-xs font-bold text-navy">
                              Teklif için gerekli bilgiler
                            </p>
                            {(sorular[e.slug] || []).map((q) => (
                              <label key={q.id} className="block">
                                <span className="mb-1 block text-xs font-semibold text-navy">
                                  {q.etiket}
                                </span>
                                <input
                                  type={q.tip === "sayi" ? "number" : "text"}
                                  min={q.tip === "sayi" ? 0 : undefined}
                                  inputMode={q.tip === "sayi" ? "numeric" : undefined}
                                  placeholder={q.ornek}
                                  value={cevaplar[q.id] || ""}
                                  onChange={(ev) =>
                                    setCevaplar((c) => ({ ...c, [q.id]: ev.target.value }))
                                  }
                                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-blue focus:ring-2 focus:ring-blue-soft"
                                />
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}

          {suzulmus.length === 0 && (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              &quot;{arama}&quot; için ekipman bulunamadı. Aramayı kısaltmayı deneyin ya da
              aşağıdaki <b>Ek not</b> alanına yazın.
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 mt-0 text-xl font-bold text-navy">2) İletişim bilgileri</h2>
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
            <label htmlFor="teklif-not" className="mb-1.5 block text-sm font-semibold">
              Ek not
            </label>
            <textarea
              id="teklif-not"
              name="not"
              rows={3}
              value={not}
              onChange={(ev) => setNot(ev.target.value)}
              placeholder="Ekipman adedi, aciliyet vb."
              className="w-full rounded-lg border border-line px-3.5 py-3 focus:border-blue focus:ring-4 focus:ring-blue-soft"
            />

            {/* Sesli yazdirma: konusulan metin yukaridaki alana yaziliyor.
                Desteklemeyen tarayicida (Firefox) bilesen hic cizilmiyor. */}
            <SesliYazma onMetin={sesliEkle} hedefId="teklif-not" />

            {/* Fotograf ekleme — "sunu tarif edemiyorum, gostereyim" hali.
                Telefonda `accept="image/*"` kamera secenegini de aciyor. */}
            <div className="mt-3 rounded-xl border border-dashed border-line bg-bgsoft/60 p-3">
              <label
                htmlFor="teklif-gorsel"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-navy transition hover:border-blue hover:text-blue"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="9" cy="10" r="1.6" />
                  <path d="m4 17 5-4 4 3 3-2 4 3" strokeLinejoin="round" />
                </svg>
                Fotoğraf ekle
              </label>
              <input
                id="teklif-gorsel"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={gorselSecildi}
                disabled={gorselCalisiyor || gorseller.length >= EN_FAZLA_GORSEL}
              />
              <span className="ml-2 text-xs text-muted">
                Etiket, plaka, arıza… en fazla {EN_FAZLA_GORSEL} fotoğraf. Mümkünse kişilerin
                göründüğü kareleri eklemeyin.
              </span>

              {gorseller.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {gorseller.map((g, i) => (
                    <li key={`${g.dosya.name}-${i}`} className="relative">
                      {/* next/image bu adresleri (blob:) isleyemez; olcusu de
                          bilinmiyor. Basit <img> dogru arac. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.onizleme}
                        alt={`Eklenen fotoğraf ${i + 1}`}
                        className="h-20 w-20 rounded-lg border border-line object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => gorselKaldir(i)}
                        aria-label={`${i + 1}. fotoğrafı kaldır`}
                        className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-sm font-bold text-navy shadow-sm"
                      >
                        ×
                      </button>
                      <span className="mt-0.5 block text-center text-[10px] text-muted">
                        {boyutYaz(g.dosya.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {gorselDurum && (
                <p
                  className={`mt-2 text-xs ${
                    gorselDurum.tip === "uyari" ? "text-amber-800" : "text-muted"
                  }`}
                >
                  {gorselDurum.metin}
                </p>
              )}
            </div>
          </div>

          {/* Canli ozet: musteri gondermeden once tam olarak ne ilettigini
              gorsun. Eksik kalan bilgi sorusu varsa burada uyariliyor. */}
          <div className="col-span-2 rounded-xl border border-dashed border-blue bg-bgsoft p-4">
            <strong className="text-navy">
              Seçilen ekipman ({secilenler.length})
              {secilenler.length > 0 && (
                <span className="font-normal text-muted">
                  {" "}
                  · toplam {secilenler.reduce((n, s) => n + s.adet, 0)} adet
                </span>
              )}
            </strong>
            {secilenler.length ? (
              <>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {secilenler.map((s) => (
                    <li
                      key={s.slug}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-sm"
                    >
                      {s.ad}
                      {s.adet > 1 && <b className="ml-1 text-blue">× {s.adet}</b>}
                    </li>
                  ))}
                </ul>

                {acikSorular.length > 0 && (
                  <div className="mt-3 border-t border-line pt-3">
                    <span className="text-sm font-bold text-navy">Ek bilgiler</span>
                    <ul className="mt-1 space-y-0.5 text-sm">
                      {acikSorular.map(({ soru }) => {
                        const c = (cevaplar[soru.id] || "").trim();
                        return (
                          <li key={soru.id} className={c ? "text-navy" : "text-muted"}>
                            {soru.etiket}{" "}
                            {c ? <b>{c}</b> : <i className="text-amber-700">— boş</i>}
                          </li>
                        );
                      })}
                    </ul>
                    {acikSorular.some(({ soru }) => !(cevaplar[soru.id] || "").trim()) && (
                      <p className="mt-2 text-xs leading-relaxed text-amber-800">
                        Boş bırakılan alanlar olmadan da gönderebilirsiniz; ancak bu bilgiler
                        teklif için gerekli olduğundan sizi arayıp sormamız gerekir.
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">Henüz ekipman seçmediniz.</p>
            )}
          </div>

          {/* KVKK md. 10 aydinlatma yukumlulugu: veri toplanan noktada bilgilendirme
              gorunur olmali. Isleme dayanagi sozlesmenin ifasi (md. 5/2-c) oldugu icin
              acik riza kutusu degil, bilgilendirme baglantisi kullaniliyor. */}
          <div className="col-span-2">
            <p className="text-xs leading-relaxed text-muted">
              {/* ⚠️ "ve varsa eklediginiz fotograflar": 03.09.2026'da fotograf
                  ekleme geldi. Toplanan veriyi eksik sayan bir aydinlatma
                  metni, KVKK md. 10 yukumlulugunu karsilamaz. */}
              Formu göndererek iletmiş olduğunuz kimlik ve iletişim bilgileriniz ile varsa
              eklediğiniz fotoğraflar, yalnızca teklif hazırlanması ve talebinizle ilgili sizinle
              iletişime geçilmesi amacıyla işlenir.
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
          <div role="alert" className="mt-4 rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
            <b className="block text-base">{hata}</b>
            {yedek ? (
              <>
                <p className="mt-1.5 leading-relaxed">
                  Doldurduğunuz bilgiler kaybolmadı. Aşağıdaki düğmelerden biriyle talebinizi
                  doğrudan bize iletebilirsiniz — bilgiler hazır olarak gelir.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${KURUM.whatsappE164}?text=${encodeURIComponent(yedek)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-[#25D366] px-5 py-2.5 font-bold text-white"
                  >
                    WhatsApp ile gönder →
                  </a>
                  <a
                    href={`mailto:${KURUM.eposta}?subject=${encodeURIComponent("Teklif talebi")}&body=${encodeURIComponent(yedek)}`}
                    className="inline-flex items-center rounded-full border border-amber-400 bg-white px-5 py-2.5 font-bold text-amber-900"
                  >
                    E-posta ile gönder
                  </a>
                  <a
                    href={`tel:${KURUM.telefonE164}`}
                    className="inline-flex items-center rounded-full border border-amber-400 bg-white px-5 py-2.5 font-bold text-amber-900"
                  >
                    {KURUM.telefon}
                  </a>
                </div>
              </>
            ) : (
              <p className="mt-1.5">
                Lütfen tekrar deneyin veya{" "}
                <a href={`tel:${KURUM.telefonE164}`} className="font-bold underline">
                  {KURUM.telefon}
                </a>{" "}
                numarasından bize ulaşın.
              </p>
            )}
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
            {/* Talep kaydedildi ama bildirim e-postasi gitmedi: fotograflar
                yalnizca o e-postanin ekinde tasindigi icin ulasmadi. */}
            {sent.gorselUyari && (
              <span className="mt-2 block rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-amber-900">
                Eklediğiniz fotoğraflar teknik bir sorun nedeniyle iletilemedi. Talebiniz kayıtlı;
                fotoğrafları{" "}
                <a
                  href={`https://wa.me/${KURUM.whatsappE164}?text=${encodeURIComponent(
                    `Teklif talebi ${sent.referans} — fotoğraflar`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                >
                  WhatsApp
                </a>{" "}
                ile gönderebilirsiniz.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
