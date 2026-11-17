// Lifecycle Takeoff · operational carbon (B6, B7). A transparent end-use model in the manner of the Zero Code energy calculator
// and ZeroTool: start from a measured or benchmark site EUI split by end use, turn each end use into the load it serves, apply
// the chosen passive measures, divide by the chosen system's efficiency, then convert each fuel to carbon with the local grid,
// district steam or an alternative supply. Results run year by year so a decarbonising grid shows up the way C.Scale draws it.
import { ENERGY } from './energy-data.js';

export const END_USES = [
  { k: 'heating', label: 'Heating' }, { k: 'cooling', label: 'Cooling' }, { k: 'lighting', label: 'Interior lighting' },
  { k: 'plug', label: 'Plug loads' }, { k: 'shw', label: 'Service hot water' }, { k: 'fans', label: 'Fans' }, { k: 'other', label: 'Other' }
];
export const KBTU_PER_KWH = 3.412;
const SQFT = 0.09290304;
const sum = (a, f = (x) => x) => a.reduce((s, x) => s + f(x), 0);

export const PROGRAMS = Object.entries(ENERGY.baselines).map(([k, b]) => ({ k, label: b.label }));
export const systemsFor = (use) => ENERGY.systems[use] || [];
export const passiveFor = (use) => ENERGY.passive[use] || [];
export const sysById = (use, id) => systemsFor(use).find((s) => s.id === id) || systemsFor(use)[0];

// The energy sources a system can draw on, by fuel
export function sourcesFor(fuel, loc) {
  if (fuel === 'elec') return [{ id: 'grid', name: loc?.utility ? `${loc.utility} grid` : 'Local grid' }, ...ENERGY.alternatives.filter((a) => a.elec).map((a) => ({ id: a.id, name: a.name }))];
  if (fuel === 'steam') return [{ id: 'district-steam', name: loc?.steam?.name || 'District steam' }];
  if (fuel === 'gas') return [{ id: 'natural-gas', name: 'Pipeline natural gas' }, ...ENERGY.alternatives.filter((a) => a.gas).map((a) => ({ id: a.id, name: a.name }))];
  if (fuel === 'oil') return [{ id: 'fuel-oil-2', name: 'No. 2 fuel oil' }];
  return [{ id: fuel, name: fuel }];
}

// Where the building is → which grid, utility and steam supplier apply
export function locate(lat, lon, countryCode) {
  const us = ENERGY.utilities;
  if (lat != null && (!countryCode || countryCode === 'us')) {
    let best = null, bd = Infinity;
    for (const u of us) { const d = Math.hypot(u.lat - lat, (u.lon - lon) * Math.cos(lat * Math.PI / 180)); if (d < bd) { bd = d; best = u; } }
    if (best && bd < 3) {
      const g = ENERGY.grids[best.egrid] || {};
      return { country: 'us', city: best.city, utility: best.utility, egrid: best.egrid, gridName: g.name, kgPerKWh: g.kgPerKWh, mix: g.mix, steam: best.steam || null, ll97: /New York/.test(best.city) ? ENERGY.ll97 : null, iso: best.iso, note: best.note, source: g.source };
    }
  }
  const c = ENERGY.countries[(countryCode || '').toUpperCase()];
  if (c) return { country: countryCode, city: c.name, utility: `${c.name} national grid`, gridName: c.name, kgPerKWh: c.kgPerKWh, mix: c.mix, steam: null, source: c.source };
  const avg = ENERGY.grids.US || { name: 'US average', kgPerKWh: 0.37 };
  return { country: 'us', city: 'United States', utility: 'US average grid', gridName: avg.name, kgPerKWh: avg.kgPerKWh, mix: avg.mix, steam: null, source: avg.source };
}

// Defaults: the program's benchmark systems on every layer, local grid for electricity
export function defaultLayers(program = 'office') {
  const ref = ENERGY.baselines[program]?.refSystems || {};
  return Object.fromEntries(END_USES.map(({ k }) => { const s = sysById(k, ref[k]); return [k, { system: s?.id, passive: [], source: defaultSource(s) }]; }));
}
export function defaultSource(s) { return s?.fuel === 'steam' ? 'district-steam' : s?.fuel === 'gas' ? 'natural-gas' : s?.fuel === 'oil' ? 'fuel-oil-2' : 'grid'; }

