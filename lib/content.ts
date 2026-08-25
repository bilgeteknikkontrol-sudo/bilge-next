import { KATEGORILER, type Ekipman } from "./data";

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readMin: number;
  keywords: string[];
  body: string; // güvenilir, kendi içeriğimiz (HTML)
};

export type Location = {
  slug: string;
  il: string;
  ilce?: string;
  title: string;
  description: string;
  intro: string;
  hizmetler: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "periyodik-kontrol-cezasi-2026",
    title: "Periyodik Kontrol Yaptırmamanın Cezası (2026 Güncel)",
    description:
      "6331 Sayılı İSG Kanunu ve İş Ekipmanları Yönetmeliği kapsamında periyodik kontrol yaptırmamanın idari para cezası, işin durdurulması ve hukuki riskleri.",
    category: "Mevzuat",
    date: "2026-08-20",
    readMin: 6,
    keywords: ["periyodik kontrol cezası", "6331 ceza", "iş ekipmanı cezası 2026"],
    body: `
<h2>Yasal Zorunluluk Nereden Geliyor?</h2>
<p>İş ekipmanlarının periyodik kontrolü; <b>6331 Sayılı İş Sağlığı ve Güvenliği Kanunu</b> ile <b>İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği (Ek-III)</b> gereği zorunludur. Üretici aksini belirtmedikçe çoğu ekipman <b>yılda en az bir kez</b> uzmanlarca muayene edilmelidir.</p>
<h2>Yaptırılmmazsa Ne Olur?</h2>
<ul>
  <li><b>İdari para cezası:</b> Süresi geçmiş kontrol, Çalışma Bakanlığı iş müfettişi denetimlerinde cezai yaptırıma bağlanır.</li>
  <li><b>İşin durdurulması:</b> Hayati risk taşıyan ekipmanda can ve mal güvenliği tehlikesi varsa faaliyet durdurulabilir.</li>
  <li><b>Hukuki sorumluluk:</b> Bir kaza durumunda "kusur" ve tazminat yükü işverene geçer; akredite rapor yoksa sorumluluk artar.</li>
  <li><b>İhale & denetim engeli:</b> Kamu ihaleleri ve tedarikçi denetimlerinde güncel periyodik kontrol raporu istenir.</li>
</ul>
<h2>Cezadan Korunmanın Yolu</h2>
<p>Basit: ekipman envanterinizi çıkarın, son kontrol tarihlerini işaretleyin ve <b>TÜRKAK akredite (AB-0296-M)</b> bir kuruluşla sözleşme yapın. <a href="/hesapla">Yasal Süre Hesaplayıcı</a> aracımızla bir sonraki zorunlu tarihi 10 saniyede bulabilirsiniz.</p>
<blockquote>Tüyo: Rapor Portalı ile tüm raporlarınızı tek ekrandan takip edin; süre dolmadan otomatik hatırlatma alın.</blockquote>
`,
  },
  {
    slug: "iso-iec-17020-2026-yenilikleri",
    title: "ISO/IEC 17020:2026 Yenilikleri ve Muayene Kuruluşlarına Etkisi",
    description:
      "Muayene kuruluşları standardının 2026 baskısında öne çıkan değişiklikler; tarafsızlık, dijital raporlama ve kapsam yönetimi.",
    category: "Standart",
    date: "2026-08-15",
    readMin: 7,
    keywords: ["ISO/IEC 17020:2026", "TÜRKAK 17020", "muayene kuruluşu standardı"],
    body: `
<h2>17020 Nedir, Neden Önemli?</h2>
<p><b>TS EN ISO/IEC 17020</b>, muayene kuruluşlarının yeterliliğini, tarafsızlığını ve tutarlılığını belirleyen temel standarttır. TÜRKAK bu standarda göre akreditasyon verir; raporun ulusal ve uluslararası geçerliliği buna bağlıdır.</p>
<h2>2026 Baskısında Öne Çıkanlar</h2>
<ul>
  <li><b>Dijital ve uzaktan muayene:</b> Belge ve veri yönetiminde dijital iz kayıtlarına vurgu artıyor.</li>
  <li><b>Tarafsızlık yönetimi:</b> A Tipi bağımsız kuruluş olmanın kanıtı daha sıkı denetleniyor.</li>
  <li><b>Kapsam şeffaflığı:</b> Hangi muayene alanında akredite olunduğu açıkça raporlanmalı.</li>
</ul>
<h2>Bilge Teknik Kontrol Açısından</h2>
<p>Kuruluşumuz <b>AB-0296-M</b> numarasıyla akreditidir. 2026 güncellemelerine uyum için raporlama süreçlerimizi dijitalleştirdik; e-imzalı raporlarınızı <a href="/portal">Rapor Portalı</a>'ndan anında görüntüleyebilirsiniz.</p>
`,
  },
  {
    slug: "forklift-periyodik-kontrolu",
    title: "Forklift Periyodik Kontrolü: Süre, Standart ve Yük Testi",
    description:
      "Forklift ve transpaletlerin periyodik kontrolünde dikkat edilmesi gerekenler; TS EN ISO 3691, yük testi ve rapor süreci.",
    category: "Kaldırma Ekipmanları",
    date: "2026-08-10",
    readMin: 5,
    keywords: ["forklift periyodik kontrol", "transpalet muayene", "forklift yük testi"],
    body: `
<h2>Forklift Neden Kontrol Edilir?</h2>
<p>Forklift, transpalet ve benzeri kaldırma ekipmanları iş kazalarının sık görüldüğü makinelerdir. <b>TS EN ISO 3691</b> kapsamında yılda 1 kez muayene edilir; fren, hidrolik, mast, yük kapasitesi ve emniyet sistemleri denetlenir.</p>
<h2>Kontrol Adımları</h2>
<ul>
  <li>Görsel muayene ve eksiklik tespiti</li>
  <li><b>Yük testi:</b> Beyan edilen yükün en az 1,25 katı ile test</li>
  <li>Hidrolik ve elektrik sistemi kontrolü</li>
  <li>Operatör güvenlik ekipmanları (emiş, ikaz)</li>
</ul>
<h2>Teklif Almak İçin</h2>
<p>Forklift, transpalet ve diğer kaldırma ekipmanlarınızı <a href="/teklif">Online Teklif</a> formundan seçip anında ön bilgi alın.</p>
`,
  },
  {
    slug: "basincli-kap-hidrostatik-test",
    title: "Basınçlı Kap Hidrostatik Testi Nedir, Nasıl Yapılır?",
    description:
      "Kompresör tankı, kazan ve basınçlı kaplarda hidrostatik testin prensibi, basınç değeri ve tahribatsız muayene alternatifi.",
    category: "Basınçlı Kaplar",
    date: "2026-08-05",
    readMin: 5,
    keywords: ["hidrostatik test", "basınçlı kap muayene", "kompresör tankı test"],
    body: `
<h2>Temel Prensip</h2>
<p>Basınçlı kaplarda temel prensip olarak <b>hidrostatik test</b> yapılır. Standartlarda aksi belirtilmediği sürece işletme basıncının <b>1,5 katı</b> ile ve bir yılı aşmayan sürelerle uygulanır.</p>
<h2>Ne Zaman Tahribatsız Muayene?</h2>
<p>İşletme koşulları hidrostatik teste izin vermiyorsa, standartlarda belirtilen <b>tahribatsız muayene (NDT)</b> yöntemleri uygulanabilir; raporda gerekçesi belirtilir.</p>
<h2>Kapsam</h2>
<p>Kompresör hava tankı, buhar/kalorifer kazanı, otoklav, hidrofor ve genleşme tankı gibi ekipmanlar <b>AB-0296-M</b> kapsamımızdadır. <a href="/teklif">Teklif alın</a>.</p>
`,
  },
  {
    slug: "isg-katip-periyodik-kontrol-sozlesmesi",
    title: "İSG-KATİP Üzerinden Periyodik Kontrol Sözleşmesi Nasıl Yapılır?",
    description:
      "Periyodik teknik kontrol hizmet sözleşmesinin İSG-KATİP sistemine girilmesi, ekipnet ve rapor süreci adım adım.",
    category: "Süreç",
    date: "2026-07-28",
    readMin: 4,
    keywords: ["İSG-KATİP periyodik kontrol", "ekipnet", "periyodik kontrol sözleşmesi"],
    body: `
<h2>Adım Adım</h2>
<ol>
  <li>Muayene kuruluşu ile <b>hizmet sözleşmesi</b> imzalanır.</li>
  <li>Sözleşme <b>İSG-KATİP</b> sistemine yüklenir ve resmi olarak belgelenir.</li>
  <li>Uzman mühendis ekibi yerinde muayeneyi gerçekleştirir.</li>
  <li>Rapor <b>ekipnet</b> numaralı, e-imzalı olarak düzenlenir.</li>
</ol>
<h2>Neden Önemli?</h2>
<p>İSG-KATİP kaydı, denetimlerde sözleşmenin varlığını kanıtlar; ekipnet numarası raporun izlenebilirliğini sağlar. Bilge Teknik Kontrol olarak tüm raporlarımız ekipnet numaralı ve TÜRKAK akreditelidir.</p>
`,
  },
];

