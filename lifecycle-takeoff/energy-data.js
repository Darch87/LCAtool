// Lifecycle Takeoff · operational data, built from primary sources (EIA CBECS 2018, EPA eGRID2023, NYC LL97, Ember 2025,
// EPA emission factors, IPCC AR5 lifecycle factors, ASHRAE 90.1 efficiencies). Every record carries its source URL.
export const ENERGY = {
"baselines": {
"office": {
"label": "Office",
"eui": 65.6,
"endUses": {
"heating": 19.51,
"cooling": 4.86,
"lighting": 7.86,
"plug": 5.94,
"shw": 0.96,
"fans": 12.84,
"other": 13.74
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "EIA CBECS 2018 Table E1 (end-use consumption, trillion Btu) / Table C1 (floorspace) for 'Office', divided by floorspace: https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx ; https://www.eia.gov/consumption/commercial/data/2018/ce/xls/c1.xlsx",
"climate": "4A (NYC) — national CBECS office values; NYC adjustment: CBECS Middle Atlantic all-buildings heating is 32.6 vs 25.0 kBtu/ft2 nationally (x1.30) and cooling 4.7 vs 7.0 (x0.67) per Table E2"
},
"retail": {
"label": "Retail",
"eui": 64.12,
"endUses": {
"heating": 15.6,
"cooling": 5.97,
"lighting": 11.94,
"plug": 1.54,
"shw": 0.77,
"fans": 11.55,
"other": 16.56
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "EIA CBECS 2018 Table E1 (end-use consumption, trillion Btu) / Table C1 (floorspace) for 'Retail (other than mall)', divided by floorspace: https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx ; https://www.eia.gov/consumption/commercial/data/2018/ce/xls/c1.xlsx",
"climate": "US national average (CBECS end-use tables are not published by climate zone x building type; scale with Middle Atlantic factor below for 4A)"
},
"school": {
"label": "School",
"eui": 62.69,
"endUses": {
"heating": 26.57,
"cooling": 6.75,
"lighting": 5.51,
"plug": 2.86,
"shw": 3.52,
"fans": 4.77,
"other": 12.7
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "EIA CBECS 2018 Table E1 (end-use consumption, trillion Btu) / Table C1 (floorspace) for 'Education', divided by floorspace: https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx ; https://www.eia.gov/consumption/commercial/data/2018/ce/xls/c1.xlsx",
"climate": "US national average (CBECS end-use tables are not published by climate zone x building type; scale with Middle Atlantic factor below for 4A)"
},
"hospital": {
"label": "Hospital",
"eui": 193.01,
"endUses": {
"heating": 61.97,
"cooling": 12.39,
"lighting": 11.95,
"plug": 8.41,
"shw": 14.61,
"fans": 28.77,
"other": 55.33
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "EIA CBECS 2018 Table E1 (end-use consumption, trillion Btu) / Table C1 (floorspace) for 'Inpatient', divided by floorspace: https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx ; https://www.eia.gov/consumption/commercial/data/2018/ce/xls/c1.xlsx",
"climate": "US national average (CBECS end-use tables are not published by climate zone x building type; scale with Middle Atlantic factor below for 4A)"
},
"hotel": {
"label": "Hotel",
"eui": 85.72,
"endUses": {
"heating": 15.48,
"cooling": 5.88,
"lighting": 7.17,
"plug": 1.58,
"shw": 15.91,
"fans": 12.47,
"other": 27.24
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "EIA CBECS 2018 Table E1 (end-use consumption, trillion Btu) / Table C1 (floorspace) for 'Lodging', divided by floorspace: https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx ; https://www.eia.gov/consumption/commercial/data/2018/ce/xls/c1.xlsx",
"climate": "US national average (CBECS end-use tables are not published by climate zone x building type; scale with Middle Atlantic factor below for 4A)"
},
"warehouse": {
"label": "Warehouse",
"eui": 30.2,
"endUses": {
"heating": 11.9,
"cooling": 2.97,
"lighting": 4.58,
"plug": 0.57,
"shw": 0.4,
"fans": 1.37,
"other": 8.47
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "EIA CBECS 2018 Table E1 (end-use consumption, trillion Btu) / Table C1 (floorspace) for 'Warehouse and storage', divided by floorspace: https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx ; https://www.eia.gov/consumption/commercial/data/2018/ce/xls/c1.xlsx",
"climate": "US national average (CBECS end-use tables are not published by climate zone x building type; scale with Middle Atlantic factor below for 4A)"
},
"lab": {
"label": "Laboratory",
"eui": 115.3,
"endUses": {
"heating": 34.23380003043677,
"cooling": 8.527743113681327,
"lighting": 13.791782072743873,
"plug": 10.422797138943844,
"shw": 1.6844924669000148,
"fans": 22.530086744787702,
"other": 24.109298432506463
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "https://portfoliomanager.energystar.gov/pdf/reference/US%20National%20Median%20Table.pdf",
"climate": "US national median"
},
"residential-multifamily": {
"label": "Multifamily residential",
"eui": 37.2,
"endUses": {
"heating": 10.05,
"cooling": 4.42,
"shw": 11.15,
"lighting": null,
"plug": null,
"fans": null
},
"refSystems": {
"heating": "gas-boiler-noncondensing",
"cooling": "dx-rtu",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-gas-tank",
"fans": "fan-cv",
"other": "other-typical"
},
"source": "EIA RECS 2020 Table CE3.1 (apartments in 5+ unit buildings: 33.7 MMBtu/household; heat 9.1, water 10.1, AC 4.0, fridge 1.9, other 10.2 — averages per household using end use) and CE1.1 (37.2 kBtu/ft2): https://www.eia.gov/consumption/residential/data/2020/c&e/xls/ce3.1.xlsx ; https://www.eia.gov/consumption/residential/data/2020/c&e/xls/ce1.1.xlsx",
"climate": "US national; RECS excludes district steam and common-area/central-plant energy so whole-building EUI is higher — ENERGY STAR Multifamily median 59.6 kBtu/ft2 (https://portfoliomanager.energystar.gov/pdf/reference/US%20National%20Median%20Table.pdf)"
}
},
"systems": {
"heating": [
{
"id": "district-steam",
"name": "District steam to perimeter radiators",
"note": "1950s one-pipe/two-pipe perimeter radiators; trap and riser losses typical 10-20%; LL97 steam factor already embeds Con Ed plant efficiency",
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (district steam accounted at meter); range per DOE steam tip sheets https://www.energy.gov/eere/amo/steam-systems",
"fuel": "steam",
"eff": 0.85,
"effLabel": "85% efficient"
},
{
"id": "gas-boiler-noncondensing",
"name": "Gas boiler, non-condensing (hot water)",
"note": "Seasonal ~0.75-0.80 incl. distribution",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "gas",
"eff": 0.8,
"effLabel": "80% efficient"
},
{
"id": "gas-boiler-condensing",
"name": "Gas boiler, condensing",
"note": "90.1-2022 raised large HW boiler min to ~0.90 Et",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "gas",
"eff": 0.92,
"effLabel": "92% efficient"
},
{
"id": "oil-boiler",
"name": "Oil boiler (#2/#4)",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "oil",
"eff": 0.82,
"effLabel": "82% efficient"
},
{
"id": "electric-resistance",
"name": "Electric resistance (baseboard / duct)",
"note": "",
"source": "https://www.energy.gov/energysaver/electric-resistance-heating",
"fuel": "elec",
"eff": 1.0,
"effLabel": "100% efficient"
},
{
"id": "ashp",
"name": "Air-source heat pump (cold-climate)",
"note": "",
"source": "https://neep.org/heating-electrification/ccashp-specification-product-list",
"fuel": "elec",
"eff": 2.6,
"effLabel": "COP 2.6"
},
{
"id": "gshp",
"name": "Ground-source heat pump",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 3.6,
"effLabel": "COP 3.6"
},
{
"id": "vrf-hr",
"name": "VRF heat recovery",
"note": "Simultaneous heat/cool recovery can raise effective COP",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 3.0,
"effLabel": "COP 3.0"
},
{
"id": "radiant-boiler",
"name": "Radiant floor with condensing boiler",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "gas",
"eff": 0.94,
"effLabel": "94% efficient"
},
{
"id": "radiant-hp",
"name": "Radiant floor with air-to-water heat pump",
"note": "",
"source": "https://www.energy.gov/energysaver/heat-pump-systems",
"fuel": "elec",
"eff": 3.0,
"effLabel": "COP 3.0"
}
],
"cooling": [
{
"id": "chiller-wc-centrifugal-old",
"name": "Water-cooled centrifugal chiller, 1950s plant / 1990s retrofit",
"note": "Legacy CFC-era / early replacement machines",
"source": "https://www.energystar.gov/buildings/resources_audience/service_product_providers/save_energy_commercial_buildings/upgrade_hvac (ENERGY STAR Building Upgrade Manual ch. 9)",
"fuel": "elec",
"eff": 4.4,
"effLabel": "COP 4.4"
},
{
"id": "chiller-wc-centrifugal-modern",
"name": "Water-cooled centrifugal chiller, modern VSD",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 6.3,
"effLabel": "COP 6.3"
},
{
"id": "chiller-air-cooled",
"name": "Air-cooled chiller",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 2.96,
"effLabel": "COP 3.0"
},
{
"id": "chiller-absorption-steam",
"name": "Steam absorption chiller (double-effect)",
"note": "Con Ed steam customers historically used summer absorption",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "steam",
"eff": 1.0,
"effLabel": "100% efficient"
},
{
"id": "dx-rtu",
"name": "DX rooftop unit",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 3.2,
"effLabel": "COP 3.2"
},
{
"id": "vrf",
"name": "VRF (cooling)",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 4.0,
"effLabel": "COP 4.0"
},
{
"id": "gshp-cool",
"name": "Ground-source heat pump (cooling)",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 5.0,
"effLabel": "COP 5.0"
},
{
"id": "district-chw",
"name": "District chilled water (electric-driven)",
"note": "Modelled as electric-equivalent at COP 4.5.",
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf",
"fuel": "elec",
"eff": 4.5,
"effLabel": "COP 4.5"
}
],
"lighting": [
{
"id": "t12",
"name": "Fluorescent T12 + magnetic ballast",
"note": "Pre-1990s office",
"source": "https://www.energy.gov/eere/ssl/solid-state-lighting (DOE SSL); ASHRAE 90.1-1989 office ~1.5-1.8 W/ft2",
"fuel": "elec",
"eff": 0.625,
"effLabel": "1.60 W/ft²"
},
{
"id": "t8",
"name": "Fluorescent T8 + electronic ballast",
"note": "90.1-2004 office 1.0 W/ft2",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 1.0,
"effLabel": "1.00 W/ft²"
},
{
"id": "led",
"name": "LED",
"note": "90.1-2019 building-area method office 0.64 W/ft2",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 1.5625,
"effLabel": "0.64 W/ft²"
},
{
"id": "led-controls",
"name": "LED + daylight/occupancy controls",
"note": "Controls save ~30-40% of lighting kWh (LBNL meta-analysis 24-38%)",
"source": "https://eta.lbl.gov/publications/meta-analysis-energy-savings-lighting",
"fuel": "elec",
"eff": 1.5625,
"effLabel": "0.64 W/ft²"
}
],
"plug": [
{
"id": "plug-typical",
"name": "Typical office",
"note": "CBECS 2018 office equipment+computing",
"source": "https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx",
"fuel": "elec",
"eff": 1.0,
"effLabel": "5.9 kBtu/ft²"
},
{
"id": "plug-efficient",
"name": "ENERGY STAR equipment + plug-load controls",
"note": "Advanced power strips/schedule controls 20-50% savings in GSA trials",
"source": "https://www.gsa.gov/governmentwide-initiatives/sustainability/emerging-building-technologies/published-findings/building-envelope-and-controls/plug-load-control",
"fuel": "elec",
"eff": 1.4143,
"effLabel": "4.2 kBtu/ft²"
}
],
"shw": [
{
"id": "shw-steam",
"name": "District steam to storage tank (heat exchanger)",
"note": "",
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf",
"fuel": "steam",
"eff": 0.75,
"effLabel": "75% efficient"
},
{
"id": "shw-gas-tank",
"name": "Gas storage water heater",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "gas",
"eff": 0.8,
"effLabel": "80% efficient"
},
{
"id": "shw-elec",
"name": "Electric resistance tank",
"note": "",
"source": "https://www.ashrae.org/technical-resources/bookstore/standard-90-1",
"fuel": "elec",
"eff": 0.98,
"effLabel": "98% efficient"
},
{
"id": "shw-hpwh",
"name": "Heat-pump water heater",
"note": "",
"source": "https://www.energystar.gov/products/heat_pump_water_heaters",
"fuel": "elec",
"eff": 3.0,
"effLabel": "COP 3.0"
},
{
"id": "shw-solar",
"name": "Solar thermal assist",
"note": "Solar covers ~50%; electric backup for the rest.",
"source": "https://www.energy.gov/energysaver/solar-water-heaters",
"fuel": "elec",
"eff": 2.0,
"effLabel": "COP 2.0"
}
],
"fans": [
{
"id": "fan-cv",
"name": "Constant volume",
"note": "CBECS 2018 office ventilation intensity (mixed stock)",
"source": "https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx",
"fuel": "elec",
"eff": 1.0,
"effLabel": "typical"
},
{
"id": "fan-vav-vfd",
"name": "VAV with VFD",
"note": "VFD fan energy savings 30-50% vs CV/inlet vanes",
"source": "https://www.energy.gov/eere/amo/articles/adjustable-speed-drive-part-load-efficiency",
"fuel": "elec",
"eff": 1.6667,
"effLabel": "40% below typical"
},
{
"id": "fan-doas-ecm",
"name": "DOAS + ECM fans (decoupled)",
"note": "DOAS with ERV and ECM fan coils cuts fan energy 50-70%",
"source": "https://www.nrel.gov/docs/fy16osti/65411.pdf",
"fuel": "elec",
"eff": 2.5,
"effLabel": "60% below typical"
}
],
"other": [
{
"id": "other-typical",
"name": "Typical (pumps, elevators, exterior lighting, misc.)",
"note": "CBECS office cooking+refrigeration+other",
"source": "https://www.eia.gov/consumption/commercial/data/2018/ce/xls/e1.xlsx",
"fuel": "elec",
"eff": 1.0,
"effLabel": "typical"
},
{
"id": "other-efficient",
"name": "Efficient (VFD pumps, regen elevators, LED exterior)",
"note": "engineering assumption",
"source": "https://www.energycodes.gov/prototype-building-models",
"fuel": "elec",
"eff": 1.3333,
"effLabel": "25% below typical"
}
]
},
"passive": {
"heating": [
{
"id": "thermal-mass",
"name": "Thermal mass / direct-gain heat storage",
"reduction": 0.1,
"range": "5-15% of heating",
"note": "Most effective with solar access; limited in high-rise office. Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/direct-gain-heat-storage/"
},
{
"id": "hp-envelope",
"name": "High-performance glazing + insulation (envelope retrofit)",
"reduction": 0.35,
"range": "20-50% of heating",
"note": "Triple/low-e IGU + insulated spandrel; Seagram curtain wall constrains",
"source": "https://2030palette.org/direct-gain-glazing/ ; https://www.nrel.gov/docs/fy13osti/52866.pdf"
},
{
"id": "solar-orientation",
"name": "Solar gain / form for heating",
"reduction": 0.1,
"range": "5-20%",
"note": "New construction only. Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/form-for-heating/"
},
{
"id": "airtightness",
"name": "Airtightness",
"reduction": 0.15,
"range": "10-25%",
"note": "Infiltration often 25-30% of commercial heating load",
"source": "https://2030palette.org/ ; https://www.nist.gov/publications/investigation-impact-commercial-building-envelope-airtightness-hvac-energy-use"
},
{
"id": "hrv",
"name": "Heat/energy recovery ventilation",
"reduction": 0.25,
"range": "20-40% of heating",
"note": "ERV ~70% sensible effectiveness on OA load",
"source": "https://2030palette.org/ ; https://www.energy.gov/energysaver/whole-house-ventilation"
}
],
"cooling": [
{
"id": "stack-vent",
"name": "Stack ventilation",
"reduction": 0.15,
"range": "10-30% shoulder season",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/stack-ventilation/"
},
{
"id": "cross-vent",
"name": "Cross ventilation",
"reduction": 0.15,
"range": "10-30%",
"note": "Requires operable windows; shallow floor plates",
"source": "https://2030palette.org/cross-ventilation/"
},
{
"id": "night-flush",
"name": "Night flush / night vent cooling",
"reduction": 0.15,
"range": "10-25%",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/night-vent-cooling/"
},
{
"id": "shading",
"name": "External shading / louvres",
"reduction": 0.2,
"range": "10-30% of cooling",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/shading-devices/ ; https://2030palette.org/eastwest-shading/"
},
{
"id": "cool-roof",
"name": "Cool roof",
"reduction": 0.05,
"range": "2-15% (low-rise); <2% for towers",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/cool-roof/ ; https://heatisland.lbl.gov/coolscience/cool-roofs"
},
{
"id": "ground-coupling",
"name": "Ground coupling / earth tubes / earth sheltering",
"reduction": 0.1,
"range": "5-20%",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/earth-sheltering/"
},
{
"id": "thermal-mass-cool",
"name": "Thermal mass (cooling)",
"reduction": 0.1,
"range": "5-15%",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/direct-gain-heat-storage/"
}
],
"lighting": [
{
"id": "daylighting",
"name": "Side/top daylighting + controls",
"reduction": 0.3,
"range": "20-60% of lighting in perimeter zones",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/side-daylighting-controls/ ; https://eta.lbl.gov/publications/meta-analysis-energy-savings-lighting"
},
{
"id": "light-shelves",
"name": "Light shelves",
"reduction": 0.1,
"range": "5-15%",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/intermediate-light-shelves/"
},
{
"id": "clerestories",
"name": "Clerestories and skylights",
"reduction": 0.2,
"range": "10-40% (top floor/low-rise only)",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/clerestories-and-skylights/"
}
],
"plug": [
{
"id": "plug-policy",
"name": "Plug-load policy / scheduling / ENERGY STAR procurement",
"reduction": 0.25,
"range": "15-40%",
"note": "",
"source": "https://www.gsa.gov/governmentwide-initiatives/sustainability/emerging-building-technologies/published-findings/building-envelope-and-controls/plug-load-control"
}
],
"shw": [
{
"id": "low-flow",
"name": "Low-flow fixtures (0.5 gpm lavatory aerators)",
"reduction": 0.3,
"range": "20-40% of SHW",
"note": "WaterSense",
"source": "https://www.epa.gov/watersense"
},
{
"id": "dwhr",
"name": "Drain-water heat recovery",
"reduction": 0.2,
"range": "10-30%",
"note": "Most effective with showers (hotels, residential)",
"source": "https://www.energy.gov/energysaver/drain-water-heat-recovery"
}
],
"fans": [
{
"id": "mixed-mode",
"name": "Natural / mixed-mode ventilation",
"reduction": 0.3,
"range": "20-50% of fan energy",
"note": " Indicative range; 2030 Palette swatches give no numeric savings.",
"source": "https://2030palette.org/cross-ventilation/ ; https://cbe.berkeley.edu/mixedmode/"
}
],
"other": [
{
"id": "exterior-led",
"name": "Exterior lighting LED + dimming",
"reduction": 0.5,
"range": "40-70% of exterior lighting",
"note": "",
"source": "https://www.energycodes.gov/prototype-building-models"
}
]
},
"grids": {
"AKGD": {
"name": "ASCC Alaska Grid",
"kgPerKWh": 0.4106,
"mix": {
"gas": 0.604,
"nuclear": 0,
"hydro": 0.139,
"wind": 0.016,
"solar": 0,
"oil": 0.09,
"coal": 0.143,
"other": 0.008,
"biomass": 0.008,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"AKMS": {
"name": "ASCC Miscellaneous",
"kgPerKWh": 0.237,
"mix": {
"gas": 0.065,
"nuclear": 0,
"hydro": 0.672,
"wind": 0.018,
"solar": 0,
"oil": 0.246,
"coal": 0,
"other": 0,
"biomass": 0,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"AZNM": {
"name": "WECC Southwest",
"kgPerKWh": 0.3203,
"mix": {
"gas": 0.487,
"nuclear": 0.18,
"hydro": 0.026,
"wind": 0.077,
"solar": 0.082,
"oil": 0,
"coal": 0.111,
"other": 0.039,
"biomass": 0.003,
"geothermal": 0.036,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"CAMX": {
"name": "WECC California",
"kgPerKWh": 0.195,
"mix": {
"gas": 0.429,
"nuclear": 0.08,
"hydro": 0.141,
"wind": 0.066,
"solar": 0.201,
"oil": 0,
"coal": 0.021,
"other": 0.065,
"biomass": 0.022,
"geothermal": 0.036,
"otherFossil": 0.007
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"ERCT": {
"name": "ERCOT All",
"kgPerKWh": 0.3341,
"mix": {
"gas": 0.496,
"nuclear": 0.085,
"hydro": 0.001,
"wind": 0.226,
"solar": 0.059,
"oil": 0,
"coal": 0.127,
"other": 0.006,
"biomass": 0.002,
"geothermal": 0,
"otherFossil": 0.004
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"FRCC": {
"name": "FRCC All",
"kgPerKWh": 0.356,
"mix": {
"gas": 0.755,
"nuclear": 0.12,
"hydro": 0.001,
"wind": 0,
"solar": 0.054,
"oil": 0.005,
"coal": 0.045,
"other": 0.021,
"biomass": 0.011,
"geothermal": 0,
"otherFossil": 0.006
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"HIMS": {
"name": "HICC Miscellaneous",
"kgPerKWh": 0.5141,
"mix": {
"gas": 0,
"nuclear": 0,
"hydro": 0.036,
"wind": 0.121,
"solar": 0.064,
"oil": 0.659,
"coal": 0,
"other": 0.121,
"biomass": 0.047,
"geothermal": 0.074,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"HIOA": {
"name": "HICC Oahu",
"kgPerKWh": 0.6799,
"mix": {
"gas": 0,
"nuclear": 0,
"hydro": 0,
"wind": 0.043,
"solar": 0.074,
"oil": 0.831,
"coal": 0,
"other": 0.052,
"biomass": 0.025,
"geothermal": 0,
"otherFossil": 0.027
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"MROE": {
"name": "MRO East",
"kgPerKWh": 0.6373,
"mix": {
"gas": 0.429,
"nuclear": 0,
"hydro": 0.043,
"wind": 0.054,
"solar": 0.047,
"oil": 0.003,
"coal": 0.395,
"other": 0.03,
"biomass": 0.03,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"MROW": {
"name": "MRO West",
"kgPerKWh": 0.4203,
"mix": {
"gas": 0.131,
"nuclear": 0.078,
"hydro": 0.041,
"wind": 0.376,
"solar": 0.012,
"oil": 0.001,
"coal": 0.352,
"other": 0.01,
"biomass": 0.007,
"geothermal": 0,
"otherFossil": 0.002
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"NEWE": {
"name": "NPCC New England",
"kgPerKWh": 0.2464,
"mix": {
"gas": 0.559,
"nuclear": 0.226,
"hydro": 0.08,
"wind": 0.034,
"solar": 0.036,
"oil": 0.004,
"coal": 0.002,
"other": 0.06,
"biomass": 0.043,
"geothermal": 0,
"otherFossil": 0.016
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"NWPP": {
"name": "WECC Northwest",
"kgPerKWh": 0.2882,
"mix": {
"gas": 0.248,
"nuclear": 0.031,
"hydro": 0.387,
"wind": 0.116,
"solar": 0.031,
"oil": 0.002,
"coal": 0.164,
"other": 0.021,
"biomass": 0.01,
"geothermal": 0.007,
"otherFossil": 0.003
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"NYCW": {
"name": "NPCC NYC/Westchester",
"kgPerKWh": 0.3927,
"mix": {
"gas": 0.982,
"nuclear": 0,
"hydro": 0,
"wind": 0,
"solar": 0.001,
"oil": 0.005,
"coal": 0,
"other": 0.012,
"biomass": 0.005,
"geothermal": 0,
"otherFossil": 0.007
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"NYLI": {
"name": "NPCC Long Island",
"kgPerKWh": 0.5395,
"mix": {
"gas": 0.872,
"nuclear": 0,
"hydro": 0,
"wind": 0,
"solar": 0.025,
"oil": 0.015,
"coal": 0,
"other": 0.088,
"biomass": 0.04,
"geothermal": 0,
"otherFossil": 0.048
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"NYUP": {
"name": "NPCC Upstate NY",
"kgPerKWh": 0.1101,
"mix": {
"gas": 0.255,
"nuclear": 0.323,
"hydro": 0.329,
"wind": 0.056,
"solar": 0.021,
"oil": 0.001,
"coal": 0,
"other": 0.015,
"biomass": 0.012,
"geothermal": 0,
"otherFossil": 0.003
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"PRMS": {
"name": "Puerto Rico Miscellaneous",
"kgPerKWh": 0.7024,
"mix": {
"gas": 0.436,
"nuclear": 0,
"hydro": 0.002,
"wind": 0.006,
"solar": 0.015,
"oil": 0.39,
"coal": 0.152,
"other": 0,
"biomass": 0,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"RFCE": {
"name": "RFC East",
"kgPerKWh": 0.2718,
"mix": {
"gas": 0.541,
"nuclear": 0.364,
"hydro": 0.011,
"wind": 0.01,
"solar": 0.01,
"oil": 0.001,
"coal": 0.047,
"other": 0.016,
"biomass": 0.009,
"geothermal": 0,
"otherFossil": 0.007
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"RFCM": {
"name": "RFC Michigan",
"kgPerKWh": 0.4427,
"mix": {
"gas": 0.498,
"nuclear": 0.102,
"hydro": 0,
"wind": 0.088,
"solar": 0.013,
"oil": 0.015,
"coal": 0.257,
"other": 0.031,
"biomass": 0.015,
"geothermal": 0,
"otherFossil": 0.016
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"RFCW": {
"name": "RFC West",
"kgPerKWh": 0.4155,
"mix": {
"gas": 0.378,
"nuclear": 0.284,
"hydro": 0.01,
"wind": 0.055,
"solar": 0.008,
"oil": 0.003,
"coal": 0.25,
"other": 0.011,
"biomass": 0.003,
"geothermal": 0,
"otherFossil": 0.007
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"RMPA": {
"name": "WECC Rockies",
"kgPerKWh": 0.4729,
"mix": {
"gas": 0.264,
"nuclear": 0,
"hydro": 0.105,
"wind": 0.258,
"solar": 0.054,
"oil": 0.001,
"coal": 0.317,
"other": 0.002,
"biomass": 0.002,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"SPNO": {
"name": "SPP North",
"kgPerKWh": 0.3936,
"mix": {
"gas": 0.14,
"nuclear": 0.14,
"hydro": 0.001,
"wind": 0.397,
"solar": 0.002,
"oil": 0.002,
"coal": 0.316,
"other": 0.001,
"biomass": 0.001,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"SPSO": {
"name": "SPP South",
"kgPerKWh": 0.3972,
"mix": {
"gas": 0.461,
"nuclear": 0,
"hydro": 0.025,
"wind": 0.325,
"solar": 0.004,
"oil": 0.005,
"coal": 0.162,
"other": 0.016,
"biomass": 0.012,
"geothermal": 0,
"otherFossil": 0.002
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"SRMV": {
"name": "SERC Mississippi Valley",
"kgPerKWh": 0.3364,
"mix": {
"gas": 0.652,
"nuclear": 0.221,
"hydro": 0.013,
"wind": 0,
"solar": 0.007,
"oil": 0.001,
"coal": 0.082,
"other": 0.023,
"biomass": 0.01,
"geothermal": 0,
"otherFossil": 0.012
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"SRMW": {
"name": "SERC Midwest",
"kgPerKWh": 0.5663,
"mix": {
"gas": 0.169,
"nuclear": 0.164,
"hydro": 0.009,
"wind": 0.125,
"solar": 0.016,
"oil": 0.001,
"coal": 0.511,
"other": 0.005,
"biomass": 0.001,
"geothermal": 0,
"otherFossil": 0.001
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"SRSO": {
"name": "SERC South",
"kgPerKWh": 0.3837,
"mix": {
"gas": 0.554,
"nuclear": 0.204,
"hydro": 0.024,
"wind": 0,
"solar": 0.036,
"oil": 0.001,
"coal": 0.145,
"other": 0.036,
"biomass": 0.036,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"SRTV": {
"name": "SERC Tennessee Valley",
"kgPerKWh": 0.4097,
"mix": {
"gas": 0.298,
"nuclear": 0.328,
"hydro": 0.076,
"wind": 0,
"solar": 0.008,
"oil": 0.001,
"coal": 0.282,
"other": 0.007,
"biomass": 0.007,
"geothermal": 0,
"otherFossil": 0
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"SRVC": {
"name": "SERC Virginia/Carolina",
"kgPerKWh": 0.2705,
"mix": {
"gas": 0.393,
"nuclear": 0.399,
"hydro": 0.014,
"wind": 0.005,
"solar": 0.06,
"oil": 0.001,
"coal": 0.105,
"other": 0.024,
"biomass": 0.021,
"geothermal": 0,
"otherFossil": 0.002
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
},
"US": {
"name": "US average (eGRID)",
"kgPerKWh": 0.3497,
"mix": {
"gas": 0.432,
"nuclear": 0.185,
"hydro": 0.057,
"wind": 0.1,
"solar": 0.039,
"oil": 0.005,
"coal": 0.161,
"other": 0.021
},
"source": "EPA eGRID2023 Summary Tables rev2 (Table 1 output emission rates, Table 2 resource mix), https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.xlsx ; https://www.epa.gov/egrid/summary-data"
}
},
"lossFactor": 0.042,
"utilities": [
{
"city": "New York, NY",
"state": "NY",
"lat": 40.7128,
"lon": -74.006,
"utility": "Con Edison",
"egrid": "NYCW",
"iso": "NYISO Zone J",
"note": "Seagram test case; LL97 applies",
"steam": {
"name": "Con Edison Steam",
"kgPerKWh": 0.15331,
"source": "NYC LL97 coefficient 0.00004493 tCO2e/kBtu (2024-29) https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-224093; 2030-34 0.0000432 per DOB rule as summarised https://www.ny-engineers.com/blog/new-local-law-97-rules-for-nyc-building-owners-what-has-changed"
}
},
{
"city": "Los Angeles, CA",
"state": "CA",
"lat": 34.0522,
"lon": -118.2437,
"utility": "LADWP",
"egrid": "CAMX",
"iso": "LADWP balancing authority (WECC)",
"note": "LADWP is municipal; utility-specific rate differs from CAMX"
},
{
"city": "Chicago, IL",
"state": "IL",
"lat": 41.8781,
"lon": -87.6298,
"utility": "ComEd",
"egrid": "RFCW",
"iso": "PJM (ComEd zone)",
"note": "Chicago has district cooling (Enwave) but no major steam"
},
{
"city": "Houston, TX",
"state": "TX",
"lat": 29.7604,
"lon": -95.3698,
"utility": "CenterPoint (wires); retail choice",
"egrid": "ERCT",
"iso": "ERCOT Houston zone",
"note": ""
},
{
"city": "Phoenix, AZ",
"state": "AZ",
"lat": 33.4484,
"lon": -112.074,
"utility": "APS / SRP",
"egrid": "AZNM",
"iso": "WECC (APS/SRP BAs)",
"note": ""
},
{
"city": "Philadelphia, PA",
"state": "PA",
"lat": 39.9526,
"lon": -75.1652,
"utility": "PECO",
"egrid": "RFCE",
"iso": "PJM (PECO zone)",
"note": "",
"steam": {
"name": "Vicinity Energy Philadelphia",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "San Antonio, TX",
"state": "TX",
"lat": 29.4241,
"lon": -98.4936,
"utility": "CPS Energy",
"egrid": "ERCT",
"iso": "ERCOT South zone",
"note": ""
},
{
"city": "San Diego, CA",
"state": "CA",
"lat": 32.7157,
"lon": -117.1611,
"utility": "SDG&E",
"egrid": "CAMX",
"iso": "CAISO",
"note": ""
},
{
"city": "Dallas, TX",
"state": "TX",
"lat": 32.7767,
"lon": -96.797,
"utility": "Oncor (wires); retail choice",
"egrid": "ERCT",
"iso": "ERCOT North zone",
"note": ""
},
{
"city": "Jacksonville, FL",
"state": "FL",
"lat": 30.3322,
"lon": -81.6557,
"utility": "JEA",
"egrid": "FRCC",
"iso": "FRCC (JEA BA)",
"note": ""
},
{
"city": "Austin, TX",
"state": "TX",
"lat": 30.2672,
"lon": -97.7431,
"utility": "Austin Energy",
"egrid": "ERCT",
"iso": "ERCOT South/Austin",
"note": ""
},
{
"city": "Fort Worth, TX",
"state": "TX",
"lat": 32.7555,
"lon": -97.3308,
"utility": "Oncor (wires); retail choice",
"egrid": "ERCT",
"iso": "ERCOT North zone",
"note": ""
},
{
"city": "San Jose, CA",
"state": "CA",
"lat": 37.3382,
"lon": -121.8863,
"utility": "PG&E (San Jose Clean Energy CCA)",
"egrid": "CAMX",
"iso": "CAISO",
"note": ""
},
{
"city": "Columbus, OH",
"state": "OH",
"lat": 39.9612,
"lon": -82.9988,
"utility": "AEP Ohio",
"egrid": "RFCW",
"iso": "PJM (AEP zone)",
"note": ""
},
{
"city": "Charlotte, NC",
"state": "NC",
"lat": 35.2271,
"lon": -80.8431,
"utility": "Duke Energy Carolinas",
"egrid": "SRVC",
"iso": "Duke Energy Carolinas BA",
"note": ""
},
{
"city": "Indianapolis, IN",
"state": "IN",
"lat": 39.7684,
"lon": -86.1581,
"utility": "AES Indiana",
"egrid": "RFCW",
"iso": "MISO",
"note": "",
"steam": {
"name": "Citizens Energy Group Thermal (steam)",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "San Francisco, CA",
"state": "CA",
"lat": 37.7749,
"lon": -122.4194,
"utility": "PG&E / SFPUC (CleanPowerSF)",
"egrid": "CAMX",
"iso": "CAISO",
"note": "",
"steam": {
"name": "Downtown SF district steam",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "Seattle, WA",
"state": "WA",
"lat": 47.6062,
"lon": -122.3321,
"utility": "Seattle City Light",
"egrid": "NWPP",
"iso": "Seattle City Light BA (WECC)",
"note": "Seattle City Light is ~90% hydro; NWPP average overstates",
"steam": {
"name": "Enwave Seattle",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "Denver, CO",
"state": "CO",
"lat": 39.7392,
"lon": -104.9903,
"utility": "Xcel Energy (PSCo)",
"egrid": "RMPA",
"iso": "WECC (PSCo BA)",
"note": "",
"steam": {
"name": "Xcel Energy Denver steam",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "Oklahoma City, OK",
"state": "OK",
"lat": 35.4676,
"lon": -97.5164,
"utility": "OG&E",
"egrid": "SPSO",
"iso": "SPP",
"note": ""
},
{
"city": "Nashville, TN",
"state": "TN",
"lat": 36.1627,
"lon": -86.7816,
"utility": "Nashville Electric Service (TVA)",
"egrid": "SRTV",
"iso": "TVA",
"note": ""
},
{
"city": "Washington, DC",
"state": "DC",
"lat": 38.9072,
"lon": -77.0369,
"utility": "Pepco",
"egrid": "RFCE",
"iso": "PJM (Pepco zone)",
"note": "DC BEPS applies",
"steam": {
"name": "GSA / Vicinity DC steam",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "El Paso, TX",
"state": "TX",
"lat": 31.7619,
"lon": -106.485,
"utility": "El Paso Electric",
"egrid": "AZNM",
"iso": "WECC (EPE BA; not ERCOT)",
"note": ""
},
{
"city": "Las Vegas, NV",
"state": "NV",
"lat": 36.1699,
"lon": -115.1398,
"utility": "NV Energy",
"egrid": "NWPP",
"iso": "WECC (NV Energy BA)",
"note": ""
},
{
"city": "Boston, MA",
"state": "MA",
"lat": 42.3601,
"lon": -71.0589,
"utility": "Eversource",
"egrid": "NEWE",
"iso": "ISO-NE",
"note": "BERDO 2.0 applies",
"steam": {
"name": "Vicinity Energy Boston",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "Detroit, MI",
"state": "MI",
"lat": 42.3314,
"lon": -83.0458,
"utility": "DTE Electric",
"egrid": "RFCM",
"iso": "MISO",
"note": "",
"steam": {
"name": "Detroit Thermal",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "Portland, OR",
"state": "OR",
"lat": 45.5152,
"lon": -122.6784,
"utility": "Portland General Electric",
"egrid": "NWPP",
"iso": "WECC (PGE BA)",
"note": ""
},
{
"city": "Louisville, KY",
"state": "KY",
"lat": 38.2527,
"lon": -85.7585,
"utility": "LG&E",
"egrid": "SRTV",
"iso": "LG&E/KU BA",
"note": ""
},
{
"city": "Memphis, TN",
"state": "TN",
"lat": 35.1495,
"lon": -90.049,
"utility": "MLGW (TVA)",
"egrid": "SRTV",
"iso": "TVA",
"note": ""
},
{
"city": "Baltimore, MD",
"state": "MD",
"lat": 39.2904,
"lon": -76.6122,
"utility": "BGE",
"egrid": "RFCE",
"iso": "PJM (BGE zone)",
"note": "",
"steam": {
"name": "Vicinity Energy Baltimore",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "Milwaukee, WI",
"state": "WI",
"lat": 43.0389,
"lon": -87.9065,
"utility": "We Energies",
"egrid": "MROE",
"iso": "MISO",
"note": "",
"steam": {
"name": "We Energies downtown steam",
"kgPerKWh": 0.22657,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (ENERGY STAR US default district steam factor, Aug 2025; replace with operator-specific factor if available)"
}
},
{
"city": "Albuquerque, NM",
"state": "NM",
"lat": 35.0844,
"lon": -106.6504,
"utility": "PNM",
"egrid": "AZNM",
"iso": "WECC (PNM BA)",
"note": ""
},
{
"city": "Tucson, AZ",
"state": "AZ",
"lat": 32.2226,
"lon": -110.9747,
"utility": "Tucson Electric Power",
"egrid": "AZNM",
"iso": "WECC (TEP BA)",
"note": ""
},
{
"city": "Fresno, CA",
"state": "CA",
"lat": 36.7378,
"lon": -119.7871,
"utility": "PG&E",
"egrid": "CAMX",
"iso": "CAISO",
"note": ""
},
{
"city": "Sacramento, CA",
"state": "CA",
"lat": 38.5816,
"lon": -121.4944,
"utility": "SMUD",
"egrid": "CAMX",
"iso": "BANC (WECC)",
"note": ""
},
{
"city": "Mesa, AZ",
"state": "AZ",
"lat": 33.4152,
"lon": -111.8315,
"utility": "SRP / City of Mesa",
"egrid": "AZNM",
"iso": "WECC (SRP BA)",
"note": ""
},
{
"city": "Atlanta, GA",
"state": "GA",
"lat": 33.749,
"lon": -84.388,
"utility": "Georgia Power",
"egrid": "SRSO",
"iso": "Southern Company BA",
"note": ""
},
{
"city": "Kansas City, MO",
"state": "MO",
"lat": 39.0997,
"lon": -94.5786,
"utility": "Evergy",
"egrid": "SPNO",
"iso": "SPP",
"note": ""
},
{
"city": "Colorado Springs, CO",
"state": "CO",
"lat": 38.8339,
"lon": -104.8214,
"utility": "Colorado Springs Utilities",
"egrid": "RMPA",
"iso": "WECC (PSCo/CSU)",
"note": ""
},
{
"city": "Omaha, NE",
"state": "NE",
"lat": 41.2565,
"lon": -95.9345,
"utility": "OPPD",
"egrid": "MROW",
"iso": "SPP",
"note": ""
}
],
"countries": {
"AE": {
"name": "United Arab Emirates",
"kgPerKWh": 0.4697,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"AR": {
"name": "Argentina",
"kgPerKWh": 0.3456,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"AU": {
"name": "Australia",
"kgPerKWh": 0.518,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"AT": {
"name": "Austria",
"kgPerKWh": 0.1166,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"BE": {
"name": "Belgium",
"kgPerKWh": 0.1513,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"BR": {
"name": "Brazil",
"kgPerKWh": 0.1092,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"CA": {
"name": "Canada",
"kgPerKWh": 0.1916,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"CH": {
"name": "Switzerland",
"kgPerKWh": 0.0393,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"CL": {
"name": "Chile",
"kgPerKWh": 0.2906,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"CN": {
"name": "China",
"kgPerKWh": 0.5283,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"CO": {
"name": "Colombia",
"kgPerKWh": 0.186,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"DE": {
"name": "Germany",
"kgPerKWh": 0.3341,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"DK": {
"name": "Denmark",
"kgPerKWh": 0.1196,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"EG": {
"name": "Egypt",
"kgPerKWh": 0.5572,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"ES": {
"name": "Spain",
"kgPerKWh": 0.1541,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"EU": {
"name": "EU",
"kgPerKWh": 0.211,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"FI": {
"name": "Finland",
"kgPerKWh": 0.0588,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"FR": {
"name": "France",
"kgPerKWh": 0.0412,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"GB": {
"name": "United Kingdom",
"kgPerKWh": 0.218,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"GR": {
"name": "Greece",
"kgPerKWh": 0.3246,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"ID": {
"name": "Indonesia",
"kgPerKWh": 0.7053,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"IN": {
"name": "India",
"kgPerKWh": 0.671,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"IE": {
"name": "Ireland",
"kgPerKWh": 0.2707,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"IL": {
"name": "Israel",
"kgPerKWh": 0.4929,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"IT": {
"name": "Italy",
"kgPerKWh": 0.2849,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"JP": {
"name": "Japan",
"kgPerKWh": 0.4737,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"KE": {
"name": "Kenya",
"kgPerKWh": 0.0959,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"KR": {
"name": "South Korea",
"kgPerKWh": 0.4177,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"MA": {
"name": "Morocco",
"kgPerKWh": 0.603,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"MX": {
"name": "Mexico",
"kgPerKWh": 0.4814,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"NG": {
"name": "Nigeria",
"kgPerKWh": 0.4517,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"NL": {
"name": "Netherlands",
"kgPerKWh": 0.2537,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"NO": {
"name": "Norway",
"kgPerKWh": 0.0281,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"NZ": {
"name": "New Zealand",
"kgPerKWh": 0.0965,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"PK": {
"name": "Pakistan",
"kgPerKWh": 0.3081,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"PH": {
"name": "The Philippines",
"kgPerKWh": 0.5954,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"PL": {
"name": "Poland",
"kgPerKWh": 0.5908,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"PT": {
"name": "Portugal",
"kgPerKWh": 0.1278,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"RU": {
"name": "Russia",
"kgPerKWh": 0.4469,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"SA": {
"name": "Saudi Arabia",
"kgPerKWh": 0.6798,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"SG": {
"name": "Singapore",
"kgPerKWh": 0.497,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"SE": {
"name": "Sweden",
"kgPerKWh": 0.0354,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"TH": {
"name": "Thailand",
"kgPerKWh": 0.5259,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"TR": {
"name": "Türkiye",
"kgPerKWh": 0.4758,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"US": {
"name": "United States",
"kgPerKWh": 0.3844,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"VN": {
"name": "Viet Nam",
"kgPerKWh": 0.4589,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"WORLD": {
"name": "World",
"kgPerKWh": 0.4601,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
},
"ZA": {
"name": "South Africa",
"kgPerKWh": 0.699,
"source": "Ember Yearly Electricity Data, 2025 generation-weighted lifecycle emissions intensity (gCO2e/kWh, 'Total generation'), https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
}
},
"ll97": {
"elec_2024": 0.288962,
"elec_2030": 0.145,
"steam_2024": 0.15330116,
"steam_2030": 0.1473984,
"gasKgPerKWh": 0.18121131999999998,
"oilKgPerKWh": 0.25320452,
"limitOffice2024": 0.00846,
"limitOffice2030": 0.00453,
"penalty": 268,
"source": "2024-29 coefficients & 2030-34 B limit: NYC Admin Code §28-320.3.1.1 / §28-320.3.2 (LL97 of 2019 as amended) https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-224093 and https://climate.law.columbia.edu/content/determine-ghg-emissions-energy-source; 2024-29 B limit 0.00846 & 2030-34 0.00453: https://sitepilot10.firmseek.com/client/zetlin/www/media/publication/498_Local_Law_97_Client_Alert.pdf; 2030-34 electricity 0.000145 & steam 0.0000432 tCO2e/kBtu: DOB rule 1 RCNY §103-14 as summarised at https://www.ny-engineers.com/blog/new-local-law-97-rules-for-nyc-building-owners-what-has-changed (primary rule PDF https://www.nyc.gov/assets/buildings/rules/1_RCNY_103-14_prom_details_date.pdf returned 403 to automated fetch — verify against Table in rule); penalty $268/t per §28-320.6",
"elecKgPerKWh": 0.288962,
"steamKgPerKWh": 0.15330116
},
"alternatives": [
{
"id": "onsite-pv",
"name": "On-site solar PV (rooftop)",
"elec": true,
"onsite": true,
"kgPerKWh": 0.041,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf (AR5 WGIII Annex III Table A.III.2 median, rooftop); NREL harmonization ~43: https://www.nrel.gov/analysis/life-cycle-assessment.html"
},
{
"id": "offsite-solar-ppa",
"name": "Off-site utility solar PPA",
"elec": true,
"onsite": false,
"kgPerKWh": 0.048,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf ; https://www.nrel.gov/analysis/life-cycle-assessment.html"
},
{
"id": "offsite-wind-ppa",
"name": "Off-site onshore wind PPA",
"elec": true,
"onsite": false,
"kgPerKWh": 0.011,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf ; NREL ~13: https://www.nrel.gov/analysis/life-cycle-assessment.html"
},
{
"id": "offshore-wind",
"name": "Offshore wind",
"elec": true,
"onsite": false,
"kgPerKWh": 0.012,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf"
},
{
"id": "hydro",
"name": "Hydropower",
"elec": true,
"onsite": false,
"kgPerKWh": 0.024,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf ; NREL ~21: https://www.nrel.gov/analysis/life-cycle-assessment.html"
},
{
"id": "nuclear",
"name": "Nuclear",
"elec": true,
"onsite": false,
"kgPerKWh": 0.012,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf ; NREL ~13: https://www.nrel.gov/analysis/life-cycle-assessment.html"
},
{
"id": "geothermal",
"name": "Geothermal",
"elec": true,
"onsite": false,
"kgPerKWh": 0.038,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf ; NREL ~37: https://www.nrel.gov/analysis/life-cycle-assessment.html"
},
{
"id": "biomass",
"name": "Biomass (dedicated)",
"elec": true,
"onsite": false,
"kgPerKWh": 0.23,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf"
},
{
"id": "gas-cc",
"name": "Gas combined cycle (reference)",
"elec": true,
"onsite": false,
"kgPerKWh": 0.49,
"note": "",
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf"
},
{
"id": "onsite-pv-mix",
"name": "On-site solar for 30%, grid for the rest",
"elec": true,
"onsite": false,
"gridShare": 0.7,
"kgPerKWh": 0.041,
"source": "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf (AR5 WGIII Annex III Table A.III.2 median, rooftop); NREL harmonization ~43: https://www.nrel.gov/analysis/life-cycle-assessment.html"
}
],
"fuels": {
"natural-gas": {
"kgPerKWh": 0.1812,
"source": "https://www.epa.gov/system/files/other-files/2025-01/ghg-emission-factors-hub-2025.xlsx (EPA GHG Emission Factors Hub 2025, Table 1) ; https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf"
},
"fuel-oil-2": {
"kgPerKWh": 0.2532,
"source": "https://www.epa.gov/system/files/other-files/2025-01/ghg-emission-factors-hub-2025.xlsx"
},
"propane": {
"kgPerKWh": 0.2151,
"source": "https://www.epa.gov/system/files/other-files/2025-01/ghg-emission-factors-hub-2025.xlsx"
},
"district-steam-generic": {
"kgPerKWh": 0.2266,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (EPA Hub Table 7 'Steam and Heat' 66.33 kg CO2/MMBtu: https://www.epa.gov/system/files/other-files/2025-01/ghg-emission-factors-hub-2025.xlsx)"
},
"district-steam-conedison": {
"kgPerKWh": 0.1533,
"source": "https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-224093"
},
"district-chw-electric": {
"kgPerKWh": 0.17982,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf"
},
"district-steam": {
"kgPerKWh": 0.2266,
"source": "https://portfoliomanager.energystar.gov/pdf/reference/Emissions.pdf (EPA Hub Table 7 'Steam and Heat' 66.33 kg CO2/MMBtu: https://www.epa.gov/system/files/other-files/2025-01/ghg-emission-factors-hub-2025.xlsx)"
}
},
"waterKgPerM3": 1.05,
"seagram": {
"asIs": {
"heating": "district-steam",
"cooling": "chiller-wc-centrifugal-old",
"lighting": "t8",
"plug": "plug-typical",
"shw": "shw-steam",
"fans": "fan-cv",
"other": "other-typical"
},
"measuredEUI": 221.7,
"endUseSplit": {
"heating": 125.4,
"shw": 7.6,
"cooling": 14.0,
"fans": 22.0,
"lighting": 17.0,
"plug": 15.0,
"other": 20.7,
"units": "kBtu/ft2, sums to 221.7"
},
"reasoning": "1) Fuel split: NYC LL84 disclosure for 375 Park Ave (BBL 1013070001; 824,906 ft2 GFA) CY2022 shows steam 66.73 M kBtu and grid electricity 40.15 M kBtu (11.77 GWh), natural gas 0.63 M kBtu, i.e. steam 62% / electricity 37% / gas <1% at EUI 130.3; CY2023 steam 52.8% (EUI 100.6), CY2024 43.3% (EUI 92.3) after retrofits. The 2012 EUI of 221.7 is far higher than any recent year and the excess is almost certainly steam (heating), so apply a ~60/40 steam/electric split: steam 133.0, electricity 88.7 kBtu/ft2. 2) Steam end uses: no steam absorption cooling listed, so steam = heating + SHW. CBECS 2018 Table E11 district-heat-using buildings: space heating 28.0 vs water heating 1.3 kBtu/ft2 for offices (~95/5); Seagram has kitchens (Four Seasons/Pool restaurant), so use ~94/6: heating 125.4, SHW 7.6. 3) Electric end uses: CBECS 2018 Table E3 office electricity shares excluding heating/water heating: ventilation 29.6%, lighting 18.1%, cooling 10.8%, plug (office equip+computing) 13.7%, other (cooking+refrig+misc) 27.8%. Applied to 88.7 gives fans 26.2, lighting 16.0, cooling 9.6, plug 12.2, other 24.7; adjusted for NYC (Middle Atlantic cooling but large glass tower with high internal/solar gain, financial-office plug density, 2012 T8-era lighting): cooling 14.0, fans 22.0, lighting 17.0, plug 15.0, other 20.7. Sanity check: 88.7 kBtu/ft2 electricity = 26 kWh/ft2, consistent with LL84 2022 (14.3 kWh/ft2 weather-normalised at lower occupancy) scaled to pre-retrofit 2012."
},
"toolNotes": [
{
"tool": "Zero Code (Architecture 2030 renewable energy calculator)",
"url": "https://www.zero-code.org/energy-calculator/",
"inputs": [
"Code pathway (prescriptive vs performance)",
"Standard (Zero Code/IECC 2021 App. CC on 90.1-2016, or Zero Code 2.0 on 90.1-2019)",
"Location (country/state/city/postcode -> climate zone, ~2,500 weather files)",
"Number of stories (with GFA x perimeter factor -> default roof PV area)",
"Use types + GFA per use (support spaces folded in)",
"Performance path: modelled annual energy by fuel",
"On-site PV: area, module type, losses, array type, tilt, azimuth, inverter eff."
],
"method": "Prescriptive: estimated consumption = PNNL ASHRAE 90.1 prototype building results for use type x climate zone, area-weighted. Renewable required = estimated consumption (1:1 site energy). On-site PV via NREL PVWatts API; remaining off-site procurement = required - on-site PV.",
"outputs": [
"Estimated building energy by end use (table + bar chart, prescriptive only)",
"Monthly PV production (PVWatts)",
"Total renewable required / on-site potential / off-site remainder",
"Metric/imperial toggle"
],
"borrow": "Use-type mix x area input; PNNL prototype end-use EUIs by climate as code-baseline; PVWatts call for on-site PV; simple 'gap' bar (demand vs on-site PV vs off-site procurement). Source: https://www.zero-code.org/user-guide/ ; https://www.energycodes.gov/prototype-building-models"
},
{
"tool": "Zero Tool (Architecture 2030)",
"url": "https://www.zerotool.org/",
"inputs": [
"Building use type(s) + area",
"Location (ZIP/climate)",
"Optional: actual/modelled energy by fuel",
"Optional: on-site renewable generation"
],
"method": "ENERGY STAR Portfolio Manager methodology: baseline = CBECS 2003 (commercial) / RECS 2001 (residential) median EUI adjusted for climate; 2030 Challenge target = baseline x (1 - 70/80/90/100% by year). Compares user EUI vs baseline and targets.",
"outputs": [
"Baseline site & source EUI",
"2030 Challenge target EUIs",
"% reduction achieved",
"Comparison to similar buildings and code"
],
"borrow": "'Baseline -> target -> you' bar/bullet chart and % below baseline metric; Zero Tool API is what C.Scale calls for baseline EUI. Source: https://www.zerotool.org/ ; https://docs.cscale.io/the-c-scale-tm-data-model/whole-life-carbon/operational-carbon"
},
{
"tool": "C.Scale (whole-life carbon)",
"url": "https://www.cscale.io/",
"inputs": [
"6 inputs: project name, completion year, location, use type, number of levels, area",
"Optional benchmark_EUI override (code minimum)",
"Scenario levers: low energy, all-electric, PV array area/GCR, grid scenario (Expected/Slow/Rapid), emission metric AER vs LRMER"
],
"method": "Annual loop from completion year to horizon (60 yr): Op carbon_y = sum_fuel(Area x EUI_fuel x CI_fuel,y). EUI baseline from Zero Tool API (CBECS 2003/RECS 2001), mixed-fuel (gas assumed for combustion, 2.4% upstream leakage). Electricity CI from NREL Cambium (AER incl. precombustion default, LRMER option), geometric interpolation between Cambium years, post-2050 extrapolated to 2110; non-US use national targets (EU/AUS 80% by 2050 expected, 20% slow, 99% rapid; UK FES; Canada NZE). PV via PVWatts v8 displacing grid (stage D2 for export). GWP100 (AR6 for oil N2O/CH4). Stated +/-20% annual vs hourly.",
"outputs": [
"Cumulative emissions over 60 years (time series, stacked by embodied / on-site combustion / electricity / refrigerant, with 'stored carbon' negative)",
"Baseline vs 3 decarbonisation scenarios bar (BAU, low energy, low-carbon structure) total at 30/60 yrs",
"Reductions by building system (waterfall-like 'baseline reduction' legend item)",
"Hot-spot breakdowns by assembly",
"PNG/PDF chart exports, AIA DDx export"
],
"borrow": "(a) annual time-series engine with grid trajectory per year; (b) stacked area of cumulative op carbon split by fuel (steam/electric/gas/refrigerant) with grid-scenario band (slow/expected/rapid); (c) scenario bar at fixed horizon; (d) waterfall from baseline -> passive -> efficiency -> electrification -> grid decarb -> renewables; (e) AER vs LRMER toggle. Sources: https://www.cscale.io/predict-whole-life-carbon ; https://docs.cscale.io/the-c-scale-tm-data-model/whole-life-carbon/operational-carbon ; https://docs.cscale.io/users-guide/benefits-of-an-organization-account/chart-exports"
},
{
"tool": "Architecture 2030 Palette",
"url": "https://2030palette.org/",
"inputs": [
"Strategy swatches by scale (region/site/building)"
],
"method": "Qualitative design guidance per strategy and climate; no quantified savings.",
"outputs": [
"Swatch cards with principles, climate applicability, precedents"
],
"borrow": "Taxonomy/naming of passive strategies and link-outs per end use; we attach indicative % reductions from other sources."
},
{
"tool": "NYC LL97 / BPS",
"url": "https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-224093",
"inputs": [
"GFA by occupancy group",
"Annual energy by fuel"
],
"method": "Emissions = sum(fuel x LL97 coefficient); limit = sum(GFA_occ x limit_occ); penalty $268 per tCO2e over.",
"outputs": [
"Annual tCO2e vs limit per compliance period (2024-29, 2030-34, ...)"
],
"borrow": "Step-line 'limit' overlay on the annual emissions chart and penalty $ annotation; show compliance-period bands."
}
],
"cambiumNote": {
"text": "For year-by-year grid decarbonisation (C.Scale approach) use NREL Cambium AER/LRMER by GEA region, scenarios Mid-case / High RE cost / Low RE cost; geometric interpolation between Cambium years; extrapolate post-2050 at 2026-50 average rate.",
"source": "https://docs.cscale.io/the-c-scale-tm-data-model/whole-life-carbon/operational-carbon ; https://www.nrel.gov/analysis/cambium.html"
}
};
