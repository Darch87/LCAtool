// Lifecycle Takeoff · drawings. Three jobs, all without a DOM so they run in tests:
// 1. drawSheet(): draw a CAD-style sheet (site plan, typical floor plan, section) from a building description.
// 2. parseSVG() + readSheet(): read a vector drawing back — columns, grid, bays, cores, labelled blocks, levels, notes —
//    with the scale taken from its own dimension strings, the way vector takeoff tools read CAD PDFs.
// 3. sheetsToBuilding(): merge the sheets of a set into one building description, recording where every value came from.
import { levelHeights, blockHeight, FT } from './engine.js';

const r1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function ftIn(m) {
  const tIn = Math.round(m / 0.0254 * 2) / 2;
  let ft = Math.floor(tIn / 12), inch = tIn - ft * 12;
  if (inch >= 12) { ft++; inch -= 12; }
  const half = inch % 1 ? '½' : '';
  return `${ft}'-${Math.floor(inch)}${half}"`;
}

/* ------------------------------------------------------------------ drawing */

const W = 1189, H = 841; // A0 landscape, 1 unit = 1 mm on paper
const STYLE = `<style>
  .bd{fill:none;stroke:#111;stroke-width:1.6}.th{fill:none;stroke:#111;stroke-width:0.9}.tn{fill:none;stroke:#111;stroke-width:0.35}
  .gr{stroke:#999;stroke-width:0.35;stroke-dasharray:6 2 1 2}.col{fill:#111}.core{fill:#d9d9d9;stroke:#111;stroke-width:0.8}
  .hatch{fill:#ececec;stroke:#111;stroke-width:0.6}.dash{fill:none;stroke:#111;stroke-width:0.7;stroke-dasharray:5 3}
  .pool{fill:#dfeef5;stroke:#111;stroke-width:0.6}.mul{stroke:#111;stroke-width:0.3}
  text{font-family:Arial,Helvetica,sans-serif;fill:#111}.t1{font-size:15px;font-weight:700}.t2{font-size:9px}.t3{font-size:6.5px}.dim{font-size:6px}.lab{font-size:7px;font-weight:700}
</style>`;

function frame(title, address, sheet, sub, notes = []) {
  const n = notes.map((t, i) => `<text class="t3" x="${W - 330}" y="${H - 150 + i * 10}">${esc(t)}</text>`).join('');
  return `<rect class="bd" x="10" y="10" width="${W - 20}" height="${H - 20}"/>
<rect class="th" x="${W - 340}" y="${H - 170}" width="330" height="160"/>
<text class="t3" x="${W - 330}" y="${H - 160}">GENERAL NOTES</text>${n}
<text class="t1" x="${W - 330}" y="${H - 62}">${esc(title)}</text>
<text class="t2" x="${W - 330}" y="${H - 49}">${esc(address)}</text>
<text class="t2" x="${W - 330}" y="${H - 36}">${esc(sub)}</text>
<text class="t1" x="${W - 22}" y="${H - 62}" text-anchor="end">${esc(sheet)}</text>
<text class="t3" x="${W - 330}" y="${H - 18}">RECONSTRUCTION FROM PUBLISHED DIMENSIONS · INDICATIVE ONLY</text>`;
}

function dimH(x1, x2, y, label, tick = 3) {
  return `<line class="tn" x1="${r1(x1)}" y1="${r1(y)}" x2="${r1(x2)}" y2="${r1(y)}"/><line class="tn" x1="${r1(x1)}" y1="${r1(y - tick)}" x2="${r1(x1)}" y2="${r1(y + tick)}"/><line class="tn" x1="${r1(x2)}" y1="${r1(y - tick)}" x2="${r1(x2)}" y2="${r1(y + tick)}"/><text class="dim" x="${r1((x1 + x2) / 2)}" y="${r1(y - 2)}" text-anchor="middle">${esc(label)}</text>`;
}
function dimV(y1, y2, x, label, tick = 3) {
  return `<line class="tn" x1="${r1(x)}" y1="${r1(y1)}" x2="${r1(x)}" y2="${r1(y2)}"/><line class="tn" x1="${r1(x - tick)}" y1="${r1(y1)}" x2="${r1(x + tick)}" y2="${r1(y1)}"/><line class="tn" x1="${r1(x - tick)}" y1="${r1(y2)}" x2="${r1(x + tick)}" y2="${r1(y2)}"/><text class="dim" x="${r1(x - 3)}" y="${r1((y1 + y2) / 2)}" text-anchor="end">${esc(label)}</text>`;
}

export function notesFor(B) {
  const n = [];
  const st = B.structure || {}, f = B.facade || {};
  const core = (B.cores || []).find((c) => c.toLevel);
  if (st.frame === 'steel') n.push(`STRUCTURE: STEEL FRAME${st.encasement ? ', COLUMNS AND BEAMS ENCASED IN CONCRETE' : ''}.`);
  else if (st.frame) n.push(`STRUCTURE: ${st.frame.toUpperCase()} FRAME.`);
  if (core) n.push(`CONCRETE CORE SHEAR WALLS TO FLOOR ${core.toLevel}.`);
  if (f.system === 'bronze-cw') n.push('CURTAIN WALL: BRONZE MULLIONS, MUNTZ METAL SPANDRELS, 1/4" TINTED PLATE GLASS.');
  else if (f.system) n.push(`FACADE: ${f.system.toUpperCase().replace(/-/g, ' ')}.`);
  for (const s of f.secondary || []) n.push(`${s.name.toUpperCase()}.`);
  for (const fi of B.interiors?.finishes || []) n.push(`${fi.name.toUpperCase()}.`);
  if (B.services?.lifts) n.push(`${B.services.lifts} PASSENGER ELEVATORS IN THE CORE.`);
  if (B.basement?.levels) n.push(`${B.basement.levels} BASEMENT LEVELS UNDER THE FULL LOT.`);
  return n.map((t, i) => `${i + 1}. ${t}`);
}

