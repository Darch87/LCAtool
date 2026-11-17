// Lifecycle Takeoff · 3D. Generates a model from the building description (every mesh tagged with its takeoff component),
// shows it with colour-by-system or colour-by-carbon, exploded view and a section cut, exports it as GLB with the quantities
// embedded, and reads GLB/glTF/OBJ/STL/IFC models back into meshes for the takeoff.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { levelZ, blockHeight, columnGrid } from './engine.js';
import { FACADES } from './library.js';
import { meshStats, guessUnits } from './mesh.js';

export const GROUP_COLORS = {
  Substructure: '#6b6b66', Superstructure: '#9a9a94', 'Exterior enclosure': '#b07a3e', Roofing: '#4d4d4a', Interiors: '#d8d4c8', Services: '#00b5e2', Sitework: '#c49a8a', 'Construction process': '#555', Unclassified: '#ff1f8b'
};

/* ------------------------------------------------------------------ generate */

const P = (x, y, z) => new THREE.Vector3(x, z, -y); // plan (x east, y north, z up) → three (y up, -z north)

function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }

// Build a model from the building description. Every mesh is tagged with its takeoff component AND its material, so the Model
// tab can list, hide, colour and explode materials one at a time. Materials buried inside another (rebar, mesh) have no mesh.
export function buildFromBuilding(B, T) {
  const root = new THREE.Group(); root.name = B.name || 'Building';
  const comp = (id) => T.components.find((c) => c.id === id);
  const mats = {};
  const mat = (k, color, extra = {}) => (mats[k] ||= new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, name: k, ...extra }));
  const tag = (o, id, m, explode = [0, 0, 0]) => { const c = comp(id); o.userData.componentId = id; o.userData.group = c?.group; o.userData.mat = m; o.userData.explode = explode; o.name = c ? `${id} · ${c.name} · ${m || ''}` : id; root.add(o); return o; };
  const declare = (c) => { const n = new THREE.Object3D(); n.name = `LT ${c.id}`; n.userData.lt = { componentId: c.id, name: c.name, code: c.code, group: c.group, qty: c.qty, layers: c.layers, life: c.life, b2: c.b2, site: c.site, geom: c.geom, unit: c.unit, calc: c.calc, gfa: T.gfa }; root.add(n); };
  for (const c of T.components) declare(c);

  const st = B.structure || {};
  const concK = st.concrete || 'concrete', steelK = st.steel || 'steel-section', encK = st.encasementMix || concK;
  const conc = mat('concrete', '#a7a7a2'), steel = mat('steel', '#55606b', { metalness: 0.4 }), slabM = mat('slab', '#c9c9c4');
  const fac = FACADES[B.facade?.system] || FACADES['aluminium-cw'];
  const sysK = B.facade?.system || 'aluminium-cw';
  const frameK = fac.layers[0][0], glassK = fac.glass[0];
  const frameColor = sysK === 'bronze-cw' ? '#9b6a3a' : sysK.startsWith('aluminium') ? '#9aa3ab' : sysK === 'brick' ? '#8c4a32' : sysK === 'stone' ? '#c8bfae' : '#b9b5aa';
  const frameM = mat('facade-frame', frameColor, { metalness: sysK.endsWith('cw') ? 0.45 : 0.05, roughness: 0.4 });
  const glassM = mat('glass', sysK === 'bronze-cw' ? '#a08a72' : '#9fc3d3', { transparent: true, opacity: 0.32, roughness: 0.05, metalness: 0.2, depthWrite: false });
  const roofM = mat('roof', '#3a3a38');
  const has = (id) => Boolean(comp(id));
  const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  // substructure
  const bs = B.basement;
  if (bs?.levels) { const h = bs.levels * bs.f2f; const m = box(bs.w, h, bs.d, mat('basement', '#6b6b66', { transparent: true, opacity: 0.35, depthWrite: false })); m.position.copy(P(bs.x + bs.w / 2, bs.y + bs.d / 2, -h / 2)); tag(m, 'A2020', concK, [0, -12, 0]); }
  const fBase = bs ? -bs.levels * bs.f2f : 0;
  const fp = bs || B.blocks.find((b) => !b.z0) || B.blocks[0];
  { const m = box(fp.w, 0.9, fp.d, conc); m.position.copy(P(fp.x + fp.w / 2, fp.y + fp.d / 2, fBase - 0.45)); tag(m, 'A1010', concK, [0, -20, 0]); }

  const enc = has('B1010-F') || Boolean(st.encasement && st.frame !== 'concrete');
  for (const b of B.blocks) {
    const zs = levelZ(b);
    const top = (b.z0 || 0) + blockHeight(b);
    // slabs at every level and the roof
    const nSlab = zs.length;
    const slabs = new THREE.InstancedMesh(new THREE.BoxGeometry(b.w, 0.25, b.d), st.slab === 'clt' ? mat('clt', '#c8a46e') : slabM, nSlab);
    zs.forEach(([z1], i) => { mm.makeTranslation(...P(b.x + b.w / 2, b.y + b.d / 2, z1).toArray()); slabs.setMatrixAt(i, mm); });
    tag(slabs, 'B1010-S', st.slab === 'clt' ? 'clt' : st.slabMix || concK);
    if ((st.slab || 'deck') === 'deck' && st.frame !== 'concrete') {
      const deck = new THREE.InstancedMesh(new THREE.BoxGeometry(b.w * 0.995, 0.06, b.d * 0.995), mat('deck', '#7d868d', { metalness: 0.5 }), nSlab);
      zs.forEach(([z1], i) => { mm.makeTranslation(...P(b.x + b.w / 2, b.y + b.d / 2, z1 - 0.16).toArray()); deck.setMatrixAt(i, mm); });
      tag(deck, 'B1010-S', 'steel-deck');
    }
    // columns: steel section inside, concrete encasement outside when encased
    const { cols } = columnGrid(b);
    const h = top - (b.z0 || 0);
    const colK = st.frame === 'concrete' ? concK : st.frame === 'timber' ? 'clt' : steelK;
    const colM = new THREE.InstancedMesh(new THREE.BoxGeometry(enc ? 0.4 : 0.6, h, enc ? 0.4 : 0.6), st.frame === 'concrete' ? conc : st.frame === 'timber' ? mat('clt', '#c8a46e') : steel, cols.length);
    cols.forEach((c, i) => { mm.makeTranslation(...P(c.x, c.y, (b.z0 || 0) + h / 2).toArray()); colM.setMatrixAt(i, mm); });
    tag(colM, 'B1010-C', colK);
    if (enc) {
      const encM = new THREE.InstancedMesh(new THREE.BoxGeometry(0.75, h, 0.75), mat('encasement', '#8f8f8a', { transparent: true, opacity: 0.9 }), cols.length);
      cols.forEach((c, i) => { mm.makeTranslation(...P(c.x, c.y, (b.z0 || 0) + h / 2).toArray()); encM.setMatrixAt(i, mm); });
      tag(encM, 'B1010-C', encK);
    }
    // beams along both grid directions at every level
    const xs = [...new Set(cols.map((c) => +c.x.toFixed(3)))], ys = [...new Set(cols.map((c) => +c.y.toFixed(3)))];
    const nb = zs.length * (xs.length * (ys.length - 1) + ys.length * (xs.length - 1));
    const mk = (w, hh, d, material) => new THREE.InstancedMesh(new THREE.BoxGeometry(1, hh, d), material, Math.max(1, nb));
    const beams = mk(1, 0.45, 0.2, st.frame === 'concrete' ? conc : steel), beamEnc = enc ? mk(1, 0.6, 0.45, mat('encasement', '#8f8f8a', { transparent: true, opacity: 0.9 })) : null;
    let k = 0;
    for (const [z] of zs.slice(1).concat([[top]])) {
      for (const x of xs) for (let j = 0; j < ys.length - 1; j++) { q.setFromAxisAngle(up, Math.PI / 2); sc.set(ys[j + 1] - ys[j], 1, 1); mm.compose(P(x, (ys[j] + ys[j + 1]) / 2, z - 0.45), q, sc); beams.setMatrixAt(k, mm); beamEnc?.setMatrixAt(k, mm); k++; }
      for (const y of ys) for (let i = 0; i < xs.length - 1; i++) { q.identity(); sc.set(xs[i + 1] - xs[i], 1, 1); mm.compose(P((xs[i] + xs[i + 1]) / 2, y, z - 0.45), q, sc); beams.setMatrixAt(k, mm); beamEnc?.setMatrixAt(k, mm); k++; }
    }
    beams.count = k; tag(beams, 'B1010-B', colK);
    if (beamEnc) { beamEnc.count = k; tag(beamEnc, 'B1010-B', encK); }
    // curtain wall: glass skin, mullions on the module, spandrel bands at each floor
    const out = 0.15;
    const faces = [[b.x + b.w / 2, b.y - out, b.w, 0], [b.x + b.w / 2, b.y + b.d + out, b.w, 0], [b.x - out, b.y + b.d / 2, b.d, 1], [b.x + b.w + out, b.y + b.d / 2, b.d, 1]];
    const n = B.facade?.module || (sysK === 'bronze-cw' ? 1.41 : 1.5);
    let mullCount = 0; for (const [, , len] of faces) mullCount += Math.floor(len / n) + 1;
    const mull = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, h, 0.16), frameM, mullCount);
    const span = new THREE.InstancedMesh(new THREE.BoxGeometry(1, sysK.endsWith('cw') ? 0.9 : 1.8, 0.06), frameM, faces.length * zs.length);
    let mi = 0, si = 0;
    for (const [cx, cy, len, rot] of faces) {
      const g = box(len, h, 0.02, glassM); g.position.copy(P(cx, cy, (b.z0 || 0) + h / 2)); if (rot) g.rotation.y = Math.PI / 2; tag(g, 'B2010', glassK, [rot ? (cx > b.x + b.w / 2 ? 6 : -6) : 0, 0, rot ? 0 : (cy > b.y + b.d / 2 ? -6 : 6)]);
      for (let a = 0; a <= len + 1e-6; a += n) { const px = rot ? cx : cx - len / 2 + a, py = rot ? cy - len / 2 + a : cy; q.setFromAxisAngle(up, rot ? Math.PI / 2 : 0); sc.set(1, 1, 1); mm.compose(P(px, py, (b.z0 || 0) + h / 2), q, sc); mull.setMatrixAt(mi++, mm); }
      for (const [z] of zs.slice(1).concat([[top - 0.45]])) { q.setFromAxisAngle(up, rot ? Math.PI / 2 : 0); sc.set(len, 1, 1); mm.compose(P(cx, cy, z - 0.2), q, sc); span.setMatrixAt(si++, mm); }
    }
    mull.count = mi; span.count = si;
    tag(mull, 'B2010', frameK); tag(span, 'B2010', frameK);
    // roof: membrane over insulation
    const r = box(b.w, 0.12, b.d, roofM); r.position.copy(P(b.x + b.w / 2, b.y + b.d / 2, top + 0.3)); tag(r, 'B3010', 'membrane', [0, 8, 0]);
    const ins = box(b.w * 0.98, 0.15, b.d * 0.98, mat('insulation', '#d9cf9a')); ins.position.copy(P(b.x + b.w / 2, b.y + b.d / 2, top + 0.15)); tag(ins, 'B3010', 'mineral-wool', [0, 4, 0]);
  }
  // cores, with stone cladding on the spine and lift cars inside the lift core
  for (const c of B.cores || []) {
    const host = B.blocks.find((b) => b.id === c.blockId) || B.blocks[0];
    const zs = levelZ(host); const h = c.toLevel ? zs[Math.min(c.toLevel, zs.length) - 1][1] : blockHeight(host);
    const t = c.t || 0.3;
    const cm = mat('core', '#8d8d87');
    for (const [x, y, w, d] of [[c.x + c.w / 2, c.y + t / 2, c.w, t], [c.x + c.w / 2, c.y + c.d - t / 2, c.w, t], [c.x + t / 2, c.y + c.d / 2, t, c.d], [c.x + c.w - t / 2, c.y + c.d / 2, t, c.d]]) {
      const m = box(w, h, d, cm); m.position.copy(P(x, y, (host.z0 || 0) + h / 2)); tag(m, `B1010-W-${c.id}`, concK);
    }
    const sec = (B.facade?.secondary || []).find((s) => s.id === c.id);
    if (sec) {
      const hh = blockHeight(host);
      for (const [x, y, w, d] of [[c.x + c.w / 2, c.y - 0.06, c.w, 0.08], [c.x + c.w / 2, c.y + c.d + 0.06, c.w, 0.08], [c.x + c.w + 0.06, c.y + c.d / 2, 0.08, c.d]]) {
        const m = box(w, hh, d, mat('marble', '#3f6b55', { roughness: 0.3 })); m.position.copy(P(x, y, (host.z0 || 0) + hh / 2)); tag(m, `B2010-${sec.id}`, sec.material, [8, 0, 0]);
      }
    }
    if (/lift/i.test(c.id) && B.services?.lifts && has('D1010')) {
      const nL = B.services.lifts, cars = new THREE.InstancedMesh(new THREE.BoxGeometry(2, 2.4, 2.2), mat('lift', '#00b5e2', { metalness: 0.3 }), nL);
      const H = blockHeight(host);
      for (let i = 0; i < nL; i++) { const col = i % 3, row = Math.floor(i / 3); mm.makeTranslation(...P(c.x + 1.6 + col * (c.w - 3.2) / 2, c.y + 1.6 + (row % 6) * (c.d - 3.2) / 5, (host.z0 || 0) + 1.5 + ((i * 37) % 100) / 100 * (H - 4)).toArray()); cars.setMatrixAt(i, mm); }
      tag(cars, 'D1010', 'lift');
    }
  }
  // lobby: travertine walls around the core at ground level, granite floor
  const tower = B.blocks.find((b) => b.kind === 'tower');
  const lift = (B.cores || []).find((c) => /lift/i.test(c.id)) || (B.cores || [])[0];
  for (const fi of B.interiors?.finishes || []) {
    if (!tower) break;
    const g0 = tower.firstF2F || tower.f2f;
    if (fi.material === 'travertine' && lift) {
      for (const [x, y, w, d] of [[lift.x + lift.w / 2, lift.y - 0.05, lift.w, 0.06], [lift.x + lift.w / 2, lift.y + lift.d + 0.05, lift.w, 0.06], [lift.x - 0.05, lift.y + lift.d / 2, 0.06, lift.d]]) {
        const m = box(w, g0 - 0.3, d, mat('travertine', '#d8c9a8')); m.position.copy(P(x, y, (g0 - 0.3) / 2)); tag(m, `C30-${fi.id}`, 'travertine', [-6, 0, 0]);
      }
    } else if (fi.material === 'granite') {
      const m = box(tower.w - 1, 0.04, tower.d - 1, mat('granite-floor', '#b88c80')); m.position.copy(P(tower.x + tower.w / 2, tower.y + tower.d / 2, 0.14)); tag(m, `C30-${fi.id}`, 'granite', [0, 3, 0]);
    }
  }
  // site
  if (tower && B.site?.paving?.length) {
    const pz = { x: 0.3, y: tower.y, w: tower.x - 0.6, d: tower.d };
    const plaza = B.site.paving.find((p) => p.id === 'plaza') || B.site.paving[0];
    const m = box(pz.w, 0.15, pz.d, mat('granite', '#b88c80')); m.position.copy(P(pz.x + pz.w / 2, pz.y + pz.d / 2, 0.075)); tag(m, `G2030-${plaza.id}`, plaza.material, [-6, 0, 0]);
    const par = B.site.paving.find((p) => p.id === 'parapet');
    if (par) for (const y of [pz.y - 0.3, pz.y + pz.d + 0.3]) { const w = box(pz.w * 0.95, 1.1, 0.6, mat('marble-parapet', '#3f6b55', { roughness: 0.3 })); w.position.copy(P(pz.x + pz.w / 2, y, 0.55)); tag(w, `G2030-${par.id}`, par.material, [0, 0, y < pz.y ? 6 : -6]); }
    (B.site.pools || []).forEach((p, i) => {
      const qd = Math.min(p.d, pz.d / 2 - 3);
      const py = i === 0 ? pz.y + 1.5 : pz.y + pz.d - 1.5 - qd, px = pz.x + (pz.w - p.w) / 2;
      const w = box(p.w, 0.5, qd, mat('pool', '#5c6f74')); w.position.copy(P(px + p.w / 2, py + qd / 2, 0.25)); tag(w, 'G2050', concK, [-6, 0, 0]);
      const wt = box(p.w - 0.6, 0.05, qd - 0.6, mat('water', '#3f7f96', { roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.8 })); wt.position.copy(P(px + p.w / 2, py + qd / 2, 0.52)); tag(wt, 'G2050', null, [-6, 0, 0]);
    });
  }
  root.userData.building = B.name;
  return root;
}

