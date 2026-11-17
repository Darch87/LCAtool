// Lifecycle Takeoff · engine. Pure functions, no DOM: building description → component takeoff → EN 15978 lifecycle table.
// Runs the same in the browser and in Node tests.
import { MATERIALS, FACADES, TRANSPORT, MODULES, LETI_OFFICE } from './library.js';

const sum = (a, f = (x) => x) => a.reduce((s, x) => s + f(x), 0);
const round = (v, d = 0) => { const p = 10 ** d; return Math.round(v * p) / p; };
export const FT = 0.3048, SQFT = 0.09290304;

/* ------------------------------------------------------------------ geometry helpers */

// Floor-to-floor heights of every level in a block, ground to roof.
export function levelHeights(b) {
  const h = [];
  for (let i = 0; i < b.levels; i++) h.push(i === 0 && b.firstF2F ? b.firstF2F : i === b.levels - 1 && b.topF2F ? b.topF2F : b.f2f);
  return h;
}
export function blockHeight(b) { return sum(levelHeights(b)); }
// Elevation of each level's floor, starting at the block's base elevation
export function levelZ(b) { const z = []; let acc = b.z0 || 0; for (const h of levelHeights(b)) { z.push([acc, acc + h]); acc += h; } return z; }

function covers(b, x, y) { return x > b.x - 1e-6 && x < b.x + b.w + 1e-6 && y > b.y - 1e-6 && y < b.y + b.d + 1e-6; }
function overlap1(a0, a1, b0, b1) { return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0)); }

// Exterior wall length of a block at elevation band [z0,z1]: perimeter minus the parts touching another block at that height.
export function exteriorLength(b, blocks, z0, z1) {
  const edges = [
    { axis: 'y', at: b.y, from: b.x, to: b.x + b.w, side: -1 }, { axis: 'y', at: b.y + b.d, from: b.x, to: b.x + b.w, side: 1 },
    { axis: 'x', at: b.x, from: b.y, to: b.y + b.d, side: -1 }, { axis: 'x', at: b.x + b.w, from: b.y, to: b.y + b.d, side: 1 }
  ];
  let len = 0;
  for (const e of edges) {
    let covered = 0;
    for (const o of blocks) {
      if (o === b) continue;
      const oz = [o.z0 || 0, (o.z0 || 0) + blockHeight(o)];
      if (overlap1(z0, z1, oz[0], oz[1]) < 0.5 * (z1 - z0)) continue;
      if (e.axis === 'y') {
        const touches = e.side < 0 ? Math.abs(o.y + o.d - e.at) < 0.05 : Math.abs(o.y - e.at) < 0.05;
        if (touches) covered += overlap1(e.from, e.to, o.x, o.x + o.w);
      } else {
        const touches = e.side < 0 ? Math.abs(o.x + o.w - e.at) < 0.05 : Math.abs(o.x - e.at) < 0.05;
        if (touches) covered += overlap1(e.from, e.to, o.y, o.y + o.d);
      }
    }
    len += Math.max(0, (e.to - e.from) - covered);
  }
  return len;
}

// Levels standing above a plan point at a given elevation, across every block that covers it (stacked blocks add up).
function floorsAbove(blocks, x, y, z) {
  let n = 0;
  for (const b of blocks) if (covers(b, x, y)) for (const [lz] of levelZ(b)) if (lz >= z - 1e-6) n++;
  return n;
}

// Roof area of a block: the part of its top not covered by another block sitting on it
function roofArea(b, blocks) {
  const top = (b.z0 || 0) + blockHeight(b);
  let covered = 0;
  for (const o of blocks) if (o !== b && Math.abs((o.z0 || 0) - top) < 0.2) covered += overlap1(b.x, b.x + b.w, o.x, o.x + o.w) * overlap1(b.y, b.y + b.d, o.y, o.y + o.d);
  return Math.max(0, b.w * b.d - covered);
}

// Column positions of a block's grid with tributary areas (interior, edge, corner)
export function columnGrid(b) {
  const nx = Math.max(1, b.baysX || 1), ny = Math.max(1, b.baysY || 1);
  const ox = b.colInsetX ?? b.colInset ?? 0, oy = b.colInsetY ?? b.colInset ?? 0;
  const sx = b.bayX || (b.w - 2 * ox) / nx, sy = b.bayY || (b.d - 2 * oy) / ny;
  const cols = [];
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
    const tx = (i === 0 || i === nx ? 0.5 : 1) * sx + (i === 0 ? ox : i === nx ? Math.max(0, b.w - ox - nx * sx) : 0);
    const ty = (j === 0 || j === ny ? 0.5 : 1) * sy + (j === 0 ? oy : j === ny ? Math.max(0, b.d - oy - ny * sy) : 0);
    cols.push({ x: b.x + ox + i * sx, y: b.y + oy + j * sy, trib: tx * ty });
  }
  return { cols, sx, sy };
}

/* ------------------------------------------------------------------ takeoff */

// Method text is built from tagged parts so the page can colour them: q = measured quantity, f = factor or assumption, r = result.
const q = (s) => ({ t: 'q', s }), f = (s) => ({ t: 'f', s }), r = (s) => ({ t: 'r', s });
const nf = (v, d = 0) => Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
export const calcText = (parts) => (parts || []).map((p) => (typeof p === 'string' ? p : p.s)).join('');

export function areas(B) {
  const above = sum(B.blocks || [], (b) => b.w * b.d * b.levels);
  const bs = B.basement;
  const below = bs ? bs.w * bs.d * bs.levels : 0;
  return { above, below, gfa: above + below };
}

// The system layer each component belongs to (Uniformat II level 1, the "systems" of the Model tab and Compare)
export const SYSTEMS = ['Substructure', 'Superstructure', 'Exterior enclosure', 'Roofing', 'Interiors', 'Services', 'Sitework'];

