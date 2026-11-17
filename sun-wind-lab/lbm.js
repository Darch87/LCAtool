// Sun & Wind Lab — a 3D lattice-Boltzmann wind tunnel (D3Q19, BGK collision with a Smagorinsky LES closure).
// Pure module: runs in a Web Worker in the browser and in Node for the precomputed baseline.
//
// Tunnel frame: X runs with the wind (inlet at X = 0), Y across, Z up. The buildings are rotated into the tunnel,
// so every wind direction uses the same tunnel. Inlet: an urban atmospheric boundary layer (power law).
// Ground: rough partial-slip wall (a mix of bounce-back and specular reflection). Sides and top: free-slip. Outlet: zero-gradient.

export const Q = 19;
export const CX = new Int8Array([0, 1, -1, 0, 0, 0, 0, 1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0]);
export const CY = new Int8Array([0, 0, 0, 1, -1, 0, 0, 1, -1, -1, 1, 0, 0, 0, 0, 1, -1, 1, -1]);
export const CZ = new Int8Array([0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 1, -1, -1, 1, 1, -1, -1, 1]);
export const W = new Float32Array([1 / 3, 1 / 18, 1 / 18, 1 / 18, 1 / 18, 1 / 18, 1 / 18, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36, 1 / 36]);
export const OPP = new Uint8Array(19);
for (let i = 0; i < 19; i++) for (let j = 0; j < 19; j++) if (CX[i] === -CX[j] && CY[i] === -CY[j] && CZ[i] === -CZ[j]) OPP[i] = j;
// MIRROR[i*9 + (cy+1)*3 + (cz+1)] = the direction with CX[i] and the given cy, cz (for free-slip reflections).
const MIRROR = new Uint8Array(19 * 9);
for (let i = 0; i < 19; i++) for (let cy = -1; cy <= 1; cy++) for (let cz = -1; cz <= 1; cz++) {
  for (let q = 0; q < 19; q++) if (CX[q] === CX[i] && CY[q] === cy && CZ[q] === cz) MIRROR[i * 9 + (cy + 1) * 3 + (cz + 1)] = q;
}

// Power-law boundary layers: dense urban (AIJ guideline, alpha 0.27, gradient height 450 m) at the inlet,
// open country (alpha 0.14, 270 m) at the airport where the reference wind is measured.
export const ABL = { alphaCity: 0.27, zgCity: 450, alphaOpen: 0.14, zgOpen: 270 };
// Local wind / airport 10 m wind = (local lattice speed / uTop) * K_TOP.
export const K_TOP = Math.pow(330 / ABL.zgCity, ABL.alphaCity) * Math.pow(ABL.zgOpen / 10, ABL.alphaOpen);

// Default tunnel: centred on the Seagram tower, long enough downstream for the wake, 360 m high.
export const TUNNEL = { x0: -260, x1: 380, y0: -220, y1: 220, zTop: 330 };

export function makeGrid(cell, tunnel = TUNNEL) {
  const nx = Math.round((tunnel.x1 - tunnel.x0) / cell);
  const ny = Math.round((tunnel.y1 - tunnel.y0) / cell);
  const nz = Math.round(tunnel.zTop / cell);
  return { cell, nx, ny, nz, n: nx * ny * nz, ...tunnel };
}

// Flow direction (grid frame unit vector) for a wind blowing FROM grid-angle `fromGridDeg` (clockwise from grid north).
export function flowDir(fromGridDeg) {
  const a = (fromGridDeg + 180) * Math.PI / 180;
  return { u: Math.sin(a), v: Math.cos(a) };
}

