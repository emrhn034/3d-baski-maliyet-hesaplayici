# 3D Baskı Maliyet Hesaplayıcı

3D yazıcı ürünlerinizin maliyetini, satış fiyatını ve net kârını hesaplayan **Türkçe Windows uygulaması**.

**Windows kurulumu:** [Releases → Assets bölümünü aç](https://github.com/emrhn034/3d-baski-maliyet-hesaplayici/releases/latest)

## Windows kurulumu

Yukarıdaki Releases bağlantısını açıp **Assets** bölümünü genişletin. Buradan `3D-Baski-Maliyet-Setup-1.2.0.exe` dosyasını indirin.

1. Setup dosyasına çift tıklayın.
2. Türkçe kurulum ekranında ilerleyip kurulumu başlatın. Klasör veya kullanıcı türü seçmeniz gerekmez.
3. Son ekranda isterseniz uygulamayı başlatma kutusunu işaretleyip **Bitir** düğmesine basın.

Uygulama geçerli Windows hesabının varsayılan program konumuna kurulur. Masaüstü ve Başlat Menüsü kısayolları oluşturulur. Node.js veya terminal gerekmez. **Windows 10/11, 64 bit** içindir.

Windows **Ayarlar → Uygulamalar → Yüklü uygulamalar** bölümünden normal şekilde kaldırılabilir. Kurulum dosyası dijital imzalı değildir.

Mevcut `%APPDATA%\3D-Baski-Maliyet-Hesaplayici` veri profili kullanılır. Ürünler, ayarlar ve tema kurulum klasöründen ayrı saklanır; güncelleme ve normal kaldırma işlemi bu verileri silmez.

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

## Geliştiriciler için Windows build

Node.js 22 veya üzeri kurulu olmalıdır. Proje klasöründe:

```sh
npm ci
npm test
npm run build:win
```

NSIS Setup dosyası `release/3D-Baski-Maliyet-Setup-${version}.exe` olarak oluşturulur. Sürüm `package.json` içindeki `version` değerinden alınır. `npm start` masaüstü uygulamasını geliştirme ortamında açar.

Dağıtım için Setup dosyasını ilgili GitHub Release'in **Assets** bölümüne yükleyin. Build komutu otomatik yayın yapmaz. `release/win-unpacked` test içindir; dağıtılacak dosya Setup EXE'sidir.

## Depo yapısı

- `desktop/`: Windows uygulamasının başlangıcı ve masaüstü kontrolleri.
- `docs/`: Windows uygulamasının kullandığı yerel arayüz ve hesaplama motoru.
- `build/`: Windows simgesi, simgenin SVG kaynağı ve NSIS kurulum ayarları.
- `tests/`: Hesaplama doğrulama testleri.
- `package.json` ve `package-lock.json`: Çalıştırma komutları, paketleme ayarları ve sabitlenmiş bağımlılıklar.

Derleme çıktıları `release/` altında oluşur ve kaynak depoya eklenmez. Windows dağıtımı için sürümün Assets bölümünde Setup dosyası ve ona ait `.sha256` doğrulama dosyası bulunur.