// Typical tower floor: slab edge, curtain-wall module, column grid with bubbles, cores, lifts, stair, dimensions.
function sheetTypical(B) {
  const t = B.blocks.find((b) => b.kind === 'tower') || B.blocks[0];
  const s = 14, ox = 250, oy = 110; // 1 m = 14 units (≈1:70)
  const X = (x) => ox + (x - t.x) * s, Y = (y) => oy + (t.y + t.d - y) * s;
  const parts = [];
  parts.push(`<rect class="bd" x="${r1(X(t.x))}" y="${r1(Y(t.y + t.d))}" width="${r1(t.w * s)}" height="${r1(t.d * s)}"/>`);
  // curtain wall module ticks (4'-7½")
  const mod = 55.5 * 0.0254;
  for (let a = mod; a < t.w - 0.01; a += mod) parts.push(`<line class="mul" x1="${r1(X(t.x + a))}" y1="${r1(Y(t.y))}" x2="${r1(X(t.x + a))}" y2="${r1(Y(t.y) + 4)}"/><line class="mul" x1="${r1(X(t.x + a))}" y1="${r1(Y(t.y + t.d))}" x2="${r1(X(t.x + a))}" y2="${r1(Y(t.y + t.d) - 4)}"/>`);
  for (let a = mod; a < t.d - 0.01; a += mod) parts.push(`<line class="mul" x1="${r1(X(t.x))}" y1="${r1(Y(t.y + a))}" x2="${r1(X(t.x) + 4)}" y2="${r1(Y(t.y + a))}"/><line class="mul" x1="${r1(X(t.x + t.w))}" y1="${r1(Y(t.y + a))}" x2="${r1(X(t.x + t.w) - 4)}" y2="${r1(Y(t.y + a))}"/>`);
  // grid
  const ox0 = t.colInsetX ?? t.colInset ?? 0, oy0 = t.colInsetY ?? t.colInset ?? 0;
  const xs = Array.from({ length: t.baysX + 1 }, (_, i) => t.x + ox0 + i * t.bayX);
  const ys = Array.from({ length: t.baysY + 1 }, (_, j) => t.y + oy0 + j * t.bayY);
  xs.forEach((x, i) => parts.push(`<line class="gr" x1="${r1(X(x))}" y1="${r1(Y(t.y + t.d) - 40)}" x2="${r1(X(x))}" y2="${r1(Y(t.y) + 14)}"/><circle class="tn" cx="${r1(X(x))}" cy="${r1(Y(t.y + t.d) - 46)}" r="6"/><text class="lab" x="${r1(X(x))}" y="${r1(Y(t.y + t.d) - 43.5)}" text-anchor="middle">${String.fromCharCode(65 + i)}</text>`));
  ys.forEach((y, j) => parts.push(`<line class="gr" x1="${r1(X(t.x) - 40)}" y1="${r1(Y(y))}" x2="${r1(X(t.x + t.w) + 14)}" y2="${r1(Y(y))}"/><circle class="tn" cx="${r1(X(t.x) - 46)}" cy="${r1(Y(y))}" r="6"/><text class="lab" x="${r1(X(t.x) - 46)}" y="${r1(Y(y) + 2.5)}" text-anchor="middle">${j + 1}</text>`));
  // cores
  for (const c of (B.cores || []).filter((c) => c.blockId === t.id)) {
    const cls = /spine/i.test(c.id + c.name) ? 'hatch' : 'core';
    parts.push(`<rect class="${cls}" x="${r1(X(c.x))}" y="${r1(Y(c.y + c.d))}" width="${r1(c.w * s)}" height="${r1(c.d * s)}"/>`);
    const label = /spine/i.test(c.id + c.name) ? ['SPINE', 'SHEAR WALL', 'STAIR'] : ['ELEVATOR CORE'];
    label.forEach((l, i) => parts.push(`<text class="lab" x="${r1(X(c.x + c.w / 2))}" y="${r1(Y(c.y + c.d / 2) - 30 + i * 9)}" text-anchor="middle">${l}</text>`));
    if (!/spine/i.test(c.id + c.name)) {
      // three lift corridors, three shafts on each side
      const n = B.services?.lifts || 0, per = Math.ceil(n / 6), shaft = c.w / 4.4;
      let k = 0;
      for (let corr = 0; corr < 3 && k < n; corr++) for (let side = 0; side < 2 && k < n; side++) for (let q = 0; q < per && k < n; q++, k++) {
        const sx0 = c.x + (side ? c.w - shaft - 0.3 : 0.3), sy0 = c.y + c.d * (corr / 3) + 1.2 + q * (shaft + 0.2);
        parts.push(`<rect class="tn" x="${r1(X(sx0))}" y="${r1(Y(sy0 + shaft))}" width="${r1(shaft * s)}" height="${r1(shaft * s)}"/><text class="t3" x="${r1(X(sx0 + shaft / 2))}" y="${r1(Y(sy0 + shaft / 2) + 2)}" text-anchor="middle">ELEV</text>`);
      }
    }
  }
  // columns
  const cs = 0.75;
  for (const x of xs) for (const y of ys) parts.push(`<rect class="col" x="${r1(X(x - cs / 2))}" y="${r1(Y(y + cs / 2))}" width="${r1(cs * s)}" height="${r1(cs * s)}"/>`);
  // dimensions: bays along north edge, overall
  for (let i = 0; i < xs.length - 1; i++) parts.push(dimH(X(xs[i]), X(xs[i + 1]), Y(t.y + t.d) - 22, ftIn(t.bayX)));
  for (let j = 0; j < ys.length - 1; j++) parts.push(dimV(Y(ys[j]), Y(ys[j + 1]), X(t.x + t.w) + 34, ftIn(t.bayY)));
  parts.push(dimH(X(t.x), X(t.x + t.w), Y(t.y) + 30, ftIn(t.w)));
  parts.push(dimV(Y(t.y + t.d), Y(t.y), X(t.x) - 64, ftIn(t.d)));
  parts.push(`<text class="t2" x="${r1(X(t.x + t.w / 2))}" y="${r1(Y(t.y) + 48)}" text-anchor="middle">PARK AVENUE (WEST) ←</text>`);
  parts.push(`<text class="t3" x="${r1(X(t.x) + 6)}" y="${r1(Y(t.y + t.d) + 12)}">OFFICE</text><text class="t3" x="${r1(X(t.x + t.w) - 30)}" y="${r1(Y(t.y) - 8)}">OFFICE</text>`);
  const top = t.levels - (t.topF2F ? 1 : 0);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${STYLE}<rect width="${W}" height="${H}" fill="#fff"/>
${frame(B.name.toUpperCase(), String(B.address || '').toUpperCase(), 'A-111', `TYPICAL OFFICE FLOOR PLAN · LEVELS 11–${top} · SCALE 1:70`, notesFor(B))}
${parts.join('\n')}
<text class="t2" x="60" y="60">N ↑</text></svg>`;
}

// Ground and site plan: lot lines, streets, blocks labelled with storey counts, plaza, pools.
function sheetSite(B) {
  const lot = B.site?.lot || { w: 100, d: 60 };
  const s = 8, ox = 120, oy = 120;
  const X = (x) => ox + x * s, Y = (y) => oy + (lot.d - y) * s;
  const p = [];
  p.push(`<rect class="bd" x="${X(0)}" y="${r1(Y(lot.d))}" width="${r1(lot.w * s)}" height="${r1(lot.d * s)}"/>`);
  p.push(dimH(X(0), X(lot.w), Y(lot.d) - 26, ftIn(lot.w)));
  p.push(dimV(Y(lot.d), Y(0), X(0) - 44, ftIn(lot.d)));
  p.push(`<text class="t2" transform="translate(${X(0) - 64} ${r1(Y(lot.d / 2))}) rotate(-90)" text-anchor="middle">PARK AVENUE</text>`);
  p.push(`<text class="t2" x="${r1(X(lot.w / 2))}" y="${r1(Y(0) + 40)}" text-anchor="middle">EAST 52ND STREET</text><text class="t2" x="${r1(X(lot.w / 2))}" y="${r1(Y(lot.d) - 44)}" text-anchor="middle">EAST 53RD STREET</text>`);
  const tower = B.blocks.find((b) => b.kind === 'tower');
  for (const b of B.blocks) {
    const stacked = b.z0 > 0;
    const host = stacked ? B.blocks.find((o) => o !== b && Math.abs((o.z0 || 0) + blockHeight(o) - b.z0) < 0.3) : null;
    const totalStoreys = b.levels + (host ? host.levels : 0);
    const mech = b.topF2F ? 1 : 0;
    p.push(`<rect class="${stacked ? 'dash' : 'th'}" x="${r1(X(b.x))}" y="${r1(Y(b.y + b.d))}" width="${r1(b.w * s)}" height="${r1(b.d * s)}"/>`);
    const label = b.kind === 'tower' ? `TOWER · ${b.levels - mech} STORIES${mech ? ' + MECH' : ''}` : `${b.name.toUpperCase().replace(/\s*\(.*\)/, '')} · ${totalStoreys} STORIES`;
    const ly = stacked ? b.y + b.d / 2 : b === tower ? b.y + b.d / 2 : b.y + 3;
    p.push(`<text class="lab" x="${r1(X(b.x + b.w / 2))}" y="${r1(Y(ly))}" text-anchor="middle">${esc(label)}</text>`);
  }
  if (tower) {
    p.push(dimH(X(0), X(tower.x), Y(tower.y + tower.d) - 10, ftIn(tower.x)));
    for (const b of B.blocks.filter((b) => b.kind === 'tower')) {
      const ox0 = b.colInsetX ?? 0, oy0 = b.colInsetY ?? 0;
      for (let i = 0; i <= b.baysX; i++) for (let j = 0; j <= b.baysY; j++) { const cx = b.x + ox0 + i * b.bayX, cy = b.y + oy0 + j * b.bayY; p.push(`<rect class="col" x="${r1(X(cx) - 3)}" y="${r1(Y(cy) - 3)}" width="6" height="6"/>`); }
    }
    // plaza in front of the tower
    const pz = { x: 0.3, y: tower.y, w: tower.x - 0.6, d: tower.d };
    p.push(`<rect class="tn" x="${r1(X(pz.x))}" y="${r1(Y(pz.y + pz.d))}" width="${r1(pz.w * s)}" height="${r1(pz.d * s)}"/><text class="lab" x="${r1(X(pz.x + pz.w / 2))}" y="${r1(Y(pz.y + pz.d / 2))}" text-anchor="middle">GRANITE PLAZA</text>`);
    (B.site?.pools || []).forEach((q, i) => {
      const qd = Math.min(q.d, pz.d / 2 - 3);
      const py = i === 0 ? pz.y + 1.5 : pz.y + pz.d - 1.5 - qd;
      const px = pz.x + (pz.w - q.w) / 2;
      p.push(`<rect class="pool" x="${r1(X(px))}" y="${r1(Y(py + qd))}" width="${r1(q.w * s)}" height="${r1(qd * s)}"/><text class="t3" x="${r1(X(px + q.w / 2))}" y="${r1(Y(py + qd / 2))}" text-anchor="middle">POOL ${ftIn(q.w)} × ${ftIn(q.d)}</text>`);
    });
  }
  const bs = B.basement;
  const notes = notesFor(B);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${STYLE}<rect width="${W}" height="${H}" fill="#fff"/>
${frame(B.name.toUpperCase(), String(B.address || '').toUpperCase(), 'A-101', 'GROUND FLOOR AND SITE PLAN · SCALE 1:125', notes)}
${p.join('\n')}<text class="t2" x="60" y="60">N ↑</text></svg>`;
}

