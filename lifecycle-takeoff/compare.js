// Lifecycle Takeoff · scenario builder. The user picks materials for the system layers that matter most, a reuse strategy, an
// efficiency package and fuel sources; this runs the same takeoff, the same EPDs and the same operational model as the other tabs.
import { assess, eolOf, takeoff } from './engine.js';
import { run as runOp, defaultLayers, END_USES } from './energy.js';

export const LAYER_CHOICES = {
  structure: { label: 'Structure', options: [
    { id: 'existing', name: 'Keep existing frame', existing: true },
    { id: 'steel', name: 'Steel frame, BF-BOF mix', set: (B) => { B.structure = { ...B.structure, frame: 'steel', steel: 'steel-section' }; } },
    { id: 'steel-eaf', name: 'Steel frame, EAF recycled', set: (B) => { B.structure = { ...B.structure, frame: 'steel', steel: 'steel-section-eaf' }; } },
    { id: 'concrete', name: 'Reinforced concrete frame', set: (B) => { B.structure = { ...B.structure, frame: 'concrete', slab: 'flat-plate', slabThk: 0.25, encasement: false }; } },
    { id: 'timber', name: 'Mass timber (glulam)', set: (B) => { B.structure = { ...B.structure, frame: 'timber', slab: 'clt', encasement: false }; } }
  ] },
  floors: { label: 'Floors', options: [
    { id: 'existing', name: 'Keep existing slabs', existing: true },
    { id: 'concrete', name: 'Concrete on steel deck', set: (B) => { if (B.structure.frame === 'steel') Object.assign(B.structure, { slab: 'deck', slabThk: 0.12 }); B.structure.concrete = 'concrete'; } },
    { id: 'concrete-low', name: 'Low-carbon concrete', set: (B) => { if (B.structure.frame === 'steel') Object.assign(B.structure, { slab: 'deck', slabThk: 0.12 }); B.structure.concrete = 'concrete-lowcarbon'; } },
    { id: 'clt', name: 'CLT panels', set: (B) => { B.structure.slab = 'clt'; } }
  ] },
  envelope: { label: 'Envelope', options: [
    { id: 'existing', name: 'Keep existing facade', existing: true },
    { id: 'bronze-cw', name: 'Bronze curtain wall', set: (B) => { B.facade = { ...B.facade, system: 'bronze-cw' }; } },
    { id: 'aluminium-cw', name: 'Aluminium curtain wall, IGU', set: (B) => { B.facade = { ...B.facade, system: 'aluminium-cw', vision: undefined }; } },
    { id: 'aluminium-cw-recycled', name: 'Recycled aluminium curtain wall', set: (B) => { B.facade = { ...B.facade, system: 'aluminium-cw-recycled', vision: undefined }; } },
    { id: 'precast', name: 'Precast with punched windows', set: (B) => { B.facade = { ...B.facade, system: 'precast', vision: undefined }; } },
    { id: 'brick', name: 'Brick with punched windows', set: (B) => { B.facade = { ...B.facade, system: 'brick', vision: undefined }; } },
    { id: 'stone', name: 'Stone rainscreen', set: (B) => { B.facade = { ...B.facade, system: 'stone', vision: undefined }; } }
  ] },
  interiors: { label: 'Interiors', options: [
    { id: 'existing', name: 'Keep existing fit-out', existing: true },
    { id: 'standard', name: 'New standard fit-out', set: () => {} },
    { id: 'light', name: 'Light fit-out (fewer partitions, exposed soffits)', set: (B) => { B.interiors = { ...B.interiors, partitions: 0.15, ceilings: false }; } }
  ] }
};

