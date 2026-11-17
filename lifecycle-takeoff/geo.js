// Lifecycle Takeoff · address → building. Geocodes an address with OpenStreetMap Nominatim, fetches the building footprint and
// height tags from the Overpass API, and turns them into a massing the takeoff can count. Known test buildings are recognised.
export const SEAGRAM_LL = { lat: 40.75836, lon: -73.97213 };
const R = 6371008.8;
export function haversineKm(a, b) {
  const t = Math.PI / 180, dLat = (b.lat - a.lat) * t, dLon = (b.lon - a.lon) * t;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) / 1000;
}
export const isSeagram = (p) => p && haversineKm(p, SEAGRAM_LL) < 0.12;

export async function geocode(q) {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(q)}`, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`geocoder HTTP ${r.status}`);
  const [hit] = await r.json();
  if (!hit) throw new Error('address not found');
  const a = hit.address || {};
  return { lat: +hit.lat, lon: +hit.lon, display: hit.display_name, countryCode: (a.country_code || '').toLowerCase(), city: a.city || a.town || a.village || a.county || '', state: a.state || '' };
}

// Building footprint and tags at a point
export async function footprint(lat, lon) {
  const q = `[out:json][timeout:25];(way(around:40,${lat},${lon})["building"];relation(around:40,${lat},${lon})["building"];);out geom tags;`;
  let j = null, err = null;
  for (const host of ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
    try {
      const r = await fetch(host, { method: 'POST', body: `data=${encodeURIComponent(q)}`, headers: { 'content-type': 'application/x-www-form-urlencoded' } });
      if (!r.ok) throw new Error(`footprint service HTTP ${r.status}`);
      j = await r.json(); break;
    } catch (e) { err = e; }
  }
  if (!j) throw err || new Error('footprint service unavailable');
  const polys = [];
  for (const e of j.elements || []) {
    const g = e.geometry || e.members?.find((m) => m.role === 'outer')?.geometry;
    if (g?.length > 2) polys.push({ pts: g.map((p) => ({ lat: p.lat, lon: p.lon })), tags: e.tags || {} });
  }
  if (!polys.length) throw new Error('no building footprint mapped here');
  const pt = { lat, lon };
  const inside = polys.find((p) => contains(p.pts, pt));
  return inside || polys.sort((a, b) => dist(a.pts, pt) - dist(b.pts, pt))[0];
}
function contains(pts, p) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) if ((pts[i].lat > p.lat) !== (pts[j].lat > p.lat) && p.lon < (pts[j].lon - pts[i].lon) * (p.lat - pts[i].lat) / (pts[j].lat - pts[i].lat) + pts[i].lon) c = !c;
  return c;
}
const dist = (pts, p) => Math.min(...pts.map((q) => haversineKm(q, p)));

// Footprint polygon → local metres, area and the minimum-area bounding rectangle (its proportions set the block's w × d)
export function measure(pts) {
  const o = pts[0], k = Math.cos(o.lat * Math.PI / 180);
  const xy = pts.map((p) => [(p.lon - o.lon) * k * Math.PI / 180 * R, (p.lat - o.lat) * Math.PI / 180 * R]);
  let area = 0;
  for (let i = 0; i < xy.length; i++) { const [x1, y1] = xy[i], [x2, y2] = xy[(i + 1) % xy.length]; area += x1 * y2 - x2 * y1; }
  area = Math.abs(area) / 2;
  let best = null;
  for (let i = 0; i < xy.length - 1; i++) {
    const a = Math.atan2(xy[i + 1][1] - xy[i][1], xy[i + 1][0] - xy[i][0]), c = Math.cos(-a), s = Math.sin(-a);
    const rx = xy.map(([x, y]) => x * c - y * s), ry = xy.map(([x, y]) => x * s + y * c);
    const w = Math.max(...rx) - Math.min(...rx), d = Math.max(...ry) - Math.min(...ry);
    if (!best || w * d < best.w * best.d) best = { w, d, angle: a };
  }
  return { area, w: best.w, d: best.d, angle: best.angle, perimeter: xy.reduce((s, p, i) => s + Math.hypot(xy[(i + 1) % xy.length][0] - p[0], xy[(i + 1) % xy.length][1] - p[1]), 0) };
}

// A massing the takeoff can count, from a footprint and its OpenStreetMap tags, with every assumption listed
export function buildingFromFootprint(fp, place) {
  const t = fp.tags || {};
  const m = measure(fp.pts);
  const levels = +t['building:levels'] || (t.height ? Math.max(1, Math.round(parseFloat(t.height) / 3.8)) : 0) || 4;
  const height = parseFloat(t.height) || levels * 3.8;
  const f2f = Math.min(5, Math.max(2.8, height / levels));
  const fill = m.area / (m.w * m.d);
  const w = m.w * Math.sqrt(fill), d = m.d * Math.sqrt(fill);
  const under = +t['building:levels:underground'] || (levels > 20 ? 2 : levels > 8 ? 1 : 0);
  const year = parseInt(t.start_date || t['building:start_date'] || '', 10) || null;
  const steel = levels > 6;
  const prov = [
    { k: 'Footprint', v: `${Math.round(m.area).toLocaleString('en-US')} m² (${w.toFixed(1)} × ${d.toFixed(1)} m equivalent rectangle)`, src: 'OpenStreetMap building outline' },
    { k: 'Tower levels', v: String(levels), src: t['building:levels'] ? 'OSM building:levels' : t.height ? 'OSM height ÷ 3.8 m' : 'default', assumed: !t['building:levels'] && !t.height },
    { k: 'Floor-to-floor', v: `${f2f.toFixed(2)} m`, src: t.height ? 'OSM height ÷ levels' : 'default', assumed: !t.height },
    { k: 'Basement', v: `${under} levels`, src: t['building:levels:underground'] ? 'OSM building:levels:underground' : 'assumed from height', assumed: !t['building:levels:underground'] },
    { k: 'Structure', v: steel ? 'steel frame' : 'concrete frame', src: 'assumed from height', assumed: true },
    { k: 'Facade', v: 'aluminium curtain wall', src: 'assumed', assumed: true },
    { k: 'Era', v: year ? String(year) : 'unknown', src: year ? 'OSM start_date' : 'not mapped', assumed: !year }
  ];
  const B = {
    id: 'osm', name: t.name || place?.display?.split(',')[0] || 'Building from address', address: place?.display || '', use: 'office', rsp: 60,
    era: year && year < 1970 ? 'pre1970' : 'modern', existing: true, location: place,
    blocks: [{ id: 'tower', name: 'Main block', kind: 'tower', x: 0, y: 0, w, d, z0: 0, levels, f2f, baysX: Math.max(1, Math.round(w / 9)), baysY: Math.max(1, Math.round(d / 9)) }],
    cores: levels > 6 ? [{ id: 'core1', name: 'Central core', blockId: 'tower', x: w / 2 - Math.min(w, d) * 0.15, y: d / 2 - Math.min(w, d) * 0.2, w: Math.min(w, d) * 0.3, d: Math.min(w, d) * 0.4, t: 0.3 }] : [],
    basement: under ? { levels: under, f2f: 3.5, x: 0, y: 0, w, d } : null,
    structure: steel ? { frame: 'steel', slab: 'deck', slabThk: 0.12, encasement: false, steel: 'steel-section', concrete: 'concrete' } : { frame: 'concrete', slab: 'flat-plate', slabThk: 0.25, steel: 'steel-section', concrete: 'concrete' },
    facade: { system: 'aluminium-cw', secondary: [] }, interiors: { partitions: 0.3, finishes: [] }, services: { lifts: Math.max(levels > 4 ? 2 : 0, Math.round(m.area * levels / 4500)) },
    site: { paving: [], pools: [] }, footprint: fp.pts, angle: m.angle
  };
  prov.push({ k: 'Lifts', v: String(B.services.lifts), src: 'assumed: one per 4,500 m²', assumed: true });
  return { building: B, provenance: prov };
}
