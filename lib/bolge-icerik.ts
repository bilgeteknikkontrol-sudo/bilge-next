/**
 * BOLGE SAYFALARININ ZENGIN ICERIGI
 *
 * ⚠️ NEDEN VAR: 2026-08-30 SEO denetiminde sekiz bolge sayfasinin da 84-90
 * KELIME oldugu goruldu. Bunlar tam olarak "Istanbul periyodik kontrol" gibi
 * yerel aramalarda cikmasi gereken sayfalar; ama bu uzunlukta Google'in
 * "kapi sayfasi" (doorway page) saydigi esigin altinda kaliyorlar ve
 * siralamaya hic girmiyorlar. Sekiz sayfa neredeyse ayni metni tasidigi icin
 * ayrica birbirinin kopyasi durumundaydilar.
 *
 * Bu modul her sehre GERCEKTEN FARKLI icerik veriyor: o bolgenin sanayi
 * yapisi, orada agirlikli olarak kontrol edilen ekipmanlar ve bolgeye ozgu
 * sorular. Sablon doldurmak yerine ayirt edici metin yazmanin sebebi bu —
 * sekiz sayfaya ayni paragrafi kopyalamak ince icerik sorununu cozmez,
 * "yinelenen icerik" sorununa cevirir.
 *
 * ⚠️ ICERIK KURALI: burada YALNIZCA dogrulanabilir bilgi var. Sehirlerin
 * sanayi yapisi kamuya acik bilgidir. Firmanin o sehirlerde OFISI oldugu
 * iddia EDILMIYOR — merkez Beylikduzu'nde, hizmet Turkiye geneli yerinde
 * veriliyor. Mevzuat atiflari sitenin genelinde kullanilan 6331 sayili Kanun
 * ve Is Ekipmanlari Yonetmeligi ile sinirli tutuldu.
 * (bkz. hafiza: "Yetkisiz hizmet iddiasi yok", "Mevzuat yazisi once arastir")
 *
 * Desen `lib/ekipman-icerik.ts` ile ayni.
 */
export type BolgeIcerik = {
  /** Sayfanin ust bolumunde, H1'in hemen altinda duran giris */
  lead: string;
  /** Ana govde — H2 basliklariyla */
  bodyHtml: string;
  faq: { q: string; a: string }[];
};

const ORTAK_SUREC = `
<h2>Kontrol Süreci Nasıl İşliyor?</h2>
<p>Süreç, işletmenizdeki ekipmanların listelenmesiyle başlar. Ekipman türü ve
adedi belirlendikten sonra kontrol takvimi çıkarılır ve saha randevusu
planlanır. Kontrol günü mühendisimiz ekipmanların kimlik bilgilerini,
imalatçı etiketlerini ve varsa önceki raporları inceler; ardından ilgili
standardın gerektirdiği ölçüm ve testleri uygular.</p>
<p>Kontrol tamamlandığında rapor hazırlanır. Raporda ekipmanın kimlik
bilgileri, uygulanan kontrol kriterleri, her kontrol noktasının uygunluk
durumu, varsa uygunsuzluklar ve bir sonraki muayene tarihi yer alır.
Raporların işyerinde saklanması ve denetimlerde sunulması işverenin yasal
yükümlülüğüdür.</p>
`;

const ORTAK_DAYANAK = `
<h2>Yasal Dayanak</h2>
<p>Periyodik kontroller, 6331 sayılı İş Sağlığı ve Güvenliği Kanunu ile
İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği
kapsamında yürütülür. Yönetmelikte veya ilgili standartta aksi
belirtilmedikçe kontroller yılda en az bir kez yapılır; bazı ekipmanlarda
süre daha kısadır. Ekipman bazında yasal süreleri
<a href="/periyodik-kontrol-sureleri">periyodik kontrol süreleri tablosundan</a>
inceleyebilir, kendi ekipmanınız için
<a href="/hesapla">süre hesaplama aracını</a> kullanabilirsiniz.</p>
`;