export const REUSE = [
  { id: 'adaptive', name: 'Adaptive reuse', note: 'Keep the building. Kept layers carry no new product or construction carbon; replaced layers are new, and what they replace is demolished.' },
  { id: 'deconstruct', name: 'Deconstruct and rebuild', note: 'Take the building apart for reuse: structural steel and facade metal are salvaged instead of shredded, then build new.' },
  { id: 'demolish', name: 'Demolish and rebuild', note: 'Demolish conventionally, recycle what the EPDs say is recycled, then build new.' }
];
export const EFFICIENCY = [
  { id: 'as-is', name: 'No energy retrofit', note: 'Existing systems, or code-reference systems for a new building.' },
  { id: 'operational', name: 'Systems chosen in the Operational tab', note: 'Every system and passive measure from the Operational tab.' },
  { id: 'deep', name: 'Deep electrification retrofit', note: 'Heat pumps for heating and hot water, high-efficiency chillers, LED with controls, demand-controlled ventilation, efficient plug loads.' }
];
export const FUELS = [
  { id: 'operational', name: 'Sources chosen in the Operational tab' },
  { id: 'grid', name: 'Local grid and district steam' },
  { id: 'renewable', name: 'Renewable electricity contract' },
  { id: 'onsite', name: 'On-site solar for part of the load' }
];

export const DEEP = { heating: 'ashp', cooling: 'chiller-wc-centrifugal-modern', lighting: 'led-controls', plug: 'plug-efficient', shw: 'shw-hpwh', fans: 'fan-doas-ecm', other: 'other-efficient' };

const clone = (o) => structuredClone(o);
const SALVAGE = { 'steel-section': 0.5, 'steel-section-eaf': 0.5, bronze: 0.8, aluminium: 0.3, granite: 0.5, marble: 0.5, travertine: 0.5 };

export const defaultChoice = (B) => ({ structure: B.existing ? 'existing' : 'steel', floors: B.existing ? 'existing' : 'concrete', envelope: B.existing ? 'existing' : B.facade?.system || 'aluminium-cw', interiors: B.existing ? 'existing' : 'standard', reuse: B.existing ? 'adaptive' : null, efficiency: 'as-is', fuel: 'grid' });

export function describe(ch) {
  const pick = (k) => LAYER_CHOICES[k].options.find((o) => o.id === ch[k])?.name;
  return [ch.reuse && REUSE.find((r) => r.id === ch.reuse)?.name, pick('structure'), pick('envelope'), EFFICIENCY.find((e) => e.id === ch.efficiency)?.name, FUELS.find((f) => f.id === ch.fuel)?.name].filter(Boolean).join(' · ');
}

