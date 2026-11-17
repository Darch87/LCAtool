// Lifecycle Takeoff · app. Model (address, 3D model or documents) → components → lifecycle from EPDs → operational → compare.
import { assess, toCSV } from './engine.js';
import { MODULES, D_PARTS, LETI_OFFICE, MATERIALS, FACADES } from './library.js';
import { parseSVG, readSheet, sheetsToBuilding, dxfToSVG, aiToReading } from './plan.js';
import { SEAGRAM_FACTS, SOURCES, SEAGRAM_PROJECT } from './seagram.js';
import { meshesToTakeoff, CLASSES } from './mesh.js';
import { EPDS, EPD_ALTS } from './epd.js';
import { run as runOp, locate, END_USES, PROGRAMS, systemsFor, passiveFor, sourcesFor, sysById, defaultLayers, defaultSource } from './energy.js';
import { ENERGY } from './energy-data.js';
import { LAYER_CHOICES, REUSE, EFFICIENCY, FUELS, runScenario, defaultChoice, describe, stages } from './compare.js';
import { geocode, footprint, buildingFromFootprint, isSeagram, SEAGRAM_LL } from './geo.js';
import { ring, stackedArea, intensityColor, intensityLegend, createMap, routeFor } from './viz.js';
import { imgComponent, imgMaterial, imgProcess, imgRaw, procInfo, credit } from './media.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let M3 = null; const m3 = async () => (M3 ||= await import('./model3d.js'));
const SQFT = 0.09290304;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const store = { get(k, d) { try { const v = localStorage.getItem(`lt:${k}`); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(`lt:${k}`, JSON.stringify(v)); } catch { /* storage unavailable */ } } };

const S = {
  source: 'drawings', sheets: [], sel: 0, building: null, prov: [], project: null, model: null, R: null, OP: null, viewer: null, tab: 'model', stage: '3d',
  area: store.get('area', 'm2'), gwp: store.get('gwp', 't'), program: 'office', gfa: null, site: null, origins: {}, epdPick: {},
  op: { layers: defaultLayers('office'), asIs: null, measuredEUI: null, measuredSplit: null, grid: 'flat', zeroYear: 2040, useLL97: true },
  mt: { sub: 'materials', basis: 'mass', sort: 'share', dir: -1, hidden: new Set(), exploded: new Set(), realistic: false, sel: null },
  comp: { view: 'pyramid', sort: 'gwp', filter: null, sel: null, openMat: null },
  lc: { rows: 'materials', open: null, hover: null },
  draft: null, scenarios: store.get('scenarios', [])
};

/* ------------------------------------------------------------------ units */
const n0 = (v) => Math.round(v).toLocaleString('en-US');
const nf = (v, d = 1) => (Math.abs(v) >= 100 ? n0(v) : Number(v).toLocaleString('en-US', { maximumFractionDigits: d }));
const areaU = () => (S.area === 'ft2' ? 'ft²' : 'm²');
const areaOf = (m2) => (S.area === 'ft2' ? m2 / SQFT : m2);
const gfa = () => S.gfa || S.gfaAuto || S.R?.gfa || 1;
const tC = (kg) => { const t = kg / 1000; return Math.abs(t) >= 10000 ? `${(t / 1000).toFixed(1)} kt` : Math.abs(t) >= 100 ? `${n0(t)} t` : `${t.toFixed(1)} t`; };
// GWP in the chosen unit: tonnes, kilograms, or kg per m² / ft² of gross floor area
function G(kg, { short = false } = {}) {
  if (S.gwp === 'kg') return `${n0(kg)}${short ? '' : ' kg'}`;
  if (S.gwp === 'area') { const v = kg / areaOf(gfa()); return `${nf(v)}${short ? '' : ` kg/${areaU()}`}`; }
  return short ? tC(kg).replace(/ (t|kt)$/, (m) => m) : tC(kg);
}
const gUnit = () => (S.gwp === 'kg' ? 'kgCO2e' : S.gwp === 'area' ? `kgCO2e/${areaU()}` : 'tCO2e');
const gNum = (kg) => (S.gwp === 'kg' ? kg : S.gwp === 'area' ? kg / areaOf(gfa()) : kg / 1000);
const fmtArea = (m2) => `${n0(areaOf(m2))} ${areaU()}`;
const qtyU = (q) => { if (!q) return ''; if (q.u === 'm²') return `${n0(areaOf(q.v))} ${areaU()}`; if (q.u === 'm' && S.area === 'ft2') return `${n0(q.v / 0.3048)} ft`; if (q.u === 'm³' && S.area === 'ft2') return `${n0(q.v * 35.3147)} ft³`; return `${nf(q.v)} ${q.u}`; };
const baseU = (u) => (u === 'm²' ? areaU() : u === 'm' && S.area === 'ft2' ? 'ft' : u === 'm³' && S.area === 'ft2' ? 'ft³' : u);
const perBase = (v, u) => (u === 'm²' && S.area === 'ft2' ? v * SQFT : u === 'm' && S.area === 'ft2' ? v * 0.3048 : u === 'm³' && S.area === 'ft2' ? v / 35.3147 : v);

