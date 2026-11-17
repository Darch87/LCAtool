// Sun & Wind Lab — analysis engines shared by the page, the workers and the baseline build.
//  · Solar: annual irradiance, sun hours and sky view on façade and ground sensors (exact ray casting against boxes)
//  · Energy: ISO 13790 monthly quasi-steady-state balance, with solar gains from the sensors and
//            wind-driven infiltration from the wind tunnel's façade pressures
//  · Wind comfort: Lawson LDDC comfort and safety, from 16 wind-tunnel directions and the wind climate
//  · Outdoor comfort: Steadman apparent temperature with sun, shade and local wind

import { DAYS_IN_MONTH, weibullC, airTemp, relHumidity, vapourPressure } from './climate.js';
import { monthDay } from './sun.js';
import { azToGrid, deg } from './site.js';

// ---------------- geometry helpers ----------------
// Boxes packed into a flat array with a bounding-volume hierarchy, so a ray only tests the few boxes near it.
export function packBoxes(boxes) {
  const n = boxes.length;
  const arr = new Float64Array(n * 6);
  boxes.forEach((b, i) => { arr.set([b.u0, b.v0, b.z0, b.u1, b.v1, b.z1], i * 6); });
  const idx = [...Array(n).keys()];
  const nodes = []; // [minx,miny,minz,maxx,maxy,maxz, left, right, start, count]
  const build = (s, e) => {
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (let k = s; k < e; k++) { const o = idx[k] * 6; for (let a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], arr[o + a]); hi[a] = Math.max(hi[a], arr[o + 3 + a]); } }
    const me = nodes.length; nodes.push([...lo, ...hi, -1, -1, s, e - s]);
    if (e - s > 4) {
      const ax = [0, 1, 2].reduce((b, a) => (hi[a] - lo[a] > hi[b] - lo[b] ? a : b), 0);
      const part = idx.slice(s, e).sort((p, q) => (arr[p * 6 + ax] + arr[p * 6 + 3 + ax]) - (arr[q * 6 + ax] + arr[q * 6 + 3 + ax]));
      for (let k = 0; k < part.length; k++) idx[s + k] = part[k];
      const m = (s + e) >> 1;
      const l = build(s, m), r = build(m, e);
      nodes[me][6] = l; nodes[me][7] = r;
    }
    return me;
  };
  if (n) build(0, n);
  const flat = new Float64Array(nodes.length * 10);
  nodes.forEach((nd, i) => flat.set(nd, i * 10));
  return { arr, idx: Int32Array.from(idx), nodes: flat, length: arr.length };
}

function slab(px, py, pz, ix, iy, iz, A, o) {
  let t0 = 1e-3, t1 = 1e9;
  let ta = (A[o] - px) * ix, tb = (A[o + 3] - px) * ix;
  if (ta > tb) { const t = ta; ta = tb; tb = t; }
  if (ta > t0) t0 = ta; if (tb < t1) t1 = tb; if (t0 > t1) return false;
  ta = (A[o + 1] - py) * iy; tb = (A[o + 4] - py) * iy;
  if (ta > tb) { const t = ta; ta = tb; tb = t; }
  if (ta > t0) t0 = ta; if (tb < t1) t1 = tb; if (t0 > t1) return false;
  ta = (A[o + 2] - pz) * iz; tb = (A[o + 5] - pz) * iz;
  if (ta > tb) { const t = ta; ta = tb; tb = t; }
  if (ta > t0) t0 = ta; if (tb < t1) t1 = tb;
  return t0 <= t1;
}

const STACK = new Int32Array(256);
export function blocked(px, py, pz, dx, dy, dz, P) {
  const ix = 1 / dx, iy = 1 / dy, iz = 1 / dz;
  if (!P.nodes) { for (let o = 0; o < P.length; o += 6) if (slab(px, py, pz, ix, iy, iz, P, o)) return true; return false; }
  const N = P.nodes, A = P.arr, I = P.idx;
  if (!N.length) return false;
  let sp = 0; STACK[sp++] = 0;
  while (sp) {
    const nd = STACK[--sp] * 10;
    if (!slab(px, py, pz, ix, iy, iz, N, nd)) continue;
    if (N[nd + 6] < 0) {
      const s = N[nd + 8], c = N[nd + 9];
      for (let k = s; k < s + c; k++) if (slab(px, py, pz, ix, iy, iz, A, I[k] * 6)) return true;
    } else { STACK[sp++] = N[nd + 6]; STACK[sp++] = N[nd + 7]; }
  }
  return false;
}

