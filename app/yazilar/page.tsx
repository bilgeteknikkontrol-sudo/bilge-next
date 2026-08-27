import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import YaziGorseli from "../components/YaziGorseli";
import { getArticles } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bilgi Merkezi — Makaleler & Rehberler",
  description:
    "Periyodik kontrol mevzuatı, standartlar ve ekipman rehberleri. 6331, ISO/IEC 17020, ceza, forklift ve basınçlı kap kontrolü hakkında uzman içerik.",
  alternates: { canonical: "/yazilar" },
};

export default async function YazilarPage() {
  const articles = await getArticles(true);
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
          {articles.map((a) => (
            <Link key={a.slug} href={`/yazilar/${a.slug}`} className="group flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-[0_10px_30px_-12px_rgba(11,31,58,.25)] transition hover:-translate-y-1">
              <YaziGorseli slug={a.slug} cmsImage={a.image} bicim="kart" />
              <span className="flex flex-1 flex-col p-6">
                <span className="text-xs font-bold text-blue">{a.category}</span>
                <h2 className="mt-2 text-xl font-bold text-navy group-hover:text-blue">{a.title}</h2>
                <span className="mt-2 block text-sm text-ink">{a.description}</span>
                <span className="mt-auto pt-4 text-xs text-muted">{a.date || ""}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