// kg CO2e per kWh of site energy for a fuel and source in a given year index
export function fuelFactor(fuel, source, loc, yearIndex = 0, grid = {}) {
  const F = ENERGY.fuels;
  if (fuel === 'elec') {
    const alt = ENERGY.alternatives.find((a) => a.id === source && a.elec);
    if (alt && !alt.gridShare) return alt.kgPerKWh;
    let k = loc?.useLL97 && loc?.ll97 ? loc.ll97.elecKgPerKWh : (loc?.kgPerKWh ?? 0.37) / (1 - (ENERGY.lossFactor || 0.05));
    if (grid.mode === 'decarbonising') { const span = Math.max(1, (grid.zeroYear || 2040) - (grid.startYear || 2026)); k *= Math.max(0, 1 - yearIndex / span); }
    return alt ? alt.kgPerKWh * (1 - alt.gridShare) + k * alt.gridShare : k;
  }
  if (fuel === 'steam') return loc?.useLL97 && loc?.ll97 ? loc.ll97.steamKgPerKWh : loc?.steam?.kgPerKWh ?? F['district-steam'].kgPerKWh;
  if (fuel === 'gas') { const alt = ENERGY.alternatives.find((a) => a.id === source && a.gas); return alt ? alt.kgPerKWh : F['natural-gas'].kgPerKWh; }
  if (fuel === 'oil') return F['fuel-oil-2'].kgPerKWh;
  return 0;
}

/*
  run(cfg) → operational result.
  cfg: { program, areaM2, rsp, startYear, layers {use: {system, passive[], source}}, loc (from locate), grid {mode, zeroYear},
         measuredEUI (kBtu/ft² site, optional) with asIs layers — calibrates the end-use loads so the as-is systems reproduce it,
         waterM3PerM2 }
*/
export function run(cfg) {
  const base = ENERGY.baselines[cfg.program] || ENERGY.baselines.office;
  const ft2 = cfg.areaM2 / SQFT;
  const ref = base.refSystems;
  // the load each end use serves (kBtu/ft²·yr of useful energy), from the benchmark with its reference systems
  const load = {};
  for (const { k } of END_USES) { const s = sysById(k, ref[k]); load[k] = base.endUses[k] * (s?.eff || 1); }
  let calib = 1;
  if (cfg.measuredSplit && cfg.asIs) {
    // a metered end-use split (site kBtu/ft² with the as-is systems) fixes each load directly
    for (const { k } of END_USES) load[k] = (cfg.measuredSplit[k] || 0) * (sysById(k, cfg.asIs[k]?.system)?.eff || 1);
  } else if (cfg.measuredEUI && cfg.asIs) {
    const asIsSite = sum(END_USES, ({ k }) => load[k] / (sysById(k, cfg.asIs[k]?.system)?.eff || 1));
    calib = cfg.measuredEUI / asIsSite;
  }
  const uses = END_USES.map(({ k, label }) => {
    const L = cfg.layers[k] || {};
    const s = sysById(k, L.system);
    const passive = (L.passive || []).map((id) => passiveFor(k).find((p) => p.id === id)).filter(Boolean);
    const keep = passive.reduce((a, p) => a * (1 - p.reduction), 1);
    const loadK = load[k] * calib * keep;
    const siteK = loadK / (s?.eff || 1); // kBtu/ft²·yr
    const kWh = siteK * ft2 / KBTU_PER_KWH;
    return { k, label, system: s, passive, reduction: 1 - keep, loadKbtuFt2: loadK, siteKbtuFt2: siteK, kWh, fuel: s?.fuel || 'elec', source: L.source || defaultSource(s) };
  });
  const rsp = cfg.rsp || 60, y0 = cfg.startYear || 2026;
  const grid = { ...(cfg.grid || {}), startYear: y0 };
  const annual = [];
  let B6 = 0;
  for (let y = 0; y < rsp; y++) {
    const by = {};
    for (const u of uses) by[u.k] = u.kWh * fuelFactor(u.fuel, u.source, cfg.loc, y, grid);
    const total = sum(Object.values(by));
    annual.push({ year: y0 + y, by, total });
    B6 += total;
  }
  const water = cfg.areaM2 * (cfg.waterM3PerM2 ?? 0.5) * (ENERGY.waterKgPerM3 || 1.05) * rsp;
  const siteEUI = sum(uses, (u) => u.siteKbtuFt2);
  const byFuel = {};
  for (const u of uses) byFuel[u.fuel] = (byFuel[u.fuel] || 0) + u.kWh;
  // NYC Local Law 97: emissions per ft² against the office limits, with LL97's own coefficients
  let ll97 = null;
  if (cfg.loc?.ll97 && /office|commercial/.test(cfg.program || 'office')) {
    const L = cfg.loc.ll97;
    const em = (period) => sum(uses, (u) => u.kWh * (u.fuel === 'elec' ? (ENERGY.alternatives.find((a) => a.id === u.source && a.onsite) ? 0 : L[`elec_${period}`]) : u.fuel === 'steam' ? L[`steam_${period}`] : u.fuel === 'gas' ? L.gasKgPerKWh : L.oilKgPerKWh || 0.27)) / 1000 / ft2;
    ll97 = { p1: { em: em('2024'), limit: L.limitOffice2024 }, p2: { em: em('2030'), limit: L.limitOffice2030 }, source: L.source };
  }
  return { uses, annual, B6, B7: water, siteEUI, calib, byFuel, ll97, ft2, firstYear: annual[0]?.total || 0 };
}
