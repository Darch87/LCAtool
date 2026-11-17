// Lifecycle Takeoff · photographs (Wikimedia Commons, freely licensed) for components, materials, raw materials and processes,
// plus representative locations for process steps. Lookups are by key, falling back to keyword matches on a process name.
import { MEDIA } from './media-data.js';

const pick = (o) => (o && o.img ? o : null);
export const imgComponent = (k) => pick(MEDIA.components?.[k]);
export const imgMaterial = (k) => pick(MEDIA.materials?.[k]) || pick(MEDIA.materials?.[k?.replace(/-(eaf|lowcarbon|light|recycled|igu)$/, '')]);

const PROC_WORDS = [
  [/iron ore|ore min|pellet/i, 'iron-ore-mine'], [/coking|coal/i, 'coal-mine'], [/blast furnace|\bbf\b|sinter|coke oven/i, 'blast-furnace'], [/basic oxygen|\bbof\b|converter/i, 'bof'],
  [/electric arc|\beaf\b/i, 'eaf'], [/scrap/i, 'scrap-yard'], [/galvan|zinc coat|coating line/i, 'galvanizing-line'], [/roll.?form|cold.?form|stud|deck form/i, 'roll-forming'], [/rebar|reinforc/i, 'rebar-mill'],
  [/hot.?roll|rolling|section mill|casting|caster/i, 'hot-rolling'], [/copper (ore|min)|open.?pit/i, 'copper-mine'], [/smelt|refin.*copper|cathode/i, 'copper-smelter'], [/brass|bronze|extru.*(bar|rod)|cast.*billet/i, 'brass-casting'],
  [/bauxite/i, 'bauxite-mine'], [/alumina/i, 'alumina-refinery'], [/aluminium smelt|aluminum smelt|primary alumin|potline|electrolys/i, 'aluminium-smelter'], [/extru/i, 'aluminium-extrusion'],
  [/limestone|lime\b/i, 'limestone-quarry'], [/clinker|kiln|cement/i, 'cement-kiln'], [/aggregate|gravel|crushed stone|sand and/i, 'aggregate-quarry'], [/ready.?mix|batch|mixing|concrete plant/i, 'ready-mix-plant'],
  [/precast|casting bed|form/i, 'precast-plant'], [/clay|shale/i, 'clay-pit'], [/brick|firing|tunnel kiln/i, 'brick-kiln'], [/silica|sand/i, 'silica-sand-mine'], [/float|glass melt|furnace.*glass|batch melt/i, 'float-glass-line'],
  [/insulating glass|igu|fabricat.*glass|temper/i, 'igu-assembly'], [/granite/i, 'granite-quarry'], [/travertine/i, 'travertine-quarry'], [/marble/i, 'marble-quarry'], [/quarry|extraction|block/i, 'granite-quarry'],
  [/saw|cutting|polish|finish/i, 'stone-saw'], [/gypsum|fgd|wallboard|plaster/i, 'plasterboard-plant'], [/stone wool|cupola|basalt|melt.*fib/i, 'stone-wool-plant'], [/bitumen|asphalt|refin|oil/i, 'oil-refinery'],
  [/forest|harvest|logging|silvic/i, 'forest-harvest'], [/sawmill|lumber|kiln dry/i, 'sawmill'], [/lamina|press|clt/i, 'clt-press'], [/ship|vessel|ocean/i, 'container-ship'], [/rail/i, 'rail-freight'],
  [/truck|transport|haul|deliver/i, 'truck-freight'], [/install|construct|erect|site/i, 'tower-crane-site'], [/demoli/i, 'demolition'], [/deconstr|dismantl/i, 'deconstruction'], [/crush/i, 'concrete-crushing'],
  [/recycl|shred|reprocess/i, 'metal-recycling-shredder'], [/cullet/i, 'glass-cullet'], [/landfill|dispos/i, 'landfill'], [/incinerat|energy recover|waste.to/i, 'waste-to-energy'], [/assembl|manufactur|fabricat|production/i, 'tower-crane-site']
];
const BY_MODULE = { A1: 'iron-ore-mine', A2: 'truck-freight', A3: 'hot-rolling', A4: 'truck-freight', A5: 'tower-crane-site', C1: 'demolition', C2: 'truck-freight', C3: 'metal-recycling-shredder', C4: 'landfill', D: 'metal-recycling-shredder' };
const MAT_A1 = { concrete: 'limestone-quarry', glass: 'silica-sand-mine', granite: 'granite-quarry', travertine: 'travertine-quarry', marble: 'marble-quarry', gypsum: 'gypsum-quarry', clt: 'forest-harvest', bronze: 'copper-mine', aluminium: 'bauxite-mine', brick: 'clay-pit', precast: 'aggregate-quarry', membrane: 'oil-refinery', 'mineral-wool': 'stone-wool-plant' };
const MAT_A3 = { concrete: 'ready-mix-plant', glass: 'float-glass-line', 'glass-igu': 'igu-assembly', granite: 'stone-saw', travertine: 'stone-saw', marble: 'stone-saw', gypsum: 'plasterboard-plant', clt: 'clt-press', bronze: 'brass-casting', aluminium: 'aluminium-extrusion', brick: 'brick-kiln', precast: 'precast-plant', membrane: 'oil-refinery', 'mineral-wool': 'stone-wool-plant', 'steel-section-eaf': 'eaf', 'steel-deck': 'roll-forming', 'steel-stud': 'roll-forming', rebar: 'rebar-mill' };
export function procKey(name = '', module = '', mat = '') {
  for (const [re, k] of PROC_WORDS) if (re.test(name) && MEDIA.processes?.[k]) return k;
  const base = mat.replace(/-(lowcarbon|light)$/, '');
  if (/^A1/.test(module) && MAT_A1[base]) return MAT_A1[base];
  if (/A3/.test(module) && (MAT_A3[mat] || MAT_A3[base])) return MAT_A3[mat] || MAT_A3[base];
  return BY_MODULE[module?.replace(/[–-].*/, '')] || null;
}
export const imgProcess = (name, module, mat) => { const k = procKey(name, module, mat); return k ? { key: k, ...pick(MEDIA.processes?.[k]) } : null; };
export const procInfo = (k) => MEDIA.processes?.[k] || null;

