// Sun & Wind Lab — site model.
// Grid frame: u = east along the cross streets (toward Lexington), v = north along the avenues (uptown), z = up. Metres.
// Origin: the corner of Park Avenue's east curb and 52nd Street's north curb (south-west corner of the Seagram lot).
// Manhattan's street grid is turned 29° clockwise from true north, so "grid north" (uptown) points to true azimuth 29°.

export const GRID_ROT_DEG = 29;
export const SITE = {
  name: 'Seagram Building',
  address: '375 Park Avenue, New York',
  lat: 40.7584,
  lon: -73.9721,
  tz: 'America/New_York',
  architects: 'Ludwig Mies van der Rohe with Philip Johnson, 1958',
};

const FT = 0.3048;
const ft = (x) => +(x * FT).toFixed(2);

// Street widths and block edges (standard Manhattan dimensions; Park Avenue 140 ft, side streets 60 ft, Lexington 75 ft).
export const STREETS = {
  parkW: ft(140), // Park Avenue, west of u = 0
  street: ft(60),
  lexW: ft(75),
  lexU: ft(405), // Lexington west curb: the Park–Lexington block is about 405 ft deep
  blockV: ft(200), // street to street
};
const S = STREETS;
const v53 = S.blockV; // 53rd Street south curb
const v53n = v53 + S.street; // 53rd Street north curb
const v54 = v53n + S.blockV; // 54th Street south curb
const v52s = -S.street; // 52nd Street south curb
const v51 = v52s - S.blockV; // 51st Street north curb
const uLex = S.lexU, uLexE = S.lexU + S.lexW;
const uParkW = -S.parkW; // Park Avenue west curb

// Each box: u0,u1,v0,v1 (plan), z0,z1 (height). The Seagram masses follow the city's surveyed footprint for plan
// (slab 27 × 43 m behind a 90 ft plaza, a central bustle, wings on both streets with light courts between them and
// the slab) and the published section for height: the slab rises 516 ft (157 m), the bustle ten storeys, the wings five.
export const SEAGRAM = [
  { id: 'slab', name: 'Seagram tower slab', u0: ft(90), u1: 54.5, v0: 9.0, v1: 52.0, z0: 0, z1: ft(516), glass: true, floors: 38 },
  { id: 'bustle', name: 'Seagram bustle (10 storeys)', u0: 54.5, u1: 88.0, v0: 17.5, v1: 43.5, z0: 0, z1: 42, glass: true, floors: 10 },
  { id: 'wingS', name: 'Seagram 52nd St wing (5 storeys)', u0: 62.5, u1: 88.0, v0: 0, v1: 17.5, z0: 0, z1: 23, glass: true, floors: 5 },
  { id: 'wingN', name: 'Seagram 53rd St wing (5 storeys)', u0: 62.5, u1: 88.0, v0: 43.5, v1: 61.0, z0: 0, z1: 23, glass: true, floors: 5 },
];

// Surveyed context: NYC Open Data building footprints with roof heights (see scripts/build-sun-wind-context.mjs),
// already in grid-frame boxes. Pass the parsed data/context.json to buildings({ ctx }).
export function contextBoxes(json) {
  const out = [];
  for (const b of json.buildings) {
    const label = b.name || `Building${b.year ? `, ${b.year}` : ''}`;
    b.boxes.forEach(([u0, v0, u1, v1, z0, z1], k) => out.push({ id: `bin${b.bin}-${k}`, bin: b.bin, name: `${label} (${Math.round(b.h)} m)`, named: !!b.name, u0, v0, u1, v1, z0, z1 }));
  }
  return out;
}

// Model grid → latitude / longitude, from the georeferenced origin in context.json.
export function gridToLatLon(u, v, origin) {
  const R = 6378137, a = GRID_ROT_DEG * Math.PI / 180;
  const e = u * Math.cos(a) + v * Math.sin(a), n = -u * Math.sin(a) + v * Math.cos(a);
  return { lat: origin.lat + n / (R * Math.PI / 180), lon: origin.lon + e / (Math.cos(origin.lat * Math.PI / 180) * R * Math.PI / 180) };
}

