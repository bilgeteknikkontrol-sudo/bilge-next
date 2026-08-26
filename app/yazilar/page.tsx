import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ARTICLES } from "@/lib/content";
import { YAZI_GORSEL } from "@/lib/images";

export const metadata: Metadata = {
  title: "Bilgi Merkezi — Makaleler & Rehberler",
  description:
    "Periyodik kontrol mevzuatı, standartlar ve ekipman rehberleri. 6331, ISO/IEC 17020:2026, ceza, forklift ve basınçlı kap kontrolü hakkında uzman içerik.",
  alternates: { canonical: "/yazilar" },
};

export default function YazilarPage() {
  return (
    <>
      <Header />
      <section className="bg-bgsoft py-14">
        <div className="mx-auto max-w-[1200px] px-5 text-center">
          <span className="inline-flex rounded-full bg-blue-soft px-4 py-1.5 text-sm font-bold text-blue">Bilgi Merkezi</span>
          <h1 className="mt-4 text-3xl font-black text-navy md:text-4xl">Makaleler & Rehberler</h1>
          <p className="mt-3 text-muted">Periyodik kontrol dünyasında güncel, uzman ve uygulanabilir içerik.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => {
            const g = YAZI_GORSEL[a.slug];
            return (
              <Link key={a.slug} href={`/yazilar/${a.slug}`} className="group flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-[0_10px_30px_-12px_rgba(11,31,58,.25)] transition hover:-translate-y-1">
                {g && (
                  <span className="block aspect-[16/9] overflow-hidden bg-bgsoft">
                    <Image
                      src={g}
                      alt=""
                      aria-hidden
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      placeholder="blur"
                    />
                  </span>
                )}
                <span className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-bold text-blue">{a.category}</span>
                  <h2 className="mt-2 text-xl font-bold text-navy group-hover:text-blue">{a.title}</h2>
                  <span className="mt-2 block text-sm text-ink">{a.description}</span>
                  <span className="mt-auto pt-4 text-xs text-muted">{new Date(a.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })} · {a.readMin} dk okuma</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
}