/*
  Component takeoff. Each component is one building element made of several materials (layers), for example steel columns =
  steel sections + concrete encasement + mesh. Every component carries:
    qty  — total quantity in its base unit (m, m², m³, kg or ea) across the building
    unit — one typical element (a column one storey high, one slab bay, one curtain-wall module) with its dimensions and count
    calc — the method, as tagged parts
*/
export function takeoff(B) {
  const comps = [];
  const add = (c) => { comps.push({ life: 200, b2: 0, layers: [], ...c, method: calcText(c.calc) }); };
  const { above, below, gfa } = areas(B);
  const st = B.structure || {};
  const conc = st.concrete || 'concrete', steelKey = st.steel || 'steel-section';
  const era = B.era === 'pre1970' ? { col: 50 / 33, beam: 1.3, note: ' Pre-1970 A7 steel (33 ksi), non-composite floors: columns ×1.5, beams ×1.3.' } : { col: 1, beam: 1, note: '' };
  const blocks = B.blocks;
  const tallest = Math.max(...blocks.map((b) => (b.z0 || 0) + blockHeight(b)));
  const storeys = Math.max(...blocks.map((b) => b.levels + (b.baseLevel || 0)));
  const typF2F = blocks[0]?.f2f || 3.7;

  // A10 foundations and A20 basement
  const bs = B.basement;
  const footprint = bs ? bs.w * bs.d : sum(blocks.filter((b) => !b.z0), (b) => b.w * b.d);
  const fThk = storeys > 20 ? 0.9 : storeys > 8 ? 0.6 : 0.4;
  const fV = footprint * fThk;
  const nPads = sum(blocks.filter((b) => !b.z0), (b) => columnGrid(b).cols.length) || 1;
  add({ id: 'A1010', code: 'A1010', group: 'Substructure', name: 'Foundations', qty: { v: fV, u: 'm³' }, layers: [{ m: conc, kg: fV * 2400 }, { m: 'rebar', kg: fV * 80 }],
    unit: { label: 'Pad under one column', dims: `${nf(Math.sqrt(fV / fThk / nPads), 1)} × ${nf(Math.sqrt(fV / fThk / nPads), 1)} × ${fThk} m`, count: nPads, v: fV / nPads },
    calc: ['Footprint ', q(`${nf(footprint)} m²`), ' × equivalent depth ', f(`${fThk} m`), ` (${storeys} storeys) = `, r(`${nf(fV)} m³`), ' concrete; rebar at ', f('80 kg/m³'), '.'], geom: 'foundation', img: 'foundation' });
  if (bs && bs.levels) {
    const wallV = 2 * (bs.w + bs.d) * bs.levels * bs.f2f * 0.4;
    const slabV = bs.w * bs.d * bs.levels * 0.25;
    add({ id: 'A2020', code: 'A2020', group: 'Substructure', name: 'Basement walls and slabs', qty: { v: wallV + slabV, u: 'm³' }, layers: [{ m: conc, kg: (wallV + slabV) * 2400 }, { m: 'rebar', kg: (wallV + slabV) * 100 }],
      unit: { label: 'One basement level', dims: `${nf(bs.w)} × ${nf(bs.d)} m, ${bs.f2f} m high`, count: bs.levels, v: (wallV + slabV) / bs.levels },
      calc: [q(`${bs.levels} levels`), ' below grade: perimeter ', q(`${nf(2 * (bs.w + bs.d))} m`), ' × ', q(`${bs.f2f} m`), ' × ', f('0.4 m'), ' walls + ', q(`${nf(bs.w * bs.d)} m²`), ' × ', f('0.25 m'), ' slabs = ', r(`${nf(wallV + slabV)} m³`), '; rebar ', f('100 kg/m³'), '.'], geom: 'basement', img: 'basement' });
  }

  // B10 superstructure
  const frame = st.frame || 'steel';
  const floorArea = sum(blocks, (b) => b.w * b.d * b.levels);
  if (frame === 'steel') {
    let colKg = 0, colLen = 0, nCols = 0, nColPieces = 0, beamLen = 0;
    for (const b of blocks) {
      const { cols, sx, sy } = columnGrid(b);
      nCols += cols.length;
      for (const c of cols) for (const [z0, z1] of levelZ(b)) {
        const n = floorsAbove(blocks, c.x, c.y, z0);
        colKg += (z1 - z0) * (40 + 0.366 * c.trib * n) * era.col;
        colLen += z1 - z0; nColPieces++;
      }
      const nx = Math.max(1, b.baysX || 1), ny = Math.max(1, b.baysY || 1);
      beamLen += b.levels * ((nx + 1) * ny * sy + (ny + 1) * nx * sx);
    }
    const beamKg = sum(blocks, (b) => { const { sx, sy } = columnGrid(b); return b.w * b.d * b.levels * (25 + 2.2 * Math.max(sx, sy)) * era.beam; });
    const coreShare = (B.cores || []).length ? 0.5 : 1;
    const latKg = floorArea * 0.45 * storeys * coreShare * (tallest > 60 ? 1 : 0.5);
    const conn = 1.08;
    const enc = st.encasement;
    const encCol = enc ? colKg * conn / 7850 * 6 : 0, encBeam = enc ? beamKg * conn / 7850 * 6 : 0;
    const encMix = st.encasementMix || conc;
    const colLayers = [{ m: steelKey, kg: colKg * conn, cal: 'steel' }];
    if (enc) colLayers.push({ m: encMix, kg: encCol * 2400, cal: 'steel' }, { m: 'rebar', kg: encCol * 15, cal: 'steel' });
    add({ id: 'B1010-C', code: 'B1010', group: 'Superstructure', name: enc ? 'Steel columns, concrete-encased' : 'Steel columns', qty: { v: colLen, u: 'm' }, layers: colLayers, steel: true,
      unit: { label: 'One column, one storey', dims: `${nf(typF2F, 2)} m high, ${nf(colKg * conn / colLen)} kg/m steel${enc ? ', in a 0.75 × 0.75 m concrete case' : ''}`, count: nColPieces, v: colLen / nColPieces },
      calc: [q(`${nCols} column lines`), ', ', q(`${nf(colLen)} m`), ' of column. Steel per metre = ', f('40 kg'), ' + ', f('0.366 kg'), ' × tributary m² × floors carried (7 kPa, 150 MPa allowable), +', f('8%'), ' connections = ', r(`${nf(colKg * conn / 1000)} t`), '.', enc ? ' Encasement ' : '', enc ? f('6 m³ concrete per m³ steel') : '', enc ? ', ' : '', enc ? f('15 kg/m³ mesh') : '', enc ? '.' : '', era.note], geom: 'columns', img: 'columns' });
    const beamLayers = [{ m: steelKey, kg: beamKg * conn, cal: 'steel' }];
    if (enc) beamLayers.push({ m: encMix, kg: encBeam * 2400, cal: 'steel' }, { m: 'rebar', kg: encBeam * 15, cal: 'steel' });
    const bay = Math.max(...blocks.map((b) => Math.max(columnGrid(b).sx, columnGrid(b).sy)));
    add({ id: 'B1010-B', code: 'B1010', group: 'Superstructure', name: enc ? 'Steel beams and girders, concrete-encased' : 'Steel beams and girders', qty: { v: beamLen, u: 'm' }, layers: beamLayers, steel: true,
      unit: { label: 'One beam, one bay', dims: `${nf(bay, 2)} m span, ${nf(beamKg * conn / beamLen)} kg/m`, count: Math.round(beamLen / bay), v: bay },
      calc: [q(`${nf(floorArea)} m²`), ' of framed floor × (', f('25'), ' + ', f('2.2'), ' × span) kg/m², +', f('8%'), ' connections = ', r(`${nf(beamKg * conn / 1000)} t`), ' over ', q(`${nf(beamLen)} m`), ' of beam.'], geom: 'beams', img: 'beams' });
    add({ id: 'B1010-L', code: 'B1010', group: 'Superstructure', name: 'Lateral bracing and wind trusses', qty: { v: latKg, u: 'kg' }, layers: [{ m: steelKey, kg: latKg, cal: 'steel' }], steel: true,
      unit: { label: 'Bracing for one storey', dims: `${nf(latKg / storeys)} kg`, count: storeys, v: latKg / storeys },
      calc: [f('0.45 kg/m²'), ' per storey × ', q(`${storeys} storeys`), ' × ', q(`${nf(floorArea)} m²`), coreShare < 1 ? ', halved because concrete cores share the wind load' : '', ' = ', r(`${nf(latKg / 1000)} t`), '.'], geom: 'bracing', img: 'bracing' });
  } else if (frame === 'concrete') {
    const nC = sum(blocks, (b) => columnGrid(b).cols.length);
    const colLen = sum(blocks, (b) => columnGrid(b).cols.length * blockHeight(b));
    const colV = colLen * 0.36, beamV = floorArea * 0.06;
    add({ id: 'B1010-C', code: 'B1010', group: 'Superstructure', name: 'Concrete columns', qty: { v: colLen, u: 'm' }, layers: [{ m: conc, kg: colV * 2400 }, { m: 'rebar', kg: colV * 200 }],
      unit: { label: 'One column, one storey', dims: `0.6 × 0.6 × ${nf(typF2F, 2)} m`, count: Math.round(colLen / typF2F), v: typF2F },
      calc: [q(`${nC} columns`), ' × ', q(`${nf(colLen / nC, 1)} m`), ' at ', f('0.6 × 0.6 m'), ' = ', r(`${nf(colV)} m³`), '; rebar ', f('200 kg/m³'), '.'], geom: 'columns', img: 'columns' });
    add({ id: 'B1010-B', code: 'B1010', group: 'Superstructure', name: 'Concrete beams', qty: { v: beamV, u: 'm³' }, layers: [{ m: conc, kg: beamV * 2400 }, { m: 'rebar', kg: beamV * 150 }],
      unit: { label: 'Beam per m² of floor', dims: '0.06 m³', count: Math.round(floorArea), v: 0.06 },
      calc: [q(`${nf(floorArea)} m²`), ' × ', f('0.06 m³/m²'), ' = ', r(`${nf(beamV)} m³`), '; rebar ', f('150 kg/m³'), '.'], geom: 'beams', img: 'beams' });
  } else if (frame === 'timber') {
    const glV = floorArea * 0.035;
    add({ id: 'B1010-C', code: 'B1010', group: 'Superstructure', name: 'Glulam columns and beams', qty: { v: glV, u: 'm³' }, layers: [{ m: 'clt', kg: glV * 480 }, { m: 'steel-section', kg: floorArea * 4 }],
      unit: { label: 'Frame per m² of floor', dims: '0.035 m³ timber + 4 kg steel', count: Math.round(floorArea), v: 0.035 },
      calc: [q(`${nf(floorArea)} m²`), ' × ', f('0.035 m³/m²'), ' glulam = ', r(`${nf(glV)} m³`), ' + ', f('4 kg/m²'), ' steel connectors.'], geom: 'columns', img: 'columns' });
  }

  // Floors: suspended slabs and roof slabs
  const susp = floorArea - sum(blocks.filter((b) => !b.z0), (b) => b.w * b.d) + sum(blocks, (b) => roofArea(b, blocks));
  const slabT = st.slabThk || 0.12;
  const bay = blocks[0] ? columnGrid(blocks[0]) : { sx: 8, sy: 8 };
  if (st.slab === 'clt') {
    add({ id: 'B1010-S', code: 'B1010', group: 'Superstructure', name: 'CLT floor panels with screed', qty: { v: susp, u: 'm²' }, layers: [{ m: 'clt', kg: susp * 0.2 * 480 }, { m: conc, kg: susp * 0.05 * 2400 }],
      unit: { label: 'One bay of floor', dims: `${nf(bay.sx, 2)} × ${nf(bay.sy, 2)} m, 200 mm CLT + 50 mm screed`, count: Math.round(susp / (bay.sx * bay.sy)), v: bay.sx * bay.sy },
      calc: [q(`${nf(susp)} m²`), ' suspended floor and roof × ', f('0.2 m'), ' CLT + ', f('50 mm'), ' screed.'], geom: 'slabs', img: 'slabs' });
  } else {
    const v = susp * slabT;
    const deck = (st.slab || 'deck') === 'deck';
    const layers = [{ m: st.slabMix || conc, kg: v * (st.slabMix === 'concrete-light' ? 1800 : 2400) }, { m: 'rebar', kg: v * (frame === 'concrete' ? 90 : 25) }];
    if (deck) layers.push({ m: 'steel-deck', kg: susp * 10 });
    const label = st.slab === 'flat-plate' ? 'Concrete flat-plate slabs' : deck ? 'Concrete floor slabs on steel deck' : 'Formed concrete floor slabs';
    add({ id: 'B1010-S', code: 'B1010', group: 'Superstructure', name: label, qty: { v: susp, u: 'm²' }, layers,
      unit: { label: 'One bay of floor', dims: `${nf(bay.sx, 2)} × ${nf(bay.sy, 2)} × ${slabT} m`, count: Math.round(susp / (bay.sx * bay.sy)), v: bay.sx * bay.sy },
      calc: [q(`${nf(susp)} m²`), ' suspended floor and roof × ', f(`${slabT} m`), ' = ', r(`${nf(v)} m³`), '; rebar ', f(`${frame === 'concrete' ? 90 : 25} kg/m³`), deck ? '; deck ' : '', deck ? f('10 kg/m²') : '', '.'], geom: 'slabs', img: 'slabs' });
  }

  // Concrete cores and shear walls
  for (const c of B.cores || []) {
    const host = blocks.find((b) => b.id === c.blockId) || blocks[0];
    const zs = levelZ(host);
    const h = c.toLevel ? zs[Math.min(c.toLevel, zs.length) - 1][1] - (host.z0 || 0) : blockHeight(host);
    const area = 2 * (c.w + c.d) * h, v = area * (c.t || 0.3);
    add({ id: `B1010-W-${c.id}`, code: 'B1010', group: 'Superstructure', name: `Concrete core walls · ${c.name}`, qty: { v: area, u: 'm²' }, layers: [{ m: conc, kg: v * 2400 }, { m: 'rebar', kg: v * 120 }],
      unit: { label: 'Core walls, one storey', dims: `${nf(2 * (c.w + c.d), 1)} m perimeter × ${nf(typF2F, 2)} m × ${c.t || 0.3} m`, count: Math.round(h / typF2F), v: 2 * (c.w + c.d) * typF2F },
      calc: [q(`${nf(c.w, 1)} × ${nf(c.d, 1)} m`), ' core, ', q(`${nf(h)} m`), ' high', c.toLevel ? ` (to level ${c.toLevel})` : '', ', ', f(`${c.t || 0.3} m`), ' walls = ', r(`${nf(v)} m³`), '; rebar ', f('120 kg/m³'), '.'], geom: `core:${c.id}`, img: 'core' });
  }

  // B20 exterior enclosure: curtain wall frame and glass are one component with two materials
  const fac = FACADES[B.facade?.system] || FACADES['aluminium-cw'];
  let wall = 0, perimFloors = 0;
  for (const b of blocks) for (const [z0, z1] of levelZ(b)) { const L = exteriorLength(b, blocks, z0, z1); wall += L * (z1 - z0); perimFloors += L; }
  const secondary = sum(B.facade?.secondary || [], (s) => s.area);
  const cw = Math.max(0, wall - secondary);
  const vision = B.facade?.vision ?? fac.vision;
  const glassA = cw * vision;
  const modW = B.facade?.module || (B.facade?.system === 'bronze-cw' ? 1.41 : 1.5);
  add({ id: 'B2010', code: 'B2010', group: 'Exterior enclosure', name: fac.name, qty: { v: cw, u: 'm²' },
    layers: [...fac.layers.map(([m, kgm2]) => ({ m, kg: cw * kgm2, cal: 'facade' })), { m: fac.glass[0], kg: glassA * fac.glass[1], life: fac.glassLife, cal: 'glass', b2: 0.0005 }],
    life: fac.life, b2: 0.0005, facadeFrame: true,
    unit: { label: 'One curtain-wall module, one storey', dims: `${nf(modW, 2)} × ${nf(typF2F, 2)} m, ${Math.round(vision * 100)}% vision glass`, count: Math.round(cw / (modW * typF2F)), v: modW * typF2F },
    calc: [q(`${nf(cw)} m²`), ' of wall measured from the massing, edge by edge, minus party faces. Frame ', ...fac.layers.flatMap(([m, k], i) => [i ? ', ' : '', f(`${k} kg/m²`), ` ${MATERIALS[m].name.split('(')[0].trim().toLowerCase()}`]), '; glass ', f(`${Math.round(vision * 100)}%`), ' of the wall at ', f(`${fac.glass[1]} kg/m²`), ' = ', r(`${nf(glassA)} m²`), ' of glass. ', fac.note], geom: 'facade', img: 'facade' });
  for (const s of B.facade?.secondary || []) add({ id: `B2010-${s.id}`, code: 'B2010', group: 'Exterior enclosure', name: s.name, qty: { v: s.area, u: 'm²' }, layers: [{ m: s.material, kg: s.area * s.thk * MATERIALS[s.material].density }], life: 100,
    unit: { label: 'One square metre', dims: `${s.thk * 1000} mm thick`, count: Math.round(s.area), v: 1 }, calc: [q(`${nf(s.area)} m²`), ' at ', f(`${s.thk * 1000} mm`), '.'], geom: 'facade-secondary', img: 'finishes' });

  // B30 roofing
  const roof = sum(blocks, (b) => roofArea(b, blocks));
  add({ id: 'B3010', code: 'B3010', group: 'Roofing', name: 'Roof membrane, insulation and screed', qty: { v: roof, u: 'm²' }, layers: [{ m: 'membrane', kg: roof * 5, life: 30 }, { m: 'mineral-wool', kg: roof * 15, life: 30 }, { m: conc, kg: roof * 0.05 * 2400 }], life: 60,
    unit: { label: 'One square metre of roof', dims: '5 kg membrane, 150 mm mineral wool, 50 mm screed', count: Math.round(roof), v: 1 },
    calc: [q(`${nf(roof)} m²`), ' of exposed roof: membrane ', f('5 kg/m²'), ', mineral wool ', f('15 kg/m²'), ', screed ', f('50 mm'), '. Membrane and insulation replaced every ', f('30 years'), '.'], geom: 'roof', img: 'roof' });

  // C interiors
  const inter = B.interiors || {};
  const part = inter.partitions ?? 0.3;
  add({ id: 'C1010', code: 'C1010', group: 'Interiors', name: 'Partitions (gypsum on steel studs)', qty: { v: above * part, u: 'm²' }, layers: [{ m: 'gypsum', kg: above * part * 2 * 2 * 9.5 }, { m: 'steel-stud', kg: above * part * 3 }], life: 30,
    unit: { label: 'One square metre of partition', dims: '2 layers of 12.5 mm board each side on 92 mm studs', count: Math.round(above * part), v: 1 },
    calc: [q(`${nf(above)} m²`), ' of floor × ', f(`${part} m²`), ' partition per m² = ', r(`${nf(above * part)} m²`), '; board ', f('38 kg/m²'), ', studs ', f('3 kg/m²'), '.'], geom: 'partitions', img: 'partitions' });
  if (inter.ceilings !== false) add({ id: 'C3030', code: 'C3030', group: 'Interiors', name: 'Suspended ceilings', qty: { v: above, u: 'm²' }, layers: [{ m: 'ceiling', kg: above * 6 }], life: 20,
    unit: { label: 'One ceiling tile and grid', dims: '0.6 × 1.2 m', count: Math.round(above / 0.72), v: 0.72 }, calc: [q(`${nf(above)} m²`), ' × ', f('6 kg/m²'), ' tile and grid, replaced every ', f('20 years'), '.'], geom: 'ceilings', img: 'ceilings' });
  for (const fi of inter.finishes || []) add({ id: `C30-${fi.id}`, code: fi.code || 'C3020', group: 'Interiors', name: fi.name, qty: { v: fi.area, u: 'm²' }, layers: [{ m: fi.material, kg: fi.area * fi.thk * MATERIALS[fi.material].density }], life: fi.life || 60,
    unit: { label: 'One square metre', dims: `${fi.thk * 1000} mm thick`, count: Math.round(fi.area), v: 1 }, calc: [q(`${nf(fi.area)} m²`), ' × ', f(`${fi.thk * 1000} mm`), '.'], geom: 'lobby', img: 'finishes' });

  // D services: equipment counted the way an MEP estimator would, so each piece can carry its own product EPD
  const sv = B.services || {};
  const gfaFt2 = gfa / SQFT;
  if (sv.lifts) add({ id: 'D1010', code: 'D1010', group: 'Services', name: 'Passenger lifts', qty: { v: sv.lifts, u: 'ea' }, layers: [{ m: 'lift', need: { v: sv.lifts, u: 'ea' } }], life: 25,
    unit: { label: 'One lift', dims: 'machine, car, rails, doors', count: sv.lifts, v: 1 }, calc: [q(`${sv.lifts} lifts`), ' from the drawings, replaced every ', f('25 years'), '.'], geom: 'lifts', img: 'lifts' });
  const coolKW = gfaFt2 / 350 * 3.517;
  add({ id: 'D3030', code: 'D3030', group: 'Services', name: 'Chillers', qty: { v: coolKW, u: 'kW' }, layers: [{ m: 'chiller', need: { v: coolKW, u: 'kW' } }], life: 25,
    unit: { label: 'Cooling capacity', dims: `${nf(coolKW / 3.517)} tons`, count: 1, v: coolKW }, calc: [q(`${nf(gfaFt2)} ft²`), ' ÷ ', f('350 ft²/ton'), ' = ', r(`${nf(coolKW / 3.517)} tons (${nf(coolKW)} kW)`), ' of chiller plant, replaced every ', f('25 years'), '.'], geom: 'services', img: 'services' });
  const air = gfa * 0.00508;
  add({ id: 'D3040-A', code: 'D3040', group: 'Services', name: 'Air-handling units', qty: { v: air, u: 'm³/s' }, layers: [{ m: 'ahu', need: { v: air, u: 'm³/s' } }], life: 25,
    unit: { label: 'Supply air', dims: `${nf(air * 2119)} cfm`, count: 1, v: air }, calc: [q(`${nf(gfaFt2)} ft²`), ' × ', f('1 cfm/ft²'), ' = ', r(`${nf(air, 1)} m³/s`), ' of air handling.'], geom: 'services', img: 'services' });
  add({ id: 'D3040-D', code: 'D3040', group: 'Services', name: 'Ductwork', qty: { v: gfa * 6, u: 'kg' }, layers: [{ m: 'duct', kg: gfa * 6 }], life: 50,
    unit: { label: 'Duct per m² of floor', dims: '6 kg galvanised sheet', count: Math.round(gfa), v: 6 }, calc: [q(`${nf(gfa)} m²`), ' × ', f('6 kg/m²'), ' galvanised duct = ', r(`${nf(gfa * 6 / 1000)} t`), '.'], geom: 'services', img: 'services' });
  const nRad = Math.round(perimFloors / modW);
  if (sv.radiators !== false) add({ id: 'D3050', code: 'D3050', group: 'Services', name: 'Perimeter radiators', qty: { v: nRad, u: 'ea' }, layers: [{ m: 'radiator', kg: nRad * 35 }], life: 40,
    unit: { label: 'One radiator under one window module', dims: `${nf(modW, 2)} m wide steel panel, about 35 kg`, count: nRad, v: 1 }, calc: [q(`${nf(perimFloors)} m`), ' of perimeter over all floors ÷ ', f(`${nf(modW, 2)} m module`), ' = ', r(`${nf(nRad)} radiators`), ' × ', f('35 kg'), ' (double panel, 600 × 1,400 mm catalogue mass).'], geom: 'services', img: 'services' });
  add({ id: 'D2020', code: 'D2020', group: 'Services', name: 'Water and heating pipework', qty: { v: gfa * 1.5, u: 'kg' }, layers: [{ m: 'pipe', kg: gfa * 1.5 }], life: 40,
    unit: { label: 'Pipe per m² of floor', dims: '1.5 kg', count: Math.round(gfa), v: 1.5 }, calc: [q(`${nf(gfa)} m²`), ' × ', f('1.5 kg/m²'), ' pipe = ', r(`${nf(gfa * 1.5 / 1000)} t`), '.'], geom: 'services', img: 'services' });
  const nLum = Math.round(above / 8);
  add({ id: 'D5020', code: 'D5020', group: 'Services', name: 'Luminaires', qty: { v: nLum, u: 'ea' }, layers: [{ m: 'light', need: { v: nLum, u: 'ea' } }], life: 20,
    unit: { label: 'One luminaire', dims: 'one per 8 m² of office floor', count: nLum, v: 1 }, calc: [q(`${nf(above)} m²`), ' ÷ ', f('8 m² per fitting'), ' = ', r(`${nf(nLum)} luminaires`), '.'], geom: 'services', img: 'services' });
  add({ id: 'D5010', code: 'D5010', group: 'Services', name: 'Electrical cable', qty: { v: gfa * 1.2, u: 'kg' }, layers: [{ m: 'cable', kg: gfa * 1.2 }], life: 40,
    unit: { label: 'Cable per m² of floor', dims: '1.2 kg', count: Math.round(gfa), v: 1.2 }, calc: [q(`${nf(gfa)} m²`), ' × ', f('1.2 kg/m²'), ' cable = ', r(`${nf(gfa * 1.2 / 1000)} t`), '.'], geom: 'services', img: 'services' });
  const nTank = Math.max(1, Math.round(gfaFt2 / 100000));
  add({ id: 'D2020-W', code: 'D2020', group: 'Services', name: 'Hot-water storage tanks', qty: { v: nTank, u: 'ea' }, layers: [{ m: 'water-heater', need: { v: nTank, u: 'ea' } }], life: 20,
    unit: { label: 'One tank', dims: 'per 100,000 ft²', count: nTank, v: 1 }, calc: [q(`${nf(gfaFt2)} ft²`), ' ÷ ', f('100,000 ft² per tank'), ' = ', r(`${nTank} tanks`), '.'], geom: 'services', img: 'services' });
  const nPump = Math.max(2, Math.round(gfaFt2 / 25000));
  add({ id: 'D3040-P', code: 'D3040', group: 'Services', name: 'Circulating pumps', qty: { v: nPump, u: 'ea' }, layers: [{ m: 'pump', need: { v: nPump, u: 'ea' } }], life: 20,
    unit: { label: 'One pump', dims: 'per 25,000 ft²', count: nPump, v: 1 }, calc: [q(`${nf(gfaFt2)} ft²`), ' ÷ ', f('25,000 ft² per pump'), ' = ', r(`${nPump} pumps`), '.'], geom: 'services', img: 'services' });

  // G sitework
  for (const p of B.site?.paving || []) add({ id: `G2030-${p.id}`, code: 'G2030', group: 'Sitework', name: p.name, qty: { v: p.area, u: 'm²' }, layers: [{ m: p.material, kg: p.area * p.thk * MATERIALS[p.material].density }, { m: conc, kg: p.area * 0.15 * 2400 }], life: 100,
    unit: { label: 'One square metre', dims: `${p.thk * 1000} mm ${MATERIALS[p.material].name.split('(')[0].trim().toLowerCase()} on 150 mm concrete`, count: Math.round(p.area), v: 1 }, calc: [q(`${nf(p.area)} m²`), ' of ', f(`${p.thk * 1000} mm`), ` ${MATERIALS[p.material].name.split(' ')[0].toLowerCase()} on a `, f('150 mm'), ' concrete bed.'], geom: p.id === 'plaza' ? 'plaza' : 'parapet', img: 'plaza' });
  const pools = B.site?.pools || [];
  if (pools.length) {
    const v = sum(pools, (p) => (p.w * p.d + 2 * (p.w + p.d) * p.depth) * 0.3);
    add({ id: 'G2050', code: 'G2050', group: 'Sitework', name: `Reflecting pools (${pools.length})`, qty: { v, u: 'm³' }, layers: [{ m: conc, kg: v * 2400 }, { m: 'rebar', kg: v * 100 }], life: 60,
      unit: { label: 'One pool basin', dims: `${nf(pools[0].w, 1)} × ${nf(pools[0].d, 1)} × ${pools[0].depth} m`, count: pools.length, v: v / pools.length }, calc: [q(`${pools.length} basins`), ', ', f('0.3 m'), ' floor and walls = ', r(`${nf(v)} m³`), '; rebar ', f('100 kg/m³'), '.'], geom: 'pools', img: 'pools' });
  }
  for (const c of comps) c.sys = c.group;
  return { components: comps, gfa, above, below };
}