function insideAny(u, v, z, boxes) {
  for (const b of boxes) if (u > b.u0 && u < b.u1 && v > b.v0 && v < b.v1 && z > b.z0 && z < b.z1) return true;
  return false;
}

// Ground analysis grid (also the grid the pedestrian wind maps are stored on).
export const GROUND = { u0: -150, v0: -150, step: 3, nu: 127, nv: 120, z: 1.5 };

// Façade (and roof) sensors on the Seagram masses; ground sensors on the GROUND grid.
export function makeSensors(boxes, { facadeStep = 3 } = {}) {
  const seagram = boxes.filter((b) => b.kind === 'seagram' && !b.whatif);
  const fac = [];
  const faces = [
    { n: [-1, 0, 0], k: 'W' }, { n: [1, 0, 0], k: 'E' }, { n: [0, -1, 0], k: 'S' }, { n: [0, 1, 0], k: 'N' }, { n: [0, 0, 1], k: 'R' },
  ];
  for (const b of seagram) {
    for (const f of faces) {
      const [nx, ny, nz] = f.n;
      let A, Bd, aLen, bLen, mk;
      if (nz) { aLen = b.u1 - b.u0; bLen = b.v1 - b.v0; mk = (s, t) => [b.u0 + s, b.v0 + t, b.z1]; }
      else if (nx) { aLen = b.v1 - b.v0; bLen = b.z1 - b.z0; mk = (s, t) => [nx < 0 ? b.u0 : b.u1, b.v0 + s, b.z0 + t]; }
      else { aLen = b.u1 - b.u0; bLen = b.z1 - b.z0; mk = (s, t) => [b.u0 + s, ny < 0 ? b.v0 : b.v1, b.z0 + t]; }
      const na = Math.max(1, Math.round(aLen / facadeStep)), nb = Math.max(1, Math.round(bLen / facadeStep));
      A = aLen / na; Bd = bLen / nb;
      for (let i = 0; i < na; i++) for (let j = 0; j < nb; j++) {
        const [u, v, z] = mk((i + 0.5) * A, (j + 0.5) * Bd);
        const pu = u + nx * 0.05, pv = v + ny * 0.05, pz = z + nz * 0.05;
        if (insideAny(pu, pv, pz, boxes)) continue;
        fac.push({ u, v, z, n: f.n, face: f.k, box: b.id, area: A * Bd, glass: !nz });
      }
    }
  }
  const ground = [];
  const G = GROUND;
  for (let j = 0; j < G.nv; j++) for (let i = 0; i < G.nu; i++) {
    const u = G.u0 + (i + 0.5) * G.step, v = G.v0 + (j + 0.5) * G.step;
    const inside = insideAny(u, v, 0.5, boxes);
    ground.push({ u, v, z: G.z, n: [0, 0, 1], inside, i, j });
  }
  return { fac, ground };
}

// Cosine-weighted hemisphere directions (stratified), local frame with +z = normal.
function hemisphere(nTheta = 8, nPhi = 16) {
  const out = [];
  for (let a = 0; a < nTheta; a++) for (let b = 0; b < nPhi; b++) {
    const r = Math.sqrt((a + 0.5) / nTheta), phi = 2 * Math.PI * (b + 0.5 + (a % 2) * 0.5) / nPhi;
    out.push([r * Math.cos(phi), r * Math.sin(phi), Math.sqrt(Math.max(0, 1 - r * r))]);
  }
  return out;
}
const HEMI = hemisphere();
function frame(n) {
  const [x, y, z] = n;
  const t = Math.abs(z) < 0.9 ? [-y, x, 0] : [1, 0, 0];
  const tl = Math.hypot(...t); const T = t.map((c) => c / tl);
  const Bv = [y * T[2] - z * T[1], z * T[0] - x * T[2], x * T[1] - y * T[0]];
  return [T, Bv, n];
}

// Sun directions in the grid frame for each month's representative day.
export function sunTable(cl, site) {
  const tbl = [];
  for (let m = 0; m < 12; m++) {
    const hrs = monthDay(cl, site, m);
    for (const r of hrs) {
      const g = azToGrid(r.az);
      const ce = Math.cos(r.el * deg);
      tbl.push({ m, h: r.h, el: r.el, az: r.az, d: [g.u * ce, g.v * ce, Math.sin(r.el * deg)], ghi: r.ghi, dni: r.dni, dhi: r.dhi, days: DAYS_IN_MONTH[m] });
    }
  }
  return tbl;
}

