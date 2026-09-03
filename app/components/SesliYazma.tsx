"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * SESLI YAZDIRMA DUGMESI (Web Speech API)
 *
 * Musteri, teklif formundaki "Ek not" alanini klavyeyle yazmak yerine
 * konusarak doldurabilsin diye eklendi. Ses tarayicida isleniyor; site
 * hicbir ses kaydi almiyor, saklamiyor ve sunucuya gondermiyor — yalnizca
 * tarayicinin cikardigi METIN not alanina yaziliyor.
 *
 * ⚠️ TARAYICI DESTEGI HER YERDE YOK (Firefox'ta hic yok). Bu yuzden dugme
 * ancak destek varsa ciziliyor: desteklemeyen tarayicida hic gorunmuyor ve
 * alanin normal klavyeyle doldurulmasina engel olmuyor.
 *
 * ⚠️ `next.config.js` icindeki `Permissions-Policy` basliginda `microphone`
 * KAPALIYSA bu bilesen calismaz — tarayici izin istemeden `not-allowed`
 * dondurur. Baslikta `microphone=(self)` yazmali.
 */

/* Web Speech API'nin kullandigimiz kadari; TypeScript'in dom kutuphanesinde
   bu arayuzler her surumde bulunmuyor, o yuzden yerelde tanimlaniyor. */
type TanimaSecenegi = { transcript: string };
type TanimaSonucu = { isFinal: boolean; length: number; [i: number]: TanimaSecenegi };
type TanimaOlayi = { resultIndex: number; results: { length: number; [i: number]: TanimaSonucu } };
type TanimaHataOlayi = { error: string };

interface Tanima {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: TanimaOlayi) => void) | null;
  onerror: ((e: TanimaHataOlayi) => void) | null;
  onend: (() => void) | null;
}

type TanimaYapici = new () => Tanima;

function tanimaYapici(): TanimaYapici | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: TanimaYapici;
    webkitSpeechRecognition?: TanimaYapici;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/** Tarayicinin hata kodlarini kullanicinin anlayacagi cumleye cevirir. */
function hataMetni(kod: string): { metin: string; olumcul: boolean } {
  switch (kod) {
    case "not-allowed":
    case "service-not-allowed":
      return {
        metin:
          "Mikrofon izni verilmedi. Adres çubuğundaki kilit simgesinden mikrofona izin verip tekrar deneyin.",
        olumcul: true,
      };
    case "audio-capture":
      return { metin: "Mikrofon bulunamadı. Cihazınıza bir mikrofon bağlı mı?", olumcul: true };
    case "network":
      return {
        metin: "Ses tanıma sunucusuna ulaşılamadı. İnternet bağlantınızı kontrol edin.",
        olumcul: true,
      };
    case "no-speech":
      // Sessizlikte normaldir; oturum kendiliginden yeniden baslatiliyor.
      return { metin: "", olumcul: false };
    case "aborted":
      return { metin: "", olumcul: false };
    default:
      return { metin: "Ses tanıma başlatılamadı. Lütfen yazarak devam edin.", olumcul: true };
  }
}

