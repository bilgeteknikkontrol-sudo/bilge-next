import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Portal from "../components/Portal";

export const metadata: Metadata = {
  title: "Müşteri Rapor Portalı",
  description:
    "Rapor numaranızla periyodik kontrol geçmişinizi, geçerlilik tarihini ve yenileme hatırlatmasını görüntüleyin. TÜRKAK akredite AB-0296-M.",
  alternates: { canonical: "/portal" },
  robots: { index: false, follow: true },
};

export default function PortalPage() {
  return (
    <>
      <Header />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-10 max-w-[760px] text-center">
            <span className="inline-flex rounded-full bg-blue-soft px-4 py-1.5 text-sm font-bold text-blue">🔒 Müşteri Özel Alanı</span>
            <h1 className="mt-4 text-3xl font-black text-navy md:text-4xl">Rapor Sorgulama Portalı</h1>
            <p className="mt-3 text-muted">Rapor numaranızı girin; kontrol geçmişinizi, geçerlilik tarihinizi ve yenileme durumunuzu görüntüleyin. Bu özellik rakiplerde yok — sizin için ekstra şeffaflık.</p>
          </div>
          <Portal />
        </div>
      </section>
      <Footer />
    </>
  );
}
