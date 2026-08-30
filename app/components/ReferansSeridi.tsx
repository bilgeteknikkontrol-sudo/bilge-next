import Image from "next/image";
import { REFERANSLAR } from "@/lib/site-data";
import { bloklar } from "@/lib/bloklar";

/**
 * Referans logolari serit halinde kayar.
 *
 * JS kullanilmiyor: liste iki kez basiliyor ve CSS ile -50% kaydiriliyor,
 * boylece dikis yeri gorunmeden sonsuz donuyor. Fareyle uzerine gelince duruyor;
 * "hareketi azalt" tercihinde animasyon kapanip yatay kaydirilabilir listeye
 * donuyor (globals.css).
 *
 * Kaynak: panelden eklenen "referans" bloklari. Panel bosken statik varsayilan
 * liste kullanilir, yani site hicbir zaman logosuz kalmaz.
 */
export default async function ReferansSeridi() {
  /**
   * ⚠️ Gorseli OLMAYAN bloklar disarida.
   *
   * Onceden dogrudan `b.gorsel` basiliyordu; bos oldugunda tarayiciya
   * `<img src="">` gidiyor ve bu, gorseli bos birakmak yerine SAYFANIN
   * KENDISINI yeniden istemek demek. Panelde gorseli bos kaydedilmis ya da
   * medya kutuphanesinden silinmis bir logo bu duruma dusuyordu
   * (silinmis atif artik lib/bloklar.ts icinde bos dizeye ceviriliyor).
   * Hicbiri gecerli degilse koddaki statik listeye dusuluyor — dosyanin
   * basindaki "site hicbir zaman logosuz kalmaz" sozu boyle korunuyor.
   */
  const panelLogolari = (await bloklar("referans").catch(() => [])).filter((b) =>
    b.gorsel?.trim(),
  );

  const kaynak = panelLogolari.length
    ? panelLogolari.map((b) => ({ name: b.baslik, src: b.gorsel, statik: null }))
    : REFERANSLAR.map((r) => ({ name: r.name, src: "", statik: r.logo }));

  // Kesintisiz dongü icin ayni liste iki kez; ikinci kopya ekran okuyucudan gizli.
  const seri = [...kaynak, ...kaynak];

  return (
    <div className="referans-serit" aria-label="Müşteri referanslarımız">
      <ul className="referans-serit-ic">
        {seri.map((r, i) => {
          const kopya = i >= kaynak.length;
          return (
            <li
              key={`${r.name}-${i}`}
              className="flex h-24 w-[190px] shrink-0 items-center justify-center rounded-xl border border-line bg-white p-4"
              aria-hidden={kopya ? true : undefined}
            >
              {r.statik ? (
                <Image
                  src={r.statik}
                  alt={kopya ? "" : r.name}
                  sizes="190px"
                  className="max-h-14 w-auto object-contain opacity-75 transition hover:opacity-100"
                />
              ) : (
                // Panelden gelen adres serbest (harici URL / data URL) -> duz img
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.src}
                  alt={kopya ? "" : r.name}
                  className="max-h-14 w-auto object-contain opacity-75 transition hover:opacity-100"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
