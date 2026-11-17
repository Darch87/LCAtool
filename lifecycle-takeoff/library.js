// Lifecycle Takeoff · material and system library.
// Generic, cradle-to-gate (A1–A3) factors in kgCO2e per kg, with a low–expected–high range. They are database-class values of the
// kind EC3 and One Click LCA fall back to when no product EPD is assigned (ICE v3-class generic data, European and North American
// industry-average EPDs). Each row carries its own transport, waste, end-of-life and Module D assumptions so every number in the
// lifecycle table can be traced back to one line here. Product-specific EPDs entered in the tool replace a row's A1–A3 value.

// Transport emission factors, kgCO2e per kg·km. Only used when the user chooses to fill undeclared A4/C2 with a project scenario
// (GLEC Framework-class averages); never mixed into EPD-declared values.
export const TRANSPORT = { truck: 0.000105, rail: 0.000028, ship: 0.000016 };

// Data-quality levels shown beside every row (after One Click LCA's data-quality rating and EC3's specific vs generic split)
export const DQ = {
  A: { label: 'Product-specific EPD', note: 'Third-party verified EPD for the exact product and plant.' },
  B: { label: 'Industry-average EPD', note: 'Sector or regional average EPD.' },
  C: { label: 'Generic database', note: 'Database-class generic factor (ICE v3-class). Use for early design.' },
  D: { label: 'Proxy', note: 'Area- or unit-based proxy where no material inventory exists (services, lifts).' }
};