/* ------------------------------------------------------------------ viewer */

export function createViewer(el) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#0b0b0b');
  try { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 1.0; } catch { /* lights alone */ }
  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 5000);
  const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true;
  scene.add(new THREE.HemisphereLight('#ffffff', '#3a3a3a', 1.4));
  const sun = new THREE.DirectionalLight('#ffffff', 1.6); sun.position.set(-120, 220, 160); scene.add(sun);
  const grid = new THREE.GridHelper(600, 60, '#2a2a2a', '#1a1a1a'); scene.add(grid);
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e5);
  let model = null, pickCb = null, selected = null;
  const base = new Map();

  function resize() { const w = el.clientWidth || 600, h = el.clientHeight || 400; renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%'; camera.aspect = w / h; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(el); resize();
  let raf = 0; const loop = () => { raf = requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); }; loop();

  function fit() {
    if (!model) return;
    const bb = new THREE.Box3().setFromObject(model); const c = bb.getCenter(new THREE.Vector3()), s = bb.getSize(new THREE.Vector3());
    const r = Math.max(s.x, s.y, s.z);
    controls.target.copy(c); camera.position.set(c.x - r * 1.15, c.y + r * 0.35, c.z + r * 1.25); camera.near = r / 500; camera.far = r * 20; camera.updateProjectionMatrix();
    grid.position.y = bb.min.y - 0.01;
  }
  // per-instance base matrices so instanced meshes (columns, mullions) can explode element by element
  const baseInst = new Map();
  let center = new THREE.Vector3(), span = 50;
  const matExplode = {}; let globalExplode = 0; const hidden = new Set();
  function setModel(g) {
    if (model) scene.remove(model);
    model = g; base.clear(); baseInst.clear();
    model.traverse((o) => {
      if (!o.isMesh) return;
      base.set(o, o.position.clone());
      if (o.isInstancedMesh) { const arr = []; const m4 = new THREE.Matrix4(); for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m4); arr.push(m4.clone()); } baseInst.set(o, arr); }
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of ms) { m.clippingPlanes = [clip]; m.userData.orig ||= m.color?.clone(); }
    });
    scene.add(model); fit();
    const bb = new THREE.Box3().setFromObject(model); bb.getCenter(center); const sz = bb.getSize(new THREE.Vector3()); span = Math.max(sz.x, sz.z, 20);
  }
  // Colour each mesh: 'real' keeps the rendered materials; 'material' and 'system' take a colour per key from the caller
  function color(mode, colorOf = () => '#888') {
    if (!model) return;
    model.traverse((o) => {
      if (!o.isMesh) return;
      if (!o.userData.shared) { o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone(); o.userData.shared = true; }
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        m.clippingPlanes = [clip];
        if (mode === 'real' || (mode === 'material' && !o.userData.mat)) m.color.copy(m.userData.orig || m.color);
        else m.color.set(colorOf(mode === 'material' ? o.userData.mat : o.userData.group) || '#555');
      }
    });
  }
  function applyExplode() {
    if (!model) return;
    const v = new THREE.Vector3(), p = new THREE.Vector3(), qq = new THREE.Quaternion(), s3 = new THREE.Vector3(), m4 = new THREE.Matrix4();
    for (const [o, p0] of base) {
      const fm = matExplode[`mat:${o.userData.mat}`] || matExplode[`group:${o.userData.group}`] || 0, e = o.userData.explode || [0, 0, 0];
      o.visible = !hidden.has(`mat:${o.userData.mat}`) && !hidden.has(`group:${o.userData.group}`);
      if (o.isInstancedMesh) {
        const arr = baseInst.get(o);
        arr.forEach((b0, i) => {
          b0.decompose(p, qq, s3);
          v.set(p.x - center.x, 0, p.z - center.z); const len = v.length() || 1; v.divideScalar(len);
          const d = fm * (span * 0.22 + len * 0.4);
          m4.compose(new THREE.Vector3(p.x + v.x * d, p.y + fm * 6, p.z + v.z * d), qq, s3); o.setMatrixAt(i, m4);
        });
        o.instanceMatrix.needsUpdate = true;
        o.position.set(p0.x + e[0] * globalExplode, p0.y + e[1] * globalExplode, p0.z + e[2] * globalExplode);
      } else {
        v.set(p0.x - center.x, 0, p0.z - center.z); const len = v.length() || 1; v.divideScalar(len);
        const d = fm * (span * 0.22 + len * 0.4);
        o.position.set(p0.x + e[0] * globalExplode + v.x * d, p0.y + e[1] * globalExplode + fm * 6, p0.z + e[2] * globalExplode + v.z * d);
      }
    }
  }
  function explode(f) { globalExplode = f; applyExplode(); }
  function explodeMaterial(key, f) { matExplode[key] = f; applyExplode(); }
  function setHidden(keys) { hidden.clear(); for (const k of keys) hidden.add(k); applyExplode(); }
  function cut(y) { clip.constant = y; }
  function highlight(id, by = 'componentId') {
    selected = null;
    model?.traverse((o) => { if (o.isMesh) { const on = id && o.userData[by] === id; (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.emissive?.set(on ? '#5a0a30' : '#000')); } });
  }
  function materialsPresent() { const c = {}; model?.traverse((o) => { if (o.isMesh && o.userData.mat) c[o.userData.mat] = (c[o.userData.mat] || 0) + (o.isInstancedMesh ? o.count : 1); }); return c; }
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 4 || !model) return;
    const r = renderer.domElement.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObject(model, true).find((h) => h.object.visible && !(h.object.material?.opacity < 0.5 && h.object.userData.componentId === 'A2020'));
    const id = hit?.object.userData.componentId || hit?.object.userData.ltClass || null;
    if (hit?.object.userData.mat) highlight(hit.object.userData.mat, 'mat'); else highlight(id); pickCb?.(id, hit?.object);
  });
  async function exportGLB() {
    const ex = new GLTFExporter();
    return new Promise((res, rej) => ex.parse(model, (b) => res(new Blob([b], { type: 'model/gltf-binary' })), rej, { binary: true }));
  }
  function bounds() { if (!model) return null; return new THREE.Box3().setFromObject(model); }
  function snapshot() { renderer.render(scene, camera); return renderer.domElement.toDataURL('image/png'); }
  return { setModel, color, explode, explodeMaterial, setHidden, materialsPresent, cut, highlight, fit, exportGLB, bounds, snapshot, onPick: (cb) => { pickCb = cb; }, dispose: () => { cancelAnimationFrame(raf); renderer.dispose(); }, get model() { return model; } };
}

