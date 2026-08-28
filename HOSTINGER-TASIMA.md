# Hostinger'a taşıma — adım adım

Site şu an Vercel'de çalışıyor ve **taşıma boyunca orada kalacak**. Hostinger
kurulumu önce geçici bir adreste test edilecek; ancak her şey doğrulandıktan
sonra alan adı yönlendirilecek. Bir sorun çıkarsa DNS'i geri alıp Vercel'e
dönmek birkaç dakika sürer.

## Kurulum bilgileri

| Ne | Değer |
|---|---|
| Alan adı DNS'i | **plushosting.com.tr** panelinde (`ns1/ns2.plushosting.com.tr`) |
| Şu anki A kaydı | `76.76.21.21` (Vercel) — geri dönüş için not edin |
| Repo | `bilgeteknikkontrol-sudo/bilge-next`, dal `main` |
| Node sürümü | 20.x veya 22.x (Hostinger 18/20/22/24 destekliyor) |

---

## 1. hPanel'de Node.js sitesini oluştur

`Websites → Add Website → Deploy Web App`

- Yöntem: **GitHub** (her `main` push'unda otomatik kurulum yapar).
- Alan adı: **geçici/ücretsiz Hostinger adresini seçin** (ör.
  `xxxx.hostingersite.com`). Bu aşamada `bilgekontrol.com` **seçilmesin** —
  Hostinger "Node.js siteleri yeni site olarak eklenir" diyor ve mevcut alan
  adını bağlamak canlı yayını riske atar.
- Framework: Next.js olarak algılanmalı. Algılamazsa:
  - Build komutu: `npm run build`
  - Start komutu: `npm start`
  - Çıktı klasörü: `.next`

## 2. MySQL veritabanı oluştur

`Databases → Management` → yeni veritabanı + kullanıcı.
Adı, kullanıcıyı ve şifreyi bir yere kaydedin.

Şema kendiliğinden kurulur — uygulama ilk açılışta tabloları oluşturup
mevcut içeriği (ekipmanlar, bölgeler, yazılar, ayarlar) içeri aktarır.
Elle SQL çalıştırmanıza gerek yok.

## 3. Ortam değişkenleri

Node.js uygulamasının `Environment Variables` bölümüne:

**Veritabanı — şifrede `@ : / ? #` gibi karakter olabileceği için ayrı ayrı verin:**

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=<hPanel'deki kullanıcı>
MYSQL_PASSWORD=<şifre>
MYSQL_DATABASE=<veritabanı adı>
```

(Tek satır tercih ederseniz `DATABASE_URL=mysql://kullanici:sifre@localhost:3306/veritabani`
de çalışır; ama şifredeki özel karakterleri URL kaçışıyla yazmanız gerekir.)

**Yönetici paneli:**

```
ADMIN_PASSWORD=<panel şifresi>
```

**E-posta bildirimi (Vercel'dekiyle aynı, çalıştığı doğrulanmış ayarlar):**

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@bilgeteknikkontrol.com
SMTP_PASS=<posta kutusu şifresi>
```

**Tanımlanmayacaklar:** `BLOB_READ_WRITE_TOKEN`, `VERCEL_API_TOKEN`,
`POSTGRES_URL`. Hostinger'da depo MySQL; Blob'a hiç gidilmiyor.

## 4. Geçici adreste doğrulama

Alan adını çevirmeden önce şunların hepsi çalışmalı:

- [ ] Ana sayfa, `/ekipman`, `/yazilar`, `/bolge` açılıyor
- [ ] `/admin` girişi çalışıyor, panelin tepesinde kırmızı depo uyarısı **yok**
- [ ] Panelden bir başlık değiştir → kaydet → sayfayı yenile → değişiklik duruyor
      (bu, MySQL'e gerçekten yazıldığının kanıtı)
- [ ] `/admin/teklifler` → "Test e-postası gönder" çalışıyor
- [ ] `/teklif` formundan deneme talebi gönder → hem e-posta geliyor
      hem `/admin/teklifler` listesinde görünüyor
- [ ] Görseller açılıyor (`next/image` optimizasyonu `sharp` ile çalışıyor)

## 5. Alan adını çevir (son adım)

plushosting.com.tr DNS panelinde:

1. Önce A kaydının **TTL değerini 300 saniyeye** düşürün, bir saat bekleyin.
   (Geri dönmek gerekirse eski değer dünyada saatlerce önbellekte kalmasın.)
2. Hostinger'da siteye `bilgekontrol.com` alan adını ekleyin; Hostinger size
   bir IP verecek.
3. A kaydını `76.76.21.21` → **Hostinger IP** yapın. `www` için de aynısı.
4. `curl -I https://bilgekontrol.com` ile kontrol edin; `X-Vercel-Id` başlığı
   artık **görünmemeli**.

**Geri dönüş:** A kaydını `76.76.21.21` yapın. Vercel projesi silinmeyecek,
olduğu gibi duruyor.

---

## ⚠️ Ayrıca düzeltilmesi gereken (taşımadan bağımsız)

`bilgekontrol.com` alan adının **MX kaydı kendi A kaydını gösteriyor**
(`MX 0 bilgekontrol.com`). A kaydı 26 Ağustos'ta Vercel'e çevrildiği için
`@bilgekontrol.com` adreslerine gelen postalar **şu anda posta sunucusu
olmayan bir IP'ye** gitmeye çalışıyor. Bu adresleri kullanıyorsanız posta
alamıyorsunuz demektir.

Kurumsal posta zaten `@bilgeteknikkontrol.com` üzerinde ve o Hostinger'da
(`mx1/mx2.hostinger.com`) sağlıklı çalışıyor. `@bilgekontrol.com` da
kullanılacaksa MX kaydı Hostinger'a yönlendirilmeli.
