// Sun & Wind Lab — Google Photorealistic 3D Tiles as visual context around the analysis model.
// Optional Google Photorealistic 3D Tiles. Needs a Google Maps Platform key (Map Tiles API enabled).
// The tiles are for looking only: the simulations keep running on the site's own massing, because Google's terms
// do not allow extracting geometry from the tiles.
import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const LIB = 'https://cdn.jsdelivr.net/npm/3d-tiles-renderer@0.5.4/build/';
const DRACO = 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/gltf/';

// Fallback anchor (Seagram slab centre) if the georeferenced context is missing; normally the page passes the
// slab centre computed from NYC's surveyed footprint, so the tiles land in the right place without nudging.
export const ANCHOR = { lat: 40.75846, lon: -73.97197, height: -14 };
const STORE = 'swl-photoreal-align';

export async function fetchKey() {
  // Option 1: set window.GOOGLE_MAPS_KEY in index.html (use a key restricted to your domain).
  if (typeof window !== 'undefined' && window.GOOGLE_MAPS_KEY) return window.GOOGLE_MAPS_KEY;
  // Option 2: serve it from your own endpoint returning { "googleKey": "..." }.
  try {
    const r = await fetch('/api/earth-twin/config', { credentials: 'same-origin' });
    if (!r.ok) return null;
    const j = await r.json();
    return j.googleKey || null;
  } catch { return null; }
}

export function loadAlign() {
  try { return { de: 0, dn: 0, rot: 0, dz: null, ...JSON.parse(localStorage.getItem(STORE) || '{}') }; } catch { return { de: 0, dn: 0, rot: 0, dz: null }; }
}
export function saveAlign(a) { try { localStorage.setItem(STORE, JSON.stringify(a)); } catch { /* private window */ } }

// Creates the tiles under a parent group placed in the site's grid frame.
//   gridRotDeg: Manhattan grid rotation; anchor3: scene position of the anchor (tower centre at ground level)
export async function createPhotoreal({ key, camera, renderer, anchor3, anchorLL = null, gridRotDeg, onAttribution }) {
  const ll = anchorLL || ANCHOR;
  const [{ TilesRenderer }, P] = await Promise.all([import(`${LIB}index.three.js`), import(`${LIB}index.plugins.js`)]);
  const tiles = new TilesRenderer();
  tiles.registerPlugin(new P.GoogleCloudAuthPlugin({ apiToken: key, autoRefreshToken: true, useRecommendedSettings: true }));
  const draco = new DRACOLoader().setDecoderPath(DRACO);
  tiles.registerPlugin(new P.GLTFExtensionsPlugin({ dracoLoader: draco }));
  tiles.registerPlugin(new P.TileCompressionPlugin());
  tiles.registerPlugin(new P.TilesFadePlugin());
  tiles.registerPlugin(new P.ReorientationPlugin({ lat: ll.lat * Math.PI / 180, lon: ll.lon * Math.PI / 180, height: 0, recenter: true }));
  tiles.errorTarget = 6;
  tiles.setCamera(camera);
  tiles.setResolutionFromRenderer(camera, renderer);

  // The plugin leaves X west, Z north, Y up. The scene has +X along the cross streets and −Z uptown,
  // so turn half a circle and then by the grid's 29°.
  const holder = new THREE.Group();
  holder.add(tiles.group);
  let align = loadAlign();
  const place = () => {
    holder.rotation.set(0, Math.PI + (gridRotDeg + align.rot) * Math.PI / 180, 0);
    const a = (gridRotDeg) * Math.PI / 180;
    // de / dn are true east / north metres, turned into the grid frame
    const du = align.de * Math.cos(a) - align.dn * Math.sin(a);
    const dv = align.de * Math.sin(a) + align.dn * Math.cos(a);
    holder.position.set(anchor3.x + du, (align.dz ?? -ANCHOR.height), anchor3.z - dv);
  };
  place();

  let grounded = align.dz != null;
  const ray = new THREE.Raycaster();
  // Find the ground under the plaza once enough detail has streamed in, so the tiles sit at the model's street level.
  const snapGround = (probe3) => {
    holder.updateMatrixWorld(true);
    ray.set(new THREE.Vector3(probe3.x, 600, probe3.z), new THREE.Vector3(0, -1, 0));
    const hits = ray.intersectObject(tiles.group, true);
    if (!hits.length) return false;
    // lowest of the first few hits is the pavement, not a lamp post or a car
    const y = Math.min(...hits.slice(0, 4).map((h) => h.point.y));
    align.dz = holder.position.y - y + 0.9;
    place(); saveAlign(align); grounded = true;
    return true;
  };

  tiles.addEventListener('load-model', () => { if (onAttribution) onAttribution(attribution()); });
  const attribution = () => {
    const list = tiles.getAttributions();
    return list.filter((a) => a.type === 'string').map((a) => a.value).join(' · ');
  };

  return {
    holder, tiles,
    update() { camera.updateMatrixWorld(); tiles.setResolutionFromRenderer(camera, renderer); tiles.update(); },
    tryGround(probe3) { return grounded ? true : snapGround(probe3); },
    resnap(probe3) { grounded = false; align.dz = null; place(); return snapGround(probe3); },
    nudge(d) { align = { ...align, de: align.de + (d.de || 0), dn: align.dn + (d.dn || 0), rot: align.rot + (d.rot || 0), dz: align.dz != null && d.dz ? align.dz + d.dz : align.dz }; place(); saveAlign(align); },
    reset() { align = { de: 0, dn: 0, rot: 0, dz: null }; grounded = false; place(); saveAlign(align); },
    get align() { return align; },
    attribution,
    dispose() { tiles.dispose(); draco.dispose(); },
  };
}
