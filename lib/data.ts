// OTOMATIK URETILDI: scratchpad/generate-final.js (bilgekontrol.com'un onceki PHP
// surumundeki 92 hizmet/ekipman iceriginden). Elle duzenlersen bir sonraki uretimde ezilir.
export type Ekipman = {
  ad: string;
  standart: string;
  periyot: number; // ay
  periyotNot?: string;
  slug: string;
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
      { ad: "Kaldırma ve İletme Ekipmanları", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kaldirma-iletme" },
      { ad: "Kendinden Tahrikli Endüstriyel Araç - İstif Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "istif-makinasi" },
      { ad: "Yaya Tarafından Kumanda Edilen İstif Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "yaya-istif-makinasi" },
      { ad: "Forklift Periyodik Kontrolü", standart: "TS EN ISO 3691", periyot: 12, slug: "forklift" },
      { ad: "Transpalet Periyodik Kontrolü", standart: "TS EN 1757", periyot: 12, slug: "transpalet" },
      { ad: "Mobil Vinç Periyodik Kontrolü", standart: "TS EN 13000", periyot: 12, slug: "mobil-vinc" },
      { ad: "Monoray Vinç ve Kren Periyodik Kontrolü", standart: "TS EN 15011", periyot: 12, slug: "monoray-vinc" },
      { ad: "Sapan ve Kaldırma Aksesuarları Kontrolü", standart: "TS EN 818-6", periyot: 12, slug: "sapan-ve-kaldirma-aksesuarlari" },
      { ad: "Yükseltilebilir Seyyar İş Platformu (Manlift) Kontrolü", standart: "TS EN 280", periyot: 6, slug: "yukseltilebilir-seyyar-is-platformu" },
      { ad: "Sütunlu Çalışma Platformu Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "sutunlu-calisma-platformu" },
      { ad: "Araç Üstü Servis Lifti ve Elevatör Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "arac-ustu-servis-lifti" },
      { ad: "Konveyör ve Bantlı İletim Sistemleri Kontrolü", standart: "Makine Emniyeti Yönetmeliği", periyot: 12, slug: "konveyor-bantli-iletme" },
      { ad: "İnşaat Cephe Asansörü Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "insaat-cephe-asansoru" },
      { ad: "Kriko, Tifor ve Zincirli Çektirme Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kriko-ve-cektirme" },
      { ad: "Telehandler Periyodik Kontrolü", standart: "TS EN 1459", periyot: 12, slug: "telehandler" },
    ],
  },
  {
    baslik: "Basınçlı Kaplar",
    ikon: "🛢️",
    ekipmanlar: [
      { ad: "Basınçlı Kapların Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "basincli-kaplar" },
      { ad: "Buhar Kazanı Periyodik Kontrolü", standart: "TS EN 12953", periyot: 12, slug: "buhar-kazani" },
      { ad: "Kompresör ve Hava Tankı Periyodik Kontrolü", standart: "TS EN 286-1", periyot: 12, slug: "kompresor-hava-tanki" },
      { ad: "Kalorifer Kazanı Periyodik Kontrolü", standart: "TS EN 303", periyot: 12, slug: "kalorifer-kazani" },
      { ad: "Sıcak Su ve Kızgın Su Kazanı Kontrolü", standart: "TS EN 12953", periyot: 12, slug: "sicak-su-ve-kizgin-su-kazani" },
      { ad: "Kızgın Yağ Kazanı Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kizgin-yag-kazani" },
      { ad: "Hidrofor ve Genleşme Tankı Kontrolü", standart: "TS EN 12897", periyot: 12, slug: "hidrofor-ve-genlesme-tanki" },
      { ad: "LPG Depolama Tankı Periyodik Kontrolü", standart: "TS EN 12285", periyot: 12, slug: "lpg-depolama-tanki" },
      { ad: "Kriyojenik Tank Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kriyojenik-tank" },
      { ad: "Sınai ve Tıbbi Gaz Tankı Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "sinai-ve-tibbi-gaz-tanki" },
      { ad: "Otoklav ve Sterilizatör Periyodik Kontrolü", standart: "TS EN 285", periyot: 12, slug: "otoklav-ve-sterilizator" },
      { ad: "Isı Değiştirici (Eşanjör) Periyodik Kontrolü", standart: "TS EN 13445", periyot: 12, slug: "isi-degistirici-esanjor" },
    ],
  },
  {
    baslik: "Makine ve Tezgâhlar",
    ikon: "⚙️",
    ekipmanlar: [
      { ad: "Makina ve Tezgah Kontrolleri", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "makina-tezgah" },
      { ad: "Dairesel Testere (Ağaç İşleme Makinaları)", standart: "TS EN 1807", periyot: 12, slug: "dairesel-testere" },
      { ad: "Delme Makinaları - Matkap", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "delme-makinalari-matkap" },
      { ad: "Demir Bükme Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "demir-bukme" },
      { ad: "Demir Kesme Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "demir-kesme" },
      { ad: "Dikey Panel Ebatlama (Ağaç İşleme Makinaları)", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "dikey-panel-ebatlama" },
      { ad: "Dilme Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "dilme-makinasi" },
      { ad: "Form Verme Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "form-verme" },
      { ad: "Hareketsiz Taşlama Makinaları (Satıh Taşlama Tezgahı)", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "satih-taslama" },
      { ad: "Hareketsiz Taşlama Makinaları (Taşlama Motoru)", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "taslama-motoru" },
      { ad: "Kaynak Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kaynak-makinasi" },
      { ad: "Kenar Bükme ve Kesme Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kenar-bukme-kesme" },
      { ad: "Kurutma Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kurutma-makinasi" },
      { ad: "Makaralı Pnömatik Boğma Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "makarali-pnomatik-bogma" },
      { ad: "Makina ve Tezgahlar", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "makina-tezgahlar" },
      { ad: "Makina Yerleşim Projesi", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "makina-yerlesim-projesi" },
      { ad: "Pedal Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "pedal-makinasi" },
      { ad: "Pipet Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "pipet-makinasi" },
      { ad: "Pipet Paketleme Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "pipet-paketleme" },
      { ad: "Punta (Tabanca) Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "punta-tabanca" },
      { ad: "Şerit Testere (Ağaç İşleme Makinaları)", standart: "TS EN 1807", periyot: 12, slug: "serit-testere" },
      { ad: "Şerit Zımpara Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "serit-zimpara" },
      { ad: "Takım Bileme Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "takim-bileme" },
      { ad: "Tek Kafa Tabak Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "tek-kafa-tabak" },
      { ad: "Tekli Pipet Kaplama Makinası", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "tekli-pipet-kaplama" },
      { ad: "Hidrolik Pres Periyodik Kontrolü", standart: "TS EN 692", periyot: 12, slug: "hidrolik-pres" },
      { ad: "Eksantrik Pres Periyodik Kontrolü", standart: "TS EN 692", periyot: 12, slug: "eksantrik-pres" },
      { ad: "Abkant Pres Periyodik Kontrolü", standart: "TS EN 12622", periyot: 12, slug: "abkant-pres" },
      { ad: "Giyotin Makas Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "giyotin-makas" },
      { ad: "Torna Tezgahı Periyodik Kontrolü", standart: "TS EN ISO 23125", periyot: 12, slug: "torna-tezgahi" },
      { ad: "Freze Tezgahı Periyodik Kontrolü", standart: "TS EN ISO 16089", periyot: 12, slug: "freze-tezgahi" },
      { ad: "CNC İşleme Merkezi Periyodik Kontrolü", standart: "TS EN ISO 16090", periyot: 12, slug: "isleme-merkezi-cnc" },
      { ad: "Plastik Enjeksiyon Makinesi Kontrolü", standart: "TS EN 201", periyot: 12, slug: "plastik-enjeksiyon-makinesi" },
      { ad: "Planya ve Kalınlık Makinesi Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "planya-ve-kalinlik-makinesi" },
      { ad: "Borverk Tezgahı Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "borverk-tezgahi" },
    ],
  },
  {
    baslik: "İş Makineleri",
    ikon: "🚜",
    ekipmanlar: [
      { ad: "İş Makineleri Kontrolleri", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "is-makineleri" },
      { ad: "Sondaj Makinaları (Hidrolik Delici - Fore Kazık)", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "sondaj-makinalari" },
      { ad: "Kazıcı Yükleyici (Beko Loder) Kontrolü", standart: "TS EN 474", periyot: 12, slug: "kazici-yukleyici" },
      { ad: "Yükleyici (Loder) Periyodik Kontrolü", standart: "TS EN 474", periyot: 12, slug: "yukleyici-loder" },
      { ad: "Dozer Periyodik Kontrolü", standart: "TS EN 474", periyot: 12, slug: "dozer" },
      { ad: "Greyder Periyodik Kontrolü", standart: "TS EN 474", periyot: 12, slug: "greyder" },
      { ad: "Silindir (Zemin Sıkıştırma) Kontrolü", standart: "TS EN 474", periyot: 12, slug: "silindir-sikistirma-makinesi" },
      { ad: "Asfalt Serici (Finişer) Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "asfalt-serici-finiser" },
      { ad: "Beton Pompası Periyodik Kontrolü", standart: "TS EN 12001", periyot: 12, slug: "beton-pompasi" },
      { ad: "Transmikser Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "transmikser" },
      { ad: "Kırma ve Eleme Tesisi Periyodik Kontrolü", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "kirma-eleme-tesisi" },
    ],
  },
  {
    baslik: "Elektrik Tesisatı ve Ölçümleri",
    ikon: "⚡",
    ekipmanlar: [
      { ad: "Elektrik Tesisat Kontrolü", standart: "TS EN 60364", periyot: 12, slug: "elektrik-tesisat" },
      { ad: "Makinalarda Elektriksel Kontrol ve Risk", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "makinalarda-elektriksel-kontrol" },
      { ad: "Topraklama Ölçümü ve Periyodik Kontrolü", standart: "TS EN 61439", periyot: 12, slug: "topraklama-olcumu" },
      { ad: "Paratoner ve Yıldırımdan Korunma Kontrolü", standart: "TS EN 62305", periyot: 12, slug: "paratoner-yildirimdan-korunma" },
      { ad: "Katodik Koruma Periyodik Kontrolü", standart: "TS EN 14505", periyot: 12, slug: "katodik-koruma" },
    ],
  },
  {
    baslik: "Yangın ve Güvenlik Sistemleri",
    ikon: "🔥",
    ekipmanlar: [
      { ad: "Yangın Tesisatı Kontrolü", standart: "BYKHY", periyot: 12, slug: "yangin-tesisati" },
      { ad: "Yangın Algılama Kontrolü", standart: "TS EN 54", periyot: 12, slug: "yangin-algilama" },
      { ad: "Sprinkler (Yağmurlama) Sistemi Kontrolü", standart: "TS EN 12845", periyot: 12, slug: "sprinkler-yagmurlama-sistemi" },
      { ad: "Yangın Dolabı ve Hidrant Kontrolü", standart: "TS EN 671", periyot: 12, slug: "yangin-dolabi-ve-hidrant" },
      { ad: "Yangın Pompası Periyodik Kontrolü", standart: "TS EN 12845", periyot: 1, periyotNot: "İmalatçı talimatı: haftalık çalıştırma testi önerilir", slug: "yangin-pompasi" },
      { ad: "Portatif Yangın Söndürme Cihazı Kontrolü", standart: "TS EN 3", periyot: 12, slug: "portatif-yangin-sondurme-cihazi" },
    ],
  },
  {
    baslik: "Havalandırma ve Raf Sistemleri",
    ikon: "📦",
    ekipmanlar: [
      { ad: "Raf Sistemleri Kontrolü", standart: "TS EN 15512", periyot: 12, slug: "raf-sistemleri" },
      { ad: "Havalandırma Kontrolü", standart: "ASHRAE 62.1", periyot: 12, slug: "havalandirma" },
      { ad: "Yürüyen Merdiven ve Bant Kontrolleri", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "yuruyen-merdiven" },
      { ad: "Duman Tahliye Sistemi Periyodik Kontrolü", standart: "TS EN 12101", periyot: 12, slug: "duman-tahliye-sistemi" },
    ],
  },
  {
    baslik: "Genel Hizmetler ve Uzmanlık Alanları",
    ikon: "🧰",
    ekipmanlar: [
      { ad: "Patlamadan Korunma Dokümanı", standart: "ATEX 2014/34/AB", periyot: 36, slug: "patlamadan-korunma" },
      { ad: "Eğitim Hizmetleri", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 1, periyotNot: "İmalatçı talimatı: haftalık çalıştırma testi önerilir", slug: "egitim" },
      { ad: "Mekanik Periyodik Kontrol", standart: "İş Ekipmanları Yönetmeliği (Ek-III) kapsamı", periyot: 12, slug: "mekanik-periyodik-kontrol" },
      { ad: "İş Hijyeni ve Ortam Ölçümleri", standart: "İSG Mevzuatı", periyot: 12, slug: "is-hijyeni-olcumleri" },
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
