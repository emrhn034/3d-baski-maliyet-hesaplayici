import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createAppServer } from '../server.mjs';

let server;
let origin;
before(async () => {
  server = createAppServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('Ana sayfa ve tüm modüller doğru içerik türüyle sunulur', async () => {
  for (const [route, type] of [['/', 'text/html'], ['/app.js', 'text/javascript'], ['/calc.mjs', 'text/javascript'], ['/style.css', 'text/css']]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    assert.ok(response.headers.get('content-type').startsWith(type), route);
    assert.ok((await response.text()).length > 0, route);
  }
});

test('Paket ve sunucu kaynakları web üzerinden açılmaz', async () => {
  for (const route of ['/package.json', '/server.mjs', '/.env', '/%2e%2e%2fserver.mjs']) {
    assert.equal((await fetch(origin + route)).status, 404, route);
  }
});

test('POST istekleri reddedilir', async () => {
  const response = await fetch(origin, { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});

test('HEAD isteğinde gövde gönderilmez', async () => {
  const response = await fetch(origin, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});

test('Geçersiz kodlanmış adres 400 verir', async () => {
  assert.equal((await fetch(origin + '/%FF')).status, 400);
});
