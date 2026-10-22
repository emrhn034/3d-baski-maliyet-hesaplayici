const { app, BrowserWindow, Menu, protocol, session } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const ORIGIN = 'baski://uygulama';
const ENTRY = `${ORIGIN}/index.html`;
const assets = new Map([
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/calc.mjs', ['calc.mjs', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);

// Sabit ve güvenli köken, kayıtların yeniden açılışlarda korunmasını sağlar.
protocol.registerSchemesAsPrivileged([
  { scheme: 'baski', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

let window;
function createWindow({ hidden = false } = {}) {
  window = new BrowserWindow({
    width: 1380,
    height: 940,
    minWidth: 650,
    minHeight: 650,
    title: '3D Baskı Maliyet Hesaplayıcı',
    backgroundColor: '#f5f7f9',
    icon: path.join(__dirname, '../build/icon.ico'),
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged,
    },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    if (url !== ENTRY) event.preventDefault();
  });
  window.webContents.on('will-attach-webview', event => event.preventDefault());
  window.on('closed', () => { window = null; });
  if (!hidden) window.once('ready-to-show', () => window.show());
  return window;
}

async function start({ hidden = false, dataDirectory } = {}) {
  app.setName('3D Baskı Maliyet Hesaplayıcı');
  app.setAppUserModelId('com.emrhn034.baskimaliyet');
  app.setPath('userData', dataDirectory || path.join(app.getPath('appData'), '3D-Baski-Maliyet-Hesaplayici'));

  if (!hidden && !app.requestSingleInstanceLock()) {
    app.quit();
    return null;
  }
  app.on('second-instance', () => {
    if (window) {
      if (window.isMinimized()) window.restore();
      window.show();
      window.focus();
    }
  });
  await app.whenReady();
  Menu.setApplicationMenu(null);
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  session.defaultSession.on('will-download', event => event.preventDefault());
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    callback({ cancel: !details.url.startsWith(`${ORIGIN}/`) && !details.url.startsWith('devtools://') });
  });

  protocol.handle('baski', async request => {
    const url = new URL(request.url);
    const asset = assets.get(url.pathname);
    if (url.host !== 'uygulama' || !asset || request.method !== 'GET') {
      return new Response('Dosya bulunamadı.', { status: 404 });
    }
    try {
      let body = await fs.readFile(path.join(__dirname, '../docs', asset[0]));
      if (asset[0] === 'style.css') {
        // Masaüstünde çevrimiçi font isteği yapılmaz; sistem fontu kullanılır.
        body = Buffer.from(body.toString('utf8').replace(/^@import[^\r\n]*(?:\r?\n|$)/, ''));
      }
      return new Response(body, {
        headers: {
          'Content-Type': asset[1],
          'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-src 'none'",
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch {
      return new Response('Uygulama dosyası okunamadı.', { status: 500 });
    }
  });

  const mainWindow = createWindow({ hidden });
  await mainWindow.loadURL(ENTRY);
  app.on('window-all-closed', () => app.quit());
  return mainWindow;
}

module.exports = { start };

if (require.main === module) {
  if (process.argv.includes('--self-test') && process.env.BASKI_TEST_PROFILE) {
    require('./smoke.cjs');
  } else {
    start().catch(error => {
      require('electron').dialog.showErrorBox('Uygulama açılamadı', error.message);
      app.quit();
    });
  }
}
