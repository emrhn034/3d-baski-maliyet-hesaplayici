const { app } = require('electron');
const assert = require('node:assert/strict');
const path = require('node:path');
const { start } = require('./main.cjs');

// Test profili normal kullanıcının kayıtlarından tamamen ayrıdır.
async function run() {
  const dataDirectory = process.env.BASKI_TEST_PROFILE;
  if (!dataDirectory || !path.isAbsolute(dataDirectory)) throw Error('Mutlak BASKI_TEST_PROFILE yolu gerekli.');
  const win = await start({ hidden: true, dataDirectory });
  if (process.env.BASKI_SMOKE_RESTART === '1') {
    const saved = await win.webContents.executeJavaScript(`({
      products: JSON.parse(localStorage.getItem('baski.products.v1')).length,
      machine: JSON.parse(localStorage.getItem('baski.settings.v1')).machine,
      dark: document.body.classList.contains('dark')
    })`);
    assert.deepEqual(saved, { products: 1, machine: '8', dark: true });
    console.log('Uygulama işlemi kapanıp yeniden açıldı: ürünler, maliyet ayarları ve tema korundu.');
    app.exit(0);
    return;
  }
  const errors = [];
  win.webContents.on('render-process-gone', (_event, details) => errors.push(details.reason));

  const first = await win.webContents.executeJavaScript(`(async () => {
    const report = [];
    const check = (value, message) => { if (!value) throw Error(message); report.push(message); };
    const input = (key, value) => {
      const el = document.querySelector('#form-' + key);
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const click = selector => {
      const el = document.querySelector(selector);
      if (!el) throw Error('Kontrol bulunamadı: ' + selector);
      el.click();
    };
    check(document.title === '3D Baskı Maliyet Hesaplayıcı', 'Masaüstü arayüzü açıldı');
    check(getComputedStyle(document.documentElement).getPropertyValue('--green').trim() === '#078371', 'Masaüstü stil dosyası eksiksiz yüklendi');
    check(document.querySelector('.sidebar').getBoundingClientRect().width > 190, 'Masaüstü yerleşimi uygulanıyor');
    check(document.querySelector('#filament-inline').textContent === '51,18 TL', 'Örnek filament maliyeti doğru');
    check(typeof window.require === 'undefined' && typeof window.process === 'undefined', 'Renderer Node erişimi kapalı');
    input('name', 'Masaüstü Test Ürünü');
    input('price', '1000');
    input('grams', '100');
    input('hours', '0');
    input('minutes', '0');
    input('waste', '0');
    input('profit', '100');
    input('commission', '20');
    check(document.querySelector('.sale-value').textContent === '250,00 TL', 'Komisyon sonrası kâr korunuyor');
    input('minutes', '60');
    check(document.querySelector('[data-action="save"]').disabled, 'Geçersiz dakika kaydı engelliyor');
    input('minutes', '0');
    click('[data-action="save"]');
    let products = JSON.parse(localStorage.getItem('baski.products.v1'));
    check(products.length === 1 && products[0].result.net === 100, 'Ürün ve hesap sonucu kaydedildi');
    click('[data-page="products"]');
    check(document.querySelectorAll('tbody tr').length === 1, 'Ürünlerim kaydı gösteriyor');
    click('[data-action="copy"]');
    check(document.querySelectorAll('tbody tr').length === 2, 'Ürün kopyalanıyor');
    click('[data-action="delete"]');
    click('[data-confirm]');
    check(document.querySelectorAll('tbody tr').length === 1, 'Ürün siliniyor');
    click('[data-page="settings"]');
    const machine = document.querySelector('#settings-machine');
    machine.value = '8';
    document.querySelector('#settings-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    check(JSON.parse(localStorage.getItem('baski.settings.v1')).machine === '8', 'Maliyet ayarları kaydediliyor');
    click('[data-action="theme"]');
    check(document.body.classList.contains('dark'), 'Koyu tema açılıyor');
    return report;
  })()`);
  assert.equal(errors.length, 0);
  await win.webContents.session.flushStorageData();
  await win.webContents.reload();
  await new Promise(resolve => win.webContents.once('did-finish-load', resolve));
  const persisted = await win.webContents.executeJavaScript(`({
    products: JSON.parse(localStorage.getItem('baski.products.v1')).length,
    machine: JSON.parse(localStorage.getItem('baski.settings.v1')).machine,
    dark: document.body.classList.contains('dark')
  })`);
  assert.deepEqual(persisted, { products: 1, machine: '8', dark: true });
  console.log(JSON.stringify({ passed: [...first, 'Yeniden yüklemede ürün, ayar ve tema korundu'] }));
  app.exit(0);
}

run().catch(error => {
  console.error(error.stack);
  app.exit(1);
});
