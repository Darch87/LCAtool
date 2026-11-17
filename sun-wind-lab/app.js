// Sun & Wind Lab — one 3D model, two physics.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as SITE from './site.js';
import * as C from './climate.js';
import * as SUN from './sun.js';
import * as AN from './analysis.js';
import { K_TOP } from './lbm.js';
import { deltaCp } from './windpost.js';
import * as PHOTO from './photoreal.js';

const $ = (s) => document.querySelector(s);
const P3 = (u, v, z = 0) => new THREE.Vector3(u, z, -v);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const fmt = (x, d = 0) => (Number.isFinite(x) ? x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '–');
const pct = (x) => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : '–');
const YEAR = 2026;
const DIRS = [...Array(16)].map((_, i) => i * 22.5);
const SEASONS = { spring: [2, 3, 4], summer: [5, 6, 7], autumn: [8, 9, 10], winter: [11, 0, 1] };
const DAY_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const FACE_NAME = { W: 'Park Avenue façade', E: 'East façade', S: '52nd Street façade', N: '53rd Street façade', R: 'Roof' };
const FACE_AZ = { W: 299, E: 119, S: 209, N: 29 };
const compass = (az) => ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round((((az % 360) + 360) % 360) / 22.5) % 16];

// ------------------------------------------------------------------ state
const BASE = { context: true, height: 157, canopy: false };
const S = {
  lens: 'sun', layer: 'shadow', day: 172, minute: 780, season: 'spring', follow: true, windDir: 315,
  ...BASE, energy: { ...AN.ENERGY_DEFAULTS }, particles: true, sunpath: true, labels: false, res: 8,
  climate: C.NYC,
};
const LAYERS = {
  sun: [
    { id: 'shadow', name: 'Shadows', desc: 'Sun and shade at the chosen moment, with the day\'s sun path.' },
    { id: 'sunhours', name: 'Sun hours', desc: 'Hours of direct sun on the chosen date, on the ground and the façades.' },
    { id: 'irradiance', name: 'Annual irradiance', desc: 'kWh/m² a year on every surface: sun, sky and ground bounce.' },
    { id: 'skyview', name: 'Sky view', desc: 'How much sky each point sees. Low means a deep street canyon.' },
  ],
  wind: [
    { id: 'speed', name: 'Wind speed', desc: 'Mean wind at 2 m for the chosen direction, with the flow in 3D.' },
    { id: 'lawson', name: 'Lawson comfort', desc: 'All 16 directions × the wind climate: where people can sit, stand or stroll.' },
    { id: 'safety', name: 'Wind safety', desc: 'Where gusts pass 15 or 20 m/s for more than about two hours a year.' },
    { id: 'pressure', name: 'Façade pressure', desc: 'Wind pressure on the façades for the chosen direction (Cp).' },
  ],
  comfort: [
    { id: 'feels', name: 'Feels like', both: true, desc: 'Air temperature, sun or shade, and the local wind at the chosen moment.' },
    { id: 'autonomy', name: 'Comfort autonomy', both: true, desc: 'Share of daytime hours with no thermal stress, for a season.' },
    { id: 'sunwind', name: 'Sun × wind', both: true, desc: 'Sunny or shaded, sheltered or breezy, for a season. Where to put the benches.' },
  ],
  energy: [
    { id: 'gains', name: 'Solar gain through glass', desc: 'Heat entering through the glass a year, after fins and overhangs.' },
    { id: 'leak', name: 'Wind-driven leakage', both: true, desc: 'Façade pressure averaged over the wind rose: + pushes air in, − pulls it out.' },
  ],
};
const LENS_NAME = { sun: 'Sun', wind: 'Wind', comfort: 'Comfort', energy: 'Energy' };

// data
let CTX = null, CTX_META = null; // surveyed context (NYC footprints)
const scenarioBoxes = () => SITE.buildings({ context: S.context, towerHeight: S.height === BASE.height ? null : S.height, canopy: S.canopy, ctx: CTX });
let boxes = SITE.buildings(BASE);
let sensors = null, sunTbl = null, solarFac = null, solarGround = null;
let baseline = null; // { meta, dirs: [{ped,gust,cp,vol,volMeta}] }
const live = new Map(); // scenario signature -> { dirs: Map(dirDeg -> result), cell }
let energy = null;
let sunHoursDate = null; // { key, fac: Float32Array, ground: Float32Array }
let cache = {};

const sig = () => `${S.context ? 1 : 0}|${S.height}|${S.canopy ? 1 : 0}`;
const isBase = () => S.context === BASE.context && S.height === BASE.height && S.canopy === BASE.canopy;

// ------------------------------------------------------------------ three.js setup
const canvas = $('#view');
const stage = $('#stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0c0c);
scene.fog = new THREE.Fog(0x0b0c0c, 900, 1900);
const camera = new THREE.PerspectiveCamera(38, 1, 1, 5000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 30; controls.maxDistance = 1600;

const hemi = new THREE.HemisphereLight(0xdfe8f0, 0x2a2622, 0.55);
scene.add(hemi);
const sunLight = new THREE.DirectionalLight(0xfff3e0, 2.6);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(4096, 4096);
const sc = sunLight.shadow.camera; sc.left = -330; sc.right = 330; sc.top = 330; sc.bottom = -330; sc.near = 10; sc.far = 1600;
sunLight.shadow.bias = -0.0004; sunLight.shadow.normalBias = 0.6;
scene.add(sunLight); scene.add(sunLight.target);
const fill = new THREE.DirectionalLight(0x9fb4c8, 0.35); fill.position.set(300, 200, 300); scene.add(fill);

const CENTER3 = P3(SITE.TOWER_CENTER.u, SITE.TOWER_CENTER.v, 0);

// ground and streets
const groundGroup = new THREE.Group(); scene.add(groundGroup);
{
  const g = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2600), new THREE.MeshStandardMaterial({ color: 0x0f1010, roughness: 1 }));
  g.rotation.x = -Math.PI / 2; g.position.copy(CENTER3); g.receiveShadow = true; groundGroup.add(g);
  const st = SITE.STREETS;
  const us = [[-st.parkW - 130, -st.parkW], [0, st.lexU], [st.lexU + st.lexW, st.lexU + st.lexW + 125]];
  const vs = [[-st.street - st.blockV * 2 - st.street, -st.street - st.blockV - st.street], [-st.street - st.blockV, -st.street], [0, st.blockV], [st.blockV + st.street, st.blockV * 2 + st.street], [st.blockV * 2 + st.street * 2, st.blockV * 3 + st.street * 2]];
  const blockMat = new THREE.MeshStandardMaterial({ color: 0x1a1b1a, roughness: 0.95 });
  for (const [u0, u1] of us) for (const [v0, v1] of vs) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(u1 - u0, 0.2, v1 - v0), blockMat);
    m.position.copy(P3((u0 + u1) / 2, (v0 + v1) / 2, 0.1)); m.receiveShadow = true; groundGroup.add(m);
  }
  const median = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 2000), new THREE.MeshStandardMaterial({ color: 0x223024, roughness: 1 }));
  median.position.copy(P3(-st.parkW / 2, 30, 0.25)); median.receiveShadow = true; groundGroup.add(median);
  const pz = SITE.PLAZA;
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(pz.u1 - pz.u0, pz.z, pz.v1 - pz.v0), new THREE.MeshStandardMaterial({ color: 0x5b4f4c, roughness: 0.8 }));
  plaza.position.copy(P3((pz.u0 + pz.u1) / 2, (pz.v0 + pz.v1) / 2, pz.z / 2)); plaza.receiveShadow = true; groundGroup.add(plaza);
  for (const p of pz.pools) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(p.u1 - p.u0, 0.1, p.v1 - p.v0), new THREE.MeshStandardMaterial({ color: 0x163a44, roughness: 0.15, metalness: 0.3 }));
    w.position.copy(P3((p.u0 + p.u1) / 2, (p.v0 + p.v1) / 2, pz.z + 0.03)); w.receiveShadow = true; groundGroup.add(w);
  }
  // true north arrow (Manhattan's grid is turned 29°)
  const g2 = SITE.azToGrid(0);
  const base = P3(-st.parkW - 95, -st.street - 40, 0.6);
  const tip = base.clone().add(new THREE.Vector3(g2.u * 40, 0, -g2.v * 40));
  const arrow = new THREE.ArrowHelper(tip.clone().sub(base).normalize(), base, 40, 0xf5f5f0, 9, 6);
  groundGroup.add(arrow);
}

// façade texture: bronze mullions every 1.41 m, spandrel band each floor
function facadeTexture() {
  const c = document.createElement('canvas'); c.width = 32; c.height = 96;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 96); g.addColorStop(0, '#3a2f25'); g.addColorStop(1, '#2a221b');
  x.fillStyle = g; x.fillRect(0, 0, 32, 96);
  x.fillStyle = '#4a3a2c'; x.fillRect(0, 70, 32, 26); // spandrel
  x.fillStyle = '#7a5d3f'; x.fillRect(0, 0, 3, 96); // mullion
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
const FACADE_TEX = facadeTexture();
const seagramMat = new THREE.MeshStandardMaterial({ map: FACADE_TEX, color: 0xffffff, roughness: 0.38, metalness: 0.45 });
const roofMat = new THREE.MeshStandardMaterial({ color: 0x2b2622, roughness: 0.9 });
const ctxMat = new THREE.MeshStandardMaterial({ color: 0x5a5c59, roughness: 0.92 });
const whatifMat = new THREE.MeshStandardMaterial({ color: 0x00b5e2, roughness: 0.6, transparent: true, opacity: 0.55 });

function boxMesh(b) {
  const w = b.u1 - b.u0, d = b.v1 - b.v0, h = b.z1 - b.z0;
  const geo = new THREE.BoxGeometry(w, h, d);
  if (b.kind === 'seagram' && !b.whatif) {
    // UVs in façade modules so the mullion texture keeps real spacing on every face
    const uv = geo.attributes.uv; const mx = 1.41, my = 4.1;
    const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / mx, uv.getY(i) * dims[f][1] / my); }
  }
  const mat = b.whatif ? whatifMat : b.kind === 'seagram' ? [seagramMat, seagramMat, roofMat, roofMat, seagramMat, seagramMat] : ctxMat;
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(P3((b.u0 + b.u1) / 2, (b.v0 + b.v1) / 2, (b.z0 + b.z1) / 2));
  m.castShadow = true; m.receiveShadow = true; m.userData.box = b;
  return m;
}
const buildingGroup = new THREE.Group(); scene.add(buildingGroup);
function rebuildMeshes() {
  for (const c of [...buildingGroup.children]) { buildingGroup.remove(c); c.geometry.dispose(); }
  const groups = new Map();
  for (const b of boxes) {
    if (b.kind !== 'context' || !b.bin) { buildingGroup.add(boxMesh(b)); continue; }
    if (!groups.has(b.bin)) groups.set(b.bin, []);
    groups.get(b.bin).push(b);
  }
  // one mesh per surveyed building keeps draw calls low
  for (const list of groups.values()) {
    const geos = list.map((b) => { const g = new THREE.BoxGeometry(b.u1 - b.u0, b.z1 - b.z0, b.v1 - b.v0); g.translate((b.u0 + b.u1) / 2, (b.z0 + b.z1) / 2, -(b.v0 + b.v1) / 2); return g; });
    const m = new THREE.Mesh(mergeGeometries(geos, false), ctxMat);
    geos.forEach((g) => g.dispose());
    m.castShadow = true; m.receiveShadow = true;
    const top = list.reduce((p, q) => (q.z1 > p.z1 ? q : p));
    m.userData.box = { ...top, u0: Math.min(...list.map((x) => x.u0)), u1: Math.max(...list.map((x) => x.u1)), v0: Math.min(...list.map((x) => x.v0)), v1: Math.max(...list.map((x) => x.v1)) };
    buildingGroup.add(m);
  }
}

// heat-map overlays
const G = AN.GROUND;
const groundTexData = new Uint8Array(G.nu * G.nv * 4);
const groundTex = new THREE.DataTexture(groundTexData, G.nu, G.nv, THREE.RGBAFormat);
groundTex.magFilter = THREE.LinearFilter; groundTex.minFilter = THREE.LinearFilter; groundTex.colorSpace = THREE.SRGBColorSpace;
const groundOverlay = new THREE.Mesh(new THREE.PlaneGeometry(G.nu * G.step, G.nv * G.step), new THREE.MeshBasicMaterial({ map: groundTex, transparent: true, depthWrite: false, toneMapped: false }));
groundOverlay.rotation.x = -Math.PI / 2;
groundOverlay.position.copy(P3(G.u0 + G.nu * G.step / 2, G.v0 + G.nv * G.step / 2, 1.2));
groundOverlay.renderOrder = 2;
scene.add(groundOverlay);
let facOverlay = null;
function rebuildFacadeOverlay() {
  if (facOverlay) { scene.remove(facOverlay); facOverlay.geometry.dispose(); }
  const n = sensors.fac.length;
  facOverlay = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ toneMapped: false, side: THREE.DoubleSide, depthTest: !photoOn }), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), z = new THREE.Vector3(0, 0, 1);
  sensors.fac.forEach((s, i) => {
    const nrm = new THREE.Vector3(s.n[0], s.n[2], -s.n[1]);
    q.setFromUnitVectors(z, nrm);
    const sz = Math.sqrt(s.area) * 1.01;
    m.compose(P3(s.u + s.n[0] * 0.25, s.v + s.n[1] * 0.25, s.z + s.n[2] * 0.25), q, new THREE.Vector3(sz, sz, 1));
    facOverlay.setMatrixAt(i, m);
    facOverlay.setColorAt(i, new THREE.Color(0x222222));
  });
  facOverlay.instanceMatrix.needsUpdate = true;
  scene.add(facOverlay);
}