export const BOLGE_ICERIK: Record<string, BolgeIcerik> = {
  istanbul: {
    lead: "İstanbul, Türkiye'nin hem en yoğun sanayi hem de en büyük lojistik merkezi. Bu yoğunluk, periyodik kontrol ihtiyacını da çeşitlendiriyor: aynı ilçede bir tekstil atölyesinin kompresörü ile bir lojistik merkezinin forklift filosu yan yana kontrol bekliyor.",
    bodyHtml: `
<h2>İstanbul'da Hangi Ekipmanlar Öne Çıkıyor?</h2>
<p>İstanbul'un sanayisi tek bir sektöre yaslanmadığı için kontrol talebi de
geniş bir yelpazeye yayılıyor. İkitelli, Dudullu ve Beylikdüzü hattındaki
imalat işletmelerinde <a href="/ekipman/basincli-kaplar">basınçlı kaplar</a>,
kompresörler ve <a href="/ekipman/makina-ve-tezgah">makine tezgâhları</a>;
Tuzla ve çevresindeki tersane bölgesinde kaldırma ekipmanları ve vinçler;
Hadımköy–Çatalca aksındaki depolama tesislerinde ise
<a href="/ekipman/forklift">forkliftler</a> ve
<a href="/ekipman/raf-sistemleri">raf sistemleri</a> ağırlıkta.</p>
<p>Plaza ve AVM yoğunluğu nedeniyle İstanbul, yangın tesisatı ve algılama
sistemleri kontrollerinin de en çok talep edildiği il. Yüksek katlı
binalarda sprinkler, yangın pompası ve algılama panelinin birlikte
değerlendirilmesi gerekiyor.</p>

<h2>Trafik ve Randevu Planlaması</h2>
<p>İstanbul'da kontrolün en zorlayıcı tarafı teknik değil, lojistik. Aynı gün
içinde Anadolu ve Avrupa yakasında iki ayrı saha ziyareti planlamak
çoğu zaman verimli olmuyor. Bu nedenle randevuları yaka ve ilçe bazında
kümeleyerek planlıyoruz; çok lokasyonlu işletmelerde kontroller tek bir
program altında toplanıyor.</p>
<p>Vardiyalı çalışan tesislerde ekipmanın durdurulması gereken testler
(hidrostatik test, yük testi gibi) üretimi aksatmayacak saatlere alınabiliyor.
Randevu alırken vardiya düzeninizi belirtmeniz planlamayı kolaylaştırır.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "İstanbul'un her ilçesine geliyor musunuz?", a: "Evet. Merkezimiz Beylikdüzü'nde; İstanbul'un tüm ilçelerinde yerinde kontrol yapıyoruz. Randevular ilçe ve yaka bazında kümelenerek planlanıyor." },
      { q: "Birden fazla şubem var, hepsi tek raporda olur mu?", a: "Kontroller lokasyon bazında yapılır ve her ekipman için ayrı rapor düzenlenir; ancak planlama ve teklif tek program altında toplanır, tek muhatapla ilerlersiniz." },
      { q: "Kontrol sırasında üretim durur mu?", a: "Çoğu kontrol üretimi durdurmadan yapılır. Yalnızca hidrostatik test ve yük testi gibi ekipmanın devreden çıkmasını gerektiren işlemler için kısa süreli durdurma gerekir; bunlar önceden planlanır." },
      { q: "Ne kadar sürede randevu alabilirim?", a: "Ekipman listenizi ilettikten sonra kapsam ve süre aynı gün değerlendirilir, uygun randevu tarihi paylaşılır." },
    ],
  },

  beylikduzu: {
    lead: "Beylikdüzü, merkez ofisimizin bulunduğu ilçe. Organize sanayi bölgesi, imalat atölyeleri ve depolama tesislerinin yoğunlaştığı bir hat olduğu için buradaki işletmelere en hızlı dönüş yapabildiğimiz bölge.",
    bodyHtml: `
<h2>Beylikdüzü ve Çevresindeki Sanayi Yapısı</h2>
<p>Beylikdüzü Organize Sanayi Bölgesi ve çevresindeki küçük ölçekli imalat
işletmeleri; metal işleme, plastik enjeksiyon, ambalaj ve mobilya
üretiminde yoğunlaşıyor. Bu yapı, kontrol taleplerini de belirliyor:
kompresör ve hava tankları, presler,
<a href="/ekipman/makina-ve-tezgah">makine tezgâhları</a> ve
<a href="/ekipman/elektrik-tesisat">elektrik tesisatı ölçümleri</a> en sık
istenen kontroller.</p>
<p>E-5 ve TEM aksındaki depolama tesislerinde ise
<a href="/ekipman/raf-sistemleri">raf sistemi</a> ve
<a href="/ekipman/forklift">forklift</a> kontrolleri öne çıkıyor. Raf
sistemlerinde en sık karşılaştığımız uygunsuzluk, forklift çarpması sonucu
eğrilmiş ayakların değiştirilmeden kullanılmaya devam edilmesi.</p>

<h2>Yakın Bölge Avantajı</h2>
<p>Merkezimiz Yakuplu Mahallesi'nde bulunduğu için Beylikdüzü, Esenyurt,
Büyükçekmece ve Avcılar hattındaki işletmelere kısa sürede ulaşabiliyoruz.
Acil durumlarda — örneğin denetim öncesi eksik tespit edilen bir rapor için —
bu yakınlık belirgin bir zaman kazancı sağlıyor.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Beylikdüzü'nde ofisiniz var mı?", a: "Evet. Merkez ofisimiz Yakuplu Mahallesi 65. Sokak No:35, Beylikdüzü / İstanbul adresinde bulunuyor." },
      { q: "Aynı gün kontrol mümkün mü?", a: "Program yoğunluğuna bağlı olarak Beylikdüzü ve çevre ilçelerde kısa vadeli randevu verebiliyoruz. Ekipman listenizi ilettiğinizde en yakın uygun tarihi paylaşırız." },
      { q: "Küçük bir atölyeyim, tek kompresörüm var. Kontrol yaptırmam gerekir mi?", a: "Evet. Ekipman sayısı yükümlülüğü değiştirmez; işyerinde kullanılan basınçlı kaplar, ölçekten bağımsız olarak periyodik kontrole tabidir." },
      { q: "Raf sistemi kontrolü için ne bilgi gerekiyor?", a: "Kaç sıra raf olduğu, her sıradaki çerçeve sayısı ve rafın kaç katlı olduğu yeterli. Bu bilgileri online teklif formunda doğrudan girebilirsiniz." },
    ],
  },

  ankara: {
    lead: "Ankara sanayisi; OSTİM, İvedik ve Sincan organize sanayi bölgeleri etrafında şekilleniyor. Makine imalatı, savunma sanayi tedarik zinciri ve metal işleme ağırlıklı bu yapı, tezgâh ve kaldırma ekipmanı kontrollerini öne çıkarıyor.",
    bodyHtml: `
<h2>Ankara'da Yoğunlaşan Kontroller</h2>
<p>OSTİM ve İvedik'teki işletmelerin büyük bölümü makine imalatı, talaşlı
üretim ve metal şekillendirme yapıyor. Bu tesislerde
<a href="/ekipman/makina-ve-tezgah">tezgâh ve pres kontrolleri</a>,
kompresör ve hava tankı muayeneleri ile
<a href="/ekipman/elektrik-tesisat">elektrik tesisatı ve topraklama
ölçümleri</a> en sık talep edilen hizmetler.</p>
<p>Savunma ve havacılık tedarik zincirinde yer alan işletmelerde ise kontrol
kayıtlarının izlenebilirliği ayrı bir önem taşıyor. Ana yüklenici
denetimlerinde periyodik kontrol raporları düzenli olarak isteniyor; bu
nedenle rapor tarihlerinin takibi ve arşivlenmesi kritik.</p>

<h2>Vinç ve Kaldırma Ekipmanları</h2>
<p>Ağır parça işleyen atölyelerde monoray vinç ve kren kullanımı yaygın.
<a href="/ekipman/monoray-vinc">Vinç periyodik kontrollerinde</a> yük testi,
fren performansı, halat ve zincir durumu ile limit switch'lerin çalışması
değerlendiriliyor. Halatlarda kopuk tel sayısı ve deformasyon, kullanımdan
çıkarma kriterlerine göre ölçülüyor.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Ankara'ya İstanbul'dan mı geliyorsunuz?", a: "Evet, saha ekiplerimiz planlı program dahilinde Ankara'ya gidiyor. Bu nedenle randevular önceden planlanıyor; ekipman listenizi erken iletmeniz uygun tarih bulmayı kolaylaştırır." },
      { q: "OSTİM'de birkaç işletme birlikte talep etsek avantaj olur mu?", a: "Evet. Aynı bölgede aynı tarihe planlanan kontroller saha planlamasını verimli hale getirir; bunu teklif aşamasında değerlendiriyoruz." },
      { q: "Vinç kontrolünde yük testi zorunlu mu?", a: "İlgili standartların öngördüğü durumlarda yük testi uygulanır. Test için uygun yük ve alan gerektiğinden, kontrol öncesinde hazırlık yapılması süreci hızlandırır." },
      { q: "Rapor ne kadar sürede geliyor?", a: "Saha kontrolü tamamlandıktan sonra rapor hazırlanır ve e-imzalı olarak iletilir. Süre ekipman sayısına göre değişir; teklif aşamasında net tarih verilir." },
    ],
  },

  izmir: {
    lead: "İzmir; liman faaliyetleri, petrokimya, gıda ve tekstil üretiminin bir arada bulunduğu bir sanayi merkezi. Aliağa, Kemalpaşa ve Atatürk Organize Sanayi Bölgesi hattı, periyodik kontrol talebinin en yoğun olduğu bölgeler.",
    bodyHtml: `
<h2>İzmir'de Öne Çıkan Kontroller</h2>
<p>Aliağa bölgesindeki petrokimya ve metal tesislerinde
<a href="/ekipman/basincli-kaplar">basınçlı kap</a>, kazan ve tank
kontrolleri ile <a href="/ekipman/patlamadan-korunma">patlamadan korunma
dokümanı</a> çalışmaları öne çıkıyor. Bu tesislerde ekipmanın devreden
çıkarılması zor olduğu için hidrostatik test yerine tahribatsız muayene
yöntemlerinin uygulanabildiği durumlar sık görülüyor.</p>
<p>Kemalpaşa ve Atatürk OSB'deki gıda ve ambalaj üretiminde ise buhar
kazanları, kompresörler ve <a href="/ekipman/havalandirma">havalandırma
sistemleri</a> kontrol kapsamında. Gıda tesislerinde havalandırma ve hijyen
şartları birlikte değerlendirildiği için ortam ölçümleri de sıkça talep
ediliyor.</p>

<h2>Liman ve Depolama Tesisleri</h2>
<p>Liman çevresindeki depolama ve aktarma tesislerinde
<a href="/ekipman/forklift">forklift</a>, transpalet, konveyör ve
<a href="/ekipman/raf-sistemleri">raf sistemleri</a> yoğun kullanılıyor.
Sürekli çalışan bu ekipmanlarda aşınma hızlı olduğundan periyodik kontrol
tarihlerinin kaçırılmaması özellikle önemli.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "İzmir'de hangi bölgelere geliyorsunuz?", a: "İzmir merkez ve çevre ilçeler dahil, planlı saha programı kapsamında tüm bölgeye yerinde kontrol hizmeti veriyoruz." },
      { q: "Tesisimi durduramıyorum, basınçlı kap kontrolü nasıl yapılır?", a: "İşletme şartları gereği hidrostatik test yapılamayan basınçlı kaplarda, standartlarda tanımlı tahribatsız muayene yöntemleri (ultrasonik, manyetik parçacık, penetrant) uygulanabilir. Uygulanan yöntem ve gerekçesi raporda belirtilir." },
      { q: "Patlamadan korunma dokümanı da hazırlıyor musunuz?", a: "Evet. Patlayıcı ortam oluşabilecek tesislerde bölge sınıflandırması ve doküman hazırlığı hizmetimiz kapsamındadır." },
      { q: "Ortam ölçümleri periyodik kontrolle birlikte yapılabilir mi?", a: "Evet, aynı saha ziyaretinde planlanabilir. Teklif aşamasında birlikte değerlendirilir." },
    ],
  },

  kocaeli: {
    lead: "Kocaeli, Türkiye'nin en ağır sanayi yoğunluğuna sahip illerinden biri. Gebze, Dilovası ve İzmit hattındaki petrokimya, otomotiv ve metal tesisleri; hem ekipman çeşitliliği hem de risk düzeyi bakımından en kapsamlı kontrol programlarını gerektiriyor.",
    bodyHtml: `
<h2>Ağır Sanayide Kontrol Kapsamı</h2>
<p>Kocaeli'deki tesislerde kontrol listesi genellikle uzun oluyor: buhar
kazanları, proses tankları, kompresörler,
<a href="/ekipman/basincli-kaplar">basınçlı kaplar</a>, köprülü vinçler,
<a href="/ekipman/forklift">forkliftler</a>,
<a href="/ekipman/elektrik-tesisat">elektrik tesisatı</a> ve
<a href="/ekipman/yangin-tesisati">yangın tesisatı</a> aynı program içinde
yer alıyor.</p>
<p>Petrokimya ve kimya tesislerinde ayrıca patlayıcı ortam yönetimi öne
çıkıyor. <a href="/ekipman/patlamadan-korunma">Patlamadan korunma
dokümanı</a> ve bölge (zone) sınıflandırması, elektrik ekipmanlarının
seçimini doğrudan etkilediği için elektrik kontrolleriyle birlikte
değerlendirilmesi gerekiyor.</p>

<h2>Liman ve Lojistik Tesisleri</h2>
<p>Körfez çevresindeki liman ve aktarma tesislerinde kaldırma ekipmanları
kesintisiz çalışıyor. Bu yoğunlukta halat, zincir, sapan ve kaldırma
aksesuarlarının kontrolü ayrı bir başlık; kullanımdan çıkarma kriterlerinin
düzenli uygulanması iş kazası riskini belirgin biçimde azaltıyor.</p>

<h2>Çok Ekipmanlı Tesislerde Planlama</h2>
<p>Yüzlerce ekipmanı olan tesislerde kontrolü tek seferde tamamlamak yerine
ekipman gruplarına bölmek daha verimli oluyor. Böylece üretim aksamıyor ve
kontrol tarihleri yıla yayılarak yönetilebilir hale geliyor. Ekipman
listenizi ilettiğinizde bu programı birlikte çıkarıyoruz.</p>
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Yüzlerce ekipmanımız var, süreç nasıl yönetiliyor?", a: "Ekipman listesi çıkarılıp gruplara bölünür ve kontroller yıla yayılarak planlanır. Böylece üretim aksamaz ve tarih takibi yönetilebilir olur." },
      { q: "Patlayıcı ortamı olan bölümlerde kontrol yapılabiliyor mu?", a: "Evet. Bu bölümlerde çalışma izni prosedürlerinize uyulur ve ekipman seçimi bölge sınıflandırmasına göre değerlendirilir. Patlamadan korunma dokümanı çalışması da hizmet kapsamımızdadır." },
      { q: "Sapan ve kaldırma aksesuarları da kontrole tabi mi?", a: "Evet. Halat, zincir, sapan ve kaldırma aksesuarları periyodik kontrol kapsamındadır ve kullanımdan çıkarma kriterlerine göre değerlendirilir." },
      { q: "Ana yüklenici denetimlerinde raporlar yeterli olur mu?", a: "Raporlarımız ekipman kimlik bilgilerini, uygulanan kriterleri, uygunluk durumunu ve sonraki muayene tarihini içerir; denetimlerde sunulmak üzere hazırlanır." },
    ],
  },

  bursa: {
    lead: "Bursa sanayisi otomotiv yan sanayi ve tekstil üretimi etrafında şekilleniyor. Nilüfer, DOSAB ve HOSAB hattındaki tesislerde pres, tezgâh ve kaldırma ekipmanı kontrolleri ile buhar tesisatı muayeneleri öne çıkıyor.",
    bodyHtml: `
<h2>Otomotiv Yan Sanayide Kontrol</h2>
<p>Otomotiv tedarik zincirindeki işletmelerde
<a href="/ekipman/hidrolik-pres">hidrolik ve eksantrik presler</a>,
kaynak makineleri, <a href="/ekipman/makina-ve-tezgah">talaşlı imalat
tezgâhları</a> ve kaldırma ekipmanları yoğun kullanılıyor. Preslerde çift el
kumanda, koruyucu ve acil stop tertibatlarının çalışması kontrolün en kritik
bölümü; bu tertibatların devre dışı bırakılması sahada en sık rastladığımız
ciddi uygunsuzluk.</p>
<p>Ana sanayi denetimlerinde periyodik kontrol raporlarının güncel olması
şart koşulduğu için, bu tesislerde kontrol takviminin aksamadan
yürütülmesi ayrıca önem taşıyor.</p>

<h2>Tekstil ve Boyahane Tesisleri</h2>
<p>Tekstil üretiminde buhar kullanımı yaygın olduğundan buhar kazanları,
kızgın yağ kazanları ve basınçlı kaplar kontrol kapsamının merkezinde.
Boyahanelerde ayrıca <a href="/ekipman/havalandirma">havalandırma ve lokal
egzoz sistemleri</a> ile ortam ölçümleri talep ediliyor; kimyasal buhar ve
nem yükü nedeniyle bu ölçümler çalışan sağlığı açısından belirleyici.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Preste hangi güvenlik tertibatları kontrol ediliyor?", a: "Çift el kumanda, koruyucular, acil stop, fren performansı ve ışık bariyeri gibi tertibatların işlevselliği test edilir. Devre dışı bırakılmış koruyucu, uygunsuzluk olarak raporlanır." },
      { q: "Buhar kazanı kontrolü üretimi ne kadar durdurur?", a: "Hidrostatik test gerektiren durumlarda kazanın soğuması ve devreden çıkması gerekir. Süre kazan kapasitesine göre değişir; planlama sırasında birlikte belirlenir." },
      { q: "Boyahanede ortam ölçümü de yapıyor musunuz?", a: "Evet. İş hijyeni ve ortam ölçümleri hizmet kapsamımızdadır ve periyodik kontrolle aynı saha ziyaretinde planlanabilir." },
      { q: "Ana sanayi denetimi için hangi belgeler isteniyor?", a: "Genellikle güncel periyodik kontrol raporları ve muayene kuruluşunun akreditasyon bilgisi istenir. Raporlarımız bu bilgileri içerir." },
    ],
  },

  tekirdag: {
    lead: "Tekirdağ; Çerkezköy ve Çorlu organize sanayi bölgeleriyle Trakya'nın üretim merkezi. Tekstil, kimya, ambalaj ve gıda tesislerinin yoğunlaştığı bu hatta buhar tesisatı ve basınçlı kap kontrolleri belirgin şekilde öne çıkıyor.",
    bodyHtml: `
<h2>Çerkezköy ve Çorlu Hattında Kontrol Talebi</h2>
<p>Bölgedeki tekstil ve kimya tesislerinde buhar kazanları, kızgın yağ
kazanları, <a href="/ekipman/basincli-kaplar">basınçlı kaplar</a> ve
kompresörler kontrol kapsamının başında geliyor. Kimya tesislerinde ayrıca
proses tankları ve depolama kapları değerlendiriliyor.</p>
<p>Ambalaj ve gıda üretiminde ise <a href="/ekipman/makina-ve-tezgah">üretim
hattı makineleri</a>, <a href="/ekipman/forklift">forkliftler</a> ve
<a href="/ekipman/raf-sistemleri">raf sistemleri</a> öne çıkıyor. Depolama
alanı geniş olan tesislerde raf sistemlerinin hasar sınıflandırması düzenli
yapılmadığında, tek bir eğrilmiş ayak tüm sıranın taşıma kapasitesini
düşürebiliyor.</p>

<h2>Yangın Güvenliği</h2>
<p>Kimya ve tekstil tesislerinde yangın yükü yüksek olduğundan
<a href="/ekipman/yangin-tesisati">yangın tesisatı</a> ve
<a href="/ekipman/yangin-algilama">algılama sistemleri</a> kontrolleri
kritik. Bu kontrollerde teklif hazırlayabilmek için binanın m² bilgisi, kat
sayısı ve dedektör adedi gerekiyor; bu bilgileri
<a href="/teklif">online teklif formunda</a> doğrudan girebilirsiniz.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Çerkezköy ve Çorlu'ya düzenli geliyor musunuz?", a: "Evet, Trakya bölgesi planlı saha programımız içinde yer alıyor. Ekipman listenizi ilettiğinizde en yakın uygun tarihi paylaşırız." },
      { q: "Kızgın yağ kazanı kontrolü nasıl yapılıyor?", a: "Kazanın kimlik bilgileri ve önceki raporları incelendikten sonra ilgili standardın öngördüğü test ve muayeneler uygulanır. Hidrostatik test yapılamayan durumlarda tahribatsız muayene yöntemleri değerlendirilir." },
      { q: "Yangın tesisatı teklifi için hangi bilgiler gerekiyor?", a: "Binanın m² bilgisi, kat sayısı, yangın dolabı adedi ve sprinkler sisteminin bulunup bulunmadığı yeterli. Bu alanlar teklif formunda yer alıyor." },
      { q: "Raf sistemi hasarlıysa ne yapılıyor?", a: "Hasar seviyesine göre sınıflandırma yapılır. Belirli seviyenin üzerindeki hasarda rafın yükten arındırılması ve hasarlı elemanın değiştirilmesi gerekir; bu durum raporda belirtilir." },
    ],
  },

  "turkiye-geneli": {
    lead: "Merkezimiz İstanbul Beylikdüzü'nde; hizmeti ise planlı saha programıyla Türkiye genelinde veriyoruz. Şehir listesinde yer almayan bir bölgedeyseniz de ekipman listenizi iletebilirsiniz — kapsamı ve takvimi birlikte belirleriz.",
    bodyHtml: `
<h2>Türkiye Geneli Nasıl Planlanıyor?</h2>
<p>Saha ekiplerimiz bölge bazlı program dahilinde çalışıyor. Aynı bölgeden
gelen talepler bir araya getirilerek tek bir saha ziyaretinde
tamamlanıyor; bu hem planlamayı verimli kılıyor hem de tek işletmenin
üzerine binen ulaşım yükünü azaltıyor.</p>
<p>Bu nedenle uzak bölgelerdeki taleplerin erken iletilmesi önemli. Ekipman
listenizi gönderdiğinizde bölgenizdeki en yakın program tarihini
paylaşıyoruz.</p>

<h2>Çok Lokasyonlu İşletmeler</h2>
<p>Farklı illerde şubesi olan işletmelerde kontroller tek program altında
toplanıyor. Her lokasyon için ayrı rapor düzenleniyor, ancak planlama,
teklif ve takip tek muhatapla yürüyor. Bu, özellikle zincir mağaza, depo
ağı ve şantiye işletmelerinde tarih takibini belirgin şekilde
kolaylaştırıyor.</p>

<h2>Hangi Ekipmanlar Kapsamda?</h2>
<p>Kaldırma ve iletme ekipmanlarından
<a href="/ekipman/basincli-kaplar">basınçlı kaplara</a>, makine
tezgâhlarından <a href="/ekipman/elektrik-tesisat">elektrik tesisatı ve
topraklama ölçümlerine</a>, yangın sistemlerinden
<a href="/ekipman/raf-sistemleri">raf sistemlerine</a> kadar geniş bir
kapsamda hizmet veriyoruz. Tüm liste için
<a href="/ekipman">ekipman sayfamıza</a> göz atabilirsiniz.</p>
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Listede olmayan bir şehirdeyim, hizmet alabilir miyim?", a: "Evet. Türkiye genelinde planlı saha programıyla hizmet veriyoruz. Ekipman listenizi ilettiğinizde bölgenizdeki en yakın uygun tarihi paylaşırız." },
      { q: "Uzak bölgelerde ek ulaşım ücreti var mı?", a: "Teklif hazırlanırken kapsam, ekipman sayısı ve lokasyon birlikte değerlendirilir; koşullar teklif aşamasında açıkça belirtilir." },
      { q: "Farklı illerdeki şubelerim için tek teklif alabilir miyim?", a: "Evet. Çok lokasyonlu işletmelerde planlama ve teklif tek program altında toplanır; her lokasyon için ayrı rapor düzenlenir." },
      { q: "Şantiyelerde de kontrol yapıyor musunuz?", a: "Evet. İş makineleri, kaldırma ekipmanları, cephe asansörleri ve elektrik tesisatı şantiye sahalarında da kontrol kapsamındadır." },
    ],
  },
};
