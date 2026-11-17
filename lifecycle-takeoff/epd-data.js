// Lifecycle Takeoff · EPD records, transcribed module by module from the EPD PDFs (links in each record). Values are per
// declared unit exactly as printed; status strings ("ND", "MND"…) are kept where a module is not declared.
export const EPD_RAW = {
"steel-section": [
{
"title": "Steel Rails and Sections EPD (British Steel sections and rails)",
"manufacturer": "British Steel Limited",
"programOperator": "Tata Steel UK Limited (EPD programme)",
"regNo": "EPD-TS-2026-027",
"issued": "2026-07-31",
"validUntil": "2031-07-30",
"standard": "EN 15804:2012+A2:2019",
"indicator": "GWP-total",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "Scunthorpe integrated steelworks (BF-BOF) + Teesside Beam Mill, UK (approx coords of Scunthorpe)",
"lat": 53.574,
"lon": -0.627
},
"landingUrl": "https://www.britishsteel.co.uk/",
"pdfUrl": "https://www.britishsteel.co.uk/wp-content/uploads/2026/07/British-Steel-Rails-and-Sections-EPD-2026.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 2940.0,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 70.4,
"C2": 12.9,
"C3": 10.9,
"C4": 0.15,
"D": -1740.0
},
"moduleNotes": {
"C": "C1 dismantling energy (German published data); C2 100 km by 25 t truck (40% utilisation) to recycling/landfill, 250 km for reuse; C3 processing for recycling; C4 1% of steel to landfill (NFDC survey).",
"D": "Net-scrap credit (worldsteel 2017 method) for steel recycled/reused at end of life: 92% recycled, 7% reused (Table 4); system diagram text says 'Recycling of the steel component (85%)'.",
"A4": "MND",
"general": "Covers sections AND rails (average). GWP-fossil A1-A3 also 2.94E+03. BF-BOF route; blast-furnace slag co-product allocated per worldsteel/EUROFER method; process gases by system expansion."
},
"dParts": [
{
"type": "recycling",
"note": "92% of steel recycled at EOL, net scrap credited"
},
{
"type": "reuse",
"note": "7% of steel reused at EOL"
}
],
"processes": [
{
"module": "A1",
"name": "Iron & steelmaking at Scunthorpe",
"summary": "Iron ore and limestone are sintered, reduced with coke in the blast furnace to liquid iron, scrap is added and oxygen-blown in the BOF to steel, then continuously cast into blooms/billets.",
"locations": [
{
"name": "Scunthorpe steelworks",
"lat": 53.574,
"lon": -0.627,
"role": "plant"
},
{
"name": "Immingham bulk terminal (ore/coal import port; not named in EPD, approx)",
"lat": 53.63,
"lon": -0.19,
"role": "port"
}
]
},
{
"module": "A2",
"name": "Rail transfer of semis",
"summary": "Some semi-finished products travel 196 km by rail from Scunthorpe to Teesside.",
"locations": [
{
"name": "Scunthorpe",
"lat": 53.574,
"lon": -0.627,
"role": "plant"
},
{
"name": "Teesside Beam Mill, Lackenby (approx)",
"lat": 54.575,
"lon": -1.14,
"role": "plant"
}
]
},
{
"module": "A3",
"name": "Hot rolling of sections and rails",
"summary": "Semis are reheated and hot-rolled into universal beams/columns, angles, channels and rails at Scunthorpe and Teesside, then bundled with minimal packaging.",
"locations": [
{
"name": "Scunthorpe mills",
"lat": 53.574,
"lon": -0.627,
"role": "plant"
},
{
"name": "Teesside Beam Mill (approx)",
"lat": 54.575,
"lon": -1.14,
"role": "plant"
}
]
},
{
"module": "C1",
"name": "Deconstruction",
"summary": "Diesel machinery dismantles the steel frame.",
"locations": []
},
{
"module": "C2",
"name": "Transport to recycler/landfill",
"summary": "100 km by truck to recycling or landfill (250 km for reuse).",
"locations": []
},
{
"module": "C3",
"name": "Scrap processing",
"summary": "Recovered sections are processed for recycling.",
"locations": []
},
{
"module": "C4",
"name": "Landfill",
"summary": "1% of the steel is landfilled.",
"locations": []
},
{
"module": "D",
"name": "Recycling/reuse credit",
"summary": "Net scrap above the scrap input is credited as avoided primary steel.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Iron ore (sintered)",
"share": null,
"source": "EPD",
"origin": {
"name": "Not stated in EPD (imported via Humber ports; approx)",
"lat": 53.63,
"lon": -0.19
}
},
{
"name": "Coal (coke)",
"share": null,
"source": "EPD",
"origin": {
"name": "Not stated in EPD",
"lat": null,
"lon": null
}
},
{
"name": "Limestone",
"share": null,
"source": "EPD",
"origin": {
"name": "Not stated in EPD",
"lat": null,
"lon": null
}
},
{
"name": "Steel scrap (added to BOF)",
"share": null,
"source": "EPD",
"origin": {
"name": "Not stated in EPD",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"steel-section-eaf": [
{
"title": "Hot-rolled Structural Steel Sections (SDI Structural and Rail Division)",
"manufacturer": "Steel Dynamics, Inc.",
"programOperator": "ASTM International",
"regNo": "EPD 1075",
"issued": "2025-10-15",
"validUntil": "2030-10-15",
"standard": "ISO 21930:2017 (Smart EPD Part A v1.2, Part B Steel v3)",
"indicator": "GWP-total (EF 3.1)",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "SDI Structural and Rail Division, 2601 County Road 700 E, Columbia City, IN (approx)",
"lat": 41.16,
"lon": -85.49
},
"landingUrl": "https://lpg.steeldynamics.com/pdf/Columbia-City/Sustainability/Structural-EPD.pdf",
"pdfUrl": "https://lpg.steeldynamics.com/pdf/Columbia-City/Sustainability/Structural-EPD.pdf",
"verified": true,
"modules": {
"A1": 96.7,
"A2": 26.7,
"A3": 541.0,
"A1A3": 664.0,
"A4": "X (not declared)",
"A5": "X (not declared)",
"B1": "X (not declared)",
"B2": "X (not declared)",
"B3": "X (not declared)",
"B4": "X (not declared)",
"B5": "X (not declared)",
"B6": "X (not declared)",
"B7": "X (not declared)",
"C1": "X (not declared)",
"C2": "X (not declared)",
"C3": "X (not declared)",
"C4": "X (not declared)",
"D": "X (not declared)"
},
"moduleNotes": {
"C": "Not declared (cradle-to-gate).",
"D": "Not declared.",
"A4": "Not declared",
"general": "In this EPD's legend a check mark = included and 'X' = module not declared. Primary result uses RECs (market-based); non-adjusted baseline without RECs: A1-A3 GWP-total 7.42E+02. Fabricated sections (Table 5-4, AISC fabrication averages, 1.0771 t mill steel per t): A1 7.15E+02, A2 4.46E+01, A3 9.67E+01, A1-A3 8.57E+02."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Ferrous scrap and alloy supply",
"summary": "Recycled ferrous scrap (largely from SDI's own OmniSource recycling) plus alloys and charge/injection carbon are supplied.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Scrap and materials are trucked/railed to Columbia City.",
"locations": []
},
{
"module": "A3",
"name": "EAF + LMF steelmaking and section rolling",
"summary": "Scrap is melted in an electric arc furnace, refined in a ladle metallurgy furnace, cast and hot-rolled into beams, channels and angles.",
"locations": [
{
"name": "SDI Columbia City (approx)",
"lat": 41.16,
"lon": -85.49,
"role": "plant"
}
]
}
],
"rawMaterials": [
{
"name": "Recycled content (ferrous scrap)",
"share": 0.98,
"source": "EPD",
"origin": {
"name": "Not stated (US Midwest scrap)",
"lat": null,
"lon": null
}
},
{
"name": "Alloying materials",
"share": 0.02,
"source": "EPD",
"origin": {
"name": "Not stated",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
},
{
"title": "Hot-rolled structural shapes (EAF, conventional electricity grid; XCarb results in annex)",
"manufacturer": "ArcelorMittal Europe - Long Products (Commercial Sections)",
"programOperator": "SCS Global Services",
"regNo": "SCS-EPD-09966",
"issued": "2024-03-27",
"validUntil": "2029-02-28",
"standard": "ISO 21930:2017 / ISO 14025 (UL Part A v4.0 + Part B Steel v2.0)",
"indicator": "GWP-100 TRACI 2.1",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "Weighted average of Esch-Belval, Differdange, Rodange (LU), Olaberria & Bergara (ES); coords Belval approx",
"lat": 49.5,
"lon": 5.94
},
"landingUrl": "https://www.scsglobalservices.com/certified-green-products-guide",
"pdfUrl": "https://amiresources.arcelormittal.com/strapidata/uploads/Arcelor_Mittal_EPD_UL_Standard_X_Carb_Sections_4e320fdd09.pdf",
"verified": true,
"modules": {
"A1": 194.0,
"A2": 29.5,
"A3": 250.0,
"A1A3": null,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 41.4,
"C2": 25.9,
"C3": 1.34,
"C4": 0.426,
"D": 382.0
},
"moduleNotes": {
"C": "EOL 97% recycling, 3% landfill; C1 generic demolition scenario; C2 100 km to waste processing + 200 km to final destination.",
"D": "Net-scrap method: EOL recycled steel minus scrap input. Because input is ~100% scrap (SM 1.19E+03 kg), net scrap is negative and D is a BURDEN (+382), not a credit.",
"A1A3": "A1-A3 aggregate not printed; A1+A2+A3 = 473.5 kg CO2e/t (sum, not EPD value). CML GWP row: A1 1.95E+02, A2 2.96E+01, A3 2.51E+02, C1 4.15E+01, C2 2.60E+01, C3 1.35E+00, C4 4.28E-01, D 3.85E+02. Annex (XCarb, renewable electricity) A3 = 1.60E+02 TRACI. Mill-specific A1-A3 (conventional, TRACI): Belval 428, Differdange 441, Rodange 498, Bergara 509. EPD adds US fabrication: transport 44.6, fabrication 96.7 kg CO2e (AISC 2021).",
"A4": "MND"
},
"dParts": [
{
"type": "recycling",
"note": "net scrap negative -> load, not credit"
}
],
"processes": [
{
"module": "A1",
"name": "Scrap and ferro-alloy supply",
"summary": "Purchased steel scrap plus ferro-alloys (FeCr, FeMn, FeNb), lime and electrodes are supplied to the melt shops.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Scrap and additives are transported to the mills.",
"locations": []
},
{
"module": "A3",
"name": "EAF melting, ladle refining, casting, hot rolling",
"summary": "Scrap is melted in an electric arc furnace, refined in a ladle furnace, continuously cast, hot rolled into sections and cooled/finished.",
"locations": [
{
"name": "Esch-Belval",
"lat": 49.5,
"lon": 5.94,
"role": "plant"
},
{
"name": "Differdange",
"lat": 49.52,
"lon": 5.89,
"role": "plant"
},
{
"name": "Rodange",
"lat": 49.55,
"lon": 5.84,
"role": "plant"
},
{
"name": "Bergara",
"lat": 43.12,
"lon": -2.41,
"role": "plant"
},
{
"name": "Olaberria",
"lat": 43.03,
"lon": -2.2,
"role": "plant"
}
]
},
{
"module": "C1",
"name": "Demolition",
"summary": "Generic diesel demolition scenario.",
"locations": []
},
{
"module": "C2",
"name": "Transport",
"summary": "100 km to processing plus 200 km to final destination.",
"locations": []
},
{
"module": "C3",
"name": "Waste processing",
"summary": "Steel leaves the system for recycling (970 kg).",
"locations": []
},
{
"module": "C4",
"name": "Landfill",
"summary": "3% landfilled.",
"locations": []
},
{
"module": "D",
"name": "Net scrap",
"summary": "Net scrap negative so a burden for scrap consumed is reported.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Steel scrap (secondary material, 1.19E+03 kg per t)",
"share": null,
"source": "EPD",
"origin": {
"name": "Not stated",
"lat": null,
"lon": null
}
},
{
"name": "Ferro-alloys (FeCr, FeMn, FeNb)",
"share": null,
"source": "EPD",
"origin": {
"name": "Not stated",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"steel-deck": [
{
"title": "Steel Roof and Floor Deck - Industry Average EPD",
"manufacturer": "Steel Deck Institute (member average: ASC, Canam, Cordeck, Epic Metals, New Millennium, Verco, Vulcraft, etc.)",
"programOperator": "UL Environment",
"regNo": "4789985146.101.1",
"issued": "2022-01-21",
"validUntil": "2027-01-21",
"standard": "ISO 21930:2017 (UL Part A v3.2 + Part B Steel v2.0)",
"indicator": "GWP-100 IPCC AR5 (excl. biogenic)",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "Industry average of SDI member plants across North America (no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://spot.ul.com",
"pdfUrl": "https://www.epicmetals.com/assets/misc/101.1_SDI_EPD_2022-Steel-Deck.pdf",
"verified": true,
"modules": {
"A1": 2210.0,
"A2": 49.5,
"A3": 65.6,
"A1A3": 2320.0,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "MND (disposal outside scope)",
"D": "MND",
"A4": "MND",
"general": "Covers galvanized or uncoated (optionally painted) roof and floor deck incl. composite floor deck (ANSI/SDI C-2017); not galvanised-only. Coil upstream from AISI (2017) and worldsteel (2019) datasets, i.e. mixed BOF/EAF. Validity '5 years' from issue (valid-until computed). Statistical range A1-A3: min 1.60E+03, max 3.47E+03, mean 2.35E+03, median 2.30E+03."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Coated steel coil production",
"summary": "Galvanized or uncoated steel sheet coil is produced by North American (AISI) and global (worldsteel) mills, BOF and EAF routes.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Coil and process materials travel to deck plants (500 miles by truck assumed where data missing).",
"locations": []
},
{
"module": "A3",
"name": "Cold roll-forming of deck",
"summary": "Steel sheet is cold-formed into ribbed deck panels using small amounts of lubricant and welding electrodes.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Coated/galvanized steel coil (almost entire mass) + small amount of paint",
"share": null,
"source": "EPD",
"origin": {
"name": "North America",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"rebar": [
{
"title": "Fabricated Steel Reinforcement Bar - Industry-Wide EPD",
"manufacturer": "Concrete Reinforcing Steel Institute (CRSI) members",
"programOperator": "ASTM International",
"regNo": "EPD 362 (ASTM-EPD362)",
"issued": "2022-09-20",
"validUntil": "2027-09-19",
"standard": "ISO 21930:2017 (UL Part A 2018 + Part B Steel 2020)",
"indicator": "GWP-100",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "Industry average of CRSI EAF mills and fabricators, North America (no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.crsi.org/sustainability/environmental-product-declaration/",
"pdfUrl": "https://www.crsi.org/wp-content/uploads/CRSI_Industry-Wide_EPD_Sep2022.pdf",
"verified": true,
"modules": {
"A1": 778.0,
"A2": 49.0,
"A3": 27.0,
"A1A3": 854.0,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "MND",
"D": "MND",
"A4": "MND",
"general": "Fabricated rebar; A1 includes EAF steelmaking and rolling of unfabricated bar; A2 is transport mill->fabricator; A3 is fabrication (cut/bend). Reference year 2020. Statistical range A1-A3 8.09E+02 to 1.00E+03."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "EAF melt shop and rolling mill",
"summary": "Steel scrap is melted in electric arc furnaces, cast into billets and hot-rolled into rebar.",
"locations": []
},
{
"module": "A2",
"name": "Transport to fabricators",
"summary": "Rebar travels by truck and rail to fabrication shops (production-weighted distances).",
"locations": []
},
{
"module": "A3",
"name": "Fabrication",
"summary": "Rebar is cut and bent into shapes; fabrication scrap is recycled externally.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Recycled steel scrap",
"share": 0.98,
"source": "EPD",
"origin": {
"name": "United States",
"lat": null,
"lon": null
}
},
{
"name": "Typical composition: steel 98.3%, Mn <2%, C <1%, Cr <1%, Si <1%, others <1.5%",
"share": null,
"source": "EPD",
"origin": {
"name": "",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
},
{
"title": "Unfabricated and Fabricated Steel Rebar (values: fabricated, without RECs)",
"manufacturer": "Commercial Metals Company (CMC)",
"programOperator": "Smart EPD",
"regNo": "SmartEPD-2025-086-0608-01",
"issued": "2025-08-25",
"validUntil": "2030-08-25",
"standard": "ISO 21930:2017 (UL Part A v4 + Part B Steel 2020)",
"indicator": "GWP-total IPCC AR5 GWP 100",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "Average of 7 CMC EAF mills (Mesa AZ, Jacksonville FL, Sayreville NJ, Durant OK, Cayce SC, Knoxville TN, Seguin TX); coords Seguin approx",
"lat": 29.57,
"lon": -97.96
},
"landingUrl": "https://www.cmc.com/getmedia/c9bd8b96-2152-435e-83f0-2f3022ebda94/Unfabricated-and-Fabricated-Steel-Rebar.pdf",
"pdfUrl": "https://www.cmc.com/getmedia/c9bd8b96-2152-435e-83f0-2f3022ebda94/Unfabricated-and-Fabricated-Steel-Rebar.pdf",
"verified": true,
"modules": {
"A1": 657.0,
"A2": 32.5,
"A3": 27.7,
"A1A3": 717.0,
"A4": "ND",
"A5": "ND",
"B1": "ND",
"B2": "ND",
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": "ND",
"B7": "ND",
"C1": "ND",
"C2": "ND",
"C3": "ND",
"C4": "ND",
"D": "ND"
},
"moduleNotes": {
"C": "ND",
"D": "ND",
"A4": "ND",
"general": "Read via WebFetch text extraction (direct curl download returned an HTML 404 page), not a local PDF parse. Table row printed as 'GWP-total IPCC AR5 GWP 100 ND 1.58e+2 1.56e+1 4.35e+2 6.08e+2' - one stray ND cell; mapping to A1/A2/A3/A1-A3 confirmed by sum. Unfabricated (without RECs): A1 1.58e+2, A2 1.56e+1, A3 4.35e+2, A1-A3 6.08e+2. With RECs: unfabricated A1-A3 6.04e+2, fabricated 7.12e+2. Fabrication proxy = average of Fresno CA, Dallas TX, Fredericksburg VA; 1.079 t mill rebar per t fabricated."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Scrap supply + EAF rebar (for fabricated: unfabricated bar)",
"summary": "Pre- and post-consumer scrap is melted in EAFs and rolled into rebar at seven CMC mills.",
"locations": [
{
"name": "CMC Mesa AZ (approx)",
"lat": 33.42,
"lon": -111.83,
"role": "plant"
},
{
"name": "CMC Jacksonville FL (approx)",
"lat": 30.3,
"lon": -81.97,
"role": "plant"
},
{
"name": "CMC Sayreville NJ (approx)",
"lat": 40.46,
"lon": -74.33,
"role": "plant"
},
{
"name": "CMC Durant OK (approx)",
"lat": 33.99,
"lon": -96.37,
"role": "plant"
},
{
"name": "CMC Cayce SC (approx)",
"lat": 33.95,
"lon": -81.07,
"role": "plant"
},
{
"name": "CMC Knoxville TN (approx)",
"lat": 35.96,
"lon": -83.92,
"role": "plant"
},
{
"name": "CMC Seguin TX (approx)",
"lat": 29.57,
"lon": -97.96,
"role": "plant"
}
]
},
{
"module": "A2",
"name": "Transport to fabrication",
"summary": "Bar is shipped from mills to fabrication shops.",
"locations": []
},
{
"module": "A3",
"name": "Fabrication",
"summary": "Bar is cut and bent at representative fabrication shops.",
"locations": [
{
"name": "CMC Rebar Fresno CA (approx)",
"lat": 36.74,
"lon": -119.79,
"role": "plant"
},
{
"name": "CMC Rebar Dallas TX (approx)",
"lat": 32.78,
"lon": -96.8,
"role": "plant"
},
{
"name": "CMC Rebar Fredericksburg VA (approx)",
"lat": 38.3,
"lon": -77.46,
"role": "plant"
}
]
}
],
"rawMaterials": [
{
"name": "Recycled steel (GLO)",
"share": 0.97,
"source": "EPD",
"origin": {
"name": "Global/US scrap; EPD states >97% (98.0% average recycled content)",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"steel-stud": [
{
"title": "Industry-Average Cold-Formed Steel (CFS) Framing Products",
"manufacturer": "Steel Framing Industry Association (12 producers incl. ClarkDietrich, CEMCO, Marino\\WARE, Steeler)",
"programOperator": "UL Solutions",
"regNo": "4792282816.101.2",
"issued": "2026-08-13",
"validUntil": "2031-08-13",
"standard": "ISO 21930:2017 (Smart EPD Part A v1.2 + Part B Steel v3)",
"indicator": "GWP-total IPCC AR6 GWP100",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "Industry average, one facility from each of 12 producers, North America (no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://buildsteel.org/epd-cfs/",
"pdfUrl": "https://buildsteel.org/wp-content/uploads/2026/08/101.2_SFIA-Cold-Formed-Steel-Framing-Industry-Average-EPD.pdf",
"verified": true,
"modules": {
"A1": 2460.0,
"A2": 118.0,
"A3": 35.1,
"A1A3": 2620.0,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "MND",
"D": "MND",
"A4": "MND",
"general": "Validity '5 Years' from issue (valid-until computed). GWP-fossil A1-A3 2.65E+03; GWP-biogenic -2.88E+01. Range across facilities 2.30E+03 to 2.95E+03. Coil upstream from AISI (HDG, RNA 2017) and worldsteel datasets."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Hot-dip galvanized coil production",
"summary": "HDG cold-rolled coil is produced at domestic and international BOF and EAF mills (modelled with AISI and worldsteel datasets).",
"locations": []
},
{
"module": "A2",
"name": "Coil transport",
"summary": "Galvanized coil is shipped to the CFS roll-forming plants.",
"locations": []
},
{
"module": "A3",
"name": "Slitting and roll-forming",
"summary": "Coil is uncoiled, slit, cut and roll-formed into studs, track and joists, optionally punched and stamped.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Alloys and other iron units",
"share": 0.576,
"source": "EPD",
"origin": {
"name": "Domestic and international mills",
"lat": null,
"lon": null
}
},
{
"name": "Steel scrap, pre-consumer",
"share": 0.424,
"source": "EPD",
"origin": {
"name": "",
"lat": null,
"lon": null
}
},
{
"name": "Steel scrap, post-consumer",
"share": 0.0,
"source": "EPD",
"origin": {
"name": "(EPD notes recycled content source mostly unknown, reported aggregated)",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"bronze": [
{
"title": "Brass Bars (extruded and cold-drawn; CW510L-CW721R incl. CW614N, CW617N)",
"manufacturer": "Nordic Brass Gusum AB",
"programOperator": "EPD International AB (The International EPD System)",
"regNo": "EPD-IES-0032885:001",
"issued": "2026-07-03",
"validUntil": "2031-07-03",
"standard": "EN 15804:2012+A2:2019/AC:2021 (PCR 2019:14 v2.0.1)",
"indicator": "GWP-total",
"declaredUnit": "1 kg",
"kgPerUnit": 1,
"plant": {
"name": "Nordic Brass Gusum AB, Grasdalen 1, Gusum, Sweden (approx)",
"lat": 58.27,
"lon": 16.48
},
"landingUrl": "https://www.environdec.com/library/epd32885",
"pdfUrl": "https://api.prod.environdec.com/api/v1/EPDLibrary/Files/EPDs/9bff9081-186f-42db-e58c-08ded5a366ec/Documents",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 1.94,
"A4": "ND",
"A5": "ND",
"B1": "ND",
"B2": "ND",
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": "ND",
"B7": "ND",
"C1": 0.000399,
"C2": 0.0152,
"C3": 0.000769,
"C4": 0.0283,
"D": -3.28
},
"moduleNotes": {
"C": "C1 PCR default demolition; C2 80 kgkm by 16-32 t EURO5 lorry; C3 95% to material recycling (PEF default for copper alloys) with sorting; C4 5% to inert landfill.",
"D": "Net export of secondary brass (95% recycling minus 93% recycled input, with quality factor) substitutes primary brass.",
"A4": "ND",
"general": "No bronze EPD with current validity found; brass (CuZn alloys) is the closest match to Seagram's Muntz metal (CuZn40). Products are bars/profiles not architectural extrusions/sheet. GWP-fossil A1-A3 1.91E+00. A1 uses a Swiss primary-brass ecoinvent proxy. A3 electricity is a nuclear supply contract (7.61E-03 kg CO2e/kWh)."
},
"dParts": [
{
"type": "recycling",
"note": "net secondary brass substituting primary brass"
}
],
"processes": [
{
"module": "A1",
"name": "Recycled raw material supply",
"summary": "Mostly brass/copper scrap: post-consumer scrap from waste contractors and pre-consumer chips returned from customers, plus some primary metal.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Euro 6 trucks deliver raw materials; returned brass chips are hauled by trucks on HVO100.",
"locations": []
},
{
"module": "A3",
"name": "Melting, casting, extrusion, drawing",
"summary": "Charge is melted in a smelting furnace, continuously cast into billets, extruded in a press plant and cold-drawn in the rod mill into bars, then packed.",
"locations": [
{
"name": "Nordic Brass Gusum (approx)",
"lat": 58.27,
"lon": 16.48,
"role": "plant"
}
]
},
{
"module": "C2",
"name": "EOL transport",
"summary": "Truck transport to waste treatment.",
"locations": []
},
{
"module": "C3",
"name": "Sorting for recycling",
"summary": "95% of brass sorted and sent to recycling.",
"locations": []
},
{
"module": "C4",
"name": "Landfill",
"summary": "5% to inert landfill.",
"locations": []
},
{
"module": "D",
"name": "Recycling credit",
"summary": "Net secondary brass credited against primary brass production.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Post-consumer recycled material",
"share": 0.356,
"source": "EPD",
"origin": {
"name": "Sweden/Europe (EPD: A1 material from Europe)",
"lat": null,
"lon": null
}
},
{
"name": "Pre-consumer recycled material",
"share": 0.574,
"source": "EPD",
"origin": {
"name": "Customer sites (return system)",
"lat": null,
"lon": null
}
},
{
"name": "Primary / virgin metal and alloying (remainder, derived 1-0.356-0.574)",
"share": 0.07,
"source": "EPD",
"origin": {
"name": "Europe (modelled with Swiss dataset)",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
},
{
"title": "Nordic Bronze (CuSn4 sheet and coil)",
"manufacturer": "Aurubis Finland Oy",
"programOperator": "Institut Bauen und Umwelt e.V. (IBU)",
"regNo": "EPD-AUR-20160217-CBA1-EN",
"issued": "2017-01-09",
"validUntil": "2023-01-08",
"standard": "EN 15804:2012+A1:2013",
"indicator": "GWP (EN 15804+A1, CML)",
"declaredUnit": "1 kg",
"kgPerUnit": 1,
"plant": {
"name": "Aurubis Finland Oy rolling mill, Pori, Finland (approx)",
"lat": 61.48,
"lon": 21.79
},
"landingUrl": "https://www.aurubis.com/nordic-copper/downloads",
"pdfUrl": "https://www.aurubis.com/dam/jcr:61725809-144a-4ce8-a285-469ce85caee7/Nordic-Bronze.2025-09-08-14-14-11.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 0.772,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MNR",
"B4": "MNR",
"B5": "MNR",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": 0.0,
"C4": "MND",
"D": 0.00662
},
"moduleNotes": {
"C": "1 kg collected separately, 0.99 kg recycling; C3 = 0.",
"D": "Net scrap substituting primary material -0.01 kg (input 100% secondary material), so D is a small burden (+6.62E-3).",
"A4": "MND",
"general": "EXPIRED (valid to 2023-01-08) - kept only because it is a true bronze. Use of secondary material 1.00 kg/kg, so A1-A3 carries no primary-copper burden; low value reflects cut-off for scrap. Cakes supplied from Aurubis Stolberg and Schwermetall (Germany), only rolled at Pori. Production year 2015."
},
"dParts": [
{
"type": "recycling",
"note": "net scrap -0.01 kg -> small load"
}
],
"processes": [
{
"module": "A1",
"name": "Cast bronze cakes",
"summary": "CuSn4 cakes are cast from secondary material by Aurubis Stolberg and Schwermetall in Germany.",
"locations": [
{
"name": "Aurubis Stolberg (approx)",
"lat": 50.77,
"lon": 6.23,
"role": "smelter"
},
{
"name": "Schwermetall Halbzeugwerk, Stolberg (approx)",
"lat": 50.76,
"lon": 6.25,
"role": "plant"
}
]
},
{
"module": "A2",
"name": "Transport to Pori",
"summary": "Cakes are shipped from Germany to Finland.",
"locations": []
},
{
"module": "A3",
"name": "Rolling",
"summary": "Cakes are rolled into 0.5-2.0 mm sheet/coil using rolling oil emulsion and benzotriazole anticorrosive.",
"locations": [
{
"name": "Aurubis Pori (approx)",
"lat": 61.48,
"lon": 21.79,
"role": "plant"
}
]
},
{
"module": "C3",
"name": "Collection for recycling",
"summary": "Sheet collected separately, 99% recycled.",
"locations": []
},
{
"module": "D",
"name": "Net scrap",
"summary": "Small net scrap deficit reported as a load.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Copper (balance, ~95.5-96.5%)",
"share": null,
"source": "EPD",
"origin": {
"name": "Secondary material (EPD: use of secondary material 1.00 kg)",
"lat": null,
"lon": null
}
},
{
"name": "Tin 3.5-4.5%",
"share": 0.04,
"source": "EPD",
"origin": {
"name": "",
"lat": null,
"lon": null
}
},
{
"name": "Phosphorus 0.01-0.4%",
"share": null,
"source": "EPD",
"origin": {
"name": "",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"aluminium": [
{
"title": "Extruded Aluminum - Industry-Average, Manufactured in North America",
"manufacturer": "The Aluminum Association (industry average)",
"programOperator": "UL Environment",
"regNo": "4790545973.104.1",
"issued": "2022-09-27",
"validUntil": "2027-09-27",
"standard": "ISO 21930:2017 (ULE Part A v4 + Part B Aluminum Construction Products v1.0)",
"indicator": "GWP IPCC AR5",
"declaredUnit": "1 t",
"kgPerUnit": 1000,
"plant": {
"name": "Industry average of North American extruders (no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.aluminum.org/",
"pdfUrl": "https://www.aluminum.org/sites/default/files/2022-10/104.1_EPD_AA_Extrusion.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 6080.0,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "-",
"C2": 9.9,
"C3": "-",
"C4": 2.17,
"D": -3390.0
},
"moduleNotes": {
"C": "95% recycling, 5% landfill; C1 and C3 reported as '-' (zero, below ISO 21930 cut-off); C2 100 km by truck.",
"D": "Net-scrap substitution: EOL scrap minus recycled input; surplus credited as avoided primary aluminium minus remelting burden.",
"A4": "MND",
"general": "Validity '5 Years' (valid-until computed). CML GWP 100 row: A1-A3 6.06E+03, C2 9.88E+00, C4 2.16E+00, D -3.38E+03. Includes packaging and 100 km transport of semi-fabricated product. Primary data year 2016 (2015-2019)."
},
"dParts": [
{
"type": "recycling",
"note": "95% EOL recycling, net scrap credit"
}
],
"processes": [
{
"module": "A1",
"name": "Bauxite, alumina, primary smelting and scrap remelt",
"summary": "Primary ingot (domestic NA hydro-heavy plus imports from Bahrain, UAE, Russia, Brazil, Argentina, Venezuela, RoW) is blended with post-industrial and post-consumer scrap and cast to billet.",
"locations": [
{
"name": "Quebec/Saguenay smelters, Canada (region, approx)",
"lat": 48.43,
"lon": -71.07,
"role": "smelter"
},
{
"name": "Bahrain (Alba, approx)",
"lat": 26.09,
"lon": 50.62,
"role": "smelter"
},
{
"name": "UAE (EGA Jebel Ali, approx)",
"lat": 24.99,
"lon": 55.07,
"role": "smelter"
},
{
"name": "Russia (Siberia, region approx)",
"lat": 56.0,
"lon": 92.9,
"role": "smelter"
},
{
"name": "Brazil (region approx)",
"lat": -1.5,
"lon": -48.5,
"role": "smelter"
},
{
"name": "Argentina (Puerto Madryn, approx)",
"lat": -42.77,
"lon": -65.04,
"role": "smelter"
}
]
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Metal and scrap move to the extrusion plants; supply-chain transport is embedded in upstream datasets.",
"locations": []
},
{
"module": "A3",
"name": "Extrusion and finishing",
"summary": "Billet is preheated, pressed through a heated die, quenched, stretched, cut, aged and finished (anodized, painted or lacquered).",
"locations": []
},
{
"module": "C2",
"name": "EOL transport",
"summary": "100 km by truck.",
"locations": []
},
{
"module": "C4",
"name": "Landfill",
"summary": "5% landfilled.",
"locations": []
},
{
"module": "D",
"name": "Recycling credit",
"summary": "Net scrap credited as avoided primary aluminium.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Primary aluminum (incl. alloy agents)",
"share": 0.4,
"source": "EPD",
"origin": {
"name": "North America + imports (see A1 locations)",
"lat": null,
"lon": null
}
},
{
"name": "Recovered aluminum, other post-industrial scrap",
"share": 0.31,
"source": "EPD",
"origin": {
"name": "North America",
"lat": null,
"lon": null
}
},
{
"name": "Recovered metal, post-consumer scrap",
"share": 0.29,
"source": "EPD",
"origin": {
"name": "North America",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"concrete": [
{
"title": "NRMCA Member Industry-Average Ready Mixed Concrete V4: mix 4000-00-FA/SL (4,000 psi, normal-weight, non-air-entrained, 0% SCM)",
"manufacturer": "National Ready Mixed Concrete Association (NRMCA), industry average of 1,238 US member facilities",
"programOperator": "EPD International AB (International EPD System), licensee EPD North America",
"regNo": "EPD-IES-0034276",
"issued": "2026-10-09",
"validUntil": "2031-10-09",
"standard": "ISO 14025, ISO 21930:2017, PCR NSF 1112-26 Concrete v3.0 (not EN 15804 compliant)",
"indicator": "GWPT (GWP-total, IPCC AR5 100-yr)",
"declaredUnit": "1 m3",
"plant": {
"name": "US national industry average (1,238 facilities; no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.nrmca.org/epd/",
"pdfUrl": "https://www.nrmca.org/wp-content/uploads/NRMCA_EPD_V4_20261010.pdf",
"verified": true,
"kgPerUnit": 2350,
"kgPerUnitSource": "EPD p.7 product table: fresh density 2,350 kg/m3 for 4000-00-FA/SL",
"modules": {
"A1": 294.32,
"A2": 24.95,
"A3": 10.91,
"A1A3": 330.17,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "Not declared (MND). EPD scope is cradle-to-gate A1-A3 only.",
"D": "Not declared (MND).",
"A4": "Not declared. NSF 1112-26 allows A4 reporting but it is not in the V4 baseline results; 70% of truck-mixer fleet energy is reserved for A4, 30% is allocated to A3.",
"regional": "EPD says regional benchmarks for 18 study groups exist in the V4 LCA report (not the EPD). The Eastern region (227 facilities) A1-A3 GWPT for NW non-air-entrained 4000 psi is 256.82 kg CO2e/m3 (LCA report Table 45). It is not an EPD value, so it is excluded from the declared data.",
"processesNote": "Facility locations are held separately by NRMCA. The EPD lists participants only by state (NY participants include Empire Transit Mix, Best Concrete Mix Corp., TEC Crete, Dakota Concrete, Upstone Materials), with no coordinates."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material supply",
"summary": "Cement, slag cement, aggregates, admixtures and water are extracted and made. Portland/PLC cement from ACA industry-average EPDs (2023) dominates A1. This mix is 100% portland/portland-limestone cement as binder.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Materials are trucked, railed or barged to the plants over production-weighted average distances from facility surveys. Truck impacts get a 2/1.35 backhaul factor.",
"locations": []
},
{
"module": "A3",
"name": "Batching and mixing",
"summary": "The plant weighs and mixes the ingredients using electricity and fuels, plus 30% of mixer-truck fleet energy. It is the same 10.91 kg CO2e/m3 for every mix.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Portland / portland-limestone cement",
"share": 0.1372,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 543.6,
"origin": null
},
{
"name": "Batch water",
"share": 0.0707,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 280.05719999999997,
"origin": null
},
{
"name": "Coarse aggregate",
"share": 0.4233,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1676.7,
"origin": null
},
{
"name": "Fine aggregate",
"share": 0.3688,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1460.7,
"origin": null
},
{
"name": "Water reducer admixture",
"share": null,
"source": "EPD/LCA report: 16.31 fl oz/yd3 (negligible mass)",
"origin": null
}
],
"basis": "kg"
},
{
"title": "NRMCA V4 mix 5000-00-FA/SL (5,000 psi, normal-weight, non-air-entrained, 0% SCM), alternative",
"manufacturer": "National Ready Mixed Concrete Association (NRMCA), industry average of 1,238 US member facilities",
"programOperator": "EPD International AB (International EPD System), licensee EPD North America",
"regNo": "EPD-IES-0034276",
"issued": "2026-10-09",
"validUntil": "2031-10-09",
"standard": "ISO 14025, ISO 21930:2017, PCR NSF 1112-26 Concrete v3.0 (not EN 15804 compliant)",
"indicator": "GWPT (GWP-total, IPCC AR5 100-yr)",
"declaredUnit": "1 m3",
"plant": {
"name": "US national industry average (1,238 facilities; no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.nrmca.org/epd/",
"pdfUrl": "https://www.nrmca.org/wp-content/uploads/NRMCA_EPD_V4_20261010.pdf",
"verified": true,
"kgPerUnit": 2327,
"kgPerUnitSource": "EPD p.7: fresh density 2,327 kg/m3",
"modules": {
"A1": 372.61,
"A2": 27.16,
"A3": 10.91,
"A1A3": 410.67,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "Not declared (MND). EPD scope is cradle-to-gate A1-A3 only.",
"D": "Not declared (MND).",
"A4": "Not declared. NSF 1112-26 allows A4 reporting but it is not in the V4 baseline results; 70% of truck-mixer fleet energy is reserved for A4, 30% is allocated to A3.",
"regional": "EPD says regional benchmarks for 18 study groups exist in the V4 LCA report (not the EPD). The Eastern region (227 facilities) A1-A3 GWPT for NW non-air-entrained 4000 psi is 256.82 kg CO2e/m3 (LCA report Table 45). It is not an EPD value, so it is excluded from the declared data.",
"processesNote": "Facility locations are held separately by NRMCA. The EPD lists participants only by state (NY participants include Empire Transit Mix, Best Concrete Mix Corp., TEC Crete, Dakota Concrete, Upstone Materials), with no coordinates."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material supply",
"summary": "Cement, slag cement, aggregates, admixtures and water are extracted and made. Portland/PLC cement from ACA industry-average EPDs (2023) dominates A1. This mix is 100% portland/PLC binder with an HRWR admixture.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Materials are trucked, railed or barged to the plants over production-weighted average distances from facility surveys. Truck impacts get a 2/1.35 backhaul factor.",
"locations": []
},
{
"module": "A3",
"name": "Batching and mixing",
"summary": "The plant weighs and mixes the ingredients using electricity and fuels, plus 30% of mixer-truck fleet energy. It is the same 10.91 kg CO2e/m3 for every mix.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Portland / portland-limestone cement",
"share": 0.1752,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 687.4,
"origin": null
},
{
"name": "Batch water",
"share": 0.0745,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 292.31699999999995,
"origin": null
},
{
"name": "Coarse aggregate",
"share": 0.3923,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1539.0,
"origin": null
},
{
"name": "Fine aggregate",
"share": 0.3579,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1404.1,
"origin": null
}
],
"basis": "kg"
}
],
"concrete-lowcarbon": [
{
"title": "NRMCA V4 mix 4000-50-SL (4,000 psi, normal-weight, non-air-entrained, 50% slag cement)",
"manufacturer": "National Ready Mixed Concrete Association (NRMCA), industry average of 1,238 US member facilities",
"programOperator": "EPD International AB (International EPD System), licensee EPD North America",
"regNo": "EPD-IES-0034276",
"issued": "2026-10-09",
"validUntil": "2031-10-09",
"standard": "ISO 14025, ISO 21930:2017, PCR NSF 1112-26 Concrete v3.0 (not EN 15804 compliant)",
"indicator": "GWPT (GWP-total, IPCC AR5 100-yr)",
"declaredUnit": "1 m3",
"plant": {
"name": "US national industry average (1,238 facilities; no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.nrmca.org/epd/",
"pdfUrl": "https://www.nrmca.org/wp-content/uploads/NRMCA_EPD_V4_20261010.pdf",
"verified": true,
"kgPerUnit": 2339,
"kgPerUnitSource": "EPD p.7: fresh density 2,339 kg/m3",
"modules": {
"A1": 175.86,
"A2": 29.35,
"A3": 10.91,
"A1A3": 216.12,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "Not declared (MND). EPD scope is cradle-to-gate A1-A3 only.",
"D": "Not declared (MND).",
"A4": "Not declared. NSF 1112-26 allows A4 reporting but it is not in the V4 baseline results; 70% of truck-mixer fleet energy is reserved for A4, 30% is allocated to A3.",
"regional": "EPD says regional benchmarks for 18 study groups exist in the V4 LCA report (not the EPD). The Eastern region (227 facilities) A1-A3 GWPT for NW non-air-entrained 4000 psi is 256.82 kg CO2e/m3 (LCA report Table 45). It is not an EPD value, so it is excluded from the declared data.",
"processesNote": "Facility locations are held separately by NRMCA. The EPD lists participants only by state (NY participants include Empire Transit Mix, Best Concrete Mix Corp., TEC Crete, Dakota Concrete, Upstone Materials), with no coordinates."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material supply",
"summary": "Cement, slag cement, aggregates, admixtures and water are extracted and made. Portland/PLC cement from ACA industry-average EPDs (2023) dominates A1. Half the binder is slag cement (Slag Cement Association EPD 2021), which roughly halves cement GWP.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Materials are trucked, railed or barged to the plants over production-weighted average distances from facility surveys. Truck impacts get a 2/1.35 backhaul factor.",
"locations": []
},
{
"module": "A3",
"name": "Batching and mixing",
"summary": "The plant weighs and mixes the ingredients using electricity and fuels, plus 30% of mixer-truck fleet energy. It is the same 10.91 kg CO2e/m3 for every mix.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Portland / portland-limestone cement",
"share": 0.069,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 271.8,
"origin": null
},
{
"name": "Slag cement (GGBFS)",
"share": 0.069,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 271.8,
"origin": null
},
{
"name": "Batch water",
"share": 0.071,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 280.05719999999997,
"origin": null
},
{
"name": "Coarse aggregate",
"share": 0.4254,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1676.7,
"origin": null
},
{
"name": "Fine aggregate",
"share": 0.3657,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1441.4,
"origin": null
}
],
"basis": "kg"
},
{
"title": "NRMCA V4 mix 5000-50-SL (5,000 psi, NW, NAE, 50% slag cement), alternative",
"manufacturer": "National Ready Mixed Concrete Association (NRMCA), industry average of 1,238 US member facilities",
"programOperator": "EPD International AB (International EPD System), licensee EPD North America",
"regNo": "EPD-IES-0034276",
"issued": "2026-10-09",
"validUntil": "2031-10-09",
"standard": "ISO 14025, ISO 21930:2017, PCR NSF 1112-26 Concrete v3.0 (not EN 15804 compliant)",
"indicator": "GWPT (GWP-total, IPCC AR5 100-yr)",
"declaredUnit": "1 m3",
"plant": {
"name": "US national industry average (1,238 facilities; no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.nrmca.org/epd/",
"pdfUrl": "https://www.nrmca.org/wp-content/uploads/NRMCA_EPD_V4_20261010.pdf",
"verified": true,
"kgPerUnit": 2313,
"kgPerUnitSource": "EPD p.7: fresh density 2,313 kg/m3",
"modules": {
"A1": 222.82,
"A2": 32.73,
"A3": 10.91,
"A1A3": 266.45,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "Not declared (MND). EPD scope is cradle-to-gate A1-A3 only.",
"D": "Not declared (MND).",
"A4": "Not declared. NSF 1112-26 allows A4 reporting but it is not in the V4 baseline results; 70% of truck-mixer fleet energy is reserved for A4, 30% is allocated to A3.",
"regional": "EPD says regional benchmarks for 18 study groups exist in the V4 LCA report (not the EPD). The Eastern region (227 facilities) A1-A3 GWPT for NW non-air-entrained 4000 psi is 256.82 kg CO2e/m3 (LCA report Table 45). It is not an EPD value, so it is excluded from the declared data.",
"processesNote": "Facility locations are held separately by NRMCA. The EPD lists participants only by state (NY participants include Empire Transit Mix, Best Concrete Mix Corp., TEC Crete, Dakota Concrete, Upstone Materials), with no coordinates."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material supply",
"summary": "Cement, slag cement, aggregates, admixtures and water are extracted and made. Portland/PLC cement from ACA industry-average EPDs (2023) dominates A1. Half the binder is slag cement.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Materials are trucked, railed or barged to the plants over production-weighted average distances from facility surveys. Truck impacts get a 2/1.35 backhaul factor.",
"locations": []
},
{
"module": "A3",
"name": "Batching and mixing",
"summary": "The plant weighs and mixes the ingredients using electricity and fuels, plus 30% of mixer-truck fleet energy. It is the same 10.91 kg CO2e/m3 for every mix.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Portland / portland-limestone cement",
"share": 0.0882,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 343.7,
"origin": null
},
{
"name": "Slag cement (GGBFS)",
"share": 0.0882,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 343.7,
"origin": null
},
{
"name": "Batch water",
"share": 0.075,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 292.31699999999995,
"origin": null
},
{
"name": "Coarse aggregate",
"share": 0.3948,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1539.0,
"origin": null
},
{
"name": "Fine aggregate",
"share": 0.3539,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1379.7,
"origin": null
}
],
"basis": "kg"
}
],
"concrete-light": [
{
"title": "NRMCA V4 mix LW-4000-00-FA/SL-AE (4,000 psi structural lightweight, air-entrained, 0% SCM)",
"manufacturer": "National Ready Mixed Concrete Association (NRMCA), industry average of 1,238 US member facilities",
"programOperator": "EPD International AB (International EPD System), licensee EPD North America",
"regNo": "EPD-IES-0034276",
"issued": "2026-10-09",
"validUntil": "2031-10-09",
"standard": "ISO 14025, ISO 21930:2017, PCR NSF 1112-26 Concrete v3.0 (not EN 15804 compliant)",
"indicator": "GWPT (GWP-total, IPCC AR5 100-yr)",
"declaredUnit": "1 m3",
"plant": {
"name": "US national industry average (1,238 facilities; no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.nrmca.org/epd/",
"pdfUrl": "https://www.nrmca.org/wp-content/uploads/NRMCA_EPD_V4_20261010.pdf",
"verified": true,
"kgPerUnit": 1889,
"kgPerUnitSource": "EPD p.8: fresh density 1,889 kg/m3",
"modules": {
"A1": 567.09,
"A2": 23.81,
"A3": 10.91,
"A1A3": 601.81,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "Not declared (MND). EPD scope is cradle-to-gate A1-A3 only.",
"D": "Not declared (MND).",
"A4": "Not declared. NSF 1112-26 allows A4 reporting but it is not in the V4 baseline results; 70% of truck-mixer fleet energy is reserved for A4, 30% is allocated to A3.",
"regional": "EPD says regional benchmarks for 18 study groups exist in the V4 LCA report (not the EPD). The Eastern region (227 facilities) A1-A3 GWPT for NW non-air-entrained 4000 psi is 256.82 kg CO2e/m3 (LCA report Table 45). It is not an EPD value, so it is excluded from the declared data.",
"processesNote": "Facility locations are held separately by NRMCA. The EPD lists participants only by state (NY participants include Empire Transit Mix, Best Concrete Mix Corp., TEC Crete, Dakota Concrete, Upstone Materials), with no coordinates.",
"caveat": "The EPD says manufactured lightweight aggregate is modeled with ecoinvent 3.10 expanded clay as a conservative proxy (up to 220 kg CO2e/m3 of A1). Real expanded shale/slate LWA in the US may be lower."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material supply",
"summary": "Cement, slag cement, aggregates, admixtures and water are extracted and made. Portland/PLC cement from ACA industry-average EPDs (2023) dominates A1. Manufactured lightweight coarse aggregate (kiln-expanded clay proxy) is the second-largest A1 contributor after cement.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Materials are trucked, railed or barged to the plants over production-weighted average distances from facility surveys. Truck impacts get a 2/1.35 backhaul factor.",
"locations": []
},
{
"module": "A3",
"name": "Batching and mixing",
"summary": "The plant weighs and mixes the ingredients using electricity and fuels, plus 30% of mixer-truck fleet energy. It is the same 10.91 kg CO2e/m3 for every mix.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Portland / portland-limestone cement",
"share": 0.2144,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 682.7,
"origin": null
},
{
"name": "Batch water",
"share": 0.091,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 289.5648,
"origin": null
},
{
"name": "Lightweight coarse aggregate",
"share": 0.2961,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 942.8,
"origin": null
},
{
"name": "Fine aggregate",
"share": 0.3985,
"source": "EPD (mix proportions from NRMCA V4 LCA report Table 29/33, the EPD's referenced explanatory material; lb/yd3 converted, water 8.34 lb/gal)",
"massPerYd3_lb": 1268.7,
"origin": null
}
],
"basis": "kg"
},
{
"title": "NRMCA V4 mix LW-4000-50-SL-AE (4,000 psi lightweight, 50% slag), alternative",
"manufacturer": "National Ready Mixed Concrete Association (NRMCA), industry average of 1,238 US member facilities",
"programOperator": "EPD International AB (International EPD System), licensee EPD North America",
"regNo": "EPD-IES-0034276",
"issued": "2026-10-09",
"validUntil": "2031-10-09",
"standard": "ISO 14025, ISO 21930:2017, PCR NSF 1112-26 Concrete v3.0 (not EN 15804 compliant)",
"indicator": "GWPT (GWP-total, IPCC AR5 100-yr)",
"declaredUnit": "1 m3",
"plant": {
"name": "US national industry average (1,238 facilities; no single plant)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.nrmca.org/epd/",
"pdfUrl": "https://www.nrmca.org/wp-content/uploads/NRMCA_EPD_V4_20261010.pdf",
"verified": true,
"kgPerUnit": 1889,
"kgPerUnitSource": "EPD p.8: fresh density 1,889 kg/m3",
"modules": {
"A1": 410.1,
"A2": 29.45,
"A3": 10.91,
"A1A3": 450.46,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "Not declared (MND). EPD scope is cradle-to-gate A1-A3 only.",
"D": "Not declared (MND).",
"A4": "Not declared. NSF 1112-26 allows A4 reporting but it is not in the V4 baseline results; 70% of truck-mixer fleet energy is reserved for A4, 30% is allocated to A3.",
"regional": "EPD says regional benchmarks for 18 study groups exist in the V4 LCA report (not the EPD). The Eastern region (227 facilities) A1-A3 GWPT for NW non-air-entrained 4000 psi is 256.82 kg CO2e/m3 (LCA report Table 45). It is not an EPD value, so it is excluded from the declared data.",
"processesNote": "Facility locations are held separately by NRMCA. The EPD lists participants only by state (NY participants include Empire Transit Mix, Best Concrete Mix Corp., TEC Crete, Dakota Concrete, Upstone Materials), with no coordinates."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material supply",
"summary": "Cement, slag cement, aggregates, admixtures and water are extracted and made. Portland/PLC cement from ACA industry-average EPDs (2023) dominates A1. Half the binder is slag cement; LWA is modeled with an expanded clay proxy.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Materials are trucked, railed or barged to the plants over production-weighted average distances from facility surveys. Truck impacts get a 2/1.35 backhaul factor.",
"locations": []
},
{
"module": "A3",
"name": "Batching and mixing",
"summary": "The plant weighs and mixes the ingredients using electricity and fuels, plus 30% of mixer-truck fleet energy. It is the same 10.91 kg CO2e/m3 for every mix.",
"locations": []
}
],
"rawMaterials": [],
"basis": "kg"
}
],
"precast": [
{
"title": "Architectural Precast Concrete Regionalized Industry Average EPD, Table 8: PCI Mid Atlantic (PCIMA) & PCI Northeast (PCINE)",
"regNo": "EPD 962",
"manufacturer": "Precast/Prestressed Concrete Institute (PCI), regionalized industry average of 64 US member facilities",
"programOperator": "ASTM International",
"issued": "2025-05-01",
"validUntil": "2030-05-01",
"standard": "ISO 14025:2006, ISO 21930:2017, NSF/ASTM PCR for Precast Concrete v3.0 (May 2021)",
"indicator": "GWP 100 (TRACI 2.1)",
"declaredUnit": "1 metric tonne",
"kgPerUnit": 1000,
"kgPerUnitSource": "Declared unit is 1,000 kg",
"verified": true,
"plant": {
"name": "PCIMA/PCINE regional average (NY, NJ, PA, DE, VA, CT, VT plants)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.pci.org/PCI/Design_Resources/Sustainability_Resources/Environmental_Product_Declarations.aspx",
"pdfUrl": "https://www.astm.org/v3/assets/blt5eb0a2cb04534832/blt3eff258c5265fdd7/685ae9fa27eb112c93fc106e/PCI_Architectural_EPD_20250501.pdf",
"modules": {
"A1": 190,
"A2": 18.6,
"A3": 50.4,
"A1A3": 259,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "MND, cradle-to-gate only.",
"D": "MND.",
"A4": "MND.",
"printed": "Printed in scientific notation: A1-A3 2.59E+02, A1 1.90E+02, A2 1.86E+01, A3 5.04E+01. Regional min/max A1-A3 is 220-298 (Tables 10-11).",
"download": "ASTM blocks plain curl; a browser user-agent works. PCI site was down for maintenance until Nov 9."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material supply",
"summary": "Cement (PCA EPD 2021), slag, aggregates, admixtures and steel reinforcement (CRSI rebar EPD, AISI plate) are produced.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Materials go to the precast plant by truck, rail, barge or ship (USLCI), including empty backhauls.",
"locations": []
},
{
"module": "A3",
"name": "Precast manufacturing",
"summary": "Concrete is cast into reusable forms, cured in controlled conditions and finished (acid etch, sandblast, stain). Plant energy and waste disposal are included.",
"locations": [
{
"name": "Fabcon-listed plant, Selkirk, NY (approx.)",
"lat": 42.55,
"lon": -73.8,
"role": "plant"
},
{
"name": "Mahanoy City, PA plant (approx.)",
"lat": 40.81,
"lon": -76.14,
"role": "plant"
},
{
"name": "High Concrete Group, Denver, PA (approx.)",
"lat": 40.23,
"lon": -76.14,
"role": "plant"
},
{
"name": "Tindall Corporation, Petersburg, VA (approx.)",
"lat": 37.23,
"lon": -77.4,
"role": "plant"
},
{
"name": "United Concrete Products, Connecticut (state-level approx.)",
"lat": 41.49,
"lon": -72.82,
"role": "plant"
},
{
"name": "J.P. Carrara & Sons, Vermont (state-level approx.)",
"lat": 44.01,
"lon": -73.17,
"role": "plant"
}
]
}
],
"rawMaterials": [
{
"name": "Aggregates",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Portland cement",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Portland limestone cement",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Batch water",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Fly ash",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Rebar",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Welded wire reinforcement",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Steel",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
},
{
"name": "Other admixtures/SCMs",
"share": null,
"source": "EPD lists constituents by descending mass only, no percentages",
"origin": null
}
],
"basis": "kg"
},
{
"title": "Structural Precast Concrete Regionalized Industry Average EPD, Table 8: PCIMA & PCINE (alternative)",
"regNo": "EPD 964",
"manufacturer": "Precast/Prestressed Concrete Institute (PCI), regionalized industry average of 64 US member facilities",
"programOperator": "ASTM International",
"issued": "2025-05-01",
"validUntil": "2030-05-01",
"standard": "ISO 14025:2006, ISO 21930:2017, NSF/ASTM PCR for Precast Concrete v3.0 (May 2021)",
"indicator": "GWP 100 (TRACI 2.1)",
"declaredUnit": "1 metric tonne",
"kgPerUnit": 1000,
"kgPerUnitSource": "Declared unit is 1,000 kg",
"verified": true,
"plant": {
"name": "PCIMA/PCINE regional average",
"lat": null,
"lon": null
},
"landingUrl": "https://www.pci.org/PCI/Design_Resources/Sustainability_Resources/Environmental_Product_Declarations.aspx",
"pdfUrl": "https://www.astm.org/v3/assets/blt5eb0a2cb04534832/bltcf7db87af7965593/685ae9eae911ca7a0022901f/PCI_Structural_EPD_20250501.pdf",
"modules": {
"A1": 188,
"A2": 22.1,
"A3": 30.7,
"A1A3": 240,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"moduleNotes": {
"C": "MND.",
"D": "MND.",
"A4": "MND.",
"printed": "2.40E+02 / 1.88E+02 / 2.21E+01 / 3.07E+01"
},
"dParts": [],
"processes": [],
"rawMaterials": [],
"basis": "kg"
}
],
"brick": [
{
"title": "Clay Masonry Products Industry Average EPD (BIA 2025): Clay Brick / Structural Clay Tile baseline (modular)",
"manufacturer": "Brick Industry Association (BIA), 29 facilities, 39.3% of 2023 US brick production",
"programOperator": "NSF International",
"regNo": "EPD11101",
"issued": "2025-11-07",
"validUntil": "2030-11-07",
"validNote": "EPD states Date of issue 11/7/2025 and Period of validity 5 years, so the end date is computed",
"standard": "ISO 14025, 14040, 14044, ISO 21930:2017; NSF/ASTM Clay Masonry Products PCR",
"indicator": "GWP 100 (TRACI 2.2)",
"declaredUnit": "1 m2 vertically installed clay brick (functional unit, 75-yr building life)",
"kgPerUnit": 112.18,
"kgPerUnitSource": "EPD functional-unit table: mass of brick product in FU 112.18 kg per m2 (modular brick, 3/8in mortar joints). Conversion to 1 kg = 0.0089. End-of-life mass 144.95 kg includes mortar.",
"plant": {
"name": "US industry average (29 facilities)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.businesswire.com/news/home/20251201966232/en/BIA-Releases-New-Industry-Average-EPD-for-Clay-Masonry-Products",
"pdfUrl": "https://info.nsf.org/Certified/Sustain/ProdCert/EPD11101.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 31.8,
"A4": 4.24,
"A5": 2.08,
"B1": 0,
"B2": 0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 0,
"B7": 0,
"C1": 0,
"C2": 1.36,
"C3": 0,
"C4": 2.1,
"D": -0.0609
},
"moduleNotes": {
"A5": "A5 is printed in two columns: 'Brick Impacts' 2.08 (recorded here) and 'Mortar Impacts' 8.25 kg CO2e (mortar, 27.31 kg/m2). A5 total if both are counted: 10.33.",
"A5mortar": 8.25,
"B": "B2 printed 0.00E+00. Footnote: B1, B3-B7, C1 and C3 are included and are zero in all categories. RSL 150 yr, ESL 75 yr, 0 replacements.",
"C": "Collected separately; 12% (17.39 kg) reused as aggregate, 88% (127.56 kg) landfilled. Demolition impacts de minimis.",
"D": "Benefit from 17.39 kg of crushed brick displacing virgin gravel 1:1 by mass.",
"A4": "Combination truck, diesel, 407 km, 49.9% capacity utilization.",
"printed": "A1-A3 3.18E+01, A4 4.24E+00, A5 2.08E+00 / 8.25E+00, B2 0.00E+00, C2 1.36E+00, C4 2.10E+00, D -6.09E-02. A1-A3 is not split.",
"scaling": "Other unit sizes use brick conversion factors (e.g. Ambassador 1.314); mortar uses its own factor."
},
"dParts": [
{
"type": "recycling",
"note": "12% of collected brick crushed and used as aggregate, displacing gravel kg-for-kg (-0.0609 kg CO2e per m2)"
}
],
"processes": [
{
"module": "A1",
"name": "Clay and shale mining",
"summary": "Clay and shale are mined, often at or near the plant, then stored and prepared.",
"locations": []
},
{
"module": "A2",
"name": "Raw material transport",
"summary": "Off-site clay, sand, pigments and additives are trucked to the plant.",
"locations": []
},
{
"module": "A3",
"name": "Forming, drying and firing",
"summary": "Units are extruded or formed, dried, fired in kilns (the main energy use), cooled, then dehacked and packaged on pallets.",
"locations": [
{
"name": "Glen-Gery Corporation, Wyomissing, PA (company address in EPD; approx.)",
"lat": 40.33,
"lon": -75.97,
"role": "plant"
},
{
"name": "McAvoy Brick Co., Phoenixville, PA (approx.)",
"lat": 40.13,
"lon": -75.51,
"role": "plant"
},
{
"name": "Stiles and Hart Brick Co., Bridgewater, MA (approx.)",
"lat": 41.99,
"lon": -70.97,
"role": "plant"
},
{
"name": "Morin Brick Company, Auburn, ME (approx.)",
"lat": 44.1,
"lon": -70.23,
"role": "plant"
}
]
},
{
"module": "C2",
"name": "Waste transport",
"summary": "Demolished brick is trucked to recycling or landfill.",
"locations": []
},
{
"module": "C4",
"name": "Landfill",
"summary": "88% of brick is landfilled as inert waste.",
"locations": []
},
{
"module": "D",
"name": "Aggregate substitution",
"summary": "Crushed brick replaces virgin gravel.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Mined clay and shale",
"share": 0.9852,
"source": "EPD",
"origin": null
},
{
"name": "Primary pigments",
"share": 0.0056,
"source": "EPD",
"origin": null
},
{
"name": "Sand",
"share": 0.0046,
"source": "EPD",
"origin": null
},
{
"name": "External grog",
"share": 0.0023,
"source": "EPD",
"origin": null
},
{
"name": "Body additives",
"share": 0.0023,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"granite": [
{
"title": "Polycor Granite Facades, Cladding & Walls, SM Transparency Report (EPD)",
"manufacturer": "Polycor Inc. (Quebec City, Canada)",
"programOperator": "Sustainable Minds (SM Transparency Report [EPD] program); verified by Jack Geibig, Ecoform",
"regNo": "POL-20230131-006",
"issued": "2023-01-31",
"validUntil": "2028-01-30",
"standard": "ISO 14025:2006, ISO 21930:2017, UL Part A v3.2, ULE PCR Part B: Cladding Product Systems v2.0 (2021)",
"indicator": "GWP 100 (TRACI 2.1, 'Global warming (Embodied Carbon)')",
"declaredUnit": "1 m2 installed stone cladding, 42.11 mm thick, 75-yr service life (functional unit)",
"kgPerUnit": 89.77,
"kgPerUnitSource": "EPD: Natural stone 89.77 kg per m2 (density 2654 kg/m3 x 42.11 mm). The functional unit also includes 4.88 kg mortar and 0.62 kg masonry connectors in A5.",
"plant": {
"name": "Mount Airy Plant, Mount Airy, NC (approx.)",
"lat": 36.5,
"lon": -80.61
},
"landingUrl": "https://www.polycor.com/",
"pdfUrl": "https://www.polycor.com/wp-content/uploads/2023/03/EPD_Granite-Facades-Cladding-Walls.pdf",
"verified": true,
"modules": {
"A1": 8.55,
"A2": 1.71,
"A3": 20.9,
"A1A3": null,
"A4": 3.45,
"A5": 4.49,
"B1": 0,
"B2": 0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 0,
"B7": 0,
"C1": 0,
"C2": 1.43,
"C3": 0,
"C4": 0.0807,
"D": "MND"
},
"moduleNotes": {
"B": "Printed as one 'B1-B7' column = 0. EPD: B1-B7, C1 and C3 are included but have no associated activities (C1, C3 have no column).",
"C": "Dismantled manually and trucked 100 km; 31.5% landfilled, 68.5% recycled (no further processing).",
"D": "Module D is excluded (MND).",
"A4": "Lorry 16-32 t, diesel. The A5 value includes cement mortar (calcination at 886 kg CO2/t cement) and 5% installation scrap.",
"scaling": "Results can be scaled by thickness using the EPD's conversion factors (1in, 2in, 3-5/8in).",
"A1A3": "Not printed as an aggregate; A1, A2 and A3 are printed separately.",
"printed": "A1 8.55E+00, A2 1.71E+00, A3 2.09E+01, A4 3.45E+00, A5 4.49E+00, B1-B7 0, C2 1.43E+00, C4 8.07E-02, Total 4.06E+01",
"coverage": "This is a manufacturer EPD covering 13 quarries, including Laurentian Rose (pink). The NSI industry-wide cladding EPD (Sustainable Minds, 2022) exists but its PDF could not be retrieved (Transparency Catalog returns 403)."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Quarry operations",
"summary": "Blocks are extracted from Polycor quarries using grid electricity and fuels, with rainwater used and recycled. Data covers Jan 2020 to Dec 2021.",
"locations": [
{
"name": "Laurentian Rose Quarry, Quebec (pink granite; exact site not given, no coords)",
"lat": null,
"lon": null,
"role": "quarry"
},
{
"name": "Barre Gray Quarry, Graniteville, VT (approx.)",
"lat": 44.14,
"lon": -72.48,
"role": "quarry"
},
{
"name": "Bethel White Quarry, Bethel, VT (approx.)",
"lat": 43.83,
"lon": -72.63,
"role": "quarry"
},
{
"name": "Concord Gray Quarry, Concord, NH (approx.)",
"lat": 43.21,
"lon": -71.54,
"role": "quarry"
},
{
"name": "Mount Airy Quarry, Mount Airy, NC (approx.)",
"lat": 36.5,
"lon": -80.61,
"role": "quarry"
},
{
"name": "American Black Quarry, Elverson, PA (approx.)",
"lat": 40.16,
"lon": -75.83,
"role": "quarry"
},
{
"name": "Stanstead ROA Quarry, Quebec (approx.)",
"lat": 45.02,
"lon": -72.1,
"role": "quarry"
}
]
},
{
"module": "A2",
"name": "Block transport to processors",
"summary": "Blocks are trucked to processing plants, weighted distance 83 km (100 km assumed where data is missing).",
"locations": []
},
{
"module": "A3",
"name": "Processing (sawing, cutting, finishing)",
"summary": "Blocks are sawn into slabs and cut and finished into cladding panels. Plant electricity and fuel dominate impacts.",
"locations": [
{
"name": "Mount Airy Plant, Mount Airy, NC (approx.)",
"lat": 36.5,
"lon": -80.61,
"role": "plant"
},
{
"name": "Concord Plant, Concord, NH (approx.)",
"lat": 43.21,
"lon": -71.54,
"role": "plant"
},
{
"name": "Jay White Plant, Jay, ME (approx.)",
"lat": 44.5,
"lon": -70.22,
"role": "plant"
},
{
"name": "Rivière-à-Pierre Plant, Quebec (approx.)",
"lat": 46.98,
"lon": -72.18,
"role": "plant"
},
{
"name": "Saint-Sébastien slab and tile plants, Quebec (approx.)",
"lat": 45.77,
"lon": -70.96,
"role": "plant"
}
]
},
{
"module": "A4",
"name": "Transport to site",
"summary": "Finished cladding is trucked to the building site.",
"locations": []
},
{
"module": "A5",
"name": "Installation",
"summary": "Panels are set with cement mortar and masonry anchors; 5% scrap.",
"locations": []
},
{
"module": "C2",
"name": "Waste transport",
"summary": "Removed stone is trucked 100 km.",
"locations": []
},
{
"module": "C4",
"name": "Disposal",
"summary": "31.5% of the stone is landfilled.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Granite (13 quarries, US and Quebec)",
"share": 0.9423,
"massKg": 89.77,
"source": "EPD",
"origin": {
"name": "Laurentian Rose Quarry, Quebec (pink granite; exact site not given, no coords)",
"lat": null,
"lon": null
}
},
{
"name": "Cement mortar (A5)",
"share": 0.0512,
"massKg": 4.88,
"source": "EPD",
"origin": null
},
{
"name": "Masonry connectors (A5)",
"share": 0.0065,
"massKg": 0.62,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"travertine": [
{
"title": "Natural dimensional limestone (travertine) cut to size slabs from Reneszánsz Kőfaragó Zrt.",
"manufacturer": "Reneszánsz Zrt (Reneszánsz Kőfaragó Zrt.), Süttő, Hungary",
"programOperator": "EPD International AB (International EPD System)",
"regNo": "EPD-IES-0027188:001",
"issued": "2026-02-04",
"validUntil": "2031-02-04",
"standard": "ISO 14025:2006, EN 15804:2012+A2:2019/AC:2021 (PCR 2019:14)",
"indicator": "GWP-total (EF 3.1)",
"declaredUnit": "1 m2 (30 mm slab)",
"kgPerUnit": 75,
"kgPerUnitSource": "EPD: area density 75 kg/m2, thickness 0.03 m, 2,500 kg/m3; conversion factor to mass 75",
"plant": {
"name": "Reneszánsz Kőfaragó Zrt., Kőfaragó tér 8, 2543 Süttő, Hungary (approx.)",
"lat": 47.75,
"lon": 18.45
},
"landingUrl": "https://www.environdec.com/library/epd27188",
"pdfUrl": "https://api.prod.environdec.com/api/v1/EPDLibrary/Files/EPDs/138fd5de-e10f-4dfb-a3b6-08de2db5be12/Documents",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 7.74,
"A4": "ND",
"A5": "ND",
"B1": "ND",
"B2": "ND",
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": "ND",
"B7": "ND",
"C1": 0.00982,
"C2": 1.14,
"C3": 0.00777,
"C4": 0.00377,
"D": 0.0
},
"moduleNotes": {
"C": "Default scenario, 100% landfill: PCR default diesel for deconstruction, 80 km road transport, inert landfill (1.6 kWh diesel compaction). Alternative scenario '100% reuse' gives C3 3.53E-03, C4 0, D -7.74E+00.",
"D": "Default 0% reuse, so D = 0.00E+0 (no benefits). The reuse scenario credits D -7.74 kg CO2e/m2.",
"A4": "ND (not declared). Scope is A1-A3 + C + D.",
"printed": "A1-A3 7.74E+0; C1 9.82E-3; C2 1.14E+0; C3 7.77E-3; C4 3.77E-3; D 0.00E+0. GWP-fossil A1-A3 7.74, GWP-GHG 7.73.",
"relevance": "Hungarian (Süttő) travertine, used as a stand-in for Roman travertine; no Italian travertine stone EPD was found (environdec 'Travertine' EPD-IES-0016374 is a Cromology paint finish)."
},
"dParts": [
{
"type": "reuse",
"note": "Default scenario has no credit (0% reuse). An additional 100% reuse scenario credits -7.74 kg CO2e/m2."
}
],
"processes": [
{
"module": "A1",
"name": "Quarrying",
"summary": "Blocks of about 220x110x100 cm are cut at the Süttő-Haraszthegy (Haraszt and Gazdabánya) quarry with water-cooled diamond wire saws.",
"locations": [
{
"name": "Süttői-Haraszthegy quarry (Haraszt, Gazdabánya), near Süttő, HU (approx.)",
"lat": 47.74,
"lon": 18.44,
"role": "quarry"
}
]
},
{
"module": "A2",
"name": "Block transport",
"summary": "Blocks are trucked from quarry to processing plant.",
"locations": []
},
{
"module": "A3",
"name": "Sawing and finishing",
"summary": "Blocks are sawn into 2-8 cm panels with gang or circular saws, trimmed to size and optionally honed, polished or sealed. Water is recirculated and off-cuts are crushed for aggregate or backfill.",
"locations": [
{
"name": "Reneszánsz plant, Süttő (approx.)",
"lat": 47.75,
"lon": 18.45,
"role": "plant"
}
]
},
{
"module": "C1",
"name": "Deconstruction",
"summary": "Diesel machinery removes the stone (PCR default 5 kWh/t).",
"locations": []
},
{
"module": "C2",
"name": "Transport",
"summary": "80 km road transport to landfill.",
"locations": []
},
{
"module": "C4",
"name": "Inert landfill",
"summary": "Compaction in an inert waste landfill.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Hard terrestrial limestone (travertine)",
"share": 1.0,
"massKg": 75,
"source": "EPD",
"origin": {
"name": "Süttő, Hungary",
"lat": 47.74,
"lon": 18.44
}
}
],
"basis": "kg"
},
{
"title": "Polycor Limestone Facades, Cladding & Walls, SM Transparency Report (EPD) (alternative: Indiana limestone)",
"manufacturer": "Polycor Inc. (Quebec City, Canada)",
"programOperator": "Sustainable Minds (SM Transparency Report [EPD] program); verified by Jack Geibig, Ecoform",
"regNo": "POL-20230131-007",
"issued": "2023-01-31",
"validUntil": "2028-01-30",
"standard": "ISO 14025:2006, ISO 21930:2017, UL Part A v3.2, ULE PCR Part B: Cladding Product Systems v2.0 (2021)",
"indicator": "GWP 100 (TRACI 2.1, 'Global warming (Embodied Carbon)')",
"declaredUnit": "1 m2 installed stone cladding, 56.77 mm thick, 75-yr service life (functional unit)",
"kgPerUnit": 81.35,
"kgPerUnitSource": "EPD: Natural stone 81.35 kg per m2 (density 2307 kg/m3 x 56.77 mm). The functional unit also includes 4.88 kg mortar and 0.62 kg masonry connectors in A5.",
"plant": {
"name": "Empire Plant, Oolitic, IN (approx.)",
"lat": 38.9,
"lon": -86.52
},
"landingUrl": "https://www.polycor.com/",
"pdfUrl": "https://www.polycor.com/wp-content/uploads/2023/03/EPD_Limestone-Facades-Cladding-Walls.pdf",
"verified": true,
"modules": {
"A1": 5.24,
"A2": 0.681,
"A3": 7.86,
"A1A3": null,
"A4": 1.93,
"A5": 4.49,
"B1": 0,
"B2": 0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 0,
"B7": 0,
"C1": 0,
"C2": 1.19,
"C3": 0,
"C4": 0.0672,
"D": "MND"
},
"moduleNotes": {
"B": "Printed as one 'B1-B7' column = 0. EPD: B1-B7, C1 and C3 are included but have no associated activities (C1, C3 have no column).",
"C": "Dismantled manually and trucked 100 km; 31.5% landfilled, 68.5% recycled (no further processing).",
"D": "Module D is excluded (MND).",
"A4": "Lorry 16-32 t, diesel. The A5 value includes cement mortar (calcination at 886 kg CO2/t cement) and 5% installation scrap.",
"scaling": "Results can be scaled by thickness using the EPD's conversion factors (1in, 2in, 3-5/8in).",
"A1A3": "Not printed as an aggregate; A1, A2 and A3 are printed separately.",
"printed": "A1 5.24E+00, A2 6.81E-01, A3 7.86E+00, A4 1.93E+00, A5 4.49E+00, B1-B7 0, C2 1.19E+00, C4 6.72E-02, Total 2.15E+01"
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Quarry operations",
"summary": "Blocks are extracted from Polycor quarries using grid electricity and fuels, with rainwater used and recycled. Data covers Jan 2020 to Dec 2021.",
"locations": [
{
"name": "Eureka Quarry, Bedford, IN (approx.)",
"lat": 38.86,
"lon": -86.49,
"role": "quarry"
},
{
"name": "Empire Quarry, Oolitic, IN (approx.)",
"lat": 38.9,
"lon": -86.52,
"role": "quarry"
},
{
"name": "Adams Quarry, Bloomington, IN (approx.)",
"lat": 39.1,
"lon": -86.55,
"role": "quarry"
},
{
"name": "Victor Quarry, Bloomington, IN (approx.)",
"lat": 39.08,
"lon": -86.52,
"role": "quarry"
},
{
"name": "Massangis Quarry, France (5% of quarried stone, approx.)",
"lat": 47.62,
"lon": 3.97,
"role": "quarry"
},
{
"name": "Rocherons Quarry, Corgoloin/Comblanchien, France (approx.)",
"lat": 47.1,
"lon": 4.91,
"role": "quarry"
}
]
},
{
"module": "A2",
"name": "Block transport to processors",
"summary": "Blocks are trucked to processing plants, weighted distance 36 km (100 km assumed where data is missing).",
"locations": []
},
{
"module": "A3",
"name": "Processing (sawing, cutting, finishing)",
"summary": "Blocks are sawn into slabs and cut and finished into cladding panels. Plant electricity and fuel dominate impacts.",
"locations": [
{
"name": "Empire Plant, Oolitic, IN (approx.)",
"lat": 38.9,
"lon": -86.52,
"role": "plant"
},
{
"name": "Eureka Plant, Bedford, IN (approx.)",
"lat": 38.86,
"lon": -86.49,
"role": "plant"
},
{
"name": "Victor Plant, Bloomington, IN (approx.)",
"lat": 39.08,
"lon": -86.52,
"role": "plant"
}
]
},
{
"module": "A4",
"name": "Transport to site",
"summary": "Finished cladding is trucked to the building site.",
"locations": []
},
{
"module": "A5",
"name": "Installation",
"summary": "Panels are set with cement mortar and masonry anchors; 5% scrap.",
"locations": []
},
{
"module": "C2",
"name": "Waste transport",
"summary": "Removed stone is trucked 100 km.",
"locations": []
},
{
"module": "C4",
"name": "Disposal",
"summary": "31.5% of the stone is landfilled.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Limestone (Indiana; 5% French)",
"share": 0.9367,
"massKg": 81.35,
"source": "EPD",
"origin": {
"name": "Eureka Quarry, Bedford, IN (approx.)",
"lat": 38.86,
"lon": -86.49
}
},
{
"name": "Cement mortar (A5)",
"share": 0.0562,
"massKg": 4.88,
"source": "EPD",
"origin": null
},
{
"name": "Masonry connectors (A5)",
"share": 0.0071,
"massKg": 0.62,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"marble": [
{
"title": "Polycor Marble Facades, Cladding & Walls, SM Transparency Report (EPD)",
"manufacturer": "Polycor Inc. (Quebec City, Canada)",
"programOperator": "Sustainable Minds (SM Transparency Report [EPD] program); verified by Jack Geibig, Ecoform",
"regNo": "POL-20230131-008",
"issued": "2023-01-31",
"validUntil": "2028-01-30",
"standard": "ISO 14025:2006, ISO 21930:2017, UL Part A v3.2, ULE PCR Part B: Cladding Product Systems v2.0 (2021)",
"indicator": "GWP 100 (TRACI 2.1, 'Global warming (Embodied Carbon)')",
"declaredUnit": "1 m2 installed stone cladding, 48.16 mm thick, 75-yr service life (functional unit)",
"kgPerUnit": 129.94,
"kgPerUnitSource": "EPD: Natural stone 129.94 kg per m2 (density 2699 kg/m3 x 48.16 mm). The functional unit also includes 4.88 kg mortar and 0.62 kg masonry connectors in A5.",
"plant": {
"name": "Georgia Marble Plant, Tate, GA (approx.)",
"lat": 34.42,
"lon": -84.38
},
"landingUrl": "https://www.polycor.com/",
"pdfUrl": "https://www.polycor.com/wp-content/uploads/2023/03/EPD_Marble-Facades-Cladding-Walls.pdf",
"verified": true,
"modules": {
"A1": 19.9,
"A2": 4.29,
"A3": 26.4,
"A1A3": null,
"A4": 1.96,
"A5": 4.52,
"B1": 0,
"B2": 0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 0,
"B7": 0,
"C1": 0,
"C2": 1.85,
"C3": 0,
"C4": 0.105,
"D": "MND"
},
"moduleNotes": {
"B": "Printed as one 'B1-B7' column = 0. EPD: B1-B7, C1 and C3 are included but have no associated activities (C1, C3 have no column).",
"C": "Dismantled manually and trucked 100 km; 31.5% landfilled, 68.5% recycled (no further processing).",
"D": "Module D is excluded (MND).",
"A4": "Lorry 16-32 t, diesel. The A5 value includes cement mortar (calcination at 886 kg CO2/t cement) and 5% installation scrap.",
"scaling": "Results can be scaled by thickness using the EPD's conversion factors (1in, 2in, 3-5/8in).",
"A1A3": "Not printed as an aggregate; A1, A2 and A3 are printed separately.",
"printed": "A1 1.99E+01, A2 4.29E+00, A3 2.64E+01, A4 1.96E+00, A5 4.52E+00, B1-B7 0, C2 1.85E+00, C4 1.05E-01, Total 5.90E+01",
"massCheck": "EPD states 129.94 kg/m2, but 2,699 kg/m3 x 0.04816 m = 130.0 kg, so it is consistent."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Quarry operations",
"summary": "Blocks are extracted from Polycor quarries using grid electricity and fuels, with rainwater used and recycled. Data covers Jan 2020 to Dec 2021.",
"locations": [
{
"name": "Polycor Georgia Marble Quarry, Tate, GA (approx.)",
"lat": 34.42,
"lon": -84.38,
"role": "quarry"
},
{
"name": "Saint Clair Quarry, Marble City, OK (approx.)",
"lat": 35.58,
"lon": -94.82,
"role": "quarry"
}
]
},
{
"module": "A2",
"name": "Block transport to processors",
"summary": "Blocks are trucked to processing plants, weighted distance 157 km (100 km assumed where data is missing).",
"locations": []
},
{
"module": "A3",
"name": "Processing (sawing, cutting, finishing)",
"summary": "Blocks are sawn into slabs and cut and finished into cladding panels. Plant electricity and fuel dominate impacts.",
"locations": [
{
"name": "Georgia Marble Plant, Tate, GA (approx.)",
"lat": 34.42,
"lon": -84.38,
"role": "plant"
}
]
},
{
"module": "A4",
"name": "Transport to site",
"summary": "Finished cladding is trucked to the building site.",
"locations": []
},
{
"module": "A5",
"name": "Installation",
"summary": "Panels are set with cement mortar and masonry anchors; 5% scrap.",
"locations": []
},
{
"module": "C2",
"name": "Waste transport",
"summary": "Removed stone is trucked 100 km.",
"locations": []
},
{
"module": "C4",
"name": "Disposal",
"summary": "31.5% of the stone is landfilled.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Marble (Georgia and Oklahoma)",
"share": 0.9594,
"massKg": 129.94,
"source": "EPD",
"origin": {
"name": "Polycor Georgia Marble Quarry, Tate, GA (approx.)",
"lat": 34.42,
"lon": -84.38
}
},
{
"name": "Cement mortar (A5)",
"share": 0.036,
"massKg": 4.88,
"source": "EPD",
"origin": null
},
{
"name": "Masonry connectors (A5)",
"share": 0.0046,
"massKg": 0.62,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"glass": [
{
"title": "Cardinal Glass Industries Flat Glass EPD",
"manufacturer": "Cardinal Glass Industries (Cardinal FG)",
"programOperator": "UL Solutions (UL Environment)",
"regNo": "4791939895.102.1",
"issued": "2026-01-15",
"validUntil": "2031-01-15",
"validityNote": "EPD states 'Period of validity 5 Years' from 15 Jan 2026; end date computed.",
"standard": "ISO 14025, ISO 21930:2017, UL PCR Part A (2022)",
"indicator": "GWP100 (IPCC AR6), excludes biogenic carbon",
"declaredUnit": "1 metric ton of flat glass (incl. packaging)",
"kgPerUnit": 1000,
"kgNote": "Declared unit is mass-based; for 6 mm float glass use 2500 kg/m3 x 0.006 m = 15 kg/m2 (density not in this EPD).",
"plant": {
"name": "Cardinal FG float plants (production-weighted average; sites not named in EPD). Representative: Menomonie, WI",
"lat": 44.88,
"lon": -91.92,
"note": "location from manufacturer knowledge, approximate (city-level), not stated as coordinates in EPD"
},
"landingUrl": "https://www.cardinalcorp.com/technology/reference/environmental-product-declarations/",
"pdfUrl": "https://www.cardinalcorp.com/wp-content/uploads/2026/01/102.1_Cardinal_EPD_Flat-Glass.pdf",
"verified": true,
"modules": {
"A1": 266,
"A2": 55.6,
"A3": 751,
"A1A3": 1070,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"biogenic": {
"BCRK_A3_packaging": 4.06,
"note": "Table 5: BCRK 4.06 kg CO2 (packaging wood/cardboard) in A3; product has no biogenic carbon."
},
"moduleNotes": {
"C": "Not declared (MND); EPD covers A1-A3 only.",
"D": "MND",
"A4": "MND",
"A1": "A1* is flat glass cradle-to-gate raw materials plus processing of additional materials; soda ash is largest A1 contributor (16% of total). A3 natural gas = 60% of total."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Batch raw material supply",
"summary": "Sand, soda ash, limestone, dolomite and cullet are mined or manufactured and supplied to the batch house; soda ash is the biggest raw-material carbon source.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Raw materials are shipped to the float plant; 100 miles assumed for some inputs per ISO 21930.",
"locations": []
},
{
"module": "A3",
"name": "Batch melting",
"summary": "Weighed, mixed batch is melted in a natural-gas-fired furnace to form molten glass.",
"locations": [
{
"name": "Cardinal FG, Menomonie WI (representative)",
"lat": 44.88,
"lon": -91.92,
"role": "plant"
}
]
},
{
"module": "A3",
"name": "Float bath",
"summary": "Molten glass is poured onto molten tin, where it floats and is stretched into a flat ribbon of set thickness.",
"locations": []
},
{
"module": "A3",
"name": "Annealing, cutting, packing",
"summary": "The ribbon is slowly cooled in a lehr, scored and cut, edge trim removed and packed with cardboard, wood and steel banding.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Glass oxide (final product composition, CAS 65997-17-3)",
"share": 1.0,
"source": "EPD",
"origin": null
},
{
"name": "Batch: sand, soda ash, limestone, dolomite, cullet (shares not given)",
"share": null,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
},
{
"title": "NGA Flat Glass industry-average EPD",
"manufacturer": "National Glass Association (AGC Glass North America, Guardian Industries, NSG Group, Vitro Architectural Glass)",
"programOperator": "ASTM International",
"regNo": "ASTM-EPD121",
"issued": "2019-12-20",
"validUntil": "2024-12-20",
"validityNote": "EXPIRED 2024-12-20. Use as reference only.",
"standard": "ISO 14025, GANA PCR for Flat Glass (UN CPC 3711), ISO 21930:2007",
"indicator": "GWP (TRACI 2.1)",
"declaredUnit": "1 metric tonne of flat glass (clear, tinted, low-iron, annealed)",
"kgPerUnit": 1000,
"kgNote": "Mass-based declared unit; 6 mm glass ~15 kg/m2 at 2500 kg/m3 (density not in this EPD).",
"plant": {
"name": "Industry average of 4 NGA members' US float plants (sites not named)",
"lat": null,
"lon": null
},
"landingUrl": "https://glass.org/sustainability",
"pdfUrl": "https://www.astm.org/v3/assets/blt5eb0a2cb04534832/bltfe4748e9887587c7/697b20a77417b2481d809fd4/521.EPD_For_2019-12-16_2020_04_22_edit.pdf",
"pdfUrlAlt": "https://www.glass.org/sites/default/files/2019-12/NGA_EPD_2019_12_16_signed.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 1430,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"biogenic": null,
"moduleNotes": {
"C": "Not declared (cradle-to-gate).",
"D": "Not declared.",
"A4": "Not declared.",
"split": "Table 5 splits 'Raw Materials' (extraction incl. inbound transport, i.e. A1+A2) = 5.34E+02 and 'Production' (A3) = 8.96E+02; total 1.43E+03. A1 and A2 not separated.",
"rawMaterials_A1A2": 534,
"production_A3": 896
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw material extraction and pre-processing",
"summary": "Silica sand, soda ash, dolomite and limestone are mined/produced and shipped to float plants (transport included here).",
"locations": []
},
{
"module": "A3",
"name": "Float glass production",
"summary": "Batch is melted, floated on a molten tin bath, annealed in a lehr and cut; tints excluded as negligible.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Silica sand",
"share": 0.55,
"source": "EPD",
"origin": null
},
{
"name": "Soda ash",
"share": 0.21,
"source": "EPD",
"origin": null
},
{
"name": "Dolomite",
"share": 0.14,
"source": "EPD",
"origin": null
},
{
"name": "Limestone",
"share": 0.05,
"source": "EPD",
"origin": null
},
{
"name": "Other",
"share": 0.043,
"source": "EPD",
"origin": null
},
{
"name": "Sodium sulphate",
"share": "<0.01",
"source": "EPD",
"origin": null
}
],
"pdfNote": "pdfUrl is the ASTM-hosted copy that was read; pdfUrlAlt is the NGA-hosted signed copy (not opened).",
"basis": "kg"
}
],
"glass-igu": [
{
"title": "Viracon 1in Clear Insulating Low-E Coated Glass Unit (VTS airspace, one lite heat treated)",
"manufacturer": "Viracon, LLC (Apogee Enterprises)",
"programOperator": "ASTM International",
"regNo": "576",
"issued": "2023-09-15",
"validUntil": "2028-09-14",
"standard": "ISO 14025, ISO 21930:2017, UL PCR Part B Processed Glass (10010-31)",
"indicator": "GWP (TRACI 2.1 / IPCC AR5), excludes biogenic",
"declaredUnit": "1 m2 IGU: 6 mm heat-treated low-E (VNE-63) + 1/2in argon airspace (stainless VTS spacer) + 6 mm annealed, 25.4 mm overall",
"kgPerUnit": 30.99,
"kgNote": "Mass 30.99 kg per 1 m2 from EPD Table 2 'Declared data'.",
"plant": {
"name": "Viracon, Owatonna, MN",
"lat": 44.08,
"lon": -93.23,
"note": "approximate (city-level), not stated as coordinates in EPD"
},
"landingUrl": null,
"pdfUrl": "https://viracon.com/wp-content/uploads/2025/10/Viracon-EPD-576-Basic.pdf",
"pdfUrlAlt": "https://www.astm.org/v3/assets/blt5eb0a2cb04534832/bltd8b92c516e098e5a/697b2617ebb8b450f104541a/1025.Viracon_EPD_576_Basic_final.pdf",
"verified": true,
"modules": {
"A1": 44.9,
"A2": 3.18,
"A3": 11.6,
"A1A3": 59.6,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"biogenic": null,
"moduleNotes": {
"C": "MND. EPD text: IGU could be reused in frames or glass recovered and ground for fiberglass, concrete, asphalt.",
"D": "MND",
"A4": "MND",
"A3": "A3 = IGU assembly at Owatonna incl. cutting, sputter coating, tempering, packaging; MRO West grid."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Float glass and component production",
"summary": "Purchased float glass substrates, stainless spacer, silicone and argon are produced upstream (supplier EPDs used where available).",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Glass and parts arrive by heavy diesel truck and rail at supplier-reported distances.",
"locations": []
},
{
"module": "A3",
"name": "Coating",
"summary": "Low-E coating is vacuum-sputtered onto surface 2 of the outboard lite.",
"locations": [
{
"name": "Viracon Owatonna",
"lat": 44.08,
"lon": -93.23,
"role": "plant"
}
]
},
{
"module": "A3",
"name": "Heat treatment",
"summary": "Edges are seamed and the lite is heated above 1,100 F and force-cooled (tempering/heat strengthening).",
"locations": []
},
{
"module": "A3",
"name": "IGU assembly",
"summary": "VTS spacer is extruded between lites, secondary silicone sealant applied, cavity argon-filled, unit tested and racked.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Glass: tempered, coated",
"share": 0.484,
"source": "EPD",
"origin": null
},
{
"name": "Glass (annealed)",
"share": 0.484,
"source": "EPD",
"origin": null
},
{
"name": "Silicone sealant",
"share": 0.019,
"source": "EPD",
"origin": null
},
{
"name": "VTS airspace (spacer)",
"share": 0.013,
"source": "EPD",
"origin": null
},
{
"name": "Argon",
"share": 0.0006,
"source": "EPD",
"origin": null
}
],
"packaging": {
"lumber_kg_m2": 1.67,
"PE_foam_kg_m2": 0.068,
"steel_kg_m2": 0.2,
"PP_strap_kg_m2": 0.009
},
"basis": "kg"
},
{
"title": "Cardinal Glass Industries Insulating Glass EPD",
"manufacturer": "Cardinal Glass Industries (Cardinal IG)",
"programOperator": "UL Solutions (UL Environment)",
"regNo": "4791939895.103.1",
"issued": "2026-01-15",
"validUntil": "2031-01-15",
"validityNote": "5 years from issue; end date computed.",
"standard": "ISO 14025, ISO 21930:2017, UL PCR Part A (2022)",
"indicator": "GWP100 (IPCC AR6)",
"declaredUnit": "1 metric ton of insulating glass product",
"kgPerUnit": 1000,
"kgNote": "Mass-based (residential window IGUs). No m2 mass given in this 2026 EPD.",
"plant": {
"name": "Cardinal IG plants (weighted average; not named)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.cardinalcorp.com/technology/reference/environmental-product-declarations/",
"pdfUrl": "https://www.cardinalcorp.com/wp-content/uploads/2026/01/103.1_Cardinal_EPD_Insulating-Glass.pdf",
"verified": true,
"modules": {
"A1": 1520,
"A2": 59.0,
"A3": 366,
"A1A3": 1950,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"biogenic": null,
"moduleNotes": {
"C": "MND",
"D": "MND",
"A4": "MND"
},
"dParts": [],
"processes": [
{
"module": "A3",
"name": "IGU assembly line",
"summary": "Made-to-order double/triple-pane units assembled on high-speed automated lines from Cardinal flat, coated and tempered glass.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Flat glass",
"share": 0.46,
"source": "EPD",
"origin": null
},
{
"name": "Coated glass",
"share": 0.25,
"source": "EPD",
"origin": null
},
{
"name": "Tempered glass",
"share": 0.11,
"source": "EPD",
"origin": null
},
{
"name": "Coated tempered glass",
"share": 0.07,
"source": "EPD",
"origin": null
},
{
"name": "Other raw materials",
"share": 0.11,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"gypsum": [
{
"title": "Gold Bond Fire-Shield Gypsum Board (5/8in Type X), Eloy AZ",
"manufacturer": "Gold Bond Building Products, LLC (National Gypsum Company)",
"programOperator": "NSF Certification LLC",
"regNo": "EPD11336",
"issued": "2026-09-11",
"validUntil": "2031-09-10",
"standard": "ISO 14025, ISO 21930:2017, EN 15804+A2 (EF 3.1); Smart EPD Part A v1.2 + Part B Gypsum Panels v2",
"indicator": "GWP-total (EN 15804+A2, EF 3.1)",
"declaredUnit": "92.9 m2 (1,000 ft2) of installed 5/8in Type X board, RSL 75 yr",
"kgPerUnit": 1025,
"kgNote": "Weight excluding packaging 1025 kg per 92.9 m2 (11.0 kg/m2), EPD functional unit table.",
"plant": {
"name": "Gold Bond plant, Eloy, AZ",
"lat": 32.76,
"lon": -111.55,
"note": "approximate (city-level), not stated as coordinates in EPD"
},
"landingUrl": "https://www.nationalgypsum.com/design-resource-center/product-sustainability-documentation",
"pdfUrl": "https://info.nsf.org/Certified/Sustain/ProdCert/EPD11336.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 234,
"A4": 86.7,
"A5": 65,
"B1": 0,
"B2": 0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 0,
"B7": 0,
"C1": 0,
"C2": 8.26,
"C3": 0,
"C4": 109,
"D": "MND"
},
"altIndicators": {
"GWP-fossil": {
"A1A3": 300,
"A4": 86.5,
"A5": 63.7,
"B1-B7": 0,
"C1": 0,
"C2": 8.25,
"C3": 0,
"C4": 22.2
}
},
"biogenic": {
"GWP-biogenic": {
"A1A3": -65.8,
"A4": 0.174,
"A5": 1.3,
"B1-B7": 0,
"C1": 0,
"C2": 0.00365,
"C3": 0,
"C4": 87
},
"biogenicCarbonContent_kgC": 17.7,
"note": "Paper facers store biogenic carbon; released in landfill (C4)."
},
"moduleNotes": {
"B": "Printed as aggregate 'B1-B7 = 0' (declared, no impacts).",
"C": "100% landfill as mixed C&D waste; C2 truck 32.8 km + rail 119.1 km; C1 electricity 0.",
"D": "MND",
"A4": "Truck 448 km + light truck 40 km + rail 208 km to site.",
"A5": "10% scrap; joint compound, tape and screws (72.2 kg ancillaries) included; waste to landfill."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Gypsum ore and paper supply",
"summary": "Gypsum ore (company-specific data) and 100% recycled facing paper are produced and supplied; FGD power-plant electricity excluded per PCR.",
"locations": []
},
{
"module": "A2",
"name": "Raw material transport",
"summary": "Gypsum by dump truck and other inputs by flatbed truck to the plant.",
"locations": []
},
{
"module": "A3",
"name": "Calcining and board line",
"summary": "Gypsum is ground and heated to stucco, mixed with water and additives, encased in paper, set, cut, kiln-dried (natural gas) and edge-taped.",
"locations": [
{
"name": "Eloy, AZ",
"lat": 32.76,
"lon": -111.55,
"role": "plant"
}
]
},
{
"module": "C4",
"name": "Landfill",
"summary": "Board disposed in landfill; paper releases its biogenic carbon (65.3 kg CO2 BCEP).",
"locations": []
}
],
"rawMaterials": [
{
"name": "Gypsum (incl. internally processed reclaim)",
"share": 0.96,
"source": "EPD",
"origin": null
},
{
"name": "Paper (100% post-consumer)",
"share": 0.03,
"source": "EPD",
"origin": null
},
{
"name": "Additives",
"share": 0.01,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
},
{
"title": "Industry Average EPD for 5/8in Type X Conventional Gypsum Board",
"manufacturer": "Gypsum Association (member companies, USA and Canada)",
"programOperator": "NSF Certification LLC",
"regNo": "EPD 10270",
"issued": "2020-04-28",
"validUntil": "2026-04-15",
"validityNote": "EXPIRED 2026-04-15. GA released a replacement Smart EPD on 2026-07-21 but its PDF could not be located.",
"standard": "ISO 14025, ISO 21930:2017, NSF PCR for gypsum panel products",
"indicator": "GWP 100 (TRACI 2.1, IPCC AR5), excludes biogenic",
"declaredUnit": "92.9 m2 (1,000 ft2) of 15.9 mm Type X board",
"kgPerUnit": 991,
"kgNote": "Mass 991 kg per 92.9 m2, EPD Table 1 (10.4-10.7 kg/m2).",
"plant": {
"name": "Industry average, 17 GA member facilities (not named)",
"lat": null,
"lon": null
},
"landingUrl": "https://gypsum.org/",
"pdfUrl": "https://info.nsf.org/Certified/Sustain/ProdCert/EPD10270.pdf",
"verified": true,
"modules": {
"A1": 55.5,
"A2": 9.9,
"A3": 211.6,
"A1A3": 277,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"biogenic": {
"note": "Excludes biogenic CO2 from starch/dextrose (Table 4 of EPD)."
},
"moduleNotes": {
"C": "Not declared (cradle-to-gate)",
"D": "Not declared",
"A4": "Not declared"
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Natural gypsum quarrying and FGD gypsum",
"summary": "Natural gypsum ore from six quarries and one mine plus flue-gas-desulfurization gypsum from coal plants (only dewatering/transport burdened).",
"locations": []
},
{
"module": "A3",
"name": "Board manufacturing",
"summary": "Calcining, slurry mixing, forming between papers, setting and drying; natural gas drying dominates.",
"locations": []
}
],
"rawMaterials": [
{
"name": "FGD synthetic gypsum",
"share": 0.563,
"source": "EPD",
"origin": null
},
{
"name": "Natural gypsum ore",
"share": 0.362,
"source": "EPD",
"origin": null
},
{
"name": "Facing paper",
"share": 0.0194,
"source": "EPD",
"origin": null
},
{
"name": "Backing paper",
"share": 0.0181,
"source": "EPD",
"origin": null
},
{
"name": "Starch",
"share": 0.0038,
"source": "EPD",
"origin": null
},
{
"name": "Post-consumer gypsum",
"share": 0.0035,
"source": "EPD",
"origin": null
},
{
"name": "Fiberglass",
"share": 0.0027,
"source": "EPD",
"origin": null
},
{
"name": "Vermiculite",
"share": 0.0006,
"source": "EPD",
"origin": null
}
],
"rawMaterialsNote": "Shares computed from kg inputs per 92.9 m2 in EPD Table 2 (inputs, wet basis).",
"basis": "kg"
}
],
"ceiling": [
{
"title": "Armstrong School Zone Fine Fissured Ceiling Panels (mineral fiber)",
"manufacturer": "Armstrong World Industries",
"programOperator": "ASTM International",
"regNo": "EPD 980",
"issued": "2025-05-08",
"validUntil": "2030-05-08",
"validityNote": "'Period of validity 5 years'; end date computed.",
"standard": "ISO 14025, ISO 21930:2017, UL Part A v4.0 + UL Part B Non-Metal Ceiling v2",
"indicator": "GWP (TRACI 2.1), excluding biogenic",
"declaredUnit": "0.093 m2 (1 ft2) installed panel, 19.1 mm, RSL 30 yr",
"kgPerUnit": 0.589,
"kgNote": "Surface weight 0.589 kg per 0.093 m2 (6.33 kg/m2), EPD Table 3.",
"plant": {
"name": "Armstrong ceiling plants, Macon GA and Marietta PA",
"lat": 32.84,
"lon": -83.63,
"note": "Macon GA shown; approximate (city-level), not stated as coordinates in EPD"
},
"landingUrl": "https://www.armstrongceilings.com/epd",
"pdfUrl": "https://www.astm.org/v3/assets/blt5eb0a2cb04534832/blt45d77eeb09cb5eff/68237f98fbc53170793ff638/6617_School_Zone_FF_EPD_525w.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 0.223,
"A4": 0.00661,
"A5": 0.00267,
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 0,
"C2": 0.0016,
"C3": 0,
"C4": 0.0824,
"D": "MND"
},
"altIndicators": {
"GWP incl. biogenic (TRACI 2.1)": {
"A1A3": 0.18,
"A4": 0.0066,
"A5": 0.0131,
"C2": 0.0016,
"C4": 0.117
}
},
"biogenic": {
"BCRP": 0.022,
"BCRK": 0.23,
"BCEK": 0.27,
"note": "kg CO2 per ft2; starch binder and wood pallets."
},
"moduleNotes": {
"C": "C1 and C3 printed as null (manual deconstruction, no processing); 0.483 kg to landfill; 35 km truck.",
"D": "MND",
"A4": "Diesel truck 805 km.",
"A5": "7% installation waste to landfill; packaging waste."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Raw materials",
"summary": "Perlite, mineral wool, starch and fiberglass are produced and shipped to the plant.",
"locations": []
},
{
"module": "A3",
"name": "Wet-formed board line",
"summary": "Ingredients are mixed in water, formed into a mat, dried, cut, painted and packaged.",
"locations": [
{
"name": "Macon, GA",
"lat": 32.84,
"lon": -83.63,
"role": "plant"
},
{
"name": "Marietta, PA",
"lat": 40.06,
"lon": -76.55,
"role": "plant"
}
]
},
{
"module": "C4",
"name": "Landfill",
"summary": "Panels removed at end of life go to landfill (takeback recycling exists but is not modelled).",
"locations": []
}
],
"rawMaterials": [
{
"name": "Perlite",
"share": "0.10-0.70",
"source": "EPD",
"origin": null
},
{
"name": "Starch",
"share": "0.04-0.10",
"source": "EPD",
"origin": null
},
{
"name": "Fiberglass",
"share": "0.04-0.10",
"source": "EPD",
"origin": null
},
{
"name": "Mineral wool",
"share": "0.01-0.05",
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"mineral-wool": [
{
"title": "ROCKWOOL Stone Wool Insulation (board and batt), North America",
"manufacturer": "ROCKWOOL (ROXUL Inc.)",
"programOperator": "UL Solutions (UL Environment)",
"regNo": "4790711618.101.3 (updated March 2026)",
"issued": "2025-02-24",
"validUntil": "2030-02-24",
"validityNote": "5 years from issue; end date computed.",
"standard": "ISO 14025, ISO 21930:2017, UL Part A v4.0 + Part B Thermal Insulation Ed. 3.0",
"indicator": "GWP 100 (TRACI 2.1)",
"declaredUnit": "1 m2 at RSI = 1 m2K/W (reference product Comfortbatt R13, 39 mm)",
"kgPerUnit": 1.2,
"kgNote": "Mass 1.2 kg, thickness 0.039 m per functional unit (EPD Section 2.1). Boards: multiply by product scale factor (e.g. Cavityrock 1.8 gives A1-A3 2.37; Toprock DD 4.9 gives 6.32 kg CO2e).",
"plant": {
"name": "Production-weighted average of Milton ON, Grand Forks BC, Byhalia MS, Ranson WV",
"lat": 43.51,
"lon": -79.88,
"note": "Milton ON shown; approximate (city-level), not stated as coordinates in EPD"
},
"landingUrl": "https://www.rockwool.com/north-america/",
"pdfUrl": "https://www.rockwool.com/siteassets/o2-rockwool/documentation/epd/rockwool-stone-wool-environmental-product-declaration-epd.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 1.29,
"A4": 0.165,
"A5": 0.022,
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MNR",
"B7": "MNR",
"C1": 0,
"C2": 0.0103,
"C3": 0,
"C4": 0.0062,
"D": -0.122
},
"scaleFactors": {
"Cavityrock": 1.8,
"Comfortboard 80": 3.6,
"Comfortboard 110": 5.1,
"Curtainrock": 1.5,
"Curtainrock 40": 1.9,
"Curtainrock 80": 2.9,
"ROXUL Safe": 1.9,
"Toprock DD": 4.9,
"AFB": 1.1
},
"biogenic": {
"note": "Biogenic carbon in packaging 0.104 kg CO2 (A5)."
},
"moduleNotes": {
"C": "100% landfill, collected with mixed C&D waste, 50 km.",
"D": "Benefits from recycling and incineration of packaging materials in A5 (net energy 0.17 MJ, 73% efficiency).",
"A4": "Truck 664 km + rail 229 km (weighted average).",
"A5": "1% cut-off waste to landfill plus packaging disposal."
},
"dParts": [
{
"type": "recycling",
"note": "Packaging (plastic, cardboard, wood) recycled after installation."
},
{
"type": "energy recovery",
"note": "Packaging incinerated with energy recovery."
}
],
"processes": [
{
"module": "A1",
"name": "Basalt and binder supply",
"summary": "Basalt rock is quarried locally for each plant; resin/urea binder and mineral oil produced.",
"locations": []
},
{
"module": "A3",
"name": "Stone wool melting and spinning",
"summary": "Rock is melted and spun into fibres which are sprayed with binder.",
"locations": [
{
"name": "Milton, ON",
"lat": 43.51,
"lon": -79.88,
"role": "plant"
},
{
"name": "Grand Forks, BC",
"lat": 49.03,
"lon": -118.44,
"role": "plant"
},
{
"name": "Byhalia, MS",
"lat": 34.87,
"lon": -89.69,
"role": "plant"
},
{
"name": "Ranson, WV",
"lat": 39.3,
"lon": -77.86,
"role": "plant"
}
]
},
{
"module": "A3",
"name": "Curing and cutting",
"summary": "Fibre mat is laid to thickness/density, cured in an oven, cut, stacked and packaged.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Stone wool fibres (basalt-based)",
"share": ">0.94",
"source": "EPD",
"origin": null
},
{
"name": "Binder",
"share": "<0.06",
"source": "EPD",
"origin": null
},
{
"name": "Mineral oil",
"share": "<0.01",
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"membrane": [
{
"title": "ARMA SBS-Modified Bitumen Roofing Membrane (Installation: Hot Asphalt), industry average",
"manufacturer": "Asphalt Roofing Manufacturers Association (CertainTeed, Holcim, IKO, JM, Malarkey, Polyglass, Siplast, SOPREMA)",
"programOperator": "UL Environment",
"regNo": "4789862118.104.1",
"issued": "2023-07-01",
"validUntil": "2028-07-01",
"validityNote": "5 years from issue; end date computed.",
"standard": "ISO 14025, ISO 21930:2017, UL Part A (2022) + Part B Asphalt Roofing (2021)",
"indicator": "GWP excl biogenic (IPCC AR5)",
"declaredUnit": "1 m2 installed two-ply SBS system (base + cap, hot-mopped)",
"kgPerUnit": 12.85,
"kgNote": "Reference flow 12.85 kg/m2 (EPD 3.1); includes 2.52 kg/m2 Type IV mopping asphalt, flashings and granules added at installation (cap 6.01 + base 4.77 kg/m2 incl. 10% overlap and 5% scrap).",
"plant": {
"name": "Industry average, ARMA member plants in US and Canada (not named)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.asphaltroofing.org/",
"pdfUrl": "https://www.asphaltroofing.org/wp-content/uploads/2023/08/104.1_ARMA-SBS-Hot-Asphalt.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 5.81,
"A4": 0.134,
"A5": 1.93,
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 0,
"C2": 0.149,
"C3": 0,
"C4": 0.549,
"D": "MND"
},
"biogenic": {
"note": "Biogenic carbon in packaging 0.19 kg CO2; no product biogenic removals."
},
"moduleNotes": {
"C": "Manual removal (C1=0), truck 161 km to landfill, no processing (C3=0), 100% landfill of 12.85 kg.",
"D": "MND (cut-off, no credits).",
"A4": "Truck 800 km (497 mi).",
"A5": "Hot asphalt 2.52 kg, propane kettle 2.60 MJ, VOCs 0.0008 kg/m2, 5% scrap."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Asphalt (bitumen) refining",
"summary": "Asphalt is a heavy residue from crude oil refining, then blended with SBS polymer and limestone stabiliser.",
"locations": []
},
{
"module": "A1",
"name": "Mineral granules and mats",
"summary": "Coloured (white, TiO2-coated) mineral granules, sand and fiberglass/polyester mats are produced.",
"locations": []
},
{
"module": "A3",
"name": "Sheet manufacturing",
"summary": "Mats are impregnated and coated with polymer-modified asphalt, surfaced, cooled, wound and packaged.",
"locations": []
},
{
"module": "A5",
"name": "Hot-mop installation",
"summary": "Asphalt heated in a propane kettle is mopped down and base and cap sheets are rolled into it.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Cap sheet (45% of system): asphalt 33%, mineral granules 27%, mineral stabilizers 18%, sand 9%, fire retardant 7%, mat 4%, SBS 3%",
"share": 0.45,
"source": "EPD",
"origin": null
},
{
"name": "Base sheet (35% of system): asphalt 44%, mineral stabilizers 25%, sand 19%, SBS 6%, mat 5%",
"share": 0.35,
"source": "EPD",
"origin": null
},
{
"name": "Installation asphalt, flashings, granules (remainder)",
"share": null,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
},
{
"title": "ARMA SBS-Modified Bitumen Roofing Membrane (Torch Applied), industry average",
"manufacturer": "Asphalt Roofing Manufacturers Association",
"programOperator": "UL Environment",
"regNo": "4789862118.103.1",
"issued": "2023-07-01",
"validUntil": "2028-07-01",
"standard": "ISO 14025, ISO 21930:2017",
"indicator": "GWP excl biogenic (IPCC AR5)",
"declaredUnit": "1 m2 installed two-ply SBS torch-applied system",
"kgPerUnit": 9.62,
"kgNote": "Reference flow 9.62 kg/m2 (EPD 3.1).",
"plant": {
"name": "Industry average (not named)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.asphaltroofing.org/",
"pdfUrl": "https://www.asphaltroofing.org/wp-content/uploads/2023/08/103.1_ARMA-SBS-Torch-Applied.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 5.85,
"A4": 0.124,
"A5": 0.897,
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 0,
"C2": 0.112,
"C3": 0,
"C4": 0.411,
"D": "MND"
},
"biogenic": null,
"moduleNotes": {
"C": "Landfill scenario as hot-asphalt EPD.",
"D": "MND",
"A4": "800 km truck"
},
"dParts": [],
"processes": [],
"rawMaterials": [
{
"name": "Cap sheet 54% of system (asphalt 41%...)",
"share": 0.54,
"source": "EPD",
"origin": null
},
{
"name": "Base sheet 44% of system (asphalt 56%...)",
"share": 0.44,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"clt": [
{
"title": "Mercer Mass Timber Cross-Laminated Timber, Conway AR",
"manufacturer": "Mercer Mass Timber (Mercer International)",
"programOperator": "ASTM International",
"regNo": "EPD 944",
"issued": "2025-03-13",
"validUntil": "2030-03-13",
"validityNote": "'Period of validity 5 years'; end date computed. Document version 1.1 dated June 2025.",
"standard": "ISO 14025, ISO 21930:2017, UL Part A v3.2 + Part B Structural & Architectural Wood v1.1",
"indicator": "GWP-fossil (TRACI 2.1); GWP-total and GWP-biogenic recorded separately",
"declaredUnit": "1 m3 CLT (southern yellow pine, 12% MC)",
"kgPerUnit": 580,
"kgNote": "Mass 580 oven-dry kg per m3 (EPD Table 5); at 12% MC actual mass ~650 kg (not stated).",
"plant": {
"name": "Mercer Mass Timber, Conway, AR",
"lat": 35.09,
"lon": -92.44,
"note": "approximate (city-level), not stated as coordinates in EPD"
},
"landingUrl": "https://www.woodworks.org/resources/current-epds-for-wood-products",
"pdfUrl": "https://mercermasstimber.com/wp-content/uploads/2025/06/Mercer-Conway_Environmental-Product-Declaration-Report_Cross-laminated-Timber_June-2025.pdf",
"pdfUrlAlt": "https://www.astm.org/v3/assets/blt5eb0a2cb04534832/bltcc75dfead7464e12/6846f29e8177ee84ccc301d5/Mercer-Conway_Environmental-Product-Declaration-Report_Cross-laminated-Timber_June-2025.pdf",
"verified": true,
"modules": {
"A1": 102.04,
"A2": 31.74,
"A3": 34.16,
"A1A3": 167.95,
"A4": "MND",
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": "MND",
"C2": "MND",
"C3": "MND",
"C4": "MND",
"D": "MND"
},
"altIndicators": {
"GWP-total": {
"A1": -1166.72,
"A2": 31.74,
"A3": 1302.92,
"A1A3": 167.95
}
},
"biogenic": {
"GWP-biogenic": {
"A1": -1268.76,
"A2": 0,
"A3": 1268.76,
"A1A3": 0
},
"BCRP_A1": -1268.76,
"BCEP_A3": 213.93,
"BCEP_C3C4": 1054.83,
"carbonInProductAtGate": -1054.82,
"landfillAddendum": {
"CH4_kgCO2e": 50.88,
"CO2_kg": 118.52,
"permanentSequestration": -885.42,
"note": "Informative UL 2020 Appendix A 100% landfill calculation, outside declared modules."
}
},
"moduleNotes": {
"C": "MND. Informative note: 100% landfill would emit 50.88 kg CO2e CH4 + 118.52 kg CO2, leaving -885.42 kg CO2e permanently stored.",
"D": "MND",
"A4": "MND",
"biogenic": "Biogenic balance A1-A3 is zero: removal in A1 is shown as emitted in A3 (by-products) and C3/C4 (product)."
},
"dParts": [],
"processes": [
{
"module": "A1",
"name": "Forestry and sawmilling",
"summary": "Southern yellow pine is grown, harvested and sawn/kiln-dried into dimension lumber in the US South.",
"locations": [
{
"name": "US Southern pine region (generalised)",
"lat": 33.0,
"lon": -91.0,
"role": "forest"
}
]
},
{
"module": "A1",
"name": "Resin production",
"summary": "Polyurethane face-bonding and melamine-formaldehyde finger-joint adhesives (0.8% of mass).",
"locations": []
},
{
"module": "A2",
"name": "Lumber transport",
"summary": "Lumber trucked to Conway; A2 is 19% of fossil GWP.",
"locations": []
},
{
"module": "A3",
"name": "Lamination",
"summary": "Lumber is cut to lamstock, finger-jointed, face-glued in cross layers, pressed and trimmed; 17% of wood leaves as by-products.",
"locations": [
{
"name": "Conway, AR",
"lat": 35.09,
"lon": -92.44,
"role": "plant"
}
]
}
],
"rawMaterials": [
{
"name": "Softwood lumber (southern yellow pine)",
"share": 0.992,
"source": "EPD",
"origin": {
"name": "US Southern bioregion (generalised)",
"lat": 33.0,
"lon": -91.0
}
},
{
"name": "Resin system (PUR + MF)",
"share": 0.008,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
},
{
"title": "CLT (Cross Laminated Timber) by Stora Enso",
"manufacturer": "Stora Enso Wood Products",
"programOperator": "EPD International AB (The International EPD System)",
"regNo": "S-P-09949",
"issued": "2023-10-06",
"validUntil": "2028-10-06",
"standard": "ISO 14025, EN 15804:2012+A2:2019/AC:2021, PCR 2019:14 v1.2.5, c-PCR-006 (EN 16485)",
"indicator": "GWP-total (EN 15804+A2)",
"declaredUnit": "1 m3 CLT, 12% moisture",
"kgPerUnit": 470,
"kgNote": "470 kg/m3 (EPD technical info and content table).",
"plant": {
"name": "Weighted average of Bad St. Leonhard AT, Gruvön SE, Ybbs AT, Ždírec CZ",
"lat": 48.17,
"lon": 15.08,
"note": "Ybbs shown; approximate (city-level), not stated as coordinates in EPD"
},
"landingUrl": "https://www.environdec.com/library",
"pdfUrl": "https://cenia.gov.cz/wp-content/uploads/2023/12/Stora-Enso-EPD-CLT-October-2023.pdf",
"pdfNote": "PDF copy hosted by CENIA (Czech env. agency); same registered document S-P-09949.",
"verified": true,
"modules": {
"A1": -729,
"A2": 8.72,
"A3": 11.6,
"A1A3": -708,
"A4": 25.9,
"A5": 5.38,
"B1": 0,
"B2": 0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 0,
"B7": 0,
"C1": 4.01,
"C2": 2.05,
"C3": 782,
"C4": 0,
"D": -268
},
"altIndicators": {
"GWP-fossil": {
"A1": 32.6,
"A2": 8.71,
"A3": 11.2,
"A1A3": 52.6,
"A4": 25.9,
"A5": 5.38,
"C1": 4.01,
"C2": 2.04,
"C3": 20.2,
"C4": 0,
"D": -267
},
"GWP-GHG": {
"A1A3": 53.1
},
"altEoL_GWP-total": {
"reuse": {
"C3": 762,
"D": -45.6
},
"recycling": {
"C3": 768,
"D": -16.2
},
"landfill": {
"C3": 0,
"C4": 1020,
"D": -0.0456
}
}
},
"biogenic": {
"GWP-biogenic": {
"A1": -762,
"A2": 0.00628,
"A3": 0.34,
"A1A3": -762,
"A4": 0.0103,
"A5": 0.001,
"C1": 0.000698,
"C2": 0.000812,
"C3": 762,
"C4": 0,
"D": -0.751
},
"biogenicCarbonContent": "762 kg CO2/m3 = 207.8 kg C/m3"
},
"moduleNotes": {
"B": "Printed as aggregate B1-B7 = 0.",
"C": "Main scenario: 100% incineration with energy recovery; 50 km transport; C3 crushing and combustion releases stored biogenic carbon.",
"D": "Avoided European grid electricity and natural-gas heat from incineration.",
"A4": "Lorry >32 t, 634 km, 50% utilisation (European customers)."
},
"dParts": [
{
"type": "energy recovery",
"note": "Incineration replaces EU-average electricity and natural-gas heat (main scenario, D = -268)."
}
],
"processes": [
{
"module": "A1",
"name": "Forestry",
"summary": "Spruce (and pine) roundwood harvested from certified forests in Austria, neighbouring countries and Sweden.",
"locations": [
{
"name": "Austria (generalised)",
"lat": 47.5,
"lon": 14.5,
"role": "forest"
},
{
"name": "Sweden, Värmland (generalised)",
"lat": 59.7,
"lon": 13.2,
"role": "forest"
}
]
},
{
"module": "A2",
"name": "Log transport",
"summary": "Logs trucked and railed to the sawmills.",
"locations": []
},
{
"module": "A3",
"name": "Sawmill and lamination",
"summary": "Kiln-dried sawn timber is graded, finger-jointed, planed, PUR-bonded in cross layers, pressed, machined and sanded.",
"locations": [
{
"name": "Bad St. Leonhard, AT",
"lat": 46.96,
"lon": 14.79,
"role": "plant"
},
{
"name": "Gruvön (Grums), SE",
"lat": 59.35,
"lon": 13.1,
"role": "plant"
},
{
"name": "Ybbs an der Donau, AT",
"lat": 48.17,
"lon": 15.08,
"role": "plant"
},
{
"name": "Ždírec nad Doubravou, CZ",
"lat": 49.7,
"lon": 15.81,
"role": "plant"
}
]
},
{
"module": "C3",
"name": "Incineration",
"summary": "CLT is chipped and burned for energy, releasing its 762 kg CO2 biogenic carbon.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Wood (Picea abies, Pinus sylvestris)",
"share": 0.9898,
"source": "EPD",
"origin": {
"name": "Austria/central Europe and Sweden (generalised)",
"lat": 47.5,
"lon": 14.5
}
},
{
"name": "PUR resin",
"share": 0.0089,
"source": "EPD",
"origin": null
},
{
"name": "EPI resin",
"share": 0.00106,
"source": "EPD",
"origin": null
},
{
"name": "Hardener",
"share": 0.00021,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"lift": [
{
"title": "KONE MiniSpace DX High Rise Elevator with KONE UltraRope",
"manufacturer": "KONE Corporation",
"programOperator": "EPD International AB (The International EPD System)",
"regNo": "S-P-05407 (EPD-IES-0005407:006)",
"issued": "2022-05-03 (revised 2023-03-17)",
"validUntil": "2027-05-02",
"standard": "ISO 14025:2006, EN 15804:2012+A2:2019, PCR 2019:14 c-PCR-008 (lifts)",
"indicator": "GWP-total",
"declaredUnit": "1 elevator (results per entire life cycle): gearless traction, 1600 kg rated load, 6 m/s, 20 stops, 200 m travel, usage category 4 (ISO 25745-2), 365 days/yr, RSL 25 yr; FU = 33,726 tkm over 25 yr",
"unitSize": {
"value": 1,
"unit": "ea",
"ratedLoadKg": 1600,
"speedMs": 6,
"travelM": 200,
"stops": 20,
"usageCategory": 4,
"tkm": 33726
},
"kgPerUnit": 39632,
"rslYears": 25,
"plant": {
"name": "KONE + suppliers (Austria, China, Czech Rep., Estonia, Finland, Germany, Italy, Lithuania); main KONE factory Kunshan, China",
"lat": 31.385,
"lon": 120.98
},
"landingUrl": "https://www.environdec.com/library/epd5407",
"pdfUrl": "https://api.environdec.com/api/v1/EPDLibrary/Files/db418377-28a4-4074-27f5-08db259f9365/Data",
"verified": true,
"modules": {
"A1": 109000.0,
"A2": 2010.0,
"A3": -2970.0,
"A1A3": 108040,
"A4": 4130.0,
"A5": 11600.0,
"B1": "ND",
"B2": 12700.0,
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": 523000.0,
"B7": "ND",
"C1": 65.0,
"C2": 901.0,
"C3": 1600.0,
"C4": 29.9,
"D": -22400.0
},
"moduleNotes": {
"A1A3": "Not printed as a combined row; value is the sum of printed A1+A2+A3 (A3 is negative because packaging biogenic uptake is booked there and released in A5).",
"B6": "19,300 kWh/yr (ISO 25745-2, UC4 = 273,750 starts/yr) x 25 yr = 482,500 kWh, China grid 1.08 kg CO2e/kWh, installed in Shanghai. UC5 sensitivity printed: 29,700 kWh/yr. Exclude B6 and compute operational energy separately.",
"B2": "Predictive replacement of parts over 25 yr (1131.66 kg ferrous, 644 kg electronics, 184 kg polymers, 107.5 kg carbon fibre, etc.), 360 km transport.",
"B1,B3,B4,B5,B7": "Declared ND (not relevant) in KONE scope table.",
"C": "Dismantled in China; 89% recycling, 1% energy recovery, 10% landfill; 250 km lorry to treatment.",
"D": "Benefits of recycling metals (mainly steel) and energy recovery from incineration of combustibles."
},
"dParts": [
{
"type": "recycling",
"note": "Avoided virgin steel/metal production from 0.89 kg/kg recycled"
},
{
"type": "energy recovery",
"note": "Incineration of plastics/organics, 0.01 kg/kg"
}
],
"processes": [
{
"module": "A1",
"name": "Materials and components",
"summary": "Raw material extraction and production of components; steel production is 88% of A1-A3 GWP.",
"locations": [
{
"name": "Kunshan, China (KONE factory)",
"lat": 31.385,
"lon": 120.98,
"role": "assembly/component manufacture"
},
{
"name": "Hyvinkää, Finland (KONE)",
"lat": 60.63,
"lon": 24.86,
"role": "component manufacture"
}
]
},
{
"module": "A2",
"name": "Transport to component manufacturer",
"summary": "Inbound transport of materials to KONE and supplier sites.",
"locations": []
},
{
"module": "A3",
"name": "Manufacturing, packaging and waste",
"summary": "Module manufacturing at 8-country supplier base using national/residual grid mixes (China 1.08, Finland 0.46 kg CO2e/kWh, etc.) plus packaging (3038 kg, mostly wood).",
"locations": []
},
{
"module": "A4",
"name": "Transport to site",
"summary": "Lorry 820 km + sea freight 26,103 km to Shanghai.",
"locations": [
{
"name": "Shanghai, China (installation site)",
"lat": 31.23,
"lon": 121.47,
"role": "building site"
}
]
},
{
"module": "A5",
"name": "Installation",
"summary": "60 kWh electricity; packaging waste (2866 kg wood, 66 kg plastic, 87 kg cardboard) treated.",
"locations": []
},
{
"module": "C1-C4",
"name": "End of life",
"summary": "Manual dismantling, 250 km transport, metals recycled, residue landfilled/incinerated.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Ferrous metals",
"share": 0.9501,
"source": "EPD",
"origin": null
},
{
"name": "Electronics",
"share": 0.0325,
"source": "EPD",
"origin": null
},
{
"name": "Polymer",
"share": 0.0061,
"source": "EPD",
"origin": null
},
{
"name": "Non-ferrous metal",
"share": 0.0045,
"source": "EPD",
"origin": null
},
{
"name": "Inorganic material",
"share": 0.0038,
"source": "EPD",
"origin": null
},
{
"name": "Others",
"share": 0.0027,
"source": "EPD",
"origin": null
},
{
"name": "Organic material",
"share": 0.0005,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
},
{
"title": "KONE MiniSpace DX HighRise elevator with Steel Rope",
"manufacturer": "KONE Corporation",
"programOperator": "EPD International AB (The International EPD System)",
"regNo": "S-P-08215 (EPD-IES-0008215:003)",
"issued": "2023-01-27",
"validUntil": "2028-01-26",
"standard": "ISO 14025:2006, EN 15804:2012+A2:2019, PCR 2019:14 c-PCR-008",
"indicator": "GWP-total",
"declaredUnit": "1 elevator (entire life cycle): 1600 kg, 6 m/s, 20 stops, 200 m travel, UC4, RSL 25 yr, steel hoisting ropes",
"unitSize": {
"value": 1,
"unit": "ea",
"ratedLoadKg": 1600,
"speedMs": 6,
"travelM": 200,
"stops": 20,
"usageCategory": 4
},
"kgPerUnit": 41765,
"rslYears": 25,
"plant": {
"name": "KONE factory Kunshan, China + suppliers",
"lat": 31.385,
"lon": 120.98
},
"landingUrl": "https://www.environdec.com/library/epd8215",
"pdfUrl": "https://api.environdec.com/api/v1/EPDLibrary/Files/a204fb29-346c-49ae-27fd-08db259f9365/Data",
"verified": true,
"modules": {
"A1": 99400.0,
"A2": 214.0,
"A3": 9310.0,
"A1A3": 108924,
"A4": 532.0,
"A5": 8090.0,
"B1": "ND",
"B2": 20900.0,
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": 607000.0,
"B7": "ND",
"C1": 65.0,
"C2": 980.0,
"C3": 3040.0,
"C4": 41.3,
"D": -27700.0
},
"moduleNotes": {
"A1A3": "Sum of printed A1+A2+A3.",
"B6": "22,400 kWh/yr x 25 yr (ISO 25745-2, UC4), China grid 1.08 kg CO2/kWh. Exclude; compute separately.",
"C": "Same EoL scenario family as S-P-05407 (recycling-dominated).",
"D": "Metal recycling and energy recovery credits."
},
"dParts": [
{
"type": "recycling",
"note": "Steel and other metals"
},
{
"type": "energy recovery",
"note": "Combustible fractions"
}
],
"processes": [
{
"module": "A1-A3",
"name": "Manufacture",
"summary": "Steel-dominated elevator (95% ferrous) produced by KONE and suppliers.",
"locations": [
{
"name": "Kunshan, China (KONE)",
"lat": 31.385,
"lon": 120.98,
"role": "manufacture"
}
]
}
],
"rawMaterials": [
{
"name": "Ferrous metals",
"share": 0.9505,
"source": "EPD",
"origin": null
},
{
"name": "Electronics",
"share": 0.0308,
"source": "EPD",
"origin": null
},
{
"name": "Polymer",
"share": 0.0066,
"source": "EPD",
"origin": null
},
{
"name": "Non-ferrous metal",
"share": 0.0058,
"source": "EPD",
"origin": null
},
{
"name": "Lubricants, paints, coatings, adhesives, fillers",
"share": 0.0029,
"source": "EPD",
"origin": null
},
{
"name": "Organic material",
"share": 0.0017,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
}
],
"chiller": [
{
"title": "AquaEdge 19XR/XRV Water-Cooled Centrifugal Chiller (weighted average, 3 sites)",
"manufacturer": "Carrier Corporation",
"programOperator": "EPD International AB (registered via EPD North America hub)",
"regNo": "EPD-IES-0009996:001",
"issued": "2025-06-18",
"validUntil": "2030-06-18",
"standard": "ISO 14025:2006, EN 15804:2012+A2:2019/AC:2021, PCR 2019:14",
"indicator": "GWP-total",
"declaredUnit": "1 finished water-cooled centrifugal chiller, model 19XRV8484E51MEB64, 1400 tons (RT) cooling capacity, R-513A, RSL 22 yr",
"unitSize": {
"value": 4923,
"unit": "kW",
"kW": 4923
},
"kgPerUnit": 26339,
"rslYears": 22,
"plant": {
"name": "Carrier, 9701 Old Statesville Rd, Charlotte NC (also Montluel FR and Shanghai CN; volume-weighted)",
"lat": 35.335,
"lon": -80.85
},
"landingUrl": "https://www.environdec.com/library/epd9996",
"pdfUrl": "https://api.environdec.com/api/v1/EPDLibrary/Files/b86225f4-ae9e-438b-c2f3-08ddad5f4c17/Data",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 174000.0,
"A4": 7860.0,
"A5": 789.0,
"B1": 338000.0,
"B2": 5940.0,
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": 27100000.0,
"B7": 0,
"C1": 0,
"C2": 271.0,
"C3": 576.0,
"C4": 79100.0,
"D": -41700.0
},
"moduleNotes": {
"kgPerUnit": "26,339 kg includes packaging (~134 kg); product alone ~26,205 kg.",
"B1": "Refrigerant leakage: R-513A 1342 kg charge, 2%/yr over 22 yr, GWP 573 (AR5) = 338,345 kg CO2e.",
"B6": "1,731,449.70 kWh/yr x 22 yr = 38,091,894.30 kWh; global electricity 0.71 kg CO2e/kWh; energy averaged over 55 global cities via ASHRAE-based tool. Exclude; compute separately.",
"B3,B4,B5": "ND (stated negligible <1%).",
"C": "100 km truck; metals/cardboard/electronics recycled, plastics landfilled; C4 includes 134.2 kg R-513A lost at EoL (10%) = 76,896.6 kg CO2e.",
"D": "Metal recycling from C3, packaging recycling from A5, and refrigerant recovery (90% reclaimed)."
},
"dParts": [
{
"type": "recycling",
"note": "Steel, copper, cast iron, aluminium (18,236 kg to recycling)"
},
{
"type": "recycling",
"note": "Packaging from A5"
},
{
"type": "other",
"note": "Refrigerant recovery 1,207.8 kg R-513A reclaimed"
}
],
"processes": [
{
"module": "A1",
"name": "Raw materials",
"summary": "Steel, copper, cast iron, electronics and refrigerant sourced globally, assumed 100% primary.",
"locations": []
},
{
"module": "A2",
"name": "Inbound transport",
"summary": "Truck and ship transport from global suppliers to three Carrier plants by weight and distance.",
"locations": []
},
{
"module": "A3",
"name": "Manufacturing",
"summary": "Fabrication and assembly; electricity 820 kWh (US site shown), grid factors China 0.86, USA 0.51, France 0.0769 kg CO2e/kWh.",
"locations": [
{
"name": "Charlotte, NC, USA",
"lat": 35.335,
"lon": -80.85,
"role": "assembly"
},
{
"name": "Montluel, France",
"lat": 45.85,
"lon": 5.06,
"role": "assembly"
},
{
"name": "Baoshan, Shanghai, China",
"lat": 31.4,
"lon": 121.49,
"role": "assembly"
}
]
},
{
"module": "A4-A5",
"name": "Distribution and installation",
"summary": "Average transport to global sites; crane installation and commissioning.",
"locations": []
},
{
"module": "B1-B2",
"name": "Use and maintenance",
"summary": "Refrigerant leakage and recharge plus maintenance parts.",
"locations": []
},
{
"module": "C1-C4",
"name": "End of life",
"summary": "Dismantling, 100 km transport, recycling of metals, landfill of plastics, 10% refrigerant loss.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Steel",
"share": 0.5796,
"source": "EPD",
"origin": null
},
{
"name": "Copper",
"share": 0.2362,
"source": "EPD",
"origin": null
},
{
"name": "Cast iron",
"share": 0.0807,
"source": "EPD",
"origin": null
},
{
"name": "Refrigerant R-513A",
"share": 0.0512,
"source": "EPD",
"origin": null
},
{
"name": "Electronics",
"share": 0.0303,
"source": "EPD",
"origin": null
},
{
"name": "Plastics & non-metals",
"share": 0.0081,
"source": "EPD",
"origin": null
},
{
"name": "Bronze",
"share": 0.0065,
"source": "EPD",
"origin": null
},
{
"name": "Aluminium",
"share": 0.0056,
"source": "EPD",
"origin": null
},
{
"name": "Other metals",
"share": 0.0015,
"source": "EPD",
"origin": null
},
{
"name": "Miscellaneous",
"share": 0.0003,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
},
{
"title": "Water Cooled Chillers: YZ (magnetic-bearing centrifugal)",
"manufacturer": "Johnson Controls (YORK)",
"programOperator": "EPD International AB (licensee: North American EPD System)",
"regNo": "EPD-IES-0032507:002 (document text shows :001)",
"issued": "2026-06-11",
"validUntil": "2031-06-11",
"standard": "ISO 14025, EN 15804+A2 (EF 3.1), IEPD Construction Products PCR 2019:14 v2.0.1",
"indicator": "GWP-total",
"declaredUnit": "1 chiller, YZ, 650 cooling tons, R-1233zd, technical lifespan 20 yr",
"unitSize": {
"value": 2286,
"unit": "kW",
"kW": 2286
},
"kgPerUnit": 12153,
"rslYears": 20,
"plant": {
"name": "JCI San Antonio, 5680 E. Houston St, TX (also Wuxi CN, Carquefou/Nantes FR)",
"lat": 29.43,
"lon": -98.38
},
"landingUrl": "https://www.environdec.com/library/epd32507",
"pdfUrl": "https://api.environdec.com/api/v1/EPDLibrary/Files/53f31c5d-962c-4b41-34da-08decd7a4f6b/Data",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 98700.0,
"A4": 3610.0,
"A5": 2.38,
"B1": 249.0,
"B2": 1090.0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 11800000.0,
"B7": 0,
"C1": 0,
"C2": 99.0,
"C3": 52.5,
"C4": 1780.0,
"D": -37300.0
},
"moduleNotes": {
"kgPerUnit": "Table 3 says 12,153 kg product + 19.2 kg packaging (one sentence in text says 46,931 kg, an apparent typo).",
"B1": "Refrigerant leakage 0.5%/yr, 64 kg over lifespan, GWP 3.9.",
"B6": "650 t x 0.343 kW/t IPLV x 3,817 EFLH x 20 yr = 17,041,340 kWh; GLO low-voltage mix 0.690 kg CO2e/kWh. Exclude; compute separately.",
"C": "Recycling of metals; 772 kg to landfill.",
"D": "Metal recycling credits net of recycled input."
},
"dParts": [
{
"type": "recycling",
"note": "Steel, copper, aluminium"
}
],
"processes": [
{
"module": "A3",
"name": "Manufacturing",
"summary": "Metal fabrication, assembly, electrical integration and factory test; A3 grid: Nantes 0.0092, San Antonio 0.60, Wuxi 0.79 kg CO2e/kWh.",
"locations": [
{
"name": "San Antonio, TX, USA",
"lat": 29.43,
"lon": -98.38,
"role": "assembly"
},
{
"name": "Wuxi, Jiangsu, China",
"lat": 31.49,
"lon": 120.31,
"role": "assembly"
},
{
"name": "Carquefou (Nantes), France",
"lat": 47.3,
"lon": -1.49,
"role": "assembly"
}
]
}
],
"rawMaterials": [
{
"name": "Steel",
"share": 0.6,
"source": "EPD",
"origin": null
},
{
"name": "Copper",
"share": 0.15,
"source": "EPD",
"origin": null
},
{
"name": "Aluminum",
"share": 0.14,
"source": "EPD",
"origin": null
},
{
"name": "R-1233zd",
"share": 0.05,
"source": "EPD",
"origin": null
},
{
"name": "Inductor",
"share": 0.03,
"source": "EPD",
"origin": null
},
{
"name": "Other/capacitor/wires/transformer/plastic",
"share": 0.03,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
}
],
"ahu": [
{
"title": "Geniox GO (R-HW-Optimized) air handling unit, size 18",
"manufacturer": "UAB Systemair (Systemair group)",
"programOperator": "The Norwegian EPD Foundation (EPD-Norge)",
"regNo": "NEPD-8444-8104-EN",
"issued": "2024-12-11",
"validUntil": "2029-12-11",
"standard": "ISO 14025, EN 15804:2012+A2:2019, NPCR 030:2021 Part B ventilation components",
"indicator": "GWP-total",
"declaredUnit": "1 pcs Geniox size 18 AHU with rotary heat exchanger, integrated controls, dampers, hydronic heater",
"unitSize": {
"value": 2.44,
"unit": "m³/s",
"note": "Airflow NOT in EPD. Geniox 18 range 3,700-8,800 m3/h (1.03-2.44 m3/s) per Passive House Institute database 2334vl03; EPD only says range of sizes 10-31 is ~1,000-35,000 m3/h. EPD gives size table for scaling (sizes 10-31, factor vs size 18)."
},
"kgPerUnit": 1211.91,
"rslYears": null,
"plant": {
"name": "UAB Systemair, Linu g. 101, Ukmergė, Lithuania",
"lat": 55.245,
"lon": 24.76
},
"landingUrl": "https://www.epd-norge.no/",
"pdfUrl": "https://epd-global.com/getfile.php/1375635-1733910411/EPDer/Byggevarer/NEPD-8444-8104_Geniox-GO--R-HW-Optimized-.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 6910.0,
"A4": 199.0,
"A5": "MND",
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 1.56,
"C2": 9.94,
"C3": 241.0,
"C4": 9.19,
"D": -2280.0
},
"moduleNotes": {
"rsl": "RSL 'Determined by the application of the product' (not declared).",
"B6": "MND - fan energy/heat recovery must be calculated project-specifically (SystemairCAD).",
"sizeScaling": "GWP-total A1-A3 by size: 10=3549.01, 11=3897.92, 12=4348.09, 14=5105.87, 16=6330.53, 18=6914.01, 20=8290.85, 22=9853.78, 24=11275.27, 27=14475.16, 29=16147.84, 31=20517.40 kg CO2e (weights 584.65-3609.55 kg).",
"A4": "Generic 1000 km EURO6 truck.",
"C": "C2 50 km; 912.95 kg to recycling, plastics/electronics incinerated, mineral wool/residues landfilled.",
"D": "Substitution of primary aluminium 163.33 kg, primary steel 684.63 kg, primary copper 15.35 kg; electricity 58 MJ and district heat 877.48 MJ (Norway)."
},
"dParts": [
{
"type": "recycling",
"note": "Steel 684.63 kg, aluminium 163.33 kg, copper 15.35 kg net scrap"
},
{
"type": "energy recovery",
"note": "Electricity 58 MJ + district heat 877.48 MJ from incineration"
}
],
"processes": [
{
"module": "A1",
"name": "Raw materials",
"summary": "Magnelis-coated and galvanised steel panels, aluminium rotor, motor, coil, insulation (ecoinvent 3.6 data).",
"locations": []
},
{
"module": "A3",
"name": "Manufacturing",
"summary": "Assembly at Ukmergė using Lithuanian grid 373.46 g CO2e/kWh.",
"locations": [
{
"name": "Ukmergė, Lithuania",
"lat": 55.245,
"lon": 24.76,
"role": "AHU assembly"
}
]
},
{
"module": "A4",
"name": "Distribution",
"summary": "1000 km truck 16-32 t EURO6.",
"locations": []
},
{
"module": "C1-C4",
"name": "End of life",
"summary": "Demolition of 1186 kg, 50 km transport, recycling metals, incineration/landfill of rest.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Steel with Magnelis coating",
"share": 0.5245,
"source": "EPD",
"origin": null
},
{
"name": "Aluminium",
"share": 0.1345,
"source": "EPD",
"origin": null
},
{
"name": "Galvanized steel",
"share": 0.0872,
"source": "EPD",
"origin": null
},
{
"name": "Glass-fibre reinforced polyamide",
"share": 0.0694,
"source": "EPD",
"origin": null
},
{
"name": "Motor",
"share": 0.0536,
"source": "EPD",
"origin": null
},
{
"name": "Mineral insulation",
"share": 0.0357,
"source": "EPD",
"origin": null
},
{
"name": "Hydronic coil (50% Al/50% Cu)",
"share": 0.0231,
"source": "EPD",
"origin": null
},
{
"name": "PVC",
"share": 0.0206,
"source": "EPD",
"origin": null
},
{
"name": "ABS",
"share": 0.0148,
"source": "EPD",
"origin": null
},
{
"name": "Other (rubber, electronics, steel, plastics, etc.)",
"share": 0.0366,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
}
],
"duct": [
{
"title": "Lindab circular ventilation duct, folded - Lindab Safe & Safe Click",
"manufacturer": "Lindab Ventilation AB",
"programOperator": "EPD Hub",
"regNo": "HUB-1016",
"issued": "2024-01-10 (revised 2024-10-19)",
"validUntil": "2029-01-10",
"standard": "EN 15804+A2:2019, ISO 14025, EPD Hub Core PCR 1.0",
"indicator": "GWP-total",
"declaredUnit": "1 kg of circular ducts made of hot-dip galvanized steel",
"unitSize": {
"value": 1,
"unit": "kg"
},
"kgPerUnit": 1,
"rslYears": 50,
"plant": {
"name": "Lindab Grevie, Stålhögavägen 115, Sweden (average of Grevie, Boliden, Göteborg, Södertälje, Jönköping, Uppsala)",
"lat": 56.37,
"lon": 12.79
},
"landingUrl": "https://manage.epdhub.com/",
"pdfUrl": "https://itsolution.lindab.com/lindabwebproductsdoc/assets/production/MmUzNTg5YjMtYTUwZC00ODRhLWI3ZDYtNmExZDhkNDA4YjA1/5250340389655302593/EPD_HUB-1016_2024-10-25.pdf",
"verified": true,
"modules": {
"A1": 2.66,
"A2": 0.0499,
"A3": -0.108,
"A1A3": 2.61,
"A4": 0.0276,
"A5": 0.141,
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 0.00495,
"C2": 0.00376,
"C3": 0.0337,
"C4": 0.000944,
"D": -1.24
},
"moduleNotes": {
"rsl": ">50 years stated.",
"B6": "MND (passive product).",
"C": "0.1 kWh deconstruction; 40 km; 95% steel recycled, 5% landfill.",
"D": "Net 76% steel scrap credit (95% recycled minus 20% external scrap input)."
},
"dParts": [
{
"type": "recycling",
"note": "Steel net flow 76%"
},
{
"type": "reuse",
"note": "Wood packaging 66% reused"
}
],
"processes": [
{
"module": "A1",
"name": "Hot-dip galvanized steel coil",
"summary": "Purchased slit HDG steel coil (5.05% secondary content).",
"locations": []
},
{
"module": "A3",
"name": "Spiral forming",
"summary": "Coil rolled into spiral ducts on spiro machines with oil emulsion, wind electricity.",
"locations": [
{
"name": "Grevie, Sweden",
"lat": 56.37,
"lon": 12.79,
"role": "duct forming"
},
{
"name": "Göteborg, Sweden",
"lat": 57.71,
"lon": 11.97,
"role": "duct forming"
},
{
"name": "Södertälje, Sweden",
"lat": 59.2,
"lon": 17.63,
"role": "duct forming"
},
{
"name": "Jönköping, Sweden",
"lat": 57.78,
"lon": 14.16,
"role": "duct forming"
},
{
"name": "Uppsala, Sweden",
"lat": 59.86,
"lon": 17.64,
"role": "duct forming"
},
{
"name": "Boliden, Sweden",
"lat": 64.87,
"lon": 20.38,
"role": "duct forming"
}
]
},
{
"module": "A4",
"name": "Distribution",
"summary": "300 km lorry.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Hot-dip galvanized steel (metals)",
"share": 1.0,
"source": "EPD",
"origin": {
"name": "EU",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
},
{
"title": "Lindab circular ventilation duct, folded - Lindab Safe & Safe Click - recycled 75",
"manufacturer": "Lindab Ventilation AB",
"programOperator": "EPD Hub",
"regNo": "HUB-2960",
"issued": "2025-04-04",
"validUntil": "2030-04-04",
"standard": "EN 15804+A2:2019, ISO 14025, EPD Hub Core PCR 1.0",
"indicator": "GWP-total",
"declaredUnit": "1 kg of circular ducts made of hot-dip galvanized steel",
"unitSize": {
"value": 1,
"unit": "kg"
},
"kgPerUnit": 1,
"rslYears": 50,
"plant": {
"name": "Lindab Grevie, Stålhögavägen 115, Sweden (average of Grevie, Boliden, Göteborg, Södertälje, Jönköping, Uppsala)",
"lat": 56.37,
"lon": 12.79
},
"landingUrl": "https://manage.epdhub.com/declarations/metal-based-products/lindab-ventilation-ab/3563/circular-ventilation-duct-folded-lindab-safe-safe-click-recycled-75/",
"pdfUrl": "https://manage.epdhub.com/declarations/file/download/epdSigned/lang/3563/en",
"verified": true,
"modules": {
"A1": 0.947,
"A2": 0.000915,
"A3": -0.0734,
"A1A3": 0.875,
"A4": 0.0296,
"A5": 0.135,
"B1": "MND",
"B2": "MND",
"B3": "MND",
"B4": "MND",
"B5": "MND",
"B6": "MND",
"B7": "MND",
"C1": 0.00495,
"C2": 0.00469,
"C3": 0.0186,
"C4": 0.000791,
"D": -1.2
},
"moduleNotes": {
"note": "Low-carbon variant with >=75% recycled steel (secondary material input 97.8%). Not representative of 1958 ductwork; listed as alternative only."
},
"dParts": [
{
"type": "recycling",
"note": "Steel net flow 76%"
},
{
"type": "reuse",
"note": "Wood packaging 66% reused"
}
],
"processes": [
{
"module": "A1",
"name": "Hot-dip galvanized steel coil",
"summary": "Purchased slit HDG steel coil (5.05% secondary content).",
"locations": []
},
{
"module": "A3",
"name": "Spiral forming",
"summary": "Coil rolled into spiral ducts on spiro machines with oil emulsion, wind electricity.",
"locations": [
{
"name": "Grevie, Sweden",
"lat": 56.37,
"lon": 12.79,
"role": "duct forming"
},
{
"name": "Göteborg, Sweden",
"lat": 57.71,
"lon": 11.97,
"role": "duct forming"
},
{
"name": "Södertälje, Sweden",
"lat": 59.2,
"lon": 17.63,
"role": "duct forming"
},
{
"name": "Jönköping, Sweden",
"lat": 57.78,
"lon": 14.16,
"role": "duct forming"
},
{
"name": "Uppsala, Sweden",
"lat": 59.86,
"lon": 17.64,
"role": "duct forming"
},
{
"name": "Boliden, Sweden",
"lat": 64.87,
"lon": 20.38,
"role": "duct forming"
}
]
},
{
"module": "A4",
"name": "Distribution",
"summary": "300 km lorry.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Hot-dip galvanized steel (metals)",
"share": 1.0,
"source": "EPD",
"origin": {
"name": "EU",
"lat": null,
"lon": null
}
}
],
"basis": "kg"
}
],
"radiator": [
{
"title": "Compact Panel radiators (WR4, WRP4, WRH4, WRS, WRP, WRH, WRM)",
"manufacturer": "Watt Heating AB (produced in Bursa, Turkey)",
"programOperator": "EPD International AB (The International EPD System)",
"regNo": "EPD-IES-0006059:001",
"issued": "2024-12-23",
"validUntil": "2029-12-22",
"standard": "ISO 14025:2006, EN 15804:2012+A2:2019/AC:2021, PCR 2019:14 v1.3.4",
"indicator": "GWP-total",
"declaredUnit": "1 kg of compact steel panel radiator (reference WR4 22-510)",
"unitSize": {
"value": 1,
"unit": "kg",
"note": "EPD gives NO heat output; per-kg only. Heat output per kg must come from EN 442 catalogue data (not an EPD number)."
},
"kgPerUnit": 1,
"rslYears": null,
"plant": {
"name": "Contract plant, Bursa, Turkey",
"lat": 40.19,
"lon": 29.06
},
"landingUrl": "https://www.environdec.com/library/epd6059",
"pdfUrl": "https://api.environdec.com/api/v1/EPDLibrary/Files/50f88d17-1cbb-4ebd-99d2-08dd2027aaa3/Data",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 2.45,
"A4": 0.239,
"A5": 0.0289,
"B1": "ND",
"B2": "ND",
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": "ND",
"B7": "ND",
"C1": 0,
"C2": 0.000114,
"C3": 0.0209,
"C4": 0.00103,
"D": -1.32
},
"moduleNotes": {
"rsl": "'Reference service life: Not applicable'; product text states lifespan at least 50 years.",
"B": "B1-B7 ND.",
"A4": "Bursa to Eslöv 2860 km truck / 6645 km boat (50/50) + 500 km.",
"C": "50 km; steel 95% recycled, 5% landfill; powder coating incinerated.",
"D": "Steel recycling credit and energy recovery (Swedish grid, natural-gas steam)."
},
"dParts": [
{
"type": "recycling",
"note": "0.936 kg steel per kg"
},
{
"type": "energy recovery",
"note": "0.015 kg powder coating"
}
],
"processes": [
{
"module": "A3",
"name": "Pressing, welding, painting",
"summary": "Steel sheet pressed, welded, pre-treated and powder-coated, then packed; electricity and natural gas.",
"locations": [
{
"name": "Bursa, Turkey",
"lat": 40.19,
"lon": 29.06,
"role": "radiator manufacture"
}
]
},
{
"module": "A4",
"name": "Distribution",
"summary": "To Watt warehouse Eslöv, Sweden, then to site.",
"locations": [
{
"name": "Eslöv, Sweden",
"lat": 55.84,
"lon": 13.3,
"role": "warehouse"
}
]
}
],
"rawMaterials": [
{
"name": "Steel",
"share": 0.985,
"source": "EPD",
"origin": null
},
{
"name": "Powder coating",
"share": 0.015,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
},
{
"title": "Altech Panel Radiators (K11, K21, K22, K33)",
"manufacturer": "Saint-Gobain Distribution Sweden (SGDS); produced in Turkey",
"programOperator": "EPD International AB (The International EPD System)",
"regNo": "S-P-06735",
"issued": "2022-09-01",
"validUntil": "2027-08-31",
"standard": "ISO 14025, EN 15804:2012+A2:2019, PCR 2019:14 v1.11",
"indicator": "GWP-total",
"declaredUnit": "1 kg Altech panel radiator (results for K11 worst case)",
"unitSize": {
"value": 1,
"unit": "kg",
"note": "No heat output in EPD."
},
"kgPerUnit": 1,
"rslYears": 50,
"plant": {
"name": "Manufacturing plant in Turkey (city not stated)",
"lat": null,
"lon": null
},
"landingUrl": "https://www.environdec.com/library/epd6735",
"pdfUrl": "https://cdn.shopify.com/s/files/1/0517/5856/3483/files/326276410_epd_1750432095413.pdf",
"verified": true,
"modules": {
"A1": 2.9,
"A2": 0.013,
"A3": 0.03,
"A1A3": 2.9,
"A4": 0.046,
"A5": "ND",
"B1": "ND",
"B2": "ND",
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": "ND",
"B7": "ND",
"C1": 0.00034,
"C2": 0.0073,
"C3": 0.015,
"C4": 0.0021,
"D": -1.4
},
"moduleNotes": {
"rsl": "Expected service lifetime 50 years (product description).",
"D": "Steel recycling."
},
"dParts": [
{
"type": "recycling",
"note": "Steel"
}
],
"processes": [
{
"module": "A3",
"name": "Manufacture",
"summary": "FePo1 steel sheet 1.2 mm formed and powder-coated RAL9016.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Steel",
"share": 0.98,
"source": "EPD",
"origin": null
},
{
"name": "Paint",
"share": 0.016,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"pipe": [
{
"title": "Copper pipe (mixed recycled and new material)",
"manufacturer": "Mueller Europe Ltd (Wednesbury Copper Tubes)",
"programOperator": "Institut Bauen und Umwelt e.V. (IBU)",
"regNo": "EPD-MUE-20250372-CBA1-EN",
"issued": "2026-01-12",
"validUntil": "2031-01-11",
"standard": "ISO 14025, EN 15804+A2, IBU PCR Metal pipes for domestic installations (01/08/2021)",
"indicator": "GWP-total",
"declaredUnit": "1 kg copper pipe (EN 1057 plain tube, average of all diameters/wall thicknesses)",
"unitSize": {
"value": 1,
"unit": "kg"
},
"kgPerUnit": 1,
"rslYears": 50,
"plant": {
"name": "Mueller Europe, Oxford Street, Bilston WV14 7DS, UK",
"lat": 52.566,
"lon": -2.068
},
"landingUrl": "https://www.ibu-epd.com/",
"pdfUrl": "https://www.wednesburytube.com/approvals/EPD-Mueller-Europe-Ltd.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 8.7,
"A4": 0.166,
"A5": 1.57,
"B1": "MND",
"B2": "MND",
"B3": "MNR",
"B4": "MNR",
"B5": "MNR",
"B6": "MND",
"B7": "MND",
"C1": 0,
"C2": 0.00889,
"C3": 0,
"C4": 0.00331,
"D": -3.74
},
"moduleNotes": {
"A5": "Installation: 50% brazed, 50% press-fit joints; flushing water 0.324 m3/kg; brazing consumables 0.02 kg.",
"B6": "MND - no use-phase energy.",
"C": "95% recovered as scrap, 5% lost to mixed waste; C3 no processing.",
"D": "Net scrap 0.566 kg (0.95 out - 0.384 scrap in A1) credited against copper cathode."
},
"dParts": [
{
"type": "recycling",
"note": "0.566 kg net scrap copper replacing cathode"
}
],
"processes": [
{
"module": "A1",
"name": "Copper feed",
"summary": "Mix of graded scrap copper (0.384 kg/kg) and copper cathode.",
"locations": []
},
{
"module": "A3",
"name": "Tube making",
"summary": "Melting/casting, extrusion and drawing to EN 1057 tube in three tempers at Bilston.",
"locations": [
{
"name": "Bilston, West Midlands, UK",
"lat": 52.566,
"lon": -2.068,
"role": "tube mill"
}
]
},
{
"module": "A4",
"name": "Distribution",
"summary": "Road (35% articulated, 65% rigid) and sea freight to customers.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Copper (Cu-DHP)",
"share": 0.9997,
"source": "EPD",
"origin": null
},
{
"name": "Phosphorus",
"share": 0.0003,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"cable": [
{
"title": "Prysmian Low Voltage Thermoplastic Copper Building Wire (THHN/THWN-2, T90, TFFN, MTW)",
"manufacturer": "Prysmian Group (North America)",
"programOperator": "UL Solutions (PEP ecopassport PCR/PSR used)",
"regNo": "4791900506.101.1",
"issued": "2025-08-04",
"validUntil": "2030-08-04",
"standard": "ISO 14025, EN 15804+A2, PEP ecopassport PCR v4.0 (2021) + PSR Wires, Cables and Accessories v4.0 (2022)",
"indicator": "GWP-total",
"declaredUnit": "Functional unit: transmit 1 A over 1 km for 40 yr at 100% use; results shown for worst case CU THHN 750 kcmil (1 km = 3560 kg)",
"unitSize": {
"value": 1000,
"unit": "m",
"note": "1 km of 750 kcmil THHN, 3560 kg. Scale other sizes with printed factors: A1-A3 GWP factor 14 AWG solid 7.27E-03, 12 AWG solid 1.02E-02, 10 AWG solid 1.28E-02, 4/0 etc.; A4-D factors are mass-based (e.g. 12 AWG solid 1.32E-02)."
},
"kgPerUnit": 3560,
"rslYears": 40,
"plant": {
"name": "Five Prysmian building-wire plants in the U.S. (not named); HQ 4 Tesseneer Rd, Highland Heights KY",
"lat": 39.03,
"lon": -84.45
},
"landingUrl": "https://na.prysmian.com/",
"pdfUrl": "https://na.prysmian.com/sites/na.prysmian.com/files/2025-08/EPD-Prysmian-Low-Voltage-Thermoplastic-Copper-Building-Wire.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 14400.0,
"A4": 266.0,
"A5": 1290.0,
"B1": "ND",
"B2": "ND",
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": 2.84,
"B7": "ND",
"C1": "ND",
"C2": 1.47e-07,
"C3": 325.0,
"C4": 19.8,
"D": -3650.0
},
"moduleNotes": {
"B6": "Joule losses at 1 A for 40 yr: 6.17 kWh per FU; scale by amperage squared and the printed per-size B6 factor (e.g. 14 AWG 1.49E+02). Exclude; compute separately.",
"B1-B5,B7,C1": "Not shown in results table (no maintenance/cleaning; treated as not applicable).",
"C": "Copper 60% recycling per PEP PCR; rest incinerated/landfilled.",
"D": "Copper recycling benefit.",
"A1A3": "GWP-total table row; GWP-fossil A1-A3 1.43E+04."
},
"dParts": [
{
"type": "recycling",
"note": "Copper conductor, 60% recycling rate"
}
],
"processes": [
{
"module": "A3",
"name": "Wire manufacture",
"summary": "Copper rod drawn (or bought pre-drawn), stranded/annealed, PVC insulation and nylon jacket extruded, reeled.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Copper conductor",
"share": 0.92,
"source": "EPD",
"origin": null
},
{
"name": "Insulation (PVC + nylon)",
"share": 0.074,
"source": "EPD",
"origin": null
},
{
"name": "Other",
"share": 0.006,
"source": "EPD",
"origin": null
}
],
"basis": "kg"
}
],
"water-heater": [
{
"title": "SAGA 2.0 S 200 water heater",
"manufacturer": "OSO Hotwater AS",
"programOperator": "EPD International AB (The International EPD System)",
"regNo": "EPD-IES-0024660",
"issued": "2025-06-20",
"validUntil": "2030-06-19",
"standard": "EN 15804+A2, ISO 14025, PCR 2019:14 v1.3.4 (EEE construction products)",
"indicator": "GWP-total",
"declaredUnit": "1 hot water tank, 190 L nominal volume (stainless steel, 2.8 kW electric element)",
"unitSize": {
"value": 1,
"unit": "ea"
},
"kgPerUnit": 34,
"rslYears": 17,
"plant": {
"name": "OSO Hotwater, Industriveien 1, Hokksund, Norway",
"lat": 59.77,
"lon": 9.91
},
"landingUrl": "https://www.environdec.com/library/epd24660",
"pdfUrl": "https://res.cloudinary.com/dahlzxcv/image/upload/v1755608768/akeneo-assets/saga-s2-200_water-heater_oso_hotwater_epd.pdf",
"verified": true,
"modules": {
"A1": null,
"A2": null,
"A3": null,
"A1A3": 104.0,
"A4": 2.36,
"A5": 13.2,
"B1": 0,
"B2": 0,
"B3": 0,
"B4": 0,
"B5": 0,
"B6": 1800.0,
"B7": 198.0,
"C1": 0,
"C2": 1.21,
"C3": 13.7,
"C4": 3.68,
"D": -10.9
},
"moduleNotes": {
"fit": "Electric domestic storage heater, not a steam-heated indirect commercial tank; no EPD for a steam/indirect commercial tank was found. Use tank body (A1-A3, C) only; per-litre scaling is an approximation.",
"B6": "75,004 kWh over 17 yr (EN 50440 / ErP), Norway low-voltage mix. Annex 4 EU scenario B6 2.47E+04, Annex 5 Canada B6 2.24E+04. Exclude; compute separately.",
"B7": "657,730 L water over 17 yr.",
"A5": "Packaging waste; biogenic CO2 release from packaging.",
"D": "Recycling of steel/brass/plastics and energy recovery (16.9 MJ electricity substituted)."
},
"dParts": [
{
"type": "recycling",
"note": "Steel, brass, plastics"
},
{
"type": "energy recovery",
"note": "Packaging/plastics incineration"
}
],
"processes": [
{
"module": "A3",
"name": "Welding and assembly",
"summary": "Stainless pressure vessel welded, PU-insulated and assembled in Norway on 100% renewable electricity (0.0061 kg CO2e/kWh).",
"locations": [
{
"name": "Hokksund, Norway",
"lat": 59.77,
"lon": 9.91,
"role": "manufacture"
}
]
}
],
"rawMaterials": [
{
"name": "Steel (stainless vessel + casing)",
"share": 0.72,
"source": "EPD",
"origin": {
"name": "Europe",
"lat": null,
"lon": null
}
},
{
"name": "Insulation (PU)",
"share": 0.129,
"source": "EPD",
"origin": null
},
{
"name": "Plastics",
"share": 0.115,
"source": "EPD",
"origin": null
},
{
"name": "Brass",
"share": 0.024,
"source": "EPD",
"origin": null
},
{
"name": "Electro materials",
"share": 0.015,
"source": "EPD",
"origin": null
},
{
"name": "Adhesive",
"share": 0.002,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
}
],
"pump": [
{
"title": "MAGNA3 65-150 (Stainless Steel) circulator pump",
"manufacturer": "Grundfos Holding A/S",
"programOperator": "Institut Bauen und Umwelt e.V. (IBU)",
"regNo": "EPD-GRU-20240019-CBA1-EN",
"issued": "2024-03-21",
"validUntil": "2029-03-20",
"standard": "ISO 14025, EN 15804+A2, IBU PCR Pumps for liquids (01/08/2021)",
"indicator": "GWP-total",
"declaredUnit": "1 pcs MAGNA3 65-150 circulator, flow 42.5 m3/h, head max 15 m, P1 0.562 kW",
"unitSize": {
"value": 1,
"unit": "ea",
"powerKW": 0.562,
"headM": 15
},
"kgPerUnit": 27.24,
"rslYears": 10,
"plant": {
"name": "Grundfos Wahlstedt, Germany",
"lat": 53.95,
"lon": 10.21
},
"landingUrl": "https://www.ibu-epd.com/",
"pdfUrl": "https://cdn.byggtjeneste.no/nobb/90bff7f6-a255-425a-b5d9-ae44f9bc97a1",
"verified": true,
"modules": {
"A1": 155.0,
"A2": 6.06,
"A3": 0.737,
"A1A3": 161.797,
"A4": 2.09,
"A5": 3.18,
"B1": 0,
"B2": 0,
"B3": "MNR",
"B4": "MNR",
"B5": "MNR",
"B6": 914.0,
"B7": 0,
"C1": 0,
"C2": 0.866,
"C3": 6.52,
"C4": 0.16,
"D": -40.0
},
"moduleNotes": {
"A1A3": "Sum of printed A1+A2+A3.",
"B6": "PER YEAR (not lifetime): 2,810 kWh/a = 0.562 kW x 5,000 h/a, EU-average grid. Multiply by years for lifetime. Exclude; compute separately.",
"rsl": "Estimated 10 yr (EU Lot 11 consensus); not a declared scenario.",
"C": "90% collection; metals recycled, plastics/electronics incinerated with energy recovery, 3.26 kg landfilled; 500 km.",
"D": "Net stainless 12.5 kg, copper 0.45 kg recycling credits; energy from incineration (A5, C3)."
},
"dParts": [
{
"type": "recycling",
"note": "Stainless steel 12.5 kg net, copper 0.45 kg net (steel/aluminium net negative)"
},
{
"type": "energy recovery",
"note": "Thermal/electric energy from incineration of packaging and plastics/electronics"
}
],
"processes": [
{
"module": "A1-A3",
"name": "Pump production",
"summary": "Components from external suppliers and other Grundfos sites, final assembly at Wahlstedt (ISO 14001/50001), 2021 data.",
"locations": [
{
"name": "Wahlstedt, Germany",
"lat": 53.95,
"lon": 10.21,
"role": "final assembly"
},
{
"name": "Bjerringbro, Denmark",
"lat": 56.38,
"lon": 9.66,
"role": "Grundfos component site/HQ"
}
]
},
{
"module": "A4",
"name": "Distribution",
"summary": "2003 km truck.",
"locations": []
}
],
"rawMaterials": [
{
"name": "Stainless steel",
"share": 0.5345,
"source": "EPD",
"origin": null
},
{
"name": "Aluminium",
"share": 0.1407,
"source": "EPD",
"origin": null
},
{
"name": "Steel",
"share": 0.1048,
"source": "EPD",
"origin": null
},
{
"name": "Cardboard (packaging)",
"share": 0.0676,
"source": "EPD",
"origin": null
},
{
"name": "Copper",
"share": 0.0437,
"source": "EPD",
"origin": null
},
{
"name": "Plastics GF",
"share": 0.0436,
"source": "EPD",
"origin": null
},
{
"name": "PCB",
"share": 0.0316,
"source": "EPD",
"origin": null
},
{
"name": "Plastics foam",
"share": 0.0104,
"source": "EPD",
"origin": null
},
{
"name": "Nd magnet",
"share": 0.0092,
"source": "EPD",
"origin": null
},
{
"name": "Other (paper, plastics, ceramics, electronics, rubber, film)",
"share": 0.0139,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
}
],
"light": [
{
"title": "Siella G9 recessed LED luminaire (ref. Siella G9 M84 PW19 34-46/4ML-840 ETDD)",
"manufacturer": "TRILUX GmbH & Co. KG",
"programOperator": "PEP ecopassport (P.E.P. Association)",
"regNo": "TRLX-00020-V01.01-EN",
"issued": "2025-08",
"validUntil": "2030-08 (5 years)",
"standard": "PEP PCR-ed4-EN-2021 09 06 + PSR-0014-ed2.0-EN-2023 07 13, EN 50693:2019, ISO 14025 (EN 15804-aligned indicators)",
"indicator": "GWP-total",
"declaredUnit": "1 luminaire (per unit of product): 620x620 mm recessed panel, 4600 lm, 29.5 W, 70,000 h lifetime",
"unitSize": {
"value": 1,
"unit": "ea",
"powerW": 29.5,
"lifetimeH": 70000
},
"kgPerUnit": 2.201,
"rslYears": 28,
"plant": {
"name": "Contract manufacturer in China (city not stated); TRILUX HQ Arnsberg, Germany",
"lat": null,
"lon": null
},
"landingUrl": "http://www.pep-ecopassport.org/",
"pdfUrl": "https://www.trilux.com/fileadmin/Downloads/EPD/TRLX-00020-V01.01-EN_Siella_G9.pdf",
"verified": true,
"modules": {
"A1": 21.6,
"A2": 0.355,
"A3": 0.243,
"A1A3": 22.198,
"A4": 0.962,
"A5": 0.197,
"B1": "ND",
"B2": "ND",
"B3": "ND",
"B4": "ND",
"B5": "ND",
"B6": 327.0,
"B7": "ND",
"C1": 0.699,
"C2": 0.233,
"C3": 2.37,
"C4": 0.101,
"D": -9.47
},
"moduleNotes": {
"A1A3": "Sum of printed A1+A2+A3; table Total (A-C) = 3.54E+02.",
"rsl": "Lifetime 70,000 h = 28 yr at 2,500 h/yr office default (PSR); PEP model uses 14 yr.",
"B6": "70,000 h at 29.5 W with energy-saving coefficient 0.5 (DALI dimming); EU mix (DE 50%, FR 33%, others). Exclude; compute separately.",
"B1-B5,B7": "Not printed; PEP states no maintenance, no light-source replacement, no water.",
"C": "1000 km lorry; WEEE recycling rates; rest landfilled.",
"D": "Net benefits from recycling 2.054 kg product + packaging, reuse of 0.206 kg plywood packaging."
},
"dParts": [
{
"type": "recycling",
"note": "2.054 kg product (60% metals, 29% plastics) + 0.620 kg packaging"
},
{
"type": "reuse",
"note": "0.206 kg packaging"
},
{
"type": "energy recovery",
"note": "0.015 kg product incinerated"
}
],
"processes": [
{
"module": "A1-A3",
"name": "Manufacture",
"summary": "Parts bought in; PCBA by SMT/through-hole, assembly and test in China.",
"locations": []
},
{
"module": "A4",
"name": "Distribution",
"summary": "Ship 19,000 km + lorry 1000 km to Europe.",
"locations": [
{
"name": "Arnsberg, Germany (TRILUX)",
"lat": 51.4,
"lon": 8.06,
"role": "brand owner"
}
]
}
],
"rawMaterials": [
{
"name": "Metals",
"share": 0.5651,
"source": "EPD",
"origin": null
},
{
"name": "Plastics",
"share": 0.3466,
"source": "EPD",
"origin": null
},
{
"name": "Others",
"share": 0.0883,
"source": "EPD",
"origin": null
}
],
"basis": "unit"
}
]
};