function toast(msg, ms = 3600) { const t = $('#toast'); t.innerHTML = msg; t.hidden = false; clearTimeout(toast.h); if (ms) toast.h = setTimeout(() => { t.hidden = true; }, ms); }
function download(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
const BAND_COL = { 'A++': '#00B5E2', 'A+': '#3cc6e8', A: '#7fd8ee', B: '#b5e3a8', C: '#ffe36b', D: '#FFD600', E: '#ffab5c', F: '#ff6f9f', G: '#FF1F8B', 'Beyond G': '#c0004f' };
const STAGE_COL = { upfront: 'var(--s-product)', use: 'var(--s-use)', operational: 'var(--s-operational)', eol: 'var(--s-eol)' };
const USE_COL = { heating: '#FF1F8B', cooling: '#00B5E2', lighting: '#FFD600', plug: '#b5e3a8', shw: '#ff8cc4', fans: '#7fd8ee', other: '#8a8a84' };
const pic = (m, cls = 'lt-thumb', alt = '') => (m?.img ? `<img class="${cls}" src="${esc(m.img)}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer" title="${esc(credit(m))}">` : `<span class="${cls} none" aria-hidden="true"></span>`);

/* ------------------------------------------------------------------ EPD choice and the energy model inputs */
function epdSet() { const o = {}; for (const [k, list] of Object.entries(EPD_ALTS)) o[k] = list[S.epdPick[k] || 0] || EPDS[k]; return o; }
function originOf(key, epd) {
  if (S.origins[key]) return S.origins[key];
  const p = epd?.plant; if (p && isNum(p.lat) && isNum(p.lon)) return { lat: p.lat, lon: p.lon, name: p.name || epd.manufacturer };
  return null;
}
function routes(epds) {
  const km = {}, legs = {};
  if (!S.site) return { km, legs };
  for (const [k, e] of Object.entries(epds)) { const org = originOf(k, e); if (org) { const r = routeFor(org, S.site); km[k] = r.km; legs[k] = r.legs.map((l) => [l.mode, l.km]); } }
  return { km, legs };
}
function opCfg() {
  return { program: S.program, areaM2: gfa(), rsp: rsp(), startYear: 2026, layers: S.op.layers, asIs: S.op.asIs, measuredEUI: S.op.measuredEUI, measuredSplit: S.op.measuredSplit,
    loc: { ...(S.site?.loc || locate(null, null, 'us')), useLL97: S.op.useLL97 }, grid: { mode: S.op.grid, zeroYear: S.op.zeroYear } };
}
const rsp = () => Math.max(10, +$('#rsp').value || 60);
const fill = () => $('#fillIn').value === 'fill';
function baseOpts(epds = epdSet()) { const rt = routes(epds); return { rsp: rsp(), calibrate: $('#calibrate').checked, fill: fill(), origins: rt.km, legs: rt.legs, epds, alts: EPD_ALTS, gfa: S.gfa || undefined }; }

/* ------------------------------------------------------------------ compute */
function currentBuilding() {
  if (S.source === 'model' && S.model) return { name: S.model.name, rsp: 60, existing: false, structure: {}, facade: {}, interiors: {}, services: {}, blocks: [] };
  return S.building;
}
function compute() {
  const B = currentBuilding();
  if (!B) { S.R = null; S.OP = null; renderAll(); return; }
  const o = baseOpts();
  if (S.source === 'model' && S.model) { o.takeoff = structuredClone({ components: S.model.takeoff.components, gfa: S.model.takeoff.gfa }); o.calibrate = false; }
  // first pass sets the floor area the energy model needs
  if (!S.gfa) { const R0 = assess(B, { ...o, op: null }); S.gfaAuto = R0.gfa; }
  S.OP = runOp(opCfg());
  S.R = assess(B, { ...o, op: $('#operational').checked ? { B6: S.OP.B6, B7: S.OP.B7 } : null });
  renderAll();
}

/* ------------------------------------------------------------------ render: side */
function renderSummary() {
  const R = S.R;
  $('#projectName').textContent = R ? `${R.building}${S.source === 'model' ? ' · from 3D model' : ''}` : 'No project';
  $$('[data-area-unit]').forEach((e) => { e.textContent = areaU(); });
  if (document.activeElement !== $('#gfaIn')) $('#gfaIn').value = R ? Math.round(areaOf(gfa())) : '';
  if (!R) { $('#summary').innerHTML = '<div class="lt-k">Result</div><p class="lt-fine">Add a building or run the Seagram demo.</p>'; $('#dqCard').innerHTML = ''; return; }
  const b = R.band, perA = R.upfront / areaOf(R.gfa);
  const opShare = R.whole > 0 ? (R.totals.B6 + R.totals.B7) / R.whole : 0;
  $('#summary').innerHTML = `<div class="lt-k">Upfront carbon A1–A5</div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><div class="lt-big">${n0(perA)}<small>kgCO2e/${areaU()}</small></div><span class="lt-band" style="background:${BAND_COL[b] || '#888'}" title="LETI office band">${b}</span></div>
    <div class="lt-stat"><span>Upfront A1–A5</span><b>${G(R.upfront)}</b></div>
    <div class="lt-stat"><span>Range across EPDs</span><b>${G(R.range.upfrontLow)}–${G(R.range.upfrontHigh)}</b></div>
    <div class="lt-stat"><span>Embodied A–C, ${R.rsp} yrs</span><b>${G(R.embodied)}</b></div>
    <div class="lt-stat"><span>Operational B6–B7</span><b>${G(R.totals.B6 + R.totals.B7)}</b></div>
    <div class="lt-stat"><span>Whole life A–C</span><b>${G(R.whole)}</b></div>
    <div class="lt-stat"><span>Module D (reported apart)</span><b>${G(R.totals.D)}</b></div>
    <div class="lt-stat"><span>Gross floor area</span><b>${fmtArea(R.gfa)}</b></div>
    <p class="lt-fine">${opShare > 0.5 ? `Operation is ${Math.round(opShare * 100)}% of whole-life carbon here.` : `Embodied carbon is ${Math.round((1 - opShare) * 100)}% of whole-life carbon here.`}${R.undeclared.length && !R.fill ? ` Modules ${R.undeclared.join(', ')} are not declared by some EPDs and count as zero.` : ''}</p>`;
  const declaredShare = (k) => { let d = 0, t = 0; for (const m of R.materials) { if (!m.epd) continue; t += m.kg; if (isNum(m.epd.per[k])) d += m.kg; } return t ? d / t : 0; };
  const keys = ['A1A3', 'A4', 'A5', 'C1', 'C2', 'C3', 'C4', 'D'];
  $('#dqCard').innerHTML = `<div class="lt-k">EPD coverage by mass</div>${keys.map((k) => { const v = declaredShare(k); return `<div class="lt-cov"><span>${k === 'A1A3' ? 'A1–A3' : k}</span><i><b style="width:${v * 100}%"></b></i><em>${Math.round(v * 100)}%</em></div>`; }).join('')}
    <p class="lt-fine">Share of the building's mass whose EPD declares each module. ${R.missing.length ? `No EPD yet for: ${R.missing.join(', ')}.` : 'Every material has an EPD.'}</p>`;
}

/* ------------------------------------------------------------------ sheets */

function addVectorSheet(name, svg, label) {
  const reading = readSheet(parseSVG(svg));
  const vb = (svg.match(/viewBox="([^"]+)"/)?.[1] || '0 0 1000 700').split(/[\s,]+/).map(Number);
  S.sheets.push({ name, label: label || reading.sheetNo || name, kind: 'vector', svg, vb, reading });
}
async function addRasterSheet(name, dataUrl, text = '', label) {
  const sh = { name, label: label || name, kind: 'raster', img: dataUrl, text, reading: null, pending: true };
  S.sheets.push(sh);
  return sh;
}


function readAll() {
  const readings = S.sheets.map((s) => s.reading).filter(Boolean);
  if (!readings.length) { renderAll(); return; }
  const { building, provenance } = sheetsToBuilding(readings, { name: S.project?.name || 'Read from drawings', address: S.project?.address });
  if (S.project) {
    Object.assign(building, { year: S.project.year, existing: S.project.existing });
    for (const f of S.project.fields) { f.set(building); provenance.push({ k: f.k, v: f.v, src: f.src, project: true }); }
  }
  S.building = building; S.prov = provenance; S.modelShown = null;
  if (S.source !== 'model') compute();
  if (S.tab === 'model' && S.stage === '3d') generate3D().catch(() => {});
}

/* ------------------------------------------------------------------ render: model tab (materials and systems) */
function mItems() {
  const R = S.R; if (!R) return [];
  if (S.mt.sub === 'materials') return R.materials.map((m) => ({ id: m.key, name: m.epd?.title && !m.epd.perUnit ? (MATERIALS[m.key]?.name || m.name) : (MATERIALS[m.key]?.name || m.name), sub: m.epd ? `${m.epd.manufacturer || ''}` : 'no EPD', mass: m.kg, gwp: m.embodied, a13: m.mods.A1A3, intensity: m.a13PerKg, img: imgMaterial(m.key), field: 'mat' }));
  return R.groups.filter((g) => g.group !== 'Construction process' && g.group !== 'Refurbishment').map((g) => ({ id: g.group, name: g.group, sub: `${g.rows} components`, mass: g.mass, gwp: g.embodied, a13: g.A1A3, intensity: g.intensity, img: imgComponent({ Substructure: 'foundation', Superstructure: 'columns', 'Exterior enclosure': 'facade', Roofing: 'roof', Interiors: 'partitions', Services: 'services', Sitework: 'plaza' }[g.group]), field: 'group' }));
}
function renderModelSide() {
  const items = mItems();
  const tot = { mass: items.reduce((s, x) => s + x.mass, 0) || 1, gwp: items.reduce((s, x) => s + Math.max(0, x.gwp), 0) || 1 };
  for (const it of items) { it.share = (S.mt.basis === 'mass' ? it.mass / tot.mass : Math.max(0, it.gwp) / tot.gwp); }
  const key = { share: (x) => x.share, gwp: (x) => x.gwp, name: (x) => x.name, intensity: (x) => x.intensity, mass: (x) => x.mass }[S.mt.sort] || ((x) => x.share);
  items.sort((a, b) => { const p = key(a), q = key(b); return (typeof p === 'string' ? p.localeCompare(q) : p - q) * S.mt.dir; });
  const segs = items.map((x) => ({ id: x.id, label: x.name, value: x.share, color: intensityColor(x.intensity) }));
  const top = items[0];
  $('#mRing').innerHTML = items.length ? ring(segs, { size: 170, width: 24, center: S.mt.sel ? `${((items.find((x) => x.id === S.mt.sel)?.share || 0) * 100).toFixed(1)}%` : S.mt.basis === 'mass' ? `${n0(tot.mass / 1000)} t` : G(tot.gwp), sub: S.mt.sel ? (items.find((x) => x.id === S.mt.sel)?.name || '').split(/[,(]/)[0].slice(0, 22) : S.mt.basis === 'mass' ? 'total mass' : 'embodied A–C', active: S.mt.sel }) : '<p class="lt-fine">No building yet.</p>';
  $('#mLegend').innerHTML = `<p class="lt-fine">Slices are each ${S.mt.sub === 'materials' ? 'material' : 'system'}'s share of the building by ${S.mt.basis === 'mass' ? 'mass' : 'embodied GWP'}; colour is its carbon intensity, A1–A3 per kg.</p>${intensityLegend()}${top ? '' : ''}`;
  const sortH = (k, l, cls = '') => `<button type="button" class="${cls}${S.mt.sort === k ? ' on' : ''}" data-msort="${k}">${l}${S.mt.sort === k ? (S.mt.dir < 0 ? ' ↓' : ' ↑') : ''}</button>`;
  $('#mHead').innerHTML = `<span></span>${sortH('name', S.mt.sub === 'materials' ? 'Material' : 'System')}${sortH('share', '%', 'n')}${sortH('intensity', 'kg/kg', 'n')}${sortH('gwp', `GWP ${gUnit()}`, 'n')}<span></span>`;
  $('#mList').innerHTML = items.map((x) => {
    const hk = `${x.field}:${x.id}`;
    return `<div class="lt-mrow${S.mt.sel === x.id ? ' sel' : ''}${S.mt.hidden.has(hk) ? ' off' : ''}" data-mid="${esc(x.id)}" data-field="${x.field}">
      <button type="button" class="eye" data-eye="${esc(hk)}" aria-pressed="${!S.mt.hidden.has(hk)}" title="${S.mt.hidden.has(hk) ? 'Show' : 'Hide'} this layer">${S.mt.hidden.has(hk) ? '○' : '●'}</button>
      <span class="nm"><i class="sw" style="background:${intensityColor(x.intensity)}"></i><span><b>${esc(x.name.split('(')[0].trim())}</b><small>${esc(x.sub)} · ${n0(x.mass / 1000)} t</small></span></span>
      <span class="n">${(x.share * 100).toFixed(1)}</span><span class="n">${x.intensity ? x.intensity.toFixed(2) : '—'}</span><span class="n">${nf(gNum(x.gwp))}</span>
      <button type="button" class="xpl${S.mt.exploded.has(hk) ? ' on' : ''}" data-xpl="${esc(hk)}" title="Explode this ${x.field === 'mat' ? 'material' : 'system'} out of the model">⤧</button></div>`;
  }).join('');
}
function selectItem(id, field) {
  S.mt.sel = S.mt.sel === id ? null : id;
  S.viewer?.highlight(S.mt.sel, field);
  const R = S.R;
  if (field === 'mat') {
    const m = R.materials.find((x) => x.key === id);
    $('#pickInfo').innerHTML = m && S.mt.sel ? `${pic(imgMaterial(m.key), 'lt-pickimg', m.name)}<b>${esc(MATERIALS[m.key]?.name || m.name)}</b><br>${n0(m.kg / 1000)} t in ${m.comps.length} component${m.comps.length > 1 ? 's' : ''} · A1–A3 ${m.a13PerKg ? m.a13PerKg.toFixed(3) : '—'} kgCO2e/kg<br>A1–A3 ${G(m.mods.A1A3)} · embodied A–C ${G(m.embodied)}<br><span class="lt-dim" style="margin:0">${m.epd ? `${esc(m.epd.title)} · ${esc(m.epd.programOperator || '')} ${esc(m.epd.regNo || '')}` : 'No EPD'}</span>` : 'Click a material, a system or an element.';
  } else {
    const g = R.groups.find((x) => x.group === id);
    $('#pickInfo').innerHTML = g && S.mt.sel ? `<b>${esc(g.group)}</b><br>${n0(g.mass / 1000)} t · ${g.intensity.toFixed(2)} kgCO2e/kg A1–A3<br>A1–A3 ${G(g.A1A3)} · embodied A–C ${G(g.embodied)}<br><span class="lt-dim" style="margin:0">${R.rows.filter((r) => r.group === id).map((r) => esc(r.name)).join(' · ')}</span>` : 'Click a material, a system or an element.';
  }
  renderModelSide();
}

/* ------------------------------------------------------------------ 3D */
async function ensureViewer() {
  if (S.viewer) return S.viewer;
  try {
    const M = await m3();
    S.viewer = M.createViewer($('#viewer'));
    S.viewer.onPick((id, obj) => {
      const mat = obj?.userData?.mat, grp = obj?.userData?.group;
      if (S.mt.sub === 'materials' && mat) { S.mt.sel = null; selectItem(mat, 'mat'); } else if (grp) { S.mt.sel = null; selectItem(grp, 'group'); }
    });
    return S.viewer;
  } catch (e) { $('#viewerMsg').textContent = `3D could not load (${e.message}).`; throw e; }
}
async function generate3D() {
  if (!S.building || !S.R || S.source === 'model') return;
  const M = await m3(); const v = await ensureViewer();
  const rows = S.R.rows.filter((r) => r.group !== 'Refurbishment');
  const g = M.buildFromBuilding(S.building, { components: rows, gfa: S.R.modelGfa });
  v.setModel(g); S.modelShown = 'generated';
  $('#viewerMsg').hidden = true;
  $('#modelInfo').textContent = `Generated from ${S.building.id === 'osm' ? 'the address footprint' : 'the drawings'}: ${S.building.blocks.length} block${S.building.blocks.length > 1 ? 's' : ''}, ${S.building.blocks.reduce((a, b) => a + b.levels, 0)} block-levels. Every mesh carries its component and material; materials inside others (rebar, mesh) have no separate geometry.`;
  apply3D();
}
function apply3D() {
  const v = S.viewer; if (!v) return;
  const R = S.R;
  if (S.mt.realistic || !R) v.color('real');
  else if (S.mt.sub === 'materials') { const by = Object.fromEntries(R.materials.map((m) => [m.key, intensityColor(m.a13PerKg)])); v.color('material', (k) => by[k] || '#555'); }
  else { const by = Object.fromEntries(R.groups.map((g) => [g.group, intensityColor(g.intensity)])); v.color('system', (k) => by[k] || '#555'); }
  v.setHidden([...S.mt.hidden]);
  for (const k of S.mt.exploded) v.explodeMaterial(k, 1);
  if (S.mt.sel) v.highlight(S.mt.sel, S.mt.sub === 'materials' ? 'mat' : 'group');
}

/* ------------------------------------------------------------------ render: read */
function renderRead() {
  if (!S.sheets.length) { $('#sheetStrip').innerHTML = ''; $('#sheetCanvas').innerHTML = `<p class="lt-fine" style="padding:20px">${S.building?.id === 'osm' ? 'This building was built from its address; no drawings were read.' : 'No drawings yet. Add a document set above.'}</p>`; $('#foundList').innerHTML = ''; $('#aiBox').innerHTML = ''; $('#sheetTitle').textContent = ''; return; }
  $('#sheetStrip').innerHTML = S.sheets.map((s, i) => `<button class="lt-sheet" role="option" aria-selected="${i === S.sel}" data-i="${i}">${s.kind === 'vector' ? `<img alt="" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(s.svg)}">` : `<img alt="" src="${s.img}">`}<span><b>${esc(s.label)}</b>${esc(s.reading?.kind || (s.pending ? 'reading…' : 'not read'))} · ${s.kind === 'vector' ? 'geometry' : 'vision'}</span></button>`).join('');
  const s = S.sheets[S.sel] || S.sheets[0];
  $('#sheetTitle').textContent = `${s.label} · ${s.reading?.title || s.name}`;
  const ov = $('[data-ov]').getAttribute('aria-pressed') === 'true';
  if (s.kind === 'vector') $('#sheetCanvas').innerHTML = `<img alt="Drawing ${esc(s.label)}" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(s.svg)}">${ov ? overlay(s) : ''}`;
  else $('#sheetCanvas').innerHTML = `<img alt="Drawing ${esc(s.label)}" src="${s.img}">`;
  const r = s.reading;
  $('#foundList').innerHTML = r ? [...r.found.map((f) => `<li>${esc(f)}</li>`), ...(r.scaleFrom ? [`<li>scale fixed from ${esc(r.scaleFrom)}</li>`] : []), ...r.warnings.map((w) => `<li class="warn">${esc(w)}</li>`)].join('') : `<li class="warn">${s.pending ? '<span class="lt-spin"></span>Reading with the vision model…' : esc(s.error || 'Not read yet.')}</li>`;
  $('#btnAI').textContent = s.kind === 'vector' ? 'Cross-check with AI' : 'Read again with AI';
  renderAIBox(s);
}
function overlay(s) {
  const r = s.reading; if (!r?.draw) return '';
  const d = r.draw, [x, y, w, h] = s.vb;
  const parts = [];
  for (const gx of d.gx || []) parts.push(`<line x1="${gx}" y1="${y}" x2="${gx}" y2="${y + h}" stroke="#00B5E2" stroke-width="0.8" opacity=".55"/>`);
  for (const gy of d.gy || []) parts.push(`<line x1="${x}" y1="${gy}" x2="${x + w}" y2="${gy}" stroke="#00B5E2" stroke-width="0.8" opacity=".55"/>`);
  if (d.outline) parts.push(`<rect x="${d.outline.x0}" y="${d.outline.y0}" width="${d.outline.x1 - d.outline.x0}" height="${d.outline.y1 - d.outline.y0}" fill="none" stroke="#00B5E2" stroke-width="2.4" stroke-dasharray="8 4"/>`);
  for (const g of d.regions) parts.push(`<rect x="${g.x0}" y="${g.y0}" width="${g.x1 - g.x0}" height="${g.y1 - g.y0}" fill="${g.kind === 'core' ? 'rgba(255,214,0,.18)' : 'rgba(255,31,139,.07)'}" stroke="${g.kind === 'core' ? '#e0b800' : '#FF1F8B'}" stroke-width="1.6"/>`);
  for (const [cx, cy, cw] of d.cols) parts.push(`<circle cx="${cx}" cy="${cy}" r="${Math.max(5, cw)}" fill="none" stroke="#FF1F8B" stroke-width="1.8"/>`);
  for (const [dx, dy] of d.dims) parts.push(`<circle cx="${dx}" cy="${dy - 2}" r="3" fill="#00B5E2"/>`);
  for (const ly of d.levels) parts.push(`<line x1="${x}" y1="${ly}" x2="${x + w * 0.62}" y2="${ly}" stroke="#FF1F8B" stroke-width="0.9" opacity=".7"/>`);
  return `<svg class="ov" viewBox="${s.vb.join(' ')}" preserveAspectRatio="xMidYMid meet">${parts.join('')}</svg>`;
}
function renderAIBox(s) {
  const a = s.ai;
  if (!a) { $('#aiBox').innerHTML = s.kind === 'vector' ? '<p class="lt-fine">This sheet is vector, so it was read by geometry. “Cross-check with AI” renders it to pixels and asks the vision model to read it blind, to compare the two readers.</p>' : ''; return; }
  if (a.error) { $('#aiBox').innerHTML = `<p class="lt-fine" style="color:var(--y)">AI read failed: ${esc(a.error)}</p>`; return; }
  const v = s.reading || {};
  const ai = aiToReading(a.read);
  const rows = [
    ['Sheet type', v.kind, ai.kind],
    ['Grid bays', v.grid ? `${v.grid.baysX} × ${v.grid.baysY}` : '–', ai.grid ? `${ai.grid.baysX} × ${ai.grid.baysY}` : '–'],
    ['Bay size', v.grid ? `${v.grid.bayX.toFixed(2)} m` : '–', ai.grid?.bayX ? `${ai.grid.bayX.toFixed(2)} m` : '–'],
    ['Columns', v.grid?.columns ?? '–', a.read.columns ?? '–'],
    ['Floor plate', v.outline ? `${v.outline.w.toFixed(1)} × ${v.outline.d.toFixed(1)} m` : '–', ai.outline ? `${ai.outline.w.toFixed(1)} × ${ai.outline.d.toFixed(1)} m` : '–'],
    ['Lifts', v.lifts ?? '–', a.read.lifts ?? '–'],
    ['Levels', v.levels ? `${v.levels.count}` : '–', a.read.levels?.aboveGrade ?? '–'],
    ['Structure', v.spec?.frame || '–', a.read.structure],
    ['Facade', v.spec?.facade || '–', a.read.facade]
  ];
  const same = (p, q) => String(p).replace(/\s/g, '') === String(q).replace(/\s/g, '') || (String(q).includes(String(p)) && p !== '–');
  $('#aiBox').innerHTML = `<div class="lt-k" style="margin-top:14px">${s.kind === 'vector' ? 'Geometry reader vs vision model' : 'Vision model read'} <span class="lt-dim">${esc(a.model?.split('/').pop() || '')}${a.read.confidence != null ? ` · confidence ${Math.round(a.read.confidence * 100)}%` : ''}</span></div>
    <table class="lt-prov"><tr><td></td><td class="lt-dim">${s.kind === 'vector' ? 'Geometry' : ''}</td><td class="lt-dim">Vision</td></tr>${rows.map(([k, p, q]) => `<tr><td>${k}</td><td>${s.kind === 'vector' ? esc(p) : ''}</td><td>${esc(q)}${s.kind === 'vector' && p !== '–' ? ` <span class="lt-pill ${same(p, q) ? 'ok' : 'warn'}">${same(p, q) ? 'agrees' : 'differs'}</span>` : ''}</td></tr>`).join('')}</table>
    ${a.read.components?.length ? `<p class="lt-fine">Components named: ${esc(a.read.components.map((c) => `${c.name}${c.count ? ` (${c.count})` : ''}`).join(', '))}</p>` : ''}
    ${a.read.dimensionsRead?.length ? `<p class="lt-fine">Dimensions read: ${esc(a.read.dimensionsRead.join(', '))}</p>` : ''}`;
}

// Editable building parameters, each with where the value came from
const FIELDS = [
  { k: 'Tower levels', get: (B) => T(B).levels, set: (B, v) => { T(B).levels = Math.max(1, Math.round(v)); }, type: 'number', step: 1 },
  { k: 'Typical floor-to-floor (m)', get: (B) => T(B).f2f, set: (B, v) => { T(B).f2f = v; for (const b of B.blocks) b.f2f = v; }, type: 'number', step: 0.05 },
  { k: 'Ground floor-to-floor (m)', get: (B) => T(B).firstF2F || T(B).f2f, set: (B, v) => { T(B).firstF2F = v; }, type: 'number', step: 0.1 },
  { k: 'Floor plate width (m)', get: (B) => T(B).w, set: (B, v) => { T(B).w = v; }, type: 'number', step: 0.1 },
  { k: 'Floor plate depth (m)', get: (B) => T(B).d, set: (B, v) => { T(B).d = v; }, type: 'number', step: 0.1 },
  { k: 'Bays across × deep', get: (B) => `${T(B).baysX} × ${T(B).baysY}`, set: (B, v) => { const [a, b] = String(v).split(/[x×*,\s]+/).map(Number); if (a && b) { T(B).baysX = a; T(B).baysY = b; } }, type: 'text' },
  { k: 'Basement levels', get: (B) => B.basement?.levels || 0, set: (B, v) => { if (!B.basement) B.basement = { levels: 0, f2f: 3.5, x: T(B).x, y: T(B).y, w: T(B).w, d: T(B).d }; B.basement.levels = Math.max(0, Math.round(v)); }, type: 'number', step: 1 },
  { k: 'Structure', get: (B) => B.structure.frame, set: (B, v) => { B.structure.frame = v; if (v === 'concrete') { B.structure.slab = 'flat-plate'; B.structure.slabThk = 0.25; } }, type: 'select', options: [['steel', 'Steel frame'], ['concrete', 'Concrete frame'], ['timber', 'Mass timber']] },
  { k: 'Steel encased in concrete', get: (B) => B.structure.encasement ? 'yes' : 'no', set: (B, v) => { B.structure.encasement = v === 'yes'; }, type: 'select', options: [['yes', 'Yes'], ['no', 'No']] },
  { k: 'Facade system', get: (B) => B.facade.system, set: (B, v) => { B.facade.system = v; if (B.documented) { B.documented = { ...B.documented, facadeMetalT: v === 'bronze-cw' ? B.documented.facadeMetalT : undefined }; } }, type: 'select', options: Object.entries(FACADES).map(([k, f]) => [k, f.name]) },
  { k: 'Design era', get: (B) => B.era || 'modern', set: (B, v) => { B.era = v; }, type: 'select', options: [['modern', 'Modern (composite floors, 50 ksi steel)'], ['pre1970', 'Pre-1970 (A7 steel, non-composite)']] },
  { k: 'Lifts', get: (B) => B.services.lifts, set: (B, v) => { B.services.lifts = Math.max(0, Math.round(v)); }, type: 'number', step: 1 }
];
const T = (B) => B.blocks.find((b) => b.kind === 'tower') || B.blocks[0];
function renderProv() {
  const B = S.building;
  if (!B) { $('#provTable').innerHTML = ''; return; }
  const src = (k) => S.prov.find((p) => p.k.toLowerCase().startsWith(k.toLowerCase().split(' ')[0]));
  const map = { 'Tower levels': 'Tower levels', 'Typical floor-to-floor (m)': 'Floor-to-floor', 'Ground floor-to-floor (m)': 'Floor-to-floor', 'Floor plate width (m)': 'Floor plate', 'Floor plate depth (m)': 'Floor plate', 'Bays across × deep': 'Column grid', 'Basement levels': 'Basement', Structure: 'Structure', 'Steel encased in concrete': 'Structure', 'Facade system': 'Facade', 'Design era': 'Era', Lifts: 'Lifts' };
  const rows = FIELDS.map((f, i) => {
    const p = S.prov.find((q) => q.k === map[f.k]) || src(f.k);
    const val = f.get(B);
    const input = f.type === 'select' ? `<select data-f="${i}">${f.options.map(([v, l]) => `<option value="${v}"${v === val ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>` : `<input data-f="${i}" type="${f.type}" ${f.step ? `step="${f.step}"` : ''} value="${typeof val === 'number' ? +val.toFixed(2) : esc(val)}">`;
    return `<tr><td>${f.k}${p?.edited ? ' <span class="lt-pill">edited</span>' : ''}</td><td>${input}<span class="src ${p?.assumed ? 'assumed' : ''}">${esc(p ? `${p.assumed ? 'assumed · ' : ''}${p.src}` : '')}</span></td></tr>`;
  });
  const other = S.prov.filter((p) => !Object.values(map).includes(p.k)).map((p) => `<tr><td>${esc(p.k)}</td><td>${esc(p.v)}<span class="src ${p.assumed ? 'assumed' : ''}">${esc(`${p.assumed ? 'assumed · ' : ''}${p.src}`)}</span></td></tr>`);
  $('#provTable').innerHTML = `<table class="lt-prov">${rows.join('')}${other.join('')}</table>`;
}


/* ------------------------------------------------------------------ render: components */
const CMETRIC = {
  code: { l: 'Code', v: (r) => r.code, s: (r) => r.code },
  qty: { l: 'Quantity', v: (r) => r.qty?.v || 0, s: (r) => qtyU(r.qty) },
  mass: { l: 'Mass', v: (r) => r.mass, s: (r) => `${n0(r.mass / 1000)} t` },
  gwp: { l: 'GWP', v: (r) => r.embodied, s: (r) => G(r.embodied) },
  int: { l: 'GWP per kg', v: (r) => (r.mass ? r.mods.A1A3 / r.mass : 0), s: (r) => (r.mass ? `${(r.mods.A1A3 / r.mass).toFixed(2)} kg/kg` : '—') }
};
const cRows = () => (S.R?.rows || []).filter((r) => !r.scenarioRow && r.group !== 'Construction process' && (!S.comp.filter || r.group === S.comp.filter));
function sortedRows() {
  const m = CMETRIC[S.comp.sort];
  return [...cRows()].sort((a, b) => (S.comp.sort === 'code' ? String(a.code).localeCompare(b.code) || a.name.localeCompare(b.name) : m.v(b) - m.v(a)));
}
const calcHtml = (parts) => (parts || []).map((p) => (typeof p === 'string' ? esc(p) : `<span class="k-${p.t}">${esc(p.s)}</span>`)).join('');
function renderComponents() {
  const R = S.R;
  $$('#cView button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cview === S.comp.view)));
  $$('#cSort button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.csort === S.comp.sort)));
  if (!R) { $('#compPyr').innerHTML = '<p class="lt-fine">Nothing read yet.</p>'; $('#compTable').innerHTML = ''; $('#compDetail').innerHTML = ''; $('#calBox').innerHTML = ''; $('#cFilter').innerHTML = ''; return; }
  const groups = [...new Set(R.rows.filter((r) => !r.scenarioRow && r.group !== 'Construction process').map((r) => r.group))];
  $('#cFilter').innerHTML = [['', 'All'], ...groups.map((g) => [g, g])].map(([g, l]) => `<button type="button" data-cf="${esc(g)}" class="${(S.comp.filter || '') === g ? 'on' : ''}">${esc(l)}</button>`).join('');
  const rows = sortedRows();
  const M = CMETRIC[S.comp.sort];
  $('#compPyr').hidden = S.comp.view !== 'pyramid'; $('#compTable').hidden = S.comp.view !== 'table';
  if (S.comp.view === 'pyramid') {
    // tiers like the Material Pyramid: the order of magnitude of the chosen measure, highest at the top
    const tiers = new Map();
    for (const r of rows) {
      const v = M.v(r);
      const t = S.comp.sort === 'code' ? String(r.code)[0] : v > 0 ? Math.floor(Math.log10(v)) : -99;
      if (!tiers.has(t)) tiers.set(t, []); tiers.get(t).push(r);
    }
    const order = [...tiers.keys()].sort((a, b) => (S.comp.sort === 'code' ? String(a).localeCompare(String(b)) : b - a));
    const tierLabel = (t) => (S.comp.sort === 'code' ? { A: 'A · Substructure', B: 'B · Shell', C: 'C · Interiors', D: 'D · Services', G: 'G · Sitework' }[t] || t : t === -99 ? 'none' : S.comp.sort === 'gwp' ? `${G(10 ** t)}–${G(10 ** (t + 1))}` : S.comp.sort === 'mass' ? `${n0(10 ** t / 1000)}–${n0(10 ** (t + 1) / 1000)} t` : S.comp.sort === 'int' ? `${10 ** t}–${10 ** (t + 1)} kg/kg` : `10^${t}–10^${t + 1}`);
    $('#compPyr').innerHTML = `<div class="lt-pyr">${order.map((t, i) => `<div class="tier" style="--w:${Math.min(100, 38 + (i / Math.max(1, order.length - 1)) * 62)}%"><span class="tl">${esc(tierLabel(t))}</span><div class="tiles">${tiers.get(t).map((r) => `<button type="button" class="tile${S.comp.sel === r.id ? ' sel' : ''}" data-c="${esc(r.id)}" style="--c:${intensityColor(r.mass ? r.mods.A1A3 / r.mass : 0)}">${pic(imgComponent(r.img), 'tim', r.name)}<b>${esc(r.name.split('·')[0].split('(')[0].trim())}</b><small>${esc(r.code)} · ${esc(M.s(r))}</small></button>`).join('')}</div></div>`).join('')}</div><p class="lt-fine">Tiers by order of magnitude of ${M.l.toLowerCase()}, after the Material Pyramid. Edge colour: A1–A3 per kg.</p>`;
  } else {
    $('#compTable').innerHTML = `<table class="lt-ct"><tr><th></th><th>Code</th><th>Component</th><th class="n">Quantity</th><th class="n">Mass</th><th class="n">GWP/kg</th><th class="n">GWP A–C</th></tr>${rows.map((r) => `<tr class="row${S.comp.sel === r.id ? ' sel' : ''}" data-c="${esc(r.id)}"><td>${pic(imgComponent(r.img), 'lt-thumb', '')}</td><td>${esc(r.code)}</td><td>${esc(r.name)}${r.calibrated ? ` <span class="lt-pill ok" title="Scaled to the documented quantity">×${r.calibrated.toFixed(2)}</span>` : ''}<small class="lt-sub">${esc(r.mats.map((m) => (MATERIALS[m.key]?.name || m.name).split('(')[0].split(',')[0].trim()).join(' · '))}</small></td><td class="n">${qtyU(r.qty)}</td><td class="n">${n0(r.mass / 1000)} t</td><td class="n">${CMETRIC.int.s(r)}</td><td class="n">${G(r.embodied)}</td></tr>`).join('')}</table>`;
  }
  renderCompDetail();
  $('#calBox').innerHTML = R.calibration.length ? `<div class="lt-k" style="margin-top:18px">Takeoff vs documented quantities</div><div class="lt-cal">${R.calibration.map((c) => { const d = (c.model / c.known - 1) * 100; return `<div class="lt-calrow"><b style="font-weight:400">${esc(c.k)}</b><span>model ${n0(c.model)} ${c.u}</span><span>documented ${n0(c.known)} ${c.u}</span><span class="lt-pill ${Math.abs(d) < 5 ? 'ok' : Math.abs(d) < 20 ? 'warn' : 'bad'}">${d > 0 ? '+' : ''}${d.toFixed(0)}%</span></div>`; }).join('')}<p class="lt-fine">${$('#calibrate').checked ? 'Quantities are scaled to the documented totals before the lifecycle is counted (GFA is reported, not applied).' : 'Shown for comparison only. Tick “Calibrate” to scale the takeoff to these totals.'}</p></div>` : '';
}
function renderCompDetail() {
  const R = S.R, r = R?.rows.find((x) => x.id === S.comp.sel) || sortedRows()[0];
  if (!r) { $('#compDetail').innerHTML = ''; return; }
  S.comp.sel = r.id;
  const a13 = r.mods.A1A3, q = r.qty || { v: 1, u: 'ea' };
  const perKg = r.mass ? a13 / r.mass : 0, perKgAC = r.mass ? r.embodied / r.mass : 0;
  const perBaseV = a13 / (q.v || 1);
  const el = r.unit || { label: 'Whole component', dims: '', count: 1, v: q.v };
  const perEl = perBaseV * (el.v || 0), kgEl = r.mass / (q.v || 1) * (el.v || 0);
  const mats = [...r.mats].sort((a, b) => b.kg - a.kg);
  const totKg = mats.reduce((s, m) => s + m.kg, 0) || 1, totG = mats.reduce((s, m) => s + Math.max(0, m.mods.A1A3), 0) || 1;
  $('#compDetail').innerHTML = `<div class="lt-chead">${pic(imgComponent(r.img), 'lt-cimg', r.name)}<div><div class="lt-k" style="margin:0">${esc(r.code)} · ${esc(r.group)}</div><h3>${esc(r.name)}</h3><p class="lt-fine">${r.mats.length} material${r.mats.length > 1 ? 's' : ''} · service life ${r.life} years${r.calibrated ? ` · calibrated ×${r.calibrated.toFixed(2)}` : ''}</p></div></div>
    <div class="lt-four">
      <div><span class="no">1</span><div class="lt-k">GWP per kg</div><b class="k-r">${perKg.toFixed(3)}</b><small>kgCO2e/kg, A1–A3</small><small>${perKgAC.toFixed(3)} kgCO2e/kg over A–C</small></div>
      <div><span class="no">2</span><div class="lt-k">Per base unit</div><b class="k-r">${nf(perBase(perBaseV, q.u), 2)}</b><small>kgCO2e per ${esc(baseU(q.u))}, A1–A3</small><small>base unit: ${({ m: 'linear', 'm²': 'square', 'm³': 'cubic', kg: 'weight', ea: 'component', kW: 'capacity', 'm³/s': 'airflow' })[q.u] || ''} (${esc(baseU(q.u))})</small></div>
      <div><span class="no">3</span><div class="lt-k">One element</div><b class="k-r">${nf(perEl, 1)}</b><small>kgCO2e, A1–A3 · ${n0(kgEl)} kg</small><small>${esc(el.label)}${el.dims ? `: ${esc(el.dims)}` : ''}</small></div>
      <div><span class="no">4</span><div class="lt-k">Whole building</div><b class="k-q">${qtyU(q)}</b><small>${el.count ? `${n0(el.count)} × ${esc(el.label.toLowerCase())}` : ''}</small><small>${n0(r.mass / 1000)} t · ${G(a13)} A1–A3</small></div>
    </div>
    <div class="lt-k" style="margin-top:12px">Method <span class="lt-legendk"><i class="k-q">measured</i><i class="k-f">factor</i><i class="k-r">result</i></span></div>
    <p class="lt-method">${calcHtml(r.calc) || esc(r.method)}</p>
    <div class="lt-k" style="margin-top:12px">Main materials <span class="lt-dim">share of the component by mass · share of its GWP</span></div>
    <div class="lt-nest">${mats.map((m) => {
      const e = m.epd, raw = (e?.rawMaterials || []).filter((x) => isNum(x.share) && x.share > 0);
      const open = S.comp.openMat === `${r.id}|${m.key}`;
      return `<div class="lt-nrow${open ? ' open' : ''}" data-nm="${esc(r.id)}|${esc(m.key)}">${pic(imgMaterial(m.key), 'lt-thumb', '')}<span class="nm"><b>${esc((MATERIALS[m.key]?.name || m.name).split('(')[0].trim())}</b><small>${e ? `${esc(e.manufacturer || '')} EPD${e.pdfUrl ? ` <a href="${esc(e.pdfUrl)}" target="_blank" rel="noopener" title="Open the EPD PDF" class="lt-pdf">↗</a>` : ''}` : 'no EPD'} · ${e && !e.perUnit && isNum(e.per.A1A3) ? `${e.per.A1A3.toFixed(3)} kg/kg` : e?.perUnit ? `${nf(e.per.A1A3, 0)} kg per ${esc(e.unitSize?.unit === 'ea' ? 'unit' : e.unitSize?.unit || 'unit')}` : ''}</small></span>
        <span class="bars"><i style="width:${(m.kg / totKg) * 100}%" class="bm"></i><i style="width:${(Math.max(0, m.mods.A1A3) / totG) * 100}%" class="bg"></i></span>
        <span class="n">${((m.kg / totKg) * 100).toFixed(1)}%<small>${n0(m.kg / 1000)} t</small></span><span class="n">${((Math.max(0, m.mods.A1A3) / totG) * 100).toFixed(1)}%<small>${G(m.mods.A1A3)}</small></span></div>
        ${open ? `<div class="lt-raw">${raw.length ? `${ring(raw.map((x, i) => ({ id: String(i), label: x.name, value: x.share, color: ['#00B5E2', '#FF1F8B', '#FFD600', '#7fd8ee', '#ff8cc4', '#b5e3a8', '#d0d0c8', '#8a8a84'][i % 8] })), { size: 120, width: 18, center: 'raw', sub: 'materials' })}<div class="lt-rawlist">${raw.map((x, i) => `<div>${pic(imgRaw(x.name), 'lt-thumb', '')}<i class="lt-dot" style="background:${['#00B5E2', '#FF1F8B', '#FFD600', '#7fd8ee', '#ff8cc4', '#b5e3a8', '#d0d0c8', '#8a8a84'][i % 8]}"></i><span>${esc(x.name)}</span><b>${(x.share * 100).toFixed(1)}%</b><small>${n0(x.share * m.kg / 1000)} t · ≈ ${G(x.share * m.mods.A1A3)} by mass share</small></div>`).join('')}<p class="lt-fine">Composition from ${esc(raw[0].source === 'EPD' ? 'the EPD' : 'the manufacturer, as cited by the EPD')}. EPDs report GWP for the finished material, not per raw material, so the GWP split follows mass.</p></div>` : `<p class="lt-fine">This EPD does not publish a raw-material composition.</p>`}</div>` : ''}`;
    }).join('')}</div>`;
}

/* ------------------------------------------------------------------ render: lifecycle */
// Columns: every EN 15978 module, with D split into what the EPD says it stands for
const LC_COLS = [...MODULES.filter((m) => m.k !== 'D').map((m) => ({ k: m.k, label: m.label, name: m.name, info: m.info, stage: m.stage })), ...D_PARTS.map((d) => ({ k: `D:${d.k}`, label: d.label.replace('D · ', 'D '), name: d.label, info: d.info, stage: 'Beyond' }))];
const STAGE_SPANS = [['Product', 3], ['Construction', 2], ['Use', 7], ['End of life', 4], ['Beyond', 4]];
const ST_LABEL = { declared: 'Declared in the EPD', nd: 'Not declared in the EPD', agg: 'Declared only as A1–A3 combined', derived: 'Derived from the EPD’s own modules (replacements over the study period)', scenario: 'Project scenario: not in the EPD', noepd: 'No EPD for this material', spent: 'Already built: carbon spent', none: 'No replacement within the study period', partial: 'Declared by some of the EPDs in this row', 'scenario-off': 'Scenario module, off' };
function lcCell(item, col, units) {
  const st = item.st || {};
  if (col.k.startsWith('D:')) {
    const part = col.k.slice(2);
    const sD = st.D;
    if (sD === 'noepd') return '<td class="noepd">—</td>';
    const dt = item.dType || 'other';
    if (item.dParts) { const v = item.dParts[part] || 0; return v ? `<td class="${v < 0 ? 'neg' : ''}" data-k="D">${units(v)}</td>` : `<td class="z" data-k="D">·</td>`; }
    if (sD !== 'declared') return part === dt || (dt === 'other' && part === 'recycling') ? `<td class="nd" data-k="D" title="${ST_LABEL.nd}">ND</td>` : '<td class="z" data-k="D">·</td>';
    return part === dt ? `<td class="${item.mods.D < 0 ? 'neg' : ''}" data-k="D">${units(item.mods.D)}</td>` : '<td class="z" data-k="D">·</td>';
  }
  const k = col.k, s = st[k];
  if (k === 'B6' || k === 'B7') return '<td class="z" data-k="' + k + '" title="Operational: see the Operational tab">·</td>';
  if (s === 'noepd') return `<td class="noepd" data-k="${k}" title="${ST_LABEL.noepd}">—</td>`;
  if (s === 'spent') return `<td class="spent" data-k="${k}" title="${ST_LABEL.spent}">spent</td>`;
  if (s === 'agg') return k === 'A1' ? `<td colspan="3" class="agg" data-k="A1A3" title="${ST_LABEL.agg}">${units(item.mods.A1A3)} <small>A1–A3</small></td>` : '';
  if (s === 'nd' || s === 'scenario-off') return `<td class="nd" data-k="${k}" title="${ST_LABEL.nd}">ND</td>`;
  if (s === 'none') return `<td class="z" data-k="${k}" title="${ST_LABEL.none}">·</td>`;
  const v = item.mods[k] || 0;
  if (!s && !v) return `<td class="z" data-k="${k}">·</td>`;
  return `<td class="${s || ''}${v < 0 ? ' neg' : ''}" data-k="${k}" title="${esc(ST_LABEL[s] || '')}">${units(v)}${s === 'scenario' ? '<sup>◇</sup>' : s === 'derived' ? '<sup>†</sup>' : s === 'partial' ? '<sup>*</sup>' : ''}</td>`;
}
// A row whose A1–A3 is aggregated in some layers and split in others is shown as aggregated
function rowStatus(item) {
  const st = { ...item.st };
  if (['A1', 'A2', 'A3'].some((k) => st[k] === 'agg' || st[k] === 'partial') && !['A1', 'A2', 'A3'].every((k) => st[k] === 'declared')) { if (st.A1 !== 'spent' && st.A1 !== 'noepd') { st.A1 = 'agg'; st.A2 = 'agg'; st.A3 = 'agg'; } }
  return st;
}
function renderLifecycle() {
  const R = S.R;
  $$('#lcRows button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lcrows === S.lc.rows)));
  if (!R) { $('#lcTable').innerHTML = ''; $('#letiBox').innerHTML = '<p class="lt-fine">Nothing read yet.</p>'; $('#stageBars').innerHTML = ''; $('#hotspots').innerHTML = ''; $('#byMat').innerHTML = ''; $('#lcNotes').innerHTML = ''; return; }
  const units = (x) => { const y = gNum(x); return Math.abs(y) < (S.gwp === 'kg' ? 0.5 : 0.05) ? '0' : Math.abs(y) >= 100 ? n0(y) : y.toFixed(1); };
  // LETI scale (kgCO2e/m², LETI's own unit)
  const max = 1300, lo = R.range.upfrontLow / R.gfa, hi = R.range.upfrontHigh / R.gfa;
  $('#letiBox').innerHTML = `<div class="lt-leti"><div class="lt-k">Upfront carbon (A1–A5) against LETI office bands <span class="lt-dim">kgCO2e/m²</span></div>
    <div class="scale">${LETI_OFFICE.map(([b, lim], i) => `<div style="background:${BAND_COL[b]};flex:${lim - (LETI_OFFICE[i - 1]?.[1] || 0)}">${b}</div>`).join('')}
    <span class="range" style="left:${Math.min(100, (lo / max) * 100)}%;width:${Math.max(0, Math.min(100, (hi / max) * 100) - (lo / max) * 100)}%"></span><span class="mark" style="left:calc(${Math.min(100, (R.perM2 / max) * 100)}% - 1px)"></span></div>
    <div class="ticks"><span>0</span><span>${n0(R.perM2)} kgCO2e/m² (range across EPDs ${n0(lo)}–${n0(hi)}) · band ${R.band}</span><span>1,300</span></div></div>`;
  $('#lcLegend').innerHTML = `<span><i class="lg declared"></i>declared in the EPD</span><span><i class="lg nd">ND</i>not declared</span><span><i class="lg agg"></i>A1–A3 only</span><span><i class="lg derived">†</i>derived from the EPD</span><span><i class="lg scenario">◇</i>project scenario</span>`;
  const st = stages(R), whole = st.upfront + st.use + st.operational + st.eol;
  const bars = [['Upfront A1–A5', st.upfront, 'upfront'], ['In use B1–B5', st.use, 'use'], ['Operational B6–B7', st.operational, 'operational'], ['End of life C1–C4', st.eol, 'eol']];
  $('#stageBars').innerHTML = `<div class="lt-bars">${bars.map(([l, x, c]) => `<div class="lt-bar"><span class="lbl">${l}</span><span class="track"><i style="width:${whole ? (x / whole) * 100 : 0}%;background:${STAGE_COL[c]}"></i></span><b>${G(x)}</b></div>`).join('')}<div class="lt-bar"><span class="lbl">Beyond D (separate)</span><span class="track"><i style="width:${whole ? (Math.abs(st.d) / whole) * 100 : 0}%;background:var(--s-d)"></i></span><b>${G(st.d)}</b></div></div>`;

  const head = `<thead><tr><th colspan="3"></th>${STAGE_SPANS.map(([s, n]) => `<th colspan="${n}" class="stg">${s}</th>`).join('')}<th></th></tr>
    <tr><th></th><th class="nm">${S.lc.rows === 'materials' ? 'Material · EPD' : 'Component'}</th><th></th>${LC_COLS.map((c) => `<th data-info="${esc(`${c.label} · ${c.name}|${c.info}`)}" class="${c.stage === 'Beyond' ? 'bey' : ''}">${esc(c.label)}</th>`).join('')}<th>A–C</th></tr></thead>`;
  const body = [];
  const ncol = LC_COLS.length + 4;
  const tot = Math.max(1, R.embodied);
  if (S.lc.rows === 'materials') {
    for (const m of R.materials) {
      const e = m.epd, item = { mods: m.mods, st: rowStatus(m), dType: e?.dType };
      const segs = [['A1A3', 'var(--s-product)'], ['A4', '#7fd8ee'], ['A5', '#7fd8ee'], ['B4', 'var(--s-use)'], ['C1', 'var(--s-eol)'], ['C2', 'var(--s-eol)'], ['C3', 'var(--s-eol)'], ['C4', 'var(--s-eol)']];
      const bar = `<span class="lt-mini-bar">${segs.map(([k, c]) => (m.mods[k] > 0 ? `<i style="width:${(m.mods[k] / tot) * 100 * 3}%;background:${c}"></i>` : '')).join('')}</span>`;
      body.push(`<tr class="row${S.lc.open === m.key ? ' open' : ''}" data-m="${esc(m.key)}"><td class="tg">${S.lc.open === m.key ? '▾' : '▸'}</td><td class="nm"><b>${esc((MATERIALS[m.key]?.name || m.name).split('(')[0].trim())}</b><small>${e ? esc(`${e.manufacturer || ''} · ${e.programOperator || ''}`) : 'no EPD found'}</small>${bar}</td><td>${e?.pdfUrl ? `<a class="lt-pdf" href="${esc(e.pdfUrl)}" target="_blank" rel="noopener" title="Open the EPD PDF in a new tab" aria-label="Open the EPD PDF">⧉</a>` : ''}</td>${LC_COLS.map((c) => lcCell(item, c, units)).join('')}<td class="ac">${units(m.embodied)}</td></tr>`);
      if (S.lc.open === m.key) body.push(`<tr class="exp"><td colspan="${ncol}">${lcExpansion(m)}</td></tr>`);
    }
  } else {
    let g0 = null;
    for (const r of R.rows) {
      if (r.group !== g0) { g0 = r.group; body.push(`<tr class="grp"><td colspan="${ncol}">${esc(g0)}</td></tr>`); }
      const dType = r.mats.find((x) => x.epd?.dType)?.epd.dType;
      body.push(`<tr class="row" data-c="${esc(r.id)}"><td class="tg"></td><td class="nm"><b>${esc(r.name)}</b><small>${esc(r.code)} · ${r.mats.length} material${r.mats.length > 1 ? 's' : ''}</small></td><td></td>${LC_COLS.map((c) => lcCell({ mods: r.mods, st: rowStatus(r), dParts: r.dParts, dType }, c, units)).join('')}<td class="ac">${units(r.embodied)}</td></tr>`);
    }
  }
  const T = { mods: R.totals, st: {}, dParts: R.dParts };
  for (const k of ['A1', 'A2', 'A3']) T.st[k] = 'agg';
  if (R.totals.B6 || R.totals.B7) body.push(`<tr class="op"><td></td><td class="nm"><b>Operational energy and water</b><small>${esc(S.OP ? `site EUI ${nf(S.OP.siteEUI)} kBtu/ft² · Operational tab` : '')}</small></td><td></td>${LC_COLS.map((c) => (c.k === 'B6' || c.k === 'B7' ? `<td data-k="${c.k}">${units(R.totals[c.k])}</td>` : '<td class="z">·</td>')).join('')}<td class="ac">·</td></tr>`);
  body.push(`<tr class="tot"><td></td><td class="nm">Total ${esc(gUnit())}</td><td></td><td colspan="3" class="agg">${units(R.totals.A1A3)}</td>${LC_COLS.slice(3).map((c) => (c.k.startsWith('D:') ? `<td class="${(R.dParts[c.k.slice(2)] || 0) < 0 ? 'neg' : ''}">${R.dParts[c.k.slice(2)] ? units(R.dParts[c.k.slice(2)]) : '·'}</td>` : `<td>${units(R.totals[c.k])}</td>`)).join('')}<td class="ac">${units(R.embodied)}</td></tr>`);
  $('#lcTable').innerHTML = head + `<tbody>${body.join('')}</tbody>`;
  // hotspots, coverage, notes
  const hmax = Math.max(...R.hotspots.map((h) => h.embodied), 1);
  $('#hotspots').innerHTML = `<div class="lt-bars">${R.hotspots.map((h) => `<div class="lt-bar" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) 70px"><span class="lbl" title="${esc(h.name)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(h.name)}</span><span class="track"><i style="width:${(h.embodied / hmax) * 100}%;background:var(--m)"></i></span><b>${G(h.embodied)}</b></div>`).join('')}</div><p class="lt-fine">Embodied A–C per component over ${R.rsp} years.</p>`;
  $('#byMat').innerHTML = `<table class="lt-ct">${R.materials.map((m) => `<tr><td>${esc((MATERIALS[m.key]?.name || m.name).split('(')[0].trim())}</td><td class="n">${m.epd ? `${m.epd.declared.filter((k) => k !== 'A1A3').length} of 17` : '—'}</td><td>${m.epd?.validUntil ? `<span class="lt-dim" style="margin:0">to ${esc(m.epd.validUntil.slice(0, 4))}</span>` : ''}</td></tr>`).join('')}</table><p class="lt-fine">Modules each EPD declares, of A1–D.</p>`;
  const notes = [];
  notes.push(R.fill ? 'Modules an EPD does not declare are filled with project scenarios (◇): transport from the supply origin on the map, site waste from RICS rates, 50 km to waste processing. These are not EPD data.' : 'Only EPD data: a module an EPD does not declare is shown as ND and counts as zero, so totals understate stages most EPDs leave out (A4, A5, C). Switch “Modules an EPD does not declare” in the side bar to fill them with project scenarios.');
  notes.push('B4 (†) is derived from each EPD’s own modules: product, construction and end of life, once for every replacement within the study period.');
  if (R.calibration.length && $('#calibrate').checked) notes.push(`Quantities calibrated to documented totals: ${R.calibration.filter((c) => !c.info).map((c) => `${c.k.toLowerCase()} ×${c.f.toFixed(2)}`).join(', ')}.`);
  if (S.building?.existing) notes.push('This building already stands. The table counts it as if built today, which is how a replacement is judged; Compare sets spent carbon aside for reuse.');
  notes.push('EPDs use different GWP methods (EN 15804+A2 GWP-total, TRACI, IPCC AR5/AR6); each EPD card says which. Module D is never netted off.');
  $('#lcNotes').innerHTML = notes.map((n) => `<p class="lt-fine" style="color:var(--muted)">${n}</p>`).join('');
}
function lcExpansion(m) {
  const e = m.epd;
  if (!e) return '<p class="lt-fine">No EPD was found for this material, so it is left out of the lifecycle totals.</p>';
  const procs = (e.processes || []).filter((p) => p.name);
  const byMod = {};
  for (const p of procs) { const mod = String(p.module || '').replace(/\s/g, ''); (byMod[mod] ||= []).push(p); }
  const modOrder = Object.keys(byMod).sort();
  const cards = modOrder.flatMap((mod) => byMod[mod].map((p) => {
    const im = imgProcess(p.name, mod, m.key); const info = im?.key ? procInfo(im.key) : null;
    return `<figure class="lt-proc" data-pm="${esc(mod)}">${im?.img ? `<img src="${esc(im.img)}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer">` : '<span class="noimg"></span>'}<figcaption><span class="mod">${esc(mod)}</span><b>${esc(p.name)}</b><span>${esc(p.summary || info?.summary || '')}</span>${im?.img ? `<small>Photo: <a href="${esc(im.page || '#')}" target="_blank" rel="noopener">${esc(credit(im))}</a></small>` : ''}</figcaption></figure>`;
  }));
  const alts = EPD_ALTS[m.key] || [];
  const nd = e.notDeclared.filter((k) => !['B6', 'B7'].includes(k));
  const org = originOf(m.key, e), rt = org && S.site ? routeFor(org, S.site) : null;
  return `<div class="lt-exp">
    <div class="lt-procs">${cards.join('') || '<p class="lt-fine">The EPD does not describe its processes step by step.</p>'}</div>
    <div class="lt-epdcard">
      <div class="lt-k">EPD</div>
      <p><b>${esc(e.title)}</b><br>${esc(e.manufacturer || '')} · ${esc(e.programOperator || '')} ${esc(e.regNo || '')}<br>${esc(e.standard || '')} · ${esc(e.indicator || '')} · declared unit ${esc(e.declaredUnit || '')}${e.validUntil ? ` · valid to ${esc(e.validUntil)}` : ''}</p>
      <p>${e.pdfUrl ? `<a class="lt-link" href="${esc(e.pdfUrl)}" target="_blank" rel="noopener">Open the EPD PDF ⧉</a>` : ''}${e.landingUrl ? ` · <a class="lt-link" href="${esc(e.landingUrl)}" target="_blank" rel="noopener">programme page</a>` : ''}</p>
      <div class="lt-declist"><span class="ok">Declared: ${e.declared.filter((k) => k !== 'A1A3' || !e.split).map((k) => (k === 'A1A3' ? 'A1–A3' : k)).join(', ')}</span><span class="nd">Not declared: ${nd.join(', ') || 'none'}</span></div>
      ${e.moduleNotes?.D || e.dParts?.[0]?.note ? `<p class="lt-fine"><b>Module D</b> (${esc(e.dType || 'not declared')}): ${esc(e.moduleNotes?.D || e.dParts?.[0]?.note || '')}</p>` : ''}
      ${e.moduleNotes?.C ? `<p class="lt-fine"><b>End of life</b>: ${esc(e.moduleNotes.C)}</p>` : ''}
      ${alts.length > 1 ? `<label class="lt-field">Use a different EPD <select data-epdpick="${esc(m.key)}">${alts.map((a, i) => `<option value="${i}"${(S.epdPick[m.key] || 0) === i ? ' selected' : ''}>${esc(a.manufacturer || a.title)} · ${a.perUnit ? nf(a.per.A1A3, 0) : isNum(a.per.A1A3) ? a.per.A1A3.toFixed(3) : '—'}${a.perUnit ? ' per unit' : ' kg/kg'}</option>`).join('')}</select></label>` : ''}
      <div class="lt-k" style="margin-top:10px">Transport to site</div>
      <p class="lt-fine">${rt ? `${esc(org.name || 'Origin')} → ${esc(S.site.name || 'site')}: ${n0(rt.km)} km, mostly by ${rt.mode}. Drag the origin on the map to change where it comes from.` : S.site ? 'This EPD names no plant location; drag the origin on the map to set one.' : 'Set a site address to route deliveries.'}${isNum(e.per.A4) ? ' The EPD declares its own A4.' : R_FILL()}</p>
    </div></div>`;
}
const R_FILL = () => (fill() ? ' A4 here is a project scenario from this distance.' : ' The EPD does not declare A4; turn on project scenarios to count it from this distance.');

// Map: locations behind the hovered material and module
let MAP = null;
function ensureMap() {
  if (MAP) return MAP;
  MAP = createMap($('#worldMap'), { onOrigin: (key, o) => { S.origins[key] = { lat: o.lat, lon: o.lon, name: o.name }; compute(); showMap(key, 'A4'); } });
  if (S.site) MAP.setSite(S.site);
  return MAP;
}
function showMap(key, mod) {
  const map = ensureMap(); if (S.site) map.setSite(S.site);
  const m = S.R?.materials.find((x) => x.key === key); const e = m?.epd;
  if (!e) { map.clear(); $('#mapWhat').textContent = 'roll over a cell'; $('#mapNote').textContent = ''; return; }
  const mk = (mod || '').replace('A1A3', 'A1');
  const procs = (e.processes || []).filter((p) => String(p.module || '').replace(/\s/g, '').split(/[,/–-]/).some((x) => x === mk || (x === 'A1' && mk === 'A1')) || (mk === 'A2' && /A1/.test(p.module)));
  const pts = [];
  const push = (l, role) => { if (l && isNum(l.lat) && isNum(l.lon)) pts.push({ lat: l.lat, lon: l.lon, name: l.name || '', role }); };
  for (const p of procs) for (const l of p.locations || []) push(l, l.role);
  if (/^A1|^A2/.test(mk)) for (const r of e.rawMaterials || []) push(r.origin && { ...r.origin, name: `${r.name}${r.origin.name ? `: ${r.origin.name}` : ''}` }, 'raw');
  if (/^A3|^A2|^A4/.test(mk)) push(e.plant && { ...e.plant, name: e.plant.name || e.manufacturer }, 'plant');
  const transport = mk === 'A4' || mk === 'A2' || mk === 'C2';
  const all = [];
  for (const p of e.processes || []) for (const l of p.locations || []) if (isNum(l.lat)) all.push({ lat: l.lat, lon: l.lon, name: l.name });
  if (e.plant && isNum(e.plant.lat)) all.push({ lat: e.plant.lat, lon: e.plant.lon, name: e.plant.name || e.manufacturer });
  const origin = mk === 'A4' ? originOf(key, e) : null;
  map.show({ key, points: pts, origin, candidates: all, transport: Boolean(origin), mode: origin && S.site ? routeFor(origin, S.site).mode : '' });
  const label = MODULES.find((x) => x.k === mk)?.name || (mk === 'D' ? 'Beyond the boundary' : mk);
  $('#mapWhat').textContent = `${(MATERIALS[key]?.name || key).split('(')[0].trim()} · ${mk} ${label}`;
  $('#mapNote').innerHTML = pts.length || origin ? (origin && S.site ? `Delivery: ${esc(origin.name || 'origin')} → site, ${n0(routeFor(origin, S.site).km)} km. Drag the origin to another plant or anywhere.` : `${pts.length} location${pts.length > 1 ? 's' : ''} named by the EPD.`) + (transport && !S.site ? ' Set a site address to draw the route.' : '') : 'The EPD names no locations for this stage.';
}

/* ------------------------------------------------------------------ render: operational */
function renderOperational() {
  const OP = S.OP, R = S.R;
  if (!OP || !R) { $('#opHead').innerHTML = '<p class="lt-fine">Add a building first.</p>'; $('#opTable').innerHTML = ''; $('#opViz').innerHTML = ''; $('#opArea').innerHTML = ''; $('#opCross').innerHTML = ''; return; }
  const loc = opCfg().loc;
  const perA = OP.firstYear / areaOf(gfa());
  const ll = OP.ll97;
  $('#opHead').innerHTML = `<div class="lt-kpis">
      <div><span>Site EUI</span><b>${nf(S.area === 'ft2' ? OP.siteEUI : OP.siteEUI * 3.1546, 1)}</b><small>${S.area === 'ft2' ? 'kBtu/ft²·yr' : 'kWh/m²·yr'}</small></div>
      <div><span>Operational carbon, first year</span><b>${G(OP.firstYear)}</b><small>${nf(perA, 1)} kgCO2e/${areaU()}·yr</small></div>
      <div><span>Over ${rsp()} years (B6 + B7)</span><b>${G(OP.B6 + OP.B7)}</b><small>${S.op.grid === 'decarbonising' ? `grid to zero by ${S.op.zeroYear}` : 'grid held at today’s rate'}</small></div>
      ${ll ? `<div class="${ll.p1.em > ll.p1.limit ? 'bad' : 'ok'}"><span>NYC Local Law 97, 2024–29</span><b>${(ll.p1.em * 1000).toFixed(2)}</b><small>kgCO2e/ft² vs limit ${(ll.p1.limit * 1000).toFixed(2)}</small></div><div class="${ll.p2.em > ll.p2.limit ? 'bad' : 'ok'}"><span>LL97, 2030–34</span><b>${(ll.p2.em * 1000).toFixed(2)}</b><small>vs limit ${(ll.p2.limit * 1000).toFixed(2)}${ll.p2.em > ll.p2.limit ? ` · ≈ $${n0((ll.p2.em - ll.p2.limit) * OP.ft2 * (ENERGY.ll97.penalty || 268))}/yr penalty` : ''}</small></div>` : ''}
    </div>
    <div class="lt-opctl">
      <div><div class="lt-k">Electricity supplier</div><b>${esc(loc.utility || 'Local grid')}</b><small>${esc(loc.gridName || '')}${loc.egrid ? ` (eGRID ${esc(loc.egrid)})` : ''} · ${loc.kgPerKWh ? `${loc.kgPerKWh.toFixed(3)} kgCO2e/kWh generated` : ''}</small>${loc.mix ? `<span class="lt-mix">${Object.entries(loc.mix).filter(([, v]) => v > 0.005).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<i style="flex:${v};background:${{ gas: '#ff8cc4', coal: '#5b5b57', nuclear: '#FFD600', hydro: '#00B5E2', wind: '#7fd8ee', solar: '#ffe36b', oil: '#8a6a5a', biomass: '#b5e3a8' }[k] || '#555'}" title="${k} ${(v * 100).toFixed(0)}%"></i>`).join('')}</span>` : ''}</div>
      <div><div class="lt-k">District steam</div><b>${esc(loc.steam?.name || 'Generic district steam')}</b><small>${nf((loc.steam?.kgPerKWh ?? ENERGY.fuels['district-steam'].kgPerKWh) * 293.07, 1)} kgCO2e/MMBtu</small></div>
      <label class="lt-field">Grid over time <select id="gridIn"><option value="flat"${S.op.grid === 'flat' ? ' selected' : ''}>Today’s intensity, held flat</option><option value="decarbonising"${S.op.grid === 'decarbonising' ? ' selected' : ''}>Decarbonising to zero</option></select></label>
      <label class="lt-field">Zero-carbon grid by <input type="number" id="zeroIn" min="2030" max="2100" step="5" value="${S.op.zeroYear}"${S.op.grid === 'flat' ? ' disabled' : ''}></label>
      ${loc.ll97 ? `<label class="lt-check"><input type="checkbox" id="ll97In"${S.op.useLL97 ? ' checked' : ''}> Use LL97 coefficients</label>` : ''}
      <label class="lt-field">Measured site EUI <span><input type="number" id="euiIn" step="0.1" value="${S.op.measuredEUI ?? ''}" placeholder="none"> kBtu/ft²</span></label>
    </div>`;
  const rows = END_USES.map(({ k, label }) => {
    const L = S.op.layers[k] || {}, u = OP.uses.find((x) => x.k === k), sys = sysById(k, L.system);
    const srcs = sourcesFor(sys?.fuel || 'elec', loc);
    return `<tr data-use="${k}"><td><i class="lt-dot" style="background:${USE_COL[k]}"></i><b>${label}</b><small class="lt-sub">${esc(sys?.effLabel || '')}${S.op.asIs?.[k] && S.op.asIs[k].system === L.system ? ' · as built' : ''}</small></td>
      <td><select data-sys="${k}">${systemsFor(k).map((s) => `<option value="${s.id}"${s.id === L.system ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}</select></td>
      <td><span class="lt-chips small">${passiveFor(k).map((p) => `<button type="button" data-pas="${k}|${p.id}" class="${(L.passive || []).includes(p.id) ? 'on' : ''}" title="${esc(`${p.range || ''} ${p.note || ''}`)}">${esc(p.name.split('(')[0].trim())} <em>−${Math.round(p.reduction * 100)}%</em></button>`).join('')}</span></td>
      <td><select data-src="${k}">${srcs.map((s) => `<option value="${s.id}"${s.id === (L.source || defaultSource(sys)) ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}</select></td>
      <td class="n">${nf(S.area === 'ft2' ? u.siteKbtuFt2 : u.siteKbtuFt2 * 3.1546, 1)}</td><td class="n">${G(OP.annual[0].by[k])}</td></tr>`;
  });
  $('#opTable').innerHTML = `<table class="lt-ct lt-optable"><tr><th>End use</th><th>Mechanical system</th><th>Passive techniques</th><th>Energy source</th><th class="n">${S.area === 'ft2' ? 'kBtu/ft²' : 'kWh/m²'}</th><th class="n">${gUnit()}/yr</th></tr>${rows.join('')}</table>
    <p class="lt-fine">Load per end use from ${S.op.measuredSplit ? 'the metered end-use split of this building' : S.op.measuredEUI ? 'the program benchmark, scaled so the as-built systems match the measured EUI' : `the ${esc(ENERGY.baselines[S.program]?.label || '')} benchmark (EIA CBECS 2018)`}; passive measures cut the load, the system's efficiency turns load into energy, and the source sets the carbon. Passive savings are indicative ranges from the 2030 Palette and design guides.</p>`;
  // end-use split: energy vs carbon
  const eTot = OP.uses.reduce((s, u) => s + u.kWh, 0) || 1, cTot = OP.annual[0].total || 1;
  $('#opViz').innerHTML = `<div class="lt-k">Where the energy and the carbon go <span class="lt-dim">first year</span></div>
    <div class="lt-split2"><div class="lt-stack"><span>Energy</span><i>${OP.uses.map((u) => `<b style="flex:${u.kWh / eTot};background:${USE_COL[u.k]}" title="${u.label} ${((u.kWh / eTot) * 100).toFixed(0)}%"></b>`).join('')}</i></div>
    <div class="lt-stack"><span>Carbon</span><i>${OP.uses.map((u) => `<b style="flex:${OP.annual[0].by[u.k] / cTot};background:${USE_COL[u.k]}" title="${u.label} ${((OP.annual[0].by[u.k] / cTot) * 100).toFixed(0)}%"></b>`).join('')}</i></div></div>
    <div class="lt-legend">${OP.uses.map((u) => `<span><i class="lt-dot" style="background:${USE_COL[u.k]}"></i>${u.label} ${((OP.annual[0].by[u.k] / cTot) * 100).toFixed(0)}%</span>`).join('')}</div>
    ${waterfall()}`;
  // emissions over time, stacked by end use, with LL97 limits
  const years = OP.annual.map((a) => a.year);
  const lim = OP.ll97 ? years.map((y) => ({ year: y, v: (y < 2030 ? OP.ll97.p1.limit : OP.ll97.p2.limit) * OP.ft2 * 1000 })) : null;
  $('#opArea').innerHTML = `<div class="lt-k">Operational emissions by year <span class="lt-dim">${gUnit() === 'tCO2e' ? 'tCO2e' : 'kgCO2e'}/yr${lim ? ' · dashed: LL97 limit (2030–34 limit held after 2034)' : ''}</span></div>${stackedArea(years, END_USES.map(({ k, label }) => ({ label, color: USE_COL[k], values: OP.annual.map((a) => a.by[k] / 1000) })), { limit: lim?.map((l) => ({ ...l, v: l.v / 1000 })), fmtY: (v) => n0(v), label: 'Operational emissions by year' })}`;
  // cumulative embodied vs operational: when operation overtakes the upfront carbon
  const up = R.upfront, cum = []; let c = 0;
  for (const a of OP.annual) { c += a.total; cum.push(c); }
  const cross = cum.findIndex((v) => v >= up);
  $('#opCross').innerHTML = `<div class="lt-k">Cumulative: upfront embodied vs operational <span class="lt-dim">t</span></div>${stackedArea(years, [{ label: 'Operational, cumulative', color: 'var(--s-operational)', values: cum.map((v) => v / 1000) }], { limit: years.map((y) => ({ year: y, v: up / 1000 })), fmtY: (v) => n0(v), label: 'Cumulative operational vs upfront' })}<p class="lt-fine">${cross >= 0 ? `Operation overtakes the upfront embodied carbon (${G(up)}, dashed) in year ${cross + 1} (${years[cross]}).` : `Operation stays below the upfront embodied carbon (${G(up)}) over the whole period.`}</p>`;
  $('#opNotes').innerHTML = `Method borrowed from <a class="lt-link" href="https://www.zero-code.org/energy-calculator/" target="_blank" rel="noopener">Zero Code</a> (end-use baseline by building type), <a class="lt-link" href="https://www.zerotool.org/" target="_blank" rel="noopener">ZeroTool</a> (benchmark → target → design) and <a class="lt-link" href="https://www.cscale.io/" target="_blank" rel="noopener">C.Scale</a> (yearly emissions with a changing grid). Grid: EPA eGRID2023; steam and NYC limits: Local Law 97; outside the US, Ember 2025 national intensities.`;
}
// What took the as-built building to this design: steps through systems, passive and supply
function waterfall() {
  if (!S.op.asIs) return '';
  const base = runOp({ ...opCfg(), layers: S.op.asIs }).firstYear;
  const pas = runOp({ ...opCfg(), layers: Object.fromEntries(Object.entries(S.op.asIs).map(([k, L]) => [k, { ...L, passive: S.op.layers[k]?.passive || [] }])) }).firstYear;
  const sys = runOp({ ...opCfg(), layers: Object.fromEntries(Object.entries(S.op.layers).map(([k, L]) => [k, { ...L, source: defaultSource(sysById(k, L.system)) }])) }).firstYear;
  const now = S.OP.firstYear;
  const steps = [['As built', base, base], ['Passive', pas - base], ['Systems', sys - pas], ['Supply', now - sys], ['This design', now, now]];
  const max = Math.max(base, now, 1);
  let acc = 0;
  return `<div class="lt-k" style="margin-top:16px">From as-built to this design <span class="lt-dim">first-year ${gUnit()}</span></div><div class="lt-wf">${steps.map(([l, d, abs]) => {
    let from, to; if (abs != null) { from = 0; to = abs; acc = abs; } else { from = acc; to = acc + d; acc = to; }
    const lo = Math.min(from, to), hi = Math.max(from, to);
    return `<div class="col"><span class="bar" style="bottom:${(lo / max) * 100}%;height:${Math.max(0.5, ((hi - lo) / max) * 100)}%;background:${abs != null ? 'var(--muted)' : d > 0 ? 'var(--m)' : 'var(--c)'}"></span><b style="bottom:calc(${(hi / max) * 100}% + 3px)">${abs != null ? G(abs) : `${d > 0 ? '+' : '−'}${G(Math.abs(d))}`}</b><small>${l}</small></div>`;
  }).join('')}</div>`;
}

/* ------------------------------------------------------------------ render: compare (scenario builder) */
function scenarioCtx() { const epds = epdSet(); return { epds, alts: EPD_ALTS, opts: baseOpts(epds), opCfg: opCfg() }; }
function renderCompare() {
  const B = currentBuilding();
  if (!B || S.source === 'model') { $('#builder').innerHTML = `<p class="lt-fine">${S.source === 'model' ? 'Scenarios run on a building read from drawings or an address; an imported model has no layer specification to swap.' : 'Add a building first.'}</p>`; $('#compareChart').innerHTML = ''; $('#compareTable').innerHTML = ''; $('#compareNote').textContent = ''; return; }
  S.draft ||= defaultChoice(B);
  const ch = S.draft, existing = Boolean(B.existing);
  let prev = null;
  try { prev = runScenario(B, ch, scenarioCtx()); } catch (e) { prev = null; console.error(e); }
  const opt = (k, o) => `<button type="button" data-ch="${k}" data-v="${esc(o.id)}" class="${ch[k] === o.id ? 'on' : ''}"${o.existing && (!existing || (ch.reuse && ch.reuse !== 'adaptive')) ? ' disabled' : ''}>${esc(o.name)}</button>`;
  const card = (k, list, title, note) => `<div class="lt-bcard"><div class="lt-k">${title}</div><div class="lt-opts">${list.map((o) => opt(k, o)).join('')}</div>${note ? `<p class="lt-fine">${note}</p>` : ''}</div>`;
  const st = prev ? stages(prev.R) : null;
  const base = S.scenarios[0] ? S.scenarios[0].res : null;
  $('#builder').innerHTML = `<div class="lt-bgrid">
      <div class="lt-bcol">
        <div class="lt-k">Materials by system layer</div>
        ${Object.entries(LAYER_CHOICES).map(([k, L]) => `<div class="lt-brow"><span>${L.label}</span><div class="lt-opts">${L.options.map((o) => opt(k, o)).join('')}</div></div>`).join('')}
      </div>
      <div class="lt-bcol">
        ${existing ? card('reuse', REUSE, 'Reuse strategy', esc(REUSE.find((r) => r.id === ch.reuse)?.note || '')) : ''}
        ${card('efficiency', EFFICIENCY, 'Energy efficiency (retrofit)', esc(EFFICIENCY.find((r) => r.id === ch.efficiency)?.note || ''))}
        ${card('fuel', FUELS, 'Fuel sources', 'Linked to the Operational tab: its sources, or a strategy applied to every end use.')}
      </div>
      <div class="lt-bcol lt-bprev">
        <div class="lt-k">This selection</div>
        ${st ? `<div class="lt-big">${G(prev.R.whole)}<small>whole life</small></div>
          <div class="lt-cmprow mini"><div class="track">${['upfront', 'use', 'operational', 'eol'].map((k) => `<i title="${k}: ${G(st[k])}" style="width:${(st[k] / Math.max(1, prev.R.whole)) * 100}%;background:${STAGE_COL[k]}"></i>`).join('')}</div></div>
          <div class="lt-stat"><span>Upfront A1–A5</span><b>${G(st.upfront)}</b></div><div class="lt-stat"><span>In use B1–B5</span><b>${G(st.use)}</b></div><div class="lt-stat"><span>Operational</span><b>${G(st.operational)}</b></div><div class="lt-stat"><span>End of life</span><b>${G(st.eol)}</b></div><div class="lt-stat"><span>Module D</span><b>${G(st.d)}</b></div>
          ${base ? `<p class="lt-fine">${prev.R.whole <= base.whole ? '−' : '+'}${Math.abs(Math.round((prev.R.whole / base.whole - 1) * 100))}% against “${esc(S.scenarios[0].name)}”.</p>` : ''}` : '<p class="lt-fine">Could not run this combination.</p>'}
        <label class="lt-field">Name <input type="text" id="scName" value="${esc(describe(ch).slice(0, 80))}"></label>
        <button class="lt-btn primary" id="btnSave" type="button">Save scenario</button>
      </div></div>`;
  renderSaved();
}
function renderSaved() {
  const list = S.scenarios;
  if (!list.length) { $('#compareChart').innerHTML = '<p class="lt-fine">Saved scenarios appear here, side by side. Save the current selection to start.</p>'; $('#compareTable').innerHTML = ''; $('#compareNote').textContent = ''; return; }
  const max = Math.max(...list.map((s) => s.res.upfront + s.res.use + s.res.operational + s.res.eol), 1);
  $('#compareChart').innerHTML = `<div class="lt-legend">${[['upfront', 'Upfront A1–A5'], ['use', 'In use B1–B5'], ['operational', 'Operational B6–B7'], ['eol', 'End of life C']].map(([k, l]) => `<span><i class="lt-dot" style="background:${STAGE_COL[k]}"></i>${l}</span>`).join('')}</div>
    <div class="lt-cmp">${list.map((s, i) => `<div class="lt-cmprow"><div class="name">${esc(s.name)}${s.desc !== s.name ? `<small>${esc(s.desc)}</small>` : ''}</div><div class="track">${['upfront', 'use', 'operational', 'eol'].map((k) => `<i title="${k}: ${G(s.res[k])}" style="width:${(Math.max(0, s.res[k]) / max) * 100}%;background:${STAGE_COL[k]}"></i>`).join('')}</div><b>${G(s.res.whole)}<span class="lt-dim" style="display:block;margin:0">upfront ${G(s.res.upfront)}</span></b><span class="acts"><button type="button" class="lt-btn small" data-load="${i}" title="Load into the builder">Edit</button><button type="button" class="lt-btn small" data-del="${i}" aria-label="Delete ${esc(s.name)}">×</button></span></div>`).join('')}</div>`;
  const b = list[0].res;
  $('#compareTable').innerHTML = `<table class="lt-ct"><tr><th>Scenario</th><th class="n">Upfront</th><th class="n">In use</th><th class="n">Operational</th><th class="n">End of life</th><th class="n">Whole life</th><th class="n">vs first</th><th class="n">Module D</th></tr>${list.map((s) => `<tr><td>${esc(s.name)}</td><td class="n">${G(s.res.upfront)}</td><td class="n">${G(s.res.use)}</td><td class="n">${G(s.res.operational)}</td><td class="n">${G(s.res.eol)}</td><td class="n">${G(s.res.whole)}</td><td class="n">${s === list[0] ? '—' : `${s.res.whole <= b.whole ? '−' : '+'}${Math.abs(Math.round((s.res.whole / b.whole - 1) * 100))}%`}</td><td class="n">${G(s.res.d)}</td></tr>`).join('')}</table>`;
  const best = [...list].sort((a, c) => a.res.whole - c.res.whole)[0];
  $('#compareNote').innerHTML = `Lowest whole-life total: <b>${esc(best.name)}</b>. Saved results are frozen at the settings they were saved with; use Edit, then Save, to rerun one under today’s settings.`;
}
function saveScenario() {
  const B = currentBuilding(); if (!B) return;
  const r = runScenario(B, S.draft, scenarioCtx());
  const st = stages(r.R);
  S.scenarios.push({ name: $('#scName').value.trim() || describe(S.draft), desc: describe(S.draft), choice: { ...S.draft }, building: B.name, res: { ...st, whole: r.R.whole } });
  store.set('scenarios', S.scenarios); renderCompare(); toast('Scenario saved.');
}

/* ------------------------------------------------------------------ site, address and program */
function setSite(p, name) {
  const loc = locate(p.lat, p.lon, p.countryCode || 'us');
  S.site = { lat: p.lat, lon: p.lon, name: name || p.city || 'Site', loc, display: p.display };
  $('#addrInfo').innerHTML = `${esc((p.display || name || '').split(',').slice(0, 3).join(','))}<br>Grid: ${esc(loc.utility)} · ${esc(loc.gridName || '')}${loc.steam ? ` · steam: ${esc(loc.steam.name)}` : ''}`;
  MAP?.setSite(S.site);
}
async function findAddress(q, { build = false } = {}) {
  if (!q.trim()) return;
  toast(`<span class="lt-spin"></span>Finding ${esc(q)}…`, 0);
  try {
    const p = await geocode(q);
    $('#addrIn').value = q; $('#addrIn2').value = q;
    if (isSeagram(p)) { if (build || !S.building) { await loadSeagram(); return; } setSite(p, 'Seagram Building'); compute(); toast('Site set: 375 Park Avenue.'); return; }
    setSite(p, p.display.split(',')[0]);
    if (!build) { compute(); toast('Site set.'); return; }
    toast(`<span class="lt-spin"></span>Reading the building footprint from OpenStreetMap…`, 0);
    const fp = await footprint(p.lat, p.lon);
    const { building, provenance } = buildingFromFootprint(fp, p);
    S.building = building; S.prov = provenance; S.project = null; S.sheets = []; S.source = 'drawings'; S.model = null; S.modelShown = null; S.gfa = null; S.op.asIs = null; S.op.measuredEUI = null; S.op.measuredSplit = null; S.draft = null; S.origins = {};
    compute(); setStage('3d'); await generate3D();
    toast(`Built ${esc(building.name)} from its footprint: ${building.blocks[0].levels} levels. Check the assumptions under “Building as read”.`, 6000);
  } catch (e) { toast(`Could not use that address: ${esc(e.message)}`, 6000); }
}
function setProgram(p) {
  S.program = p;
  if (!S.op.asIs) S.op.layers = defaultLayers(p);
  compute();
}

/* ------------------------------------------------------------------ 3D files */
async function readModelFile(file, { ignoreDeclared = false } = {}) {
  const M = await m3(); const v = await ensureViewer();
  toast(`<span class="lt-spin"></span>Reading ${esc(file.name)}…`, 0);
  try {
    const { root, units } = await M.loadModelFile(file, (msg) => toast(`<span class="lt-spin"></span>${esc(msg)}`, 0));
    const read = M.sceneToMeshes(root, units, { ignoreDeclared });
    const t = meshesToTakeoff(read.meshes);
    const groups = Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, c.group]));
    if (!read.declared) M.tagImported(read.meshes, groups);
    S.model = { name: file.name.replace(/\.[^.]+$/, ''), root, takeoff: { components: t.components, gfa: t.gfa }, report: t.report, units: read.units, declared: read.declared };
    v.setModel(root); S.modelShown = 'file'; $('#viewerMsg').hidden = true;
    S.source = 'model'; S.gfa = null;
    $('#modelInfo').textContent = `${file.name}: ${read.declared ? `${t.components.length} components with declared quantities` : `${t.report.meshes} meshes in ${read.units.name}, ${Object.entries(t.report.byClass).map(([k, n]) => `${n} ${k}`).join(', ')}${t.report.open ? `; ${t.report.open} open surfaces measured by area` : ''}${t.report.excluded ? `; ${t.report.excluded} unclassified elements left out` : ''}`}. Set the floor area in the side bar if the model's slabs miss some.`;
    toast(`Read ${esc(file.name)}.`);
    compute(); apply3D();
    return t;
  } catch (e) { toast(`Could not read ${esc(file.name)}: ${esc(e.message)}`, 6000); throw e; }
}
async function roundtrip() {
  if (!S.R || !S.building) return toast('Generate a model first.');
  if (S.modelShown !== 'generated') await generate3D();
  const before = S.R;
  const blob = await S.viewer.exportGLB();
  const file = new File([blob], `${(S.building.name || 'model').replace(/\W+/g, '-').toLowerCase()}.glb`);
  await readModelFile(file);
  const declared = S.R;
  await readModelFile(file, { ignoreDeclared: true });
  const geomOnly = S.R;
  const pct = (a, b) => `${((a / b - 1) * 100).toFixed(1)}%`;
  $('#modelReport').innerHTML = `<div class="lt-k" style="margin-top:12px">GLB round trip</div><table class="lt-prov">
    <tr><td>Drawings takeoff</td><td>${G(before.upfront)} upfront</td></tr>
    <tr><td>GLB read with its embedded quantities</td><td>${G(declared.upfront)} <span class="lt-pill ${Math.abs(declared.upfront / before.upfront - 1) < 0.005 ? 'ok' : 'warn'}">${pct(declared.upfront, before.upfront)}</span></td></tr>
    <tr><td>Same GLB read from geometry only</td><td>${G(geomOnly.upfront)} <span class="lt-pill warn">${pct(geomOnly.upfront, before.upfront)}</span></td></tr></table>
    <p class="lt-fine">Geometry alone sees boxes, not sections, which is why BIM-to-LCA tools lean on IFC quantity sets and material assignments.</p>`;
  S.model.compare = { before: before.upfront, declared: declared.upfront, geom: geomOnly.upfront };
  S.source = 'drawings'; compute(); await generate3D();
  return S.model.compare;
}

/* ------------------------------------------------------------------ tabs */
function setStage(s) { S.stage = s; $$('[data-stage]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.stage === s))); $('#viewer').hidden = s !== '3d'; $('#tools3d').hidden = s !== '3d'; $('#docsPane').hidden = s !== 'docs'; if (s === 'docs') renderRead(); }
function setTab(t) {
  S.tab = t;
  for (const b of $$('.lt-tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === t));
  for (const v of $$('.lt-view')) v.hidden = v.id !== `view-${t}`;
  if (t === 'model' && S.building && !S.modelShown && S.source !== 'model') generate3D().catch(() => {});
  renderTab();
}
function renderTab() {
  const t = S.tab;
  if (t === 'model') { renderModelSide(); renderProv(); apply3D(); if (S.stage === 'docs') renderRead(); }
  if (t === 'components') renderComponents();
  if (t === 'lifecycle') { renderLifecycle(); ensureMap(); }
  if (t === 'operational') renderOperational();
  if (t === 'compare') renderCompare();
}
function renderAll() { renderSummary(); renderTab(); }

/* ------------------------------------------------------------------ inputs */
async function svgToPng(svg, width = 2000) {
  const img = new Image(); img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  const c = document.createElement('canvas'); c.width = width; c.height = Math.round(width * img.naturalHeight / img.naturalWidth);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.9);
}
async function shrink(dataUrl, max = 2000) {
  const img = new Image(); img.src = dataUrl; await img.decode();
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.88);
}
async function aiRead(sheet) {
  sheet.pending = true; renderRead();
  try {
    const image = sheet.kind === 'vector' ? await svgToPng(sheet.svg) : await shrink(sheet.img);
    const r = await fetch('/api/plan-read', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ image, text: sheet.text || '' }) });
    const j = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
    if (!j.ok) throw new Error(j.error === 'unauthorized' ? 'not authorised to use the vision model' : j.error === 'ai_unavailable' ? 'the AI drawing reader needs the optional backend — see README' : (j.detail || j.error || `HTTP ${r.status}`));
    sheet.ai = j;
    if (sheet.kind === 'raster') { sheet.reading = aiToReading(j.read, sheet.label); readAll(); }
  } catch (e) {
    sheet.ai = { error: e.message }; sheet.error = `Vision read failed: ${e.message}`;
  } finally { sheet.pending = false; renderRead(); }
}
let pdfjs = null;
async function readPDF(file) {
  pdfjs ||= await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const n = Math.min(doc.numPages, 8);
  const out = [];
  for (let p = 1; p <= n; p++) {
    const page = await doc.getPage(p);
    const vp0 = page.getViewport({ scale: 1 }), scale = 2000 / Math.max(vp0.width, vp0.height);
    const vp = page.getViewport({ scale });
    const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const tc = await page.getTextContent();
    out.push({ img: c.toDataURL('image/jpeg', 0.88), text: tc.items.map((i) => i.str).join(' ').slice(0, 4000), label: `${file.name.replace(/\.pdf$/i, '')} p${p}` });
  }
  if (doc.numPages > n) toast(`Read the first ${n} of ${doc.numPages} pages.`);
  return out;
}
async function handleFiles(files) {
  const list = [...files];
  const model = list.find((f) => /\.(3dm|ifc|glb|gltf|obj|stl)$/i.test(f.name));
  const drawings = list.filter((f) => !/\.(3dm|ifc|glb|gltf|obj|stl)$/i.test(f.name));
  if (drawings.length) {
    if (S.sheets.some((s) => /^seagram-/i.test(s.name)) && !drawings.every((f) => /^seagram-/i.test(f.name))) { S.sheets = []; S.project = null; }
    const pending = [];
    for (const f of drawings) {
      const ext = f.name.split('.').pop().toLowerCase();
      try {
        if (ext === 'svg') addVectorSheet(f.name, await f.text());
        else if (ext === 'dxf') { const d = dxfToSVG(await f.text()); if (!d.svg) throw new Error('no drawable entities'); addVectorSheet(f.name, d.svg); if (d.skipped) toast(`${d.skipped} block inserts in ${esc(f.name)} were not expanded.`); }
        else if (ext === 'pdf') { for (const p of await readPDF(f)) pending.push(await addRasterSheet(f.name, p.img, p.text, p.label)); }
        else if (/^(png|jpe?g|webp)$/.test(ext)) { const url = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); }); pending.push(await addRasterSheet(f.name, url, '', f.name.replace(/\.[^.]+$/, ''))); }
      } catch (e) { toast(`Could not read ${esc(f.name)}: ${esc(e.message)}`, 6000); }
    }
    S.source = 'drawings'; S.gfa = null;
    S.sel = Math.max(0, S.sheets.length - drawings.length);
    readAll(); setTab('model'); setStage('docs');
    for (const sh of pending) await aiRead(sh);
  }
  if (model) { setTab('model'); setStage('3d'); await readModelFile(model); }
}
async function loadSeagram() {
  toast('<span class="lt-spin"></span>Reading the Seagram Building: address, drawings and systems…', 0);
  S.sheets = []; S.project = SEAGRAM_PROJECT; S.model = null; S.modelShown = null; S.epdPick = {}; S.origins = {}; S.gfa = null; S.draft = null;
  S.program = 'office'; $('#programIn').value = 'office';
  S.op.asIs = Object.fromEntries(Object.entries(ENERGY.seagram.asIs).map(([k, v]) => [k, { system: v, passive: [], source: defaultSource(sysById(k, v)) }]));
  S.op.layers = structuredClone(S.op.asIs); S.op.measuredEUI = ENERGY.seagram.measuredEUI; S.op.measuredSplit = ENERGY.seagram.endUseSplit;
  setSite({ ...SEAGRAM_LL, countryCode: 'us', display: '375 Park Avenue, New York, NY 10152' }, 'Seagram Building');
  $('#addrIn').value = '375 Park Avenue, New York'; $('#addrIn2').value = '375 Park Avenue, New York';
  for (const n of ['A-101', 'A-111', 'A-301']) addVectorSheet(`seagram-${n}.svg`, await (await fetch(`./data/seagram-${n}.svg`)).text(), n);
  S.sel = 1; S.source = 'drawings';
  readAll(); setTab('model'); setStage('3d');
  await generate3D().catch(() => {});
  toast('Seagram Building: 3 sheets read by geometry, every material counted from its EPD.');
}

