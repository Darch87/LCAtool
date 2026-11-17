// Lifecycle Takeoff · small SVG charts and the world map. No libraries: ring charts, stacked areas and bars as strings, and a
// world map drawn from Natural Earth (world-atlas) with process locations, transport routes and a draggable supply origin.
import { haversineKm } from './geo.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ carbon-intensity colour */
// Log scale across building materials, kgCO2e per kg (A1–A3): stone and concrete low, metals high
const STOPS = [[0.02, [27, 77, 92]], [0.15, [0, 181, 226]], [1, [255, 31, 139]], [8, [255, 214, 0]]];
export function intensityColor(v) {
  if (!(v > 0)) return '#3a3a38';
  const x = Math.log10(Math.max(STOPS[0][0], Math.min(STOPS[STOPS.length - 1][0], v)));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = Math.log10(STOPS[i][0]), b = Math.log10(STOPS[i + 1][0]);
    if (x <= b) { const t = (x - a) / (b - a), c = STOPS[i][1].map((p, j) => Math.round(p + (STOPS[i + 1][1][j] - p) * t)); return `rgb(${c.join(',')})`; }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`;
}
export const intensityLegend = () => `<div class="lt-ramp"><i style="background:linear-gradient(90deg,${[0.02, 0.06, 0.15, 0.4, 1, 3, 8].map(intensityColor).join(',')})"></i><span>0.02</span><span>0.15</span><span>1</span><span>8 kgCO2e/kg</span></div>`;

/* ------------------------------------------------------------------ ring chart */
export function ring(segs, { size = 180, width = 26, center = '', sub = '', active = null } = {}) {
  const tot = segs.reduce((s, x) => s + Math.max(0, x.value), 0) || 1;
  const r = size / 2 - 4, ri = r - width, cx = size / 2, cy = size / 2;
  let a0 = -Math.PI / 2;
  const paths = segs.filter((s) => s.value > 0).map((s) => {
    const a1 = a0 + (s.value / tot) * Math.PI * 2 - (segs.length > 1 ? 0.012 : 0);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (rr, a) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
    const d = a1 - a0 >= Math.PI * 2 - 0.02 ? `M ${p(r, a0)} A ${r} ${r} 0 1 1 ${p(r, a0 + Math.PI)} A ${r} ${r} 0 1 1 ${p(r, a0)} M ${p(ri, a0)} A ${ri} ${ri} 0 1 0 ${p(ri, a0 + Math.PI)} A ${ri} ${ri} 0 1 0 ${p(ri, a0)} Z` : `M ${p(r, a0)} A ${r} ${r} 0 ${large} 1 ${p(r, a1)} L ${p(ri, a1)} A ${ri} ${ri} 0 ${large} 0 ${p(ri, a0)} Z`;
    const out = `<path d="${d}" fill="${s.color}" data-id="${esc(s.id)}" class="${active && active !== s.id ? 'dim' : ''}"><title>${esc(s.label)}: ${((s.value / tot) * 100).toFixed(1)}%</title></path>`;
    a0 = a1 + (segs.length > 1 ? 0.012 : 0);
    return out;
  });
  return `<svg class="lt-ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${esc(center)} ${esc(sub)}">${paths.join('')}<text x="${cx}" y="${cy - 2}" text-anchor="middle" class="c1">${esc(center)}</text><text x="${cx}" y="${cy + 14}" text-anchor="middle" class="c2">${esc(sub)}</text></svg>`;
}

/* ------------------------------------------------------------------ stacked area over years */
export function stackedArea(years, series, { w = 640, h = 220, limit = null, fmtY = (v) => v, label = '' } = {}) {
  const n = years.length; if (!n) return '';
  const pad = { l: 44, r: 10, t: 10, b: 22 };
  const tot = years.map((_, i) => series.reduce((s, x) => s + Math.max(0, x.values[i]), 0));
  const max = Math.max(...tot, ...(limit ? limit.map((l) => l.v) : []), 1) * 1.08;
  const X = (i) => pad.l + (i / Math.max(1, n - 1)) * (w - pad.l - pad.r), Y = (v) => h - pad.b - (v / max) * (h - pad.t - pad.b);
  const acc = years.map(() => 0);
  const layers = series.map((s) => {
    const lo = acc.slice();
    s.values.forEach((v, i) => { acc[i] += Math.max(0, v); });
    const top = acc.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`), bot = lo.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).reverse();
    return `<polygon points="${top.join(' ')} ${bot.join(' ')}" fill="${s.color}" opacity=".9"><title>${esc(s.label)}</title></polygon>`;
  });
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => `<line x1="${pad.l}" x2="${w - pad.r}" y1="${Y(max * f / 1.08)}" y2="${Y(max * f / 1.08)}" class="grid"/><text x="${pad.l - 6}" y="${Y(max * f / 1.08) + 3}" text-anchor="end" class="ax">${esc(fmtY(max * f / 1.08))}</text>`);
  const xt = years.map((y, i) => (i % Math.ceil(n / 8) === 0 || i === n - 1 ? `<text x="${X(i)}" y="${h - 6}" text-anchor="middle" class="ax">${y}</text>` : '')).join('');
  const lim = limit ? `<polyline points="${limit.map((l) => `${X(years.indexOf(l.year) < 0 ? 0 : years.indexOf(l.year)).toFixed(1)},${Y(l.v).toFixed(1)}`).join(' ')}" class="limit"/>` : '';
  return `<svg class="lt-area" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${esc(label)}">${ticks.join('')}${layers.join('')}${lim}${xt}</svg>`;
}

