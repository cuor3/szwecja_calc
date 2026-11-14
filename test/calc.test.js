// Testy: node --test
// Przypadek referencyjny 2025 – dane zanonimizowane z decyzji Skatteverket
// (pracownik mieszkający w Polsce, obegränsat skattskyldig, gmina 32,42%).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { P, grundavdrag, calc } = require('../calc.js');

const base = {
  lon: 0, kost: 0, prelim: 0, ki: 32.42, begr: 0, kyrka: 0, expert: false,
  trFull: 0, trHalf: 0, tr3m: 0, trNight: 0, trLogi: 0, trMil: 0, trMeal: 0,
  ta: 'none', taDays: 0, taLogi: 0, taNights: 0, hemN: 0, hemC: 0, resor: 0, ovr: 0
};

test('2025 – decyzja przed zmianą (zwrot 14 849 kr)', () => {
  const r = calc(2025, { ...base, lon: 574956, kost: 16175, prelim: 153313 });
  assert.equal(r.ffi, 591100);
  assert.equal(r.ga, 17300);
  assert.equal(r.kommunal, 186025);
  assert.equal(r.statlig, 0);
  assert.equal(r.jsa, 47310);
  assert.equal(r.forv, 1500);
  assert.equal(r.ps, 1249);
  assert.equal(r.total, 138464);
  assert.equal(r.diff, 14849);
});

test('2025 – decyzja po doliczeniu dochodu z SINK (dopłata 11 454 kr)', () => {
  const r = calc(2025, { ...base, lon: 702802, kost: 16175, prelim: 183603 });
  assert.equal(r.ffi, 718900);
  assert.equal(r.kommunal, 227458);
  assert.equal(r.statlig, 15160);
  assert.equal(r.jsa, 47310);
  assert.equal(r.total, 195057);
  assert.equal(r.diff, -11454);
});

test('grundavdrag – wartości graniczne', () => {
  assert.equal(grundavdrag(24300, P[2024].pbb), 24300);   // nie więcej niż dochód
  assert.equal(grundavdrag(170000, P[2024].pbb), 44200);  // maksimum 2024
  assert.equal(grundavdrag(500000, P[2024].pbb), 16800);  // minimum 2024
  assert.equal(grundavdrag(170000, P[2025].pbb), 45300);  // maksimum 2025
  assert.equal(grundavdrag(600000, P[2025].pbb), 17300);  // minimum 2025
});

test('SINK – 25% od dochodu w 2024 i 2025', () => {
  const v = { ...base, lon: 100000, prelim: 30000 };
  assert.equal(calc(2024, v).sinkTax, 25000);
  assert.equal(calc(2025, v).sinkTax, 25000);
});

test('odliczenia – progi 2.1 (11 000) i 2.4 (5 000), 2.3 bez progu', () => {
  const r = calc(2025, { ...base, lon: 400000, resor: 15000, ovr: 6000, ta: 'tillf', hemN: 2, hemC: 1000 });
  assert.equal(r.d21, 4000);
  assert.equal(r.d24, 1000);
  assert.equal(r.d23, 2000);
});
