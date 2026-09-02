import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TeklifForm from "../components/TeklifForm";
import KirintiYolu from "../components/KirintiYolu";
import { metinleriOku } from "@/lib/sayfa-metin";
import { sorularHaritasi } from "@/lib/teklif-sorulari";

export const metadata: Metadata = {
  title: "Online Teklif & Randevu",
  description:
    "Ekipmanlarınızı seçin, periyodik kontrol teklifi talebini saniyeler içinde oluşturun. TÜRKAK akredite AB-0296-M.",
  alternates: { canonical: "/teklif" },
};

export default async function TeklifPage() {
  const m = await metinleriOku();
  // Ekipmana bagli ek bilgi sorulari panelden yonetiliyor; forma prop olarak
  // geciyor ki istemci bileseni veritabanina dokunmasin.
  const sorular = await sorularHaritasi().catch(() => ({}));
  return (
    <>
      <Header />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-10 max-w-[760px] text-center">
            <KirintiYolu ad="Online Teklif" yol="/teklif" merkez />
            <span className="chip mt-3">Bağlayıcı Değil</span>
            <h1 className="mt-4 text-3xl font-black text-navy md:text-4xl">{m("teklif_baslik")}</h1>
            <p className="mt-3 text-muted">{m("teklif_giris")}</p>
          </div>
          <TeklifForm sorular={sorular} />
        </div>
      </section>
      <Footer />
    </>
  );
}