/* ------------------------------------------------------------------ world map */
let WORLD = null;
async function world() {
  if (WORLD) return WORLD;
  const [topo, tc] = await Promise.all([fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then((r) => r.json()), import('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm')]);
  const fc = tc.feature(topo, topo.objects.countries);
  const paths = [];
  for (const f of fc.features) {
    const polys = f.geometry?.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry?.coordinates || [];
    for (const poly of polys) for (const ring of poly) {
      let d = '', prev = null;
      for (const [lon, lat] of ring) { const [x, y] = proj(lat, lon); d += `${!prev || Math.abs(prev - lon) > 180 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`; prev = lon; }
      paths.push(d);
    }
  }
  WORLD = `<path class="land" d="${paths.join('')}"/>`;
  return WORLD;
}
const LAT_TOP = 78, LAT_BOT = -58;
export const proj = (lat, lon) => [lon + 180, LAT_TOP - lat];
const unproj = (x, y) => ({ lat: LAT_TOP - y, lon: x - 180 });
export const VB = `0 0 360 ${LAT_TOP - LAT_BOT}`;

// The transport mode a route implies: ocean crossings by ship, long land legs by rail, the rest by truck; road distance ≈ 1.25 × great circle
export function routeFor(from, to) {
  const gc = haversineKm(from, to);
  const sameLandmass = Math.abs(from.lon - to.lon) < 50 && Math.sign(from.lon + 30) === Math.sign(to.lon + 30);
  if (!sameLandmass) return { km: gc * 1.15, legs: [{ mode: 'ship', km: gc * 1.05 }, { mode: 'truck', km: gc * 0.1 }], mode: 'ship', gc };
  if (gc > 900) return { km: gc * 1.2, legs: [{ mode: 'rail', km: gc * 1.1 }, { mode: 'truck', km: gc * 0.1 }], mode: 'rail', gc };
  return { km: gc * 1.25, legs: [{ mode: 'truck', km: gc * 1.25 }], mode: 'truck', gc };
}

export function createMap(el, { onOrigin } = {}) {
  el.innerHTML = `<svg viewBox="${VB}" class="lt-world" role="img" aria-label="World map of process locations"><g class="w"></g><g class="routes"></g><g class="pts"></g><g class="site"></g></svg><div class="lt-maptip" hidden></div>`;
  const svg = el.querySelector('svg'), tip = el.querySelector('.lt-maptip');
  world().then((w) => { svg.querySelector('.w').innerHTML = w; }).catch(() => { svg.querySelector('.w').innerHTML = '<text x="180" y="70" text-anchor="middle" class="ax">Map could not load</text>'; });
  let site = null, state = null, drag = null;
  const pt = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  function draw() {
    const pts = svg.querySelector('.pts'), routes = svg.querySelector('.routes'), s = svg.querySelector('.site');
    s.innerHTML = site ? (() => { const [x, y] = proj(site.lat, site.lon); return `<circle cx="${x}" cy="${y}" r="2.6" class="sitept"/><text x="${x + 3.5}" y="${y - 2.5}" class="lbl">${esc(site.name || 'Site')}</text>`; })() : '';
    if (!state) { pts.innerHTML = ''; routes.innerHTML = ''; return; }
    pts.innerHTML = (state.points || []).map((p, i) => { const [x, y] = proj(p.lat, p.lon); return `<circle cx="${x}" cy="${y}" r="${p.origin ? 2.4 : 1.7}" class="pt ${p.role || ''}${p.origin ? ' origin' : ''}" data-i="${i}"><title>${esc(p.name)}${p.role ? ` · ${esc(p.role)}` : ''}</title></circle>`; }).join('')
      + (state.origin ? (() => { const [x, y] = proj(state.origin.lat, state.origin.lon); return `<g class="drag" transform="translate(${x} ${y})"><circle r="4.2" class="halo"/><circle r="2.4" class="dot"/></g><text x="${x + 5}" y="${y + 1}" class="lbl">${esc(state.origin.name || 'Supply origin')} · drag</text>`; })() : '');
    routes.innerHTML = site && state.origin && state.transport ? (() => {
      const [x1, y1] = proj(state.origin.lat, state.origin.lon), [x2, y2] = proj(site.lat, site.lon);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.min(30, Math.hypot(x2 - x1, y2 - y1) * 0.25);
      return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" class="route ${state.mode || ''}"/><path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" class="route-flow"/>`;
    })() : '';
  }
  svg.addEventListener('pointerdown', (e) => { if (!e.target.closest('.drag')) return; drag = true; svg.setPointerCapture(e.pointerId); e.preventDefault(); });
  svg.addEventListener('pointermove', (e) => {
    if (!drag || !state?.origin) return;
    const p = pt(e); let o = unproj(p.x, p.y); let name = 'Custom origin';
    const near = (state.candidates || []).map((c) => ({ c, d: Math.hypot(proj(c.lat, c.lon)[0] - p.x, proj(c.lat, c.lon)[1] - p.y) })).sort((a, b) => a.d - b.d)[0];
    if (near && near.d < 4) { o = { lat: near.c.lat, lon: near.c.lon }; name = near.c.name; }
    state.origin = { ...o, name }; draw();
    const r = site ? routeFor(state.origin, site) : null; tip.hidden = false; tip.textContent = r ? `${name}: ${Math.round(r.km).toLocaleString('en-US')} km by ${r.mode}` : name;
  });
  svg.addEventListener('pointerup', () => { if (!drag) return; drag = false; tip.hidden = true; onOrigin?.(state.key, state.origin); });
  return {
    setSite(s) { site = s; draw(); },
    show(s) { state = s; draw(); },
    clear() { state = null; draw(); }
  };
}