// sun path
const sunGroup = new THREE.Group(); scene.add(sunGroup);
const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 12), new THREE.MeshBasicMaterial({ color: 0xffd600, toneMapped: false }));
scene.add(sunDisc);
const DOME = 360;
function sunDirGrid(az, el) { const g = SITE.azToGrid(az); const ce = Math.cos(el * SITE.deg); return [g.u * ce, g.v * ce, Math.sin(el * SITE.deg)]; }
function rebuildSunPath() {
  for (const c of [...sunGroup.children]) { sunGroup.remove(c); c.geometry?.dispose(); }
  const { m, d } = SUN.dayOfYearToMonthDay(S.day);
  const arcs = [
    { pts: SUN.dayArc(SITE.SITE, YEAR, m, d, 10), color: 0xffd600, op: 0.9 },
    { pts: SUN.dayArc(SITE.SITE, YEAR, 5, 21, 15), color: 0x8a8a84, op: 0.35 },
    { pts: SUN.dayArc(SITE.SITE, YEAR, 11, 21, 15), color: 0x8a8a84, op: 0.35 },
    { pts: SUN.dayArc(SITE.SITE, YEAR, 2, 20, 15), color: 0x8a8a84, op: 0.25 },
  ];
  for (const a of arcs) {
    const v = a.pts.filter((p) => p.el > 0).map((p) => { const s = sunDirGrid(p.az, p.el); return P3(SITE.TOWER_CENTER.u + s[0] * DOME, SITE.TOWER_CENTER.v + s[1] * DOME, s[2] * DOME); });
    if (v.length < 2) continue;
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(v), new THREE.LineBasicMaterial({ color: a.color, transparent: true, opacity: a.op }));
    sunGroup.add(line);
  }
  // hour ticks on today's arc
  const ticks = [];
  for (let h = 0; h < 24; h++) {
    const p = SUN.sunPosition(SUN.nyDate(YEAR, m, d, h, 0), SITE.SITE.lat, SITE.SITE.lon);
    if (p.el <= 0) continue;
    const s = sunDirGrid(p.az, p.el);
    ticks.push(P3(SITE.TOWER_CENTER.u + s[0] * DOME, SITE.TOWER_CENTER.v + s[1] * DOME, s[2] * DOME));
  }
  const tg = new THREE.BufferGeometry().setFromPoints(ticks);
  sunGroup.add(new THREE.Points(tg, new THREE.PointsMaterial({ color: 0xffd600, size: 5, sizeAttenuation: false })));
  // horizon ring
  const ring = []; for (let a = 0; a <= 64; a++) { const t = a / 64 * Math.PI * 2; ring.push(P3(SITE.TOWER_CENTER.u + Math.cos(t) * DOME, SITE.TOWER_CENTER.v + Math.sin(t) * DOME, 0.5)); }
  sunGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ring), new THREE.LineBasicMaterial({ color: 0x333333 })));
  sunGroup.visible = S.sunpath && (S.lens === 'sun' || S.lens === 'comfort');
}

// ------------------------------------------------------------------ colour
const PAL = {
  solar: ['#0d0887', '#5c01a6', '#9c179e', '#cc4778', '#ed7953', '#fdb42f', '#f0f921'],
  wind: ['#1b2a4a', '#1f6f8b', '#1f9e89', '#6ece58', '#fde725', '#fb8d3d', '#e8384f'],
  sky: ['#101a24', '#1d3b52', '#2e6b8a', '#5aa6c4', '#a8dcec', '#f2fbff'],
  div: ['#2c4fbf', '#5f8ee0', '#b8cdf0', '#eeeeea', '#f3b9a6', '#e06a4f', '#b8233a'],
  comfort: ['#1a0f1f', '#4d1a46', '#8e1f63', '#cf2f7b', '#ff1f8b', '#ff7fbf', '#ffd6ea'],
};
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const PALRGB = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, v.map(hex)]));
function ramp(name, t) {
  const p = PALRGB[name]; t = clamp(t, 0, 1) * (p.length - 1);
  const i = Math.min(p.length - 2, Math.floor(t)), f = t - i;
  return [p[i][0] + (p[i + 1][0] - p[i][0]) * f, p[i][1] + (p[i + 1][1] - p[i][1]) * f, p[i][2] + (p[i + 1][2] - p[i][2]) * f];
}
const gradientCss = (name) => `linear-gradient(90deg,${PAL[name].join(',')})`;

// ------------------------------------------------------------------ helpers: time, climate, wind
function md() { return SUN.dayOfYearToMonthDay(S.day); }
function nowSun() {
  const { m, d } = md();
  const p = SUN.sunPosition(SUN.nyDate(YEAR, m, d, Math.floor(S.minute / 60), S.minute % 60), SITE.SITE.lat, SITE.SITE.lon);
  return { ...p, dir: sunDirGrid(p.az, p.el) };
}
function nowIrr() {
  const { m } = md();
  const hrs = SUN.monthDay(S.climate, SITE.SITE, m);
  const h = clamp(Math.floor(S.minute / 60), 0, 23);
  const sun = nowSun();
  const r = hrs[h];
  if (sun.el <= 0) return { dni: 0, dhi: 0, ghi: 0 };
  // keep the month's mean-day values for this hour, but follow the real sun height on the chosen date
  const k = r.cz > 0.02 ? Math.sin(sun.el * SITE.deg) / r.cz : 1;
  return { dni: r.dni, dhi: r.dhi * clamp(k, 0.3, 2), ghi: r.ghi * clamp(k, 0.3, 2) };
}
function timeLabel(min) { const h = Math.floor(min / 60), mm = min % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; }
function dateLabel() { const { m, d } = md(); return `${C.MONTHS[m]} ${d}`; }
const annualRoseMean = () => S.climate.rose.reduce((s, r) => s + r.freq * r.mean, 0);
function windSpeedFor(dir, m) {
  // airport 10 m mean for this direction and month: the sector's mean, scaled by the month's overall level
  const r = S.climate.rose[Math.round(dir / 22.5) % 16];
  return r.mean * S.climate.windMean[m] / annualRoseMean();
}
function currentWindDir() {
  if (S.follow) { const { m } = md(); return Math.round(S.climate.windDir[m] / 22.5) % 16 * 22.5; }
  return S.windDir;
}

// wind result source for the current scenario
function windSet() {
  const L = live.get(sig());
  if (L && L.dirs.size) return { src: 'live', dirs: L.dirs, cell: L.cell, complete: L.dirs.size === 16 };
  if (baseline) return { src: isBase() ? 'baseline' : 'stale', dirs: baseline.map, cell: baseline.meta.cell, complete: true };
  return null;
}
function dirResult(set, dir) {
  if (!set) return null;
  if (set.dirs.has(dir)) return set.dirs.get(dir);
  if (set.src === 'live' && baseline && !set.complete) return null;
  // nearest available
  let best = null, bd = 1e9;
  for (const [d, r] of set.dirs) { const dd = Math.abs(((d - dir + 540) % 360) - 180); if (dd < bd) { bd = dd; best = r; } }
  return best;
}
// pedestrian K at a ground index for an arbitrary direction (interpolating the two neighbouring sectors)
function pedK(set, idx, dir) {
  const a = Math.floor(dir / 22.5) % 16, b = (a + 1) % 16, t = dir / 22.5 - Math.floor(dir / 22.5);
  const ra = dirResult(set, DIRS[a]), rb = dirResult(set, DIRS[b]);
  if (!ra) return NaN;
  const ka = ra.ped[idx];
  if (!rb || t < 1e-6) return ka;
  return ka * (1 - t) + rb.ped[idx] * t;
}

// ------------------------------------------------------------------ baseline loading
async function loadBaseline() {
  try {
    const [meta, bin] = await Promise.all([
      fetch('./data/wind-baseline.json').then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
      fetch('./data/wind-baseline.bin').then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }),
    ]);
    const u8 = new Uint8Array(bin);
    const map = new Map();
    meta.dirs.forEach((dir, d) => {
      let o = d * meta.per;
      const ped = new Float32Array(meta.nPed), gust = new Float32Array(meta.nPed), cp = new Float32Array(meta.nFac);
      for (let i = 0; i < meta.nPed; i++) ped[i] = u8[o + i] === 255 ? NaN : u8[o + i] / 150;
      o += meta.nPed;
      for (let i = 0; i < meta.nPed; i++) gust[i] = u8[o + i] === 255 ? NaN : 1 + u8[o + i] / 250;
      o += meta.nPed;
      const ci = new Int8Array(bin, o, meta.nFac);
      for (let i = 0; i < meta.nFac; i++) cp[i] = ci[i] === -128 ? NaN : ci[i] / 40;
      o += meta.nFac;
      const vol = new Int8Array(bin, o, meta.nVol);
      map.set(dir, { dir, ped, gust, cp, vol, volMeta: meta.volMeta, dcp: meta.dcp[d] });
    });
    baseline = { meta, map };
  } catch (e) {
    baseline = null;
    toast('Wind baseline not found. Run the tunnel to compute wind for this block.');
  }
}

// ------------------------------------------------------------------ solar
async function runSolar() {
  $('#loading').hidden = false; $('#loading-label').textContent = 'Tracing the sun through the block…';
  await tick();
  sensors = AN.makeSensors(boxes);
  sunTbl = AN.sunTable(S.climate, SITE.SITE);
  solarFac = AN.solarPass(sensors.fac, boxes, sunTbl);
  await tick();
  solarGround = AN.solarPass(sensors.ground, boxes, sunTbl);
  sunHoursDate = null; cache = {};
  rebuildFacadeOverlay();
  $('#loading').hidden = true;
}
const tick = () => new Promise((r) => setTimeout(r, 0));

let sunHoursJob = 0;
async function computeSunHoursDate() {
  const key = `${S.day}|${sig()}`;
  if (sunHoursDate && sunHoursDate.key === key) return sunHoursDate;
  const job = ++sunHoursJob;
  const { m, d } = md();
  const dirs = [];
  for (let t = 0; t < 1440; t += 15) {
    const p = SUN.sunPosition(SUN.nyDate(YEAR, m, d, Math.floor(t / 60), t % 60), SITE.SITE.lat, SITE.SITE.lon);
    if (p.el > 1) dirs.push(sunDirGrid(p.az, p.el));
  }
  const P = AN.packBoxes(boxes);
  const run = async (list) => {
    const out = new Float32Array(list.length);
    for (let i = 0; i < list.length; i++) {
      const s = list[i];
      if (s.inside) { out[i] = NaN; continue; }
      const px = s.u + s.n[0] * 0.05, py = s.v + s.n[1] * 0.05, pz = s.z + s.n[2] * 0.05;
      let c = 0;
      for (const dd of dirs) {
        if (s.n[0] * dd[0] + s.n[1] * dd[1] + s.n[2] * dd[2] <= 0) continue;
        if (!AN.blocked(px, py, pz, dd[0] || 1e-9, dd[1] || 1e-9, dd[2], P)) c++;
      }
      out[i] = c * 0.25;
      if (i % 2500 === 0) { await tick(); if (job !== sunHoursJob) return null; }
    }
    return out;
  };
  const fac = await run(sensors.fac); if (!fac) return null;
  const ground = await run(sensors.ground); if (!ground) return null;
  sunHoursDate = { key, fac, ground };
  return sunHoursDate;
}

// lit at this moment (one ray per point)
function litNow(list) {
  const s = nowSun();
  const out = new Uint8Array(list.length);
  if (s.el <= 0) return out;
  const P = AN.packBoxes(boxes); const d = s.dir;
  list.forEach((p, i) => {
    if (p.inside) return;
    if (p.n[0] * d[0] + p.n[1] * d[1] + p.n[2] * d[2] <= 0) return;
    out[i] = AN.blocked(p.u + p.n[0] * 0.05, p.v + p.n[1] * 0.05, p.z + p.n[2] * 0.05, d[0] || 1e-9, d[1] || 1e-9, d[2], P) ? 0 : 1;
  });
  return out;
}

// ------------------------------------------------------------------ derived maps
function lawsonMaps(set) {
  const key = `law|${set.src}|${sig()}|${S.climate.id}|${set.dirs.size}`;
  if (cache[key]) return cache[key];
  const n = G.nu * G.nv;
  const cls = new Int8Array(n).fill(-1), saf = new Int8Array(n).fill(-1);
  const Ks = new Float64Array(16), Gs = new Float64Array(16);
  const rs = DIRS.map((d) => dirResult(set, d));
  if (rs.some((r) => !r)) return null;
  for (let i = 0; i < n; i++) {
    let ok = true;
    for (let d = 0; d < 16; d++) { Ks[d] = rs[d].ped[i]; Gs[d] = Number.isFinite(rs[d].gust[i]) ? rs[d].gust[i] : 1; if (!Number.isFinite(Ks[d])) ok = false; }
    if (!ok || sensors.ground[i].inside) continue;
    cls[i] = AN.lawsonClass(Ks, Gs, S.climate.rose);
    saf[i] = AN.safetyClass(Ks, Gs, S.climate.rose);
  }
  return (cache[key] = { cls, saf });
}

