import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { KURUM, ADRES_TEK_SATIR } from "@/lib/site-data";
import {
  SON_GUNCELLEME,
  TOPLANAN_VERILER,
  ISLEME_AMACLARI,
  HUKUKI_SEBEPLER,
  HAKLAR,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin işlenmesine ilişkin aydınlatma metni, haklarınız ve başvuru yolu.",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://bilgekontrol.com/" },
      { "@type": "ListItem", position: 2, name: "KVKK Aydınlatma Metni", item: "https://bilgekontrol.com/kvkk" },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="bg-gradient-to-br from-navy to-navy2 py-14 text-white">
        <div className="container-x">
          <nav className="mb-3 text-sm text-onnavy">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> / <span>KVKK Aydınlatma Metni</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">KVKK Aydınlatma Metni</h1>
          <p className="mt-3 max-w-3xl text-onnavy">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel
            verilerinizin veri sorumlusu sıfatıyla tarafımızca nasıl işlendiğine ilişkin
            bilgilendirmedir.
          </p>
          <p className="mt-2 text-sm text-onnavydim">Son güncelleme: {SON_GUNCELLEME}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_280px]">
          <article className="max-w-[760px] leading-relaxed text-ink [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy [&_p]:mt-3 [&_p]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:text-muted">
            <h2 id="veri-sorumlusu">1. Veri Sorumlusu</h2>
            <p>
              Kişisel verileriniz, veri sorumlusu sıfatıyla <strong>{KURUM.ad}</strong> tarafından
              aşağıda açıklanan kapsamda işlenmektedir.
            </p>
            <div className="mt-4 rounded-card border border-line bg-bgsoft p-5 text-sm">
              <dl className="space-y-1.5">
                <div><dt className="inline font-bold text-navy">Unvan: </dt><dd className="inline text-muted">{KURUM.ad}</dd></div>
                <div><dt className="inline font-bold text-navy">Adres: </dt><dd className="inline text-muted">{ADRES_TEK_SATIR}</dd></div>
                <div><dt className="inline font-bold text-navy">Telefon: </dt><dd className="inline text-muted">{KURUM.telefon}</dd></div>
                <div><dt className="inline font-bold text-navy">E-posta: </dt><dd className="inline text-muted">{KURUM.eposta}</dd></div>
              </dl>
            </div>

            <h2 id="veriler">2. İşlenen Kişisel Verileriniz ve Toplama Yöntemi</h2>
            <p>
              Kişisel verileriniz, internet sitemizdeki <Link href="/teklif">teklif formunu</Link>{" "}
              doldurmanız, telefon veya e-posta yoluyla bizimle iletişime geçmeniz ve siteyi
              kullanmanız sırasında <strong>tamamen veya kısmen otomatik yollarla</strong>{" "}
              elde edilmektedir. Bizimle paylaşmadığınız sürece aşağıdakiler dışında bir kişisel
              veri toplanmaz.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border border-line bg-bgsoft p-3 text-left font-bold text-navy">Veri Kategorisi</th>
                    <th className="border border-line bg-bgsoft p-3 text-left font-bold text-navy">İşlenen Veriler</th>
                  </tr>
                </thead>
                <tbody>
                  {TOPLANAN_VERILER.map((v) => (
                    <tr key={v.kategori}>
                      <td className="border border-line p-3 font-semibold text-ink">{v.kategori}</td>
                      <td className="border border-line p-3 text-muted">{v.ornek}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Sitemizde <strong>özel nitelikli kişisel veri</strong> (sağlık, biyometrik veri vb.)
              toplanmamaktadır. Lütfen teklif formundaki serbest metin alanına bu nitelikte bilgi
              yazmayınız.
            </p>

            <h2 id="amaclar">3. Kişisel Verilerinizin İşlenme Amaçları</h2>
            <ul>
              {ISLEME_AMACLARI.map((a) => <li key={a}>{a}</li>)}
            </ul>

            <h2 id="hukuki-sebep">4. İşlemenin Hukuki Sebebi</h2>
            <p>Kişisel verileriniz, KVKK’nın aşağıdaki hükümlerine dayanılarak işlenmektedir:</p>
            <div className="mt-4 space-y-3">
              {HUKUKI_SEBEPLER.map((h) => (
                <div key={h.madde} className="rounded-xl border border-line bg-white p-4">
                  <p className="m-0 text-sm font-bold text-navy">
                    KVKK {h.madde} — {h.baslik}
                  </p>
                  <p className="m-0 mt-1 text-sm text-muted">{h.aciklama}</p>
                </div>
              ))}
            </div>

            <h2 id="aktarim">5. Kişisel Verilerinizin Aktarılması</h2>
            <h3>Yurt içindeki aktarımlar</h3>
            <p>
              Kişisel verileriniz; iş sağlığı ve güvenliği mevzuatından doğan yükümlülüklerimiz
              gereği <strong>Çalışma ve Sosyal Güvenlik Bakanlığı</strong> ile İSG-KATİP başta
              olmak üzere yetkili kamu kurum ve kuruluşlarına, akreditasyon denetimleri kapsamında
              <strong> Türk Akreditasyon Kurumu&apos;na (TÜRKAK)</strong>, ayrıca hukuki
              yükümlülüklerimizin yerine getirilmesi amacıyla mali müşavir ve avukatlarımıza
              KVKK md. 8 kapsamında aktarılabilmektedir.
            </p>
            <h3>Yurt dışına aktarım</h3>
            <p>
              İnternet sitemiz <strong>Vercel Inc.</strong> (Amerika Birleşik Devletleri) altyapısı
              üzerinde barındırılmaktadır. Bu nedenle site üzerinden ilettiğiniz veriler ile
              sunucu tarafında oluşan teknik kayıtlar, hizmetin teknik olarak sunulabilmesi
              amacıyla yurt dışındaki sunucularda işlenmektedir. Aynı şekilde iletişim
              sayfamızdaki harita <strong>Google</strong> tarafından sağlanmakta olup, haritanın
              görüntülenmesi sırasında IP adresiniz Google&apos;a iletilmektedir.
            </p>
            <p>
              Bu aktarımlar KVKK md. 9 kapsamında değerlendirilmekte olup, kullandığımız
              sağlayıcılarla veri işleme şartlarını düzenleyen sözleşmeler yürütülmektedir.
              Haritanın yüklenmesini istemiyorsanız iletişim sayfasını ziyaret etmeden bize
              telefon veya e-posta ile ulaşabilirsiniz.
            </p>

            <h2 id="saklama">6. Saklama Süresi</h2>
            <p>
              Kişisel verileriniz, işlendikleri amaç için gerekli olan süre boyunca ve her hâlükârda
              ilgili mevzuatta öngörülen zamanaşımı ve saklama süreleri boyunca muhafaza edilir.
              Muayene ve raporlama süreçlerine ilişkin kayıtlar, iş sağlığı ve güvenliği mevzuatı
              ile akreditasyon şartlarının gerektirdiği süre boyunca saklanır. Sürenin sona
              ermesi hâlinde verileriniz silinir, yok edilir veya anonim hâle getirilir.
            </p>
            <p>
              Sonuçlanmayan teklif taleplerine ilişkin veriler, talebin değerlendirilmesi için
              gereken makul süre sonunda silinir.
            </p>

            <h2 id="haklar">7. KVKK md. 11 Kapsamındaki Haklarınız</h2>
            <p>Veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
            <ul>
              {HAKLAR.map((h) => <li key={h}>{h}</li>)}
            </ul>

            <h2 id="basvuru">8. Başvuru Yolu</h2>
            <p>
              Yukarıdaki haklarınıza ilişkin taleplerinizi, <strong>Veri Sorumlusuna Başvuru Usul
              ve Esasları Hakkında Tebliğ</strong> uyarınca aşağıdaki yollarla iletebilirsiniz:
            </p>
            <ul>
              <li>
                Islak imzalı dilekçenizi kimliğinizi tevsik edici belgelerle birlikte{" "}
                <strong>{ADRES_TEK_SATIR}</strong> adresine şahsen veya noter aracılığıyla
                göndererek,
              </li>
              <li>
                Sistemimizde kayıtlı e-posta adresinizi kullanarak{" "}
                <a href={`mailto:${KURUM.eposta}`}>{KURUM.eposta}</a> adresine ileterek.
              </li>
            </ul>
            <p>
              Başvurunuzda adınız, soyadınız, iletişim bilgileriniz ve talebinizin konusu açıkça
              yer almalıdır. Talebiniz, niteliğine göre <strong>en geç otuz gün içinde</strong>{" "}
              ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde
              Kurul tarafından belirlenen tarifedeki ücret talep edilebilir.
            </p>
            <p>
              Başvurunuzun reddedilmesi, verilen cevabı yetersiz bulmanız veya süresinde cevap
              verilmemesi hâlinde, cevabı öğrendiğiniz tarihten itibaren otuz ve her hâlde
              başvuru tarihinden itibaren altmış gün içinde{" "}
              <strong>Kişisel Verileri Koruma Kurulu&apos;na</strong> şikâyette bulunabilirsiniz.
            </p>

            <h2 id="degisiklik">9. Metindeki Değişiklikler</h2>
            <p>
              Bu aydınlatma metni, mevzuattaki değişiklikler veya veri işleme süreçlerimizdeki
              güncellemeler doğrultusunda revize edilebilir. Güncel metin her zaman bu sayfada
              yayımlanır.
            </p>

            <div className="mt-10 rounded-card border border-line bg-bgsoft p-6">
              <p className="m-0 text-sm text-muted">
                Çerezlerin kullanımına ilişkin ayrıntılı bilgi için{" "}
                <Link href="/cerez-politikasi" className="font-bold text-blue underline">
                  Çerez Politikamıza
                </Link>{" "}
                bakabilirsiniz.
              </p>
            </div>
          </article>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <nav className="rounded-card border border-line bg-bgsoft p-5" aria-label="Sayfa içi gezinme">
              <p className="text-sm font-bold text-navy">İçindekiler</p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {[
                  ["veri-sorumlusu", "Veri Sorumlusu"],
                  ["veriler", "İşlenen Verileriniz"],
                  ["amaclar", "İşleme Amaçları"],
                  ["hukuki-sebep", "Hukuki Sebep"],
                  ["aktarim", "Aktarım"],
                  ["saklama", "Saklama Süresi"],
                  ["haklar", "Haklarınız"],
                  ["basvuru", "Başvuru Yolu"],
                  ["degisiklik", "Değişiklikler"],
                ].map(([id, t], i) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-muted transition hover:text-blue">
                      {i + 1}. {t}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
