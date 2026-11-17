// Lifecycle Takeoff · EPD library. Every lifecycle number in the tool comes from one of these declarations, module by module,
// exactly as printed in the EPD (per declared unit), converted to per kg using the mass the EPD itself states. A module the EPD
// does not declare stays undeclared ("ND", "MND"…): nothing here fills it from a generic database.
import { EPD_RAW } from './epd-data.js';

// Modules an EPD can declare; A1A3 is the aggregate when A1, A2 and A3 are not broken out.
export const EPD_KEYS = ['A1', 'A2', 'A3', 'A1A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'C1', 'C2', 'C3', 'C4', 'D'];
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

// Normalise one EPD record. Bulk materials become per kg; equipment (lifts, chillers…) stays per declared unit.
export function normalize(e, key) {
  const perUnit = e.basis === 'unit';
  const div = perUnit ? 1 : e.kgPerUnit || 1;
  const per = {};
  for (const k of EPD_KEYS) {
    const v = e.modules?.[k];
    per[k] = isNum(v) ? v / div : v == null ? null : String(v);
  }
  const split = isNum(per.A1) && isNum(per.A2) && isNum(per.A3);
  if (split) per.A1A3 = per.A1 + per.A2 + per.A3;
  else for (const k of ['A1', 'A2', 'A3']) if (!isNum(per[k])) per[k] = isNum(per.A1A3) ? 'A1–A3' : per[k] || per.A1A3 || 'ND';
  for (const k of EPD_KEYS) if (per[k] == null) per[k] = 'ND';
  const dType = (e.dParts?.[0]?.type || '').toLowerCase();
  return {
    key, ...e, perUnit, per, split,
    dType: /reuse/.test(dType) ? 'reuse' : /recover/.test(dType) ? 'recovery' : /recycl/.test(dType) ? 'recycling' : isNum(per.D) ? 'other' : null,
    declared: EPD_KEYS.filter((k) => isNum(per[k])),
    notDeclared: EPD_KEYS.filter((k) => k !== 'A1A3' && !isNum(per[k]) && !(per[k] === 'A1–A3'))
  };
}

export const EPDS = {};
export const EPD_ALTS = {};
for (const [key, list] of Object.entries(EPD_RAW)) {
  const ok = list.filter((e) => e.verified !== false && isNum(e.modules?.A1A3 ?? NaN) || (isNum(e.modules?.A1) && isNum(e.modules?.A3)));
  const all = (ok.length ? ok : list).map((e) => normalize(e, key));
  if (!all.length) continue;
  EPDS[key] = all[0];
  EPD_ALTS[key] = all;
}

export const epdFor = (key) => EPDS[key] || null;
export const declared = (v) => isNum(v);
// GWP of one module for a quantity: kg for bulk materials, count for equipment
export function moduleValue(epd, k, amount) { const v = epd?.per?.[k]; return isNum(v) ? v * amount : null; }
