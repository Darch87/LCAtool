// Lifecycle Takeoff · reading 3D models. Pure geometry and classification so it runs in tests:
// meshes (positions, indices, name, material, IFC class, declared quantities) → takeoff components.
// Priority, the way BIM-to-LCA tools work: 1. declared quantities (IFC base quantities, our glTF extras) 2. IFC class and
// material names 3. geometry alone (a tall thin box is a column, a wide flat one is a slab, a transparent plane is glass).
import { MATERIALS } from './library.js';
import { takeoff } from './engine.js';

// Signed-tetrahedron volume and surface area of a triangle mesh. Volume is only meaningful for closed meshes.
export function meshStats(pos, idx) {
  let vol = 0, area = 0;
  const n = idx ? idx.length : pos.length / 3;
  const P = (i) => { const k = (idx ? idx[i] : i) * 3; return [pos[k], pos[k + 1], pos[k + 2]]; };
  let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
  for (let k = 0; k < pos.length; k += 3) { const x = pos[k], y = pos[k + 1], z = pos[k + 2]; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; if (z < z0) z0 = z; if (z > z1) z1 = z; }
  let horiz = 0;
  for (let i = 0; i + 2 < n; i += 3) {
    const a = P(i), b = P(i + 1), c = P(i + 2);
    vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const ar = Math.hypot(cr[0], cr[1], cr[2]) / 2;
    area += ar;
    if (ar > 0 && Math.abs(cr[1]) / (2 * ar) > 0.9) horiz += ar; // y-up: faces pointing up or down
  }
  return { volume: Math.abs(vol), area, horiz, bbox: { x: x1 - x0, y: y1 - y0, z: z1 - z0, min: [x0, y0, z0], max: [x1, y1, z1] } };
}

// Element classes with Uniformat code, the material they default to and a thickness for open surfaces
export const CLASSES = {
  footing: { code: 'A1010', group: 'Substructure', name: 'Foundations', mat: 'concrete', rebar: 80, thk: 0.6 },
  column: { code: 'B1010', group: 'Superstructure', name: 'Columns', mat: 'steel-section', thk: 0.3 },
  beam: { code: 'B1010', group: 'Superstructure', name: 'Beams', mat: 'steel-section', thk: 0.3 },
  slab: { code: 'B1010', group: 'Superstructure', name: 'Floor slabs', mat: 'concrete', rebar: 40, thk: 0.15 },
  wall: { code: 'B1010', group: 'Superstructure', name: 'Walls and cores', mat: 'concrete', rebar: 100, thk: 0.25 },
  curtain: { code: 'B2010', group: 'Exterior enclosure', name: 'Curtain wall framing', mat: 'aluminium', thk: 0.004 },
  glass: { code: 'B2020', group: 'Exterior enclosure', name: 'Glazing', mat: 'glass', thk: 0.012 },
  cladding: { code: 'B2010', group: 'Exterior enclosure', name: 'Cladding', mat: 'precast', thk: 0.1 },
  roof: { code: 'B3010', group: 'Roofing', name: 'Roof', mat: 'concrete', rebar: 40, thk: 0.2 },
  stair: { code: 'C2010', group: 'Interiors', name: 'Stairs', mat: 'concrete', rebar: 80, thk: 0.2 },
  partition: { code: 'C1010', group: 'Interiors', name: 'Partitions', mat: 'gypsum', thk: 0.1 },
  finish: { code: 'C3020', group: 'Interiors', name: 'Finishes', mat: 'travertine', thk: 0.03 },
  door: { code: 'C1020', group: 'Interiors', name: 'Doors', mat: 'steel-stud', thk: 0.005 },
  site: { code: 'G2030', group: 'Sitework', name: 'Site paving', mat: 'granite', thk: 0.08 },
  other: { code: 'Z', group: 'Unclassified', name: 'Unclassified elements', mat: 'concrete', thk: 0.1 }
};