async function autonomyMap(set) {
  const key = `aut|${set?.src}|${sig()}|${S.climate.id}|${S.season}`;
  if (cache[key]) return cache[key];
  const n = G.nu * G.nv;
  const out = new Float32Array(n).fill(NaN), sunFrac = new Float32Array(n).fill(NaN), windy = new Uint8Array(n);
  const months = SEASONS[S.season];
  const rose = S.climate.rose; const rm = annualRoseMean();
  const rs = DIRS.map((d) => dirResult(set, d));
  const irr = months.map((m) => SUN.monthDay(S.climate, SITE.SITE, m));
  const law = set ? lawsonMaps(set) : null;
  for (let i = 0; i < n; i++) {
    const g = sensors.ground[i];
    if (g.inside) continue;
    let good = 0, tot = 0, lit = 0, all = 0;
    months.forEach((m, mi) => {
      for (const h of DAY_HOURS) {
        const k = m * 24 + h;
        const sn = irr[mi][h];
        if (sn.el <= 0) continue;
        const isL = AN.isLit(solarGround.vis, i, k);
        lit += isL; all++;
        const Q = AN.absorbedShortwave(isL, sn, solarGround.sky[i]);
        const Ta = C.airTemp(S.climate, m, h + 0.5), rh = C.relHumidity(S.climate, m, h);
        for (let d = 0; d < 16; d++) {
          const K = rs[d] ? rs[d].ped[i] : 0.35;
          const ws = (Number.isFinite(K) ? K : 0.35) * rose[d].mean * S.climate.windMean[m] / rm;
          const at = AN.apparentTemp(Ta, rh, ws, Q);
          const w = rose[d].freq;
          if (at >= 9 && at < 26) good += w;
          tot += w;
        }
      }
    });
    out[i] = tot ? good / tot : NaN;
    sunFrac[i] = all ? lit / all : NaN;
    windy[i] = law && law.cls[i] >= 2 ? 1 : 0;
    if (i % 3000 === 0) await tick();
  }
  return (cache[key] = { aut: out, sunFrac, windy });
}

function feelsMap(set) {
  const { m } = md();
  const h = S.minute / 60;
  const Ta = C.airTemp(S.climate, m, h), rh = C.relHumidity(S.climate, m, Math.floor(h));
  const dir = currentWindDir(); const U = windSpeedFor(dir, m);
  const sn = nowIrr();
  const lit = litNow(sensors.ground);
  const n = G.nu * G.nv; const out = new Float32Array(n).fill(NaN);
  for (let i = 0; i < n; i++) {
    if (sensors.ground[i].inside) continue;
    const K = set ? pedK(set, i, dir) : 0.35;
    const ws = (Number.isFinite(K) ? K : 0.35) * U;
    out[i] = AN.apparentTemp(Ta, rh, ws, AN.absorbedShortwave(lit[i], sn, solarGround.sky[i]));
  }
  return { at: out, Ta, rh, U, dir, lit };
}

function facadeGains() {
  const key = `gain|${sig()}|${S.climate.id}|${JSON.stringify(S.energy)}`;
  if (cache[key]) return cache[key];
  const p = S.energy; const gl = AN.GLAZING[p.glazing];
  const out = new Float32Array(sensors.fac.length).fill(NaN);
  sensors.fac.forEach((s, i) => {
    if (!s.glass) return;
    let e = 0;
    for (let k = 0; k < sunTbl.length; k++) {
      const sn = sunTbl[k]; if (sn.el <= 0.5) continue;
      const cos = s.n[0] * sn.d[0] + s.n[1] * sn.d[1];
      let beam = 0;
      if (cos > 0 && AN.isLit(solarFac.vis, i, k)) {
        let gm = (sn.az - FACE_AZ[s.face]) * SITE.deg; gm = Math.atan2(Math.sin(gm), Math.cos(gm));
        let f = 1;
        if (p.finDepth > 0) f *= Math.max(0, 1 - p.finDepth * Math.abs(Math.tan(gm)) / p.finSpacing);
        if (p.overhang > 0) { const prof = Math.atan(Math.tan(sn.el * SITE.deg) / Math.max(0.05, Math.cos(gm))); f *= Math.max(0, 1 - p.overhang * Math.tan(prof) / (p.floorHeight * 0.75)); }
        beam = sn.dni * cos * f;
      }
      e += (beam + sn.dhi * solarFac.sky[i] + 0.2 * sn.ghi * solarFac.gnd[i]) * sn.days;
    }
    out[i] = e / 1000 * gl.shgc * 0.9;
  });
  return (cache[key] = out);
}

function roseCp(set) {
  const key = `rcp|${set.src}|${sig()}|${S.climate.id}|${set.dirs.size}`;
  if (cache[key]) return cache[key];
  const n = sensors.fac.length; const out = new Float32Array(n).fill(NaN);
  const rs = DIRS.map((d) => dirResult(set, d));
  if (rs.some((r) => !r || r.cp.length !== n)) return null;
  for (let i = 0; i < n; i++) {
    let s = 0, w = 0;
    for (let d = 0; d < 16; d++) { const c = rs[d].cp[i]; if (Number.isFinite(c)) { const f = S.climate.rose[d].freq * S.climate.rose[d].mean ** 2; s += c * f; w += f; } }
    out[i] = w ? s / w : NaN;
  }
  return (cache[key] = out);
}

function cpAt(set, dir) {
  const a = Math.floor(dir / 22.5) % 16, b = (a + 1) % 16, t = dir / 22.5 - Math.floor(dir / 22.5);
  const ra = dirResult(set, DIRS[a]), rb = dirResult(set, DIRS[b]);
  if (!ra || ra.cp.length !== sensors.fac.length) return null;
  const out = new Float32Array(ra.cp.length);
  for (let i = 0; i < out.length; i++) out[i] = rb && rb.cp.length === out.length ? ra.cp[i] * (1 - t) + rb.cp[i] * t : ra.cp[i];
  return out;
}

function runEnergy() {
  const set = windSet();
  let dcp = null;
  if (set) {
    const rs = DIRS.map((d) => dirResult(set, d));
    if (rs.every((r) => r)) dcp = rs.map((r) => (r.dcp ?? (r.cp.length === sensors.fac.length ? deltaCp(r.cp, sensors.fac) : 0.9)));
  }
  energy = AN.energyModel({ sensors: sensors.fac, solar: solarFac, sun: sunTbl, boxes, climate: S.climate, site: SITE.SITE, params: S.energy, wind: dcp ? { dcp } : null });
  energy.dcp = dcp;
  return energy;
}

// ------------------------------------------------------------------ painting
function paintGround(fn) {
  const n = G.nu * G.nv;
  for (let i = 0; i < n; i++) {
    const c = sensors.ground[i].inside ? null : fn(i);
    const o = i * 4;
    if (!c) { groundTexData[o + 3] = 0; continue; }
    groundTexData[o] = c[0]; groundTexData[o + 1] = c[1]; groundTexData[o + 2] = c[2]; groundTexData[o + 3] = c[3] ?? 225;
  }
  groundTex.needsUpdate = true;
  groundOverlay.visible = true;
}
const tmpColor = new THREE.Color();
function paintFacade(fn) {
  const n = sensors.fac.length;
  for (let i = 0; i < n; i++) {
    const c = fn(i) || [40, 40, 40];
    tmpColor.setRGB(c[0] / 255, c[1] / 255, c[2] / 255, THREE.SRGBColorSpace);
    facOverlay.setColorAt(i, tmpColor);
  }
  facOverlay.instanceColor.needsUpdate = true;
  facOverlay.visible = true;
}
function hideOverlays() { groundOverlay.visible = false; if (facOverlay) facOverlay.visible = false; }

function legendRamp(title, pal, ticks, note = '') {
  const L = $('#legend'); L.hidden = false;
  L.innerHTML = `<div class="t">${title}</div><div class="sw-ramp" style="background:${gradientCss(pal)}"></div><div class="sw-ramp-ticks">${ticks.map((t) => `<b>${t}</b>`).join('')}</div>${note ? `<div class="sw-note" style="margin-top:6px">${note}</div>` : ''}`;
}
function legendCats(title, cats, note = '') {
  const L = $('#legend'); L.hidden = false;
  L.innerHTML = `<div class="t">${title}</div><div class="sw-cats">${cats.map((c) => `<div><i style="background:${c.color}"></i>${c.label}${c.share != null ? `<small>${c.share}</small>` : ''}</div>`).join('')}</div>${note ? `<div class="sw-note" style="margin-top:6px">${note}</div>` : ''}`;
}

const head = (eyebrow, title, sub) => { $('#stage-eyebrow').textContent = eyebrow; $('#stage-title').textContent = title; $('#stage-sub').textContent = sub; };

