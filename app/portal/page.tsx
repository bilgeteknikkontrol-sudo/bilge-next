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

const ADIMLAR = [
  { n: "1", t: "Rapor numaranızı girin", d: "Firmanıza iletilen AB0296-… numarasını portal kutusuna yazın." },
  { n: "2", t: "Kontrol geçmişini görün", d: "Ekipman, kontrol tarihi ve geçerlilik bilgisi anında listelenir." },
  { n: "3", t: "Yenileme teklifi alın", d: "Süre dolmadan bizden yeni periyodik kontrol teklifi alın." },
];

const ROZETLER = [
  { i: "🛡️", t: "TÜRKAK Akredite", d: "AB-0296-M yetkisiyle" },
  { i: "⚡", t: "Anında Sonuç", d: "7/24 çevrimiçi portal" },
  { i: "🔒", t: "Güvenli", d: "Kişiye özel rapor" },
];

export default function PortalPage() {
  return (
    <>
      <Header />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto mb-10 max-w-[760px] text-center">
            <span className="inline-flex rounded-full bg-blue-soft px-4 py-1.5 text-sm font-bold text-blue">🔒 Müşteri Özel Alanı</span>
            <h1 className="mt-4 text-3xl font-black text-navy md:text-4xl">Rapor Sorgulama Portalı</h1>
            <p className="mt-3 text-muted">
              Rapor numaranızı girin; kontrol geçmişinizi, geçerlilik tarihinizi ve yenileme durumunuzu görüntüleyin. Bu şeffaflık özelliği rakiplerde yok.
            </p>
          </div>

          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {ROZETLER.map((r) => (
              <div key={r.t} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_10px_30px_-16px_rgba(11,31,58,.3)]">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-soft text-xl">{r.i}</div>
                <div>
                  <p className="font-bold text-navy">{r.t}</p>
                  <p className="text-xs text-muted">{r.d}</p>
                </div>
              </div>
            ))}
          </div>

          <Portal />

          <div className="mx-auto mt-14 max-w-[820px]">
            <h2 className="mb-6 text-center text-xl font-black text-navy">Nasıl Çalışır?</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {ADIMLAR.map((a) => (
                <div key={a.n} className="rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_-16px_rgba(11,31,58,.3)]">
                  <div className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-blue text-sm font-black text-white">{a.n}</div>
                  <p className="font-bold text-navy">{a.t}</p>
                  <p className="mt-1 text-sm text-muted">{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
