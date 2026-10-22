# 3D Baskı Maliyet Hesaplayıcı

3D yazıcıyla ürettiğiniz ürünlerin maliyetini, satış fiyatını ve net kârını hesaplayan Türkçe uygulama.

**Filament fiyatı + kullanılan gram + baskı süresi → maliyet ve satış fiyatı.**

HTML, CSS ve JavaScript ile hazırlanmıştır. Veritabanı, üyelik, API anahtarı veya derleme gerektirmez. Ek paket bağımlılığı yoktur.

## En kolay kurulum — Windows

1. [Node.js](https://nodejs.org/) güncel **LTS** sürümünü kurun (Node.js 22 veya üzeri).
2. GitHub sayfasında **Code → Download ZIP** ile projeyi indirin ve ZIP'i bir klasöre çıkartın.
3. Klasördeki **Baslat.bat** dosyasına çift tıklayın.
4. Uygulama tarayıcıda açılır: **http://localhost:4173**

Komut penceresi açık kalsın. Uygulamayı durdurmak için pencerede **Ctrl+C** tuşlarına basın. Tekrar kullanmak için aynı dosyayı açmanız yeterlidir.

## Terminal ile kurulum — Windows / macOS / Linux

Node.js 22 veya üzeri kurulu olmalıdır. Proje klasöründe:

```sh
npm start
```

Ardından **http://localhost:4173** adresini açın. **`npm install` çalıştırmanız gerekmez.** İsterseniz aynı uygulamayı `node server.mjs` ile de başlatabilirsiniz.

> `docs/index.html` dosyasına doğrudan çift tıklamak yerine yerel sunucuyu kullanın; uygulama JavaScript modülleri kullanır.

## GitHub'da paylaşma

1. GitHub'da yeni bir depo oluşturun. Önerilen ad: `3d-baski-maliyet-hesaplayici`.
2. **Add file → Upload files** üzerinden bu klasörün **içindeki dosya ve klasörleri** yükleyin. ZIP dosyasının kendisini yüklemeyin.
3. Deponun kökünde `README.md`, `package.json`, `server.mjs`, `Baslat.bat` ve `docs` klasörü bulunmalı.
4. Dosyaları kaydetmek için **Commit changes** seçeneğini kullanın.

Git kullanıyorsanız oluşturduğunuz boş deponun adresiyle:

```sh
git init
git add .
git commit -m "İlk sürüm: 3D baskı maliyet hesaplayıcı"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/DEPO_ADINIZ.git
git push -u origin main
```

## GitHub Pages ile internette yayınlama

Ziyaretçilerin uygulamayı kullanmak için Node.js kurmasına gerek yoktur.

1. Projeyi GitHub'a yükleyin.
2. Depoda **Settings → Pages** sayfasını açın.
3. **Build and deployment → Source** alanında **Deploy from a branch** seçin.
4. Dal olarak **main**, klasör olarak **/docs** seçip **Save** düğmesine basın.
5. Yayın tamamlandığında Pages sayfasındaki bağlantıyı açın.

Adresiniz genellikle `https://KULLANICI_ADINIZ.github.io/DEPO_ADINIZ/` şeklinde olur. Göreli dosya yolları sayesinde depo altındaki yayın desteklenir. Ayrıntılar: [GitHub Pages resmi kurulum rehberi](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Kullanım

1. **Ayarlar** bölümünde filament alış fiyatı, elektrik birim fiyatı, yazıcı gücü, makine saatlik maliyeti ve varsayılan oranları girip **Maliyet Ayarlarını Kaydet** düğmesine basın.
2. **Yeni Hesaplama** bölümünde ürün adını, kullanılan filament gramını ve baskı süresini girin.
3. İsterseniz ek maliyet ekleyin; fire, kâr ve komisyon oranlarını belirleyin.
4. Sonuç kartı anında güncellenir. **Ürünü Kaydet** ile hesabı saklayın.
5. **Ürünlerim** bölümünde arama, düzenleme, kopyalama, silme ve güncel ayarlarla tekrar hesaplama yapın.

Elektrik ve makine maliyetleri ayrı ayrı kapatılabilir. Hızlı kâr kartlarına tıklayarak satış fiyatını karşılaştırabilirsiniz. Açık ve koyu tema desteklenir.

## Hesaplama kuralları

- **Filament:** `(TL/kg ÷ 1000) × gram`
- **Elektrik:** `(Watt ÷ 1000) × (saat + dakika ÷ 60) × TL/kWh`
- **Makine:** `(saat + dakika ÷ 60) × TL/saat`
- **Fire:** `(filament + elektrik + makine) × fire yüzdesi ÷ 100`
- **Üretim maliyeti:** `filament + elektrik + makine + fire + ek maliyetler`
- **Hedef kâr:** `üretim maliyeti × kâr yüzdesi ÷ 100`
- **Normal satış fiyatı:** `üretim maliyeti + hedef kâr`
- **Komisyon sonrası kâr koruma açıkken:** `(üretim maliyeti + hedef kâr) ÷ (1 − komisyon yüzdesi ÷ 100)`
- **Komisyon:** `satış fiyatı × komisyon yüzdesi ÷ 100`
- **Net kazanç:** `satış fiyatı − komisyon`
- **Net kâr:** `net kazanç − üretim maliyeti`

Kâr oranı, maliyet üzerine eklenen oranı ifade eder. Vergiler ve ayrıca tanımlanmayan giderler hesaplanmaz. Ara para hesapları `BigInt` tamsayılarla, TL'nin milyonda biri hassasiyetinde yapılır; ekranda tutarlar iki ondalık basamakla gösterilir. Görüntülenen kalemlerin yuvarlanması nedeniyle kuruş farkları görülebilir.

### Örnek

560 TL/kg fiyatla 91,4 gram filament:

```text
560 / 1000 × 91,4 = 51,184 TL
Ekranda: 51,18 TL
```

Yalnızca filament maliyetini görmek için elektrik ve makine maliyetini kapatın, fireyi ve ek maliyetleri sıfırlayın.

## Veriler nerede saklanıyor?

Ürünler, ayarlar ve tema `localStorage` içinde, kullanılan tarayıcı ve adres için saklanır. Sunucuya veya GitHub'a ürün verisi gönderilmez. Kayıtlar cihazlar arasında eşitlenmez. Tarayıcı verilerini temizlemek kayıtları siler; gizli oturumdaki kayıtlar oturum kapanınca kaybolabilir.

Yerel adres, GitHub Pages adresi ve önceki Sites yayını farklı depolama alanları kullanır. Aynı kayıtları görmek için aynı tarayıcı ve adresi kullanın. `localhost` ile `127.0.0.1` de farklı adreslerdir. GitHub Pages üzerinde bir adresi açan herkes kendi tarayıcısındaki kayıtları görür.

Arayüz fontları Google Fonts üzerinden yüklenir. İnternet bağlantısı yoksa sistem fontları kullanılır; yerel maliyet hesaplama çalışmaya devam eder.

## Proje yapısı

```text
docs/
  index.html       Sayfa girişi
  style.css        Responsive tasarım, açık/koyu tema
  app.js           Ekranlar, yerel kayıt ve etkileşimler
  calc.mjs         Arayüzden bağımsız hesaplama motoru
  .nojekyll        GitHub Pages için statik yayın işareti
tests/
  calc.test.mjs    Maliyet, komisyon ve doğrulama testleri
  server.test.mjs  Yerel sunucu kontrolleri
server.mjs         Bağımlılıksız yerel sunucu
Baslat.bat         Windows için çift tıklayarak başlatma
package.json       Başlatma ve test komutları
```

İleride backend eklemek için `app.js` içindeki `repository` nesnesi API tabanlı bir veri katmanıyla değiştirilebilir. Hesaplama motoru `calc.mjs` içinde ayrı tutulur. Bu pakette Sites kimliği, erişim anahtarı ve özel depo bilgisi bulunmaz.

## Testler

```sh
npm test
```

Hesaplama ve yerel sunucu testlerini çalıştırır. Görsel tarayıcı kontrolleri ayrıca yapılmalıdır.

## Sık karşılaşılan durumlar

- **Node.js bulunamadı:** Node.js LTS kurulumundan sonra terminali kapatıp yeniden açın.
- **4173 portu kullanımda:** Önceden açtığınız uygulama penceresini kapatın. İkinci bir sunucu yerine mevcut `http://localhost:4173` adresini kullanabilirsiniz.
- **Ayarlar yeni ürüne gelmedi:** Ayarları kaydedin, ardından **Ürünlerim → Yeni Hesaplama** ile yeni bir hesap açın.
- **Eski ürünün fiyatı değişmedi:** Kayıtlı hesap geçmiş haliyle saklanır. **Tekrar Hesapla** ile güncel ayarları uygulayıp yeniden kaydedin.
- **Pages adresinde 404:** Pages ayarının `main /docs` olduğundan ve `docs/index.html` dosyasının yüklendiğinden emin olun.