/*
  key: {
    name, cat (display group), density kg/m3, a13 [low, expected, high] kgCO2e/kg,
    dq: data-quality level of the default factor, src: where the default comes from,
    a4: [[mode, km], …] default delivery legs, waste: A5 site waste rate (RICS defaults),
    c3, c4: kgCO2e/kg for processing and disposal at end of life, eol: share recovered for recycling or reuse,
    d: Module D benefit kgCO2e per kg recovered (negative = credit), bio: biogenic carbon stored kgCO2e/kg (reported, not netted)
  }
*/
export const MATERIALS = {
  'steel-section': { name: 'Structural steel sections (BF-BOF/EAF world mix)', cat: 'Metals', density: 7850, a13: [1.20, 1.55, 2.40], dq: 'C', src: 'ICE v3-class generic, world-average sections', a4: [['truck', 800]], waste: 0.01, c3: 0.0, c4: 0.0002, eol: 0.95, d: -0.90 },
  'steel-section-eaf': { name: 'Structural steel sections (EAF, high recycled content)', cat: 'Metals', density: 7850, a13: [0.45, 0.70, 1.00], dq: 'B', src: 'North American hot-rolled sections industry-average EPD class', a4: [['truck', 800]], waste: 0.01, c3: 0.0, c4: 0.0002, eol: 0.95, d: -0.25 },
  'steel-deck': { name: 'Galvanised steel deck', cat: 'Metals', density: 7850, a13: [2.00, 2.40, 2.90], dq: 'C', src: 'ICE v3-class generic, galvanised sheet', a4: [['truck', 600]], waste: 0.05, c3: 0.0, c4: 0.0002, eol: 0.90, d: -1.00 },
  'rebar': { name: 'Reinforcing steel', cat: 'Metals', density: 7850, a13: [0.75, 1.99, 2.60], dq: 'C', src: 'ICE v3-class generic, world-average rebar', a4: [['truck', 400]], waste: 0.05, c3: 0.0, c4: 0.0002, eol: 0.85, d: -0.60 },
  'bronze': { name: 'Architectural bronze / Muntz metal (copper alloy)', cat: 'Metals', density: 8500, a13: [2.40, 3.20, 4.50], dq: 'C', src: 'Copper-alloy proxy from ICE v3-class copper and brass', a4: [['truck', 1000]], waste: 0.01, c3: 0.0, c4: 0.0002, eol: 0.95, d: -2.00 },
  'aluminium': { name: 'Aluminium extrusions (European/US mix)', cat: 'Metals', density: 2700, a13: [3.50, 6.70, 10.50], dq: 'C', src: 'ICE v3-class generic aluminium; range spans recycled to primary extrusions', a4: [['truck', 1000]], waste: 0.01, c3: 0.0, c4: 0.0002, eol: 0.90, d: -4.50 },
  'concrete': { name: 'Structural concrete, Portland cement (≈32/40 MPa)', cat: 'Concrete', density: 2400, a13: [0.10, 0.13, 0.17], dq: 'C', src: 'ICE v3-class generic ready-mix; EC3 US baseline range', a4: [['truck', 30]], waste: 0.05, c3: 0.0011, c4: 0.0045, eol: 0.70, d: -0.0035 },
  'concrete-lowcarbon': { name: 'Structural concrete, 50% GGBS / low-clinker', cat: 'Concrete', density: 2400, a13: [0.055, 0.075, 0.10], dq: 'B', src: 'Industry-average low-carbon mix EPD class', a4: [['truck', 30]], waste: 0.05, c3: 0.0011, c4: 0.0045, eol: 0.70, d: -0.0035 },
  'concrete-light': { name: 'Lightweight / cinder fill concrete', cat: 'Concrete', density: 1800, a13: [0.10, 0.14, 0.18], dq: 'C', src: 'ICE v3-class generic lightweight concrete', a4: [['truck', 30]], waste: 0.05, c3: 0.0011, c4: 0.0045, eol: 0.60, d: -0.0030 },
  'glass': { name: 'Float glass, monolithic', cat: 'Glass', density: 2500, a13: [1.10, 1.44, 1.70], dq: 'C', src: 'ICE v3-class generic float glass', a4: [['truck', 1000]], waste: 0.05, c3: 0.0, c4: 0.0045, eol: 0.20, d: -0.10 },
  'glass-igu': { name: 'Insulating glass unit (glass, spacer, seals, coating)', cat: 'Glass', density: 2500, a13: [1.40, 1.75, 2.20], dq: 'C', src: 'Generic IGU, ÖKOBAUDAT-class per-m² values converted to per kg of glass', a4: [['truck', 1000]], waste: 0.05, c3: 0.0, c4: 0.0045, eol: 0.15, d: -0.08 },
  'granite': { name: 'Granite paving and cladding', cat: 'Stone', density: 2700, a13: [0.30, 0.70, 1.00], dq: 'C', src: 'ICE v3-class generic granite (cut, polished)', a4: [['ship', 6500], ['truck', 300]], waste: 0.05, c3: 0.0011, c4: 0.0045, eol: 0.50, d: -0.005 },
  'travertine': { name: 'Travertine (limestone) cladding and flooring', cat: 'Stone', density: 2500, a13: [0.05, 0.09, 0.20], dq: 'C', src: 'ICE v3-class generic limestone', a4: [['ship', 7000], ['truck', 300]], waste: 0.05, c3: 0.0011, c4: 0.0045, eol: 0.50, d: -0.005 },
  'marble': { name: 'Marble cladding', cat: 'Stone', density: 2700, a13: [0.08, 0.13, 0.25], dq: 'C', src: 'ICE v3-class generic marble', a4: [['ship', 7000], ['truck', 300]], waste: 0.05, c3: 0.0011, c4: 0.0045, eol: 0.50, d: -0.005 },
  'brick': { name: 'Clay brick', cat: 'Masonry', density: 1900, a13: [0.15, 0.21, 0.30], dq: 'C', src: 'ICE v3-class generic clay brick', a4: [['truck', 200]], waste: 0.20, c3: 0.0011, c4: 0.0045, eol: 0.60, d: -0.005 },
  'precast': { name: 'Precast concrete panels', cat: 'Concrete', density: 2400, a13: [0.15, 0.19, 0.26], dq: 'C', src: 'ICE v3-class generic precast', a4: [['truck', 200]], waste: 0.01, c3: 0.0011, c4: 0.0045, eol: 0.70, d: -0.0035 },
  'gypsum': { name: 'Gypsum plasterboard', cat: 'Finishes', density: 750, a13: [0.30, 0.39, 0.50], dq: 'C', src: 'ICE v3-class generic plasterboard', a4: [['truck', 300]], waste: 0.225, c3: 0.0, c4: 0.0257, eol: 0.30, d: -0.02 },
  'steel-stud': { name: 'Light-gauge steel studs', cat: 'Metals', density: 7850, a13: [2.00, 2.76, 3.20], dq: 'C', src: 'ICE v3-class generic galvanised steel', a4: [['truck', 500]], waste: 0.05, c3: 0.0, c4: 0.0002, eol: 0.90, d: -1.00 },
  'ceiling': { name: 'Acoustic ceiling tile and grid', cat: 'Finishes', density: 300, a13: [0.40, 0.60, 0.90], dq: 'C', src: 'Generic mineral-fibre ceiling EPD class', a4: [['truck', 500]], waste: 0.10, c3: 0.0, c4: 0.0257, eol: 0.20, d: -0.01 },
  'mineral-wool': { name: 'Mineral wool insulation', cat: 'Insulation', density: 100, a13: [1.00, 1.28, 1.60], dq: 'C', src: 'ICE v3-class generic mineral wool', a4: [['truck', 500]], waste: 0.05, c3: 0.0, c4: 0.0045, eol: 0.0, d: 0 },
  'membrane': { name: 'Bituminous roof membrane', cat: 'Roofing', density: 1100, a13: [0.60, 1.00, 1.50], dq: 'C', src: 'Generic bitumen membrane EPD class', a4: [['truck', 500]], waste: 0.05, c3: 0.0, c4: 0.01, eol: 0.0, d: 0 },
  'clt': { name: 'Cross-laminated timber (fossil only; biogenic reported separately)', cat: 'Timber', density: 480, a13: [0.20, 0.44, 0.60], dq: 'C', src: 'ICE v3-class generic CLT, biogenic carbon excluded', a4: [['ship', 6000], ['truck', 500]], waste: 0.05, c3: 0.0, c4: 0.0, eol: 0.6, d: -0.30, bio: -1.6 },
  'lift': { name: 'Passenger lift (traction, high-rise)', cat: 'Services', density: 7850, waste: 0, eol: 0.9, a4: [['ship', 9000], ['truck', 300]] },
  'chiller': { name: 'Water-cooled centrifugal chiller', cat: 'Services', density: 7850, waste: 0, eol: 0.9, a4: [['truck', 1500]] },
  'ahu': { name: 'Air-handling unit', cat: 'Services', density: 7850, waste: 0, eol: 0.9, a4: [['truck', 1500]] },
  'duct': { name: 'Galvanised steel ductwork', cat: 'Services', density: 7850, waste: 0.05, eol: 0.9, a4: [['truck', 500]] },
  'radiator': { name: 'Steel panel radiator', cat: 'Services', density: 7850, waste: 0.01, eol: 0.9, a4: [['truck', 800]] },
  'pipe': { name: 'Copper pipe', cat: 'Services', density: 8900, waste: 0.05, eol: 0.9, a4: [['truck', 800]] },
  'cable': { name: 'Copper building wire', cat: 'Services', density: 3000, waste: 0.05, eol: 0.7, a4: [['truck', 800]] },
  'water-heater': { name: 'Hot-water storage tank', cat: 'Services', density: 7850, waste: 0, eol: 0.9, a4: [['truck', 800]] },
  'pump': { name: 'Circulating pump', cat: 'Services', density: 7850, waste: 0, eol: 0.9, a4: [['truck', 1500]] },
  'light': { name: 'LED luminaire', cat: 'Services', density: 2000, waste: 0, eol: 0.6, a4: [['ship', 18000], ['truck', 500]] },
  'water': { name: 'Pool water', cat: 'Other', density: 1000, a13: [0.0003, 0.0003, 0.0003], dq: 'C', src: 'Mains water', a4: [], waste: 0, c3: 0, c4: 0, eol: 0, d: 0 }
};

