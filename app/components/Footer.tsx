import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-[#c7d6f0]">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-navy font-black text-white">
              B
            </span>
            <span className="font-extrabold leading-tight">
              Bilge Teknik Kontrol
              <small className="block text-[.7rem] font-semibold text-[#93a6c9]">
                TÜRKAK Akredite · AB-0296-M
              </small>
            </span>
          </div>
          <p className="mt-4 text-sm">
            TS EN ISO/IEC 17020 standardında akredite bağımsız A Tipi muayene kuruluşu. İş
            ekipmanlarınızın periyodik kontrolünde kanıtlanmış uzmanlık.
          </p>
          <p className="mt-3 text-sm">📞 0212 872 52 04 · ✉️ info@bilgeteknikkontrol.com</p>
        </div>

        <div>
          <h4 className="font-bold text-white">Hizmetler</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/#hizmetler" className="hover:text-white">Kaldırma Ekipmanları</Link></li>
            <li><Link href="/#hizmetler" className="hover:text-white">Basınçlı Kaplar</Link></li>
            <li><Link href="/#hizmetler" className="hover:text-white">Elektrik Tesisatı</Link></li>
            <li><Link href="/#hizmetler" className="hover:text-white">Yangın Sistemleri</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white">Araçlar</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/teklif" className="hover:text-white">Online Teklif</Link></li>
            <li><Link href="/hesapla" className="hover:text-white">Süre Hesaplayıcı</Link></li>
            <li><Link href="/portal" className="hover:text-white">Rapor Portalı</Link></li>
            <li><Link href="/yazilar" className="hover:text-white">Bilgi Merkezi</Link></li>
            <li><Link href="/bolge/istanbul" className="hover:text-white">Hizmet Bölgeleri</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white">Kurumsal</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Hakkımızda</Link></li>
            <li><Link href="/" className="hover:text-white">Referanslar</Link></li>
            <li><Link href="/" className="hover:text-white">İletişim</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-[.85rem] text-[#93a6c9]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Bilge Teknik Kontrol Muayene Gözetim Denetim Ltd. Şti. Tüm hakları saklıdır.</span>
          <span>TS EN ISO/IEC 17020 · Akreditasyon No: AB-0296-M</span>
        </div>
      </div>
    </footer>
  );
}