// Core solar pass for a list of sensors. Returns typed arrays so they cross worker boundaries cheaply.
//  annual  — total incident irradiation, kWh/m²·yr
//  direct  — direct part, kWh/m²·yr
//  sunHrs  — hours of direct sun per year
//  sky     — cosine-weighted sky view (0..1), gnd — cosine-weighted ground view
//  vis     — per sensor × 288 month-hours: 1 if the sun reaches the sensor (bit-packed in Uint8)
export function solarPass(sensors, boxes, sun, { albedo = 0.2, onProgress = null } = {}) {
  const P = packBoxes(boxes);
  const N = sensors.length;
  const annual = new Float32Array(N), direct = new Float32Array(N), sunHrs = new Float32Array(N);
  const sky = new Float32Array(N), gnd = new Float32Array(N);
  const vis = new Uint8Array(N * 36); // 288 bits
  const active = sun.map((s, k) => (s.el > 0.5 && (s.dni > 0 || s.ghi > 0) ? k : -1)).filter((k) => k >= 0);
  for (let i = 0; i < N; i++) {
    const s = sensors[i];
    if (s.inside) { annual[i] = NaN; continue; }
    const [nx, ny, nz] = s.n;
    const px = s.u + nx * 0.05, py = s.v + ny * 0.05, pz = s.z + nz * 0.05;
    const [T, Bv, Nn] = frame(s.n);
    let skyC = 0, gndC = 0;
    for (const h of HEMI) {
      const dx = T[0] * h[0] + Bv[0] * h[1] + Nn[0] * h[2];
      const dy = T[1] * h[0] + Bv[1] * h[1] + Nn[1] * h[2];
      const dz = T[2] * h[0] + Bv[2] * h[1] + Nn[2] * h[2];
      if (dz < 0) { gndC++; continue; }
      if (!blocked(px, py, pz, dx || 1e-9, dy || 1e-9, dz || 1e-9, P)) skyC++;
    }
    const fs = skyC / HEMI.length, fg = gndC / HEMI.length;
    sky[i] = fs; gnd[i] = fg;
    let tot = 0, dir = 0, hrs = 0;
    for (const k of active) {
      const sn = sun[k];
      const cos = nx * sn.d[0] + ny * sn.d[1] + nz * sn.d[2];
      let beam = 0;
      if (cos > 0 && !blocked(px, py, pz, sn.d[0] || 1e-9, sn.d[1] || 1e-9, sn.d[2], P)) {
        beam = sn.dni * cos;
        vis[i * 36 + (k >> 3)] |= 1 << (k & 7);
        if (sn.dni > 120) hrs += sn.days;
      }
      const diff = sn.dhi * fs + albedo * sn.ghi * fg;
      tot += (beam + diff) * sn.days; dir += beam * sn.days;
    }
    annual[i] = tot / 1000; direct[i] = dir / 1000; sunHrs[i] = hrs;
    if (onProgress && i % 400 === 0) onProgress(i / N);
  }
  return { annual, direct, sunHrs, sky, gnd, vis };
}

export const isLit = (vis, i, k) => (vis[i * 36 + (k >> 3)] >> (k & 7)) & 1;

// ---------------- energy ----------------
export const GLAZING = {
  original: { label: 'Original 1958 · single amber-grey', U: 5.7, shgc: 0.50, vt: 0.42, leak: 2.0 },
  double: { label: 'Double low-e retrofit', U: 1.7, shgc: 0.36, vt: 0.55, leak: 0.9 },
  triple: { label: 'Triple low-e', U: 0.9, shgc: 0.30, vt: 0.48, leak: 0.6 },
  vacuum: { label: 'Vacuum IGU in original frames', U: 0.7, shgc: 0.40, vt: 0.55, leak: 0.7 },
};
export const HEATING = {
  steam: { label: 'District steam (Con Edison)', eff: 0.75 },
  hp: { label: 'Electric heat pumps', eff: 3.0 },
};

