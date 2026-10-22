import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, fixed } from '../docs/calc.mjs';

const form = {
  price: '560', grams: '91.4', hours: '3', minutes: '11',
  waste: '0', profit: '100', commission: '0', protect: true, extras: [],
};
const settings = { electricOn: false, machineOn: false, machine: '5', watts: '150', kwh: '3' };

test('İstenen örnek 51,18 TL gösterir', () => {
  const result = calculate(form, settings);
  assert.equal(result.filament, 51.184);
  assert.equal(result.filament.toLocaleString('tr-TR', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }), '51,18');
});

test('Komisyon sonrası hedef kârı korur', () => {
  const result = calculate({ ...form, price: '1000', grams: '100', commission: '20' }, settings);
  assert.equal(result.total, 100);
  assert.equal(result.sale, 250);
  assert.equal(result.fee, 50);
  assert.equal(result.revenue, 200);
  assert.equal(result.net, 100);
});

test('Kâr koruma kapalıyken komisyon satış fiyatından düşer', () => {
  const result = calculate({ ...form, price: '1000', grams: '100', commission: '20', protect: false }, settings);
  assert.equal(result.sale, 200);
  assert.equal(result.fee, 40);
  assert.equal(result.net, 60);
});

test('Saat ve dakikayı elektrik ve makine hesabında kullanır', () => {
  const result = calculate(form, { ...settings, electricOn: true, machineOn: true });
  assert.equal(result.machine, 15.916667);
  assert.equal(result.electricity, 1.4325);
});

test('Fire ek maliyetlerden önce üretim tabanına uygulanır', () => {
  const result = calculate({ ...form, price: '1000', grams: '100', waste: '10', extras: [{ amount: '8' }, { amount: '5' }, { amount: '7' }] }, settings);
  assert.equal(result.loss, 10);
  assert.equal(result.extras, 20);
  assert.equal(result.total, 130);
});

test('Türkçe ondalık virgülü ve hassas para değerlerini destekler', () => {
  assert.equal(fixed('0,1') + fixed('0,2'), fixed('0,3'));
  assert.equal(calculate({ ...form, grams: '91,4' }, settings).filament, 51.184);
});

test('Sıfır maliyette sonuçlar sonludur', () => {
  const result = calculate({ ...form, grams: '0' }, settings);
  assert.equal(result.sale, 0);
  assert.equal(result.net, 0);
});

for (const [label, change] of [
  ['negatif filament fiyatı', { price: '-1' }],
  ['negatif gram', { grams: '-1' }],
  ['boş fiyat', { price: '' }],
  ['sayısal olmayan fiyat', { price: 'abc' }],
  ['negatif saat', { hours: '-1' }],
  ['ondalıklı saat', { hours: '1.5' }],
  ['60 dakika', { minutes: '60' }],
  ['negatif dakika', { minutes: '-1' }],
  ['ondalıklı dakika', { minutes: '1.5' }],
  ['negatif kâr', { profit: '-1' }],
  ['%100 komisyon', { commission: '100' }],
  ['negatif ek maliyet', { extras: [{ amount: '-1' }] }],
]) {
  test(`Geçersiz girişi reddeder: ${label}`, () => {
    assert.throws(() => calculate({ ...form, ...change }, settings));
  });
}