export default function SesliYazma({
  onMetin,
  hedefId,
}: {
  /** Taninan her tamamlanmis cumle bu fonksiyona veriliyor. */
  onMetin: (parca: string) => void;
  /** Dugmenin hangi alani doldurdugu — erisilebilirlik icin. */
  hedefId?: string;
}) {
  const [dinliyor, setDinliyor] = useState(false);
  const [ara, setAra] = useState("");
  const [hata, setHata] = useState("");

  const tanimaRef = useRef<Tanima | null>(null);
  /** Kullanici hala dinlemek istiyor mu? `onend` buna bakip yeniden basliyor. */
  const istekliRef = useRef(false);
  /** Bu oturumda hic sonuc geldi mi? Sonsuz yeniden baslatma dongusune karsi. */
  const sonucVarRef = useRef(false);
  const baslangicRef = useRef(0);
  /**
   * En son nota yazilan cumle ve zamani.
   *
   * ⚠️ Oturumlar arasi kopyalamaya karsi: Android'de bir cumle, oturum yeniden
   * baslatildiktan sonra tekrar gelebiliyor. Indis isaretlemesi yalnizca ayni
   * oturumun icinde ise yariyor, bu ref oturumdan oturuma tasiniyor.
   */
  const sonYazilanRef = useRef<{ metin: string; zaman: number }>({ metin: "", zaman: 0 });

  /**
   * Destek yalnizca tarayicida olculebilir.
   *
   * `useSyncExternalStore` kullanilmasinin sebebi: sunucu HTML'inde dugme YOK
   * (sunucu anlik degeri `false`), tarayicida ise varsa hemen ciziliyor.
   * Ayni isi `useEffect` + `setState` ile yapmak fazladan bir cizim turu
   * demek olurdu. Degeri degistiren bir olay yok; abonelik bos.
   */
  const destekli = useSyncExternalStore(
    () => () => {},
    () => tanimaYapici() !== null,
    () => false
  );

  const durdur = useCallback(() => {
    istekliRef.current = false;
    setDinliyor(false);
    setAra("");
    try {
      tanimaRef.current?.stop();
    } catch {
      /* zaten durmus olabilir */
    }
  }, []);

  // Sayfadan ayrilirken mikrofon acik kalmasin.
  useEffect(() => {
    return () => {
      istekliRef.current = false;
      try {
        tanimaRef.current?.abort();
      } catch {
        /* yok sayilir */
      }
    };
  }, []);

  const oturumBaslat = useCallback(() => {
    const bulunan = tanimaYapici();
    if (!bulunan) return;
    // Ic fonksiyonda tur daralmasi korunsun diye ayri bir sabite aliniyor.
    const Yapici: TanimaYapici = bulunan;

    istekliRef.current = true;
    // Kullanici yeniden basladiginda kopya suzgeci sifirlaniyor; yoksa
    // durdurup ayni kelimeyi tekrar soylemek atlanabilirdi.
    sonYazilanRef.current = { metin: "", zaman: 0 };

    /**
     * Tek bir tanima oturumu.
     *
     * ⚠️ Ic fonksiyon olmasinin sebebi `onend`: mobil tarayicilar `continuous`
     * olsa bile birkac saniye sessizlikten sonra oturumu kendiliginden
     * kapatiyor. Kullanici "durdur" demedigi surece kendini yeniden cagiriyor.
     */
    function baslat() {
      /**
       * ⚠️ Onceki ornek varsa once SUSTURULUP kapatiliyor.
       *
       * Iki canli tanima ayni anda dinlerse her cumle iki kez yazilir.
       * `onend` bosaltilmadan `abort()` cagrilirsa o da yeniden baslatir —
       * once olay isleyicileri, sonra abort.
       */
      const eski = tanimaRef.current;
      if (eski) {
        eski.onresult = null;
        eski.onerror = null;
        eski.onend = null;
        try {
          eski.abort();
        } catch {
          /* zaten kapali olabilir */
        }
      }

      const tanima = new Yapici();
      tanimaRef.current = tanima;
      tanima.lang = "tr-TR";
      /**
       * ⚠️ ANDROID'DE `continuous` KAPALI — kullanici bildirdi: bir isim
       * soyleyince nota UC KEZ yaziliyordu, masaustunde sorun yoktu.
       *
       * Android Chrome'da `continuous` acikken ayni cumle `results` listesine
       * birden fazla kez, AYRI indislerle giriyor (bilinen tarayici hatasi).
       * Android zaten her cumleden sonra oturumu kendi kapatiyor; yani
       * `continuous` orada bir sey kazandirmiyor, yalnizca bu hatayi
       * tetikliyor. Kapatinca oturum basina tek sonuc kaliyor, sureklilik de
       * asagidaki `onend` yeniden baslatmasiyla korunuyor.
       */
      tanima.continuous = !/Android/i.test(navigator.userAgent);
      // `interimResults`: konusurken yazi ekranda ilerlesin; mikrofonun
      // calistigi boyle goruluyor. Ara metin nota YAZILMIYOR, gosteriliyor.
      tanima.interimResults = true;
      tanima.maxAlternatives = 1;
      sonucVarRef.current = false;
      baslangicRef.current = Date.now();

      /** Bu oturumda nota gecirilmis sonuc indisleri. */
      const yazilan = new Set<number>();

      tanima.onresult = (e) => {
        let araMetin = "";
        /**
         * ⚠️ `e.resultIndex`'ten BASLANMIYOR, liste bastan taraniyor.
         *
         * Android'de ayni olayda eski sonuclar da yeniden geliyor ve
         * `resultIndex` her zaman ilerlemiyor; "sadece yeni gelenler" varsayimi
         * tam olarak ucleme sikayetini uretiyordu. Yazilan indisler
         * isaretleniyor, ikinci kez gelen sonuc atlaniyor.
         */
        for (let i = 0; i < e.results.length; i++) {
          const sonuc = e.results[i];
          const metin = (sonuc[0]?.transcript ?? "").trim();
          if (sonuc.isFinal) {
            if (yazilan.has(i)) continue;
            yazilan.add(i);
            sonucVarRef.current = true;
            if (metin && metin !== sonYazilanRef.current.metin) {
              onMetin(metin);
              sonYazilanRef.current = { metin, zaman: Date.now() };
            } else if (metin) {
              /**
               * Ayni metin yeni bir INDISLE geldi. Android'de gorulen ikinci
               * kopyalama bicimi bu. Iki saniyeden sonrasi gercek bir tekrar
               * sayiliyor ("evet evet" gibi) ve yaziliyor.
               */
              if (Date.now() - sonYazilanRef.current.zaman > 2000) {
                onMetin(metin);
                sonYazilanRef.current = { metin, zaman: Date.now() };
              }
            }
          } else if (!yazilan.has(i)) {
            araMetin += metin + " ";
          }
        }
        setAra(araMetin.trim());
      };

      tanima.onerror = (e) => {
        const { metin, olumcul } = hataMetni(e.error);
        if (olumcul) {
          istekliRef.current = false;
          setDinliyor(false);
          setAra("");
        }
        if (metin) setHata(metin);
      };

      tanima.onend = () => {
        if (!istekliRef.current) {
          setDinliyor(false);
          setAra("");
          return;
        }
        /**
         * Dongü tehlikesi: mikrofon hic acilamiyorsa `start -> end` arka arkaya
         * tetiklenir ve sayfa kilitlenir. Oturum hic sonuc uretmeden bir
         * saniyeden kisa surduyse yeniden baslatilmiyor.
         */
        if (!sonucVarRef.current && Date.now() - baslangicRef.current < 1000) {
          istekliRef.current = false;
          setDinliyor(false);
          setAra("");
          setHata((h) => h || "Mikrofon açılamadı. Lütfen yazarak devam edin.");
          return;
        }
        baslat();
      };

      try {
        tanima.start();
        setDinliyor(true);
        setHata("");
      } catch {
        // Zaten calisiyorsa `start` hata firlatir; durum degistirilmiyor.
      }
    }

    baslat();
  }, [onMetin]);

  if (!destekli) return null;

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => (dinliyor ? durdur() : oturumBaslat())}
        aria-pressed={dinliyor}
        aria-controls={hedefId}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
          dinliyor
            ? "border-red-300 bg-red-50 text-red-700"
            : "border-line bg-white text-navy hover:border-blue hover:text-blue"
        }`}
      >
        <span aria-hidden="true" className="relative flex h-4 w-4 items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
          </svg>
          {dinliyor && (
            <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />
          )}
        </span>
        {dinliyor ? "Dinleniyor… durdur" : "Sesli yaz"}
      </button>

      {/* Konusurken taninan ara metin. Nota yazilmadan once burada gorunuyor. */}
      {dinliyor && (
        <p aria-live="polite" className="mt-1.5 text-xs italic text-muted">
          {ara ? `“${ara}”` : "Konuşabilirsiniz…"}
        </p>
      )}

      {hata && (
        <p role="alert" className="mt-1.5 text-xs text-amber-800">
          {hata}
        </p>
      )}
    </div>
  );
}
