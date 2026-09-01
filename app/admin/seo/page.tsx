import Link from "next/link";
import { guard } from "@/lib/auth";
import { getArticles, getEquipment, getLocations } from "@/lib/cms";
import { denetle, aciklamaOnizleme, type Bulgu, type SayfaDenetim } from "@/lib/seo-denetim";
import { SayfaBasligi, Kart, Bilgi, BosDurum } from "../ui";

/**
 * SEO SAGLIK EKRANI
 *
 * ⚠️ NEDEN VAR: panelde SEO ile ilgili tek bir ekran yoktu; yalnizca yazi
 * formunda iki alan (`seoTitle`, `description`) vardi ve o alanlara ne
 * yazildiginda arama sonucunun nasil gorunecegini kimse goremiyordu. Sonuc:
 * 2026-09-01 taramasinda 9 sayfanin aciklamasi Google'in kirptigi uzunlugu
 * asmisti ve bu, ancak siteyi elle taradigimizda ortaya cikti.
 *
 * Bu ekran o taramayi panele tasiyor. Yazi/hizmet/bolge ekleyen kisi, kaydinin
 * arama sonucunda nasil gorunecegini ve neyi duzeltmesi gerektigini burada
 * goruyor — gelistirici beklemeden.
 *
 * ⚠️ SINIR: yalnizca PANELDEN yonetilen sayfalar denetleniyor (yazi, hizmet,
 * bolge — 153 sayfanin ~140'i). Kodda sabit duran sayfalarin (/, /kurumsal,
 * /sss ...) metinleri panelden degistirilemedigi icin burada listelenmiyor;
 * onlar derleme sirasinda gozden gecirilir.
 *
 * Ag istegi yok: veriler CMS'ten okunuyor, sayfalar HTTP ile taranmiyor.
 */
export const dynamic = "force-dynamic";

export default async function SeoSayfasi() {
  // ⚠️ Panelde koruma SAYFA BASINA yapiliyor (middleware yok, layout da
  // korumuyor). Bu satir olmadan ekran herkese acik olur ve tum CMS icerigini
  // disari verir. Yeni bir /admin sayfasi eklerken ilk yazilacak satir budur.
  await guard();

  const [yazilar, ekipmanlar, bolgeler] = await Promise.all([
    getArticles().catch(() => []),
    getEquipment().catch(() => []),
    getLocations().catch(() => []),
  ]);

  const ozet = denetle({ yazilar, ekipmanlar, bolgeler });
  const sorunlu = ozet.sayfalar.filter((s) => s.bulgular.some((b) => b.onem !== "bilgi"));

  return (
    <div>
      <SayfaBasligi
        baslik="SEO Sağlık"
        aciklama="Panelden yönetilen her sayfanın arama sonucunda nasıl görüneceğini denetler: başlık ve açıklama uzunluğu, yinelenen metinler, eksik görsel."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <Sayac etiket="Denetlenen sayfa" deger={String(ozet.toplamSayfa)} />
        <Sayac etiket="Hata" deger={String(ozet.hata)} vurgu={ozet.hata > 0 ? "kotu" : "iyi"} />
        <Sayac etiket="Uyarı" deger={String(ozet.uyari)} vurgu={ozet.uyari > 0 ? "orta" : "iyi"} />
        <Sayac etiket="Temiz sayfa" deger={`%${ozet.puan}`} vurgu={ozet.puan >= 90 ? "iyi" : ozet.puan >= 70 ? "orta" : "kotu"} />
      </div>

      {sorunlu.length === 0 ? (
        <BosDurum
          ikon="✅"
          baslik="Düzeltilecek bir şey yok"
          aciklama={`${ozet.toplamSayfa} sayfanın başlığı ve açıklaması arama sonucuna sığıyor, yinelenen metin yok. Yeni içerik ekledikçe bu ekranı tekrar açın.`}
        />
      ) : (
        <div className="space-y-3">
          {sorunlu.map((s) => (
            <SayfaKarti key={s.yol} s={s} />
          ))}
        </div>
      )}

      <div className="mt-8 space-y-3">
        <Kart
          baslik="Bu ekranın ölçmediği tek şey: gerçek sıralama"
          aciklama="Aşağıdakiler ancak Google'ın kendi araçlarıyla görülebilir."
        >
          <Bilgi>
            Sitenin hangi aramalarda kaçıncı sırada çıktığı, hangi sayfaların dizine
            eklenemediği ve hangi adreslerin hata verdiği burada görünmez — o veri yalnızca{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              Google Search Console
            </a>
            &apos;da bulunur. Site oraya bağlı ve veri topluyor. Bu ekrandaki denetim ile orayı
            birlikte kullanın: burası &quot;arama sonucunda nasıl görüneceği&quot;ni, orası
            &quot;gerçekte ne olduğu&quot;nu söyler.
          </Bilgi>
        </Kart>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ parcalar */

function Sayac({ etiket, deger, vurgu }: { etiket: string; deger: string; vurgu?: "iyi" | "orta" | "kotu" }) {
  const renk =
    vurgu === "kotu"
      ? "text-red-600"
      : vurgu === "orta"
        ? "text-amber-600"
        : vurgu === "iyi"
          ? "text-emerald-600"
          : "text-navy";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className={`text-2xl font-black tabular-nums ${renk}`}>{deger}</div>
      <div className="mt-0.5 text-xs font-semibold text-slate-500">{etiket}</div>
    </div>
  );
}

function Rozet({ b }: { b: Bulgu }) {
  const stil =
    b.onem === "hata"
      ? "border-red-200 bg-red-50 text-red-700"
      : b.onem === "uyari"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-slate-50 text-slate-600";
  return (
    <li className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${stil}`}>
      <span className="font-bold">{b.kural}:</span> {b.mesaj}
    </li>
  );
}

function SayfaKarti({ s }: { s: SayfaDenetim }) {
  const hataVar = s.bulgular.some((b) => b.onem === "hata");
  return (
    <section
      className={`rounded-2xl border bg-white p-4 ${hataVar ? "border-red-200" : "border-amber-200"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[.7rem] font-bold text-slate-600">
              {s.tur}
            </span>
            <h2 className="truncate font-bold text-navy">{s.ad}</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">{s.yol}</p>
        </div>
        <div className="flex flex-none gap-2">
          <Link
            href={s.duzenleYolu}
            className="inline-flex items-center rounded-lg bg-blue px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
          >
            Düzenle
          </Link>
          <a
            href={s.yol}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue hover:text-blue"
          >
            Gör ↗
          </a>
        </div>
      </div>

      {/*
        Arama sonucu onizlemesi. ⚠️ Aciklama, sayfada GERCEKTEN basilacak
        haliyle (kirpilmis) gosteriliyor — panelde yazilan uzun metni oldugu
        gibi gostermek, sorunun ta kendisini gizlerdi.
      */}
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-[.7rem] font-bold uppercase tracking-wide text-slate-400">
          Google&apos;da böyle görünecek
        </p>
        <p className="mt-1 truncate text-[.95rem] font-medium text-blue">{s.baslik}</p>
        <p className="text-xs leading-relaxed text-slate-600">{aciklamaOnizleme(s.aciklama)}</p>
        <p className="mt-1.5 text-[.7rem] text-slate-400">
          Başlık {s.baslik.length} karakter · Açıklama {s.aciklama.length} karakter
        </p>
      </div>

      <ul className="mt-3 space-y-1.5">
        {s.bulgular.map((b, i) => (
          <Rozet key={i} b={b} />
        ))}
      </ul>
    </section>
  );
}
