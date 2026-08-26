import Link from "next/link";
import { KATEGORILER } from "@/lib/data";
import { slugify } from "@/lib/content";

export default function Footer() {
  return (
    <footer id="iletisim" className="mt-10 border-t border-line bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-white/20 font-black text-white">
              B
            </span>
            <span className="font-extrabold text-white">Bilge Teknik Kontrol</span>
          </div>
          <p className="mt-4 text-sm text-white/70">
            TÜRKAK akredite (AB-0296-M) periyodik teknik kontrol kuruluşu. 2014&apos;ten beri
            iş ekipmanlarınızın yasal kontrollerinde uzmanız.
          </p>
          <p className="mt-4 text-sm">
            <span className="font-semibold text-white">Adres:</span> Beylikdüzü / İstanbul
            <br />
            <span className="font-semibold text-white">Telefon:</span> 0212 872 52 04
            <br />
            <span className="font-semibold text-white">E-posta:</span> info@bilgeteknikkontrol.com
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">Hizmetler</p>
          <ul className="space-y-2 text-sm">
            {KATEGORILER.map((k) => (
              <li key={k.baslik}>
                <Link href={`/ekipman/${slugify(k.ekipmanlar[0].ad)}`} className="transition hover:text-white">
                  {k.ikon} {k.baslik}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">Kurumsal</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#hakkinda" className="transition hover:text-white">Hakkımızda</Link></li>
            <li><Link href="/#neden" className="transition hover:text-white">Neden Biz</Link></li>
            <li><Link href="/yazilar" className="transition hover:text-white">Bilgi Merkezi</Link></li>
            <li><Link href="/portal" className="transition hover:text-white">Rapor Portalı</Link></li>
            <li><Link href="/#referans" className="transition hover:text-white">Referanslarımız</Link></li>
            <li><Link href="/#akreditasyon" className="transition hover:text-white">Akreditasyon</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">Hızlı İşlemler</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/teklif" className="transition hover:text-white">Online Teklif Al</Link></li>
            <li><Link href="/hesapla" className="transition hover:text-white">Yasal Süre Hesapla</Link></li>
            <li><Link href="/bolge/istanbul" className="transition hover:text-white">Hizmet Bölgeleri</Link></li>
            <li><Link href="/yazilar" className="transition hover:text-white">Makaleler</Link></li>
          </ul>
          <p className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-white/70">
            TÜRKAK Akreditasyon No: <b className="text-white">AB-0296-M</b>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 md:flex-row">
          <span>© {new Date().getFullYear()} Bilge Teknik Kontrol Muayene Gözetim Denetim Ltd. Şti.</span>
          <span>İş Sağlığı ve Güvenliği mevzuatına uygun periyodik kontrol hizmeti.</span>
        </div>
      </div>
    </footer>
  );
}
