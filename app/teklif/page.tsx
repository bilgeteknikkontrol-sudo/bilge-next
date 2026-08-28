import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TeklifForm from "../components/TeklifForm";

export const metadata: Metadata = {
  title: "Online Teklif & Randevu",
  description:
    "Ekipmanlarınızı seçin, periyodik kontrol teklifi talebini saniyeler içinde oluşturun. TÜRKAK akredite AB-0296-M.",
  alternates: { canonical: "/teklif" },
};

export default function TeklifPage() {
  return (
    <>
      <Header />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-10 max-w-[760px] text-center">
            <span className="chip">Bağlayıcı Değil</span>
            <h1 className="mt-4 text-3xl font-black text-navy md:text-4xl">Online Teklif &amp; Randevu Talebi</h1>
            <p className="mt-3 text-muted">Sol kategoriden ekipmanlarınızı işaretleyin; sağdaki özet anında güncellenir. Bilgilerinizi bırakın, ekibimiz en kısa sürede dönüş yapsın.</p>
          </div>
          <TeklifForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
