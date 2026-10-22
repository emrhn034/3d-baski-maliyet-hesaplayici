# 3D Baskı Maliyet Hesaplayıcı

**Güncel sürüm: [v1.2.0 — Kurulumsuz Windows uygulaması](https://github.com/emrhn034/3d-baski-maliyet-hesaplayici/releases/tag/v1.2.0)**

## [UYGULAMAYI İNDİR — 3D-Baski-Maliyet.exe](https://github.com/emrhn034/3d-baski-maliyet-hesaplayici/releases/latest/download/3D-Baski-Maliyet.exe)

**İndir → Çift tıkla → Kullan.** Kurulum, ZIP çıkartma ve Node.js gerekmez.

3D yazıcı ürünlerinizin maliyetini, satış fiyatını ve net kârını hesaplayan **Türkçe Windows uygulaması**.


## İndir ve çalıştır — kurulum yok

1. **[3D-Baski-Maliyet.exe dosyasını indir](https://github.com/emrhn034/3d-baski-maliyet-hesaplayici/releases/latest/download/3D-Baski-Maliyet.exe).**
2. İndirdiğiniz dosyaya **çift tıklayın**. Uygulama açılır.

Hepsi bu. ZIP çıkartmak, kurulum yapmak, Node.js kurmak veya terminal kullanmak gerekmez. **Windows 10/11, 64 bit** içindir. Yönetici yetkisi istemez.

Dosyayı masaüstüne taşıyıp sonraki kullanımlarda aynı EXE'ye çift tıklayabilirsiniz. İnternet olmadan da çalışır. İlk açılış, program dosyaları geçici alana hazırlanırken birkaç saniye sürebilir; herhangi bir seçim yapmanız gerekmez.

Ürün ve ayarlarınız EXE'nin yanında değil, kullanıcı profilinizde saklanır. EXE'yi taşımak veya yeni sürümüyle değiştirmek kayıtları silmez. Önceki kurulu sürümle aynı veri profili kullanılır. Otomatik güncelleme yoktur; güncellemek için uygulamayı kapatıp yeni EXE'yi indirin.

İlk dağıtım dijital imzalı değildir. Kaynak kod ve SHA-256 doğrulama dosyası GitHub sürümünde bulunur.

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

Masaüstü kayıtları `%APPDATA%\3D-Baski-Maliyet-Hesaplayici` klasöründeki uygulama profiline kaydedilir. Ürünler, ayarlar ve tema yeniden açılışta korunur. Hiçbir ürün verisi sunucuya ya da GitHub'a gönderilmez. EXE dosyasını silmek bu profili otomatik silmez. Bu klasörü silmek kayıtlarınızı kaldırır.

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

`npm start` masaüstü uygulamasını açar. Bu komutlar geliştiriciler içindir. Kullanıcılar yukarıdaki EXE bağlantısından indirip çift tıklayarak açabilir.

### Tek dosyalık Windows EXE üretme

Windows'ta:

```sh
npm ci
npm test
npm run build:win
```

Doğrudan çalışan taşınabilir dosya `release/3D-Baski-Maliyet.exe` altında oluşur. `release` ve `node_modules` klasörleri Git'e eklenmez. Sürümler ve bağımlılıklar `package-lock.json` ile sabitlenir. Geliştirme araçları uygulama paketine eklenmez.

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
  icon.ico          Windows uygulama simgesi
tests/              Hesaplama motoru testleri
package.json        Komutlar ve taşınabilir EXE paketleme ayarları
```

Masaüstü sürümü Electron ile çalışır. Renderer'da Node.js erişimi kapalıdır; context isolation ve sandbox açıktır. Yalnızca paketlenen yerel arayüz dosyaları yüklenir. `docs/` klasörü masaüstü uygulamasının kullandığı arayüz kaynaklarını içerir. İleride backend eklemek için `app.js` içindeki `repository` katmanı değiştirilebilir.