const IFC_CLASS = [
  [/IFCFOOTING|IFCPILE/, 'footing'], [/IFCCOLUMN/, 'column'], [/IFCBEAM|IFCMEMBER/, 'beam'], [/IFCSLAB/, 'slab'], [/IFCROOF/, 'roof'],
  [/IFCCURTAINWALL/, 'curtain'], [/IFCPLATE|IFCWINDOW/, 'glass'], [/IFCWALL/, 'wall'], [/IFCSTAIR|IFCRAMP/, 'stair'],
  [/IFCDOOR/, 'door'], [/IFCCOVERING/, 'finish'], [/IFCRAILING/, 'beam']
];
const NAME_CLASS = [
  [/footing|foundation|pile|raft/i, 'footing'], [/column|\bcol\b|pillar/i, 'column'], [/beam|girder|joist|brac|truss/i, 'beam'],
  [/glass|glaz|window|vision/i, 'glass'], [/mullion|transom|curtain|spandrel/i, 'curtain'], [/slab|floor|deck/i, 'slab'],
  [/roof/i, 'roof'], [/core|shear|wall/i, 'wall'], [/stair/i, 'stair'], [/partition|drywall/i, 'partition'],
  [/clad|panel|facade|façade/i, 'cladding'], [/plaza|paving|landscape|site/i, 'site'], [/door/i, 'door']
];
const MAT_NAME = [
  [/bronze|brass|muntz|copper/i, 'bronze'], [/alumin/i, 'aluminium'], [/glass|glaz/i, 'glass'], [/rebar|reinforc/i, 'rebar'],
  [/steel|metal|iron/i, 'steel-section'], [/precast/i, 'precast'], [/concrete|cement|beton/i, 'concrete'], [/granite/i, 'granite'],
  [/travertine|limestone/i, 'travertine'], [/marble|serpentine/i, 'marble'], [/brick|masonry/i, 'brick'], [/gypsum|plaster/i, 'gypsum'],
  [/clt|timber|wood|glulam/i, 'clt'], [/insulat|wool/i, 'mineral-wool'], [/water/i, 'water']
];

export function classify(m) {
  if (m.ifcType) for (const [re, c] of IFC_CLASS) if (re.test(m.ifcType)) return { cls: c, by: `IFC class ${m.ifcType}` };
  const label = `${m.name || ''} ${m.material || ''}`;
  for (const [re, c] of NAME_CLASS) if (re.test(label)) return { cls: c, by: `name "${(m.name || m.material || '').slice(0, 40)}"` };
  if (m.transparent) return { cls: 'glass', by: 'transparent material' };
  const b = m.stats.bbox, plan = Math.max(b.x, b.z), minPlan = Math.min(b.x, b.z);
  if (b.y > 2.5 * plan && plan < 2) return { cls: 'column', by: 'geometry: tall and slender' };
  if (b.y < 0.6 && plan > 3 && minPlan > 1) return { cls: 'slab', by: 'geometry: wide and flat' };
  if (minPlan < 0.6 && b.y > 2 && plan > 2) return { cls: 'wall', by: 'geometry: thin and vertical' };
  if (b.y < 1.2 && minPlan < 1 && plan > 3) return { cls: 'beam', by: 'geometry: long and shallow' };
  return { cls: 'other', by: 'not recognised' };
}

export function materialFor(m, cls) {
  const label = `${m.material || ''} ${m.name || ''}`;
  for (const [re, k] of MAT_NAME) if (re.test(label)) return { key: k, by: `material "${(m.material || m.name).slice(0, 30)}"` };
  return { key: CLASSES[cls].mat, by: `default for ${CLASSES[cls].name.toLowerCase()}` };
}

// Detect drawing units from overall size: a building more than ~1,500 units tall or wide is in millimetres
export function guessUnits(maxDim) { return maxDim > 1500 ? { f: 0.001, name: 'millimetres' } : maxDim > 600 ? { f: 0.0254, name: 'inches' } : { f: 1, name: 'metres' }; }

