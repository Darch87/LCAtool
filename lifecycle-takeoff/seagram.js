// Lifecycle Takeoff · test case: the Seagram Building, 375 Park Avenue, New York (Mies van der Rohe with Philip Johnson,
// Kahn & Jacobs, 1954–58). Mies's own drawings sit in the MoMA Mies van der Rohe Archive and are not ours to republish, so the
// tool reads a drawing set reconstructed here from published dimensions (sheet A-101, A-111, A-301 in data/). The reconstruction
// is indicative; the documented quantities below are the check the takeoff is calibrated against.
import { FT } from './engine.js';

export const SEAGRAM_FACTS = [
  { k: 'Height', v: '516 ft (157 m) to roof; 38 storeys plus a triple-height mechanical floor', src: 'wiki' },
  { k: 'Tower slab', v: '145 × 95 ft (44 × 29 m), recessed 90 ft (27 m) behind Park Avenue', src: 'wiki' },
  { k: 'Column grid', v: 'Steel columns at 27 ft 9 in (8.46 m) centres; 5 × 3 bays; 4 ft 7½ in office module', src: 'wiki' },
  { k: 'Rear blocks', v: '10-storey bustle (90 × 85 ft) between 4-storey wings on 52nd and 53rd Streets (90 × 200 ft)', src: 'wiki' },
  { k: 'Basements', v: 'Three levels below grade', src: 'wiki' },
  { k: 'Gross floor area', v: '849,014 sq ft (78,876 m²) including basements', src: 'wiki' },
  { k: 'Structure', v: 'Steel frame encased in concrete; concrete core shear walls to floor 17; diagonal core bracing to floor 29', src: 'wiki' },
  { k: 'Structural steel', v: 'Over 5,000 pieces weighing 25 million lb (≈11,340 t)', src: 'wiki' },
  { k: 'Curtain wall', v: '1,600 short tons (≈1,450 t) of bronze; Muntz-metal spandrels; I-section mullions 4½ × 6 in', src: 'wiki' },
  { k: 'Glass', v: '≈122,000 sq ft (11,300 m²) of tinted glass', src: 'wiki' },
  { k: 'Plaza', v: 'Pink granite plaza 90 × 150 ft with two pools 46 × 70 ft; green marble parapets', src: 'wiki' },
  { k: 'Lobby', v: 'Travertine walls and columns, granite floor shared with the plaza; 18 elevators in three corridors', src: 'wiki' },
  { k: 'Energy (2012)', v: 'Site EUI 221.7 kBtu/sq ft, ENERGY STAR score 3, on 795,168 sq ft benchmarked', src: 'gbig' }
];

export const SOURCES = {
  wiki: { name: 'Seagram Building, Wikipedia (dimensions, quantities and history compiled from NYC LPC, NRHP and press sources)', url: 'https://en.wikipedia.org/wiki/Seagram_Building' },
  gbig: { name: 'Green Building Information Gateway: 375 Park Ave (NYC LL84 benchmarking, calendar 2012)', url: 'https://www.gbig.org/buildings/64506/details' },
  moma: { name: 'MoMA, Mies van der Rohe Archive: Seagram Building drawings (originals, not reproduced here)', url: 'https://www.moma.org/collection/works/101880' }
};

const BAY = 27.75 * FT; // 8.458 m