// East-west section through the tower and rear blocks with every level line labelled.
function sheetSection(B) {
  const lot = B.site?.lot || { w: 100 };
  const s = 4, ox = 200, base = 740;
  const X = (x) => ox + x * s, Z = (z) => base - z * s;
  const p = [];
  const bs = B.basement;
  p.push(`<line class="bd" x1="${X(-8)}" y1="${Z(0)}" x2="${X(lot.w + 8)}" y2="${Z(0)}"/><text class="t3" x="${X(lot.w + 10)}" y="${Z(0) + 2}">GRADE</text>`);
  const tower = B.blocks.find((b) => b.kind === 'tower') || B.blocks[0];
  for (const b of B.blocks) {
    const zs = []; let z = b.z0 || 0; for (const h of levelHeights(b)) { zs.push(z); z += h; } zs.push(z);
    p.push(`<rect class="th" x="${r1(X(b.x))}" y="${r1(Z(z))}" width="${r1(b.w * s)}" height="${r1((z - (b.z0 || 0)) * s)}"/>`);
    if (b !== tower) continue;
    zs.forEach((lz, i) => {
      const name = i === zs.length - 1 ? 'ROOF' : i === zs.length - 2 && b.topF2F ? 'MECH' : `L${i + 1}`;
      p.push(`<line class="tn" x1="${r1(X(b.x) - 60)}" y1="${r1(Z(lz))}" x2="${r1(X(b.x + b.w))}" y2="${r1(Z(lz))}"/><text class="t3" x="${r1(X(b.x) - 62)}" y="${r1(Z(lz) + 2)}" text-anchor="end">${name}</text>`);
    });
    p.push(dimV(Z(z), Z(0), X(b.x + b.w) + 20, ftIn(z)));
    p.push(dimH(X(b.x), X(b.x + b.w), Z(z) - 14, ftIn(b.w)));
  }
  if (bs) for (let i = 1; i <= bs.levels; i++) {
    const lz = -i * bs.f2f;
    p.push(`<line class="tn" x1="${r1(X(bs.x) - 60)}" y1="${r1(Z(lz))}" x2="${r1(X(bs.x + bs.w))}" y2="${r1(Z(lz))}"/><text class="t3" x="${r1(X(bs.x) - 62)}" y="${r1(Z(lz) + 2)}" text-anchor="end">B${i}</text>`);
  }
  p.push(`<text class="t2" x="${X(0)}" y="${Z(-14)}">PARK AVENUE ← WEST</text><text class="t2" x="${X(lot.w)}" y="${Z(-14)}" text-anchor="end">EAST →</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${STYLE}<rect width="${W}" height="${H}" fill="#fff"/>
${frame(B.name.toUpperCase(), String(B.address || '').toUpperCase(), 'A-301', 'BUILDING SECTION EAST–WEST · SCALE 1:250', notesFor(B).slice(0, 2))}
${p.join('\n')}</svg>`;
}

export function drawSheet(B, kind) { return kind === 'site' ? sheetSite(B) : kind === 'section' ? sheetSection(B) : sheetTypical(B); }

/* ------------------------------------------------------------------ SVG parsing */

const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
const I = [1, 0, 0, 1, 0, 0];
function parseTransform(s) {
  let m = I;
  for (const [, fn, args] of String(s || '').matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const a = args.split(/[\s,]+/).filter(Boolean).map(Number);
    if (fn === 'translate') m = mul(m, [1, 0, 0, 1, a[0] || 0, a[1] || 0]);
    else if (fn === 'scale') m = mul(m, [a[0], 0, 0, a[1] ?? a[0], 0, 0]);
    else if (fn === 'matrix' && a.length === 6) m = mul(m, a);
    else if (fn === 'rotate') { const r = (a[0] || 0) * Math.PI / 180, c = Math.cos(r), s2 = Math.sin(r); m = mul(m, [c, s2, -s2, c, 0, 0]); }
  }
  return m;
}
const ap = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const attr = (s, k) => { const m = s.match(new RegExp(`(?:^|\\s)${k}\\s*=\\s*"([^"]*)"`)) || s.match(new RegExp(`(?:^|\\s)${k}\\s*=\\s*'([^']*)'`)); return m ? m[1] : null; };
const num = (s, k) => { const v = parseFloat(attr(s, k)); return Number.isFinite(v) ? v : 0; };

function pathPoints(d) {
  const out = []; let cur = [], x = 0, y = 0, sx = 0, sy = 0;
  const toks = String(d).match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  let i = 0, cmd = '';
  const n = () => parseFloat(toks[i++]);
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    switch (cmd.toUpperCase()) {
      case 'M': { const a = n(), b = n(); x = rel ? x + a : a; y = rel ? y + b : b; if (cur.length) out.push({ pts: cur, closed: false }); cur = [[x, y]]; sx = x; sy = y; cmd = rel ? 'l' : 'L'; break; }
      case 'L': { const a = n(), b = n(); x = rel ? x + a : a; y = rel ? y + b : b; cur.push([x, y]); break; }
      case 'H': { const a = n(); x = rel ? x + a : a; cur.push([x, y]); break; }
      case 'V': { const b = n(); y = rel ? y + b : b; cur.push([x, y]); break; }
      case 'C': { n(); n(); n(); n(); const a = n(), b = n(); x = rel ? x + a : a; y = rel ? y + b : b; cur.push([x, y]); break; }
      case 'S': case 'Q': { n(); n(); const a = n(), b = n(); x = rel ? x + a : a; y = rel ? y + b : b; cur.push([x, y]); break; }
      case 'T': { const a = n(), b = n(); x = rel ? x + a : a; y = rel ? y + b : b; cur.push([x, y]); break; }
      case 'A': { n(); n(); n(); n(); n(); const a = n(), b = n(); x = rel ? x + a : a; y = rel ? y + b : b; cur.push([x, y]); break; }
      case 'Z': { if (cur.length) out.push({ pts: cur, closed: true }); cur = []; x = sx; y = sy; break; }
      default: i++;
    }
  }
  if (cur.length) out.push({ pts: cur, closed: false });
  return out;
}