/* ------------------------------------------------------------------ method */
function renderMethod() {
  $('#view-method').innerHTML = `<h2>How it works</h2>
  <p>Lifecycle Takeoff does what an estimator, an LCA consultant and an energy modeller do in sequence: build the building from whatever you have, break it into components and materials, give every material a real environmental product declaration (EPD), count carbon through every EN 15978 module, model operation by system, then compare what to keep, rebuild or change.</p>
  <h3>1 · Model</h3>
  <p>Three ways in. <b>An address</b> is geocoded with OpenStreetMap Nominatim; the footprint and height tags come from the Overpass API and become a massing with every assumption listed. <b>A 3D model</b> (Rhino .3dm, OBJ, IFC, glTF/GLB, STL) is read mesh by mesh: declared quantities first, then IFC class and layer or material names, then geometry. <b>A set of architectural documents</b>: vector sheets (SVG, DXF) are read by geometry, scans and PDF pages by a vision model. Every mesh is tagged with its component and its material, so materials and systems can be listed, hidden and exploded one at a time; the ring charts colour each by its carbon intensity (A1–A3 per kg).</p>
  <h3>2 · Components</h3>
  <p>Quantities are measured from the massing and grouped by Uniformat II. Each component shows its GWP per kg, per base unit (linear, square, cubic, weight or each), for one typical element, and for the whole building, with the method colour-coded: <span class="k-q">measured</span>, <span class="k-f">factor</span>, <span class="k-r">result</span>. The pyramid view sorts components into tiers by order of magnitude, after CINARK's Material Pyramid. Building services are counted as equipment (lifts, chillers, air handlers, ducts, radiators, pipe, cable, luminaires) so each carries its own product EPD instead of an area proxy.</p>
  <h3>3 · Lifecycle</h3>
  <p>Every value comes from an EPD, module by module, converted to per kg using the mass the EPD states. A module an EPD does not declare stays ND and is not filled from a generic database unless you choose project scenarios. B4 is derived from each EPD's own modules over the study period. Module D is split by what the EPD says it covers: reuse, recycling or energy recovery. Each material links to its EPD PDF; rolling over a cell maps where that stage happens, and the A4 origin can be dragged to any plant.</p>
  <h3>4 · Operational</h3>
  <p>An end-use model in the manner of Zero Code and ZeroTool: the program's benchmark (EIA CBECS 2018) or a measured split gives each end use's load; passive measures cut the load; the chosen system's efficiency turns it into energy; the source (local utility via EPA eGRID2023, district steam, or an alternative supply with IPCC lifecycle factors) turns energy into carbon. Results run year by year, with an optionally decarbonising grid, drawn the way C.Scale shows whole-life trajectories. For New York, Local Law 97 coefficients and limits apply.</p>
  <h3>5 · Compare</h3>
  <p>Build scenarios from material choices for each system layer, a reuse strategy (adaptive reuse, deconstruct and rebuild, demolish and rebuild), an efficiency retrofit and fuel sources linked to the Operational tab. Save as many as you like and compare them side by side.</p>
  <h3>EPDs used</h3>
  <table><tr><th>Material</th><th>EPD</th><th>A1–A3</th></tr>${Object.entries(EPDS).map(([k, e]) => `<tr><td>${esc(MATERIALS[k]?.name || k)}</td><td>${e.pdfUrl ? `<a href="${esc(e.pdfUrl)}" target="_blank" rel="noopener">${esc(e.title)}</a>` : esc(e.title)}<br><span class="lt-dim" style="margin:0">${esc(e.manufacturer || '')} · ${esc(e.programOperator || '')} ${esc(e.regNo || '')} · ${esc(e.indicator || '')}</span></td><td>${isNum(e.per.A1A3) ? (e.perUnit ? `${n0(e.per.A1A3)} per unit` : `${e.per.A1A3.toFixed(3)} kg/kg`) : ''}</td></tr>`).join('')}</table>
  <h3>Test case: the Seagram Building</h3>
  <p>Mies van der Rohe's drawings are held in the <a href="${SOURCES.moma.url}" target="_blank" rel="noopener">MoMA Mies van der Rohe Archive</a> and are not republished here; the test reads three sheets reconstructed from published dimensions and checks the takeoff against documented quantities. Its systems are entered as built: district steam to perimeter radiators, a central electric chiller, constant-volume fans, steam-heated hot water.</p>
  <table>${SEAGRAM_FACTS.map((f) => `<tr><td>${esc(f.k)}</td><td>${esc(f.v)} <a href="${SOURCES[f.src].url}" target="_blank" rel="noopener">source</a></td></tr>`).join('')}</table>
  <h3>Limits</h3>
  <p>EPDs describe today's production, not 1950s steel or bronze, and use different GWP methods. Bronze is represented by the closest current copper-alloy EPD (brass bars). Some EPDs declare only A1–A3, so with EPD-only data later stages are understated. Equipment quantities use estimator rules of thumb. Passive savings are indicative. A screening tool for early decisions and existing-building questions, not a certified assessment.</p>`;
}

