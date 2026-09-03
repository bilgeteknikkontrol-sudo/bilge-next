/**
 * Hukuki metinlerin ortak verileri.
 *
 * NOT: Bu metinler, sitenin GERCEKTE isledigi verilere gore yazildi
 * (bkz. app/api/teklif/route.ts, lib/store.ts, app/iletisim harita gomulusu).
 * Veri akisi degisirse — yeni form alani, yeni ucuncu taraf servis, yeni
 * analitik — bu metinler de guncellenmelidir.
 */

/**
 * ⚠️ "SON GUNCELLEME" TARIHI BURADA DEGIL.
 *
 * Burada `SON_GUNCELLEME` diye bir sabit vardi ve HICBIR YERDE
 * KULLANILMIYORDU — degistirilince sayfada hicbir sey degismiyordu (03.09.2026'da
 * olculdu: sabit "3 Eylul" yapildi, sayfa "31 Agustos" demeye devam etti).
 * Yasal bir metinde bu, degistirdigini saniyorken eski tarihi yayinda birakmak
 * demek; bu yuzden sabit kaldirildi.
 *
 * Gercek kaynak: `lib/sayfa-metin.ts` -> `yasal_son_guncelleme` ve o da
 * PANELDEN yonetiliyor. Koddaki deger yalnizca tohum; veritabaninda kayitli
 * bir deger varsa kod degisikligi canliya yansimaz, panelden guncellenmelidir.
 *
 * Metnin ICERIGI her degistiginde tarih de guncellenir. Gecmis:
 * 31.08.2026 barindirma (Vercel -> Hostinger) ve analitik (Vercel Analytics ->
 * GA4) beyanlari · 03.09.2026 teklif formuna fotograf ekleme (gorsel veri
 * kategorisi ve dosyalarin nerede saklandigi).
 */

/** Sitenin fiilen topladigi kisisel veriler. Kaynak: /teklif formu. */
export const TOPLANAN_VERILER = [
  {
    kategori: "Kimlik",
    ornek: "Ad ve soyad (iletişim kurulacak ilgili kişi)",
  },
  {
    kategori: "İletişim",
    ornek: "Telefon numarası, e-posta adresi, il / bölge bilgisi",
  },
  {
    kategori: "Müşteri İşlem",
    ornek:
      "Talep ettiğiniz muayene hizmetine konu ekipman listesi, talebinize eklediğiniz serbest metin notu, oluşturulan talep referans numarası",
  },
  /**
   * ⚠️ 03.09.2026'da EKLENDI. Teklif formundaki "Ek not" alanina fotograf
   * eklenebiliyor (bkz. app/components/TeklifForm.tsx). Fotograf kisisel
   * veridir; toplanan veri listesinde gorunmemesi eksik beyan olurdu.
   *
   * Bu dosyalar veritabanina YAZILMIYOR — bildirim e-postasinin ekinde
   * kurumsal posta kutusuna dusuyor (bkz. app/api/teklif/route.ts). Saklama
   * yeri farkli oldugu icin /kvkk "Saklama Suresi" bolumunde ayrica yaziyor.
   */
  {
    kategori: "Görsel Veri",
    ornek:
      "Ek not alanına isteğe bağlı olarak eklediğiniz fotoğraflar (ekipman, etiket, arıza görseli). Fotoğraf eklemek zorunlu değildir.",
  },
  {
    kategori: "İşlem Güvenliği",
    ornek:
      "Siteyi kullanımınız sırasında sunucu tarafında otomatik oluşan teknik kayıtlar (IP adresi, tarayıcı ve işletim sistemi bilgisi, erişim zamanı)",
  },
];

export const ISLEME_AMACLARI = [
  "Talep ettiğiniz periyodik kontrol ve muayene hizmetine ilişkin teklif hazırlanması ve size ulaştırılması",
  "Muayene randevusunun planlanması, hizmetin yürütülmesi ve sözleşme süreçlerinin yönetilmesi",
  "Muayene raporunun düzenlenmesi, numaralandırılması ve tarafınıza iletilmesi",
  "İş sağlığı ve güvenliği mevzuatından doğan yükümlülüklerin yerine getirilmesi ve yetkili kamu kurumlarına karşı ispat yükümlülüğü",
  "Akreditasyon kapsamındaki denetim ve kayıt tutma yükümlülüklerinin karşılanması",
  "Talebiniz ve hizmet süreciyle ilgili olarak sizinle iletişim kurulması",
  "İnternet sitesinin güvenliğinin sağlanması ve teknik arızaların giderilmesi",
];