// Plan coordinates in metres: x runs east from the Park Avenue lot line, y runs north from the 52nd Street lot line.
export const SEAGRAM = {
  id: 'seagram',
  name: 'Seagram Building',
  address: '375 Park Avenue, New York',
  year: 1958,
  existing: true,
  use: 'office',
  location: 'nyc',
  rsp: 60,
  era: 'pre1970',
  site: {
    lot: { w: 295 * FT, d: 200 * FT },
    paving: [
      { id: 'plaza', name: 'Pink granite plaza paving', material: 'granite', area: Math.round(90 * 150 * FT * FT), thk: 0.08 },
      { id: 'parapet', name: 'Green marble parapets on 52nd and 53rd Streets', material: 'marble', area: Math.round(2 * 3.75 * 180 * FT * FT), thk: 0.6 }
    ],
    pools: [{ w: 46 * FT, d: 70 * FT, depth: 0.6 }, { w: 46 * FT, d: 70 * FT, depth: 0.6 }]
  },
  blocks: [
    { id: 'tower', name: 'Tower slab', kind: 'tower', x: 90 * FT, y: (200 - 145) / 2 * FT, w: 95 * FT, d: 145 * FT, z0: 0, levels: 39, firstF2F: 24 * FT, f2f: 3.72, topF2F: 39 * FT, baysX: 3, baysY: 5, bayX: BAY, bayY: BAY, colInsetX: 0.3, colInsetY: (145 * FT - 5 * BAY) / 2 },
    { id: 'wings', name: 'Rear wings (52nd and 53rd Streets)', kind: 'podium', x: 185 * FT, y: 0, w: 90 * FT, d: 200 * FT, z0: 0, levels: 4, firstF2F: 24 * FT, f2f: 3.72, baysX: 3, baysY: 7 },
    { id: 'bustle', name: 'Central bustle', kind: 'podium', x: 185 * FT, y: (200 - 85) / 2 * FT, w: 90 * FT, d: 85 * FT, z0: 24 * FT + 3 * 3.72, levels: 6, f2f: 3.72, baysX: 3, baysY: 3 }
  ],
  cores: [
    { id: 'lift', name: 'Lift core (shear walls to floor 17)', blockId: 'tower', x: 90 * FT + 0.3 + BAY, y: (200 - 145) / 2 * FT + (145 * FT - 5 * BAY) / 2 + BAY, w: BAY, d: 3 * BAY, toLevel: 17, t: 0.3 },
    { id: 'spine', name: 'East spine (shear walls, emergency stair)', blockId: 'tower', x: 90 * FT + 0.3 + 3 * BAY, y: (200 - 145) / 2 * FT + (145 * FT - 5 * BAY) / 2 + BAY, w: 95 * FT - 0.3 - 3 * BAY, d: 3 * BAY, t: 0.3 }
  ],
  basement: { levels: 3, f2f: 3.5, x: 0, y: 0, w: 295 * FT, d: 200 * FT },
  structure: { frame: 'steel', slab: 'formed', slabThk: 0.15, encasement: true, steel: 'steel-section', concrete: 'concrete' },
  facade: {
    system: 'bronze-cw', vision: 0.6,
    secondary: [{ id: 'spine', name: 'Serpentine marble cladding on the spine', material: 'marble', area: 2900, thk: 0.03 }]
  },
  interiors: {
    partitions: 0.3,
    finishes: [
      { id: 'lobby-walls', name: 'Travertine lobby walls and column cladding', material: 'travertine', area: 900, thk: 0.03, code: 'C3010' },
      { id: 'lobby-floor', name: 'Granite lobby floor', material: 'granite', area: 1050, thk: 0.03, code: 'C3020' }
    ]
  },
  services: { lifts: 18, intensity: 1 },
  operational: { eui: 221.7, areaM2: Math.round(795168 * 0.09290304), shares: { elec: 0.55, steam: 0.45 }, grid: 'nyc', waterM3PerM2: 0.5, note: 'EUI from 2012 LL84 benchmarking; fuel split between grid electricity and Con Edison steam is an assumption.' },
  documented: { steelT: Math.round(25e6 * 0.45359237 / 1000), facadeMetalT: Math.round(1600 * 0.90718474), glassM2: Math.round(122000 * 0.09290304), gfaM2: 78876 }
};

// Project data that is not on the drawings: what a surveyor would take from the project file and published records.
// Applied on top of what the reader finds, each value listed with its source in the provenance table.
export const SEAGRAM_PROJECT = {
  name: SEAGRAM.name, address: SEAGRAM.address, year: SEAGRAM.year, existing: true,
  fields: [
    { k: 'Era', set: (B) => { B.era = 'pre1970'; }, v: 'Completed 1958: A7 steel, non-composite floors', src: 'project data: completion 1958 (wiki)' },
    { k: 'Location', set: (B) => { B.location = 'nyc'; if (B.operational) B.operational.grid = 'nyc'; }, v: 'New York City (LL97 coefficients)', src: 'project data: 375 Park Avenue' },
    { k: 'Floor slabs', set: (B) => { B.structure.slab = 'formed'; B.structure.slabThk = 0.15; }, v: 'Formed concrete, 150 mm (thickness assumed)', src: 'project data: utility ducts cast into concrete slabs (wiki)' },
    { k: 'Spine cladding', set: (B) => { B.facade.secondary = SEAGRAM.facade.secondary.map((s) => ({ ...s })); }, v: '2,900 m² serpentine marble (area estimated)', src: 'notes on A-111 + project data (wiki)' },
    { k: 'Vision glass share', set: (B) => { B.facade.vision = 0.6; }, v: '60% of curtain wall', src: 'estimate from the facade module; calibrated below' },
    { k: 'Lobby finishes', set: (B) => { B.interiors.finishes = SEAGRAM.interiors.finishes.map((f) => ({ ...f })); }, v: 'Travertine walls 900 m², granite floor 1,050 m² (areas estimated)', src: 'notes on A-111 + project data (wiki)' },
    { k: 'Marble parapets', set: (B) => { B.site.paving.push({ ...SEAGRAM.site.paving[1] }); B.site.paving[0].name = 'Pink granite plaza paving'; }, v: '2 × 180 ft green marble parapets', src: 'project data (wiki)' },
    { k: 'Operational energy', set: (B) => { B.operational = { ...SEAGRAM.operational }; }, v: 'Site EUI 221.7 kBtu/ft² (2012); 55% electricity, 45% district steam (split assumed)', src: 'LL84 benchmarking via GBIG (gbig)' },
    { k: 'Documented quantities', set: (B) => { B.documented = { ...SEAGRAM.documented }; }, v: '11,340 t steel · 1,451 t bronze · 11,334 m² glass · 78,876 m² GFA', src: 'published construction records (wiki)' }
  ]
};