/* ------------------------------------------------------------------ read */

// Collect meshes from any three.js scene, in metres, ready for mesh.js
export function sceneToMeshes(root, unitsOverride, { ignoreDeclared = false } = {}) {
  root.updateMatrixWorld(true);
  const meshes = [];
  const declared = [];
  root.traverse((o) => { if (o.userData?.lt) declared.push(o.userData.lt); });
  if (declared.length && !ignoreDeclared) return { meshes: declared.map((d) => ({ declared: d, name: d.name, stats: null })), units: { f: 1, name: 'declared in model' }, declared: true };
  const bb = new THREE.Box3().setFromObject(root), s = bb.getSize(new THREE.Vector3());
  const units = unitsOverride || guessUnits(Math.max(s.x, s.y, s.z));
  const v = new THREE.Vector3();
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry?.attributes?.position) return;
    const g = o.geometry, pa = g.attributes.position, idx = g.index ? g.index.array : null;
    const inst = o.isInstancedMesh ? o.count : 1;
    for (let k = 0; k < inst; k++) {
      const mw = new THREE.Matrix4();
      if (o.isInstancedMesh) { o.getMatrixAt(k, mw); mw.premultiply(o.matrixWorld); } else mw.copy(o.matrixWorld);
      const pos = new Float32Array(pa.count * 3);
      for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(mw).multiplyScalar(units.f); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; }
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      meshes.push({ name: o.name || o.parent?.name || '', material: m?.name || '', transparent: Boolean(m?.transparent && m.opacity < 0.9), ifcType: o.userData.ifcType, stats: meshStats(pos, idx), obj: o });
    }
  });
  return { meshes, units, declared: false };
}