export const ENERGY_DEFAULTS = {
  glazing: 'original', wwr: 0.72, finDepth: 0.15, finSpacing: 1.41, overhang: 0, heating: 'steam',
  coolCOP: 4.5, heatSet: 21, coolSet: 24, lpd: 8, epd: 10, people: 6, occHours: 55, heatRecovery: 0, ventRate: 0.5,
  spandrelU: 1.4, roofU: 0.6, floorHeight: 4.1,
};

// Fraction of direct sun on a window that gets past vertical fins (mullions) and a horizontal overhang.
// gamma: sun azimuth relative to the façade normal; el: sun elevation. Window height is the floor height.
function shadeFactor(gamma, el, p) {
  let f = 1;
  if (p.finDepth > 0) f *= Math.max(0, 1 - p.finDepth * Math.abs(Math.tan(gamma)) / p.finSpacing);
  if (p.overhang > 0) {
    const prof = Math.atan(Math.tan(el) / Math.max(0.05, Math.cos(gamma)));
    f *= Math.max(0, 1 - p.overhang * Math.tan(prof) / (p.floorHeight * 0.75));
  }
  return f;
}

// Monthly ISO 13790 balance.
//  solar: result of solarPass on the façade sensors; sensors: the façade sensors; sun: sunTable
//  wind:  { dcp: [16 sector ΔCp], rose, windMean[12] } — façade pressure difference from the tunnel
export function energyModel({ sensors, solar, sun, boxes, climate, site, params = {}, wind = null }) {
  const p = { ...ENERGY_DEFAULTS, ...params };
  const gl = GLAZING[p.glazing];
  const masses = boxes.filter((b) => b.kind === 'seagram' && !b.whatif);
  let floorArea = 0, roofArea = 0, height = 0;
  for (const b of masses) {
    const fl = Math.max(1, Math.round((b.z1 - b.z0) / p.floorHeight));
    floorArea += (b.u1 - b.u0) * (b.v1 - b.v0) * fl;
    roofArea += (b.u1 - b.u0) * (b.v1 - b.v0);
    height = Math.max(height, b.z1);
  }
  let wallArea = 0;
  const faceSolar = { W: new Float64Array(12), E: new Float64Array(12), S: new Float64Array(12), N: new Float64Array(12) };
  const solM = new Float64Array(12);
  const faceArea = { W: 0, E: 0, S: 0, N: 0 };
  // façade outward normal azimuth (true) for gamma
  const faceAz = { W: (270 + 29) % 360, E: 90 + 29, S: 180 + 29, N: 29 };
  for (let i = 0; i < sensors.length; i++) {
    const s = sensors[i];
    if (!s.glass) continue;
    wallArea += s.area; faceArea[s.face] += s.area;
    const [nx, ny] = s.n;
    for (let k = 0; k < sun.length; k++) {
      const sn = sun[k];
      if (sn.el <= 0.5) continue;
      const cos = nx * sn.d[0] + ny * sn.d[1];
      const lit = solar.vis ? isLit(solar.vis, i, k) : 0;
      let beam = 0;
      if (lit && cos > 0) {
        let gamma = (sn.az - faceAz[s.face]) * deg; gamma = Math.atan2(Math.sin(gamma), Math.cos(gamma));
        beam = sn.dni * cos * shadeFactor(gamma, sn.el * deg, p);
      }
      const diff = sn.dhi * solar.sky[i] + 0.2 * sn.ghi * solar.gnd[i];
      const wh = (beam + diff) * s.area * sn.days; // Wh per month at this hour slot
      solM[sn.m] += wh; faceSolar[s.face][sn.m] += wh;
    }
  }
  const glassArea = wallArea * p.wwr, opaqueArea = wallArea - glassArea;
  const Htr = gl.U * glassArea + p.spandrelU * opaqueArea + p.roofU * roofArea; // W/K
  const occFrac = p.occHours / 168;
  const vent = p.ventRate / 1000 * floorArea * occFrac * (1 - p.heatRecovery); // m³/s average
  const Cm = 165000 * floorArea; // J/K, medium mass
  const months = [];
  const rhoCp = 1.2 * 1005;
  const leakArea = gl.leak * 1e-4 * wallArea; // m² effective leakage area at 4 Pa
  const Uh = (U10) => U10 * Math.pow(270 / 10, 0.14) * Math.pow(Math.min(height, 450) / 450, 0.27);
  let infilSum = 0;
  for (let m = 0; m < 12; m++) {
    let tMean = 0; for (let h = 0; h < 24; h++) tMean += airTemp(climate, m, h); tMean /= 24;
    const hours = DAYS_IN_MONTH[m] * 24;
    // wind-driven + stack infiltration (orifice equation on the combined pressure difference)
    let dcp = 0.9;
    if (wind && wind.dcp) {
      let s = 0, w = 0;
      for (let d = 0; d < 16; d++) { s += wind.dcp[d] * climate.rose[d].freq; w += climate.rose[d].freq; }
      dcp = s / w;
    }
    const U = Uh(climate.windMean[m]);
    const dpWind = 0.5 * 1.2 * dcp * U * U * 0.25; // a quarter of the full façade-to-façade difference acts on any one leak path
    const dpStack = 1.2 * 9.81 * height * 0.5 * Math.abs(p.heatSet - tMean) / 293 * 0.3; // with floor-by-floor separation
    const qInf = 0.6 * leakArea * Math.sqrt(2 * (dpWind + dpStack) / 1.2) * Math.pow(4 / Math.max(4, dpWind + dpStack), 0.35);
    infilSum += qInf;
    const Hve = rhoCp * (vent + qInf);
    const H = Htr + Hve;
    const tau = Cm / H / 3600;
    const a = 1 + tau / 15;
    const Qsol = solM[m] * p.wwr * gl.shgc * 0.9 * 3600; // J
    const qIntAvg = (p.lpd + p.epd + p.people) * occFrac + 2.5 * (1 - occFrac); // W/m²
    const Qint = qIntAvg * floorArea * hours * 3600;
    const Qgn = Qsol + Qint;
    const QhtH = H * Math.max(0, p.heatSet - tMean) * hours * 3600;
    const QhtC = H * (p.coolSet - tMean) * hours * 3600;
    const gH = QhtH > 0 ? Qgn / QhtH : 1e9;
    const etaH = gH === 1 ? a / (a + 1) : (1 - Math.pow(gH, a)) / (1 - Math.pow(gH, a + 1));
    const heat = Math.max(0, QhtH - (Number.isFinite(etaH) ? etaH : 0) * Qgn);
    let cool;
    if (QhtC <= 0) cool = Qgn - QhtC; // outdoors warmer than the cooling setpoint on average
    else {
      const gC = Qgn / QhtC;
      const etaC = gC === 1 ? a / (a + 1) : (1 - Math.pow(gC, -a)) / (1 - Math.pow(gC, -(a + 1)));
      cool = Math.max(0, Qgn - etaC * QhtC);
    }
    months.push({ m, heat: heat / 3.6e6, cool: cool / 3.6e6, solar: Qsol / 3.6e6, internal: Qint / 3.6e6, loss: QhtH / 3.6e6, infil: qInf });
  }
  const heat = months.reduce((s, x) => s + x.heat, 0), cool = months.reduce((s, x) => s + x.cool, 0);
  const lights = p.lpd * p.occHours * 52 * floorArea / 1000;
  const plugs = (p.epd * p.occHours * 52 + 2 * (168 - p.occHours) * 52) * floorArea / 1000;
  const fans = 0.08 * (heat + cool) + 12 * floorArea; // fans and pumps: a share of the loads plus a base
  const heatSite = heat / HEATING[p.heating].eff;
  const coolSite = cool / p.coolCOP;
  const total = heatSite + coolSite + lights + plugs + fans;
  const faces = {};
  for (const f of ['W', 'S', 'E', 'N']) faces[f] = { area: faceArea[f], solarKWh: faceSolar[f].reduce((a, b) => a + b, 0) / 1000, perM2: faceArea[f] ? faceSolar[f].reduce((a, b) => a + b, 0) / 1000 / faceArea[f] : 0 };
  return {
    floorArea, wallArea, glassArea, roofArea, height, months, faces,
    heatNeed: heat, coolNeed: cool,
    site: { heating: heatSite, cooling: coolSite, lights, plugs, fans, total },
    eui: total / floorArea,
    eui_kbtu_ft2: total / floorArea * 0.317,
    infilAvg: infilSum / 12, infilAch: infilSum / 12 * 3600 / (floorArea * p.floorHeight),
    Htr,
  };
}