export const HUKUKI_SEBEPLER = [
  {
    madde: "md. 5/2-c",
    baslik: "Sözleşmenin kurulması veya ifası",
    aciklama:
      "Teklif talebinizin karşılanması ve muayene hizmetinin sunulabilmesi için kimlik, iletişim ve müşteri işlem verilerinizin işlenmesi zorunludur.",
  },
  {
    madde: "md. 5/2-ç",
    baslik: "Hukuki yükümlülüğün yerine getirilmesi",
    aciklama:
      "6331 sayılı İş Sağlığı ve Güvenliği Kanunu ile İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği kapsamındaki kayıt, raporlama ve saklama yükümlülüklerimiz.",
  },
  {
    madde: "md. 5/2-e",
    baslik: "Hakkın tesisi, kullanılması veya korunması",
    aciklama:
      "Düzenlenen muayene raporlarına ve hizmet ilişkisine dayalı olarak doğabilecek uyuşmazlıklarda delil olarak kullanılması.",
  },
  {
    madde: "md. 5/2-f",
    baslik: "Meşru menfaat",
    aciklama:
      "Temel hak ve özgürlüklerinize zarar vermemek kaydıyla, internet sitesinin güvenliğinin sağlanması ve hizmet kalitesinin ölçülmesi.",
  },
];

export const HAKLAR = [
  "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
  "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme",
  "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
  "Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme",
  "Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme",
  "Kanunun 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme",
  "Düzeltme, silme ve yok edilme taleplerinizin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme",
  "İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
  "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
];

/** Sitede fiilen kullanilan ucuncu taraf servisler. */
export const CEREZ_TABLOSU = [
  {
    ad: "Zorunlu / teknik",
    saglayici: "Bilge Teknik Kontrol",
    amac:
      "Sayfanın görüntülenebilmesi ve form gönderimlerinin güvenli şekilde iletilmesi. Bu kayıtlar olmadan site çalışmaz.",
    tip: "Zorunlu",
  },
  /**
   * ⚠️ 2026-08-31'de DUZELTILDI. Burada "Vercel Analytics" yaziyordu ama site
   * 29 Agustos'ta Hostinger'a tasindi ve o bilesen yalnizca Vercel ortaminda
   * basiliyor (bkz. app/layout.tsx `process.env.VERCEL ? ... : null`) — yani
   * ARTIK CALISMIYOR. Buna karsilik GERCEKTEN calisan Google Analytics 4
   * (app/components/GoogleAnalytics.tsx) listede HIC YOKTU. Yani cerez
   * politikasi calismayan bir servisi beyan edip calisani gizliyordu.
   */
  /**
   * ⚠️ 2026-09-02'de GUNCELLENDI — davranis degisti, metin de degismek
   * zorundaydi. Once etiket onay verilmedikce HIC yuklenmiyordu; artik
   * Consent Mode v2 gelismis modda calisiyor: etiket yukleniyor ama izinler
   * "denied" varsayilaniyla basliyor. Onay yoksa CEREZ YAZILMAZ, yalnizca
   * kimlik tasimayan bir ping gider. Bunu yazmamak, calisan sistemi yanlis
   * beyan etmek olurdu — cerez politikasinin tek isi dogru beyan.
   */
  {
    ad: "Google Analytics 4",
    saglayici: "Google Ireland Ltd. / Google LLC (ABD)",
    amac:
      "Hangi sayfaların ne sıklıkta görüntülendiğinin ve ziyaretçilerin siteyi nasıl kullandığının toplu olarak ölçülmesi. “Tümünü kabul et” demediğiniz sürece cihazınıza çerez yazılmaz ve sizi tanımlayan bir kimlik oluşturulmaz; bu durumda Google’a yalnızca kimlik taşımayan, toplu istatistik amaçlı bir sinyal (sayfa adresi ve IP) iletilir. Onay verdiğinizde ölçüm normal şekilde çalışır.",
    tip: "Analitik",
  },
  {
    ad: "Google Haritalar",
    saglayici: "Google Ireland Ltd. / Google LLC",
    amac:
      "İletişim sayfasındaki konum haritasının gösterilmesi. Harita yüklendiğinde IP adresiniz Google’a iletilir ve Google tarafından çerez yerleştirilebilir.",
    tip: "Üçüncü taraf",
  },
];
