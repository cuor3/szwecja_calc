/* Kalkulator zwrotu podatku ze Szwecji – logika obliczeń (2024, 2025) */
/* ===== Parametry 2024 / 2025 (zweryfikowane w Skatteverket) ===== */
const P = {
  2024:{pbb:57300, skikt:598500, psMax:1219, avgKI:32.37, sink:0.25,
        trFull:290, trHalf:145, trNight:145, tr3m:87, tillfMeal:145, tillfNight:145, dubbelMeal:87, mil:25,
        resGr:11000, ovrGr:5000,
        jsa:{r1:0.3874, r2:0.1643, top:2.608, phase:0.03},  // wygaszanie 3% powyżej 13,54 PBB
        expertPbb:2, meals:[261,203,102,58]},
  2025:{pbb:58800, skikt:625800, psMax:1249, avgKI:32.41, sink:0.25,
        trFull:290, trHalf:145, trNight:145, tr3m:87, tillfMeal:145, tillfNight:145, dubbelMeal:87, mil:25,
        resGr:11000, ovrGr:5000,
        jsa:{r1:0.3874, r2:0.199, top:2.776, phase:0},
        expertPbb:1.5, meals:[261,203,102,58]}
};

const up100 = x => Math.ceil(x/100)*100;
const down100 = x => Math.floor(x/100)*100;

/* Grundavdrag – IL 63 kap. 3 § (osoby < 66 lat) */
function grundavdrag(ffi, pbb){
  if (ffi <= 0) return 0;
  const k = ffi/pbb; let ga;
  if (k <= 0.99) ga = 0.423*pbb;
  else if (k <= 2.72) ga = 0.423*pbb + 0.2*(ffi - 0.99*pbb);
  else if (k <= 3.11) ga = 0.77*pbb;
  else if (k <= 7.88) ga = 0.77*pbb - 0.1*(ffi - 3.11*pbb);
  else ga = 0.293*pbb;
  return Math.min(up100(ga), ffi);
}

/* Jobbskatteavdrag – IL 67 kap. 7 § (osoby < 66 lat) */
function jobbskatteavdrag(ai, ga, ki, p){
  const b = p.pbb, j = p.jsa; ai = down100(ai);
  if (ai <= 0) return 0;
  let base;
  if (ai <= 0.91*b) base = ai - ga;
  else if (ai <= 3.24*b) base = 0.91*b + j.r1*(ai - 0.91*b) - ga;
  else if (ai <= 8.08*b) base = 1.813*b + j.r2*(ai - 3.24*b) - ga;
  else base = j.top*b - ga;
  let jsa = base*ki;
  if (j.phase && ai > 13.54*b) jsa -= j.phase*(ai - 13.54*b);
  return Math.max(0, jsa);
}

function calc(year, v){
  const p = P[year];
  const lonTaxable = v.expert ? v.lon*0.75 : v.lon;
  const expertFree = v.lon - lonTaxable;

  // 2.2 Tjänsteresor
  const d22 = Math.max(0,
      v.trFull*p.trFull + v.trHalf*p.trHalf + v.tr3m*p.tr3m + v.trNight*p.trNight
    + v.trLogi + v.trMil*p.mil - v.trMeal);

  // 2.3 Tillfälligt arbete / dubbel bosättning / hemresor
  const days = Math.min(v.taDays, 31);
  let d23 = 0;
  if (v.ta === 'tillf') d23 += days*p.tillfMeal + v.taLogi + v.taNights*p.tillfNight;
  if (v.ta === 'dubbel') d23 += days*p.dubbelMeal + v.taLogi;
  const hem = Math.min(v.hemN, 53)*v.hemC;
  d23 += hem;

  // 2.1 och 2.4 – progi
  const d21 = Math.max(0, v.resor - p.resGr);
  const d24 = Math.max(0, v.ovr - p.ovrGr);

  const income = lonTaxable + v.kost;
  const deductions = d21 + d22 + d23 + d24;
  const ffi = down100(Math.max(0, income - deductions));
  const ga = grundavdrag(ffi, p.pbb);
  const bfi = Math.max(0, ffi - ga);

  const ki = v.ki/100;
  const kommunal = Math.floor(bfi*ki);
  const statlig = Math.floor(Math.max(0, bfi - p.skikt)*0.20);
  const begr = Math.floor(bfi*v.begr/100);
  const kyrka = Math.floor(bfi*v.kyrka/100);
  const jsaRaw = jobbskatteavdrag(lonTaxable, ga, ki, p);
  const jsa = Math.round(Math.min(jsaRaw, kommunal));
  const ps = Math.round(Math.min(bfi*0.01, p.psMax));
  // Skattereduktion för förvärvsinkomst (IL 67 kap. 46–47 §§): 0,75% × (BFI − 40 000), max 1 500 kr
  const forv = bfi <= 40000 ? 0 : Math.round(Math.min(1500, 0.0075*(bfi - 40000)));
  const reductionsCap = kommunal + statlig + begr + kyrka + ps;
  const forvUsed = Math.min(forv, Math.max(0, reductionsCap - jsa));
  const total = Math.round(kommunal + statlig + begr + kyrka - jsa - forvUsed + ps);

  const sinkTax = Math.round((v.lon + v.kost)*p.sink);

  return {p, income, expertFree, d21, d22, d23, d24, hem, deductions, ffi, ga, bfi,
          kommunal, statlig, begr, kyrka, jsa, forv: forvUsed, ps, total, sinkTax,
          diff: v.prelim - total, sinkDiff: v.prelim - sinkTax};
}

/* Eksport dla Node.js (testy); w przeglądarce funkcje są globalne */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { P, up100, down100, grundavdrag, jobbskatteavdrag, calc };
}