// Proxies counted per m² of floor area or per unit (services and conveying, CIBSE TM65 style when no inventory exists)
export const PROXIES = {
  'mep': { name: 'Building services (HVAC, plumbing, electrical, fire)', unit: 'm²', a13: [50, 85, 140], dq: 'D', src: 'CIBSE TM65-style area proxy for office MEP', life: 20, a4: 3, a5rate: 0.02, c: 2, d: -6 },
  'lift': { name: 'Passenger lift (machine, car, rails, doors)', unit: 'ea', a13: [12000, 22000, 40000], dq: 'D', src: 'Per-unit proxy from published lift EPDs', life: 25, a4: 400, a5rate: 0.01, c: 400, d: -3000 }
};

// Facade systems: kg of each material per m² of gross facade. vision = share of the wall that is glass.
export const FACADES = {
  'bronze-cw': { name: 'Bronze curtain wall, single glazed', layers: [['bronze', 58]], glass: ['glass', 15], vision: 0.6, life: 100, glassLife: 50, note: 'Mullions and spandrels in bronze and Muntz metal, ¼-inch tinted plate glass' },
  'aluminium-cw': { name: 'Unitised aluminium curtain wall, double glazed', layers: [['aluminium', 12], ['mineral-wool', 4], ['steel-section', 3]], glass: ['glass-igu', 30], vision: 0.65, life: 40, glassLife: 30, note: 'Thermally broken unitised system, IGU vision, insulated spandrels' },
  'aluminium-cw-recycled': { name: 'Unitised curtain wall, recycled aluminium, double glazed', layers: [['aluminium', 12], ['mineral-wool', 4], ['steel-section', 3]], glass: ['glass-igu', 30], vision: 0.65, life: 40, glassLife: 30, a13Override: { aluminium: [2.5, 3.2, 4.5] }, note: 'High post-consumer recycled extrusions' },
  'precast': { name: 'Precast concrete with punched windows', layers: [['precast', 300], ['mineral-wool', 10], ['steel-stud', 4]], glass: ['glass-igu', 30], vision: 0.35, life: 60, glassLife: 30, note: '' },
  'brick': { name: 'Brick veneer with punched windows', layers: [['brick', 190], ['mineral-wool', 10], ['steel-stud', 6]], glass: ['glass-igu', 30], vision: 0.30, life: 60, glassLife: 30, note: '' },
  'stone': { name: 'Stone rainscreen with punched windows', layers: [['granite', 80], ['aluminium', 3], ['mineral-wool', 10], ['steel-stud', 6]], glass: ['glass-igu', 30], vision: 0.35, life: 60, glassLife: 30, note: '' }
};