/* ------------------------------------------------------------------ calibration */

// Scale the takeoff to documented quantities (known steel tonnage, facade metal, glass area) the way an estimator reconciles a
// model against a bill of quantities. Layers carry a `cal` tag saying which documented total they belong to.
export function calibrate(T, known = {}) {
  const out = [];
  const tagged = (tag, pick) => T.components.flatMap((c) => c.layers.filter((l) => l.cal === tag && (!pick || pick(l))).map((l) => ({ c, l })));
  if (known.steelT) {
    const steelKg = sum(tagged('steel', (l) => /^steel-section/.test(l.m)), ({ l }) => l.kg);
    if (steelKg) { const fct = known.steelT * 1000 / steelKg; for (const { c, l } of tagged('steel')) { l.kg *= fct; c.calibrated = fct; } out.push({ k: 'Structural steel', u: 't', model: steelKg / 1000, known: known.steelT, f: fct }); }
  }
  if (known.facadeMetalT) {
    const m = sum(tagged('facade'), ({ l }) => l.kg);
    if (m) { const fct = known.facadeMetalT * 1000 / m; for (const { c, l } of tagged('facade')) { l.kg *= fct; c.calibrated = fct; } out.push({ k: 'Curtain-wall metal', u: 't', model: m / 1000, known: known.facadeMetalT, f: fct }); }
  }
  if (known.glassM2) {
    const fac = T.components.find((c) => c.facadeFrame);
    const g = fac?.layers.find((l) => l.cal === 'glass');
    if (g) { const kgm2 = (FACADES[Object.keys(FACADES).find((k) => FACADES[k].glass[0] === g.m)]?.glass[1]) || 15; const model = g.kg / kgm2; const fct = known.glassM2 / model; g.kg *= fct; fac.glassCal = fct; out.push({ k: 'Vision glass', u: 'm²', model, known: known.glassM2, f: fct }); }
  }
  if (known.gfaM2) out.push({ k: 'Gross floor area', u: 'm²', model: T.gfa, known: known.gfaM2, f: known.gfaM2 / T.gfa, info: true });
  return out;
}

