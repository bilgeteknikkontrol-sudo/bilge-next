/**
 * TARAYICIDA GORSEL KUCULTME — panel ve musteri formu ayni kodu kullanir.
 *
 * ⚠️ NEDEN VAR: 2026-08-31'de "hero slaytini adminde degistirdim ama degismiyor"
 * sikayeti geldi. Sebep panelde ya da veritabaninda degildi: Next.js'te bir
 * SUNUCU EYLEMININ (server action) istek govdesi varsayilan olarak 1 MB ile
 * sinirli. Panel "en fazla 6 MB" yaziyordu, ama 1 MB'i asan her fotograf
 * uygulamanin kendi kontrolune HIC ULASMADAN reddediliyordu. Telefonla cekilmis
 * her fotograf 2-8 MB oldugu icin gorsel yukleme pratikte tamamen kirikti.
 *
 * Cozum: dosya gonderilmeden ONCE tarayicida olceklenip sikistiriliyor. 6 MB'lik
 * bir fotograf ~300 KB'a iniyor; istek govdesi, MySQL paket siniri, veritabani
 * boyutu ve (teklif formunda) e-posta eki ayni anda rahatliyor.
 *
 * Cevrim yapilamazsa (ornek: tarayici HEIC cozemiyor) `null` doner ve cagiran
 * taraf dosyayi OLDUGU GIBI gonderir — bu modul hicbir durumda yuklemeyi
 * engellemez, yalnizca kolaylastirir.
 *
 * ⚠️ Yalnizca tarayicida calisir (canvas, createImageBitmap); sunucu
 * bileseninden import edilmemeli.
 */

/** Kucultme hedefi: sitede kullanilan en genis gorsel alani ~1600 px. */
export const HEDEF_GENISLIK = 1600;
/** Bu boyutun altina inildiginde daha fazla kalite feda edilmiyor. */
const HEDEF_BOYUT = 900 * 1024;

export function boyutYaz(b: number): string {
  return b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
}

export type KucultSecenek = {
  /** Ilk kademedeki hedef genislik (px). */
  genislik?: number;
  /** Bu boyutun altina inilince kademeler durur. */
  hedefBoyut?: number;
  /**
   * Cikti bicimi.
   *
   * Panelde WebP: site icin en kucuk dosya. Teklif formunda JPEG: o fotograflar
   * e-posta EKI olarak gidiyor ve WebP'yi acamayan posta istemcisi hala var;
   * birkac on KB icin musterinin fotografini acilmaz kilmak dogru degil.
   */
  bicim?: "image/webp" | "image/jpeg";
};

/**
 * Gorseli olcekleyip sikistirir. Cevrilemiyorsa null doner.
 *
 * Kademeli deneme: once tam genislik / 0.82 kalite. Sonuc hala buyukse daha dar
 * ve daha dusuk kaliteyle tekrarlanir — asil amac dosyayi istek govdesine
 * sigdirmak; son kademede sonuc ne cikarsa kabul edilir.
 */
export async function kucult(dosya: File, secenek: KucultSecenek = {}): Promise<File | null> {
  const bicim = secenek.bicim ?? "image/webp";
  const hedefBoyut = secenek.hedefBoyut ?? HEDEF_BOYUT;
  const enGenis = secenek.genislik ?? HEDEF_GENISLIK;

  if (!dosya.type.startsWith("image/")) return null;
  // SVG vektorel: canvas'a cizmek onu buyutur, kucultmez.
  if (dosya.type === "image/svg+xml") return null;
  if (typeof createImageBitmap !== "function") return null;

  const kare = await createImageBitmap(dosya);
  try {
    const kademeler: [number, number][] = [
      [enGenis, 0.82],
      [Math.min(1200, enGenis), 0.75],
      [Math.min(900, enGenis), 0.7],
    ];
    for (let i = 0; i < kademeler.length; i++) {
      const [genislik, kalite] = kademeler[i];
      const olcek = Math.min(1, genislik / kare.width);
      const tuval = document.createElement("canvas");
      tuval.width = Math.max(1, Math.round(kare.width * olcek));
      tuval.height = Math.max(1, Math.round(kare.height * olcek));
      const ctx = tuval.getContext("2d");
      if (!ctx) return null;
      // JPEG'in saydamligi yok: seffaf alanlar siyaha doner. Once beyaz zemin.
      if (bicim === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, tuval.width, tuval.height);
      }
      ctx.drawImage(kare, 0, 0, tuval.width, tuval.height);

      const blob = await new Promise<Blob | null>((coz) => tuval.toBlob(coz, bicim, kalite));
      // toBlob bicimi desteklemiyorsa null doner; dosya oldugu gibi gider.
      if (!blob) return null;
      if (blob.size <= hedefBoyut || i === kademeler.length - 1) {
        const uzanti = bicim === "image/jpeg" ? ".jpg" : ".webp";
        const ad = dosya.name.replace(/\.[^.]+$/, "") + uzanti;
        return new File([blob], ad, { type: bicim });
      }
    }
    return null;
  } finally {
    kare.close();
  }
}