let paintJob = 0;
async function paint() {
  if (!sensors) return;
  const job = ++paintJob;
  const set = windSet();
  const { m } = md();
  const dir = currentWindDir();
  $('#legend').hidden = true;
  hideOverlays();
  sunGroup.visible = S.sunpath && (S.lens === 'sun' || S.lens === 'comfort');
  const staleNote = set && set.src === 'stale' ? 'Wind shown is for the existing block: run the tunnel for this design.' : '';
  const lay = S.layer;
  if (lay === 'shadow') {
    const s = nowSun();
    head('Sun · shadows', s.el > 0 ? `Sun at ${fmt(s.el)}° from the ${compass(s.az)}` : 'The sun is below the horizon', `${dateLabel()}, ${timeLabel(S.minute)} · azimuth ${fmt(s.az)}°. Drag the time to sweep the shadows across the plaza.`);
  } else if (lay === 'sunhours') {
    head('Sun · sun hours', `Direct sun on ${dateLabel()}`, 'Counted in 15-minute steps from sunrise to sunset. Hover any point for its hours.');
    const sh = await computeSunHoursDate(); if (!sh || job !== paintJob) return;
    const max = Math.max(1, nowDayLength());
    paintGround((i) => (Number.isFinite(sh.ground[i]) ? [...ramp('solar', sh.ground[i] / max)] : null));
    paintFacade((i) => ramp('solar', sh.fac[i] / max));
    legendRamp('Hours of direct sun', 'solar', [0, fmt(max / 4, 1), fmt(max / 2, 1), fmt(max * 3 / 4, 1), fmt(max, 1)], `Day length ${fmt(max, 1)} h on ${dateLabel()}.`);
  } else if (lay === 'irradiance') {
    head('Sun · annual irradiance', 'Solar energy reaching every surface', 'Direct sun + sky + ground reflection over a typical year, kWh/m².');
    paintGround((i) => ramp('solar', solarGround.annual[i] / 1500));
    paintFacade((i) => ramp('solar', solarFac.annual[i] / 1500));
    legendRamp('kWh/m² · year', 'solar', [0, 375, 750, 1125, '1500+']);
  } else if (lay === 'skyview') {
    head('Sun · sky view', 'How open each point is to the sky', 'Cosine-weighted sky view. Under 0.3 is a deep canyon: little daylight, slow to cool at night.');
    paintGround((i) => ramp('sky', solarGround.sky[i]));
    paintFacade((i) => ramp('sky', solarFac.sky[i] * 2));
    legendRamp('Sky view factor', 'sky', ['0', '0.25', '0.5', '0.75', '1'], 'Façades see half the sky at most; their scale is doubled.');
  } else if (lay === 'speed') {
    const U = windSpeedFor(dir, m);
    head('Wind · speed', `Wind from the ${compass(dir)} at street level`, `${set?.src === 'live' ? 'Live tunnel' : 'Baseline tunnel'} · ${fmt(U, 1)} m/s at the airport (${C.MONTHS[m]} mean from this direction) → mean wind at 2 m. ${staleNote}`);
    if (set && !dirResult(set, dir)) head('Wind · speed', `No run yet for wind from the ${compass(dir)}`, 'Run this direction for the current design, or pick a direction you have run.');
    else if (set) {
      paintGround((i) => { const K = pedK(set, i, dir); return Number.isFinite(K) ? [...ramp('wind', K * U / 7)] : null; });
      legendRamp('Mean wind at 2 m, m/s', 'wind', [0, '1.75', '3.5', '5.25', '7+'], `Speed ratio × ${fmt(U, 1)} m/s airport wind. Particles show the time-averaged flow.`);
    }
  } else if (lay === 'lawson' || lay === 'safety') {
    const law = set ? lawsonMaps(set) : null;
    if (!law) { head('Wind · comfort', 'Lawson needs all 16 directions', 'Run all 16 directions for this design, or reset to the existing block.'); }
    else if (lay === 'lawson') {
      head('Wind · Lawson comfort', 'What the wind lets people do', `LDDC criteria on gust-equivalent mean speeds, 16 directions × the ${S.climate.id === 'epw' ? 'EPW' : 'LaGuardia'} wind rose. ${staleNote}`);
      paintGround((i) => (law.cls[i] >= 0 ? [...hex(AN.LAWSON[law.cls[i]].color), 215] : null));
      const share = shares(law.cls, 5, 'plaza');
      legendCats('Lawson LDDC · 5% exceedance', AN.LAWSON.map((l, k) => ({ color: l.color, label: `${l.label}${Number.isFinite(l.t) ? ` · < ${l.t} m/s` : ''}`, share: share ? pct(share[k]) : null })), 'Shares are of the Park Avenue plaza.');
    } else {
      head('Wind · safety', 'Where gusts become a hazard', `More than 0.022% of hours (about 2 a year) above 15 m/s (frail people, cyclists) or 20 m/s (everyone). ${staleNote}`);
      const cols = ['#20302a', '#fb8d3d', '#e8384f'];
      paintGround((i) => (law.saf[i] >= 0 ? (law.saf[i] === 0 ? [32, 48, 42, 120] : [...hex(cols[law.saf[i]]), 235]) : null));
      legendCats('Lawson safety', [{ color: cols[0], label: 'Safe' }, { color: cols[1], label: 'Unsafe for frail people, cyclists · 15 m/s' }, { color: cols[2], label: 'Unsafe for everyone · 20 m/s' }]);
    }
  } else if (lay === 'pressure') {
    head('Wind · façade pressure', `Wind from the ${compass(dir)} pressing on the façades`, `Pressure coefficient Cp against the approach wind at roof height (157 m). ${staleNote}`);
    const cp = set ? cpAt(set, dir) : null;
    if (cp) paintFacade((i) => (Number.isFinite(cp[i]) ? ramp('div', (cp[i] + 1.2) / 2.2) : null));
    legendRamp('Cp', 'div', ['−1.2', '−0.65', '−0.1', '+0.45', '+1.0'], cp ? 'Blue: suction. Red: positive pressure on the windward face.' : 'Pressures for this design need a tunnel run.');
  } else if (lay === 'feels') {
    const f = feelsMap(set);
    head('Comfort · feels like', `${fmt(f.Ta, 0)}°C air · feels ${fmt(median(f.at, 'plaza'), 0)}°C on the plaza`, `${dateLabel()}, ${timeLabel(S.minute)} · ${C.MONTHS[m]} typical day, wind ${fmt(f.U, 1)} m/s from the ${compass(f.dir)}. Sun and shade from the model, wind from the tunnel.`);
    paintGround((i) => (Number.isFinite(f.at[i]) ? stressColor(f.at[i]) : null));
    legendCats('Apparent temperature (Steadman)', AN.STRESS.map((s) => ({ color: s.color, label: `${s.label} · ${Number.isFinite(s.lo) ? s.lo : '<'}${Number.isFinite(s.hi) && Number.isFinite(s.lo) ? '–' : ''}${Number.isFinite(s.hi) ? s.hi : '+'} °C` })));
  } else if (lay === 'autonomy' || lay === 'sunwind') {
    head(lay === 'autonomy' ? 'Comfort · autonomy' : 'Comfort · sun × wind', `Working it out for ${S.season}…`, '');
    const a = await autonomyMap(set); if (job !== paintJob) return;
    if (lay === 'autonomy') {
      head('Comfort · autonomy', `Comfortable hours in ${S.season}`, `Share of 8 am–7 pm hours with no thermal stress, every wind direction weighted by the rose. ${staleNote}`);
      paintGround((i) => (Number.isFinite(a.aut[i]) ? [...ramp('comfort', a.aut[i])] : null));
      legendRamp('Daytime hours with no thermal stress', 'comfort', ['0%', '25%', '50%', '75%', '100%']);
    } else {
      const law = set ? lawsonMaps(set) : null;
      head('Comfort · sun × wind', `Where to sit in ${S.season}`, `Sunny: in direct sun ≥ 40% of daytime hours. Breezy: Lawson strolling or worse. ${staleNote}`);
      const cats = SUNWIND;
      paintGround((i) => { const k = sunwindClass(a, law, i); return k < 0 ? null : [...hex(cats[k].color), 225]; });
      const counts = [0, 0, 0, 0]; let tot = 0;
      zoneCells('plaza').forEach((i) => { const k = sunwindClass(a, law, i); if (k >= 0) { counts[k]++; tot++; } });
      legendCats(`Sun × wind · ${S.season}`, cats.map((c, k) => ({ ...c, share: tot ? pct(counts[k] / tot) : null })), 'Shares are of the Park Avenue plaza.');
    }
  } else if (lay === 'gains') {
    runEnergy();
    const g = facadeGains();
    head('Energy · solar gain', 'Heat the sun pushes through the glass', `${AN.GLAZING[S.energy.glazing].label} · SHGC ${AN.GLAZING[S.energy.glazing].shgc} · fins ${fmt(S.energy.finDepth, 2)} m · overhang ${fmt(S.energy.overhang, 2)} m. kWh per m² of façade a year.`);
    paintFacade((i) => (Number.isFinite(g[i]) ? ramp('solar', g[i] / 360) : [50, 46, 40]));
    legendRamp('Solar gain, kWh/m² façade · year', 'solar', [0, 90, 180, 270, '360+']);
  } else if (lay === 'leak') {
    runEnergy();
    const rc = set ? roseCp(set) : null;
    head('Energy · wind-driven leakage', 'Where the wind pushes air through the skin', `Cp averaged over the year's wind (weighted by frequency × speed²). It drives the infiltration in the energy model. ${staleNote}`);
    if (rc) paintFacade((i) => (Number.isFinite(rc[i]) ? ramp('div', (rc[i] + 0.8) / 1.4) : null));
    legendRamp('Year-weighted Cp', 'div', ['−0.8', '−0.45', '−0.1', '+0.25', '+0.6'], rc ? 'Red faces take air in; blue faces lose it.' : 'Needs all 16 directions for this design.');
  }
  updateSunLight();
  renderResults();
}
const SUNWIND = [
  { label: 'Sunny & sheltered · best to linger', color: '#FFD600' },
  { label: 'Sunny & breezy', color: '#f2703a' },
  { label: 'Shaded & sheltered', color: '#1f9e89' },
  { label: 'Shaded & breezy · avoid seating', color: '#3f5fbf' },
];
function sunwindClass(a, law, i) {
  if (!Number.isFinite(a.sunFrac[i])) return -1;
  const sunny = a.sunFrac[i] >= 0.4, breezy = law ? law.cls[i] >= 2 : false;
  return sunny ? (breezy ? 1 : 0) : (breezy ? 3 : 2);
}
function stressColor(t) {
  const k = AN.stressOf(t); return [...hex(AN.STRESS[k].color), 220];
}
function nowDayLength() {
  const { m, d } = md(); let c = 0;
  for (let t = 0; t < 1440; t += 15) { const p = SUN.sunPosition(SUN.nyDate(YEAR, m, d, Math.floor(t / 60), t % 60), SITE.SITE.lat, SITE.SITE.lon); if (p.el > 1) c++; }
  return c * 0.25;
}

// zones
function zoneCells(id) {
  const key = `zone|${id}|${sig()}`;
  if (cache[key]) return cache[key];
  const z = SITE.ZONES.find((x) => x.id === id);
  const out = [];
  sensors.ground.forEach((g, i) => { if (!g.inside && g.u >= z.u0 && g.u <= z.u1 && g.v >= z.v0 && g.v <= z.v1) out.push(i); });
  return (cache[key] = out);
}
function zoneOf(u, v) { return SITE.ZONES.find((z) => u >= z.u0 && u <= z.u1 && v >= z.v0 && v <= z.v1); }
function mean(arr, zone) { const ids = zoneCells(zone); let s = 0, n = 0; for (const i of ids) if (Number.isFinite(arr[i])) { s += arr[i]; n++; } return n ? s / n : NaN; }
function median(arr, zone) { const v = zoneCells(zone).map((i) => arr[i]).filter(Number.isFinite).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : NaN; }
function shares(cls, k, zone) { const ids = zoneCells(zone); const c = new Array(k).fill(0); let n = 0; for (const i of ids) if (cls[i] >= 0) { c[cls[i]]++; n++; } return n ? c.map((x) => x / n) : null; }

// ------------------------------------------------------------------ sun light
function updateSunLight() {
  const s = nowSun();
  const up = s.el > 0;
  sunLight.intensity = up ? 2.6 * clamp(Math.sin(s.el * SITE.deg) * 2.2, 0.15, 1) : 0;
  hemi.intensity = up ? 0.55 : 0.18;
  const d = s.dir;
  sunLight.position.copy(CENTER3).add(new THREE.Vector3(d[0] * 700, d[2] * 700, -d[1] * 700));
  sunLight.target.position.copy(CENTER3);
  sunDisc.visible = up && S.sunpath && (S.lens === 'sun' || S.lens === 'comfort');
  sunDisc.position.copy(P3(SITE.TOWER_CENTER.u + d[0] * DOME, SITE.TOWER_CENTER.v + d[1] * DOME, d[2] * DOME));
}

// ------------------------------------------------------------------ particles
const NP = 3500;
const pPos = new Float32Array(NP * 3); // tunnel frame X, Y, Z
const pAge = new Float32Array(NP);
const lineGeo = new THREE.BufferGeometry();
const lineArr = new Float32Array(NP * 6), lineCol = new Float32Array(NP * 6);
lineGeo.setAttribute('position', new THREE.BufferAttribute(lineArr, 3));
lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
const particles = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
particles.frustumCulled = false; particles.visible = false; scene.add(particles);
let field = null; // { kind:'vol'|'raw', dir, nx, ny, nz, cell, x0, y0, data, scale }
let fieldDir = null;

function setField(f) {
  const changed = !field || !f || field.dir !== f.dir;
  field = f;
  if (changed && f) seedParticles();
}
function seedParticles() {
  if (!field) return;
  for (let p = 0; p < NP; p++) respawn(p, true);
}
function respawn(p, anywhere) {
  const f = field;
  const X = anywhere ? f.x0 + Math.random() * f.nx * f.cell : f.x0 + Math.random() * 30;
  const Y = f.y0 + (0.05 + Math.random() * 0.9) * f.ny * f.cell;
  const Z = 1.5 + Math.pow(Math.random(), 2.2) * Math.min(f.nz * f.cell, 230);
  pPos[3 * p] = X; pPos[3 * p + 1] = Y; pPos[3 * p + 2] = Z; pAge[p] = Math.random() * 6;
}
function sampleField(X, Y, Z, out) {
  const f = field;
  const fx = (X - f.x0) / f.cell - 0.5, fy = (Y - f.y0) / f.cell - 0.5, fz = Z / f.cell - 0.5;
  const i0 = Math.floor(fx), j0 = Math.floor(fy), k0 = Math.max(0, Math.floor(fz));
  if (i0 < 0 || j0 < 0 || i0 >= f.nx - 1 || j0 >= f.ny - 1 || k0 >= f.nz - 1) return false;
  const tx = fx - i0, ty = fy - j0, tz = clamp(fz - k0, 0, 1);
  out[0] = out[1] = out[2] = 0;
  for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) {
    const w = (a ? tx : 1 - tx) * (b ? ty : 1 - ty) * (c ? tz : 1 - tz);
    const o = 3 * (i0 + a + f.nx * (j0 + b + f.ny * (k0 + c)));
    out[0] += f.data[o] * w; out[1] += f.data[o + 1] * w; out[2] += f.data[o + 2] * w;
  }
  out[0] *= f.scale; out[1] *= f.scale; out[2] *= f.scale;
  return true;
}
const vtmp = [0, 0, 0];
const P_BOXES = { arr: null };
function insideBox(u, v, z) { const P = P_BOXES.arr; for (let o = 0; o < P.length; o += 6) if (u > P[o] && u < P[o + 3] && v > P[o + 1] && v < P[o + 4] && z > P[o + 2] && z < P[o + 5]) return true; return false; }
function stepParticles(dt) {
  if (!field) return;
  const f = field;
  const flow = flowGrid(f.dir);
  const U = windSpeedFor(f.dir, md().m);
  const speedUp = 22;
  const cu = SITE.TOWER_CENTER.u, cv = SITE.TOWER_CENTER.v;
  for (let p = 0; p < NP; p++) {
    let X = pPos[3 * p], Y = pPos[3 * p + 1], Z = pPos[3 * p + 2];
    const ok = sampleField(X, Y, Z, vtmp);
    const sp = Math.hypot(vtmp[0], vtmp[1], vtmp[2]);
    pAge[p] += dt;
    const u = cu + X * flow.u - Y * flow.v, v = cv + X * flow.v + Y * flow.u;
    if (!ok || pAge[p] > 9 || (sp < 0.01 && pAge[p] > 2) || insideBox(u, v, Z)) { respawn(p, Math.random() < 0.35); continue; }
    const k = U * dt * speedUp;
    X += vtmp[0] * k; Y += vtmp[1] * k; Z = Math.max(0.8, Z + vtmp[2] * k);
    pPos[3 * p] = X; pPos[3 * p + 1] = Y; pPos[3 * p + 2] = Z;
    const hu = cu + X * flow.u - Y * flow.v, hv = cv + X * flow.v + Y * flow.u;
    const tl = 2.2 + sp * 9;
    const tu = hu - (vtmp[0] * flow.u - vtmp[1] * flow.v) / Math.max(sp, 1e-3) * tl;
    const tv = hv - (vtmp[0] * flow.v + vtmp[1] * flow.u) / Math.max(sp, 1e-3) * tl;
    const tz = Z - vtmp[2] / Math.max(sp, 1e-3) * tl;
    const o = 6 * p;
    lineArr[o] = hu; lineArr[o + 1] = Z; lineArr[o + 2] = -hv;
    lineArr[o + 3] = tu; lineArr[o + 4] = tz; lineArr[o + 5] = -tv;
    const c = ramp('wind', sp * U / 7);
    const fade = Math.min(1, pAge[p] * 1.5) * Math.min(1, (9 - pAge[p]));
    lineCol[o] = c[0] / 255 * fade; lineCol[o + 1] = c[1] / 255 * fade; lineCol[o + 2] = c[2] / 255 * fade;
    lineCol[o + 3] = c[0] / 255 * 0.05; lineCol[o + 4] = c[1] / 255 * 0.05; lineCol[o + 5] = c[2] / 255 * 0.05;
  }
  lineGeo.attributes.position.needsUpdate = true; lineGeo.attributes.color.needsUpdate = true;
}
function flowGrid(dirTrue) { const a = (dirTrue - SITE.GRID_ROT_DEG + 180) * SITE.deg; return { u: Math.sin(a), v: Math.cos(a) }; }
function updateFieldForView() {
  const want = S.lens === 'wind' && (S.layer === 'speed' || S.layer === 'pressure');
  particles.visible = want && S.particles;
  if (!want) return;
  if (running && liveField) { setField(liveField); return; }
  const set = windSet(); if (!set) { setField(null); return; }
  const dir = currentWindDir();
  const r = dirResult(set, dir);
  if (!r) { setField(null); return; }
  if (field && field.kind === 'vol' && field.dir === r.dir && field.src === set.src) return;
  const vm = r.volMeta;
  setField({ kind: 'vol', src: set.src, dir: r.dir, nx: vm.nx, ny: vm.ny, nz: vm.nz, cell: vm.cell, x0: vm.x0, y0: vm.y0, data: r.vol, scale: 1 / vm.scale });
}