// Rooftop PV: usable share of the roof, module efficiency and performance ratio applied to sensor irradiation.
export function pvPotential(sensors, solar, { usable = 0.6, eff = 0.21, pr = 0.8 } = {}) {
  let e = 0, area = 0;
  sensors.forEach((s, i) => { if (s.face === 'R') { e += solar.annual[i] * s.area; area += s.area; } });
  return { roofArea: area, irradiation: area ? e / area : 0, kWh: e * usable * eff * pr };
}

// ---------------- wind comfort ----------------
// Lawson LDDC: the comfort class is the first threshold exceeded less than 5% of the time.
export const LAWSON = [
  { id: 'A', label: 'Sitting', t: 4, color: '#1f9e89' },
  { id: 'B', label: 'Standing', t: 6, color: '#6ece58' },
  { id: 'C', label: 'Strolling', t: 8, color: '#fde725' },
  { id: 'D', label: 'Business walking', t: 10, color: '#fb8d3d' },
  { id: 'E', label: 'Uncomfortable', t: Infinity, color: '#e8384f' },
];
export const SAFETY = { frail: 15, all: 20, p: 0.00022 };

// Exceedance probability of a local speed threshold, from per-direction speed ratios K (local / airport 10 m mean)
// and gust factors G (gust-equivalent mean / mean).
export function exceed(T, Ks, Gs, rose) {
  let p = 0;
  for (let d = 0; d < rose.length; d++) {
    const r = rose[d]; const kk = Ks[d] * (Gs ? Gs[d] : 1);
    if (!(kk > 0)) continue;
    const c = weibullC(r.mean, r.k) * kk;
    p += r.freq * Math.exp(-Math.pow(T / c, r.k));
  }
  return p;
}

