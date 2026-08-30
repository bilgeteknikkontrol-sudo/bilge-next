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
kompresörler ve <a href="/ekipman/makina-tezgah">makine tezgâhları</a>;
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
<a href="/ekipman/makina-tezgah">makine tezgâhları</a> ve
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

  /* ------------------------------------------------------------------ *
   * ISTANBUL ILCELERI
   *
   * ⚠️ NEDEN YALNIZCA SEKIZ ILCE: kullanici "tum Istanbul'da hizmet
   * veriyoruz" dedi, ama 39 ilcenin hepsine sayfa acmak dogru degil.
   * Birbirinin kopyasi ilce sayfalari tam olarak Google'in "kapi sayfasi"
   * (doorway page) sayip yaptirim uyguladigi seydir — rakiplerden
   * teknikperiyodikkontrol.com'un dustugu tuzak. Sayfa yalnizca HAKKINDA
   * AYIRT EDICI SEY YAZILABILEN ilceler icin acildi: gercek bir sanayi
   * kimligi, bilinen bir organize sanayi bolgesi ya da belirgin bir uretim
   * yogunlugu olanlar. Kalan ilceleri /bolge/istanbul sayfasi karsiliyor.
   *
   * ⚠️ Organize sanayi bolgesi adlari dogrulandi (Istanbul'da dokuz OSB var:
   * Beylikduzu, Ikitelli, Dudullu, Anadolu Yakasi, Birlik, Tuzla, Deri,
   * Tuzla Kimya, Biyoteknoloji Ihtisas). Dogrulanmayan hicbir OSB adi
   * yazilmadi. Firmanin bu ilcelerde OFISI oldugu iddia EDILMIYOR — merkez
   * Beylikduzu'nde, hizmet yerinde veriliyor.
   * ------------------------------------------------------------------ */

  esenyurt: {
    lead: "Esenyurt, İstanbul'un depolama ve dağıtım merkezi. TEM ve E-5 aksındaki antrepolar, soğuk hava depoları ve tekstil–gıda üretim tesisleri, ilçedeki kontrol taleplerinin büyük bölümünü oluşturuyor.",
    bodyHtml: `
<h2>Esenyurt'ta Hangi Ekipmanlar Öne Çıkıyor?</h2>
<p>Depolama ağırlıklı bir ilçe olduğu için Esenyurt'ta en sık talep edilen
kontroller <a href="/ekipman/raf-sistemleri">raf sistemleri</a>,
<a href="/ekipman/forklift">forklift</a> ve
<a href="/ekipman/transpalet">transpalet</a> muayeneleri. Yüksek irtifalı
depo raflarında, çerçeve ayaklarının forklift çarpması sonucu eğilmesi en sık
karşılaştığımız uygunsuzluk; bu hasar gözle fark edilmeyecek kadar küçük
göründüğünde bile taşıma kapasitesini ciddi biçimde düşürüyor.</p>
<p>Soğuk hava depolarında <a href="/ekipman/kompresor-hava-tanki">kompresör ve
hava tankı</a> kontrolleri, üretim tesislerinde ise
<a href="/ekipman/elektrik-tesisat">elektrik tesisatı ölçümleri</a> ve
<a href="/ekipman/yangin-tesisati">yangın tesisatı</a> muayenesi ön planda.
Depo yapılarında yangın yükünün yüksek olması, sprinkler ve yangın pompası
kontrollerini de kritik hale getiriyor.</p>

<h2>Merkezimize En Yakın İkinci İlçe</h2>
<p>Merkez ofisimiz Beylikdüzü Yakuplu'da bulunuyor; Esenyurt sınır komşusu.
Bu yakınlık, özellikle denetim öncesi eksik fark edilen raporlar veya yeni
kurulan bir hattın devreye alma kontrolü gibi acil taleplerde kısa vadeli
randevu verebilmemizi sağlıyor.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Esenyurt'taki depoma kaç kişilik ekip geliyor?", a: "Ekipman çeşidine göre değişir. Yalnızca raf ve forklift kontrolü için tek mühendis yeterli olur; elektrik ölçümleri ve yangın tesisatı da varsa farklı branşlardan mühendisler görevlendirilir. Ekipman listenizi ilettiğinizde kaç kişi geleceğini ve süreyi baştan bildiririz." },
      { q: "Depo raflarının kontrolü için depoyu boşaltmam gerekir mi?", a: "Hayır. Raf sistemi kontrolü yüklü durumda yapılır; zaten rafın gerçek çalışma koşulunda değerlendirilmesi gerekir. Yalnızca kontrol sırasında forklift trafiğinin geçici olarak durdurulması istenir." },
      { q: "Kiraladığım depoda ekipmanlar mal sahibine ait, kontrolü kim yaptırır?", a: "Yükümlülük, ekipmanı çalıştıran işverendedir. Mülkiyet kimde olursa olsun, işyerinde kullanılan ekipmanın periyodik kontrolünü yaptırmak ve raporu işyerinde bulundurmak sizin sorumluluğunuzdadır." },
      { q: "Aynı gün rapor alabilir miyim?", a: "Saha kontrolü tamamlandıktan sonra rapor hazırlanıp e-imzalanır. Standart teslim süresi birkaç iş günüdür; denetim tarihi yaklaşmışsa bunu baştan belirtmenizi rica ederiz, önceliklendirebiliyoruz." },
    ],
  },

  basaksehir: {
    lead: "Başakşehir, İkitelli Organize Sanayi Bölgesi'ni barındırıyor — Türkiye'nin en büyük küçük sanayi kompleksi. Ahşap işleme, matbaa, plastik ve metal imalatının bir arada olduğu bu yapı, tezgâh ve pres kontrollerini öne çıkarıyor.",
    bodyHtml: `
<h2>İkitelli OSB'nin Ekipman Profili</h2>
<p>İkitelli'de binlerce küçük ve orta ölçekli atölye yan yana çalışıyor.
Ağaç işleme atölyelerinde <a href="/ekipman/dairesel-testere">dairesel
testere</a>, <a href="/ekipman/serit-testere">şerit testere</a> ve
<a href="/ekipman/planya-ve-kalinlik-makinesi">planya–kalınlık makinesi</a>;
metal işleme atölyelerinde <a href="/ekipman/torna-tezgahi">torna</a>,
<a href="/ekipman/freze-tezgahi">freze</a> ve
<a href="/ekipman/eksantrik-pres">eksantrik pres</a> en sık kontrol edilen
ekipmanlar.</p>
<p>Küçük atölyelerde en sık gördüğümüz uygunsuzluk, koruyucuların üretimi
yavaşlattığı gerekçesiyle sökülmüş olması — özellikle preslerde ve dairesel
testerelerde. Bu, hem periyodik kontrolde uygunsuzluk sebebi hem de iş
kazalarının en yaygın kaynağı. Konuyu ayrıntılı ele aldığımız
<a href="/yazilar/preslerde-is-guvenligi">preslerde iş güvenliği</a> yazımızı
inceleyebilirsiniz.</p>

<h2>Küçük İşletme, Aynı Yükümlülük</h2>
<p>İkitelli'deki işletmelerin çoğu az sayıda personelle çalışıyor ve sık
karşılaştığımız soru "bu ölçekte kontrol gerekir mi" oluyor. Gerekiyor:
periyodik kontrol yükümlülüğü işletme büyüklüğüne değil, kullanılan ekipmana
bağlı. Tek bir <a href="/ekipman/kompresor-hava-tanki">kompresör</a> ya da tek
bir <a href="/ekipman/hidrolik-pres">pres</a> de kapsama giriyor.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "İkitelli'de birden fazla atölye aynı anda kontrol ettirebilir mi?", a: "Evet ve bunu öneriyoruz. Aynı blokta veya yakın adaslarda birden çok işletme aynı güne planlandığında saha süresi verimli kullanılır. Komşu işletmelerle birlikte talep oluşturabilirsiniz." },
      { q: "Atölyemde sadece torna ve kompresör var, ikisi için ayrı ayrı mı ücret alınıyor?", a: "Fiyatlandırma ekipman türü ve adedine göre yapılır. İki ekipman için tek saha ziyareti yeterli olduğundan toplam maliyet, ayrı ayrı çağırmaya göre belirgin şekilde düşük olur. Ekipman listenizi online teklif formundan iletebilirsiniz." },
      { q: "Ahşap işleme makinelerinde neye bakılıyor?", a: "Koruyucuların varlığı ve işlevselliği, acil durdurma tertibatı, testere gerginliği ve bıçak durumu, toz emiş bağlantısı ve elektriksel güvenlik başlıca kontrol noktalarıdır. Koruyucusu sökülmüş bir makine uygunsuzluk olarak raporlanır." },
      { q: "Kiracıyım, iş yerini devrettiğimde rapor geçerli kalır mı?", a: "Rapor ekipmana ve o ekipmanı çalıştıran işverene düzenlenir. İşletme devrinde yeni işveren kendi sorumluluğu altında kontrolü yeniletmelidir; ekipman yer değiştirmişse zaten yeniden kontrol gerekir." },
    ],
  },

  arnavutkoy: {
    lead: "Arnavutköy ve Hadımköy hattı, İstanbul'un büyük ölçekli üretim ve antrepo bölgesi. TEM, Kuzey Marmara Otoyolu ve İstanbul Havalimanı bağlantıları, bölgeyi lojistik tesisleri için cazip kılıyor.",
    bodyHtml: `
<h2>Hadımköy Hattındaki Tesis Yapısı</h2>
<p>Bölgede tekstil, plastik, ambalaj, makine ve otomotiv yan sanayi üreticileri
ile büyük ölçekli antrepolar bir arada. Bu karma yapı, tek bir tesiste birden
çok ekipman ailesinin kontrol edilmesi anlamına geliyor: üretim hattında
<a href="/ekipman/makina-tezgah">tezgâhlar</a> ve
<a href="/ekipman/kompresor-hava-tanki">basınçlı hava sistemi</a>, depo
tarafında <a href="/ekipman/raf-sistemleri">raf sistemleri</a> ve
<a href="/ekipman/forklift">forkliftler</a>, kazan dairesinde
<a href="/ekipman/buhar-kazani">buhar kazanı</a>.</p>
<p>Gümrüklü ve yanıcı madde antrepolarında
<a href="/ekipman/yangin-tesisati">yangın tesisatı</a>,
<a href="/ekipman/sprinkler-yagmurlama-sistemi">sprinkler sistemi</a> ve
<a href="/ekipman/yangin-pompasi">yangın pompası</a> kontrolleri ayrı bir
önem taşıyor. Yangın pompalarında haftalık çalıştırma testinin kayıt altına
alınmaması, denetimlerde sık karşılaşılan bir eksiklik —
<a href="/yazilar/yangin-pompasi-haftalik-test">bu testin nasıl yapılması
gerektiğini</a> ayrıca anlattık.</p>

<h2>Büyük Tesiste Kontrol Planlaması</h2>
<p>Yüzlerce ekipmanı olan tesislerde kontrolleri tek güne sıkıştırmak yerine
ekipman ailelerine göre bölmek daha verimli oluyor. Üretimin durmasını
gerektiren testleri planlı duruşlara denk getirmek, hem hattı aksatmıyor hem
de kontrolün eksiksiz yapılmasına imkân veriyor. Ekipman envanterinizi
ilettiğinizde böyle bir takvim öneriyoruz.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Tesisimizde 200'den fazla ekipman var, kontrol ne kadar sürer?", a: "Ekipman dağılımına bağlı. Bu ölçekte genellikle birkaç güne yayılan bir takvim çıkarıyor, farklı branşlardan mühendisleri paralel çalıştırıyoruz. Envanterinizi ilettiğinizde net gün sayısını baştan paylaşırız." },
      { q: "Üretimi durdurmadan kontrol yapılabilir mi?", a: "Çoğu kontrol üretim sırasında yapılabilir. Ancak yük testi gerektiren kaldırma ekipmanları ve bazı basınçlı kap muayeneleri ekipmanın devre dışı olmasını gerektirir. Bu kalemleri planlı duruşlarınıza denk getirecek şekilde programlıyoruz." },
      { q: "Antrepomuzda yanıcı madde var, ek bir kontrol gerekiyor mu?", a: "Yanıcı ve parlayıcı madde bulunan alanlarda patlayıcı ortam değerlendirmesi ve buna bağlı ekipman uygunluğu ayrı bir konudur. Patlamadan korunma kapsamındaki incelemeler için ayrı bir hizmet kalemimiz bulunuyor." },
      { q: "İstanbul Havalimanı çevresindeki tesislere de geliyor musunuz?", a: "Evet. Arnavutköy, Hadımköy ve havalimanı çevresindeki tüm sanayi ve lojistik tesislerine yerinde hizmet veriyoruz." },
    ],
  },

  avcilar: {
    lead: "Avcılar, Ambarlı Limanı'na komşu olması nedeniyle elleçleme ve depolama ağırlıklı bir ilçe. Kaldırma ekipmanları ve kaldırma aksesuarları, buradaki kontrol taleplerinin merkezinde.",
    bodyHtml: `
<h2>Liman Çevresinde Kaldırma Ekipmanları</h2>
<p>Ambarlı hattındaki depolama ve elleçleme tesislerinde
<a href="/ekipman/kaldirma-iletme">kaldırma ve iletme ekipmanları</a>,
<a href="/ekipman/forklift">forklift</a>,
<a href="/ekipman/mobil-vinc">mobil vinç</a> ve
<a href="/ekipman/sapan-ve-kaldirma-aksesuarlari">sapan ile kaldırma
aksesuarları</a> yoğun biçimde kullanılıyor. Bu ekipmanlarda kontrol sıklığı
kadar kullanım şiddeti de belirleyici: sürekli yük altında çalışan bir sapan,
takvim dolmadan da kullanım dışı bırakılmayı gerektirebilir.</p>
<p>Kaldırma aksesuarlarında en sık gördüğümüz uygunsuzluk, çelik halatlarda
kopan tel sayısının sınırı aşmasına rağmen kullanıma devam edilmesi.
<a href="/yazilar/celik-halat-ne-zaman-degistirilir">Çelik halatın ne zaman
değiştirilmesi gerektiğini</a> ölçütleriyle birlikte anlattık.
Yük testi gerektiren kontroller için
<a href="/yazilar/yuk-testi-nedir">yük testi nedir</a> yazımız da yardımcı
olabilir.</p>

<h2>Üniversite ve Kurumsal Tesisler</h2>
<p>İlçede sanayi dışında büyük kurumsal binalar ve eğitim tesisleri de var.
Bu yapılarda <a href="/ekipman/elektrik-tesisat">elektrik tesisatı</a>,
<a href="/ekipman/topraklama-olcumu">topraklama ölçümü</a>,
<a href="/ekipman/yangin-algilama">yangın algılama sistemleri</a> ve
<a href="/ekipman/havalandirma">havalandırma tesisatı</a> kontrolleri
gündeme geliyor.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Sapan ve zincir takımlarının kontrolü ayrı ayrı mı yapılıyor?", a: "Her kaldırma aksesuarı ayrı bir ekipman olarak değerlendirilir ve kimliklendirilir. Ancak saha ziyareti tek seferde yapılır; adet arttıkça birim maliyet düşer. Takım sayısını teklif formunda belirtmeniz yeterli." },
      { q: "Vinçte yük testi için ağırlık siz mi getiriyorsunuz?", a: "Test yükünün sağlanması genellikle işletmeye aittir; sahada mevcut yükler ya da su torbası benzeri çözümler kullanılabilir. Ekipmanın kapasitesini bildirdiğinizde hangi yöntemin uygun olacağını birlikte planlarız." },
      { q: "Topraklama ölçümü ne sıklıkta yapılmalı?", a: "İşyerlerinde topraklama tesisatı ölçümleri yılda bir kez yapılır. Ölçüm sonucunda bulunması gereken direnç değeri tesisin türüne göre değişir; bu konuyu ayrı bir yazıda ele aldık." },
      { q: "Ambarlı'daki tesisimize hafta sonu gelebilir misiniz?", a: "Üretim veya elleçmenin durmadığı tesislerde hafta sonu ve mesai dışı planlama yapabiliyoruz. Talebinizi iletirken bunu belirtmeniz yeterli." },
    ],
  },

  tuzla: {
    lead: "Tuzla, İstanbul'un en yoğun sanayi ilçesi: tersaneler bölgesinin yanı sıra Tuzla Organize Sanayi, Kimya Organize Sanayi, Deri Organize Sanayi ve Birlik Organize Sanayi bölgeleri burada bulunuyor.",
    bodyHtml: `
<h2>Tersane ve Ağır Sanayi Ekipmanları</h2>
<p>Tersanelerde <a href="/ekipman/mobil-vinc">mobil vinç</a>,
<a href="/ekipman/monoray-vinc">monoray vinç ve kren</a>,
<a href="/ekipman/sapan-ve-kaldirma-aksesuarlari">kaldırma aksesuarları</a> ve
<a href="/ekipman/kaynak-makinasi">kaynak makineleri</a> ağır kullanım
altında çalışıyor. Deniz ortamının korozyon etkisi, özellikle çelik halat ve
sapanlarda aşınmayı hızlandırdığı için bu ekipmanlarda kontrol aralığının
takvimle sınırlı tutulmaması gerekiyor.</p>
<p>Kimya ve boya tesislerinde <a href="/ekipman/basincli-kaplar">basınçlı
kaplar</a>, <a href="/ekipman/kizgin-yag-kazani">kızgın yağ kazanları</a> ve
<a href="/ekipman/patlamadan-korunma">patlamadan korunma</a> kapsamındaki
incelemeler öne çıkıyor. Basınçlı kaplarda hidrostatik test gerektiren
durumları <a href="/yazilar/basincli-kap-hidrostatik-test">ayrı bir yazıda</a>
ele aldık.</p>

<h2>Dört OSB, Farklı Kontrol İhtiyacı</h2>
<p>Tuzla'daki organize sanayi bölgeleri farklı sektörlerde ihtisaslaşmış
durumda; bu da kontrol profilini değiştiriyor. Deri sanayinde kimyasal işlem
tankları ve havalandırma, kimya sanayinde patlayıcı ortam ve basınçlı
sistemler, genel imalatta ise
<a href="/ekipman/makina-tezgah">tezgâh</a> ve
<a href="/ekipman/elektrik-tesisat">elektrik tesisatı</a> kontrolleri
belirleyici oluyor.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Tersanede çalışan vinçlerin kontrolü kaç ayda bir?", a: "Kaldırma ve iletme ekipmanlarında kontrol periyodu, imalatçı veya standart aksini belirtmedikçe yılda en az bir kezdir. Ancak deniz ortamı ve ağır kullanım nedeniyle tersane ekipmanlarında ara muayeneler ve kaldırma aksesuarlarının daha sık gözden geçirilmesi önerilir." },
      { q: "Basınçlı kaba hidrostatik test her kontrolde yapılır mı?", a: "Hayır. Hidrostatik test belirli koşullarda gerekir: ekipmanın ilk kullanımı, önemli bir tamir veya değişiklik sonrası ya da ilgili standardın öngördüğü aralıklarla. Rutin periyodik kontrolde öncelik görsel ve fonksiyonel muayenededir." },
      { q: "Patlayıcı ortam olan tesiste kontrol nasıl yapılıyor?", a: "Patlayıcı ortam sınıflandırması yapılmış alanlarda kullanılan ekipmanların bu ortama uygun olması gerekir. Kontrol sırasında ekipmanın sertifikasyonu, koruma sınıfı ve tesisin bölge sınıflandırmasıyla uyumu birlikte değerlendirilir." },
      { q: "Beylikdüzü'nden Tuzla'ya geliyor musunuz?", a: "Evet. Merkezimiz Beylikdüzü'nde olmakla birlikte İstanbul'un iki yakasına da yerinde hizmet veriyoruz. Anadolu yakasındaki tesisler için saha planlamasını günlük programa göre yapıyoruz." },
    ],
  },

  umraniye: {
    lead: "Ümraniye, Dudullu Organize Sanayi Bölgesi'ni barındıran, Anadolu yakasının en yoğun imalat ilçesi. Metal işleme, makine imalatı ve otomotiv yan sanayi ağırlıklı bu yapı tezgâh ve kaldırma kontrollerini öne çıkarıyor.",
    bodyHtml: `
<h2>Dudullu OSB'nin Kontrol Profili</h2>
<p>Dudullu'da talaşlı imalat ve sac işleme yoğun. En sık kontrol ettiğimiz
ekipmanlar <a href="/ekipman/torna-tezgahi">torna tezgâhları</a>,
<a href="/ekipman/freze-tezgahi">freze tezgâhları</a>,
<a href="/ekipman/isleme-merkezi-cnc">CNC işleme merkezleri</a>,
<a href="/ekipman/abkant-pres">abkant presler</a> ve
<a href="/ekipman/giyotin-makas">giyotin makaslar</a>.</p>
<p>Atölye içi malzeme taşımada <a href="/ekipman/monoray-vinc">monoray
vinçler</a> ve <a href="/ekipman/forklift">forkliftler</a>, üretim
altyapısında ise <a href="/ekipman/kompresor-hava-tanki">kompresör ve hava
tankı</a> ile <a href="/ekipman/elektrik-tesisat">elektrik tesisatı</a>
kontrolleri gündemde. Tezgâhlarda en sık gördüğümüz uygunsuzluk, acil
durdurma butonunun işlevini yitirmiş olması — kontrol sırasında mutlaka
fonksiyonel olarak denenir.</p>

<h2>Makine Yerleşimi ve Elektriksel Güvenlik</h2>
<p>Yoğun makine parkı olan atölyelerde yerleşim düzeni ve makineler arası
güvenli mesafe ayrı bir başlık. Ayrıca
<a href="/ekipman/makinalarda-elektriksel-kontrol">makinelerde elektriksel
kontrol</a> ve <a href="/ekipman/topraklama-olcumu">topraklama ölçümü</a>,
tezgâh yoğunluğunun yüksek olduğu bu bölgede sık talep edilen hizmetler
arasında.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "CNC tezgâhında periyodik kontrol neyi kapsıyor?", a: "Koruyucu kapakların ve kapı kilitlerinin işlevi, acil durdurma tertibatı, elektriksel güvenlik, hidrolik ve pnömatik sistemlerin sızdırmazlığı ve güvenlik işaretleri başlıca kontrol noktalarıdır. Tezgâhın işleme hassasiyeti kalibrasyon konusudur, periyodik kontrolün kapsamına girmez." },
      { q: "Atölyemde 30 tezgâh var, hepsi tek raporda mı gösteriliyor?", a: "Her ekipman için ayrı bir muayene kaydı düzenlenir; bunlar tek bir dosyada toplanabilir. Böylece denetimde hem toplu liste hem de ekipman bazında rapor sunabilirsiniz." },
      { q: "Monoray vincin yük testi için hattı durdurmam gerekir mi?", a: "Yük testi sırasında vincin çalışma alanının boşaltılması gerekir. Genellikle kısa süreli bir duruş yeterli olur; hattın tamamının durdurulması gerekmez. Planlamayı sizin vardiya düzeninize göre yapıyoruz." },
      { q: "Kompresör hava tankının kontrolü kaç yılda bir?", a: "Basınçlı kaplarda kontrol periyodu, standart veya imalatçı aksini belirtmedikçe yılda bir kezdir. Ekipmanınıza özel süreyi süre hesaplama aracımızdan görebilirsiniz." },
    ],
  },

  pendik: {
    lead: "Pendik, otomotiv yan sanayi, makine imalatı ve Sabiha Gökçen çevresindeki lojistik tesisleriyle Anadolu yakasının önemli üretim ilçelerinden biri.",
    bodyHtml: `
<h2>Otomotiv Yan Sanayi ve İmalat</h2>
<p>Pendik'teki üretim tesislerinde <a href="/ekipman/hidrolik-pres">hidrolik
presler</a>, <a href="/ekipman/eksantrik-pres">eksantrik presler</a>,
<a href="/ekipman/kaynak-makinasi">kaynak makineleri</a> ve
<a href="/ekipman/punta-tabanca">punta kaynak tabancaları</a> yaygın.
Seri üretim yapan tesislerde preslerin sürekli çalışması, koruyucu
tertibatların ve iki el kumanda sistemlerinin işlevselliğini kritik hale
getiriyor.</p>
<p>Malzeme akışında <a href="/ekipman/konveyor-bantli-iletme">konveyör ve
bantlı iletim sistemleri</a>, <a href="/ekipman/forklift">forklift</a> ve
<a href="/ekipman/monoray-vinc">monoray vinçler</a>; altyapıda ise
<a href="/ekipman/kompresor-hava-tanki">basınçlı hava sistemi</a> ve
<a href="/ekipman/elektrik-tesisat">elektrik tesisatı</a> kontrolleri
gündemde.</p>

<h2>Havalimanı Çevresi Lojistik Tesisleri</h2>
<p>Sabiha Gökçen çevresindeki depo ve dağıtım merkezlerinde
<a href="/ekipman/raf-sistemleri">raf sistemleri</a>,
<a href="/ekipman/transpalet">transpalet</a> ve
<a href="/ekipman/yangin-tesisati">yangın tesisatı</a> kontrolleri öne
çıkıyor. Yüksek raflı depolarda yangın yükü nedeniyle sprinkler sistemlerinin
düzenli kontrolü ayrıca önemli.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Preslerde iki el kumanda sistemi kontrol ediliyor mu?", a: "Evet. İki el kumanda tertibatının senkronizasyonu, kilitlenmesi ve tek elle çalıştırılmaya karşı korunması kontrol noktalarındandır. Bu tertibatın devre dışı bırakılmış olması ciddi bir uygunsuzluktur." },
      { q: "Ana sanayiye tedarikçiyiz, raporlarımız denetimlerde kabul ediliyor mu?", a: "Raporlarımız TÜRKAK akredite (AB-0296-M) A Tipi muayene kuruluşu sıfatıyla düzenlenir ve e-imzalıdır. Hem kamu denetimlerinde hem de ana sanayi tedarikçi denetimlerinde kullanılmak üzere hazırlanır." },
      { q: "Vardiya düzenimiz var, gece kontrol yapılabilir mi?", a: "Kesintisiz çalışan tesislerde vardiya arası veya gece planlaması yapabiliyoruz. Talebinizi iletirken çalışma düzeninizi belirtmeniz yeterli." },
      { q: "Konveyör hattının kontrolü nasıl yapılıyor?", a: "Acil durdurma halatı ve butonlarının işlevi, sıkışma noktalarındaki koruyucular, bant gerginliği, tahrik ünitesi ve elektriksel güvenlik değerlendirilir. Uzun hatlarda acil durdurma erişilebilirliği en sık rastlanan eksikliktir." },
    ],
  },

  buyukcekmece: {
    lead: "Büyükçekmece, E-5 ve TEM aksı boyunca uzanan imalat ve depolama tesisleriyle Beylikdüzü hattının doğal devamı. Ambalaj, gıda ve plastik üretimi ilçedeki kontrol taleplerini şekillendiriyor.",
    bodyHtml: `
<h2>Üretim ve Depolama Bir Arada</h2>
<p>Ambalaj ve plastik üretim tesislerinde
<a href="/ekipman/plastik-enjeksiyon-makinesi">plastik enjeksiyon
makineleri</a>, <a href="/ekipman/kompresor-hava-tanki">kompresör ve hava
tankları</a> ile <a href="/ekipman/kalorifer-kazani">kazan daireleri</a>
kontrol kapsamında. Gıda üretiminde ise
<a href="/ekipman/buhar-kazani">buhar kazanı</a> ve
<a href="/ekipman/isi-degistirici-esanjor">ısı değiştirici</a> muayeneleri
öne çıkıyor.</p>
<p>Depolama tarafında <a href="/ekipman/raf-sistemleri">raf sistemleri</a>,
<a href="/ekipman/forklift">forklift</a> ve
<a href="/ekipman/yangin-dolabi-ve-hidrant">yangın dolabı ve hidrant</a>
kontrolleri talep ediliyor. Kazan dairelerinde en sık karşılaştığımız
eksiklik, emniyet ventilinin ayar mühürünün bozulmuş olması ve havalandırma
menfezlerinin kapatılması — <a href="/yazilar/kazan-dairesi-guvenlik-sartlari">kazan
dairesi güvenlik şartlarını</a> ayrı bir yazıda topladık.</p>

<h2>Merkeze Yakınlık</h2>
<p>Büyükçekmece, merkez ofisimizin bulunduğu Beylikdüzü'ne komşu. Bu hattaki
işletmelere kısa vadede randevu verebiliyor, denetim öncesi acil taleplerde
hızlı dönüş yapabiliyoruz.</p>
${ORTAK_SUREC}
${ORTAK_DAYANAK}
`,
    faq: [
      { q: "Buhar kazanı kontrolünde kazanı soğutmam gerekir mi?", a: "İç muayene gerektiren durumlarda kazanın devre dışı bırakılması ve soğutulması gerekir. Rutin periyodik kontrolde ise emniyet donanımının fonksiyon testi, manometre ve emniyet ventili kontrolü ağırlıklıdır. Kapsamı ekipmanın durumuna göre birlikte belirleriz." },
      { q: "Gıda üretimindeyiz, hijyen kurallarımız var. Ekibiniz uyuyor mu?", a: "Evet. Üretim alanına giriş kurallarınızı önceden bildirdiğinizde gerekli kişisel koruyucu donanım ve hijyen prosedürlerine uygun şekilde saha çalışması yapıyoruz." },
      { q: "Plastik enjeksiyon makinesinde neye bakılıyor?", a: "Kalıp koruma kapaklarının kilitlenmesi, acil durdurma tertibatı, hidrolik sistemin sızdırmazlığı, sıcak yüzey korumaları ve elektriksel güvenlik başlıca kontrol noktalarıdır." },
      { q: "Yangın dolaplarının kontrolü ne sıklıkta yapılır?", a: "Yangın söndürme tesisatı bileşenlerinde kontrol periyodu yılda bir kezdir; bazı bileşenlerde imalatçı daha sık kontrol öngörebilir. Yangın pompalarında ayrıca haftalık çalıştırma testi istenir." },
    ],
  },

  ankara: {
    lead: "Ankara sanayisi; OSTİM, İvedik ve Sincan organize sanayi bölgeleri etrafında şekilleniyor. Makine imalatı, savunma sanayi tedarik zinciri ve metal işleme ağırlıklı bu yapı, tezgâh ve kaldırma ekipmanı kontrollerini öne çıkarıyor.",
    bodyHtml: `
<h2>Ankara'da Yoğunlaşan Kontroller</h2>
<p>OSTİM ve İvedik'teki işletmelerin büyük bölümü makine imalatı, talaşlı
üretim ve metal şekillendirme yapıyor. Bu tesislerde
<a href="/ekipman/makina-tezgah">tezgâh ve pres kontrolleri</a>,
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
kaynak makineleri, <a href="/ekipman/makina-tezgah">talaşlı imalat
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
<p>Ambalaj ve gıda üretiminde ise <a href="/ekipman/makina-tezgah">üretim
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