export function slugify(tr: string): string {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i" };
  return tr
    .replace(/[çğıİöşüâî]/g, (m) => map[m] || m)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type EkipmanSayfa = Ekipman & { slug: string; kategori: string };

export const ALL_EKIPMAN: EkipmanSayfa[] = KATEGORILER.flatMap((kat) =>
  kat.ekipmanlar.map((e) => ({ ...e, slug: slugify(e.ad), kategori: kat.baslik }))
);

export const LOCATIONS: Location[] = [
  { slug: "istanbul", il: "İstanbul", title: "İstanbul Periyodik Teknik Kontrol", description: "İstanbul'da TÜRKAK akredite periyodik kontrol ve muayene hizmeti.", intro: "İstanbul'un tüm ilçelerinde yerinde muayene. Merkezimiz Beylikdüzü'nde.", hizmetler: ["Kaldırma Ekipmanları", "Basınçlı Kaplar", "Elektrik Tesisatı", "Yangın Sistemleri"] },
  { slug: "beylikduzu", il: "İstanbul", ilce: "Beylikdüzü", title: "Beylikdüzü Periyodik Kontrol", description: "Beylikdüzü merkezli TÜRKAK akredite muayene kuruluşu.", intro: "Beylikdüzü ve çevresindeki organize sanayi bölgelerine hızlı yerinde hizmet.", hizmetler: ["Forklift", "Kompresör Tankı", "Raf Sistemleri", "İş Makineleri"] },
  { slug: "ankara", il: "Ankara", title: "Ankara Periyodik Teknik Kontrol", description: "Ankara'da iş ekipmanları periyodik muayene.", intro: "Ankara'daki işletmeler için akredite kontrol ve raporlama.", hizmetler: ["Kaldırma Ekipmanları", "Basınçlı Kaplar", "Elektrik Ölçümleri"] },
  { slug: "izmir", il: "İzmir", title: "İzmir Periyodik Teknik Kontrol", description: "İzmir'de TÜRKAK akredite periyodik kontrol.", intro: "Ege Bölgesi'nde uluslararası geçerli akredite raporlar.", hizmetler: ["Basınçlı Kaplar", "Kaldırma Ekipmanları", "Yangın Sistemleri"] },
  { slug: "kocaeli", il: "Kocaeli", title: "Kocaeli Periyodik Teknik Kontrol", description: "Kocaeli sanayi tesisleri için periyodik muayene.", intro: "Ağır sanayi ve liman tesisleri için yerinde muayene.", hizmetler: ["Basınçlı Kaplar", "İş Makineleri", "Kaldırma Ekipmanları"] },
  { slug: "bursa", il: "Bursa", title: "Bursa Periyodik Teknik Kontrol", description: "Bursa'da iş ekipmanı periyodik kontrolü.", intro: "Otomotiv ve tekstil üretim tesisleri için akredite kontrol.", hizmetler: ["Makine ve Tezgâh", "Kaldırma Ekipmanları", "Elektrik Tesisatı"] },
  { slug: "tekirdag", il: "Tekirdağ", title: "Tekirdağ Periyodik Teknik Kontrol", description: "Tekirdağ ve Çorlu için periyodik muayene.", intro: "Trakya bölgesi sanayisi için hızlı yerinde hizmet.", hizmetler: ["Basınçlı Kaplar", "İş Makineleri", "Raf Sistemleri"] },
  { slug: "turkiye-geneli", il: "Türkiye", title: "Türkiye Geneli Periyodik Kontrol", description: "Türkiye'nin her bölgesine akredite periyodik kontrol hizmeti.", intro: "Merkez İstanbul olmak üzere Türkiye geneli mobil ekipman muayene ağı.", hizmetler: ["Tüm İş Ekipmanları", "İş Hijyeni Ölçümleri", "Eğitim Hizmetleri"] },
];