// ------------------------------------------------------------------ wind tunnel runs
let worker = null, running = false, liveField = null;
function runTunnel(dirs) {
  if (running) return;
  if (!sensors) return;
  const key = sig();
  if (!live.has(key)) live.set(key, { dirs: new Map(), cell: S.res });
  const L = live.get(key);
  if (L.cell !== S.res) { L.dirs.clear(); L.cell = S.res; }
  worker?.terminate();
  worker = new Worker(new URL('./tunnel-worker.js', import.meta.url), { type: 'module' });
  running = true; updateRunUi();
  const facSensors = sensors.fac.map((s) => ({ u: s.u, v: s.v, z: s.z, n: s.n, face: s.face, box: s.box }));
  const started = performance.now();
  worker.onmessage = (e) => {
    const msg = e.data;
    if (msg.type === 'progress') {
      const g = msg.grid;
      liveField = { kind: 'raw', src: 'run', dir: msg.dir, nx: g.nx, ny: g.ny, nz: g.nz, cell: g.cell, x0: g.x0, y0: g.y0, data: msg.vel, scale: msg.K_TOP / msg.uTop };
      if (S.lens === 'wind' && S.particles) { if (!field || field.dir !== liveField.dir || field.kind !== 'raw') { field = null; } setField(liveField); particles.visible = true; }
      const overall = (msg.di + msg.frac) / msg.nDirs;
      const el = (performance.now() - started) / 1000; const eta = overall > 0.02 ? el / overall - el : NaN;
      setProgress(overall, `${compass(msg.dir)} wind · ${msg.averaging ? 'averaging' : 'developing'} · ${msg.di + 1}/${msg.nDirs}${Number.isFinite(eta) ? ` · ~${eta > 90 ? `${Math.round(eta / 60)} min` : `${Math.round(eta)} s`} left` : ''}`);
      $('#live-pill').hidden = false; $('#live-label').textContent = `Tunnel running · wind from the ${compass(msg.dir)} · ${Math.round(msg.frac * 100)}%`;
    } else if (msg.type === 'direction') {
      const r = msg.result; r.dcp = deltaCp(r.cp, sensors.fac);
      L.dirs.set(msg.dir, r);
      cache = {}; liveField = null; field = null;
      if (S.lens === 'wind' || S.lens === 'comfort') { if (!S.follow) S.windDir = msg.dir; }
      paint(); updateFieldForView(); updateRunUi();
    } else if (msg.type === 'done' || msg.type === 'stopped' || msg.type === 'error') {
      running = false; liveField = null; $('#live-pill').hidden = true; worker.terminate(); worker = null;
      if (msg.type === 'error') toast(msg.message);
      if (msg.type === 'done') toast(`Tunnel finished in ${Math.round((performance.now() - started) / 1000)} s.`);
      field = null; updateFieldForView(); updateRunUi(); paint();
    }
  };
  worker.onerror = (e) => { running = false; toast(`Tunnel stopped: ${e.message || 'worker error'}`); updateRunUi(); };
  worker.postMessage({ type: 'run', boxes: boxes.map(({ u0, u1, v0, v1, z0, z1 }) => ({ u0, u1, v0, v1, z0, z1 })), dirs, cell: S.res, uTop: 0.12, facSensors });
}
function stopTunnel() { if (worker) worker.postMessage({ type: 'stop' }); }
function setProgress(f, label) { $('#run-progress').hidden = false; $('#run-bar').style.width = `${Math.round(f * 100)}%`; $('#run-label').textContent = label; }
function updateRunUi() {
  const set = windSet();
  const box = $('#wind-run');
  const stale = set && set.src === 'stale';
  box.classList.toggle('stale', !!stale);
  const L = live.get(sig());
  $('#wind-src').textContent = set?.src === 'live' ? `Live · ${L.dirs.size}/16 directions · ${L.cell} m` : stale ? 'Out of date' : baseline ? `Baseline · 16 directions · ${baseline.meta.cell} m` : 'Not computed';
  $('#wind-stale-note').textContent = stale ? 'The massing has changed. The wind still shows the existing block until you run the tunnel for this design.' : set?.src === 'live' ? (set.complete ? 'All 16 directions computed for this design.' : 'Run all 16 directions for Lawson comfort, safety and leakage.') : 'Precomputed for the existing block. Change the massing and the tunnel re-runs here, in your browser.';
  $('#btn-run-one').disabled = running; $('#btn-run-all').disabled = running;
  $('#btn-run-stop').hidden = !running;
  if (!running) $('#run-progress').hidden = true;
  const est = estimateSeconds();
  $('#btn-run-all').title = `About ${Math.round(est * 16 / 60)} min on a recent laptop`;
  $('#btn-run-one').title = `About ${est < 90 ? `${Math.round(est)} s` : `${Math.round(est / 60)} min`} on a recent laptop`;
}
function estimateSeconds() {
  // cells × steps ÷ ~9 million cell-updates a second
  const cells = { 8: 80 * 55 * 41, 6: 107 * 73 * 55 }[S.res];
  const steps = { 8: 2222, 6: 2972 }[S.res];
  return cells * steps / 9e6;
}

// ------------------------------------------------------------------ Google Photorealistic 3D Tiles (context only)
let photo = null, photoOn = false, photoKey, photoFrames = 0;
const PLAZA3 = P3(14, 30, 0);
const outline = new THREE.Group(); scene.add(outline); outline.visible = false;
function rebuildOutline() {
  for (const c of [...outline.children]) { outline.remove(c); c.geometry.dispose(); }
  const mat = new THREE.LineBasicMaterial({ color: 0xffd600, transparent: true, opacity: 0.9, depthTest: false });
  for (const b of boxes) {
    if (b.kind !== 'seagram') continue;
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(b.u1 - b.u0, b.z1 - b.z0, b.v1 - b.v0)), mat);
    e.position.copy(P3((b.u0 + b.u1) / 2, (b.v0 + b.v1) / 2, (b.z0 + b.z1) / 2)); e.renderOrder = 5;
    outline.add(e);
  }
}
function applyPhotoVisibility() {
  for (const m of buildingGroup.children) m.visible = !photoOn;
  for (const c of groundGroup.children) c.visible = !photoOn;
  outline.visible = photoOn;
  if (photo) photo.holder.visible = photoOn;
  $('#photo-credit').hidden = !photoOn;
  $('#align').hidden = !photoOn;
  groundOverlay.position.y = photoOn ? 2.2 : 1.2;
  if (facOverlay) facOverlay.material.depthTest = !photoOn;
  scene.fog.near = photoOn ? 2500 : 900; scene.fog.far = photoOn ? 6000 : 1900;
}
async function togglePhotoreal(btn) {
  if (photoOn) { photoOn = false; btn.setAttribute('aria-pressed', 'false'); applyPhotoVisibility(); return; }
  if (photoKey === undefined) { btn.textContent = 'Photoreal…'; photoKey = await PHOTO.fetchKey(); btn.textContent = 'Photoreal'; }
  if (!photoKey) { toast('Google 3D tiles need a Google Maps Platform key — see README.'); return; }
  try {
    if (!photo) {
      btn.textContent = 'Photoreal…';
      photo = await PHOTO.createPhotoreal({ key: photoKey, camera, renderer, anchorLL: CTX_META ? SITE.gridToLatLon(SITE.TOWER_CENTER.u, SITE.TOWER_CENTER.v, CTX_META.origin) : null, anchor3: P3(SITE.TOWER_CENTER.u, SITE.TOWER_CENTER.v, 0), gridRotDeg: SITE.GRID_ROT_DEG, onAttribution: (t) => { $('#photo-credit').innerHTML = `<b>Google</b>${t ? escapeHtml(t) : ''}`; } });
      scene.add(photo.holder);
      btn.textContent = 'Photoreal';
    }
    photoOn = true; btn.setAttribute('aria-pressed', 'true');
    rebuildOutline(); applyPhotoVisibility(); alignRead();
    toast('Google Photorealistic 3D Tiles for context. The analysis still runs on the model massing (yellow).');
  } catch (e) {
    btn.textContent = 'Photoreal'; photo = null;
    toast(`Google 3D tiles failed: ${e.message || e}`);
  }
}
const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function alignRead() { if (!photo) return; const a = photo.align; $('#align-read').textContent = `Offset ${fmt(a.de, 0)} m E · ${fmt(a.dn, 0)} m N · ${fmt(a.rot, 1)}° · ground ${a.dz == null ? 'auto' : `${fmt(a.dz, 1)} m`}`; }
$('#align').addEventListener('click', (e) => {
  const b = e.target.closest('[data-nudge]'); if (!b || !photo) return;
  const [k, v] = b.dataset.nudge.split(':'); photo.nudge({ [k]: +v }); alignRead();
});
$('#align-snap').addEventListener('click', () => { if (photo) { toast(photo.resnap(PLAZA3) ? 'Ground snapped to the plaza.' : 'Tiles still loading under the plaza; try again in a moment.'); alignRead(); } });
$('#align-reset').addEventListener('click', () => { if (photo) { photo.reset(); alignRead(); } });
$('#align-close').addEventListener('click', () => { $('#align').hidden = true; });

// ------------------------------------------------------------------ results panel
function stat(label, value, unit = '', note = '') { return `<div><span>${label}</span><b>${value}${unit ? `<small>${unit}</small>` : ''}</b>${note ? `<em>${note}</em>` : ''}</div>`; }
function group(title, aside, body) { return `<section class="sw-group"><div class="sw-group-head"><h3>${title}</h3>${aside ? `<span>${aside}</span>` : ''}</div>${body}</section>`; }
function insight(color, html) { return `<div class="sw-insight"><i style="background:${color}"></i><div>${html}</div></div>`; }

function crossInsights() {
  const out = [];
  const set = windSet();
  const law = set ? lawsonMaps(set) : null;
  const plazaSun = mean(solarGround.sunHrs, 'plaza');
  if (Number.isFinite(plazaSun)) {
    const zones = ['plaza', 'parkAve', 'st52', 'st53'].map((z) => ({ z, h: mean(solarGround.sunHrs, z) })).filter((x) => Number.isFinite(x.h)).sort((p, q) => q.h - p.h);
    const rank = zones.findIndex((x) => x.z === 'plaza');
    const ms = plazaMonthSun(); const best = ms.indexOf(Math.max(...ms));
    const daylight = 4460; // daylight hours a year at this latitude
    const lead = rank === 0 ? 'The plaza is the sunniest open ground around the building' : `The plaza gets less sun than the ${SITE.ZONES.find((z) => z.id === zones[0].z).name}`;
    out.push(insight('#FFD600', `<b>${lead}, but not much:</b> about ${fmt(plazaSun)} hours of direct sun a year, ${pct(plazaSun / daylight)} of daylight hours, peaking in ${C.MONTHS[best]} at ${fmt(ms[best], 1)} h a day. Its sky view is ${fmt(mean(solarGround.sky, 'plaza'), 2)}: the towers that went up around Mies's setback since 1958 now shade most of it.`));
  }
  if (law) {
    const ps = shares(law.cls, 5, 'plaza');
    const corner = ['cornerSW', 'cornerNW'].map((z) => ({ z, s: shares(law.cls, 5, z) })).filter((x) => x.s);
    const worst = corner.map((x) => ({ ...x, bad: x.s[2] + x.s[3] + x.s[4] })).sort((a, b) => b.bad - a.bad)[0];
    if (ps) out.push(insight('#00B5E2', `<b>${pct(ps[0] + ps[1])} of the plaza is calm enough to sit or stand</b> through the year${worst && worst.bad > 0.05 ? `; the ${SITE.ZONES.find((z) => z.id === worst.z).name} is the windiest spot, with ${pct(worst.bad)} of it at strolling or worse.` : '.'}`));
    // sunny & sheltered
    const key = `aut|${set?.src}|${sig()}|${S.climate.id}|${S.season}`;
    const a = cache[key];
    if (a) {
      let good = 0, n = 0; zoneCells('plaza').forEach((i) => { const k = sunwindClass(a, law, i); if (k >= 0) { n++; if (k === 0) good++; } });
      if (n) out.push(insight('#FF1F8B', `<b>In ${S.season}, ${pct(good / n)} of the plaza is both sunny and sheltered</b>, the spots that stay pleasant longest. Plaza comfort autonomy: ${pct(mean(a.aut, 'plaza'))} of daytime hours.`));
    }
  }
  if (energy) {
    const f = energy.faces;
    out.push(insight('#f5f5f0', `<b>The Park Avenue façade takes ${fmt(f.W.perM2)} kWh/m² of sun a year</b> (it faces ${compass(FACE_AZ.W)} on Manhattan's turned grid), ${f.S.perM2 ? `${fmt(f.W.perM2 / f.S.perM2, 1)}×` : ''} the 52nd Street side, which sits in the shadow of 345 Park. Wind adds air leakage of about ${fmt(energy.infilAch, 2)} air changes an hour.`));
  }
  return out.join('');
}