const IFC_TYPES = ['IFCWALL', 'IFCWALLSTANDARDCASE', 'IFCSLAB', 'IFCCOLUMN', 'IFCBEAM', 'IFCMEMBER', 'IFCPLATE', 'IFCCURTAINWALL', 'IFCWINDOW', 'IFCDOOR', 'IFCROOF', 'IFCSTAIR', 'IFCSTAIRFLIGHT', 'IFCRAMP', 'IFCRAILING', 'IFCFOOTING', 'IFCPILE', 'IFCCOVERING', 'IFCBUILDINGELEMENTPROXY'];

// IFC through web-ifc (That Open Company), loaded on demand from the CDN
async function loadIFC(buf, onProgress) {
  onProgress?.('Loading the IFC engine…');
  const WebIFC = await import('https://cdn.jsdelivr.net/npm/web-ifc@0.0.78/web-ifc-api.js');
  const api = new WebIFC.IfcAPI();
  api.SetWasmPath('https://cdn.jsdelivr.net/npm/web-ifc@0.0.78/', true);
  await api.Init();
  const id = api.OpenModel(new Uint8Array(buf));
  onProgress?.('Reading IFC elements…');
  const typeOf = new Map(), nameOf = new Map(), matOf = new Map();
  for (const t of IFC_TYPES) {
    const code = WebIFC[t]; if (code === undefined) continue;
    const ids = api.GetLineIDsWithType(id, code);
    for (let i = 0; i < ids.size(); i++) { const e = ids.get(i); typeOf.set(e, t); try { nameOf.set(e, api.GetLine(id, e)?.Name?.value || ''); } catch { /* unnamed */ } }
  }
  try {
    const rels = api.GetLineIDsWithType(id, WebIFC.IFCRELASSOCIATESMATERIAL);
    for (let i = 0; i < rels.size(); i++) {
      const r = api.GetLine(id, rels.get(i), true);
      let m = r.RelatingMaterial, name = m?.Name?.value;
      if (!name && m?.ForLayerSet) name = m.ForLayerSet.MaterialLayers?.[0]?.Material?.Name?.value;
      if (!name && m?.MaterialLayers) name = m.MaterialLayers?.[0]?.Material?.Name?.value;
      if (!name && m?.Materials) name = m.Materials?.[0]?.Name?.value;
      for (const o of r.RelatedObjects || []) if (name) matOf.set(o.value, name);
    }
  } catch { /* materials are optional */ }
  const root = new THREE.Group(); root.name = 'IFC model';
  const mats = {};
  api.StreamAllMeshes(id, (mesh) => {
    const eid = mesh.expressID;
    const geoms = mesh.geometries;
    for (let i = 0; i < geoms.size(); i++) {
      const pg = geoms.get(i);
      const geo = api.GetGeometry(id, pg.geometryExpressID);
      const vv = api.GetVertexArray(geo.GetVertexData(), geo.GetVertexDataSize());
      const ii = api.GetIndexArray(geo.GetIndexData(), geo.GetIndexDataSize());
      const pos = new Float32Array(vv.length / 2), nor = new Float32Array(vv.length / 2);
      for (let k = 0; k < vv.length / 6; k++) { pos[k * 3] = vv[k * 6]; pos[k * 3 + 1] = vv[k * 6 + 1]; pos[k * 3 + 2] = vv[k * 6 + 2]; nor[k * 3] = vv[k * 6 + 3]; nor[k * 3 + 1] = vv[k * 6 + 4]; nor[k * 3 + 2] = vv[k * 6 + 5]; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(new THREE.BufferAttribute(new Uint32Array(ii), 1));
      const c = pg.color, key = `${c.x.toFixed(2)}${c.y.toFixed(2)}${c.z.toFixed(2)}${c.w.toFixed(2)}`;
      const m = (mats[key] ||= new THREE.MeshStandardMaterial({ color: new THREE.Color(c.x, c.y, c.z), transparent: c.w < 0.99, opacity: c.w, side: THREE.DoubleSide, name: matOf.get(eid) || '' }));
      const me = new THREE.Mesh(g, m.name === (matOf.get(eid) || '') ? m : m.clone());
      me.material.name = matOf.get(eid) || '';
      me.matrix.fromArray(pg.flatTransformation); me.matrixAutoUpdate = false;
      me.name = nameOf.get(eid) || ''; me.userData.ifcType = typeOf.get(eid) || 'IFCBUILDINGELEMENTPROXY'; me.userData.expressID = eid;
      root.add(me);
      geo.delete?.();
    }
  });
  api.CloseModel(id);
  return { root, units: { f: 1, name: 'metres (IFC)' } };
}

export async function loadModelFile(file, onProgress) {
  const ext = file.name.split('.').pop().toLowerCase();
  const buf = await file.arrayBuffer();
  if (ext === 'ifc') return loadIFC(buf, onProgress);
  if (ext === '3dm') {
    onProgress?.('Loading the Rhino engine…');
    const { Rhino3dmLoader } = await import('three/addons/loaders/3DMLoader.js');
    const loader = new Rhino3dmLoader(); loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.4.0/');
    const obj = await new Promise((res, rej) => loader.parse(buf, res, rej));
    obj.traverse((m) => { if (m.isMesh) { const n = m.userData?.attributes?.name || m.name; m.name = n || m.parent?.name || ''; const layer = m.userData?.attributes?.layerIndex; const L = obj.userData?.layers?.[layer]; if (L?.name && !m.name) m.name = L.name; if (L?.name) m.userData.layer = L.name; const mm = Array.isArray(m.material) ? m.material[0] : m.material; if (mm && !mm.name && L?.name) mm.name = L.name; } });
    obj.rotation.x = -Math.PI / 2; obj.updateMatrixWorld(true);
    const units = { 0: null, 1: { f: 1e-6, name: 'microns' }, 2: { f: 0.001, name: 'millimetres' }, 3: { f: 0.01, name: 'centimetres' }, 4: { f: 1, name: 'metres' }, 8: { f: 0.0254, name: 'inches' }, 9: { f: 0.3048, name: 'feet' } }[obj.userData?.settings?.modelUnitSystem?.value ?? obj.userData?.settings?.modelUnitSystem] || null;
    return { root: obj, units };
  }
  if (ext === 'glb' || ext === 'gltf') { const g = await new GLTFLoader().parseAsync(buf, ''); return { root: g.scene }; }
  if (ext === 'obj') { const o = new OBJLoader().parse(new TextDecoder().decode(buf)); o.traverse((m) => { if (m.isMesh) m.material = new THREE.MeshStandardMaterial({ color: '#aaa', name: Array.isArray(m.material) ? m.material[0]?.name : m.material?.name }); }); return { root: o }; }
  if (ext === 'stl') { const g = new STLLoader().parse(buf); const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#aaa' })); m.name = file.name.replace(/\.stl$/i, ''); const r = new THREE.Group(); r.add(m); return { root: r }; }
  throw new Error(`Unsupported 3D format .${ext}. Use 3DM, IFC, GLB, glTF, OBJ or STL.`);
}

// Colour an imported model by its classified group and tag meshes so picking works
export function tagImported(meshes, groups) {
  for (const m of meshes) {
    if (!m.obj || !m.cls) continue;
    m.obj.userData.componentId = `3D-${m.cls}-${m.mat}`; m.obj.userData.group = groups[m.cls] || 'Unclassified'; m.obj.userData.explode = [0, 0, 0]; m.obj.userData.mat = m.mat;
  }
}