export function lawsonClass(Ks, Gs, rose) {
  for (let i = 0; i < LAWSON.length - 1; i++) if (exceed(LAWSON[i].t, Ks, Gs, rose) < 0.05) return i;
  return LAWSON.length - 1;
}

export function safetyClass(Ks, Gs, rose) {
  if (exceed(SAFETY.all, Ks, Gs, rose) > SAFETY.p) return 2;
  if (exceed(SAFETY.frail, Ks, Gs, rose) > SAFETY.p) return 1;
  return 0;
}

// ---------------- outdoor thermal comfort ----------------
// Steadman (1994) apparent temperature with radiation:
//   AT = Ta + 0.348·e − 0.70·ws + 0.70·Q/(ws + 10) − 4.25
// Q is the extra shortwave a person absorbs (W/m² of body); ws is wind at 10 m in open country, so the local
// pedestrian speed is scaled up by 1.5 to match the formula's reference.
export function apparentTemp(Ta, rh, wsLocal, Q) {
  const e = vapourPressure(Ta, rh);
  const ws = wsLocal * 1.5;
  return Ta + 0.348 * e - 0.70 * ws + 0.70 * Q / (ws + 10) - 4.25;
}

export function absorbedShortwave(lit, sn, sky) {
  // Steadman's Q is the radiation a person absorbs beyond what they get in shade: direct sun on a standing body
  // (projected area factor 0.3, absorptance 0.7), plus a small share of the extra sky in very open places.
  return 0.7 * ((lit ? 0.3 * sn.dni : 0) + 0.25 * sn.dhi * Math.max(0, sky - 0.5));
}

// Thermal stress bands (UTCI-style labels on the apparent temperature, °C).
export const STRESS = [
  { lo: -Infinity, hi: -13, label: 'Strong cold stress', color: '#2c4fbf' },
  { lo: -13, hi: 0, label: 'Moderate cold stress', color: '#3f7fe0' },
  { lo: 0, hi: 9, label: 'Slight cold stress', color: '#8cc3f5' },
  { lo: 9, hi: 26, label: 'No thermal stress', color: '#6ece58' },
  { lo: 26, hi: 32, label: 'Moderate heat stress', color: '#fdbf3c' },
  { lo: 32, hi: 38, label: 'Strong heat stress', color: '#f2703a' },
  { lo: 38, hi: Infinity, label: 'Very strong heat stress', color: '#c8233a' },
];
export const stressOf = (t) => STRESS.findIndex((s) => t >= s.lo && t < s.hi);

// Interpolate per-direction values at an arbitrary true wind direction.
export function atDirection(arr16, dirDeg) {
  const x = ((dirDeg % 360) + 360) % 360 / 22.5;
  const i0 = Math.floor(x) % 16, i1 = (i0 + 1) % 16, t = x - Math.floor(x);
  return arr16[i0] * (1 - t) + arr16[i1] * t;
}

export { airTemp, relHumidity };