// Voxelize grid-frame boxes into the tunnel for one wind direction.
export function voxelize(grid, boxes, center, fromGridDeg) {
  const { nx, ny, nz, cell, x0, y0 } = grid;
  const solid = new Uint8Array(grid.n);
  const f = flowDir(fromGridDeg);
  const p = { u: -f.v, v: f.u }; // tunnel +Y in grid frame
  for (const b of boxes) {
    const kz0 = Math.max(0, Math.floor(b.z0 / cell + 0.5));
    const kz1 = Math.min(nz, Math.floor(b.z1 / cell + 0.5));
    if (kz1 <= kz0) continue;
    // bounding range in tunnel coords
    const cs = [[b.u0, b.v0], [b.u1, b.v0], [b.u0, b.v1], [b.u1, b.v1]].map(([u, v]) => {
      const du = u - center.u, dv = v - center.v;
      return [du * f.u + dv * f.v, du * p.u + dv * p.v];
    });
    const X0 = Math.min(...cs.map((c) => c[0])), X1 = Math.max(...cs.map((c) => c[0]));
    const Y0 = Math.min(...cs.map((c) => c[1])), Y1 = Math.max(...cs.map((c) => c[1]));
    const i0 = Math.max(0, Math.floor((X0 - x0) / cell)), i1 = Math.min(nx - 1, Math.ceil((X1 - x0) / cell));
    const j0 = Math.max(0, Math.floor((Y0 - y0) / cell)), j1 = Math.min(ny - 1, Math.ceil((Y1 - y0) / cell));
    for (let j = j0; j <= j1; j++) {
      const Y = y0 + (j + 0.5) * cell;
      for (let i = i0; i <= i1; i++) {
        const X = x0 + (i + 0.5) * cell;
        const u = center.u + X * f.u + Y * p.u, v = center.v + X * f.v + Y * p.v;
        if (u < b.u0 || u > b.u1 || v < b.v0 || v > b.v1) continue;
        for (let k = kz0; k < kz1; k++) solid[i + nx * (j + ny * k)] = 1;
      }
    }
  }
  // keep the inlet and outlet planes clear
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) { solid[nx * (j + ny * k)] = 0; solid[nx - 1 + nx * (j + ny * k)] = 0; }
  return solid;
}

export function inletProfile(grid, uTop) {
  const prof = new Float32Array(grid.nz);
  for (let k = 0; k < grid.nz; k++) {
    const z = (k + 0.5) * grid.cell;
    prof[k] = uTop * Math.pow(Math.min(z, ABL.zgCity) / grid.zTop, ABL.alphaCity);
  }
  return prof;
}