function renderResults() {
  if (!sensors) return;
  const el = $('#results');
  const set = windSet();
  const parts = [];
  parts.push(group('Where sun and wind meet', set?.src === 'stale' ? 'wind: existing block' : '', crossInsights()));
  if (S.lens === 'sun') {
    const { m } = md();
    const sh = sunHoursDate && sunHoursDate.key === `${S.day}|${sig()}` ? sunHoursDate : null;
    const fac = energy?.faces || runEnergy().faces;
    const pv = AN.pvPotential(sensors.fac, solarFac);
    parts.push(group('Sun on the block', dateLabel(), `<div class="sw-stat">
      ${stat('Plaza sun today', sh ? fmt(mean(sh.ground, 'plaza'), 1) : '…', 'h', `of ${fmt(nowDayLength(), 1)} h daylight`)}
      ${stat('Plaza a year', fmt(mean(solarGround.annual, 'plaza')), 'kWh/m²', `sky view ${fmt(mean(solarGround.sky, 'plaza'), 2)}`)}
      ${stat('52nd St sidewalk', fmt(mean(solarGround.annual, 'st52')), 'kWh/m²', 'in 345 Park\'s shadow')}
      ${stat('Roof PV', fmt(pv.kWh / 1000), 'MWh/yr', `${fmt(pv.irradiation)} kWh/m² on the roofs`)}
    </div>`));
    parts.push(group('Façades, annual sun', 'kWh/m² · year', `<table class="sw-table"><tr><th>Façade</th><th>Faces</th><th>Sun</th><th>Area</th></tr>${['W', 'S', 'E', 'N'].map((k) => `<tr><td>${FACE_NAME[k]}</td><td>${compass(FACE_AZ[k])}</td><td>${fmt(fac[k].perM2)}</td><td>${fmt(fac[k].area)} m²</td></tr>`).join('')}</table>`));
    parts.push(group('Plaza sun through the year', 'hours of direct sun a day', monthBars(plazaMonthSun(), 'h', '#FFD600', m)));
  } else if (S.lens === 'wind') {
    const law = set ? lawsonMaps(set) : null;
    const zones = ['plaza', 'cornerSW', 'cornerNW', 'parkAve', 'st52', 'st53'];
    const dir = currentWindDir(); const U = windSpeedFor(dir, md().m);
    let rows = '';
    if (set) {
      rows = zones.map((z) => {
        const ids = zoneCells(z);
        let mx = 0, s = 0, n = 0; for (const i of ids) { const k = pedK(set, i, dir); if (Number.isFinite(k)) { mx = Math.max(mx, k); s += k; n++; } }
        const sh = law ? shares(law.cls, 5, z) : null;
        const dom = sh ? sh.indexOf(Math.max(...sh)) : -1;
        return `<tr><td>${SITE.ZONES.find((x) => x.id === z).name}</td><td>${fmt(s / n * U, 1)}</td><td>${fmt(mx * U, 1)}</td><td>${dom >= 0 ? `<span style="color:${AN.LAWSON[dom].color}">${AN.LAWSON[dom].label}</span>` : '–'}</td></tr>`;
      }).join('');
    }
    parts.push(group(`Wind from the ${compass(dir)}`, `${fmt(U, 1)} m/s at the airport`, set ? `<table class="sw-table"><tr><th>Place</th><th>Mean</th><th>Peak</th><th>Lawson (year)</th></tr>${rows}</table><p class="sw-note">Mean and peak are m/s at 2 m for this direction. Lawson combines all 16.</p>` : '<p class="sw-note">No wind results yet.</p>'));
    if (law) {
      const ps = shares(law.cls, 5, 'plaza');
      parts.push(group('Plaza comfort, all year', 'Lawson LDDC', `<div class="sw-bars">${AN.LAWSON.map((l, k) => `<div class="sw-bar"><span>${l.label}</span><div class="track"><i style="width:${(ps?.[k] || 0) * 100}%;background:${l.color}"></i></div><small>${pct(ps?.[k])}</small></div>`).join('')}</div>`));
      // safety where people actually walk: the plaza and the sidewalks and corners around the building
      const walk = new Set(SITE.ZONES.flatMap((z) => zoneCells(z.id)));
      let unsafe = 0, n = 0; walk.forEach((i) => { const v = law.saf[i]; if (v >= 0) { n++; if (v > 0) unsafe++; } });
      parts.push(group('Safety', 'plaza, sidewalks, corners', `<p class="sw-note" style="color:#d6d6d0">${unsafe ? `${pct(unsafe / n)} of the walking areas around the building fail the 15 m/s safety test. The map shows the roadways too.` : 'No walking area around the building fails the Lawson safety tests (15 and 20 m/s). The map shows the roadways too.'}</p>`));
    }
    parts.push(group('Wind climate', S.climate.id === 'epw' ? 'EPW' : 'LaGuardia, approx.', `<div class="sw-stat">${stat('Prevailing', compass(S.climate.windDir[md().m]), '', `${C.MONTHS[md().m]}`)}${stat('Monthly mean', fmt(S.climate.windMean[md().m], 1), 'm/s', 'at 10 m, open country')}</div>`));
  } else if (S.lens === 'comfort') {
    const f = feelsMap(set);
    const key = `aut|${set?.src}|${sig()}|${S.climate.id}|${S.season}`;
    const a = cache[key];
    parts.push(group('Right now', `${dateLabel()} · ${timeLabel(S.minute)}`, `<div class="sw-stat">
      ${stat('Air', fmt(f.Ta, 0), '°C', `RH ${fmt(f.rh)}%`)}
      ${stat('Plaza feels like', fmt(median(f.at, 'plaza'), 0), '°C', AN.STRESS[AN.stressOf(median(f.at, 'plaza'))]?.label || '')}
      ${stat('Sunlit plaza', pct(zoneCells('plaza').reduce((s, i) => s + f.lit[i], 0) / zoneCells('plaza').length), '', 'share in direct sun')}
      ${stat('Wind', fmt(f.U, 1), 'm/s', `from the ${compass(f.dir)}, airport`)}
    </div>`));
    if (a) {
      parts.push(group(`Comfort autonomy · ${S.season}`, 'daytime hours, no thermal stress', `<table class="sw-table"><tr><th>Place</th><th>Comfortable</th><th>In sun</th></tr>${['plaza', 'cornerSW', 'cornerNW', 'parkAve', 'st52', 'st53'].map((z) => `<tr><td>${SITE.ZONES.find((x) => x.id === z).name}</td><td>${pct(mean(a.aut, z))}</td><td>${pct(mean(a.sunFrac, z))}</td></tr>`).join('')}</table>`));
    }
  } else if (S.lens === 'energy') {
    const e = runEnergy();
    const fa = e.floorArea;
    const comps = [
      ['Heating', e.site.heating, '#FF1F8B'], ['Cooling', e.site.cooling, '#00B5E2'], ['Lighting', e.site.lights, '#FFD600'], ['Plug loads', e.site.plugs, '#a6a6a0'], ['Fans & pumps', e.site.fans, '#555'],
    ];
    parts.push(group('Energy use intensity', `${fmt(fa)} m² modelled`, `<div class="sw-stat">
      ${stat('Site EUI', fmt(e.eui), 'kWh/m²', `${fmt(e.eui_kbtu_ft2)} kBtu/ft² · yr`)}
      ${stat('Heating need', fmt(e.heatNeed / fa), 'kWh/m²', 'thermal, before plant')}
      ${stat('Cooling need', fmt(e.coolNeed / fa), 'kWh/m²', 'thermal, before plant')}
      ${stat('Air leakage', fmt(e.infilAch, 2), 'ACH', e.dcp ? 'wind from the tunnel + stack' : 'stack + default wind')}
    </div><p class="sw-note">Metered: the Seagram Building reported a site EUI of 221.7 kBtu/ft² in NYC's 2012 benchmarking (Local Law 84), nearly three times this model. The model covers the envelope, ventilation and office lighting and plugs; restaurants, 24-hour systems, ageing plant and controls make up the rest. Use it to compare envelope options, not to predict the bill. Embodied and operational carbon for the same building: <a class="sw-link" href="../lifecycle-takeoff/">Lifecycle Takeoff</a>.</p><div class="sw-bars">${comps.map(([k, v, c]) => `<div class="sw-bar"><span>${k}</span><div class="track"><i style="width:${v / e.site.total * 100}%;background:${c}"></i></div><small>${fmt(v / fa)}</small></div>`).join('')}</div>`));
    parts.push(group('Monthly loads', 'kWh/m², thermal', loadChart(e)));
    // glazing comparison
    const rows = Object.entries(AN.GLAZING).map(([k, g]) => {
      const r = AN.energyModel({ sensors: sensors.fac, solar: solarFac, sun: sunTbl, boxes, climate: S.climate, site: SITE.SITE, params: { ...S.energy, glazing: k }, wind: e.dcp ? { dcp: e.dcp } : null });
      return `<tr${k === S.energy.glazing ? ' style="color:#00B5E2"' : ''}><td>${g.label}</td><td>${g.U}</td><td>${g.shgc}</td><td>${fmt(r.eui)}</td></tr>`;
    }).join('');
    parts.push(group('Glazing options', 'same fins, overhang and plant', `<table class="sw-table"><tr><th>Glass</th><th>U</th><th>SHGC</th><th>EUI</th></tr>${rows}</table><p class="sw-note">U in W/m²K. EUI in kWh/m² a year. A screening model, not the building's metered use.</p>`));
    parts.push(group('Solar gain by façade', 'through the glass', `<table class="sw-table"><tr><th>Façade</th><th>Incident</th><th>Area</th></tr>${['W', 'S', 'E', 'N'].map((k) => `<tr><td>${FACE_NAME[k]}</td><td>${fmt(e.faces[k].perM2)} kWh/m²</td><td>${fmt(e.faces[k].area)} m²</td></tr>`).join('')}</table>`));
  }
  el.innerHTML = parts.join('');
}
function plazaMonthSun() {
  const ids = zoneCells('plaza');
  return C.MONTHS.map((_, m) => {
    let s = 0; for (const i of ids) for (let h = 0; h < 24; h++) { const k = m * 24 + h; if (sunTbl[k].dni > 120 && AN.isLit(solarGround.vis, i, k)) s++; }
    return s / ids.length;
  });
}
function monthBars(vals, unit, color, cur) {
  const W = 300, H = 110, bw = W / 12, mx = Math.max(...vals, 1);
  return `<svg class="sw-chart" viewBox="0 0 ${W} ${H + 16}">${vals.map((v, i) => { const h = v / mx * H; return `<rect x="${i * bw + 3}" y="${H - h}" width="${bw - 6}" height="${h}" rx="2" fill="${color}" opacity="${i === cur ? 1 : 0.45}"/><text x="${i * bw + bw / 2}" y="${H + 12}" text-anchor="middle">${C.MONTHS[i][0]}</text>${i === cur ? `<text x="${i * bw + bw / 2}" y="${H - h - 4}" text-anchor="middle" style="fill:#f5f5f0">${fmt(v, 1)}${unit}</text>` : ''}`; }).join('')}</svg>`;
}
function loadChart(e) {
  const W = 300, H = 110, bw = W / 12, fa = e.floorArea;
  const mx = Math.max(...e.months.map((x) => Math.max(x.heat, x.cool) / fa), 1);
  const bars = e.months.map((x, i) => {
    const hh = x.heat / fa / mx * H / 2, hc = x.cool / fa / mx * H / 2;
    return `<rect x="${i * bw + 4}" y="${H / 2 - hh}" width="${bw - 8}" height="${hh}" fill="#FF1F8B"/><rect x="${i * bw + 4}" y="${H / 2}" width="${bw - 8}" height="${hc}" fill="#00B5E2"/><text x="${i * bw + bw / 2}" y="${H + 12}" text-anchor="middle">${C.MONTHS[i][0]}</text>`;
  }).join('');
  return `<svg class="sw-chart" viewBox="0 0 ${W} ${H + 16}"><line class="ax" x1="0" x2="${W}" y1="${H / 2}" y2="${H / 2}"/>${bars}</svg><div class="sw-swatchrow"><span><i style="background:#FF1F8B"></i>Heating need</span><span><i style="background:#00B5E2"></i>Cooling need</span><span>max ${fmt(mx, 1)} kWh/m² a month</span></div>`;
}