/*
  runScenario(B0, choice, ctx) → { R, op, choice }
  ctx: { epds, alts, opts (rsp, calibrate, fill, origins), opCfg (the Operational tab: program, areaM2, layers, loc, grid,
         measuredEUI, asIs) }
*/
export function runScenario(B0, ch, ctx) {
  const existing = Boolean(B0.existing);
  const reuse = existing ? ch.reuse || 'adaptive' : null;
  const keepLayer = (k) => existing && reuse === 'adaptive' && ch[k] === 'existing';
  const B = clone(B0);
  B.structure = { ...B.structure }; B.facade = { ...B.facade }; B.interiors = { ...B.interiors };
  const rebuild = existing && reuse !== 'adaptive';
  if (rebuild) { B.era = 'modern'; B.structure.encasement = false; B.interiors.finishes = []; B.facade.secondary = []; if (B.structure.slab === 'formed') { B.structure.slab = 'deck'; B.structure.slabThk = 0.12; } }
  for (const k of Object.keys(LAYER_CHOICES)) {
    const o = LAYER_CHOICES[k].options.find((x) => x.id === ch[k]);
    if (o?.existing && !keepLayer(k)) continue; // "keep" makes no sense when rebuilding: the baseline spec stands in
    o?.set?.(B);
  }
  // facade calibration only holds while the documented facade stays
  if (B.documented && B.facade.system !== B0.facade?.system) B.documented = { ...B.documented, facadeMetalT: undefined, glassM2: undefined };
  if (B.documented && rebuild) B.documented = { gfaM2: B.documented.gfaM2 };

  const groupOf = { structure: ['Substructure', 'Superstructure'], floors: [], envelope: ['Exterior enclosure', 'Roofing'], interiors: ['Interiors'] };
  const kept = new Set();
  if (existing && reuse === 'adaptive') {
    for (const k of ['structure', 'envelope', 'interiors']) if (keepLayer(k)) for (const g of groupOf[k]) kept.add(g);
    kept.add('Substructure');
    if (ch.efficiency === 'as-is') kept.add('Services');
    kept.add('Sitework');
  }
  const keep = (c) => kept.has(c.group) || (c.group === 'Superstructure' && c.id === 'B1010-S' && (keepLayer('floors') || keepLayer('structure')));

  // end of life of whatever comes out of the existing building
  let extraEol = null;
  if (existing) {
    const o = { ...ctx.opts, epds: ctx.epds };
    if (reuse === 'adaptive') {
      const removed = new Set();
      for (const k of ['envelope', 'interiors']) if (!keepLayer(k)) for (const g of groupOf[k]) removed.add(g);
      if (ch.efficiency !== 'as-is') removed.add('Services');
      extraEol = eolOf(B0, o, (r) => removed.has(r.group));
    } else {
      extraEol = eolOf(B0, o, () => true);
      if (reuse === 'deconstruct') {
        // salvaged metal and stone skip shredding and disposal; the reuse benefit is reported in D, not netted
        const R0 = assess(B0, { ...o, rsp: 1 });
        let reuseD = 0, avoided = { C3: 0, C4: 0 };
        for (const m of R0.materials) {
          const s = SALVAGE[m.key]; if (!s || !m.epd) continue;
          avoided.C3 += s * (m.mods.C3 || 0); avoided.C4 += s * (m.mods.C4 || 0);
          reuseD -= s * (m.mods.A1A3 || 0);
        }
        extraEol.C3 -= avoided.C3; extraEol.C4 -= avoided.C4;
        extraEol.D = reuseD; extraEol.dType = 'reuse';
      }
    }
  }

  // operational
  const opc = ctx.opCfg;
  let layers;
  if (ch.efficiency === 'operational') layers = clone(opc.layers);
  else if (ch.efficiency === 'deep') layers = Object.fromEntries(END_USES.map(({ k }) => [k, { system: DEEP[k], passive: [...(opc.layers[k]?.passive || [])], source: 'grid' }]));
  else layers = existing && !rebuild ? clone(opc.asIs || opc.layers) : defaultLayers(opc.program);
  const loc = { ...opc.loc };
  const res = runOp({ ...opc, layers: fixSources(layers, ch.fuel, opc.layers), loc, measuredEUI: existing && !rebuild ? opc.measuredEUI : undefined, measuredSplit: existing && !rebuild ? opc.measuredSplit : undefined, asIs: opc.asIs });
  const R = assess(B, { ...ctx.opts, epds: ctx.epds, alts: ctx.alts, keep: existing && reuse === 'adaptive' ? keep : null, extraEol, op: { B6: res.B6, B7: res.B7 } });
  return { R, op: res, choice: ch, building: B };
}

// Apply a fuel strategy to every layer's energy source
function fixSources(layers, fuel, opLayers) {
  const out = {};
  for (const [k, L] of Object.entries(layers)) {
    const o = { ...L };
    if (fuel === 'operational') o.source = opLayers[k]?.source || o.source;
    else if (fuel === 'renewable') o.source = 'offsite-wind-ppa';
    else if (fuel === 'onsite') o.source = 'onsite-pv-mix';
    else o.source = undefined;
    out[k] = o;
  }
  return out;
}

export function stages(R) {
  const t = R.totals;
  return { upfront: t.A1A3 + t.A4 + t.A5, use: t.B1 + t.B2 + t.B3 + t.B4 + t.B5, operational: t.B6 + t.B7, eol: t.C1 + t.C2 + t.C3 + t.C4, d: t.D };
}
export { takeoff };