/* ------------------------------------------------------------------ wiring */
function wire() {
  $('#programIn').innerHTML = PROGRAMS.map((p) => `<option value="${p.k}">${esc(p.label)}</option>`).join('');
  $$('.lt-tabs button').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));
  $('#btnSeagram').addEventListener('click', loadSeagram); $('#btnSeagram2').addEventListener('click', loadSeagram);
  $('#fileIn').addEventListener('change', (e) => { handleFiles(e.target.files); e.target.value = ''; });
  $('#modelIn').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) { setTab('model'); setStage('3d'); readModelFile(f).catch(() => {}); } e.target.value = ''; });
  $('#btnAddr').addEventListener('click', () => findAddress($('#addrIn').value));
  $('#addrIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') findAddress($('#addrIn').value); });
  $('#btnAddr2').addEventListener('click', () => findAddress($('#addrIn2').value, { build: true }));
  $('#addrIn2').addEventListener('keydown', (e) => { if (e.key === 'Enter') findAddress($('#addrIn2').value, { build: true }); });
  $('#programIn').addEventListener('change', (e) => setProgram(e.target.value));
  $('#gfaIn').addEventListener('change', (e) => { const v = +e.target.value; S.gfa = v > 0 ? (S.area === 'ft2' ? v * SQFT : v) : null; compute(); });
  for (const id of ['rsp', 'calibrate', 'operational', 'fillIn']) $(`#${id}`).addEventListener('change', compute);
  $$('#areaSeg button').forEach((b) => b.addEventListener('click', () => { S.area = b.dataset.area; store.set('area', S.area); $$('#areaSeg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); renderAll(); }));
  $$('#gwpSeg button').forEach((b) => b.addEventListener('click', () => { S.gwp = b.dataset.gwp; store.set('gwp', S.gwp); $$('#gwpSeg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); renderAll(); }));
  $$('#areaSeg button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.area === S.area)));
  $$('#gwpSeg button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.gwp === S.gwp)));
  // model tab
  $$('[data-stage]').forEach((b) => b.addEventListener('click', () => setStage(b.dataset.stage)));
  $$('#mSub button').forEach((b) => b.addEventListener('click', () => { S.mt.sub = b.dataset.msub; S.mt.sel = null; $$('#mSub button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); renderModelSide(); apply3D(); }));
  $$('#mBasis button').forEach((b) => b.addEventListener('click', () => { S.mt.basis = b.dataset.basis; $$('#mBasis button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); renderModelSide(); }));
  $('#mHead').addEventListener('click', (e) => { const k = e.target.closest('[data-msort]')?.dataset.msort; if (!k) return; if (S.mt.sort === k) S.mt.dir *= -1; else { S.mt.sort = k; S.mt.dir = k === 'name' ? 1 : -1; } renderModelSide(); });
  $('#mList').addEventListener('click', (e) => {
    const eye = e.target.closest('[data-eye]'), xp = e.target.closest('[data-xpl]');
    if (eye) { const k = eye.dataset.eye; if (S.mt.hidden.has(k)) S.mt.hidden.delete(k); else S.mt.hidden.add(k); S.viewer?.setHidden([...S.mt.hidden]); renderModelSide(); return; }
    if (xp) { const k = xp.dataset.xpl; const on = !S.mt.exploded.has(k); if (on) S.mt.exploded.add(k); else S.mt.exploded.delete(k); S.viewer?.explodeMaterial(k, on ? 1 : 0); renderModelSide(); return; }
    const row = e.target.closest('[data-mid]'); if (row) selectItem(row.dataset.mid, row.dataset.field);
  });
  $('#mRing').addEventListener('click', (e) => { const p = e.target.closest('[data-id]'); if (p) selectItem(p.dataset.id, S.mt.sub === 'materials' ? 'mat' : 'group'); });
  $('#realistic').addEventListener('change', (e) => { S.mt.realistic = e.target.checked; apply3D(); });
  $('#explode').addEventListener('input', (e) => S.viewer?.explode(+e.target.value));
  $('#cut').addEventListener('input', (e) => { const bb = S.viewer?.bounds(); if (bb) S.viewer.cut(bb.min.y + (bb.max.y - bb.min.y) * +e.target.value + (+e.target.value >= 1 ? 1e4 : 0)); });
  $('#btnRoundtrip').addEventListener('click', () => roundtrip().catch((e) => toast(esc(e.message))));
  $('#sheetStrip').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) { S.sel = +b.dataset.i; renderRead(); } });
  $('[data-ov]').addEventListener('click', (e) => { const b = e.currentTarget; b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); renderRead(); });
  $('#btnAI').addEventListener('click', () => { const s = S.sheets[S.sel]; if (s) aiRead(s); });
  $('#provTable').addEventListener('change', (e) => {
    const i = e.target.dataset.f; if (i === undefined || !S.building) return;
    const f = FIELDS[+i]; f.set(S.building, f.type === 'number' ? +e.target.value : e.target.value);
    const p = S.prov.find((q) => q.k === f.k) || S.prov.find((q) => f.k.startsWith(q.k)); if (p) p.edited = true; else S.prov.push({ k: f.k, v: e.target.value, src: 'edited', edited: true });
    S.modelShown = null; S.gfa = null; compute(); generate3D().catch(() => {});
  });
  // components
  $$('#cView button').forEach((b) => b.addEventListener('click', () => { S.comp.view = b.dataset.cview; renderComponents(); }));
  $$('#cSort button').forEach((b) => b.addEventListener('click', () => { S.comp.sort = b.dataset.csort; renderComponents(); }));
  $('#cFilter').addEventListener('click', (e) => { const b = e.target.closest('[data-cf]'); if (b) { S.comp.filter = b.dataset.cf || null; renderComponents(); } });
  const pickComp = (e) => { const t = e.target.closest('[data-c]'); if (t) { S.comp.sel = t.dataset.c; S.comp.openMat = null; renderComponents(); } };
  $('#compPyr').addEventListener('click', pickComp); $('#compTable').addEventListener('click', pickComp);
  $('#compDetail').addEventListener('click', (e) => { if (e.target.closest('a')) return; const n = e.target.closest('[data-nm]'); if (n) { S.comp.openMat = S.comp.openMat === n.dataset.nm ? null : n.dataset.nm; renderCompDetail(); } });
  // lifecycle
  $$('#lcRows button').forEach((b) => b.addEventListener('click', () => { S.lc.rows = b.dataset.lcrows; renderLifecycle(); }));
  $('#lcTable').addEventListener('click', (e) => { if (e.target.closest('a,select,label')) return; const tr = e.target.closest('tr[data-m]'); if (tr) { S.lc.open = S.lc.open === tr.dataset.m ? null : tr.dataset.m; renderLifecycle(); showMap(tr.dataset.m, 'A1'); } });
  $('#lcTable').addEventListener('change', (e) => { const k = e.target.dataset.epdpick; if (k) { S.epdPick[k] = +e.target.value; compute(); } });
  $('#lcTable').addEventListener('mouseover', (e) => {
    const th = e.target.closest('th[data-info]'); if (th) { const [h, b] = th.dataset.info.split('|'); showTip(th, `<b>${esc(h)}</b>${esc(b)}`); return; }
    const td = e.target.closest('td[data-k]'), tr = e.target.closest('tr[data-m]');
    if (td && tr) { const key = `${tr.dataset.m}|${td.dataset.k}`; if (S.lc.hover !== key) { S.lc.hover = key; showMap(tr.dataset.m, td.dataset.k); } }
    const pf = e.target.closest('.lt-proc[data-pm]'), er = e.target.closest('tr.exp')?.previousElementSibling;
    if (pf && er?.dataset.m) showMap(er.dataset.m, pf.dataset.pm.split(/[,–-]/)[0]);
  });
  $('#lcTable').addEventListener('mouseout', (e) => { if (e.target.closest('th[data-info]')) hideTip(); });
  // operational
  $('#view-operational').addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.sys) { const k = t.dataset.sys, s = sysById(k, t.value); const L = S.op.layers[k] || {}; S.op.layers[k] = { ...L, system: t.value, source: sourcesFor(s.fuel, opCfg().loc).some((x) => x.id === L.source) ? L.source : defaultSource(s) }; compute(); }
    else if (t.dataset.src) { S.op.layers[t.dataset.src].source = t.value; compute(); }
    else if (t.id === 'gridIn') { S.op.grid = t.value; compute(); }
    else if (t.id === 'zeroIn') { S.op.zeroYear = +t.value || 2040; compute(); }
    else if (t.id === 'll97In') { S.op.useLL97 = t.checked; compute(); }
    else if (t.id === 'euiIn') { const v = parseFloat(t.value); S.op.measuredEUI = v > 0 ? v : null; S.op.measuredSplit = null; S.op.asIs ||= structuredClone(S.op.layers); compute(); }
  });
  $('#view-operational').addEventListener('click', (e) => { const b = e.target.closest('[data-pas]'); if (!b) return; const [k, id] = b.dataset.pas.split('|'); const L = S.op.layers[k]; L.passive = (L.passive || []).includes(id) ? L.passive.filter((x) => x !== id) : [...(L.passive || []), id]; compute(); });
  // compare
  $('#builder').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ch]');
    if (b && !b.disabled) {
      const k = b.dataset.ch; S.draft[k] = b.dataset.v;
      if (k === 'reuse' && b.dataset.v !== 'adaptive') for (const l of Object.keys(LAYER_CHOICES)) if (S.draft[l] === 'existing') S.draft[l] = l === 'structure' ? 'steel' : l === 'floors' ? 'concrete' : l === 'envelope' ? 'aluminium-cw' : 'standard';
      renderCompare(); return;
    }
    if (e.target.closest('#btnSave')) saveScenario();
  });
  $('#compareChart').addEventListener('click', (e) => {
    const d = e.target.closest('[data-del]'), l = e.target.closest('[data-load]');
    if (d) { S.scenarios.splice(+d.dataset.del, 1); store.set('scenarios', S.scenarios); renderCompare(); }
    if (l) { S.draft = { ...S.scenarios[+l.dataset.load].choice }; renderCompare(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });
  // export
  const menu = $('#exportMenu');
  $('#btnExport').addEventListener('click', () => { menu.hidden = !menu.hidden; $('#btnExport').setAttribute('aria-expanded', String(!menu.hidden)); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.lt-menu-wrap')) menu.hidden = true; });
  menu.addEventListener('click', async (e) => {
    const k = e.target.closest('[data-export]')?.dataset.export; if (!k) return; menu.hidden = true;
    if (!S.R) return toast('Nothing to export yet.');
    const base = (S.R.building || 'takeoff').replace(/\W+/g, '-').toLowerCase();
    if (k === 'csv') download(`${base}-lifecycle.csv`, new Blob([toCSV(S.R)], { type: 'text/csv' }));
    if (k === 'json') download(`${base}-takeoff.json`, new Blob([JSON.stringify({ building: S.building, provenance: S.prov, site: S.site && { lat: S.site.lat, lon: S.site.lon, name: S.site.name, utility: S.site.loc?.utility }, settings: { rsp: rsp(), calibrate: $('#calibrate').checked, fill: fill(), epdPick: S.epdPick, origins: S.origins, operational: S.op }, epds: Object.fromEntries(Object.entries(epdSet()).map(([key, x]) => [key, { title: x.title, regNo: x.regNo, pdfUrl: x.pdfUrl }])), result: { ...S.R, rows: S.R.rows.map(({ mods, st, id, code, group, name, qty, mass, method, embodied }) => ({ id, code, group, name, qty, mass, method, mods, st, embodied })), materials: S.R.materials.map(({ key, kg, mods, st }) => ({ key, kg, mods, st })) } }, null, 2)], { type: 'application/json' }));
    if (k === 'glb' || k === 'png') { setTab('model'); setStage('3d'); if (!S.modelShown) await generate3D(); if (k === 'glb') download(`${base}.glb`, await S.viewer.exportGLB()); else { const a = document.createElement('a'); a.href = S.viewer.snapshot(); a.download = `${base}-3d.png`; a.click(); } }
  });
  renderMethod();
}
function showTip(el, html) { const t = $('#tip'); t.innerHTML = html; t.hidden = false; const r = el.getBoundingClientRect(); t.style.left = `${Math.min(window.innerWidth - 300, Math.max(8, r.left))}px`; t.style.top = `${r.bottom + 6}px`; }
function hideTip() { $('#tip').hidden = true; }

wire();
renderAll();
if (/[?&]test=seagram\b/.test(location.search)) loadSeagram();
window.__lt = { S, loadSeagram, roundtrip, generate3D, readModelFile, compute, findAddress, setTab };
