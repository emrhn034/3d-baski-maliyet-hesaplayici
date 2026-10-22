# 3D Baskı Maliyet Hesaplayıcı

3D yazıcı ürünlerinizin maliyetini, satış fiyatını ve net kârını hesaplayan **Türkçe Windows uygulaması**.

[Windows kurulumunu indir](https://github.com/emrhn034/3d-baski-maliyet-hesaplayici/releases/latest) · [Web sürümünü aç](https://emrhn034.github.io/3d-baski-maliyet-hesaplayici/)

## Windows'ta kurulum

1. Yukarıdaki **Windows kurulumunu indir** bağlantısını açın.
2. `3D-Baski-Maliyet-Kurulum-1.1.0.exe` dosyasını indirin.
3. Dosyaya çift tıklayın. Uygulama kullanıcı hesabınıza kurulur ve açılır.
4. Sonraki kullanımlarda masaüstündeki **3D Baskı Maliyet Hesaplayıcı** simgesine tıklayın.

**Windows 10/11, 64 bit.** Node.js, terminal, tarayıcı veya ayrıca sunucu kurmanız gerekmez. Uygulama kendi penceresinde çalışır. İnternet bağlantısı olmadan maliyet hesaplayabilir ve kayıtlarınıza ulaşabilirsiniz.

Kaldırmak için Windows **Ayarlar → Uygulamalar** bölümünü kullanın. Güncellemelerde aynı kurulum dosyasının yeni sürümünü çalıştırın; ürün verileri uygulama klasöründen ayrı tutulur. Otomatik güncelleme bu sürümde yoktur.

İlk dağıtımın kurulum dosyası dijital imzalı değildir. Kaynak kod ve SHA-256 doğrulama dosyası GitHub sürümünde bulunur.

## Neler yapar?

- Filament fiyatı, gram ve baskı süresinden anlık üretim maliyeti
- İsteğe bağlı elektrik ve makine kullanım maliyeti
- Kaydedilebilir maliyet ayarları ve varsayılan oranlar
- Birden çok ek maliyet ve fire payı
- Kâr oranı, hızlı satış fiyatı kartları ve komisyon hesabı
- Komisyon sonrasında hedef kârı koruma
- Ürün kaydetme, arama, düzenleme, kopyalama, silme ve tekrar hesaplama
- Ürün sayısı, filament kullanımı, maliyet ve tahmini kâr istatistikleri
- Açık/koyu tema ve Türkçe sayı biçimleri

## Kullanım

1. **Ayarlar** bölümünde maliyet değerlerinizi girin ve kaydedin.
2. **Yeni Hesaplama** bölümünde ürün adı, filament fiyatı, kullanılan gram ve baskı süresini girin.
3. Kâr oranını seçin. Sonuçlar anında güncellenir.
4. **Ürünü Kaydet** düğmesiyle saklayın; **Ürünlerim** bölümünden tekrar açın.

Örnek: `560 TL/kg ÷ 1000 × 91,4 gram = 51,184 TL`; filament maliyeti ekranda **51,18 TL** görünür.

## Veriler ve gizlilik

Masaüstü kayıtları `%APPDATA%\3D-Baski-Maliyet-Hesaplayici` klasöründeki uygulama profiline kaydedilir. Ürünler, ayarlar ve tema yeniden açılışta korunur. Hiçbir ürün verisi sunucuya ya da GitHub'a gönderilmez. Kaldırma işlemi bu profili otomatik silmez. Bu klasörü silmek kayıtlarınızı kaldırır.

Web sürümü kayıtları kullanılan tarayıcının `localStorage` alanında tutulur. Masaüstü ve web kayıtları ayrı saklanır; otomatik olarak aktarılmaz veya eşitlenmez. Tarayıcı verilerini temizlemek web kayıtlarını siler.

Masaüstü sürümü çevrimiçi font veya uzak sayfa yüklemez. Web sürümünün fontları Google Fonts'tan yüklenebilir; bağlantı yoksa sistem fontları kullanılır.

## Hesaplama kuralları

| Kalem | Hesap |
| --- | --- |
| Filament | `(TL/kg ÷ 1000) × gram` |
| Baskı süresi | `saat + dakika ÷ 60` |
| Elektrik | `(Watt ÷ 1000) × süre × TL/kWh` |
| Makine | `süre × TL/saat` |
| Fire | `(filament + elektrik + makine) × fire yüzdesi ÷ 100` |
| Üretim maliyeti | `filament + elektrik + makine + fire + ek maliyetler` |
| Hedef kâr | `üretim maliyeti × kâr yüzdesi ÷ 100` |
| Normal satış fiyatı | `üretim maliyeti + hedef kâr` |
| Komisyon sonrası kâr koruma | `(üretim maliyeti + hedef kâr) ÷ (1 − komisyon / 100)` |
| Net kazanç | `satış fiyatı − komisyon` |
| Net kâr | `satış fiyatı − komisyon − üretim maliyeti` |

Kâr oranı maliyet üzerine eklenen oranı ifade eder. Vergiler ayrıca hesaplanmaz. Para hesapları `BigInt` ile TL'nin milyonda biri hassasiyetinde yapılır; ekran iki ondalık basamak gösterir. Ara kalemlerdeki yuvarlama nedeniyle kuruş farkları görülebilir.

## Kaynak koddan çalıştırma — geliştiriciler için

[Node.js LTS](https://nodejs.org/) (22 veya üzeri) ve Git kurulu olmalıdır.

```sh
git clone https://github.com/emrhn034/3d-baski-maliyet-hesaplayici.git
cd 3d-baski-maliyet-hesaplayici
npm ci
npm start
```

`npm start` masaüstü uygulamasını açar. Kaynak ZIP'ini çıkartan Windows kullanıcıları `Baslat.bat` dosyasını da kullanabilir. Son kullanıcılar için önerilen yöntem yukarıdaki kurulum EXE'sidir.

### Web sürümü

```sh
npm run web
```

**http://localhost:4173** adresini açın. Yalnızca web sürümünü çalıştırmak için `node server.mjs` yeterlidir; paket kurulumu gerekmez. `docs/index.html` dosyasını doğrudan çift tıklamayın; JavaScript modülleri sunucu üzerinden yüklenmelidir.

GitHub Pages ayarı: **Settings → Pages → Deploy from a branch → main → /docs**. [Resmi GitHub rehberi](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

### Windows kurulum dosyasını üretme

Windows'ta:

```sh
npm ci
npm test
npm run build:win
```

Kurulum dosyası `release/3D-Baski-Maliyet-Kurulum-1.1.0.exe` altında oluşur. `release` ve `node_modules` klasörleri Git'e eklenmez. Sürümler ve bağımlılıklar `package-lock.json` ile sabitlenir. Geliştirme araçları kurulum paketine eklenmez.

### Masaüstü etkileşim testleri

PowerShell'de, yalnızca test için ayrılmış boş bir profil yolu belirleyin:

```powershell
$env:BASKI_TEST_PROFILE = Join-Path $env:TEMP ('baski-test-' + [Guid]::NewGuid())
npm run test:desktop
$env:BASKI_SMOKE_RESTART = '1'
npm run test:desktop
```

Hesaplama, ürün işlemleri, ayarlar, tema, stil yükleme ve uygulama işlemi yeniden açıldığında veri kalıcılığı doğrulanır. Test profili normal kayıtlardan ayrıdır. Yeni test turunda yeni bir profil yolu kullanın ve `BASKI_SMOKE_RESTART` değişkenini kaldırın.

## Kod yapısı

```text
desktop/
  main.cjs          Masaüstü penceresi, yerel protokol ve veri profili
  smoke.cjs         Masaüstü etkileşim ve kalıcılık kontrolleri
docs/
  index.html        Ortak arayüz girişi
  style.css         Responsive tasarım, açık/koyu tema
  app.js            Ekranlar, yerel kayıt ve etkileşimler
  calc.mjs          Arayüzden bağımsız hesaplama motoru
build/
  icon.svg          Uygulama simgesi kaynağı
  icon.png          Simge önizlemesi
  icon.ico          Windows uygulama ve kurulum simgesi
tests/              Hesaplama ve web sunucusu testleri
server.mjs          İsteğe bağlı web sürümü sunucusu
Baslat.bat          Kaynak kod için Windows başlatıcısı
package.json        Komutlar ve Windows paketleme ayarları
```

Masaüstü sürümü Electron ile çalışır. Renderer'da Node.js erişimi kapalıdır; context isolation ve sandbox açıktır. Yalnızca paketlenen yerel arayüz dosyaları yüklenir. Web ve masaüstü aynı hesaplama motorunu kullanır. İleride backend eklemek için `app.js` içindeki `repository` katmanı değiştirilebilir.