// Fallback neighbours as simplified massing (used only if the surveyed context is missing).
export const CONTEXT = [
  { id: 'e53', name: '100 East 53rd St (Foster, 217 m)', u0: ft(305), u1: ft(395), v0: ft(95), v1: ft(195), z0: 0, z1: 217 },
  { id: 'p345', name: '345 Park Avenue (193 m)', u0: 4, u1: uLex - 4, v0: v51 + 14, v1: v52s - 12, z0: 0, z1: 193 },
  { id: 'p345b', name: '345 Park Avenue base', u0: 0, u1: uLex, v0: v51, v1: v52s, z0: 0, z1: 30 },
  { id: 'p399', name: '399 Park Avenue (162 m)', u0: 6, u1: uLex - 22, v0: v53n + 8, v1: v54 - 8, z0: 0, z1: 162 },
  { id: 'p399b', name: '399 Park Avenue base', u0: 0, u1: uLex, v0: v53n, v1: v54, z0: 0, z1: 26 },
  // Lever House: two-storey podium over a plaza, slab on the northern quarter, short side to Park Avenue, set back 40 ft from 54th St.
  { id: 'leverP', name: 'Lever House podium', u0: uParkW - ft(192), u1: uParkW, v0: v53n, v1: v54, z0: 4.5, z1: 9.5 },
  { id: 'lever', name: 'Lever House (94 m)', u0: uParkW - ft(180), u1: uParkW, v0: v54 - ft(40) - ft(53), v1: v54 - ft(40), z0: 0, z1: 94 },
  { id: 'racquet', name: 'Racquet and Tennis Club', u0: uParkW - 46, u1: uParkW, v0: 0, v1: v53, z0: 0, z1: 30 },
  { id: 'pap', name: 'Park Avenue Plaza (174 m)', u0: uParkW - 112, u1: uParkW - 58, v0: 6, v1: v53 - 4, z0: 0, z1: 174 },
  { id: 'lex599', name: '599 Lexington Avenue (199 m)', u0: uLexE + 4, u1: uLexE + 50, v0: 6, v1: v53 - 6, z0: 0, z1: 199 },
  // Citigroup Center stands on four columns: the tower starts about 35 m up, which matters for wind at street level.
  { id: 'citi', name: 'Citigroup Center (279 m, on stilts)', u0: uLexE + 6, u1: uLexE + 6 + ft(157), v0: v53n + 6, v1: v53n + 6 + ft(157), z0: 35, z1: 279 },
  { id: 'citiCore', name: 'Citigroup Center core', u0: uLexE + 6 + 18, u1: uLexE + 6 + 30, v0: v53n + 6 + 18, v1: v53n + 6 + 30, z0: 0, z1: 35 },
  { id: 'stpeter', name: "St. Peter's Church", u0: uLexE + 6, u1: uLexE + 30, v0: v53n + 2, v1: v53n + 26, z0: 0, z1: 14 },
];

export const PLAZA = { u0: 0, u1: ft(90), v0: 0, v1: ft(200), z: 0.9, pools: [
  { u0: ft(4), u1: ft(4 + 70), v0: ft(8), v1: ft(8 + 46) },
  { u0: ft(4), u1: ft(4 + 70), v0: ft(200 - 8 - 46), v1: ft(200 - 8) },
] };

export const TOWER_CENTER = { u: 41.0, v: 30.5 };

// Labelled zones the insights talk about.
export const ZONES = [
  { id: 'plaza', name: 'Park Avenue plaza', u0: 1, u1: ft(88), v0: 1, v1: ft(199) },
  { id: 'cornerSW', name: 'Park Ave & 52nd St corner', u0: -8, u1: 14, v0: -12, v1: 10 },
  { id: 'cornerNW', name: 'Park Ave & 53rd St corner', u0: -8, u1: 14, v0: v53 - 10, v1: v53 + 12 },
  { id: 'st52', name: '52nd Street sidewalk', u0: ft(90), u1: ft(300), v0: v52s + 2, v1: -0.5 },
  { id: 'st53', name: '53rd Street sidewalk', u0: ft(90), u1: ft(300), v0: v53 + 0.5, v1: v53n - 2 },
  { id: 'parkAve', name: 'Park Avenue east sidewalk', u0: -6, u1: -0.5, v0: 0, v1: v53 },
];

export function buildings({ context = true, towerHeight = null, canopy = false, ctx = null } = {}) {
  const out = SEAGRAM.map((b) => ({ ...b, kind: 'seagram' }));
  if (towerHeight) { const slab = out.find((b) => b.id === 'slab'); slab.z1 = towerHeight; }
  // An optional wind canopy over the Park Avenue edge of the plaza: a what-if, not part of the building.
  if (canopy) out.push({ id: 'canopy', name: 'Plaza canopy (what-if)', u0: 2.5, u1: 26, v0: 6, v1: 55, z0: 7, z1: 8.2, kind: 'seagram', whatif: true });
  if (context) for (const b of (ctx || CONTEXT)) out.push({ ...b, kind: 'context' });
  return out;
}

export const deg = Math.PI / 180;
// True azimuth (clockwise from north) → grid-frame unit vector (u east, v north).
export function azToGrid(azDeg) {
  const a = (azDeg - GRID_ROT_DEG) * deg;
  return { u: Math.sin(a), v: Math.cos(a) };
}
export function gridToAz(u, v) {
  return ((Math.atan2(u, v) / deg + GRID_ROT_DEG) % 360 + 360) % 360;
}

// Ray against axis-aligned boxes (the whole scene is boxes in the grid frame, so occlusion is exact and fast).
export function rayHitsAny(o, d, boxes, skip = null, tMax = 1e9) {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    if (b === skip) continue;
    let t0 = 1e-4, t1 = tMax;
    const lo = [b.u0, b.v0, b.z0], hi = [b.u1, b.v1, b.z1];
    let miss = false;
    for (let k = 0; k < 3; k++) {
      const dk = d[k], ok = o[k];
      if (Math.abs(dk) < 1e-12) { if (ok < lo[k] || ok > hi[k]) { miss = true; break; } continue; }
      let ta = (lo[k] - ok) / dk, tb = (hi[k] - ok) / dk;
      if (ta > tb) { const t = ta; ta = tb; tb = t; }
      if (ta > t0) t0 = ta;
      if (tb < t1) t1 = tb;
      if (t0 > t1) { miss = true; break; }
    }
    if (!miss) return true;
  }
  return false;
}
