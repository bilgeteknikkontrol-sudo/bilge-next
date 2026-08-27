import Image from "next/image";
import { YAZI_GORSEL } from "@/lib/images";

type Props = {
  slug: string;
  /** Panelden girilen gorsel adresi. Bos ise slug eslesmeli varsayilan kullanilir. */
  cmsImage?: string;
  alt?: string;
  /** "kart" = liste karti (16:9 kirpilmis), "makale" = yazi ici tam genislik */
  bicim?: "kart" | "makale";
  oncelikli?: boolean;
  sizes?: string;
};

/**
 * Yazi gorseli.
 *
 * Iki kaynak var ve ikisi farkli sekilde islenmeli:
 *  - CMS gorseli: panelden girilen SERBEST bir adres olabilir (harici URL veya
 *    base64 data URL). next/image bunlar icin uzak alan tanimi ister ve data:
 *    URL'leri optimize edemez; bu yuzden duz <img> kullaniliyor.
 *  - Varsayilan gorsel: derleme aninda bilinen statik import. next/image ile
 *    optimize ediliyor, blur placeholder ve responsive srcset uretiliyor.
 */
export default function YaziGorseli({
  slug,
  cmsImage,
  alt = "",
  bicim = "kart",
  oncelikli = false,
  sizes,
}: Props) {
  const varsayilan = YAZI_GORSEL[slug];
  const kart = bicim === "kart";

  if (cmsImage) {
    return kart ? (
      <span className="block aspect-[16/9] overflow-hidden bg-bgsoft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cmsImage}
          alt={alt}
          loading={oncelikli ? "eager" : "lazy"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </span>
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cmsImage}
        alt={alt}
        className="mt-6 h-auto w-full rounded-card border border-line object-cover"
      />
    );
  }

  if (!varsayilan) return null;

  return kart ? (
    <span className="block aspect-[16/9] overflow-hidden bg-bgsoft">
      <Image
        src={varsayilan}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        placeholder="blur"
      />
    </span>
  ) : (
    <Image
      src={varsayilan}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      priority={oncelikli}
      sizes={sizes || "(max-width: 860px) 100vw, 780px"}
      className="mt-6 h-auto w-full rounded-card border border-line object-cover"
      placeholder="blur"
    />
  );
}