export class Tunnel {
  constructor(grid, solid, { uTop = 0.12, nu0 = 0.0035, cs = 0.16, beta = 0.1 } = {}) {
    this.g = grid; this.solid = solid; this.uTop = uTop; this.beta = beta;
    this.tau0 = 3 * nu0 + 0.5; this.cs2 = cs * cs;
    const n = grid.n;
    this.A = new Float32Array(n * Q); this.B = new Float32Array(n * Q);
    this.prof = inletProfile(grid, uTop);
    this.step = 0;
    this.sumU = new Float32Array(n); this.sumV = new Float32Array(n); this.sumW = new Float32Array(n); this.sumR = new Float32Array(n);
    this.sumS = new Float32Array(n); this.sumS2 = new Float32Array(n);
    this.samples = 0;
    // initialise every fluid cell to the inlet profile
    const { nx, ny, nz } = grid;
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const c = i + nx * (j + ny * k);
      const ux = solid[c] ? 0 : this.prof[k];
      this.feq(this.A, c, 1, ux, 0, 0);
    }
  }

  feq(F, c, r, ux, uy, uz) {
    const usq = 1.5 * (ux * ux + uy * uy + uz * uz);
    const n = this.g.n;
    for (let i = 0; i < Q; i++) {
      const cu = 3 * (CX[i] * ux + CY[i] * uy + CZ[i] * uz);
      F[i * n + c] = W[i] * r * (1 + cu + 0.5 * cu * cu - usq);
    }
  }

  // Cells that need the careful path: tunnel walls, the first cell after the inlet, and cells next to a building.
  buildSlowMask() {
    const { nx, ny, nz, n } = this.g; const solid = this.solid; const nxy = nx * ny;
    const slow = new Uint8Array(n);
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 1; i < nx - 1; i++) {
      const c = i + nx * j + nxy * k;
      if (solid[c]) continue;
      if (j === 0 || j === ny - 1 || k === 0 || k === nz - 1 || i === 1) { slow[c] = 1; continue; }
      for (let q = 1; q < Q; q++) if (solid[c - (CX[q] + nx * CY[q] + nxy * CZ[q])]) { slow[c] = 1; break; }
    }
    return slow;
  }

  // Generic stream + collide for one cell, with every boundary rule.
  slowCell(c, ii, j, k, A, B, f, fe) {
    const { nx, ny, nz, n } = this.g; const solid = this.solid; const nxy = nx * ny;
    let r = 0, mx = 0, my = 0, mz = 0;
    for (let i = 0; i < Q; i++) {
      let si = ii - CX[i], sj = j - CY[i], sk = k - CZ[i];
      let dir = i, val;
      if (sk < 0) {
        // rough ground: part bounce-back (drag), part specular reflection (slip), standing in for a wall function
        let cy = CY[i], sj2 = j - CY[i];
        if (sj2 < 0 || sj2 >= ny) { cy = -cy; sj2 = j; }
        const dS = MIRROR[i * 9 + (cy + 1) * 3 + (-CZ[i] + 1)];
        const sc = ii - CX[i] + nx * sj2 + nxy * k;
        const spec = solid[sc] ? A[OPP[i] * n + c] : A[dS * n + sc];
        val = this.beta * A[OPP[i] * n + c] + (1 - this.beta) * spec;
      } else {
        if (sj < 0 || sj >= ny || sk >= nz) {
          let cy = CY[i], cz = CZ[i];
          if (sj < 0 || sj >= ny) { cy = -cy; sj = j; }
          if (sk >= nz) { cz = -cz; sk = k; }
          dir = MIRROR[i * 9 + (cy + 1) * 3 + (cz + 1)];
          si = ii - CX[i];
        }
        const sc = si + nx * sj + nxy * sk;
        val = solid[sc] ? A[OPP[i] * n + c] : A[dir * n + sc];
      }
      f[i] = val; r += val; mx += val * CX[i]; my += val * CY[i]; mz += val * CZ[i];
    }
    const ux = mx / r, uy = my / r, uz = mz / r;
    const usq = 1.5 * (ux * ux + uy * uy + uz * uz);
    let pxx = 0, pyy = 0, pzz = 0, pxy = 0, pxz = 0, pyz = 0;
    for (let i = 0; i < Q; i++) {
      const cu = 3 * (CX[i] * ux + CY[i] * uy + CZ[i] * uz);
      const e = W[i] * r * (1 + cu + 0.5 * cu * cu - usq);
      fe[i] = e;
      const d = f[i] - e;
      pxx += d * CX[i] * CX[i]; pyy += d * CY[i] * CY[i]; pzz += d * CZ[i] * CZ[i];
      pxy += d * CX[i] * CY[i]; pxz += d * CX[i] * CZ[i]; pyz += d * CY[i] * CZ[i];
    }
    const Qn = Math.sqrt(2 * (pxx * pxx + pyy * pyy + pzz * pzz + 2 * (pxy * pxy + pxz * pxz + pyz * pyz)));
    const tau = 0.5 * (this.tau0 + Math.sqrt(this.tau0 * this.tau0 + 18 * this.cs2 * Qn / r));
    const om = 1 / tau;
    for (let i = 0; i < Q; i++) B[i * n + c] = f[i] + om * (fe[i] - f[i]);
  }

  // Advance `steps` time steps. If `average` is true, accumulate the time-mean velocity and density.
  run(steps, average = false) {
    const { nx, ny, nz, n } = this.g;
    const solid = this.solid, prof = this.prof, tau0 = this.tau0, k18 = 18 * this.cs2;
    if (!this.slow) this.slow = this.buildSlowMask();
    const slow = this.slow;
    const f = new Float64Array(Q), fe = new Float64Array(Q);
    const nxy = nx * ny;
    const W0 = 1 / 3, W1 = 1 / 18, W2 = 1 / 36;
    const d = []; for (let i = 0; i < Q; i++) d.push(CX[i] + nx * CY[i] + nxy * CZ[i]);
    const [, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18] = d;
    const o1 = n, o2 = 2 * n, o3 = 3 * n, o4 = 4 * n, o5 = 5 * n, o6 = 6 * n, o7 = 7 * n, o8 = 8 * n, o9 = 9 * n;
    const o10 = 10 * n, o11 = 11 * n, o12 = 12 * n, o13 = 13 * n, o14 = 14 * n, o15 = 15 * n, o16 = 16 * n, o17 = 17 * n, o18 = 18 * n;
    for (let s = 0; s < steps; s++) {
      const A = this.A, B = this.B;
      for (let k = 0; k < nz; k++) {
        const ux0 = prof[k], usq0 = 1.5 * ux0 * ux0;
        for (let j = 0; j < ny; j++) {
          const row = nx * j + nxy * k;
          for (let i = 0; i < Q; i++) { const cu = 3 * CX[i] * ux0; B[i * n + row] = W[i] * (1 + cu + 0.5 * cu * cu - usq0); }
          for (let ii = 1; ii < nx - 1; ii++) {
            const c = row + ii;
            if (solid[c]) continue;
            if (slow[c]) { this.slowCell(c, ii, j, k, A, B, f, fe); continue; }
          // ---- fast path (generated, unrolled D3Q19) ----
          const f0 = A[c];
          const f1 = A[o1 + c - d1];
          const f2 = A[o2 + c - d2];
          const f3 = A[o3 + c - d3];
          const f4 = A[o4 + c - d4];
          const f5 = A[o5 + c - d5];
          const f6 = A[o6 + c - d6];
          const f7 = A[o7 + c - d7];
          const f8 = A[o8 + c - d8];
          const f9 = A[o9 + c - d9];
          const f10 = A[o10 + c - d10];
          const f11 = A[o11 + c - d11];
          const f12 = A[o12 + c - d12];
          const f13 = A[o13 + c - d13];
          const f14 = A[o14 + c - d14];
          const f15 = A[o15 + c - d15];
          const f16 = A[o16 + c - d16];
          const f17 = A[o17 + c - d17];
          const f18 = A[o18 + c - d18];
          const r = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8 + f9 + f10 + f11 + f12 + f13 + f14 + f15 + f16 + f17 + f18;
          const ir = 1 / r;
          const ux = ((f1 + f7 + f9 + f11 + f13) - (f2 + f8 + f10 + f12 + f14)) * ir;
          const uy = ((f3 + f7 + f10 + f15 + f17) - (f4 + f8 + f9 + f16 + f18)) * ir;
          const uz = ((f5 + f11 + f14 + f15 + f18) - (f6 + f12 + f13 + f16 + f17)) * ir;
          const usq = 1.5 * (ux * ux + uy * uy + uz * uz);
          const e0 = W0 * r * (1 - usq);
          const cu1 = 3 * (ux);
          const e1 = W1 * r * (1 + cu1 + 0.5 * cu1 * cu1 - usq);
          const cu2 = 3 * (-ux);
          const e2 = W1 * r * (1 + cu2 + 0.5 * cu2 * cu2 - usq);
          const cu3 = 3 * (uy);
          const e3 = W1 * r * (1 + cu3 + 0.5 * cu3 * cu3 - usq);
          const cu4 = 3 * (-uy);
          const e4 = W1 * r * (1 + cu4 + 0.5 * cu4 * cu4 - usq);
          const cu5 = 3 * (uz);
          const e5 = W1 * r * (1 + cu5 + 0.5 * cu5 * cu5 - usq);
          const cu6 = 3 * (-uz);
          const e6 = W1 * r * (1 + cu6 + 0.5 * cu6 * cu6 - usq);
          const cu7 = 3 * (ux +uy);
          const e7 = W2 * r * (1 + cu7 + 0.5 * cu7 * cu7 - usq);
          const cu8 = 3 * (-ux -uy);
          const e8 = W2 * r * (1 + cu8 + 0.5 * cu8 * cu8 - usq);
          const cu9 = 3 * (ux -uy);
          const e9 = W2 * r * (1 + cu9 + 0.5 * cu9 * cu9 - usq);
          const cu10 = 3 * (-ux +uy);
          const e10 = W2 * r * (1 + cu10 + 0.5 * cu10 * cu10 - usq);
          const cu11 = 3 * (ux +uz);
          const e11 = W2 * r * (1 + cu11 + 0.5 * cu11 * cu11 - usq);
          const cu12 = 3 * (-ux -uz);
          const e12 = W2 * r * (1 + cu12 + 0.5 * cu12 * cu12 - usq);
          const cu13 = 3 * (ux -uz);
          const e13 = W2 * r * (1 + cu13 + 0.5 * cu13 * cu13 - usq);
          const cu14 = 3 * (-ux +uz);
          const e14 = W2 * r * (1 + cu14 + 0.5 * cu14 * cu14 - usq);
          const cu15 = 3 * (uy +uz);
          const e15 = W2 * r * (1 + cu15 + 0.5 * cu15 * cu15 - usq);
          const cu16 = 3 * (-uy -uz);
          const e16 = W2 * r * (1 + cu16 + 0.5 * cu16 * cu16 - usq);
          const cu17 = 3 * (uy -uz);
          const e17 = W2 * r * (1 + cu17 + 0.5 * cu17 * cu17 - usq);
          const cu18 = 3 * (-uy +uz);
          const e18 = W2 * r * (1 + cu18 + 0.5 * cu18 * cu18 - usq);
          const n0 = f0 - e0;
          const n1 = f1 - e1;
          const n2 = f2 - e2;
          const n3 = f3 - e3;
          const n4 = f4 - e4;
          const n5 = f5 - e5;
          const n6 = f6 - e6;
          const n7 = f7 - e7;
          const n8 = f8 - e8;
          const n9 = f9 - e9;
          const n10 = f10 - e10;
          const n11 = f11 - e11;
          const n12 = f12 - e12;
          const n13 = f13 - e13;
          const n14 = f14 - e14;
          const n15 = f15 - e15;
          const n16 = f16 - e16;
          const n17 = f17 - e17;
          const n18 = f18 - e18;
          const pxx = n1 + n2 + n7 + n8 + n9 + n10 + n11 + n12 + n13 + n14, pyy = n3 + n4 + n7 + n8 + n9 + n10 + n15 + n16 + n17 + n18, pzz = n5 + n6 + n11 + n12 + n13 + n14 + n15 + n16 + n17 + n18;
          const pxy = (n7 + n8) - (n9 + n10), pxz = (n11 + n12) - (n13 + n14), pyz = (n15 + n16) - (n17 + n18);
          const Qn = Math.sqrt(2 * (pxx * pxx + pyy * pyy + pzz * pzz + 2 * (pxy * pxy + pxz * pxz + pyz * pyz)));
          const om = 2 / (tau0 + Math.sqrt(tau0 * tau0 + k18 * Qn * ir));
          B[c] = f0 - om * n0;
          B[o1 + c] = f1 - om * n1;
          B[o2 + c] = f2 - om * n2;
          B[o3 + c] = f3 - om * n3;
          B[o4 + c] = f4 - om * n4;
          B[o5 + c] = f5 - om * n5;
          B[o6 + c] = f6 - om * n6;
          B[o7 + c] = f7 - om * n7;
          B[o8 + c] = f8 - om * n8;
          B[o9 + c] = f9 - om * n9;
          B[o10 + c] = f10 - om * n10;
          B[o11 + c] = f11 - om * n11;
          B[o12 + c] = f12 - om * n12;
          B[o13 + c] = f13 - om * n13;
          B[o14 + c] = f14 - om * n14;
          B[o15 + c] = f15 - om * n15;
          B[o16 + c] = f16 - om * n16;
          B[o17 + c] = f17 - om * n17;
          B[o18 + c] = f18 - om * n18;
          }
          const co = row + nx - 1, cp = co - 1;
          for (let i = 0; i < Q; i++) B[i * n + co] = B[i * n + cp];
        }
      }
      this.A = B; this.B = A; this.step++;
      if (average) this.accumulate();
    }
  }

  accumulate() {
    const { n } = this.g; const A = this.A, solid = this.solid;
    for (let c = 0; c < n; c++) {
      if (solid[c]) continue;
      let r = 0, mx = 0, my = 0, mz = 0;
      for (let i = 0; i < Q; i++) { const v = A[i * n + c]; r += v; mx += v * CX[i]; my += v * CY[i]; mz += v * CZ[i]; }
      const ux = mx / r, uy = my / r, uz = mz / r, sp = Math.sqrt(ux * ux + uy * uy + uz * uz);
      this.sumU[c] += ux; this.sumV[c] += uy; this.sumW[c] += uz; this.sumR[c] += r; this.sumS[c] += sp; this.sumS2[c] += sp * sp;
    }
    this.samples++;
  }

  // Instantaneous velocity field (for live particles while the tunnel runs).
  velocity() {
    const { n } = this.g; const A = this.A, solid = this.solid;
    const out = new Float32Array(n * 3);
    for (let c = 0; c < n; c++) {
      if (solid[c]) continue;
      let r = 0, mx = 0, my = 0, mz = 0;
      for (let i = 0; i < Q; i++) { const v = A[i * n + c]; r += v; mx += v * CX[i]; my += v * CY[i]; mz += v * CZ[i]; }
      out[3 * c] = mx / r; out[3 * c + 1] = my / r; out[3 * c + 2] = mz / r;
    }
    return out;
  }

  // Time-mean fields; falls back to the instantaneous field before any averaging.
  mean() {
    const { n } = this.g;
    if (!this.samples) {
      const v = this.velocity(); const rho = new Float32Array(n).fill(1); const spd = new Float32Array(n), sd = new Float32Array(n);
      for (let c = 0; c < n; c++) spd[c] = Math.hypot(v[3 * c], v[3 * c + 1], v[3 * c + 2]);
      return { vel: v, rho, spd, sd };
    }
    const vel = new Float32Array(n * 3), rho = new Float32Array(n), spd = new Float32Array(n), sd = new Float32Array(n), s = this.samples;
    for (let c = 0; c < n; c++) {
      vel[3 * c] = this.sumU[c] / s; vel[3 * c + 1] = this.sumV[c] / s; vel[3 * c + 2] = this.sumW[c] / s; rho[c] = this.solid[c] ? 1 : this.sumR[c] / s;
      const m = this.sumS[c] / s; spd[c] = m; sd[c] = Math.sqrt(Math.max(0, this.sumS2[c] / s - m * m));
    }
    return { vel, rho, spd, sd };
  }

  healthy() {
    const A = this.A; for (let c = 0; c < A.length; c += 9973) if (!Number.isFinite(A[c])) return false; return true;
  }
}

// Steps for a run: about two flow-throughs to develop the flow, then one to average.
export function schedule(grid, uTop) {
  const flow = grid.nx / (uTop * 0.75);
  return { spinup: Math.round(1.6 * flow), average: Math.round(0.9 * flow) };
}