/* ------------------------------------------------------------------ lifecycle */

const LIFE_KEYS = ['A1', 'A2', 'A3', 'A1A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'C1', 'C2', 'C3', 'C4', 'D'];
const zeroMods = () => Object.fromEntries(LIFE_KEYS.map((k) => [k, 0]));
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const PRODUCT = ['A1A3', 'A4', 'A5'], EOL = ['C1', 'C2', 'C3', 'C4'];

// How much of an EPD's declared unit a layer uses: kg for bulk materials, a count for equipment sized from its declared unit
export function amountFor(layer, epd) {
  if (!epd) return { amount: 0, by: 'no EPD' };
  if (!epd.perUnit) return { amount: layer.kg || 0, by: 'kg' };
  const need = layer.need || { v: layer.n || 0, u: 'ea' };
  if (need.u === 'ea') return { amount: need.v, by: 'ea' };
  const size = epd.unitSize?.value;
  if (size && (epd.unitSize.unit || '').replace(/\s/g, '') === need.u.replace(/\s/g, '')) return { amount: Math.max(1, Math.ceil(need.v / size)), by: `${need.u} ÷ ${size}` };
  return { amount: Math.max(1, Math.ceil(need.v)), by: 'ea' };
}

/*
  assess(B, opts) → the lifecycle result, EPD by EPD.
  opts: rsp, epds (key → normalised EPD, from epd.js), swaps {from: to}, calibrate, takeoff (precomputed),
        fill (bool) — fill modules an EPD does not declare with project scenarios (transport by map distance, site waste, haulage),
        origins {materialKey: km to site}, op {B6, B7} operational totals over the study period (from energy.js),
        keep (fn component → bool) — components that already exist, so their A1–A5 is spent (adaptive reuse),
        extraEol {C1..C4, D} — end of life of parts of an existing building removed to make way
*/
export function assess(B, opts = {}) {
  const rsp = opts.rsp || B.rsp || 60;
  const T = opts.takeoff || takeoff(B);
  const epds = opts.epds || {};
  const cal = opts.calibrate && B.documented ? calibrate(T, B.documented) : [];
  const rows = [];
  const materials = {};
  const lowHigh = { low: 0, high: 0 };
  const gfaT = T.gfa;

  for (const c of T.components) {
    const mods = zeroMods(), st = {}, dParts = { reuse: 0, recycling: 0, recovery: 0, other: 0 };
    const mats = [];
    let mass = 0;
    const kept = opts.keep ? opts.keep(c) : false;
    if (c.site && !opts.fill) { rows.push({ ...c, mods, st: Object.fromEntries(LIFE_KEYS.map((k) => [k, 'scenario-off'])), mass: 0, mats, embodied: 0, dParts, scenarioRow: true }); continue; }
    if (c.site === 'A5') { mods.A5 = gfaT * 20; st.A5 = 'scenario'; }
    if (c.site === 'C1') { mods.C1 = gfaT * 3.4; st.C1 = 'scenario'; }
    for (const l of c.layers) {
      const key = opts.swaps?.[l.m] || l.m;
      const mat = MATERIALS[key] || { name: key, cat: 'Other', density: 1000, waste: 0.05, eol: 0, a4: [['truck', 300]] };
      const epd = epds[key] || null;
      const { amount, by } = amountFor(l, epd);
      const kg = epd?.perUnit ? (epd.kgPerUnit || 0) * amount : l.kg || 0;
      mass += kg;
      const life = l.life || c.life || 200;
      const nRep = Math.max(0, Math.ceil(rsp / life) - 1);
      const lm = zeroMods(), lst = {};
      if (epd) {
        for (const k of LIFE_KEYS) {
          if (k === 'B4' || k === 'B6' || k === 'B7') continue;
          const v = epd.per[k];
          if (isNum(v)) { lm[k] = v * amount; lst[k] = 'declared'; } else lst[k] = k === 'A1' || k === 'A2' || k === 'A3' ? (epd.split ? 'nd' : 'agg') : 'nd';
        }
        // undeclared modules filled with project scenarios only when asked
        if (opts.fill) {
          const km = opts.origins?.[key] ?? sum(mat.a4 || [], ([, d]) => d);
          if (lst.A4 !== 'declared') { const legs = opts.origins?.[key] != null ? opts.legs?.[key] || [['truck', km]] : mat.a4 || [['truck', km]]; lm.A4 = kg * sum(legs, ([mode, d]) => TRANSPORT[mode] * d); lst.A4 = 'scenario'; }
          if (lst.A5 !== 'declared') { lm.A5 = (mat.waste ?? 0.05) * (lm.A1A3 + lm.A4); lst.A5 = 'scenario'; }
          if (lst.C2 !== 'declared') { lm.C2 = kg * TRANSPORT.truck * 50; lst.C2 = 'scenario'; }
          if (lst.B2 !== 'declared' && (l.b2 || c.b2)) { lm.B2 = (l.b2 || c.b2) * rsp * lm.A1A3; lst.B2 = 'scenario'; }
        }
        // B4 is a building-level result: the EPD's own product, construction and end-of-life modules, once per replacement
        const repl = sum([...PRODUCT, ...EOL], (k) => lm[k]);
        lm.B4 = nRep * repl; lst.B4 = nRep ? 'derived' : 'none';
        // Module D split by what the EPD says it covers
        if (lst.D === 'declared') dParts[epd.dType || 'other'] += lm.D;
        // range across alternative EPDs for the same material
        const alts = opts.alts?.[key] || [epd];
        const a13s = alts.map((e) => (isNum(e.per.A1A3) ? e.per.A1A3 * amount : null)).filter(isNum);
        if (a13s.length) { lowHigh.low += Math.min(...a13s) - lm.A1A3; lowHigh.high += Math.max(...a13s) - lm.A1A3; }
      } else for (const k of LIFE_KEYS) lst[k] = 'noepd';
      if (kept) { for (const k of PRODUCT) lm[k] = 0; lm.A1 = 0; lm.A2 = 0; lm.A3 = 0; for (const k of ['A1', 'A2', 'A3', ...PRODUCT]) lst[k] = 'spent'; }
      for (const k of LIFE_KEYS) mods[k] += lm[k];
      for (const k of LIFE_KEYS) {
        const s = lst[k];
        if (!s) continue;
        const prev = st[k];
        st[k] = !prev ? s : prev === s ? s : (prev === 'declared' || s === 'declared') ? 'partial' : prev;
      }
      const name = epd?.productName || mat.name;
      mats.push({ key, name, cat: mat.cat, kg, amount, by, epd, mods: lm, st: lst, nRep, life });
      const M = materials[key] || (materials[key] = { key, name, cat: mat.cat, kg: 0, amount: 0, mods: zeroMods(), st: {}, epd, comps: [], groups: new Set() });
      M.kg += kg * (1 + nRep); M.amount += amount; for (const k of LIFE_KEYS) M.mods[k] += lm[k];
      for (const k of LIFE_KEYS) if (lst[k]) M.st[k] = M.st[k] && M.st[k] !== lst[k] ? 'partial' : lst[k];
      M.comps.push({ id: c.id, name: c.name, kg }); M.groups.add(c.group);
    }
    const embodied = sum(['A1A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4'], (k) => mods[k]);
    rows.push({ ...c, mods, st, mass, mats, embodied, dParts, kept });
  }

  // B5 refurbishment package (retrofits): its own layers, counted from their EPDs
  for (const rf of opts.retrofit ? opts.retrofit(T, B) : []) {
    const mods = zeroMods(), st = { B5: 'derived' };
    for (const l of rf.layers || []) {
      const epd = epds[l.m]; if (!epd) continue;
      const { amount } = amountFor(l, epd);
      mods.B5 += sum(PRODUCT, (k) => (isNum(epd.per[k]) ? epd.per[k] * amount : 0));
      for (const k of EOL) if (isNum(epd.per[k])) mods[k] += epd.per[k] * amount;
    }
    rows.push({ id: rf.id, code: 'B5', group: 'Refurbishment', sys: 'Refurbishment', name: rf.name, qty: rf.qty, mods, st, mass: 0, mats: [], method: rf.method, calc: [rf.method], embodied: mods.B5 + sum(EOL, (k) => mods[k]), dParts: { reuse: 0, recycling: 0, recovery: 0, other: 0 } });
  }

  const totals = zeroMods();
  const dTot = { reuse: 0, recycling: 0, recovery: 0, other: 0 };
  for (const rw of rows) { for (const k of LIFE_KEYS) totals[k] += rw.mods[k]; for (const k in dTot) dTot[k] += rw.dParts[k]; }
  totals.B6 = opts.op?.B6 || 0; totals.B7 = opts.op?.B7 || 0;
  if (opts.extraEol) for (const k of [...EOL, 'D']) totals[k] += opts.extraEol[k] || 0;
  if (opts.extraEol?.D) dTot[opts.extraEol.dType || 'recycling'] += opts.extraEol.D;
  const upfront = totals.A1A3 + totals.A4 + totals.A5;
  const embodied = upfront + totals.B1 + totals.B2 + totals.B3 + totals.B4 + totals.B5 + sum(EOL, (k) => totals[k]);
  const whole = embodied + totals.B6 + totals.B7;
  const gfa = B.documented?.gfaM2 && opts.calibrate ? B.documented.gfaM2 : opts.gfa || T.gfa;
  const perM2 = upfront / gfa;
  const band = LETI_OFFICE.find(([, lim]) => perM2 <= lim)?.[0] || 'Beyond G';

  const mats = Object.values(materials).map((m) => ({ ...m, groups: [...m.groups], a13PerKg: m.epd && !m.epd.perUnit && isNum(m.epd.per.A1A3) ? m.epd.per.A1A3 : m.kg ? m.mods.A1A3 / m.kg : 0, embodied: sum(['A1A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', ...EOL], (k) => m.mods[k]) }));
  const groups = {};
  for (const rw of rows) {
    const g = groups[rw.group] || (groups[rw.group] = { group: rw.group, mass: 0, A1A3: 0, embodied: 0, rows: 0 });
    g.mass += rw.mass; g.A1A3 += rw.mods.A1A3; g.embodied += rw.embodied; g.rows++;
  }
  for (const g of Object.values(groups)) g.intensity = g.mass ? g.A1A3 / g.mass : 0;
  const missing = mats.filter((m) => !m.epd).map((m) => m.key);
  const undeclared = ['A4', 'A5', 'C1', 'C2', 'C3', 'C4', 'D'].filter((k) => rows.some((rw) => rw.st[k] === 'nd' || rw.st[k] === 'partial'));

  return {
    building: B.name, rsp, gfa, modelGfa: T.gfa, rows, totals, dParts: dTot, upfront, embodied, whole, perM2, band,
    range: { upfrontLow: upfront + lowHigh.low, upfrontHigh: upfront + lowHigh.high },
    materials: mats.sort((a, b) => b.mods.A1A3 - a.mods.A1A3),
    byMaterial: mats.map((m) => ({ key: m.key, name: m.name, cat: m.cat, kg: m.kg, A1A3: m.mods.A1A3 })).sort((a, b) => b.A1A3 - a.A1A3),
    groups: Object.values(groups).sort((a, b) => b.embodied - a.embodied),
    hotspots: [...rows].sort((a, b) => b.embodied - a.embodied).slice(0, 5),
    calibration: cal, missing, undeclared, fill: Boolean(opts.fill)
  };
}

// End-of-life modules (C1–C4, D) of components of a building that are removed: demolition before a rebuild, or stripping a facade
export function eolOf(B, opts = {}, pick = () => true) {
  const R = assess(B, { ...opts, op: null, rsp: 1 });
  const out = { C1: 0, C2: 0, C3: 0, C4: 0, D: 0 };
  for (const rw of R.rows) if (pick(rw)) for (const k in out) out[k] += rw.mods[k];
  return out;
}

/* ------------------------------------------------------------------ exports */

// One row per component, one column per module; an undeclared module is written as ND, a scenario value is marked "(scenario)"
export function toCSV(R) {
  const head = ['Uniformat', 'System', 'Component', 'Quantity', 'Unit', 'Mass (kg)', ...MODULES.map((m) => `${m.label} kgCO2e`), 'Embodied A–C kgCO2e', 'Materials and EPDs', 'Method'];
  const esc = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const cell = (r, k) => { const v = k === 'A1' || k === 'A2' || k === 'A3' ? (r.st[k] === 'agg' ? 'A1–A3 only' : r.mods[k]) : r.mods[k]; const st = r.st[k]; return st === 'nd' || st === 'noepd' ? 'ND' : typeof v === 'string' ? v : `${round(v)}${st === 'scenario' ? ' (scenario)' : st === 'derived' ? ' (derived)' : ''}`; };
  const lines = [head.join(',')];
  for (const r of R.rows) lines.push([r.code, r.group, r.name, round(r.qty?.v || 0, 1), r.qty?.u || '', round(r.mass), ...MODULES.map((m) => cell(r, m.k)), round(r.embodied), r.mats.map((m) => `${m.name}: ${m.epd ? `${m.epd.manufacturer} EPD ${m.epd.regNo || ''}`.trim() : 'no EPD'}`).join('; '), r.method].map(esc).join(','));
  lines.push(['', '', 'Operational (B6, B7)', '', '', '', ...MODULES.map((m) => (m.k === 'B6' ? round(R.totals.B6) : m.k === 'B7' ? round(R.totals.B7) : '')), '', '', ''].map(esc).join(','));
  lines.push(['', '', 'TOTAL', '', '', '', ...MODULES.map((m) => round(R.totals[m.k === 'A1' || m.k === 'A2' || m.k === 'A3' ? m.k : m.k])), round(R.embodied), '', ''].map(esc).join(','));
  return lines.join('\n');
}

export const fmt = {
  t: (kg) => (Math.abs(kg) >= 1e6 ? `${(kg / 1e6).toFixed(kg >= 1e7 ? 0 : 1)} kt` : `${Math.round(kg / 1000).toLocaleString('en-US')} t`),
  n: (v, d = 0) => (Number.isFinite(v) ? v.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d }) : '–'),
  round
};
