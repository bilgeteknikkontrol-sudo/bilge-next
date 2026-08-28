import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TeklifForm from "../components/TeklifForm";
import { metinleriOku } from "@/lib/sayfa-metin";

export const metadata: Metadata = {
  title: "Online Teklif & Randevu",
  description:
    "Ekipmanlarınızı seçin, periyodik kontrol teklifi talebini saniyeler içinde oluşturun. TÜRKAK akredite AB-0296-M.",
  alternates: { canonical: "/teklif" },
};

export default async function TeklifPage() {
  const m = await metinleriOku();
  return (
    <>
      <Header />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-10 max-w-[760px] text-center">
            <span className="chip">Bağlayıcı Değil</span>
            <h1 className="mt-4 text-3xl font-black text-navy md:text-4xl">{m("teklif_baslik")}</h1>
            <p className="mt-3 text-muted">{m("teklif_giris")}</p>
          </div>
          <TeklifForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
