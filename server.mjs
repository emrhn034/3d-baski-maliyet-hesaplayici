import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';

const publicDirectory = fileURLToPath(new URL('./docs/', import.meta.url));
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/calc.mjs', ['calc.mjs', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);

// Yalnızca uygulamanın herkese açık dosyalarını sunar.
export function createAppServer() {
  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-cache');

    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Yalnızca GET ve HEAD desteklenir.');
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400);
      response.end('Geçersiz adres.');
      return;
    }

    const file = files.get(pathname);
    if (!file) {
      response.writeHead(404);
      response.end('Dosya bulunamadı.');
      return;
    }

    try {
      const content = await readFile(path.join(publicDirectory, file[0]));
      response.writeHead(200, {
        'Content-Type': file[1],
        'Content-Length': content.length,
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      response.writeHead(500);
      response.end('Uygulama dosyası okunamadı. docs klasörünü kontrol edin.');
    }
  });
}

function openBrowser(url) {
  const [command, args] = process.platform === 'win32'
    ? ['cmd.exe', ['/c', 'start', '', url]]
    : process.platform === 'darwin'
      ? ['open', [url]]
      : ['xdg-open', [url]];
  const child = spawn(command, args, {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.on('error', () => console.log('Tarayıcıda yukarıdaki adresi açın.'));
  child.unref();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT değeri 1–65535 arasında tam sayı olmalıdır.');
    process.exitCode = 1;
  } else {
    const server = createAppServer();
    server.on('error', error => {
      console.error(error.code === 'EADDRINUSE'
        ? `${port} numaralı port kullanımda. Önceden açtığınız uygulama penceresini kapatın.`
        : `Uygulama başlatılamadı: ${error.message}`);
      process.exitCode = 1;
    });
    server.listen(port, '127.0.0.1', () => {
      const url = `http://localhost:${port}`;
      console.log(`\n3D Baskı Maliyet Hesaplayıcı\n\n${url}\n\nDurdurmak için Ctrl+C tuşlarına basın.\n`);
      if (process.argv.includes('--open')) openBrowser(url);
    });
  }
}