// ------------------------------------------------------------------ probe
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let probeAt = null;
canvas.addEventListener('pointermove', (ev) => {
  const r = canvas.getBoundingClientRect();
  mouse.x = (ev.clientX - r.left) / r.width * 2 - 1; mouse.y = -(ev.clientY - r.top) / r.height * 2 + 1;
  probeAt = { x: ev.clientX - r.left, y: ev.clientY - r.top };
  requestProbe();
});
canvas.addEventListener('pointerleave', () => { probeAt = null; $('#probe').hidden = true; });
let probeQueued = false;
function requestProbe() { if (!probeQueued) { probeQueued = true; requestAnimationFrame(() => { probeQueued = false; doProbe(); }); } }
function doProbe() {
  if (!probeAt || !sensors) return;
  ray.setFromCamera(mouse, camera);
  const targets = [...buildingGroup.children];
  if (facOverlay && facOverlay.visible) targets.push(facOverlay);
  const hits = ray.intersectObjects(targets, false);
  let html = '';
  const set = windSet(); const dir = currentWindDir(); const { m } = md(); const U = windSpeedFor(dir, m);
  const groundHit = () => {
    const t = -ray.ray.origin.y / ray.ray.direction.y;
    if (!(t > 0)) return null;
    const p = ray.ray.origin.clone().add(ray.ray.direction.clone().multiplyScalar(t));
    return { u: p.x, v: -p.z, d: t };
  };
  const gh = groundHit();
  const h0 = hits[0];
  if (h0 && (!gh || h0.distance < gh.d)) {
    // façade: nearest sensor to the hit point
    const p = h0.point; const u = p.x, v = -p.z, z = p.y;
    const b = h0.object.userData.box;
    if (b && b.kind === 'context') html = `<h4>${b.name}</h4><dl><dt>Height</dt><dd>${fmt(b.z1)} m</dd></dl>`;
    else {
      let best = -1, bd = 1e9;
      sensors.fac.forEach((s, i) => { const d = (s.u - u) ** 2 + (s.v - v) ** 2 + (s.z - z) ** 2; if (d < bd) { bd = d; best = i; } });
      if (best >= 0 && bd < 40) {
        const s = sensors.fac[best];
        const sh = sunHoursDate && sunHoursDate.key === `${S.day}|${sig()}` ? sunHoursDate.fac[best] : NaN;
        const cp = set ? cpAt(set, dir) : null;
        const rc = set ? roseCp(set) : null;
        const gains = facadeGains();
        html = `<h4>${FACE_NAME[s.face]}${s.face !== 'R' ? ` · faces ${compass(FACE_AZ[s.face])}` : ''} · ${fmt(s.z)} m up</h4><dl>
          <dt class="sec">Sun</dt><dt>Annual irradiance</dt><dd>${fmt(solarFac.annual[best])} kWh/m²</dd>
          <dt>Direct sun a year</dt><dd>${fmt(solarFac.sunHrs[best])} h</dd>
          ${Number.isFinite(sh) ? `<dt>Sun on ${dateLabel()}</dt><dd>${fmt(sh, 2)} h</dd>` : ''}
          <dt>Sky view</dt><dd>${fmt(solarFac.sky[best], 2)}</dd>
          <dt class="sec">Wind</dt><dt>Cp, wind from ${compass(dir)}</dt><dd>${cp && Number.isFinite(cp[best]) ? fmt(cp[best], 2) : '–'}</dd>
          <dt>Year-weighted Cp</dt><dd>${rc && Number.isFinite(rc[best]) ? fmt(rc[best], 2) : '–'}</dd>
          ${s.glass ? `<dt class="sec">Energy</dt><dt>Solar gain via glass</dt><dd>${fmt(gains[best])} kWh/m²</dd>` : ''}
        </dl>`;
      }
    }
  } else if (gh) {
    const i = Math.floor((gh.u - G.u0) / G.step), j = Math.floor((gh.v - G.v0) / G.step);
    if (i >= 0 && j >= 0 && i < G.nu && j < G.nv) {
      const idx = i + G.nu * j; const g = sensors.ground[idx];
      if (!g.inside) {
        const z = zoneOf(g.u, g.v);
        const sh = sunHoursDate && sunHoursDate.key === `${S.day}|${sig()}` ? sunHoursDate.ground[idx] : NaN;
        const K = set ? pedK(set, idx, dir) : NaN;
        const law = set ? lawsonMaps(set) : null;
        const lit = (() => { const s = nowSun(); if (s.el <= 0) return 0; const P = AN.packBoxes(boxes); return AN.blocked(g.u, g.v, 1.55, s.dir[0] || 1e-9, s.dir[1] || 1e-9, s.dir[2], P) ? 0 : 1; })();
        const Ta = C.airTemp(S.climate, m, S.minute / 60), rh = C.relHumidity(S.climate, m, Math.floor(S.minute / 60));
        const at = AN.apparentTemp(Ta, rh, (Number.isFinite(K) ? K : 0.35) * U, AN.absorbedShortwave(lit, nowIrr(), solarGround.sky[idx]));
        const a = cache[`aut|${set?.src}|${sig()}|${S.climate.id}|${S.season}`];
        html = `<h4>${z ? z.name : 'Street level'} · ${dateLabel()} ${timeLabel(S.minute)}</h4><dl>
          <dt class="sec">Sun</dt><dt>Now</dt><dd>${nowSun().el <= 0 ? 'Night' : lit ? 'In sun' : 'In shade'}</dd>
          ${Number.isFinite(sh) ? `<dt>Sun on ${dateLabel()}</dt><dd>${fmt(sh, 2)} h</dd>` : ''}
          <dt>Direct sun a year</dt><dd>${fmt(solarGround.sunHrs[idx])} h</dd>
          <dt>Annual irradiance</dt><dd>${fmt(solarGround.annual[idx])} kWh/m²</dd>
          <dt>Sky view</dt><dd>${fmt(solarGround.sky[idx], 2)}</dd>
          <dt class="sec">Wind</dt><dt>From ${compass(dir)} at ${fmt(U, 1)} m/s</dt><dd>${Number.isFinite(K) ? `${fmt(K * U, 1)} m/s` : '–'}</dd>
          <dt>Speed ratio</dt><dd>${Number.isFinite(K) ? fmt(K, 2) : '–'}</dd>
          <dt>Lawson (year)</dt><dd>${law && law.cls[idx] >= 0 ? AN.LAWSON[law.cls[idx]].label : '–'}</dd>
          <dt class="sec">Comfort</dt><dt>Feels like now</dt><dd>${fmt(at, 0)}°C</dd>
          ${a ? `<dt>Autonomy, ${S.season}</dt><dd>${pct(a.aut[idx])}</dd>` : ''}
        </dl>`;
      }
    }
  }
  const pr = $('#probe');
  if (!html) { pr.hidden = true; return; }
  pr.innerHTML = html; pr.hidden = false;
  const r = stage.getBoundingClientRect();
  const w = pr.offsetWidth, h = pr.offsetHeight;
  pr.style.left = `${clamp(probeAt.x + 16, 8, r.width - w - 8)}px`;
  pr.style.top = `${clamp(probeAt.y + 16, 8, r.height - h - 8)}px`;
}

// ------------------------------------------------------------------ labels
const labelEls = [];
function rebuildLabels() {
  labelEls.forEach((l) => l.el.remove()); labelEls.length = 0;
  if (!S.labels) return;
  const seen = new Set();
  for (const b0 of buildingGroup.children) {
    const b = b0.userData.box; if (!b) continue;
    if (b.kind === 'context' && b.bin && !b.named) continue;
    if (b.id.endsWith('b') && b.kind === 'context' && !b.bin) continue;
    if (['leverP', 'citiCore', 'bustle', 'wingS', 'wingN'].includes(b.id)) continue;
    const name = b.kind === 'seagram' ? (b.id === 'slab' ? 'Seagram Building' : b.name) : b.name.replace(/ \(.*\)/, '');
    if (seen.has(name)) continue; seen.add(name);
    const el = document.createElement('div'); el.className = `sw-label3d${b.id === 'slab' ? ' seagram' : ''}`; el.textContent = name;
    stage.appendChild(el);
    labelEls.push({ el, p: P3((b.u0 + b.u1) / 2, (b.v0 + b.v1) / 2, b.z1 + 6) });
  }
}
function placeLabels() {
  if (!labelEls.length) return;
  const w = canvas.clientWidth, h = canvas.clientHeight; const v = new THREE.Vector3();
  for (const l of labelEls) {
    v.copy(l.p).project(camera);
    const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
    l.el.style.display = vis ? '' : 'none';
    if (vis) { l.el.style.left = `${(v.x + 1) / 2 * w}px`; l.el.style.top = `${(1 - v.y) / 2 * h}px`; }
  }
}

// ------------------------------------------------------------------ dial
function renderDial() {
  const svg = $('#dial');
  const rose = S.climate.rose; const mx = Math.max(...rose.map((r) => r.freq));
  const dir = currentWindDir();
  let h = '';
  [16, 32, 48].forEach((r) => { h += `<circle class="ring" r="${r}"/>`; });
  rose.forEach((r, i) => {
    const a0 = (r.deg - 10) * SITE.deg, a1 = (r.deg + 10) * SITE.deg, R = 8 + r.freq / mx * 40;
    const p = (a, rr) => `${(Math.sin(a) * rr).toFixed(2)},${(-Math.cos(a) * rr).toFixed(2)}`;
    h += `<path class="sector${Math.abs(((r.deg - dir + 540) % 360) - 180) < 1 ? ' on' : ''}" data-deg="${r.deg}" d="M${p(a0, 6)} L${p(a0, R)} A${R} ${R} 0 0 1 ${p(a1, R)} L${p(a1, 6)} A6 6 0 0 0 ${p(a0, 6)}Z"><title>${r.dir}: ${pct(r.freq)} of hours, mean ${fmt(r.mean, 1)} m/s</title></path>`;
    void i;
  });
  const gn = SITE.GRID_ROT_DEG * SITE.deg;
  h += `<line class="grid-n" x1="0" y1="0" x2="${(Math.sin(gn) * 54).toFixed(1)}" y2="${(-Math.cos(gn) * 54).toFixed(1)}"/>`;
  h += `<text x="${(Math.sin(gn) * 57).toFixed(1)}" y="${(-Math.cos(gn) * 57).toFixed(1)}" style="font-size:4.5px">grid</text>`;
  h += '<text class="north" x="0" y="-55">N</text><text x="55" y="0">E</text><text x="0" y="56">S</text><text x="-55" y="0">W</text>';
  svg.innerHTML = h;
  const { m } = md();
  $('#dial-label').textContent = `From ${compass(dir)} · ${fmt(windSpeedFor(dir, m), 1)} m/s`;
  $('#btn-follow').setAttribute('aria-pressed', String(S.follow));
  $('#btn-follow').textContent = S.follow ? `Following ${C.MONTHS[m]}'s prevailing wind` : 'Follow the month';
}
$('#dial').addEventListener('click', (e) => {
  const t = e.target.closest('.sector'); if (!t) return;
  S.windDir = +t.dataset.deg; S.follow = false; onWindDirChange();
});
$('#btn-follow').addEventListener('click', () => { S.follow = !S.follow; if (!S.follow) S.windDir = currentWindDir(); onWindDirChange(); });
function onWindDirChange() { renderDial(); updateFieldForView(); paint(); }

