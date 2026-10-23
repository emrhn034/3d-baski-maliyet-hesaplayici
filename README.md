# 3D Baskı Maliyet Hesaplayıcı

3D yazıcı ürünlerinizin maliyetini, satış fiyatını ve net kârını hesaplayan Türkçe Windows uygulaması.

## Windows kurulumu

Dağıtım dosyası GitHub Releases sayfasındaki **Assets** bölümüne yüklenmek üzere hazırlanır. Kullanıcılar buradan sürüme uygun `3D-Baski-Maliyet-Setup-1.2.0.exe` dosyasını indirir.

1. Setup dosyasına çift tıklayın.
2. Türkçe kurulum ekranında ilerleyip kurulumu başlatın. Klasör veya kullanıcı türü seçmeniz gerekmez.
3. Son ekranda isterseniz uygulamayı başlatma kutusunu işaretleyip **Bitir** düğmesine basın.

Uygulama geçerli Windows hesabının varsayılan program konumuna kurulur. Masaüstü ve Başlat Menüsü kısayolları oluşturulur. Node.js veya terminal gerekmez. **Windows 10/11, 64 bit** içindir.

Program Windows **Ayarlar → Uygulamalar → Yüklü uygulamalar** bölümünde görünür ve buradan kaldırılabilir. Güncellemek için uygulamayı kapatıp yeni Setup dosyasını çalıştırın. Otomatik güncelleme bu sürümde yoktur.

Ürünler, ayarlar ve tema uygulamanın kurulduğu klasörden ayrı olan mevcut `%APPDATA%\3D-Baski-Maliyet-Hesaplayici` profilinde saklanır. Önceki masaüstü sürümleriyle aynı profil kullanılır; kurulum ve güncelleme bu verileri silmez. Normal kaldırma işleminde de profil korunur.

Kurulum dosyası dijital imzalı değildir.

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

Masaüstü kayıtları `%APPDATA%\3D-Baski-Maliyet-Hesaplayici` klasöründeki uygulama profiline kaydedilir. Ürünler, ayarlar ve tema yeniden açılışta korunur. Hiçbir ürün verisi sunucuya ya da GitHub'a gönderilmez. Normal kaldırma işlemi bu profili otomatik silmez. Bu klasörü silmek kayıtlarınızı kaldırır.

Uygulama çevrimiçi font veya uzak sayfa yüklemez. Arayüz dosyaları EXE içerisinde bulunur. Eski tarayıcı sürümündeki kayıtlar masaüstü uygulamasına otomatik aktarılmaz.

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

`npm start` masaüstü uygulamasını açar. Bu komutlar geliştiriciler içindir. Kullanıcılar GitHub Releases > Assets bölümünden Setup dosyasını indirip kurabilir.

### Windows Setup dosyasını üretme

Windows'ta:

```sh
npm ci
npm test
npm run build:win
```

NSIS kurulum dosyası `release/3D-Baski-Maliyet-Setup-1.2.0.exe` altında oluşur. Dosya adındaki sürüm `package.json` içindeki `version` değerinden alınır. `release` ve `node_modules` klasörleri Git'e eklenmez. Sürümler ve bağımlılıklar `package-lock.json` ile sabitlenir. Geliştirme araçları uygulama paketine eklenmez.

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
  index.html        Masaüstü arayüz girişi
  style.css         Responsive tasarım, açık/koyu tema
  app.js            Ekranlar, yerel kayıt ve etkileşimler
  calc.mjs          Arayüzden bağımsız hesaplama motoru
build/
  icon.svg          Uygulama simgesi kaynağı
  icon.png          Simge önizlemesi
  icon.ico          Windows uygulama ve kurulum simgesi
  installer.nsh     Sade Türkçe kurulum ekranı özelleştirmeleri
tests/              Hesaplama motoru testleri
package.json        Komutlar ve NSIS kurulum ayarları
```

Masaüstü sürümü Electron ile çalışır. Renderer'da Node.js erişimi kapalıdır; context isolation ve sandbox açıktır. Yalnızca paketlenen yerel arayüz dosyaları yüklenir. `docs/` klasörü masaüstü uygulamasının kullandığı arayüz kaynaklarını içerir. İleride backend eklemek için `app.js` içindeki `repository` katmanı değiştirilebilir.

## GitHub dağıtımı

`npm run build:win` başarılı olduktan sonra `release/` klasöründeki `3D-Baski-Maliyet-Setup-${version}.exe` dosyasını ilgili GitHub Release'in **Assets** bölümüne yükleyin. Build komutu otomatik yayın yapmaz. README içinde doğrudan Setup indirme bağlantısı tutulmaz. `release/win-unpacked` klasörü test içindir; kullanıcıya dağıtılacak dosya Setup EXE'sidir.
