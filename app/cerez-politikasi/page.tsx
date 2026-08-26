import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { KURUM } from "@/lib/site-data";
import { SON_GUNCELLEME, CEREZ_TABLOSU } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "bilgekontrol.com üzerinde kullanılan çerezler, hangi amaçla kullanıldıkları ve tarayıcınızdan nasıl yönetebileceğinize dair bilgilendirme.",
  alternates: { canonical: "/cerez-politikasi" },
};

export default function CerezPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "Çerez Politikası", item: "https://bilgekontrol.com/cerez-politikasi" },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-[#c7d6f0]">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>Çerez Politikası</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Çerez Politikası</h1>
          <p className="mt-3 max-w-3xl text-[#c7d6f0]">
            bilgekontrol.com üzerinde hangi çerezlerin kullanıldığı, ne amaçla kullanıldıkları ve
            bunları nasıl yönetebileceğiniz hakkında bilgilendirme.
          </p>
          <p className="mt-2 text-sm text-[#9db4de]">Son güncelleme: {SON_GUNCELLEME}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x max-w-[820px] leading-relaxed text-ink [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy [&_p]:mt-3 [&_p]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:text-muted">
          <h2>Çerez nedir?</h2>
          <p>
            Çerez (cookie), bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük
            metin dosyalarıdır. Çerezler sitenin düzgün çalışmasına, tercihlerinizin
            hatırlanmasına ve site kullanımının ölçülmesine yardımcı olur.
          </p>

          <h2>Sitemizde kullanılan çerezler</h2>
          <p>
            Sitemizde <strong>reklam veya profilleme amaçlı çerez kullanılmamaktadır.</strong>{" "}
            Kullanılan servisler ve amaçları aşağıdadır:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-line bg-bgsoft p-3 text-left font-bold text-navy">Servis</th>
                  <th className="border border-line bg-bgsoft p-3 text-left font-bold text-navy">Sağlayıcı</th>
                  <th className="border border-line bg-bgsoft p-3 text-left font-bold text-navy">Tür</th>
                  <th className="border border-line bg-bgsoft p-3 text-left font-bold text-navy">Amaç</th>
                </tr>
              </thead>
              <tbody>
                {CEREZ_TABLOSU.map((c) => (
                  <tr key={c.ad}>
                    <td className="border border-line p-3 font-semibold text-ink">{c.ad}</td>
                    <td className="border border-line p-3 text-muted">{c.saglayici}</td>
                    <td className="border border-line p-3 text-muted">{c.tip}</td>
                    <td className="border border-line p-3 text-muted">{c.amac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Üçüncü taraf içerikler</h2>
          <p>
            <Link href="/iletisim">İletişim sayfamızda</Link> yer alan konum haritası Google
            tarafından sağlanmaktadır. Harita yüklendiğinde IP adresiniz Google&apos;a iletilir ve
            Google kendi çerezlerini yerleştirebilir. Bu çerezler üzerinde kontrolümüz
            bulunmamaktadır; ayrıntılar için Google&apos;ın kendi gizlilik politikasını
            inceleyebilirsiniz. Haritanın yüklenmesini istemiyorsanız iletişim sayfasını ziyaret
            etmeden bize telefon ({KURUM.telefon}) veya e-posta ({KURUM.eposta}) ile
            ulaşabilirsiniz.
          </p>

          <h2>Çerezleri nasıl yönetebilirsiniz?</h2>
          <p>
            Tarayıcınızın ayarlarından çerezleri silebilir, engelleyebilir veya çerez
            yerleştirildiğinde uyarı verilmesini sağlayabilirsiniz. Zorunlu/teknik çerezleri
            engellemeniz hâlinde sitenin bazı bölümleri düzgün çalışmayabilir.
          </p>
          <ul>
            <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Üçüncü taraf çerezleri</li>
            <li>Safari: Ayarlar → Safari → Gizlilik ve Güvenlik</li>
            <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
            <li>Edge: Ayarlar → Çerezler ve site izinleri</li>
          </ul>

          <h2>Kişisel verilerinizin işlenmesi</h2>
          <p>
            Çerezler aracılığıyla elde edilen veriler dâhil olmak üzere kişisel verilerinizin
            işlenmesine ilişkin ayrıntılı bilgilendirme ve KVKK kapsamındaki haklarınız için{" "}
            <Link href="/kvkk" className="font-bold text-blue underline">
              KVKK Aydınlatma Metnimizi
            </Link>{" "}
            inceleyebilirsiniz.
          </p>

          <h2>Değişiklikler</h2>
          <p>
            Bu politika, sitede kullanılan servislerdeki değişikliklere göre güncellenebilir.
            Güncel metin her zaman bu sayfada yayımlanır.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
