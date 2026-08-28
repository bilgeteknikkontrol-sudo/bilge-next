"use client";

import { useState } from "react";

/**
 * Gorsel secme + TARAYICIDA kucultme.
 *
 * ⚠️ Neden gerekli: yuklenen gorseller CMS verisinin ICINE base64 olarak
 * gomuluyor (media tablosunda data_url). Telefondan cekilmis 4 MB'lik bir
 * fotograf base64'e cevrilince ~5.5 MB oluyor ve bu, sitenin TUM icerigini
 * tutan tek JSON'a ekleniyor. O JSON her sunucu ornegi tarafindan duzenli
 * olarak bastan okunuyor; birkac fotograf sonrasinda depolama kotasi
 * doluyor. (Blob deposunun askiya alinmasinin sebeplerinden biri buydu.)
 *
 * Cozum sunucuya degil tarayiciya kondu: dosya secilir secilmez canvas ile
 * en fazla 1600px'e kuculturulup WebP'ye ceviriliyor, sonuc gizli alanda
 * data URL olarak gonderiliyor. Boylece:
 *  - sunucuya ek bagimlilik (sharp gibi native modul) gerekmiyor,
 *  - buyuk dosya aga hic cikmiyor,
 *  - 4 MB'lik fotograf tipik olarak 100-200 KB'a iniyor.
 *
 * Kucultulemezse (cok eski tarayici, bozuk dosya) dosya ORIJINAL haliyle
 * gonderilir; sunucu tarafi yine calisir, yalnizca boyut kazanci olmaz.
 */

const MAKS_KENAR = 1600;
const KALITE = 0.82;

export default function GorselYukle() {
  const [durum, setDurum] = useState<string | null>(null);
  const [onizleme, setOnizleme] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState("");

  async function secildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];
    if (!dosya) {
      setDurum(null);
      setOnizleme(null);
      setDataUrl("");
      return;
    }
    setDurum("Küçültülüyor…");
    try {
      const kucuk = await kucult(dosya);
      setDataUrl(kucuk.veri);
      setOnizleme(kucuk.veri);
      setDurum(
        `${bicimle(dosya.size)} → ${bicimle(kucuk.bayt)} · ${kucuk.genislik}×${kucuk.yukseklik}px`
      );
    } catch {
      // Kucultme basarisiz: dosya oldugu gibi gonderilsin.
      setDataUrl("");
      setOnizleme(null);
      setDurum("Küçültülemedi, dosya olduğu gibi yüklenecek.");
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">Görsel seç</label>
      <p className="mb-1.5 mt-0.5 text-xs text-slate-400">
        Telefondan çektiğiniz fotoğraf da olur; yüklemeden önce otomatik küçültülür.
      </p>
      <input
        type="file"
        name="file"
        accept="image/*"
        onChange={secildi}
        className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue file:px-4 file:py-2 file:font-semibold file:text-white"
      />
      {/* Kucultulmus hali; doluysa sunucu bunu tercih ediyor. */}
      <input type="hidden" name="kucultulmus" value={dataUrl} />

      {durum && <p className="mt-2 text-xs font-semibold text-blue">{durum}</p>}
      {onizleme && (
        <div className="mt-2 h-28 w-44 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={onizleme} alt="" className="h-full w-full object-contain" />
        </div>
      )}
    </div>
  );
}

function bicimle(bayt: number): string {
  return bayt > 1024 * 1024
    ? `${(bayt / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bayt / 1024)} KB`;
}

async function kucult(
  dosya: File
): Promise<{ veri: string; bayt: number; genislik: number; yukseklik: number }> {
  const bitmap = await createImageBitmap(dosya);
  const olcek = Math.min(1, MAKS_KENAR / Math.max(bitmap.width, bitmap.height));
  const g = Math.round(bitmap.width * olcek);
  const y = Math.round(bitmap.height * olcek);

  const tuval = document.createElement("canvas");
  tuval.width = g;
  tuval.height = y;
  const ctx = tuval.getContext("2d");
  if (!ctx) throw new Error("canvas yok");
  ctx.drawImage(bitmap, 0, 0, g, y);
  bitmap.close?.();

  const veri = tuval.toDataURL("image/webp", KALITE);
  if (!veri.startsWith("data:image/webp")) throw new Error("webp desteklenmiyor");
  // base64 uzunlugundan yaklasik bayt sayisi
  const bayt = Math.round((veri.length - veri.indexOf(",") - 1) * 0.75);
  return { veri, bayt, genislik: g, yukseklik: y };
}