// EN 15978 / EN 15804 modules in table order, every stage expanded. `info` is the roll-over text in the lifecycle table.
export const MODULES = [
  { k: 'A1', label: 'A1', name: 'Raw material supply', stage: 'Product', info: 'Extracting and processing raw materials: mining ore, quarrying stone and aggregate, harvesting timber, producing recycled feedstock, and the energy those take.' },
  { k: 'A2', label: 'A2', name: 'Transport to factory', stage: 'Product', info: 'Moving raw materials from mines, quarries and recyclers to the manufacturing plant.' },
  { k: 'A3', label: 'A3', name: 'Manufacturing', stage: 'Product', info: 'Making the product at the plant: melting, rolling, firing, cutting, forming, coating and packaging, including plant energy and waste.' },
  { k: 'A4', label: 'A4', name: 'Transport to site', stage: 'Construction', info: 'Delivering the finished product from the plant (or distributor) to the building site, by truck, rail or ship.' },
  { k: 'A5', label: 'A5', name: 'Construction & installation', stage: 'Construction', info: 'Installing the product on site: plant and equipment energy, temporary works, and making and disposing of offcuts and site waste.' },
  { k: 'B1', label: 'B1', name: 'Use', stage: 'Use', info: 'Emissions released by the product itself while in place, e.g. carbonation uptake by concrete or refrigerant leakage from equipment.' },
  { k: 'B2', label: 'B2', name: 'Maintenance', stage: 'Use', info: 'Planned upkeep to keep the product working: cleaning, repainting, resealing, servicing.' },
  { k: 'B3', label: 'B3', name: 'Repair', stage: 'Use', info: 'Fixing damage or wear to bring the product back to working order.' },
  { k: 'B4', label: 'B4', name: 'Replacement', stage: 'Use', info: 'Replacing the whole product when it reaches the end of its service life within the study period: a new product plus the end of life of the old one.' },
  { k: 'B5', label: 'B5', name: 'Refurbishment', stage: 'Use', info: 'Planned major renovation of a whole building element, such as re-glazing a facade or renewing services.' },
  { k: 'B6', label: 'B6', name: 'Operational energy', stage: 'Use', info: 'Energy used to run the building: heating, cooling, lighting, plug loads, hot water, fans and pumps. Calculated in the Operational tab.' },
  { k: 'B7', label: 'B7', name: 'Operational water', stage: 'Use', info: 'Supplying and treating the water the building uses.' },
  { k: 'C1', label: 'C1', name: 'Deconstruction & demolition', stage: 'End of life', info: 'Taking the product out of the building at end of life: demolition plant, dismantling, sorting on site.' },
  { k: 'C2', label: 'C2', name: 'Transport to waste processing', stage: 'End of life', info: 'Hauling the removed material to a recycling facility, crusher, incinerator or landfill.' },
  { k: 'C3', label: 'C3', name: 'Waste processing', stage: 'End of life', info: 'Preparing the material for reuse, recycling or energy recovery: crushing, shredding, sorting, cleaning.' },
  { k: 'C4', label: 'C4', name: 'Disposal', stage: 'End of life', info: 'Final disposal of what cannot be recovered: landfill or incineration without energy recovery.' },
  { k: 'D', label: 'D', name: 'Beyond the system boundary', stage: 'Beyond', info: 'Benefits and loads after the building\'s life, reported separately and never netted off: reuse, recycling and energy recovery.' }
];
// Module D split into what it actually stands for. An EPD declares one D value and says what it covers; the table puts it under that heading.
export const D_PARTS = [
  { k: 'reuse', label: 'D · reuse', info: 'Credit for a product taken out whole and used again (e.g. a steel beam re-erected elsewhere), avoiding a new one.' },
  { k: 'recycling', label: 'D · recycling', info: 'Credit for recovered material (scrap steel, cullet, crushed concrete) replacing virgin raw material in a new product, net of reprocessing.' },
  { k: 'recovery', label: 'D · recovery', info: 'Credit for energy recovered by burning the waste (wood, plastics) in place of fossil fuel.' },
  { k: 'other', label: 'D · other', info: 'Other loads or benefits beyond the boundary that the EPD reports without saying which route they come from.' }
];
export const MOD_KEYS = MODULES.map((m) => m.k);

// LETI embodied carbon rating bands for offices, A1–A5 excluding sequestration (kgCO2e/m² GIA)
export const LETI_OFFICE = [['A++', 100], ['A+', 225], ['A', 350], ['B', 475], ['C', 600], ['D', 775], ['E', 950], ['F', 1100], ['G', 1300]];

// NYC Local Law 97 emission coefficients for 2024–2029 (tCO2e per unit) used for B6 when the location is New York City
export const GRID = {
  nyc: { name: 'New York City (LL97 2024–29 coefficients)', elec: 0.000288962, gas: 0.00005311, steam: 0.00004493 },
  us: { name: 'US average grid', elec: 0.000367, gas: 0.00005311, steam: 0.000066 },
  eu: { name: 'EU average grid', elec: 0.000250, gas: 0.00005311, steam: 0.000066 }
};
