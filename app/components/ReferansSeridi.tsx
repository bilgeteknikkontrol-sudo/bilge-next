import Image from "next/image";
import { REFERANSLAR } from "@/lib/site-data";

/**
 * Referans logolari serit halinde kayar.
 *
 * JS kullanilmiyor: liste iki kez basiliyor ve CSS ile -50% kaydiriliyor,
 * boylece dikis yeri gorunmeden sonsuz donuyor. Sunucuda cizilebiliyor.
 * Fareyle uzerine gelince duruyor; "hareketi azalt" tercihinde animasyon
 * kapaniyor ve serit yatay kaydirilabilir listeye donuyor (globals.css).
 */
export default function ReferansSeridi() {
  // Kesintisiz dongü icin ayni liste iki kez; ikinci kopya ekran okuyucudan gizli.
  const seri = [...REFERANSLAR, ...REFERANSLAR];

  return (
    <div className="referans-serit" aria-label="Müşteri referanslarımız">
      <ul className="referans-serit-ic">
        {seri.map((r, i) => (
          <li
            key={`${r.name}-${i}`}
            className="flex h-24 w-[190px] shrink-0 items-center justify-center rounded-xl border border-line bg-white p-4"
            aria-hidden={i >= REFERANSLAR.length ? true : undefined}
          >
            <Image
              src={r.logo}
              alt={i >= REFERANSLAR.length ? "" : r.name}
              sizes="190px"
              className="max-h-14 w-auto object-contain opacity-75 transition hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