// Parse an SVG into primitives: closed shapes, open polylines and text, all in one coordinate space.
export function parseSVG(svg) {
  const shapes = [], lines = [], texts = [];
  const stack = [I];
  const classFill = {};
  for (const [, sel, body] of String(svg).matchAll(/\.([\w-]+)\s*\{([^}]*)\}/g)) { const f = body.match(/fill\s*:\s*([^;]+)/); if (f) classFill[sel] = f[1].trim(); }
  const re = /<(\/?)([a-zA-Z]+)((?:\s+[^>]*?)?)(\/?)>/g;
  let m;
  while ((m = re.exec(svg))) {
    const [, close, tag, a, self] = m;
    const T = stack[stack.length - 1];
    if (tag === 'g') { if (close) stack.pop(); else if (!self) stack.push(mul(T, parseTransform(attr(a, 'transform')))); continue; }
    if (close) continue;
    const M = attr(a, 'transform') ? mul(T, parseTransform(attr(a, 'transform'))) : T;
    const cls = (attr(a, 'class') || '').split(/\s+/)[0];
    let fill = attr(a, 'fill') ?? (attr(a, 'style') || '').match(/fill\s*:\s*([^;]+)/)?.[1] ?? classFill[cls] ?? (tag === 'line' || tag === 'polyline' ? 'none' : '#000');
    fill = String(fill).trim();
    const push = (pts, closed) => { const P = pts.map(([x, y]) => ap(M, x, y)); (closed ? shapes : lines).push({ pts: P, closed, fill, cls }); };
    if (tag === 'rect') { const x = num(a, 'x'), y = num(a, 'y'), w = num(a, 'width'), h = num(a, 'height'); if (w > 0 && h > 0) push([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true); }
    else if (tag === 'line') push([[num(a, 'x1'), num(a, 'y1')], [num(a, 'x2'), num(a, 'y2')]], false);
    else if (tag === 'polygon' || tag === 'polyline') { const v = (attr(a, 'points') || '').trim().split(/[\s,]+/).map(Number); const pts = []; for (let i = 0; i + 1 < v.length; i += 2) pts.push([v[i], v[i + 1]]); if (pts.length > 1) push(pts, tag === 'polygon'); }
    else if (tag === 'path') for (const sp of pathPoints(attr(a, 'd') || '')) push(sp.pts, sp.closed);
    else if (tag === 'circle') { const cx = num(a, 'cx'), cy = num(a, 'cy'), r = num(a, 'r'); const pts = []; for (let k = 0; k < 12; k++) pts.push([cx + r * Math.cos(k * Math.PI / 6), cy + r * Math.sin(k * Math.PI / 6)]); push(pts, true); shapes[shapes.length - 1].circle = true; }
    else if (tag === 'text' && !self) {
      const end = svg.indexOf('</text>', re.lastIndex);
      const raw = svg.slice(re.lastIndex, end).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      const [x, y] = ap(M, num(a, 'x'), num(a, 'y'));
      texts.push({ x, y, s: raw.trim() });
      re.lastIndex = end + 7;
    }
  }
  for (const s of shapes) { const xs = s.pts.map((p) => p[0]), ys = s.pts.map((p) => p[1]); Object.assign(s, { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }); s.w = s.x1 - s.x0; s.h = s.y1 - s.y0; s.cx = (s.x0 + s.x1) / 2; s.cy = (s.y0 + s.y1) / 2; }
  return { shapes, lines, texts };
}

/* ------------------------------------------------------------------ reading */

