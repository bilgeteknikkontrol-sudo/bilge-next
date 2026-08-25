export type Ekipman = {
  ad: string;
  standart: string;
  periyot: number; // ay
  periyotNot?: string;
};

export type Kategori = {
  baslik: string;
  ikon: string;
  ekipmanlar: Ekipman[];
};

export const KATEGORILER: Kategori[] = [
  {
    baslik: "Kaldırma ve İletme Ekipmanları",
    ikon: "🏗️",
    ekipmanlar: [
      { ad: "Köprülü Vinç", standart: "TS EN 15011", periyot: 12 },
      { ad: "Mobil Vinç", standart: "TS EN 13000", periyot: 12 },
      { ad: "Forklift", standart: "TS EN ISO 3691", periyot: 12 },
      { ad: "Transpalet", standart: "TS EN 1757", periyot: 12 },
      { ad: "Monoray Vinç", standart: "TS EN 15011", periyot: 12 },
      { ad: "Yükseltilebilir Seyyar İş Platformu", standart: "TS EN 280", periyot: 6 },
      { ad: "Sapan ve Kaldırma Aksesuarları", standart: "TS EN 818-6", periyot: 12 },
      { ad: "Konveyör / Bantlı İletme", standart: "Makine Emniyeti", periyot: 12 },
    ],
  },
  {
    baslik: "Basınçlı Kaplar",
    ikon: "🛢️",
    ekipmanlar: [
      { ad: "Kompresör Hava Tankı", standart: "TS EN 286-1", periyot: 12 },
      { ad: "Buhar Kazanı", standart: "TS EN 12953", periyot: 12 },
      { ad: "Kalorifer Kazanı", standart: "TS EN 303", periyot: 12 },
      { ad: "Sıcak Su / Kızgın Yağ Kazanı", standart: "TS EN 12953", periyot: 12 },
      { ad: "Hidrofor ve Genleşme Tankı", standart: "TS EN 12897", periyot: 12 },
      { ad: "LPG Depolama Tankı", standart: "TS EN 12285", periyot: 12 },
      { ad: "Otoklav / Sterilizatör", standart: "TS EN 285", periyot: 12 },
      { ad: "Isı Değiştirici (Eşanjör)", standart: "TS EN 13445", periyot: 12 },
    ],
  },
  {
    baslik: "Makine ve Tezgâhlar",
    ikon: "⚙️",
    ekipmanlar: [
      { ad: "Torna Tezgâhı", standart: "TS EN ISO 23125", periyot: 12 },
      { ad: "Freze Tezgâhı", standart: "TS EN ISO 16089", periyot: 12 },
      { ad: "CNC İşleme Merkezi", standart: "TS EN ISO 16090", periyot: 12 },
      { ad: "Hidrolik / Eksantrik Pres", standart: "TS EN 692", periyot: 12 },
      { ad: "Abkant Pres", standart: "TS EN 12622", periyot: 12 },
      { ad: "Plastik Enjeksiyon Makinesi", standart: "TS EN 201", periyot: 12 },
      { ad: "Testere (Şerit/Dairesel)", standart: "TS EN 1807", periyot: 12 },
    ],
  },
  {
    baslik: "İş Makineleri",
    ikon: "🚜",
    ekipmanlar: [
      { ad: "Kazıcı Yükleyici", standart: "TS EN 474", periyot: 12 },
      { ad: "Yükleyici (Loder)", standart: "TS EN 474", periyot: 12 },
      { ad: "Dozer", standart: "TS EN 474", periyot: 12 },
      { ad: "Greyder", standart: "TS EN 474", periyot: 12 },
      { ad: "Silindir (Sıkıştırma)", standart: "TS EN 474", periyot: 12 },
      { ad: "Beton Pompası", standart: "TS EN 12001", periyot: 12 },
      { ad: "Telehandler", standart: "TS EN 1459", periyot: 12 },
    ],
  },
  {
    baslik: "Elektrik Tesisatı ve Ölçümleri",
    ikon: "⚡",
    ekipmanlar: [
      { ad: "Elektrik Tesisatı Muayenesi", standart: "TS EN 60364", periyot: 12 },
      { ad: "Topraklama Ölçümü", standart: "TS EN 61439", periyot: 12 },
      { ad: "Paratoner / Yıldırımdan Korunma", standart: "TS EN 62305", periyot: 12 },
      { ad: "Katodik Koruma", standart: "TS EN 14505", periyot: 12 },
    ],
  },
  {
    baslik: "Yangın ve Güvenlik Sistemleri",
    ikon: "🔥",
    ekipmanlar: [
      { ad: "Yangın Tesisatı Kontrolü", standart: "BYKHY", periyot: 12 },
      { ad: "Yangın Algılama ve Uyarı", standart: "TS EN 54", periyot: 12 },
      { ad: "Sprinkler / Yağmurlama", standart: "TS EN 12845", periyot: 12 },
      { ad: "Yangın Dolabı ve Hidrant", standart: "TS EN 671", periyot: 12 },
      { ad: "Yangın Pompası", standart: "TS EN 12845", periyot: 1, periyotNot: "İmalatçı talimatı: aylık çalıştırma testi" },
      { ad: "Portatif Yangın Söndürücü", standart: "TS EN 3", periyot: 12 },
      { ad: "Duman Tahliye Sistemi", standart: "TS EN 12101", periyot: 12 },
    ],
  },
  {
    baslik: "Raf Sistemleri ve Diğer",
    ikon: "📦",
    ekipmanlar: [
      { ad: "Raf Sistemleri Kontrolü", standart: "TS EN 15512", periyot: 12 },
      { ad: "Havalandırma / Klima Tesisatı", standart: "ASHRAE 62.1", periyot: 12 },
      { ad: "Patlamadan Korunma Dokümanı", standart: "ATEX 2014/34", periyot: 36 },
      { ad: "İş Hijyeni Ölçümleri", standart: "İSG Mevzuatı", periyot: 12 },
    ],
  },
];

export const YASA = {
  kanun: "6331 Sayılı İş Sağlığı ve Güvenliği Kanunu",
  yonetmelik:
    "İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği (Ek-III)",
  standart: "TS EN ISO/IEC 17020",
  akreditasyon: "AB-0296-M",
  cezaNotu:
    "Süresi içinde yaptırılmayan periyodik kontrol; Çalışma Bakanlığı denetimlerinde idari para cezası ve işin durdurulması riski doğurur.",
};
