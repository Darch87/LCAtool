// Sun & Wind Lab — turns one finished tunnel run into the pieces the page uses, all in the site's grid frame:
//  ped  — pedestrian-level speed ratio K = local mean speed / airport 10 m mean speed, on the GROUND grid
//  gust — gust-equivalent-mean factor (Lawson GEM: max(mean, (mean + 3σ) / 1.85) / mean)
//  cp   — pressure coefficient on each façade sensor, referenced to the approach wind at tower-roof height
//  vol  — a coarse 3D velocity field (K units, tunnel frame) for particles and streamlines
import { K_TOP, flowDir, ABL } from './lbm.js';
import { TOWER_CENTER, GRID_ROT_DEG } from './site.js';
import { GROUND } from './analysis.js';

export const VOL = { stride: 2, maxZ: 240, scale: 80 };
export const REF_HEIGHT = 157;
export const PED_LAYER = 1;
export const PED_HEIGHT = 2;

export function tunnelCoords(dirTrue, u, v) {
  const f = flowDir(dirTrue - GRID_ROT_DEG);
  const du = u - TOWER_CENTER.u, dv = v - TOWER_CENTER.v;
  return { X: du * f.u + dv * f.v, Y: du * -f.v + dv * f.u, f };
}

export function extractDirection(t, dirTrue, facSensors = []) {
  const g = t.g; const { nx, ny, nz, cell, x0, y0 } = g;
  const { rho, spd, sd, vel } = t.mean();
  const toK = K_TOP / t.uTop;
  const ped = new Float32Array(GROUND.nu * GROUND.nv);
  // The first cell above the ground sits inside the modelled roughness layer, so speeds are read on the second
  // cell and brought down to pedestrian height (2 m) with the approach boundary-layer profile.
  const pedScale = Math.pow(PED_HEIGHT / ((PED_LAYER + 0.5) * cell), ABL.alphaCity);
  const gust = new Float32Array(GROUND.nu * GROUND.nv);
  const at = (i, j, k) => i + nx * (j + ny * k);
  // bilinear in X, Y on the first fluid layer, skipping solid cells
  const sample = (X, Y, k, arr) => {
    const fx = (X - x0) / cell - 0.5, fy = (Y - y0) / cell - 0.5;
    const i0 = Math.floor(fx), j0 = Math.floor(fy);
    let s = 0, w = 0;
    for (let a = 0; a <= 1; a++) for (let b = 0; b <= 1; b++) {
      const i = i0 + a, j = j0 + b;
      if (i < 0 || j < 0 || i >= nx || j >= ny) continue;
      const c = at(i, j, k);
      if (t.solid[c]) continue;
      const ww = (a ? fx - i0 : 1 - (fx - i0)) * (b ? fy - j0 : 1 - (fy - j0));
      s += arr[c] * ww; w += ww;
    }
    return w > 1e-6 ? s / w : NaN;
  };
  for (let j = 0; j < GROUND.nv; j++) for (let i = 0; i < GROUND.nu; i++) {
    const u = GROUND.u0 + (i + 0.5) * GROUND.step, v = GROUND.v0 + (j + 0.5) * GROUND.step;
    const { X, Y } = tunnelCoords(dirTrue, u, v);
    const m = sample(X, Y, PED_LAYER, spd), s = sample(X, Y, PED_LAYER, sd);
    const idx = i + GROUND.nu * j;
    ped[idx] = m * toK * pedScale;
    gust[idx] = Number.isFinite(m) && m > 0 ? Math.max(1, (m + 3 * s) / 1.85 / m) : NaN;
  }
  // façade pressure: the fluid cell just outside each sensor
  const kRef = Math.min(nz - 1, Math.floor(REF_HEIGHT / cell));
  const uRef = t.prof[kRef];
  const q = 0.5 * uRef * uRef;
  // Reference static pressure: the approach flow just inside the inlet. The inlet plane itself is pinned at
  // density 1, but blockage raises the whole tunnel's pressure, so referencing the inlet would push every Cp up.
  let rs = 0, rn = 0;
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) { const c = at(3, j, k); if (!t.solid[c]) { rs += rho[c]; rn++; } }
  const rhoRef = rn ? rs / rn : 1;
  const cp = new Float32Array(facSensors.length);
  facSensors.forEach((s, n) => {
    const off = cell * 0.8;
    const { X, Y } = tunnelCoords(dirTrue, s.u + s.n[0] * off, s.v + s.n[1] * off);
    const z = s.z + s.n[2] * off;
    const i = Math.floor((X - x0) / cell), j = Math.floor((Y - y0) / cell), k = Math.min(nz - 1, Math.max(0, Math.floor(z / cell)));
    if (i < 0 || j < 0 || i >= nx || j >= ny) { cp[n] = NaN; return; }
    let c = at(i, j, k);
    if (t.solid[c]) { // step outward along the normal until fluid
      let found = false;
      for (let st = 1; st < 4 && !found; st++) {
        const p = tunnelCoords(dirTrue, s.u + s.n[0] * (off + st * cell * 0.5), s.v + s.n[1] * (off + st * cell * 0.5));
        const ii = Math.floor((p.X - x0) / cell), jj = Math.floor((p.Y - y0) / cell);
        const kk = Math.min(nz - 1, Math.floor((s.z + s.n[2] * (off + st * cell * 0.5)) / cell));
        if (ii >= 0 && jj >= 0 && ii < nx && jj < ny) { c = at(ii, jj, kk); found = !t.solid[c]; }
      }
      if (!found) { cp[n] = NaN; return; }
    }
    cp[n] = (rho[c] - rhoRef) / 3 / q;
  });
  // coarse 3D field, tunnel frame
  const st = VOL.stride; const vnx = Math.floor(nx / st), vny = Math.floor(ny / st), vnz = Math.min(Math.floor(nz / st), Math.floor(VOL.maxZ / (cell * st)));
  const vol = new Int8Array(vnx * vny * vnz * 3);
  for (let k = 0; k < vnz; k++) for (let j = 0; j < vny; j++) for (let i = 0; i < vnx; i++) {
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (let a = 0; a < st; a++) for (let b = 0; b < st; b++) for (let d = 0; d < st; d++) {
      const c = at(i * st + a, j * st + b, k * st + d);
      if (t.solid[c]) continue;
      sx += vel[3 * c]; sy += vel[3 * c + 1]; sz += vel[3 * c + 2]; n++;
    }
    const o = 3 * (i + vnx * (j + vny * k));
    if (!n) continue;
    const cl = (x) => Math.max(-127, Math.min(127, Math.round(x / n * toK * VOL.scale)));
    vol[o] = cl(sx); vol[o + 1] = cl(sy); vol[o + 2] = cl(sz);
  }
  return {
    dir: dirTrue, ped, gust, cp, vol,
    volMeta: { nx: vnx, ny: vny, nz: vnz, cell: cell * st, x0, y0, scale: VOL.scale },
    steps: t.step,
  };
}

// Façade-to-façade pressure difference for infiltration: spread of the slab's face-mean Cp.
export function deltaCp(cp, facSensors) {
  const acc = {};
  facSensors.forEach((s, i) => {
    if (s.box !== 'slab' || s.face === 'R' || !Number.isFinite(cp[i])) return;
    (acc[s.face] ||= { s: 0, n: 0 }); acc[s.face].s += cp[i]; acc[s.face].n++;
  });
  const means = Object.values(acc).map((a) => a.s / a.n);
  return means.length ? Math.max(...means) - Math.min(...means) : 0.9;
}