// "27'-9"", "145'-0"", "8.46 m", "8460 mm" → metres
export function parseDim(s) {
  const t = String(s).replace(/[′’]/g, "'").replace(/[″”]/g, '"');
  let m = t.match(/(\d+)\s*'\s*-?\s*(\d+)?\s*(½|\d\/\d)?\s*"?/);
  if (m) { let inch = Number(m[2] || 0); if (m[3]) { const [a, b] = m[3] === '½' ? [1, 2] : m[3].split('/').map(Number); inch += a / b; } return (Number(m[1]) * 12 + inch) * 0.0254; }
  m = t.match(/^\s*(\d+(?:\.\d+)?)\s*mm\s*$/i); if (m) return Number(m[1]) / 1000;
  m = t.match(/^\s*(\d+(?:\.\d+)?)\s*m\s*$/i); if (m) return Number(m[1]);
  return null;
}

function cluster(vals, tol) {
  const s = [...vals].sort((a, b) => a - b), out = [];
  for (const v of s) { const last = out[out.length - 1]; if (last && v - last.v[last.v.length - 1] <= tol) last.v.push(v); else out.push({ v: [v] }); }
  return out.map((c) => c.v.reduce((a, b) => a + b, 0) / c.v.length);
}
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const inside = (t, s) => t.x >= s.x0 && t.x <= s.x1 && t.y >= s.y0 && t.y <= s.y1;

// Read one sheet. Returns what it found in drawing units and, once a scale is fixed, in metres.
export function readSheet(prims) {
  const { shapes, lines, texts } = prims;
  const all = [...shapes, ...lines.map((l) => { const xs = l.pts.map((p) => p[0]), ys = l.pts.map((p) => p[1]); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; })];
  const ext = { x0: Math.min(...all.map((s) => s.x0)), y0: Math.min(...all.map((s) => s.y0)), x1: Math.max(...all.map((s) => s.x1)), y1: Math.max(...all.map((s) => s.y1)) };
  const E = Math.max(ext.x1 - ext.x0, ext.y1 - ext.y0);
  const words = texts.map((t) => t.s).join(' | ');
  const kind = /\bSECTION\b/i.test(words) ? 'section' : /\bSITE\b|\bGROUND FLOOR\b/i.test(words) ? 'site' : /\bPLAN\b/i.test(words) ? 'plan' : 'plan';
  const title = texts.find((t) => /PLAN|SECTION|ELEVATION/i.test(t.s))?.s || '';
  const sheetNo = texts.find((t) => /^[A-Z]-?\d{2,3}$/.test(t.s))?.s || '';
  // drop the sheet border, the title block and anything inside it
  const big = shapes.filter((s) => s.w * s.h > 0.8 * (ext.x1 - ext.x0) * (ext.y1 - ext.y0));
  const titleBlock = shapes.filter((s) => texts.some((t) => /GENERAL NOTES/i.test(t.s) && inside(t, s)) && !big.includes(s)).sort((a, b) => a.w * a.h - b.w * b.h)[0];
  const inTitle = (o) => titleBlock && (o.cx ?? o.x) >= titleBlock.x0 && (o.cx ?? o.x) <= titleBlock.x1 && (o.cy ?? o.y) >= titleBlock.y0 && (o.cy ?? o.y) <= titleBlock.y1;
  const S = shapes.filter((s) => !big.includes(s) && s !== titleBlock && !inTitle(s));
  const Tx = texts.filter((t) => !inTitle(t));
  const notes = titleBlock ? texts.filter((t) => inTitle(t)).sort((a, b) => a.y - b.y).map((t) => t.s) : [];
  const dims = Tx.map((t) => ({ ...t, m: parseDim(t.s) })).filter((t) => t.m && t.m > 0.5);
  const R = { kind, title, sheetNo, notes, dims: dims.map((d) => d.s), found: [], warnings: [] };

  // columns: the most common small, square, filled shape
  const cand = S.filter((s) => !s.circle && s.fill !== 'none' && !/^#?f{3,6}$/i.test(s.fill) && Math.max(s.w, s.h) < 0.03 * E && Math.min(s.w, s.h) / Math.max(s.w, s.h) > 0.6 && s.w > 0);
  const bySize = {};
  for (const c of cand) { const k = Math.round(c.w * 4) / 4; (bySize[k] || (bySize[k] = [])).push(c); }
  const cols = Object.values(bySize).sort((a, b) => b.length - a.length)[0] || [];
  const colsOK = cols.length >= 4;
  const gx = colsOK ? cluster(cols.map((c) => c.cx), E * 0.006) : [], gy = colsOK ? cluster(cols.map((c) => c.cy), E * 0.006) : [];
  const spX = gx.length > 1 ? median(gx.slice(1).map((v, i) => v - gx[i])) : 0, spY = gy.length > 1 ? median(gy.slice(1).map((v, i) => v - gy[i])) : 0;

  // labelled regions: smallest closed shape around each label
  const regions = [];
  for (const t of Tx) {
    const host = S.filter((s) => s.w > 0.02 * E && inside(t, s) && !s.circle).sort((a, b) => a.w * a.h - b.w * b.h)[0];
    if (host) { const r = regions.find((r) => r.shape === host); if (r) r.labels.push(t.s); else regions.push({ shape: host, labels: [t.s] }); }
  }

  // scale: bay dimension strings against the measured grid spacing, else the largest dimension against the largest extent
  let scale = null, scaleFrom = '';
  // 1. dimension strings read against their own dimension lines (the most reliable: every dimension is a ruler)
  const dl = lines.filter((l) => l.pts.length === 2);
  const perDim = [];
  for (const d of dims) {
    const hit = dl.map((l) => {
      const [[x1, y1], [x2, y2]] = l.pts, len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 0.01 * E) return null;
      if (Math.abs(y1 - y2) < 0.5 && Math.abs((x1 + x2) / 2 - d.x) < 3 && d.y < y1 && y1 - d.y < 6) return len;
      if (Math.abs(x1 - x2) < 0.5 && Math.abs((y1 + y2) / 2 - d.y) < 4 && x1 > d.x && x1 - d.x < 7) return len;
      return null;
    }).filter(Boolean)[0];
    if (hit) perDim.push({ d, s: hit / d.m });
  }
  if (perDim.length) {
    const sc = median(perDim.map((p) => p.s));
    const agree = perDim.filter((p) => Math.abs(p.s / sc - 1) < 0.03).length;
    scale = sc; scaleFrom = `${agree} of ${perDim.length} dimension strings read against their dimension lines`;
  }
  const bayDims = dims.filter((d) => d.m > 3 && d.m < 15);
  if (!scale && colsOK && bayDims.length) {
    const val = median(bayDims.map((d) => d.m));
    const sp = [spX, spY].filter(Boolean);
    const near = sp.sort((a, b) => Math.abs(a - median(sp)) - Math.abs(b - median(sp)))[0];
    scale = near / val; scaleFrom = `bay dimension ${bayDims[0].s} against the measured column spacing`;
  }
  if (!scale && dims.length) {
    const big1 = dims.reduce((a, b) => (b.m > a.m ? b : a));
    if (kind === 'section') {
      const lv = levelLines(lines, Tx, E);
      const above = lv.filter((l) => !/^B\d/.test(l.name));
      if (above.length > 2) { const sp = Math.max(...above.map((l) => l.y)) - Math.min(...above.map((l) => l.y)); scale = sp / big1.m; scaleFrom = `overall height ${big1.s} against the level lines`; }
    } else {
      const outline = [...S].filter((s) => s.fill === 'none' || /^#?f{3,6}$/i.test(s.fill) || s.cls === 'bd' || s.cls === 'th').sort((a, b) => b.w * b.h - a.w * a.h)[0];
      if (outline) { scale = Math.max(outline.w, outline.h) / big1.m; scaleFrom = `largest dimension ${big1.s} against the largest outline`; }
    }
  }
  if (!scale) { R.warnings.push('No dimension strings found: the scale could not be fixed. Enter it under Read results.'); return R; }
  R.scale = scale; R.scaleFrom = scaleFrom;
  const m = (u) => u / scale;
  const bb = (sh) => ({ x0: sh.x0, y0: sh.y0, x1: sh.x1, y1: sh.y1 });
  R.draw = { cols: colsOK ? cols.map((c) => [c.cx, c.cy, c.w]) : [], gx, gy, dims: perDim.map((p) => [p.d.x, p.d.y]), regions: [], levels: [] };

  if (colsOK) {
    R.grid = { baysX: gx.length - 1, baysY: gy.length - 1, bayX: m(spX), bayY: m(spY), columns: cols.length };
    R.columns = cols.map((c) => ({ x: c.cx, y: c.cy }));
    R.found.push(`${cols.length} columns on a ${gx.length - 1} × ${gy.length - 1} bay grid at ${m(spX).toFixed(2)} × ${m(spY).toFixed(2)} m`);
  }

  if (kind === 'plan') {
    // slab edge: the closed outline that contains the column grid
    const outline = S.filter((s) => (s.fill === 'none' || s.cls === 'bd') && (!colsOK || cols.every((c) => inside({ x: c.cx, y: c.cy }, s)))).sort((a, b) => a.w * a.h - b.w * b.h)[0];
    if (outline) {
      R.draw.outline = bb(outline);
      R.outline = { w: m(outline.w), d: m(outline.h), x0: outline.x0, y0: outline.y0, x1: outline.x1, y1: outline.y1 };
      R.found.push(`slab edge ${m(outline.w).toFixed(1)} × ${m(outline.h).toFixed(1)} m (${Math.round(m(outline.w) * m(outline.h))} m² per floor)`);
      if (colsOK) { R.grid.insetX = m(Math.min(...gx) - outline.x0); R.grid.insetY = m(outline.y1 - Math.max(...gy)); }
      const mods = lines.filter((l) => l.pts.length === 2 && Math.hypot(l.pts[1][0] - l.pts[0][0], l.pts[1][1] - l.pts[0][1]) < 0.01 * E && (Math.abs(l.pts[0][1] - outline.y0) < 1 || Math.abs(l.pts[0][1] - outline.y1) < 1));
      if (mods.length > 6) { const xs = cluster(mods.map((l) => l.pts[0][0]), 0.5); const mod = m(median(xs.slice(1).map((v, i) => v - xs[i]))); R.module = mod; R.found.push(`curtain-wall module ${mod.toFixed(2)} m (${(mod / 0.0254).toFixed(1)} in)`); }
    }
    R.cores = regions.filter((r) => r.labels.some((l) => /CORE|SPINE|STAIR|SHAFT/i.test(l)) && Math.max(r.shape.w, r.shape.h) > 0.05 * E).map((r) => ({ name: r.labels.filter((l) => /CORE|SPINE|STAIR|SHAFT|WALL/i.test(l)).join(' · '), w: m(r.shape.w), d: m(r.shape.h), ox: outline ? m(r.shape.x0 - outline.x0) : 0, oy: outline ? m(outline.y1 - r.shape.y1) : 0, spine: r.labels.some((l) => /SPINE/i.test(l)) }));
    if (R.cores.length) R.found.push(`${R.cores.length} cores: ${R.cores.map((c) => `${c.name.toLowerCase()} ${c.w.toFixed(1)} × ${c.d.toFixed(1)} m`).join('; ')}`);
    for (const r of regions.filter((r) => r.labels.some((l) => /CORE|SPINE|STAIR|SHAFT/i.test(l)))) R.draw.regions.push({ ...bb(r.shape), label: r.labels.filter((l) => /CORE|SPINE|STAIR/i.test(l)).join(' · '), kind: 'core' });
    R.lifts = Tx.filter((t) => /^(ELEV|LIFT|E\d*)$/i.test(t.s)).length;
    if (R.lifts) R.found.push(`${R.lifts} lift shafts`);
    const lv = words.match(/LEVELS?\s+(\d+)\s*[–-]\s*(\d+)/i);
    if (lv) { R.typicalLevels = [Number(lv[1]), Number(lv[2])]; R.found.push(`typical floor applies to levels ${lv[1]}–${lv[2]}`); }
  }

  if (kind === 'site') {
    const lot = [...S].filter((s) => s.cls === 'bd' || s.fill === 'none').sort((a, b) => b.w * b.h - a.w * a.h)[0];
    if (lot) { R.draw.outline = bb(lot); R.lot = { w: m(lot.w), d: m(lot.h) }; R.found.push(`lot ${m(lot.w).toFixed(1)} × ${m(lot.h).toFixed(1)} m`); }
    R.blocks = [];
    for (const r of regions) {
      const lab = r.labels.join(' ');
      const st = lab.match(/(\d+)\s*STOR(?:Y|IES|EYS)(\s*\+\s*MECH)?/i);
      if (!st) continue;
      R.draw.regions.push({ ...bb(r.shape), label: lab, kind: 'block' });
      const b = { label: lab, storeys: Number(st[1]), mech: Boolean(st[2]), x: lot ? m(r.shape.x0 - lot.x0) : 0, y: lot ? m(lot.y1 - r.shape.y1) : 0, w: m(r.shape.w), d: m(r.shape.h), dashed: r.shape.cls === 'dash', tower: /TOWER/i.test(lab) };
      R.blocks.push(b);
    }
    if (R.blocks.length) R.found.push(`${R.blocks.length} blocks: ${R.blocks.map((b) => `${b.label.toLowerCase()} (${b.w.toFixed(0)} × ${b.d.toFixed(0)} m)`).join('; ')}`);
    R.plaza = regions.filter((r) => r.labels.some((l) => /PLAZA/i.test(l))).map((r) => ({ area: m(r.shape.w) * m(r.shape.h) }))[0] || null;
    R.pools = regions.filter((r) => r.labels.some((l) => /POOL/i.test(l)) && r.shape.w < 0.4 * E).map((r) => ({ w: m(r.shape.w), d: m(r.shape.h), label: r.labels.join(' ') }));
    if (R.plaza) R.found.push(`plaza ${Math.round(R.plaza.area)} m²`);
    if (R.pools.length) R.found.push(`${R.pools.length} pools`);
    const bl = R.notes.join(' ').match(/(\d+)\s*BASEMENT LEVELS?/i);
    if (bl) R.basementLevels = Number(bl[1]);
  }

  if (kind === 'section') {
    const lv = levelLines(lines, Tx, E).sort((a, b) => b.y - a.y); // bottom to top
    R.draw.levels = lv.map((l) => l.y);
    const above = lv.filter((l) => !/^B\d/.test(l.name)), below = lv.filter((l) => /^B\d/.test(l.name));
    if (above.length > 1) {
      const z = above.map((l) => m(above[0].y - l.y));
      const h = z.slice(1).map((v, i) => v - z[i]);
      R.levels = { count: above.length - 1, heights: h, total: z[z.length - 1], names: above.map((l) => l.name), mech: above.some((l) => /MECH/.test(l.name)) };
      R.found.push(`${above.length - 1} levels above grade, ${R.levels.total.toFixed(1)} m to roof; ground ${h[0].toFixed(2)} m, typical ${median(h).toFixed(2)} m${R.levels.mech ? `, mechanical ${h[h.length - 1].toFixed(2)} m` : ''}`);
    }
    if (below.length) { const grade = above[0]?.y ?? 0; R.basement = { levels: below.length, f2f: m(Math.abs(below[0].y - grade)) / below.length }; R.found.push(`${below.length} basement levels at ${R.basement.f2f.toFixed(2)} m`); }
  }
  R.spec = readNotes(R.notes.concat(Tx.map((t) => t.s)));
  if (R.spec.found.length) R.found.push(`specification notes: ${R.spec.found.join(', ')}`);
  return R;
}

function levelLines(lines, texts, E) {
  const out = [];
  for (const t of texts) {
    if (!/^(L\d+|LEVEL\s*\d+|ROOF|MECH|B\d+|GROUND)$/i.test(t.s)) continue;
    const l = lines.find((l) => l.pts.length === 2 && Math.abs(l.pts[0][1] - l.pts[1][1]) < 0.5 && Math.abs(l.pts[0][1] - (t.y - 2)) < 4 && Math.min(l.pts[0][0], l.pts[1][0]) - t.x < 0.03 * E && Math.min(l.pts[0][0], l.pts[1][0]) - t.x > -4);
    if (l) out.push({ name: t.s.toUpperCase(), y: l.pts[0][1] });
  }
  return out;
}

// Specification notes on the drawings → structure, facade and finishes
export function readNotes(lines) {
  const t = lines.join(' ').toUpperCase();
  const spec = { found: [] };
  if (/STEEL FRAME|STEEL COLUMNS/.test(t)) { spec.frame = 'steel'; spec.found.push('steel frame'); }
  else if (/CONCRETE FRAME|REINFORCED CONCRETE/.test(t)) { spec.frame = 'concrete'; spec.found.push('concrete frame'); }
  else if (/TIMBER|CLT|GLULAM/.test(t)) { spec.frame = 'timber'; spec.found.push('timber frame'); }
  if (/ENCASED IN CONCRETE/.test(t)) { spec.encasement = true; spec.found.push('concrete-encased steel'); }
  const sw = t.match(/SHEAR WALLS? TO (?:FLOOR|LEVEL) (\d+)/); if (sw) { spec.shearTo = Number(sw[1]); spec.found.push(`shear walls to floor ${sw[1]}`); }
  if (/BRONZE/.test(t)) { spec.facade = 'bronze-cw'; spec.found.push('bronze curtain wall'); }
  else if (/ALUMINI?UM CURTAIN WALL|UNITI[SZ]ED/.test(t)) { spec.facade = 'aluminium-cw'; spec.found.push('aluminium curtain wall'); }
  else if (/PRECAST/.test(t)) { spec.facade = 'precast'; spec.found.push('precast facade'); }
  else if (/BRICK/.test(t)) { spec.facade = 'brick'; spec.found.push('brick facade'); }
  if (/MARBLE/.test(t)) { spec.marble = true; spec.found.push('marble cladding'); }
  if (/TRAVERTINE/.test(t)) { spec.travertine = true; spec.found.push('travertine'); }
  if (/GRANITE/.test(t)) { spec.granite = true; spec.found.push('granite'); }
  const lifts = t.match(/(\d+)\s*(?:PASSENGER\s*)?(?:ELEVATORS|LIFTS)/); if (lifts) { spec.lifts = Number(lifts[1]); spec.found.push(`${lifts[1]} lifts`); }
  return spec;
}

/* ------------------------------------------------------------------ sheets → building */

// Merge readings from a sheet set into one building description. Every value records its source; gaps are filled with
// stated defaults so the takeoff can run, and flagged so the reader can correct them.
export function sheetsToBuilding(readings, extra = {}) {
  const plan = readings.find((r) => r.kind === 'plan' && r.grid) || readings.find((r) => r.kind === 'plan'), site = readings.find((r) => r.kind === 'site'), sec = readings.find((r) => r.kind === 'section');
  const prov = [];
  const note = (k, v, src, assumed = false) => prov.push({ k, v, src, assumed });
  const spec = Object.assign({}, ...readings.map((r) => r.spec || {}));
  delete spec.found;
  const B = { id: extra.id || 'read', name: extra.name || 'Read from drawings', address: extra.address || '', use: 'office', location: extra.location || 'us', rsp: 60, era: extra.era || 'modern', blocks: [], cores: [] };

  // tower floor plate from the typical plan
  const lv = sec?.levels;
  const towerSite = site?.blocks?.find((b) => b.tower) || [...(site?.blocks || [])].sort((a, b) => b.storeys - a.storeys)[0] || (site?.towerStoreys ? { ...site.towerStoreys, x: 0, y: 0 } : null);
  const tw = plan?.outline?.w ?? towerSite?.w ?? 30, td = plan?.outline?.d ?? towerSite?.d ?? 30;
  if (plan?.grid && !plan.grid.bayX) { plan.grid.bayX = (tw - 2 * (plan.grid.insetX || 0)) / plan.grid.baysX; plan.grid.bayY = (td - 2 * (plan.grid.insetY || 0)) / plan.grid.baysY; }
  note('Floor plate', `${tw.toFixed(1)} × ${td.toFixed(1)} m`, plan?.outline ? `${plan.sheetNo || 'plan'}: slab edge` : towerSite ? `${site.sheetNo}: block outline` : 'default', !plan?.outline && !towerSite);
  const storeys = towerSite ? towerSite.storeys + (towerSite.mech ? 1 : 0) : lv ? lv.count : 10;
  note('Tower levels', `${storeys}${towerSite?.mech ? ' (incl. mechanical)' : ''}`, towerSite ? `${site.sheetNo}: "${towerSite.label}"` : lv ? `${sec.sheetNo}: level lines` : 'default', !towerSite && !lv);
  let f2f = 3.7, first = null, top = null;
  if (lv && lv.heights.length > 2) {
    const h = lv.heights; f2f = median(h); first = Math.abs(h[0] - f2f) > 0.3 ? h[0] : null; top = lv.mech && Math.abs(h[h.length - 1] - f2f) > 0.3 ? h[h.length - 1] : null;
    note('Floor-to-floor', `${f2f.toFixed(2)} m typical${first ? `, ground ${first.toFixed(2)} m` : ''}${top ? `, mechanical ${top.toFixed(2)} m` : ''}`, `${sec.sheetNo}: level lines`);
  } else note('Floor-to-floor', `${f2f} m`, 'default', true);
  const g = plan?.grid || {};
  const tower = { id: 'tower', name: 'Tower', kind: 'tower', x: towerSite?.x ?? 0, y: towerSite?.y ?? 0, w: tw, d: td, z0: 0, levels: storeys, f2f, firstF2F: first || undefined, topF2F: top || undefined, baysX: g.baysX || Math.max(1, Math.round(tw / 8)), baysY: g.baysY || Math.max(1, Math.round(td / 8)), bayX: g.bayX, bayY: g.bayY, colInsetX: g.insetX, colInsetY: g.insetY };
  note('Column grid', g.baysX ? `${g.baysX} × ${g.baysY} bays at ${g.bayX.toFixed(2)} × ${g.bayY.toFixed(2)} m (${g.columns} columns)` : `${tower.baysX} × ${tower.baysY} bays (assumed 8 m)`, g.baysX ? `${plan.sheetNo}: column symbols + ${plan.scaleFrom}` : 'default', !g.baysX);
  B.blocks.push(tower);
  // other blocks from the site plan
  const towerH = blockHeight(tower);
  const others = (site?.blocks || []).filter((b) => b !== towerSite && b.w).sort((a, b) => a.storeys - b.storeys);
  const placed = [];
  for (const b of others) {
    const host = placed.find((p) => b.x >= p.x - 0.5 && b.x + b.w <= p.x + p.w + 0.5 && b.y >= p.y - 0.5 && b.y + b.d <= p.y + p.d + 0.5 && p.levels < b.storeys);
    const blk = { id: `b${placed.length + 1}`, name: b.label.replace(/·.*$/, '').trim().replace(/\b\w/g, (c) => c).toLowerCase().replace(/^\w/, (c) => c.toUpperCase()), kind: 'podium', x: b.x, y: b.y, w: b.w, d: b.d, z0: host ? (host.z0 || 0) + blockHeight(host) : 0, levels: host ? b.storeys - host.levels : b.storeys, f2f, firstF2F: host ? undefined : first || undefined, baysX: Math.max(1, Math.round(b.w / (g.bayX || 8.5))), baysY: Math.max(1, Math.round(b.d / (g.bayY || 8.5))) };
    placed.push(blk); B.blocks.push(blk);
    note(blk.name, `${b.w.toFixed(0)} × ${b.d.toFixed(0)} m, ${blk.levels} levels${host ? ` above ${host.name.toLowerCase()}` : ''}`, `${site.sheetNo}: "${b.label}"`);
  }
  // cores
  for (const c of plan?.cores || []) {
    const id = c.spine ? 'spine' : `core${B.cores.length + 1}`;
    B.cores.push({ id, name: c.name, blockId: 'tower', x: tower.x + c.ox, y: tower.y + c.oy, w: c.w, d: c.d, toLevel: c.spine ? undefined : spec.shearTo, t: 0.3 });
    note(`Core: ${c.name.toLowerCase()}`, `${c.w.toFixed(1)} × ${c.d.toFixed(1)} m${!c.spine && spec.shearTo ? `, to floor ${spec.shearTo}` : ''}`, `${plan.sheetNo}: labelled region${!c.spine && spec.shearTo ? ' + notes' : ''}`);
  }
  // basement
  const bl = sec?.basement?.levels ?? site?.basementLevels;
  if (bl) { const lot = site?.lot || { w: tw, d: td }; B.basement = { levels: bl, f2f: sec?.basement?.f2f || 3.5, x: 0, y: 0, w: lot.w, d: lot.d }; note('Basement', `${bl} levels under ${lot.w.toFixed(0)} × ${lot.d.toFixed(0)} m`, sec?.basement ? `${sec.sheetNo}: B-level lines` : `${site.sheetNo}: notes`); }
  // specification
  B.structure = { frame: spec.frame || 'steel', slab: spec.frame === 'concrete' ? 'flat-plate' : extra.slab || 'deck', slabThk: spec.frame === 'concrete' ? 0.25 : extra.slabThk || 0.12, encasement: Boolean(spec.encasement), steel: 'steel-section', concrete: 'concrete' };
  note('Structure', `${B.structure.frame} frame${spec.encasement ? ', concrete-encased' : ''}`, spec.frame ? 'general notes' : 'default', !spec.frame);
  B.facade = { system: spec.facade || 'aluminium-cw', secondary: [] };
  note('Facade', B.facade.system, spec.facade ? 'general notes' : 'default', !spec.facade);
  B.services = { lifts: plan?.lifts || spec.lifts || 0, intensity: 1 };
  note('Lifts', String(B.services.lifts), plan?.lifts ? `${plan.sheetNo}: lift shaft labels` : spec.lifts ? 'general notes' : 'not found', !plan?.lifts && !spec.lifts);
  B.interiors = { partitions: 0.3, finishes: [] };
  B.site = { lot: site?.lot, paving: [], pools: [] };
  if (site?.plaza) { B.site.paving.push({ id: 'plaza', name: `${spec.granite ? 'Granite' : 'Stone'} plaza paving`, material: spec.granite ? 'granite' : 'granite', area: Math.round(site.plaza.area), thk: 0.08 }); note('Plaza', `${Math.round(site.plaza.area)} m²`, `${site.sheetNo}: labelled region`); }
  for (const p of site?.pools || []) { const dm = p.label.match(/×\s*(.+)$/); const d = dm ? parseDim(dm[1]) : p.d; B.site.pools.push({ w: p.w, d: d || p.d, depth: 0.6 }); }
  if (site?.pools?.length) note('Pools', `${site.pools.length}`, `${site.sheetNo}: labelled regions`);
  if (plan?.module) note('Facade module', `${plan.module.toFixed(3)} m`, `${plan.sheetNo}: mullion ticks`);
  return { building: B, provenance: prov };
}

/* ------------------------------------------------------------------ DXF */

// Minimal DXF reader (ASCII): LINE, LWPOLYLINE, POLYLINE/VERTEX, CIRCLE, SOLID, TEXT, MTEXT → SVG, so CAD exports go through
// the same vector reader. Closed polylines on a column layer (COL, S-COLS…) are treated as filled column symbols.
// Block inserts (INSERT) are not expanded; the reader reports how many it skipped.
export function dxfToSVG(text) {
  const raw = String(text).split(/\r?\n/);
  const pairs = [];
  for (let i = 0; i + 1 < raw.length; i += 2) pairs.push([raw[i].trim(), raw[i + 1].replace(/\s+$/, '')]);
  const start = pairs.findIndex(([c, v]) => c === '2' && v === 'ENTITIES');
  const ents = []; let cur = null;
  for (let i = Math.max(0, start); i < pairs.length; i++) {
    const [c, v] = pairs[i];
    if (c === '0') { if (cur) ents.push(cur); if (v === 'ENDSEC') { cur = null; break; } cur = { type: v, g: [] }; } else if (cur) cur.g.push([c, v]);
  }
  if (cur) ents.push(cur);
  const out = []; const pts = []; let skipped = 0; let poly = null;
  const get = (e, c) => e.g.find((p) => p[0] === c)?.[1];
  const f = (e, c) => parseFloat(get(e, c) || 0);
  for (const e of ents) {
    const layer = get(e, '8') || '';
    const colLayer = /COL/i.test(layer);
    if (e.type === 'LINE') out.push({ t: 'line', p: [[f(e, '10'), f(e, '20')], [f(e, '11'), f(e, '21')]] });
    else if (e.type === 'LWPOLYLINE') {
      const xs = e.g.filter((p) => p[0] === '10').map((p) => +p[1]), ys = e.g.filter((p) => p[0] === '20').map((p) => +p[1]);
      const closed = (parseInt(get(e, '70') || '0', 10) & 1) === 1;
      out.push({ t: closed ? 'poly' : 'pl', p: xs.map((x, k) => [x, ys[k]]), fill: closed && colLayer });
    } else if (e.type === 'POLYLINE') poly = { p: [], closed: (parseInt(get(e, '70') || '0', 10) & 1) === 1, fill: colLayer };
    else if (e.type === 'VERTEX' && poly) poly.p.push([f(e, '10'), f(e, '20')]);
    else if (e.type === 'SEQEND' && poly) { out.push({ t: poly.closed ? 'poly' : 'pl', p: poly.p, fill: poly.closed && poly.fill }); poly = null; }
    else if (e.type === 'CIRCLE') out.push({ t: 'circle', c: [f(e, '10'), f(e, '20')], r: f(e, '40') });
    else if (e.type === 'SOLID') out.push({ t: 'poly', p: [[f(e, '10'), f(e, '20')], [f(e, '11'), f(e, '21')], [f(e, '13'), f(e, '23')], [f(e, '12'), f(e, '22')]], fill: true });
    else if (e.type === 'TEXT' || e.type === 'MTEXT') out.push({ t: 'text', p: [f(e, '10'), f(e, '20')], s: (e.g.filter((p) => p[0] === '1' || p[0] === '3').map((p) => p[1]).join('')).replace(/\\P/g, ' ').replace(/\{\\[^;]*;|\}|\\[A-Za-z][^;]*;/g, '').replace(/%%d/gi, '°') });
    else if (e.type === 'INSERT') skipped++;
  }
  for (const o of out) { if (o.p) for (const q of o.t === 'text' ? [o.p] : o.p) pts.push(q); if (o.c) pts.push(o.c); }
  if (!pts.length) return { svg: '', skipped, entities: 0 };
  const x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0])), y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]));
  const k = 1000 / Math.max(x1 - x0, y1 - y0 || 1);
  const X = (x) => r1((x - x0) * k + 20), Y = (y) => r1((y1 - y) * k + 20);
  const body = out.map((o) => {
    if (o.t === 'line') return `<line x1="${X(o.p[0][0])}" y1="${Y(o.p[0][1])}" x2="${X(o.p[1][0])}" y2="${Y(o.p[1][1])}" stroke="#111"/>`;
    if (o.t === 'poly' || o.t === 'pl') return `<${o.t === 'poly' ? 'polygon' : 'polyline'} points="${o.p.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" fill="${o.fill ? '#111' : 'none'}" stroke="#111"/>`;
    if (o.t === 'circle') return `<circle cx="${X(o.c[0])}" cy="${Y(o.c[1])}" r="${r1(o.r * k)}" fill="none" stroke="#111"/>`;
    return `<text x="${X(o.p[0])}" y="${Y(o.p[1])}" font-size="7">${esc(o.s)}</text>`;
  }).join('\n');
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r1((x1 - x0) * k + 40)} ${r1((y1 - y0) * k + 40)}"><rect width="100%" height="100%" fill="#fff"/>${body}</svg>`, skipped, entities: out.length };
}

