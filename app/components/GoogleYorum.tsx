/**
 * "Bizi Google'da değerlendirin" kutusu.
 *
 * ⚠️ NEDEN VAR: yerel aramada ("periyodik kontrol Beylikdüzü", "TÜRKAK
 * akredite muayene İstanbul") harita kutusunda kimin çıkacağını belirleyen en
 * güçlü sinyallerden biri Google İşletme Profili'ndeki yorum sayısı ve puanı.
 * Site teknik olarak iyi durumdaydı ama hiçbir yerde yorum çağrısı yoktu.
 *
 * ⚠️ ÜÇ KURAL — bozmayın:
 *
 * 1. FİLTRE YOK. "Memnun kaldıysanız Google'a, kalmadıysanız bize yazın"
 *    ayrımı (review gating) Google'ın politikasına aykırıdır ve işletme
 *    profilinin cezalandırılmasına yol açar. Herkese aynı çağrı gösterilir.
 *
 * 2. PUAN İŞARETLEMESİ YOK. Kendi sitesinde kendi işletmesi hakkında
 *    `AggregateRating` / `Review` yapısal verisi yayınlamak Google'ın kuralları
 *    gereği geçersizdir (2019'dan beri "self-serving review" yasağı). Yıldızlar
 *    arama sonucunda görünmez, üstelik yapısal veri cezası riski doğurur.
 *    Puan Google tarafında kalır; burada yalnızca yönlendirme var.
 *
 * 3. BAĞLANTI BOŞSA HİÇ BASILMAZ. Panelde adres girilmediği sürece kutu
 *    görünmez — ziyaretçi boş bir butona tıklayamaz.
 */

type Props = {
  /** Panelden gelen Google "yorum yaz" adresi. Boşsa bileşen null döner. */
  link: string;
  baslik: string;
  yazi: string;
  buton: string;
};

export default function GoogleYorum({ link, baslik, yazi, buton }: Props) {
  const adres = link?.trim();
  if (!adres) return null;

  return (
    <section className="mt-8 rounded-card border border-line bg-white p-6">
      <div className="flex items-start gap-4">
        {/* Google'in dort renkli "G" harfi — resmi marka isareti. */}
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bgsoft">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden focusable="false">
            <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.57-5.17 3.57-8.87z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.86-3c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
          </svg>
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-navy">{baslik}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{yazi}</p>
          <a
            href={adres}
            target="_blank"
            /**
             * ⚠️ `noopener` sart: target="_blank" ile acilan sayfa, bu sayfayi
             * window.opener uzerinden yonlendirebilir (tabnabbing).
             */
            rel="noopener noreferrer"
            className="btn-primary mt-4 px-6 py-3 text-[.92rem]"
          >
            {buton}
          </a>
        </div>
      </div>
    </section>
  );
}