/*
  meshes: [{ name, material, transparent, ifcType, stats (meshStats in metres), declared?: { componentId, name, code, group, qty, layers } }]
  → { components (engine format), gfa, report }
*/
export function meshesToTakeoff(meshes, { matOverride = {}, includeOther = false } = {}) {
  const comps = new Map();
  const report = { meshes: meshes.length, declared: 0, byClass: {}, unclassified: 0, open: 0, excluded: 0 };
  let gfa = 0;
  for (const m of meshes) {
    if (m.declared) {
      report.declared++;
      const d = m.declared;
      if (!comps.has(d.componentId)) comps.set(d.componentId, { id: d.componentId, code: d.code, group: d.group, name: d.name, qty: d.qty, layers: d.layers.map((l) => ({ ...l })), life: d.life || 200, b2: d.b2 || 0, proxy: d.proxy, site: d.site, method: `Declared quantities carried in the model (${d.code}).`, geom: d.geom, from3d: true });
      if (d.gfa) gfa = d.gfa;
      continue;
    }
    const { cls, by } = classify(m);
    const C = CLASSES[cls];
    const mat = materialFor(m, cls);
    const key = matOverride[cls] || mat.key;
    const M = MATERIALS[key] || MATERIALS.concrete;
    m.cls = cls; m.mat = key;
    const closed = m.stats.volume > 1e-6 && m.stats.volume <= m.stats.bbox.x * m.stats.bbox.y * m.stats.bbox.z * 1.01;
    const vol = closed ? m.stats.volume : m.stats.area / 2 * C.thk;
    if (!closed) report.open++;
    if (cls === 'slab') gfa += m.stats.bbox.x * m.stats.bbox.z;
    report.byClass[cls] = (report.byClass[cls] || 0) + 1;
    if (cls === 'other') { report.unclassified++; if (!includeOther) { report.excluded++; continue; } }
    const id = `3D-${cls}-${key}`;
    const c = comps.get(id) || { id, code: C.code, group: C.group, name: `${C.name} · ${M.name.split('(')[0].trim().toLowerCase()}`, qty: { v: 0, u: 'm³' }, layers: [], life: cls === 'glass' ? 40 : cls === 'roof' ? 30 : cls === 'partition' || cls === 'finish' ? 30 : 200, b2: 0, method: '', count: 0, by: new Set(), geom: `cls:${cls}`, from3d: true };
    c.count++; c.qty.v += vol; c.by.add(by); c.by.add(mat.by);
    const kg = vol * M.density;
    const L = c.layers.find((l) => l.m === key) || (c.layers.push({ m: key, kg: 0 }), c.layers[c.layers.length - 1]); L.kg += kg;
    if (C.rebar && key === 'concrete') { const R = c.layers.find((l) => l.m === 'rebar') || (c.layers.push({ m: 'rebar', kg: 0 }), c.layers[c.layers.length - 1]); R.kg += vol * C.rebar; }
    comps.set(id, c);
  }
  const components = [...comps.values()].map((c) => (c.by ? { ...c, method: `${c.count} element${c.count > 1 ? 's' : ''}; classified by ${[...c.by].slice(0, 3).join(', ')}. Volume from closed geometry, else surface × typical thickness.`, by: undefined } : c));
  // A geometry-only model carries no services: count the same equipment the drawings takeoff uses, from the modelled floor area
  if (!report.declared && gfa > 0) {
    const side = Math.sqrt(gfa);
    const syn = { blocks: [{ id: 'm', x: 0, y: 0, w: side, d: side, levels: 1, f2f: 3.7, baysX: 1, baysY: 1 }], services: { lifts: Math.round(gfa / 4500), radiators: false }, structure: {}, facade: {}, interiors: {} };
    for (const c of takeoff(syn).components) if (c.group === 'Services') components.push({ ...c, name: `${c.name} (not modelled)`, method: `${c.method} Services are rarely in an architectural model, so they are counted from the modelled floor area.` });
  }
  return { components, gfa, report };
}