/* ------------------------------------------------------------------ AI reads */

// Turn the vision endpoint's answer for one raster sheet into the same reading shape the vector reader produces.
// Positions are not available from pixels, so cores are centred and site blocks only contribute storey counts.
export function aiToReading(a, label = 'raster sheet') {
  const kind = /section/.test(a.sheetType) ? 'section' : /site/.test(a.sheetType) ? 'site' : a.sheetType === 'floor plan' ? 'plan' : 'other';
  const R = { kind, title: a.title, sheetNo: a.sheetNumber || label, notes: a.notes || [], dims: a.dimensionsRead || [], found: [], warnings: [], ai: true, components: a.components || [] };
  const g = a.grid || {};
  if (g.linesAcross && g.linesDeep) {
    const bx = g.bayAcross?.m, by = g.bayDeep?.m || bx;
    R.grid = { baysX: g.linesAcross - 1, baysY: g.linesDeep - 1, bayX: bx || null, bayY: by || null, columns: a.columns || g.linesAcross * g.linesDeep };
    R.found.push(`${R.grid.columns} columns on a ${R.grid.baysX} × ${R.grid.baysY} bay grid${bx ? ` at ${bx.toFixed(2)} m (from "${g.bayAcross.text}")` : ' (bay size not printed)'}`);
  }
  const fp = a.floorPlate || {};
  if (fp.width?.m && fp.depth?.m) { R.outline = { w: fp.width.m, d: fp.depth.m }; R.found.push(`floor plate ${fp.width.text} × ${fp.depth.text} (${fp.width.m.toFixed(1)} × ${fp.depth.m.toFixed(1)} m)`); }
  else if (R.grid?.bayX) { R.outline = { w: R.grid.baysX * R.grid.bayX, d: R.grid.baysY * (R.grid.bayY || R.grid.bayX) }; R.warnings.push('Overall dimensions not printed: floor plate taken as the grid extent.'); }
  if (R.grid && R.outline && R.grid.bayX) { R.grid.insetX = Math.max(0, (R.outline.w - R.grid.baysX * R.grid.bayX) / 2); R.grid.insetY = Math.max(0, (R.outline.d - R.grid.baysY * (R.grid.bayY || R.grid.bayX)) / 2); }
  if (a.cores?.length && R.outline) {
    R.cores = a.cores.map((c, i) => { const w = (c.bays || 1) * (R.grid?.bayX || 8); const d = Math.min(R.outline.d * 0.6, (R.grid?.bayY || 8) * 3); return { name: c.label, w: Math.min(w, R.outline.w * 0.5), d, ox: R.outline.w / 2 - w / 2 + i * 0.5, oy: (R.outline.d - d) / 2, spine: /spine/i.test(c.label) }; });
    R.found.push(`${R.cores.length} cores: ${a.cores.map((c) => c.label.toLowerCase()).join(', ')} (positions not read from pixels)`);
  }
  if (a.lifts) { R.lifts = a.lifts; R.found.push(`${a.lifts} lifts`); }
  const lv = a.levels || {};
  if (lv.levelRange) R.found.push(`plan applies to levels ${lv.levelRange}`);
  if (kind === 'section' || lv.aboveGrade) {
    const n = lv.aboveGrade, typ = lv.typicalFloorToFloor?.m, tot = lv.overallHeight?.m;
    if (n) {
      const t = typ || (tot ? tot / n : 3.7);
      R.levels = { count: n, heights: Array.from({ length: n }, () => t), total: tot || n * t, mech: false };
      if (tot && typ && tot - typ * n > 1) R.levels.heights[0] += tot - typ * n;
      R.found.push(`${n} levels above grade${typ ? `, typical ${typ.toFixed(2)} m` : ''}${tot ? `, ${tot.toFixed(1)} m overall` : ''}`);
    }
    if (lv.belowGrade) { R.basement = { levels: lv.belowGrade, f2f: 3.5 }; R.found.push(`${lv.belowGrade} basement levels`); }
  }
  if (kind === 'site' && a.blocks?.length) {
    R.blocks = [];
    const tallest = a.blocks.filter((b) => b.storeys).sort((x, y) => y.storeys - x.storeys)[0];
    if (tallest) R.towerStoreys = { storeys: tallest.storeys, label: tallest.label, mech: /mech/i.test(tallest.label) };
    R.found.push(`blocks: ${a.blocks.map((b) => `${b.label}${b.storeys ? ` (${b.storeys})` : ''}`).join('; ')}`);
  }
  const extraNotes = [...R.notes, a.structure !== 'unknown' ? `${a.structure} frame` : '', a.facade !== 'unknown' ? a.facade : ''];
  R.spec = readNotes(extraNotes);
  if (R.spec.found.length) R.found.push(`specification: ${R.spec.found.join(', ')}`);
  return R;
}
