import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Calculator from "../components/Calculator";

export const metadata: Metadata = {
  title: "Yasal Süre & Uygunluk Hesaplayıcı",
  description:
    "Ekipmanınızın yasal periyodik kontrol periyodunu ve bir sonraki zorunlu kontrol tarihini anında hesaplayın. 6331 ve İş Ekipmanları Yönetmeliği Ek-III.",
  alternates: { canonical: "/hesapla" },
};

export default function HesaplaPage() {
  return (
    <>
      <Header />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-10 max-w-[760px] text-center">
            <span className="inline-flex rounded-full bg-blue-soft px-4 py-1.5 text-sm font-bold text-blue">6331 · İş Ekipmanları Yönetmeliği Ek-III</span>
            <h1 className="mt-4 text-3xl font-black text-navy md:text-4xl">Yasal Süre &amp; Uygunluk Hesaplayıcı</h1>
            <p className="mt-3 text-muted">Son kontrol tarihini girin; bir sonraki zorunlu kontrol tarihini ve gecikme riskini anında görün. Rakiplerde bulamayacağınız şeffaf bir araç.</p>
          </div>
          <Calculator />
        </div>
      </section>
      <Footer />
    </>
  );
}