const RAW_WORDS = [[/iron|pig|ore/i, 'iron-ore'], [/coal|coke/i, 'coking-coal'], [/scrap/i, 'steel-scrap'], [/limestone|lime/i, 'limestone'], [/clay|shale/i, 'clay'], [/gypsum|fgd/i, 'gypsum-rock'],
  [/soda/i, 'soda-ash'], [/dolomite/i, 'dolomite'], [/silica|sand/i, 'silica-sand'], [/bauxite|alumin/i, 'bauxite'], [/copper/i, 'copper-ore'], [/zinc/i, 'zinc'], [/lead/i, 'lead'], [/\btin\b/i, 'tin'],
  [/gravel|aggregate|stone/i, 'aggregate'], [/cement|clinker/i, 'cement'], [/fly ash/i, 'fly-ash'], [/slag|ggbs/i, 'ggbs'], [/water/i, 'water'], [/basalt/i, 'basalt'], [/bitumen|asphalt|oil/i, 'bitumen'], [/wood|timber|log|lumber/i, 'timber-logs'], [/feldspar/i, 'feldspar'], [/granite|quartz/i, 'quartz'], [/crude/i, 'crude-oil']];
export function imgRaw(name = '') { for (const [re, k] of RAW_WORDS) if (re.test(name) && MEDIA.raw?.[k]) return { key: k, ...MEDIA.raw[k] }; return null; }
export const SEAGRAM_PHOTOS = () => MEDIA.seagram || [];
export const credit = (m) => (m ? `${m.author ? `${m.author}, ` : ''}${m.license || ''} · Wikimedia Commons` : '');