// ------------------------------------------------------------------ UI wiring
function renderLayers() {
  $('#lens-name').textContent = LENS_NAME[S.lens];
  $('#layers').innerHTML = LAYERS[S.lens].map((l) => `<button class="sw-layer${l.both ? ' both' : ''}" role="radio" aria-checked="${l.id === S.layer}" data-layer="${l.id}"><i></i><b>${l.name}</b><span>${l.desc}</span></button>`).join('');
  document.querySelectorAll('.sw-lenses button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.lens === S.lens)));
  $('#season').hidden = !(S.lens === 'comfort' && S.layer !== 'feels');
  $('#dial-wrap').hidden = S.lens === 'sun';
  document.documentElement.style.setProperty('--sel', { sun: '#FFD600', wind: '#00B5E2', comfort: '#FF1F8B', energy: '#f5f5f0' }[S.lens]);
}
document.querySelectorAll('.sw-lenses button').forEach((b) => b.addEventListener('click', () => {
  S.lens = b.dataset.lens; S.layer = LAYERS[S.lens][0].id; renderLayers(); updateFieldForView(); paint(); saveUrl();
}));
$('#layers').addEventListener('click', (e) => {
  const b = e.target.closest('[data-layer]'); if (!b) return;
  S.layer = b.dataset.layer; renderLayers(); updateFieldForView(); paint(); saveUrl();
});
document.querySelectorAll('#season button').forEach((b) => b.addEventListener('click', () => {
  S.season = b.dataset.season; document.querySelectorAll('#season button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); paint();
}));

function setRangeFill(el) { const p = (el.value - el.min) / (el.max - el.min) * 100; el.style.setProperty('--p', `${p}%`); }
document.querySelectorAll('input[type=range]').forEach((el) => { setRangeFill(el); el.addEventListener('input', () => setRangeFill(el)); });

let paintTimer = 0;
const paintSoon = (ms = 60) => { clearTimeout(paintTimer); paintTimer = setTimeout(paint, ms); };
$('#r-day').addEventListener('input', (e) => {
  S.day = +e.target.value; $('#v-day').textContent = dateLabel();
  rebuildSunPath(); updateSunLight(); renderDial(); if (S.follow) updateFieldForView(); paintSoon(S.layer === 'sunhours' ? 250 : 60);
  clearTimeout(shTimer); shTimer = setTimeout(async () => { if (await computeSunHoursDate()) renderResults(); }, 700);
});
$('#r-time').addEventListener('input', (e) => {
  S.minute = +e.target.value; $('#v-time').textContent = timeLabel(S.minute);
  updateSunLight(); if (S.layer === 'shadow' || S.layer === 'feels') paintSoon(40); else head($('#stage-eyebrow').textContent, $('#stage-title').textContent, $('#stage-sub').textContent);
});
let playing = false, playLast = 0, shTimer = 0;
$('#btn-play').addEventListener('click', () => { playing = !playing; $('#btn-play').setAttribute('aria-pressed', String(playing)); playLast = performance.now(); });

// what-ifs
async function geometryChanged() {
  boxes = scenarioBoxes();
  P_BOXES.arr = AN.packBoxes(boxes);
  rebuildMeshes(); rebuildLabels(); if (photoOn) { rebuildOutline(); applyPhotoVisibility(); }
  await runSolar();
  field = null; updateFieldForView(); updateRunUi(); paint(); saveUrl();
}
let geoTimer = 0;
const geometrySoon = () => { clearTimeout(geoTimer); geoTimer = setTimeout(geometryChanged, 250); };
$('#t-context').addEventListener('click', (e) => { S.context = !S.context; e.currentTarget.setAttribute('aria-checked', String(S.context)); geometrySoon(); });
$('#t-canopy').addEventListener('click', (e) => { S.canopy = !S.canopy; e.currentTarget.setAttribute('aria-checked', String(S.canopy)); geometrySoon(); });
$('#r-height').addEventListener('input', (e) => { S.height = +e.target.value; $('#v-height').textContent = S.height; geometrySoon(); });
const glz = $('#s-glazing'); glz.innerHTML = Object.entries(AN.GLAZING).map(([k, g]) => `<option value="${k}">${g.label} · U ${g.U}</option>`).join('');
glz.addEventListener('change', () => { S.energy.glazing = glz.value; energyChanged(); });
const hts = $('#s-heating'); hts.innerHTML = Object.entries(AN.HEATING).map(([k, g]) => `<option value="${k}">${g.label}</option>`).join('');
hts.addEventListener('change', () => { S.energy.heating = hts.value; energyChanged(); });
$('#r-overhang').addEventListener('input', (e) => { S.energy.overhang = +e.target.value; $('#v-overhang').textContent = fmt(S.energy.overhang, 2); energyChanged(); });
$('#r-fins').addEventListener('input', (e) => { S.energy.finDepth = +e.target.value; $('#v-fins').textContent = fmt(S.energy.finDepth, 2); energyChanged(); });
function energyChanged() { if (S.lens === 'energy' || S.lens === 'sun') paintSoon(80); else renderResults(); saveUrl(); }
$('#btn-reset').addEventListener('click', () => {
  Object.assign(S, BASE); S.energy = { ...AN.ENERGY_DEFAULTS };
  syncControls(); geometryChanged();
});
function syncControls() {
  $('#t-context').setAttribute('aria-checked', String(S.context)); $('#t-canopy').setAttribute('aria-checked', String(S.canopy));
  $('#r-height').value = S.height; $('#v-height').textContent = S.height;
  glz.value = S.energy.glazing; hts.value = S.energy.heating;
  $('#r-overhang').value = S.energy.overhang; $('#v-overhang').textContent = fmt(S.energy.overhang, 2);
  $('#r-fins').value = S.energy.finDepth; $('#v-fins').textContent = fmt(S.energy.finDepth, 2);
  $('#r-day').value = S.day; $('#v-day').textContent = dateLabel();
  $('#r-time').value = S.minute; $('#v-time').textContent = timeLabel(S.minute);
  document.querySelectorAll('#s-res button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.res === S.res)));
  document.querySelectorAll('input[type=range]').forEach(setRangeFill);
}
document.querySelectorAll('#s-res button').forEach((b) => b.addEventListener('click', () => { S.res = +b.dataset.res; syncControls(); updateRunUi(); }));
$('#btn-run-one').addEventListener('click', () => { const d = currentWindDir(); S.follow = false; S.windDir = d; renderDial(); runTunnel([d]); });
$('#btn-run-all').addEventListener('click', () => {
  const first = currentWindDir();
  const order = [first, ...DIRS.filter((d) => d !== first)];
  runTunnel(order);
});
$('#btn-run-stop').addEventListener('click', stopTunnel);

// toolbar
document.querySelectorAll('.sw-toolbar [data-tog]').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.tog;
  if (k === 'photoreal') { togglePhotoreal(b); return; }
  S[k] = !S[k]; b.setAttribute('aria-pressed', String(S[k]));
  if (k === 'labels') rebuildLabels();
  if (k === 'sunpath') { sunGroup.visible = S.sunpath; updateSunLight(); }
  updateFieldForView();
}));
const CAMS = {
  persp: { pos: P3(-300, -170, 470), tgt: P3(45, 30, 20) },
  top: { pos: P3(40, 22, 720), tgt: P3(40, 30, 0) },
  street: { pos: P3(-34, -40, 1.7), tgt: P3(40, 45, 70) },
};
function setCam(k) {
  const c = CAMS[k]; camera.position.copy(c.pos); controls.target.copy(c.tgt); controls.update();
  document.querySelectorAll('.sw-toolbar [data-cam]').forEach((b) => b.classList.toggle('on', b.dataset.cam === k));
}
document.querySelectorAll('.sw-toolbar [data-cam]').forEach((b) => b.addEventListener('click', () => setCam(b.dataset.cam)));

// method drawer
$('#btn-method').addEventListener('click', () => { $('#method').hidden = false; });
$('#method-close').addEventListener('click', () => { $('#method').hidden = true; });
$('#method').addEventListener('click', (e) => { if (e.target.id === 'method') $('#method').hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { $('#method').hidden = true; $('#export-menu').hidden = true; } });

// EPW
$('#epw-file').addEventListener('change', async (e) => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const cl = C.parseEPW(await f.text());
    S.climate = cl; SUN.clearCache();
    $('#climate-label').textContent = cl.label;
    if (Math.abs(cl.loc.lat - SITE.SITE.lat) > 1.5) toast(`Loaded ${cl.label}. The sun still follows Manhattan; the weather is the file's.`);
    else toast(`Loaded ${cl.label}: hourly temperature, sun and wind now come from the file.`);
    await runSolar(); renderDial(); paint();
  } catch (err) { toast(err.message || 'Could not read that EPW file.'); }
  e.target.value = '';
});

// export
$('#btn-export').addEventListener('click', (e) => { e.stopPropagation(); const m = $('#export-menu'); m.hidden = !m.hidden; $('#btn-export').setAttribute('aria-expanded', String(!m.hidden)); });
document.addEventListener('click', () => { $('#export-menu').hidden = true; });
$('#export-menu').addEventListener('click', (e) => {
  const b = e.target.closest('[data-export]'); if (!b) return;
  const k = b.dataset.export;
  if (k === 'png') {
    const w = canvas.clientWidth, h = canvas.clientHeight; const pr = renderer.getPixelRatio();
    renderer.setPixelRatio(2); renderer.setSize(w, h, false); renderer.render(scene, camera);
    download(canvas.toDataURL('image/png'), `sun-wind-lab-${S.layer}.png`);
    renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
  } else if (k === 'ground') {
    const set = windSet(); const law = set ? lawsonMaps(set) : null;
    const a = cache[`aut|${set?.src}|${sig()}|${S.climate.id}|${S.season}`];
    const rows = ['u_m,v_m,zone,annual_kwh_m2,direct_kwh_m2,direct_sun_h_yr,sky_view,lawson,safety,' + `comfort_autonomy_${S.season}`];
    sensors.ground.forEach((g, i) => {
      if (g.inside) return;
      const z = zoneOf(g.u, g.v);
      rows.push([g.u.toFixed(1), g.v.toFixed(1), z ? z.id : '', fmt0(solarGround.annual[i]), fmt0(solarGround.direct[i]), fmt0(solarGround.sunHrs[i]), solarGround.sky[i].toFixed(3), law && law.cls[i] >= 0 ? AN.LAWSON[law.cls[i]].label : '', law && law.saf[i] >= 0 ? ['safe', 'unsafe 15 m/s', 'unsafe 20 m/s'][law.saf[i]] : '', a ? a.aut[i].toFixed(3) : ''].join(','));
    });
    download(blobUrl(rows.join('\n'), 'text/csv'), 'sun-wind-lab-ground.csv');
  } else if (k === 'facade') {
    const set = windSet(); const rc = set ? roseCp(set) : null; const g = facadeGains();
    const rows = ['u_m,v_m,z_m,face,mass,area_m2,annual_kwh_m2,direct_sun_h_yr,sky_view,year_weighted_cp,solar_gain_glass_kwh_m2'];
    sensors.fac.forEach((s, i) => rows.push([s.u.toFixed(1), s.v.toFixed(1), s.z.toFixed(1), s.face, s.box, s.area.toFixed(2), fmt0(solarFac.annual[i]), fmt0(solarFac.sunHrs[i]), solarFac.sky[i].toFixed(3), rc && Number.isFinite(rc[i]) ? rc[i].toFixed(3) : '', Number.isFinite(g[i]) ? fmt0(g[i]) : ''].join(',')));
    download(blobUrl(rows.join('\n'), 'text/csv'), 'sun-wind-lab-facade.csv');
  } else if (k === 'summary') {
    const e2 = runEnergy(); const set = windSet(); const law = set ? lawsonMaps(set) : null;
    const out = {
      tool: 'Sun & Wind Lab', site: SITE.SITE, scenario: { context: S.context, towerHeight: S.height, canopy: S.canopy, energy: S.energy },
      climate: S.climate.label, wind: set ? { source: set.src, directions: set.dirs.size } : null,
      plaza: { annualIrradiance: mean(solarGround.annual, 'plaza'), sunHoursYear: mean(solarGround.sunHrs, 'plaza'), skyView: mean(solarGround.sky, 'plaza'), lawsonShares: law ? Object.fromEntries(AN.LAWSON.map((l, k) => [l.label, shares(law.cls, 5, 'plaza')?.[k]])) : null },
      energy: { eui_kWh_m2: e2.eui, eui_kBtu_ft2: e2.eui_kbtu_ft2, heatingNeed_kWh_m2: e2.heatNeed / e2.floorArea, coolingNeed_kWh_m2: e2.coolNeed / e2.floorArea, siteEnergy_kWh: e2.site, infiltration_ach: e2.infilAch, faces: e2.faces },
    };
    download(blobUrl(JSON.stringify(out, null, 2), 'application/json'), 'sun-wind-lab-summary.json');
  }
  $('#export-menu').hidden = true;
});
const fmt0 = (x) => (Number.isFinite(x) ? Math.round(x) : '');
function blobUrl(text, type) { return URL.createObjectURL(new Blob([text], { type })); }
function download(url, name) { const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }

let toastTimer = 0;
function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 4200); }

// URL state (lens, layer, date, time)
function saveUrl() {
  const p = new URLSearchParams({ lens: S.lens, layer: S.layer, day: S.day, t: S.minute });
  if (!isBase()) { p.set('ctx', S.context ? 1 : 0); p.set('h', S.height); p.set('canopy', S.canopy ? 1 : 0); }
  history.replaceState(null, '', `?${p}`);
}
function readUrl() {
  const p = new URLSearchParams(location.search);
  if (p.get('lens') && LAYERS[p.get('lens')]) { S.lens = p.get('lens'); S.layer = LAYERS[S.lens][0].id; }
  if (p.get('layer') && LAYERS[S.lens].some((l) => l.id === p.get('layer'))) S.layer = p.get('layer');
  if (p.get('day')) S.day = clamp(+p.get('day') || 172, 1, 365);
  if (p.get('t')) S.minute = clamp(+p.get('t') || 780, 300, 1260);
  if (p.get('ctx')) S.context = p.get('ctx') === '1';
  if (p.get('h')) S.height = clamp(+p.get('h') || 157, 60, 320);
  if (p.get('canopy')) S.canopy = p.get('canopy') === '1';
}

// ------------------------------------------------------------------ loop
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix();
  }
}
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  resize();
  if (playing) {
    S.minute += (now - playLast) / 1000 * 60; playLast = now;
    if (S.minute > 1260) S.minute = 300;
    S.minute = Math.round(S.minute / 5) * 5;
    $('#r-time').value = S.minute; setRangeFill($('#r-time')); $('#v-time').textContent = timeLabel(S.minute);
    updateSunLight();
    if (S.layer === 'shadow' || S.layer === 'feels') paintSoon(120);
  }
  if (particles.visible && field) stepParticles(dt);
  if (photo && photoOn) { photo.update(); if (++photoFrames % 45 === 0 && !photo.tryGround(PLAZA3)) { /* keep streaming */ } }
  controls.update();
  renderer.render(scene, camera);
  placeLabels();
  requestAnimationFrame(loop);
}

// ------------------------------------------------------------------ boot
(async function boot() {
  readUrl();
  try {
    CTX_META = await fetch('./data/context.json').then((r) => (r.ok ? r.json() : null));
    if (CTX_META) CTX = SITE.contextBoxes(CTX_META);
  } catch { CTX = null; }
  syncControls();
  renderLayers();
  setCam(S.lens === 'wind' && S.layer === 'speed' ? 'persp' : 'persp');
  boxes = scenarioBoxes();
  P_BOXES.arr = AN.packBoxes(boxes);
  rebuildMeshes();
  rebuildSunPath();
  updateSunLight();
  requestAnimationFrame(loop);
  $('#loading-label').textContent = 'Loading the wind tunnel baseline…';
  await loadBaseline();
  await runSolar();
  renderDial();
  updateRunUi();
  updateFieldForView();
  await paint();
  // warm the date's sun hours and the season maps so every lens has its numbers
  await computeSunHoursDate(); renderResults();
  const set = windSet(); if (set) { await autonomyMap(set); renderResults(); }
})();

window.addEventListener('resize', resize);
