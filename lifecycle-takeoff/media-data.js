// Lifecycle Takeoff · photographs from Wikimedia Commons (CC0, public domain, CC BY, CC BY-SA), hosted locally so they
// load reliably (Wikimedia rate-limits hotlinked thumbnails). `src` is the original Commons file; `page`, author and licence give credit.
export const MEDIA = {
"processes": {
"iron-ore-mine": {
"img": "./img/processes-iron-ore-mine.jpg",
"page": "https://commons.wikimedia.org/wiki/File:2025-01-18_Hull-Rust-Mahoning_Open_Pit_Iron_Mine.jpg",
"author": "Minnesota Historical Society Heritage Preservation Department",
"license": "CC BY 4.0",
"summary": "Iron-bearing rock (hematite, magnetite, taconite) is blasted, hauled and crushed, then often concentrated and pelletised.",
"emissions": "Diesel haul trucks and blasting; pelletising furnaces burn natural gas or coal.",
"locations": [
{
"name": "Mesabi Range (Hibbing Taconite), Minnesota",
"country": "USA",
"lat": 47.43,
"lon": -92.94
},
{
"name": "Pilbara (Mount Whaleback, Newman)",
"country": "Australia",
"lat": -23.36,
"lon": 119.67
},
{
"name": "Carajás (Serra Norte)",
"country": "Brazil",
"lat": -6.07,
"lon": -50.17
},
{
"name": "Kiruna",
"country": "Sweden",
"lat": 67.83,
"lon": 20.2
},
{
"name": "Labrador Trough (Labrador City)",
"country": "Canada",
"lat": 52.95,
"lon": -66.91
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/2025-01-18_Hull-Rust-Mahoning_Open_Pit_Iron_Mine.jpg/500px-2025-01-18_Hull-Rust-Mahoning_Open_Pit_Iron_Mine.jpg"
},
"coal-mine": {
"img": "./img/processes-coal-mine.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Coal_is_Transported,_Maramarua_Open_Cast_Coal_Mine,_1966.jpg",
"author": "Photographer: Unknown",
"license": "CC BY 2.0",
"summary": "Metallurgical (coking) coal is mined underground or by surface stripping, washed, and shipped to coke ovens for steelmaking.",
"emissions": "Methane released from coal seams, plus diesel and electricity for mining equipment.",
"locations": [
{
"name": "Bowen Basin (Moranbah), Queensland",
"country": "Australia",
"lat": -22.0,
"lon": 148.05
},
{
"name": "Buchanan / Central Appalachia, Virginia",
"country": "USA",
"lat": 37.25,
"lon": -81.95
},
{
"name": "Warrior Met Coal, Brookwood, Alabama",
"country": "USA",
"lat": 33.26,
"lon": -87.32
},
{
"name": "Elk Valley, British Columbia",
"country": "Canada",
"lat": 49.8,
"lon": -114.88
},
{
"name": "Pocahontas coalfield, West Virginia",
"country": "USA",
"lat": 37.4,
"lon": -81.5
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/1/17/Coal_is_Transported%2C_Maramarua_Open_Cast_Coal_Mine%2C_1966.jpg"
},
"blast-furnace": {
"img": "./img/processes-blast-furnace.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Blast_furnaces_at_Scunthorpe_Steelworks_-_geograph.org.uk_-_5844975.jpg",
"author": "Gareth James",
"license": "CC BY-SA 2.0",
"summary": "Iron ore, coke and limestone are charged into a tall furnace where hot air turns the ore into molten pig iron.",
"emissions": "Burning coke (carbon) to reduce iron oxide releases large amounts of CO2; the single biggest source in primary steel.",
"locations": [
{
"name": "Gary Works (U.S. Steel), Indiana",
"country": "USA",
"lat": 41.61,
"lon": -87.33
},
{
"name": "Burns Harbor (Cleveland-Cliffs), Indiana",
"country": "USA",
"lat": 41.63,
"lon": -87.13
},
{
"name": "Indiana Harbor (Cleveland-Cliffs), East Chicago",
"country": "USA",
"lat": 41.68,
"lon": -87.44
},
{
"name": "IJmuiden (Tata Steel)",
"country": "Netherlands",
"lat": 52.48,
"lon": 4.6
},
{
"name": "Baowu Baoshan, Shanghai",
"country": "China",
"lat": 31.42,
"lon": 121.43
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Blast_furnaces_at_Scunthorpe_Steelworks_-_geograph.org.uk_-_5844975.jpg/500px-Blast_furnaces_at_Scunthorpe_Steelworks_-_geograph.org.uk_-_5844975.jpg"
},
"bof": {
"img": "./img/processes-bof.png",
"page": "https://commons.wikimedia.org/wiki/File:LD_converter_operation_Steel_taping.png",
"author": "European Commission, European Coal and Steel Community",
"license": "CC BY-SA 4.0",
"summary": "Molten pig iron and some scrap are blown with pure oxygen to burn off carbon and make liquid steel.",
"emissions": "Carbon in the hot metal oxidised to CO/CO2, plus emissions embedded in the blast-furnace iron feeding it.",
"locations": [
{
"name": "Gary Works, Indiana",
"country": "USA",
"lat": 41.61,
"lon": -87.33
},
{
"name": "Burns Harbor, Indiana",
"country": "USA",
"lat": 41.63,
"lon": -87.13
},
{
"name": "Mon Valley Works (Edgar Thomson), Pennsylvania",
"country": "USA",
"lat": 40.39,
"lon": -79.86
},
{
"name": "POSCO Pohang",
"country": "South Korea",
"lat": 36.01,
"lon": 129.38
},
{
"name": "Nippon Steel Kimitsu",
"country": "Japan",
"lat": 35.33,
"lon": 139.87
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/7/7d/LD_converter_operation_Steel_taping.png"
},
"eaf": {
"img": "./img/processes-eaf.jpg",
"page": "https://commons.wikimedia.org/wiki/File:ECSC_Financial_report_1996_ProfilARBED_Differdange_Electric_arc_furnace_1.jpg",
"author": "European Coal and Steel Community",
"license": "CC BY-SA 4.0",
"summary": "Scrap steel (and sometimes DRI) is melted with powerful electric arcs from graphite electrodes to make new steel.",
"emissions": "Electricity generation (grid-dependent), plus natural gas burners, electrode consumption and charge carbon.",
"locations": [
{
"name": "Nucor-Yamato Steel, Blytheville, Arkansas",
"country": "USA",
"lat": 35.89,
"lon": -89.84
},
{
"name": "Steel Dynamics Structural & Rail, Columbia City, Indiana",
"country": "USA",
"lat": 41.15,
"lon": -85.45
},
{
"name": "Gerdau Midlothian, Texas",
"country": "USA",
"lat": 32.46,
"lon": -96.99
},
{
"name": "Nucor Steel Berkeley, South Carolina",
"country": "USA",
"lat": 33.05,
"lon": -79.95
},
{
"name": "Gerdau Petersburg, Virginia",
"country": "USA",
"lat": 37.23,
"lon": -77.38
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/ECSC_Financial_report_1996_ProfilARBED_Differdange_Electric_arc_furnace_1.jpg/500px-ECSC_Financial_report_1996_ProfilARBED_Differdange_Electric_arc_furnace_1.jpg"
},
"scrap-yard": {
"img": "./img/processes-scrap-yard.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Metal_recycling_at_the_EMR_scrap_yard,_Gipsy_Lane_-_geograph.org.uk_-_2797510.jpg",
"author": "Vieve Forward",
"license": "CC BY-SA 2.0",
"summary": "Obsolete and manufacturing steel scrap is collected, sorted, sheared and baled for melting at mills.",
"emissions": "Diesel for handling equipment and trucks; low overall.",
"locations": [
{
"name": "Sims Metal, Jersey City, New Jersey",
"country": "USA",
"lat": 40.7,
"lon": -74.07
},
{
"name": "Schnitzer/Radius Recycling, Portland, Oregon",
"country": "USA",
"lat": 45.6,
"lon": -122.73
},
{
"name": "OmniSource, Fort Wayne, Indiana",
"country": "USA",
"lat": 41.08,
"lon": -85.14
},
{
"name": "EMR, Liverpool",
"country": "United Kingdom",
"lat": 53.45,
"lon": -2.99
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Metal_recycling_at_the_EMR_scrap_yard%2C_Gipsy_Lane_-_geograph.org.uk_-_2797510.jpg/500px-Metal_recycling_at_the_EMR_scrap_yard%2C_Gipsy_Lane_-_geograph.org.uk_-_2797510.jpg"
},
"hot-rolling": {
"img": "./img/processes-hot-rolling.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Teesside_Beam_Mill_-_geograph.org.uk_-_1730600.jpg",
"author": "Alan Murray-Rust",
"license": "CC BY-SA 2.0",
"summary": "Hot steel blooms or beam blanks are passed repeatedly through shaped rolls to form wide-flange beams and other sections.",
"emissions": "Natural gas burned in reheat furnaces plus electricity for the mill drives.",
"locations": [
{
"name": "Nucor-Yamato Steel, Blytheville, Arkansas",
"country": "USA",
"lat": 35.89,
"lon": -89.84
},
{
"name": "SDI Columbia City, Indiana",
"country": "USA",
"lat": 41.15,
"lon": -85.45
},
{
"name": "Gerdau Petersburg, Virginia",
"country": "USA",
"lat": 37.23,
"lon": -77.38
},
{
"name": "Gerdau Cartersville, Georgia",
"country": "USA",
"lat": 34.2,
"lon": -84.83
},
{
"name": "ArcelorMittal Differdange",
"country": "Luxembourg",
"lat": 49.52,
"lon": 5.89
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Teesside_Beam_Mill_-_geograph.org.uk_-_1730600.jpg/500px-Teesside_Beam_Mill_-_geograph.org.uk_-_1730600.jpg"
},
"galvanizing-line": {
"img": "./img/processes-galvanizing-line.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Sumgayit_Technologies_Park_-_hot-dip_galvanization_01.jpg",
"author": "Wertuose",
"license": "CC BY-SA 4.0",
"summary": "Steel sheet or parts are cleaned and dipped in molten zinc to coat them against corrosion.",
"emissions": "Natural gas to heat the zinc bath and annealing furnace, plus embodied zinc.",
"locations": [
{
"name": "Nucor Steel Gallatin, Kentucky",
"country": "USA",
"lat": 38.73,
"lon": -84.95
},
{
"name": "Steel Dynamics Butler, Indiana",
"country": "USA",
"lat": 41.43,
"lon": -84.88
},
{
"name": "AZZ Galvanizing, Houston, Texas",
"country": "USA",
"lat": 29.76,
"lon": -95.37
},
{
"name": "Cleveland-Cliffs Columbus, Ohio",
"country": "USA",
"lat": 39.95,
"lon": -83.0
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Sumgayit_Technologies_Park_-_hot-dip_galvanization_01.jpg/500px-Sumgayit_Technologies_Park_-_hot-dip_galvanization_01.jpg"
},
"roll-forming": {
"img": "./img/processes-roll-forming.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Highway_Guardrail_Roll_Forming_Machine.jpg",
"author": "Maxontony",
"license": "CC BY-SA 4.0",
"summary": "Thin galvanized coil is fed through a series of roller stands that bend it cold into studs, tracks or deck profiles.",
"emissions": "Electricity for the line; nearly all impact is embodied in the coated coil.",
"locations": [
{
"name": "ClarkDietrich, Warren, Ohio",
"country": "USA",
"lat": 41.24,
"lon": -80.82
},
{
"name": "CEMCO, City of Industry, California",
"country": "USA",
"lat": 34.02,
"lon": -117.96
},
{
"name": "Vulcraft/Verco deck, Grapeland, Texas",
"country": "USA",
"lat": 31.49,
"lon": -95.48
},
{
"name": "New Millennium, Butler, Indiana",
"country": "USA",
"lat": 41.43,
"lon": -84.88
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Highway_Guardrail_Roll_Forming_Machine.jpg/500px-Highway_Guardrail_Roll_Forming_Machine.jpg"
},
"rebar-mill": {
"img": "./img/processes-rebar-mill.jpg",
"page": "https://commons.wikimedia.org/wiki/File:A_bunch_of_rebar_up_close.jpg",
"author": "W.carter",
"license": "CC BY-SA 4.0",
"summary": "Scrap-based steel billets are reheated and rolled into ribbed reinforcing bar, usually at EAF mini-mills.",
"emissions": "Electricity for melting and reheat-furnace natural gas.",
"locations": [
{
"name": "CMC Steel Texas, Seguin",
"country": "USA",
"lat": 29.57,
"lon": -97.96
},
{
"name": "Nucor Steel Marion, Ohio",
"country": "USA",
"lat": 40.59,
"lon": -83.13
},
{
"name": "Gerdau Jacksonville, Florida",
"country": "USA",
"lat": 30.38,
"lon": -81.62
},
{
"name": "CMC Mesa (micro mill), Arizona",
"country": "USA",
"lat": 33.42,
"lon": -111.63
},
{
"name": "Nucor Auburn, New York",
"country": "USA",
"lat": 42.93,
"lon": -76.57
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/A_bunch_of_rebar_up_close.jpg/500px-A_bunch_of_rebar_up_close.jpg"
},
"copper-mine": {
"img": "./img/processes-copper-mine.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Bingham_Canyon_Mine_(1)_-_Salt_Lake_County,_Utah_-_May_11,_2012.jpg",
"author": "David Ratledge",
"license": "CC BY 4.0",
"summary": "Copper sulphide ore is blasted from huge open pits, crushed, ground and floated into a concentrate of ~25-30% copper.",
"emissions": "Diesel haul trucks and large electricity demand for grinding; low ore grades mean lots of rock moved.",
"locations": [
{
"name": "Bingham Canyon (Kennecott), Utah",
"country": "USA",
"lat": 40.52,
"lon": -112.15
},
{
"name": "Morenci, Arizona",
"country": "USA",
"lat": 33.08,
"lon": -109.36
},
{
"name": "Escondida",
"country": "Chile",
"lat": -24.27,
"lon": -69.07
},
{
"name": "Chuquicamata",
"country": "Chile",
"lat": -22.29,
"lon": -68.9
},
{
"name": "Grasberg",
"country": "Indonesia",
"lat": -4.05,
"lon": 137.11
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Bingham_Canyon_Mine_%281%29_-_Salt_Lake_County%2C_Utah_-_May_11%2C_2012.jpg/500px-Bingham_Canyon_Mine_%281%29_-_Salt_Lake_County%2C_Utah_-_May_11%2C_2012.jpg"
},
"copper-smelter": {
"img": "./img/processes-copper-smelter.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Magna_smelter_UT1.jpg",
"author": "Acroterion",
"license": "CC BY-SA 4.0",
"summary": "Copper concentrate is melted and oxidised to remove sulphur and iron, then refined electrolytically to 99.99% cathode.",
"emissions": "Fuel and electricity for smelting and refining; sulphur dioxide is captured as sulphuric acid.",
"locations": [
{
"name": "Kennecott Smelter, Magna, Utah",
"country": "USA",
"lat": 40.71,
"lon": -112.12
},
{
"name": "Freeport Miami Smelter, Claypool, Arizona",
"country": "USA",
"lat": 33.41,
"lon": -110.84
},
{
"name": "Chuquicamata smelter",
"country": "Chile",
"lat": -22.31,
"lon": -68.91
},
{
"name": "Aurubis Hamburg",
"country": "Germany",
"lat": 53.52,
"lon": 10.02
},
{
"name": "Asarco Hayden, Arizona (idled)",
"country": "USA",
"lat": 33.0,
"lon": -110.78
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Magna_smelter_UT1.jpg/500px-Magna_smelter_UT1.jpg"
},
"brass-casting": {
"img": "./img/processes-brass-casting.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Al_extrusion_machine_with_dies.jpg",
"author": "Swoolverton",
"license": "CC BY-SA 3.0",
"summary": "Copper is alloyed with zinc (plus a little lead or tin) and cast into billets that are hot-extruded into architectural bronze/brass shapes.",
"emissions": "Electricity or gas for melting furnaces and extrusion presses, plus embodied copper and zinc.",
"locations": [
{
"name": "General Bronze Corp. (historic, Seagram bronze), Garden City, New York",
"country": "USA",
"lat": 40.73,
"lon": -73.63
},
{
"name": "Mueller Brass, Port Huron, Michigan",
"country": "USA",
"lat": 42.97,
"lon": -82.42
},
{
"name": "Chase Brass, Montpelier, Ohio",
"country": "USA",
"lat": 41.58,
"lon": -84.61
},
{
"name": "Wieland, East Alton, Illinois",
"country": "USA",
"lat": 38.88,
"lon": -90.11
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Al_extrusion_machine_with_dies.jpg/500px-Al_extrusion_machine_with_dies.jpg"
},
"bauxite-mine": {
"img": "./img/processes-bauxite-mine.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Otranto_-_Cava_di_bauxite_-_1.jpg",
"author": "Benjamin Smith",
"license": "CC BY-SA 4.0",
"summary": "Bauxite, a red aluminium-rich laterite clay, is strip-mined near the surface and shipped to refineries.",
"emissions": "Diesel for excavation and haulage; land clearing.",
"locations": [
{
"name": "Weipa, Queensland",
"country": "Australia",
"lat": -12.67,
"lon": 141.87
},
{
"name": "Boké / Sangarédi",
"country": "Guinea",
"lat": 11.12,
"lon": -13.8
},
{
"name": "Huntly, Western Australia",
"country": "Australia",
"lat": -32.6,
"lon": 116.1
},
{
"name": "Porto Trombetas, Pará",
"country": "Brazil",
"lat": -1.47,
"lon": -56.38
},
{
"name": "Jamaica (St Ann)",
"country": "Jamaica",
"lat": 18.4,
"lon": -77.2
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Otranto_-_Cava_di_bauxite_-_1.jpg/500px-Otranto_-_Cava_di_bauxite_-_1.jpg"
},
"alumina-refinery": {
"img": "./img/processes-alumina-refinery.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Qld_Alumina_Refinery_QAL_2008.jpg",
"author": "Vicki Nunn",
"license": "Public domain",
"summary": "Bauxite is digested in hot caustic soda (Bayer process) and the alumina is precipitated and calcined into white powder.",
"emissions": "Fossil fuel (gas, coal, oil) for steam and high-temperature calcination; red mud residue.",
"locations": [
{
"name": "Pinjarra (Alcoa), Western Australia",
"country": "Australia",
"lat": -32.66,
"lon": 115.93
},
{
"name": "Gladstone (QAL), Queensland",
"country": "Australia",
"lat": -23.85,
"lon": 151.25
},
{
"name": "Alunorte, Barcarena",
"country": "Brazil",
"lat": -1.53,
"lon": -48.73
},
{
"name": "Gramercy, Louisiana",
"country": "USA",
"lat": 30.05,
"lon": -90.69
},
{
"name": "Point Comfort (historic), Texas",
"country": "USA",
"lat": 28.64,
"lon": -96.56
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Qld_Alumina_Refinery_QAL_2008.jpg/500px-Qld_Alumina_Refinery_QAL_2008.jpg"
},
"aluminium-smelter": {
"img": "./img/processes-aluminium-smelter.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Straumsvik-aluminum-smelter-iceland.jpg",
"author": "Jabbi",
"license": "CC0",
"summary": "Alumina is dissolved in molten cryolite and split by huge electric currents in rows of cells (potlines) to make liquid aluminium.",
"emissions": "Electricity (very large; coal power is worst, hydro best), plus CO2 from consumed carbon anodes and PFC gases.",
"locations": [
{
"name": "Alcoa Massena West, New York",
"country": "USA",
"lat": 44.95,
"lon": -74.86
},
{
"name": "Century Mt. Holly, South Carolina",
"country": "USA",
"lat": 33.03,
"lon": -80.07
},
{
"name": "Alcoa Deschambault, Québec",
"country": "Canada",
"lat": 46.67,
"lon": -71.9
},
{
"name": "Rio Tinto Kitimat, British Columbia",
"country": "Canada",
"lat": 54.01,
"lon": -128.7
},
{
"name": "EGA Jebel Ali",
"country": "United Arab Emirates",
"lat": 24.98,
"lon": 55.06
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Straumsvik-aluminum-smelter-iceland.jpg/500px-Straumsvik-aluminum-smelter-iceland.jpg"
},
"aluminium-extrusion": {
"img": "./img/processes-aluminium-extrusion.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Al_extrusion_blanks.jpg",
"author": "Swoolverton",
"license": "CC BY-SA 3.0",
"summary": "Aluminium billets are heated and pushed through a steel die to form curtain-wall mullions and window profiles, then anodised or painted.",
"emissions": "Natural gas for billet heating and finishing, plus electricity; most impact is embodied in primary metal.",
"locations": [
{
"name": "Hydro Extrusion, Cressona, Pennsylvania",
"country": "USA",
"lat": 40.63,
"lon": -76.19
},
{
"name": "Kawneer/Arconic, Springdale, Arkansas",
"country": "USA",
"lat": 36.19,
"lon": -94.13
},
{
"name": "Bonnell Aluminum, Newnan, Georgia",
"country": "USA",
"lat": 33.38,
"lon": -84.8
},
{
"name": "Tecnoglass, Barranquilla",
"country": "Colombia",
"lat": 10.97,
"lon": -74.8
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Al_extrusion_blanks.jpg/500px-Al_extrusion_blanks.jpg"
},
"limestone-quarry": {
"img": "./img/processes-limestone-quarry.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Limestone_quarry.jpg",
"author": "Thomas Bjørkan",
"license": "CC BY-SA 3.0",
"summary": "Limestone is blasted from benches, crushed and sent to cement kilns, lime kilns, or used as aggregate and flux.",
"emissions": "Diesel for blasting, loaders and haul trucks.",
"locations": [
{
"name": "Michigan Limestone (Rogers City / Calcite), Michigan",
"country": "USA",
"lat": 45.4,
"lon": -83.8
},
{
"name": "Thornton Quarry, Illinois",
"country": "USA",
"lat": 41.57,
"lon": -87.6
},
{
"name": "Bedford/Oolitic limestone, Indiana",
"country": "USA",
"lat": 38.87,
"lon": -86.49
},
{
"name": "Ravena, New York (Lafarge)",
"country": "USA",
"lat": 42.48,
"lon": -73.81
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Limestone_quarry.jpg/500px-Limestone_quarry.jpg"
},
"cement-kiln": {
"img": "./img/processes-cement-kiln.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Cement_kiln_in_Gorazdze_Cement_plant.JPG",
"author": "Jb957",
"license": "CC0",
"summary": "Limestone and clay are heated to ~1450 C in a rotary kiln to make clinker, which is ground with gypsum into cement.",
"emissions": "Limestone calcination (CaCO3 to CaO + CO2, about 60%) plus fuel combustion for the kiln.",
"locations": [
{
"name": "Holcim Ste. Genevieve, Missouri",
"country": "USA",
"lat": 37.98,
"lon": -90.04
},
{
"name": "Lafarge Ravena, New York",
"country": "USA",
"lat": 42.48,
"lon": -73.81
},
{
"name": "Cemex Balcones, New Braunfels, Texas",
"country": "USA",
"lat": 29.75,
"lon": -98.14
},
{
"name": "Lehigh Union Bridge, Maryland",
"country": "USA",
"lat": 39.57,
"lon": -77.18
},
{
"name": "Argos Harleyville, South Carolina",
"country": "USA",
"lat": 33.21,
"lon": -80.45
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Cement_kiln_in_Gorazdze_Cement_plant.JPG/500px-Cement_kiln_in_Gorazdze_Cement_plant.JPG"
},
"aggregate-quarry": {
"img": "./img/processes-aggregate-quarry.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Aggregate_heaps,_sand_and_gravel_quarry,_North_Cave_-_geograph.org.uk_-_8287208.jpg",
"author": "Christine Johnstone",
"license": "CC BY-SA 2.0",
"summary": "Sand, gravel and crushed rock are dug or blasted, crushed, washed and screened into sizes for concrete and road base.",
"emissions": "Diesel for excavation, crushing plants and trucking.",
"locations": [
{
"name": "Vulcan Materials, Hanover / Palisades, New Jersey",
"country": "USA",
"lat": 40.85,
"lon": -74.4
},
{
"name": "Tilcon Mount Hope, New Jersey",
"country": "USA",
"lat": 40.92,
"lon": -74.55
},
{
"name": "Martin Marietta, Texas",
"country": "USA",
"lat": 30.5,
"lon": -97.7
},
{
"name": "Vulcan Quinta, Calica, Quintana Roo",
"country": "Mexico",
"lat": 20.6,
"lon": -87.1
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Aggregate_heaps%2C_sand_and_gravel_quarry%2C_North_Cave_-_geograph.org.uk_-_8287208.jpg/500px-Aggregate_heaps%2C_sand_and_gravel_quarry%2C_North_Cave_-_geograph.org.uk_-_8287208.jpg"
},
"ready-mix-plant": {
"img": "./img/processes-ready-mix-plant.jpg",
"page": "https://commons.wikimedia.org/wiki/File:MOBILE_CONCRETE_BATCHING_PLANT_mekaglobal.jpg",
"author": "Fsmazlum",
"license": "CC BY-SA 4.0",
"summary": "Cement, water, sand, gravel and admixtures are weighed and loaded into mixer trucks for delivery to site.",
"emissions": "Embodied cement dominates; plant electricity and truck diesel are small.",
"locations": [
{
"name": "Ready-mix plants, Queens / Brooklyn, New York",
"country": "USA",
"lat": 40.73,
"lon": -73.93
},
{
"name": "Cemex, Houston, Texas",
"country": "USA",
"lat": 29.76,
"lon": -95.37
},
{
"name": "CalPortland, Los Angeles",
"country": "USA",
"lat": 34.05,
"lon": -118.24
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/MOBILE_CONCRETE_BATCHING_PLANT_mekaglobal.jpg/500px-MOBILE_CONCRETE_BATCHING_PLANT_mekaglobal.jpg"
},
"concrete-pour": {
"img": "./img/processes-concrete-pour.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Construction_site_with_concrete_pump_truck.JPG",
"author": "Steve Pivnick, U.S. Air Force",
"license": "Public domain",
"summary": "Fresh concrete is pumped or poured into formwork around rebar and vibrated before it cures into slabs, walls and cores.",
"emissions": "Embodied cement; site pumps and generators are minor.",
"locations": [
{
"name": "Typical urban site, Manhattan, New York",
"country": "USA",
"lat": 40.76,
"lon": -73.97
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Construction_site_with_concrete_pump_truck.JPG/500px-Construction_site_with_concrete_pump_truck.JPG"
},
"precast-plant": {
"img": "./img/processes-precast-plant.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Precast_concrete_plant,_Ash_Lane,_Garforth_-_geograph.org.uk_-_8245284.jpg",
"author": "Stephen Craven",
"license": "CC BY-SA 2.0",
"summary": "Concrete panels and elements are cast in reusable moulds in a factory, steam-cured and trucked to site.",
"emissions": "Embodied cement plus steam/heat for accelerated curing.",
"locations": [
{
"name": "Tindall, Spartanburg, South Carolina",
"country": "USA",
"lat": 34.95,
"lon": -81.93
},
{
"name": "Gate Precast, Jacksonville, Florida",
"country": "USA",
"lat": 30.33,
"lon": -81.66
},
{
"name": "High Concrete Group, Denver, Pennsylvania",
"country": "USA",
"lat": 40.23,
"lon": -76.14
},
{
"name": "Oldcastle Infrastructure, South Bethlehem, New York",
"country": "USA",
"lat": 42.53,
"lon": -73.86
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Precast_concrete_plant%2C_Ash_Lane%2C_Garforth_-_geograph.org.uk_-_8245284.jpg/500px-Precast_concrete_plant%2C_Ash_Lane%2C_Garforth_-_geograph.org.uk_-_8245284.jpg"
},
"clay-pit": {
"img": "./img/processes-clay-pit.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Ketley_Clay_Pit_-_geograph.org.uk_-_7007947.jpg",
"author": "Gordon Griffiths",
"license": "CC BY-SA 2.0",
"summary": "Clay and shale are excavated from shallow pits and stockpiled to weather before brick making.",
"emissions": "Diesel for excavators and trucks; low.",
"locations": [
{
"name": "Glen-Gery, Hamburg, Pennsylvania",
"country": "USA",
"lat": 40.56,
"lon": -75.98
},
{
"name": "Acme Brick, Denton, Texas",
"country": "USA",
"lat": 33.21,
"lon": -97.13
},
{
"name": "Belden Brick, Sugarcreek, Ohio",
"country": "USA",
"lat": 40.5,
"lon": -81.64
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/f/fc/Ketley_Clay_Pit_-_geograph.org.uk_-_7007947.jpg"
},
"brick-kiln": {
"img": "./img/processes-brick-kiln.jpg",
"page": "https://commons.wikimedia.org/wiki/File:A_brick_kiln_and_manufactured_bricks_in_Tinsukia_district,_Assam.jpg",
"author": "অজয় দাস",
"license": "CC BY-SA 4.0",
"summary": "Shaped clay units are dried and fired in a tunnel kiln at about 1000-1200 C into hard bricks.",
"emissions": "Natural gas (or coal) to fire the kiln, plus a little CO2 from carbonates in the clay.",
"locations": [
{
"name": "Belden Brick, Sugarcreek, Ohio",
"country": "USA",
"lat": 40.5,
"lon": -81.64
},
{
"name": "Glen-Gery, Hamburg, Pennsylvania",
"country": "USA",
"lat": 40.56,
"lon": -75.98
},
{
"name": "General Shale, Johnson City, Tennessee",
"country": "USA",
"lat": 36.31,
"lon": -82.35
},
{
"name": "Acme Brick, Denton, Texas",
"country": "USA",
"lat": 33.21,
"lon": -97.13
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/A_brick_kiln_and_manufactured_bricks_in_Tinsukia_district%2C_Assam.jpg/500px-A_brick_kiln_and_manufactured_bricks_in_Tinsukia_district%2C_Assam.jpg"
},
"silica-sand-mine": {
"img": "./img/processes-silica-sand-mine.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Silica_Sand_Mine.jpg",
"author": "InexorableAlloy",
"license": "CC BY-SA 4.0",
"summary": "High-purity quartz sand is dug, washed, dried and screened for glassmaking.",
"emissions": "Diesel for mining and natural gas for drying.",
"locations": [
{
"name": "U.S. Silica, Berkeley Springs, West Virginia",
"country": "USA",
"lat": 39.63,
"lon": -78.23
},
{
"name": "Ottawa, Illinois (St. Peter sandstone)",
"country": "USA",
"lat": 41.35,
"lon": -88.84
},
{
"name": "Mauricetown, New Jersey",
"country": "USA",
"lat": 39.28,
"lon": -74.99
},
{
"name": "Sibelco, Kasota, Minnesota",
"country": "USA",
"lat": 44.29,
"lon": -93.96
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/7/75/Silica_Sand_Mine.jpg"
},
"float-glass-line": {
"img": "./img/processes-float-glass-line.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Float_Glass_Unloading.jpg",
"author": "ICAPlants",
"license": "CC BY-SA 3.0",
"summary": "Sand, soda ash and limestone are melted at ~1550 C and floated on molten tin to make flat sheets.",
"emissions": "Natural gas to fire the furnace, plus CO2 released by carbonate raw materials.",
"locations": [
{
"name": "Guardian Glass, Carleton, Michigan",
"country": "USA",
"lat": 42.06,
"lon": -83.39
},
{
"name": "Vitro, Carlisle, Pennsylvania",
"country": "USA",
"lat": 40.2,
"lon": -77.19
},
{
"name": "AGC, Spring Hill, Kansas",
"country": "USA",
"lat": 38.74,
"lon": -94.83
},
{
"name": "Saint-Gobain, Salt Lake City, Utah",
"country": "USA",
"lat": 40.76,
"lon": -111.89
},
{
"name": "Cardinal Glass, Mooresville, North Carolina",
"country": "USA",
"lat": 35.58,
"lon": -80.81
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Float_Glass_Unloading.jpg/500px-Float_Glass_Unloading.jpg"
},
"igu-assembly": {
"img": "./img/processes-igu-assembly.jpg",
"page": "https://commons.wikimedia.org/wiki/File:IGU.jpg",
"author": "PMJ FREY",
"license": "CC BY-SA 4.0",
"summary": "Coated glass panes are cut, washed and sealed around a spacer with gas fill to make insulating glass units.",
"emissions": "Electricity for the line and coating; embodied float glass dominates.",
"locations": [
{
"name": "Viracon, Owatonna, Minnesota",
"country": "USA",
"lat": 44.08,
"lon": -93.23
},
{
"name": "Cardinal IG, Fargo, North Dakota",
"country": "USA",
"lat": 46.88,
"lon": -96.79
},
{
"name": "Tecnoglass, Barranquilla",
"country": "Colombia",
"lat": 10.97,
"lon": -74.8
},
{
"name": "Oldcastle BuildingEnvelope, Dallas",
"country": "USA",
"lat": 32.78,
"lon": -96.8
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/IGU.jpg/500px-IGU.jpg"
},
"granite-quarry": {
"img": "./img/processes-granite-quarry.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Rock_of_Ages_Granite_Quarry,_Barre,_VT_(4755762138).jpg",
"author": "National Institute for Occupational Safety and Health (NIOSH) from USA",
"license": "Public domain",
"summary": "Granite blocks are split or wire-sawn from a bedrock face and lifted out for slab cutting.",
"emissions": "Diesel and electricity for drills, wire saws, cranes and loaders.",
"locations": [
{
"name": "Swenson pink granite, North Berwick, Maine (reported source of Seagram plaza stone; likely but unconfirmed)",
"country": "USA",
"lat": 43.3,
"lon": -70.73
},
{
"name": "Cold Spring / St. Cloud granite district, Minnesota (alternate pink granite region)",
"country": "USA",
"lat": 45.46,
"lon": -94.43
},
{
"name": "Barre (Rock of Ages), Vermont",
"country": "USA",
"lat": 44.16,
"lon": -72.48
},
{
"name": "Milford pink granite, Massachusetts",
"country": "USA",
"lat": 42.14,
"lon": -71.52
},
{
"name": "Marble Falls (Granite Mountain), Texas",
"country": "USA",
"lat": 30.59,
"lon": -98.28
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rock_of_Ages_Granite_Quarry%2C_Barre%2C_VT_%284755762138%29.jpg/500px-Rock_of_Ages_Granite_Quarry%2C_Barre%2C_VT_%284755762138%29.jpg"
},
"stone-saw": {
"img": "./img/processes-stone-saw.jpg",
"page": "https://commons.wikimedia.org/wiki/File:%C5%BDaga_v_kamnolomu.jpg",
"author": "Dibko",
"license": "CC BY-SA 4.0",
"summary": "Quarried blocks are cut into slabs with gang saws or diamond wire, then polished or honed.",
"emissions": "Electricity for saws and polishers; water use.",
"locations": [
{
"name": "Carrara stone district",
"country": "Italy",
"lat": 44.08,
"lon": 10.1
},
{
"name": "Barre, Vermont",
"country": "USA",
"lat": 44.2,
"lon": -72.5
},
{
"name": "Cold Spring Granite, Minnesota",
"country": "USA",
"lat": 45.46,
"lon": -94.43
},
{
"name": "Tivoli/Guidonia travertine yards",
"country": "Italy",
"lat": 41.97,
"lon": 12.73
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/%C5%BDaga_v_kamnolomu.jpg/500px-%C5%BDaga_v_kamnolomu.jpg"
},
"travertine-quarry": {
"img": "./img/processes-travertine-quarry.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Cave_di_Travertino,_Acque_Albule.jpg",
"author": "Albarubescens",
"license": "CC BY-SA 4.0",
"summary": "Travertine, a banded limestone formed by mineral springs, is cut in blocks from open pits around Bagni di Tivoli near Rome.",
"emissions": "Diesel and electricity for wire saws, loaders and haulage.",
"locations": [
{
"name": "Bagni di Tivoli / Guidonia travertine basin",
"country": "Italy",
"lat": 41.96,
"lon": 12.74
},
{
"name": "Rapolano Terme, Tuscany",
"country": "Italy",
"lat": 43.29,
"lon": 11.6
},
{
"name": "Denizli",
"country": "Turkey",
"lat": 37.78,
"lon": 29.09
},
{
"name": "Querétaro",
"country": "Mexico",
"lat": 20.59,
"lon": -100.39
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Cave_di_Travertino%2C_Acque_Albule.jpg/500px-Cave_di_Travertino%2C_Acque_Albule.jpg"
},
"marble-quarry": {
"img": "./img/processes-marble-quarry.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Marble_Quarry_near_Carrera.jpg",
"author": "Ingo Mehling",
"license": "CC BY-SA 4.0",
"summary": "Marble blocks are cut from mountain or pit faces with diamond wire saws and lifted out.",
"emissions": "Diesel and electricity for wire saws, loaders and haulage.",
"locations": [
{
"name": "Carrara (Fantiscritti / Colonnata)",
"country": "Italy",
"lat": 44.08,
"lon": 10.13
},
{
"name": "Danby Quarry, Vermont",
"country": "USA",
"lat": 43.35,
"lon": -73.02
},
{
"name": "Proctor, Vermont (Vermont Marble Co.)",
"country": "USA",
"lat": 43.66,
"lon": -73.03
},
{
"name": "Larissa (verde antico, Thessaly)",
"country": "Greece",
"lat": 39.64,
"lon": 22.42
},
{
"name": "Val d'Aosta (Verde Alpi)",
"country": "Italy",
"lat": 45.74,
"lon": 7.32
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Marble_Quarry_near_Carrera.jpg/500px-Marble_Quarry_near_Carrera.jpg"
},
"gypsum-quarry": {
"img": "./img/processes-gypsum-quarry.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Gypsum_quarry_in_K%C3%BClsheim_(Bad_Windsheim)_(26393433411).jpg",
"author": "Björn S...",
"license": "CC BY-SA 2.0",
"summary": "Gypsum rock is mined from shallow quarries or underground and crushed for plaster and wallboard.",
"emissions": "Diesel for mining and haulage.",
"locations": [
{
"name": "Plaster City (USG), California",
"country": "USA",
"lat": 32.79,
"lon": -115.86
},
{
"name": "Fort Dodge, Iowa",
"country": "USA",
"lat": 42.5,
"lon": -94.17
},
{
"name": "Little Narrows, Nova Scotia",
"country": "Canada",
"lat": 45.98,
"lon": -60.98
},
{
"name": "Shoals, Indiana",
"country": "USA",
"lat": 38.67,
"lon": -86.79
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Gypsum_quarry_in_K%C3%BClsheim_%28Bad_Windsheim%29_%2826393433411%29.jpg/500px-Gypsum_quarry_in_K%C3%BClsheim_%28Bad_Windsheim%29_%2826393433411%29.jpg"
},
"plasterboard-plant": {
"img": "./img/processes-plasterboard-plant.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Knauf_Drywall_Factory_-_geograph.org.uk_-_11613.jpg",
"author": "Penny Mayes",
"license": "CC BY-SA 2.0",
"summary": "Gypsum is calcined into stucco, mixed with water and foamed, sandwiched between paper and dried into wallboard.",
"emissions": "Natural gas to calcine the gypsum and dry the boards.",
"locations": [
{
"name": "USG, Shoals, Indiana",
"country": "USA",
"lat": 38.67,
"lon": -86.79
},
{
"name": "National Gypsum, Burlington, New Jersey",
"country": "USA",
"lat": 40.08,
"lon": -74.85
},
{
"name": "CertainTeed, Baltimore, Maryland",
"country": "USA",
"lat": 39.25,
"lon": -76.56
},
{
"name": "Georgia-Pacific, Brunswick, Georgia",
"country": "USA",
"lat": 31.15,
"lon": -81.49
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Knauf_Drywall_Factory_-_geograph.org.uk_-_11613.jpg"
},
"stone-wool-plant": {
"img": "./img/processes-stone-wool-plant.jpg",
"page": "https://commons.wikimedia.org/wiki/File:20190930_RW-RUS_PHO_101_(1).jpg",
"author": "Svetlana Yurova",
"license": "CC BY-SA 4.0",
"summary": "Basalt and slag are melted in a cupola or electric furnace and spun into fibres that are bonded into batts and boards.",
"emissions": "Coke or natural gas (or electricity) for melting rock at ~1500 C, plus binder curing.",
"locations": [
{
"name": "Rockwool, Byhalia, Mississippi",
"country": "USA",
"lat": 34.87,
"lon": -89.69
},
{
"name": "Rockwool, Ranson, West Virginia",
"country": "USA",
"lat": 39.3,
"lon": -77.86
},
{
"name": "Johns Manville, Defiance, Ohio",
"country": "USA",
"lat": 41.28,
"lon": -84.36
},
{
"name": "Rockwool, Milton, Ontario",
"country": "Canada",
"lat": 43.52,
"lon": -79.88
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/20190930_RW-RUS_PHO_101_%281%29.jpg/500px-20190930_RW-RUS_PHO_101_%281%29.jpg"
},
"oil-refinery": {
"img": "./img/processes-oil-refinery.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Anacortes_Refinery_31911.JPG",
"author": "Walter Siegmund (talk)",
"license": "CC BY 2.5",
"summary": "Crude oil is distilled into fuels; the heaviest residue becomes asphalt/bitumen for roofing membranes.",
"emissions": "Fuel burned in process heaters and boilers plus hydrogen production.",
"locations": [
{
"name": "Bayway Refinery, Linden, New Jersey",
"country": "USA",
"lat": 40.63,
"lon": -74.22
},
{
"name": "Baytown, Texas (ExxonMobil)",
"country": "USA",
"lat": 29.75,
"lon": -95.01
},
{
"name": "Whiting, Indiana (bp)",
"country": "USA",
"lat": 41.67,
"lon": -87.48
},
{
"name": "Port Arthur (Motiva), Texas",
"country": "USA",
"lat": 29.89,
"lon": -93.95
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Anacortes_Refinery_31911.JPG/500px-Anacortes_Refinery_31911.JPG"
},
"forest-harvest": {
"img": "./img/processes-forest-harvest.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Ponsse_Ergo_harvester-20230305-RM-153235.jpg",
"author": "Ermell",
"license": "CC BY-SA 4.0",
"summary": "Trees are felled, delimbed and bucked into logs by harvesters, then forwarded to roadside and trucked to mills.",
"emissions": "Diesel for harvesters and log trucks; potential loss of forest carbon if not sustainably managed.",
"locations": [
{
"name": "Pacific Northwest (Willamette Valley), Oregon",
"country": "USA",
"lat": 44.6,
"lon": -122.8
},
{
"name": "Southern yellow pine belt, Georgia",
"country": "USA",
"lat": 31.8,
"lon": -83.5
},
{
"name": "Interior British Columbia",
"country": "Canada",
"lat": 53.92,
"lon": -122.75
},
{
"name": "Styria",
"country": "Austria",
"lat": 47.25,
"lon": 14.9
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Ponsse_Ergo_harvester-20230305-RM-153235.jpg/500px-Ponsse_Ergo_harvester-20230305-RM-153235.jpg"
},
"sawmill": {
"img": "./img/processes-sawmill.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Houtzagerij_Sagi_Tschiertschen_03.jpg",
"author": "Dominicus Johannes Bergsma",
"license": "CC BY-SA 4.0",
"summary": "Logs are debarked and sawn into lumber, then kiln-dried and graded.",
"emissions": "Kiln heat (often from wood residues) and electricity.",
"locations": [
{
"name": "Weyerhaeuser, Longview, Washington",
"country": "USA",
"lat": 46.13,
"lon": -122.94
},
{
"name": "West Fraser, Quesnel, British Columbia",
"country": "Canada",
"lat": 52.98,
"lon": -122.49
},
{
"name": "Stora Enso, Ybbs",
"country": "Austria",
"lat": 48.17,
"lon": 15.08
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Houtzagerij_Sagi_Tschiertschen_03.jpg/500px-Houtzagerij_Sagi_Tschiertschen_03.jpg"
},
"clt-press": {
"img": "./img/processes-clt-press.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Brettsperrholzkonstruktion.jpg",
"author": "RoterRolf",
"license": "CC0",
"summary": "Kiln-dried boards are glued in cross-wise layers and pressed into large solid timber panels, then CNC-cut.",
"emissions": "Electricity for presses/CNC and kiln drying; adhesives; wood stores biogenic carbon.",
"locations": [
{
"name": "Mercer Mass Timber, Spokane Valley, Washington",
"country": "USA",
"lat": 47.67,
"lon": -117.24
},
{
"name": "Structurlam (Mercer), Conway, Arkansas",
"country": "USA",
"lat": 35.09,
"lon": -92.44
},
{
"name": "SmartLam, Dothan, Alabama",
"country": "USA",
"lat": 31.22,
"lon": -85.39
},
{
"name": "Stora Enso, Ybbs",
"country": "Austria",
"lat": 48.17,
"lon": 15.08
},
{
"name": "Nordic Structures, Chibougamau, Québec",
"country": "Canada",
"lat": 49.91,
"lon": -74.37
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Brettsperrholzkonstruktion.jpg/500px-Brettsperrholzkonstruktion.jpg"
},
"truck-freight": {
"img": "./img/processes-truck-freight.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Truck_on_Highway_Bridge.jpg",
"author": "Destroducks",
"license": "CC BY-SA 4.0",
"summary": "Materials are hauled by diesel semi-trailers from plants and yards to job sites.",
"emissions": "Diesel combustion.",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Truck_on_Highway_Bridge.jpg/500px-Truck_on_Highway_Bridge.jpg"
},
"rail-freight": {
"img": "./img/processes-rail-freight.jpg",
"page": "https://commons.wikimedia.org/wiki/File:CN_8015,_5690_and_5517_Hinton_-_Jasper.jpg",
"author": "Kabelleger / David Gubler",
"license": "CC BY-SA 4.0",
"summary": "Bulk materials such as ore, coal, cement and steel travel long distances by diesel-electric freight trains.",
"emissions": "Diesel combustion (much lower per tonne-km than trucking).",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/CN_8015%2C_5690_and_5517_Hinton_-_Jasper.jpg/500px-CN_8015%2C_5690_and_5517_Hinton_-_Jasper.jpg"
},
"container-ship": {
"img": "./img/processes-container-ship.jpg",
"page": "https://commons.wikimedia.org/wiki/File:MAERSK_HANOI_Container_Ship_(Port_Koper_SIKOP,_2023).jpg",
"author": "Petar Milošević",
"license": "CC BY-SA 4.0",
"summary": "Manufactured goods like glass units, stone slabs and fittings cross oceans in containers on large ships.",
"emissions": "Heavy fuel oil combustion (low per tonne-km).",
"locations": [
{
"name": "Port of New York and New Jersey",
"country": "USA",
"lat": 40.67,
"lon": -74.15
},
{
"name": "Port of Genoa / La Spezia (Italian stone)",
"country": "Italy",
"lat": 44.1,
"lon": 9.85
},
{
"name": "Port of Shanghai",
"country": "China",
"lat": 31.36,
"lon": 121.6
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/MAERSK_HANOI_Container_Ship_%28Port_Koper_SIKOP%2C_2023%29.jpg/500px-MAERSK_HANOI_Container_Ship_%28Port_Koper_SIKOP%2C_2023%29.jpg"
},
"bulk-carrier": {
"img": "./img/processes-bulk-carrier.jpg",
"page": "https://commons.wikimedia.org/wiki/File:2024-09-11_HAPPINESS_BULKER_-_IMO_9919515_%E2%80%93_Port_Angeles_WA_USA.jpg",
"author": "Gordon Leggett",
"license": "CC BY 4.0",
"summary": "Loose bulk cargoes such as ore, coal, bauxite and clinker are shipped in dry bulk carriers.",
"emissions": "Heavy fuel oil combustion.",
"locations": [
{
"name": "Port Hedland (iron ore)",
"country": "Australia",
"lat": -20.31,
"lon": 118.58
},
{
"name": "Ponta da Madeira, São Luís (Carajás ore)",
"country": "Brazil",
"lat": -2.57,
"lon": -44.37
},
{
"name": "Duluth-Superior (taconite, Great Lakes)",
"country": "USA",
"lat": 46.77,
"lon": -92.1
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/2024-09-11_HAPPINESS_BULKER_-_IMO_9919515_%E2%80%93_Port_Angeles_WA_USA.jpg/500px-2024-09-11_HAPPINESS_BULKER_-_IMO_9919515_%E2%80%93_Port_Angeles_WA_USA.jpg"
},
"tower-crane-site": {
"img": "./img/processes-tower-crane-site.jpg",
"page": "https://commons.wikimedia.org/wiki/File:20230107_Construction_Site_Nuremberg.jpg",
"author": "Flocci Nivis",
"license": "CC BY 4.0",
"summary": "Tower cranes lift steel, formwork and materials into place as the structure rises.",
"emissions": "Grid electricity or diesel generators for cranes, hoists and site equipment.",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/20230107_Construction_Site_Nuremberg.jpg/500px-20230107_Construction_Site_Nuremberg.jpg"
},
"curtain-wall-installation": {
"img": "./img/processes-curtain-wall-installation.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Glass_curtain_wall_architecture_building.jpg",
"author": "Navaneeth Krishnan S",
"license": "CC BY-SA 3.0",
"summary": "Prefabricated glass-and-metal curtain-wall units are lifted and anchored to the floor edges.",
"emissions": "Site lifting equipment; the impact is mostly embodied in aluminium and glass.",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Glass_curtain_wall_architecture_building.jpg/500px-Glass_curtain_wall_architecture_building.jpg"
},
"demolition": {
"img": "./img/processes-demolition.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Demolition_of_part_of_the_NBP_building_8-2025_(3).jpg",
"author": "Wistula",
"license": "CC BY-SA 4.0",
"summary": "Buildings are knocked down with high-reach excavators and the debris is sorted for recycling or landfill.",
"emissions": "Diesel for machinery and haulage; loss of embodied carbon.",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Demolition_of_part_of_the_NBP_building_8-2025_%283%29.jpg/500px-Demolition_of_part_of_the_NBP_building_8-2025_%283%29.jpg"
},
"deconstruction": {
"img": "./img/processes-deconstruction.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Battersea_Power_Station_-_Deconstruction_(12794114485).jpg",
"author": "George Rex from London, England",
"license": "CC BY-SA 2.0",
"summary": "Buildings are taken apart piece by piece so steel, timber, stone and fixtures can be reused.",
"emissions": "Labour and light equipment; low emissions and avoided new materials.",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Battersea_Power_Station_-_Deconstruction_%2812794114485%29.jpg/500px-Battersea_Power_Station_-_Deconstruction_%2812794114485%29.jpg"
},
"concrete-crushing": {
"img": "./img/processes-concrete-crushing.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Recycling_an_airfield_N03_-_geograph.org.uk_-_379756.jpg",
"author": "Jim Bain",
"license": "CC BY-SA 2.0",
"summary": "Demolished concrete is crushed and screened into recycled aggregate; the rebar is pulled out by magnets.",
"emissions": "Diesel or electricity for mobile crushers and loaders.",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Recycling_an_airfield_N03_-_geograph.org.uk_-_379756.jpg"
},
"metal-recycling-shredder": {
"img": "./img/processes-metal-recycling-shredder.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Broyeur_Brest.jpg",
"author": "Germanylinefoto",
"license": "CC BY-SA 3.0",
"summary": "Scrap cars and mixed metal are shredded into fist-sized pieces and sorted magnetically for steel mills.",
"emissions": "Electricity for the shredder motor and diesel for handling.",
"locations": [
{
"name": "Sims Metal, Jersey City, New Jersey",
"country": "USA",
"lat": 40.7,
"lon": -74.07
},
{
"name": "Radius Recycling, Portland, Oregon",
"country": "USA",
"lat": 45.6,
"lon": -122.73
},
{
"name": "SA Recycling, Los Angeles",
"country": "USA",
"lat": 33.77,
"lon": -118.24
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Broyeur_Brest.jpg/500px-Broyeur_Brest.jpg"
},
"glass-cullet": {
"img": "./img/processes-glass-cullet.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Glas_aus_Aufbereitungsanlage_bunt_-_glass_cullet_various_(Alter_Fritz).JPG",
"author": "Alter Fritz",
"license": "CC BY-SA 3.0",
"summary": "Waste glass is collected, crushed and cleaned into cullet that can be remelted in glass furnaces.",
"emissions": "Low; using cullet cuts furnace energy and carbonate CO2.",
"locations": [
{
"name": "Strategic Materials, Houston, Texas",
"country": "USA",
"lat": 29.76,
"lon": -95.37
},
{
"name": "Ripple Glass, Kansas City",
"country": "USA",
"lat": 39.1,
"lon": -94.58
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Glas_aus_Aufbereitungsanlage_bunt_-_glass_cullet_various_%28Alter_Fritz%29.JPG/500px-Glas_aus_Aufbereitungsanlage_bunt_-_glass_cullet_various_%28Alter_Fritz%29.JPG"
},
"landfill": {
"img": "./img/processes-landfill.jpg",
"page": "https://commons.wikimedia.org/wiki/File:SBI_landfill_Cranbourne_site.jpg",
"author": "Environment Protection Authority Victoria",
"license": "CC BY 4.0",
"summary": "Unrecovered construction waste is buried in engineered landfill cells.",
"emissions": "Diesel for compaction; methane from any organic waste.",
"locations": [
{
"name": "Fresh Kills (closed), Staten Island",
"country": "USA",
"lat": 40.57,
"lon": -74.19
},
{
"name": "Puente Hills (closed), California",
"country": "USA",
"lat": 34.03,
"lon": -118.01
},
{
"name": "Keystone Sanitary Landfill, Pennsylvania",
"country": "USA",
"lat": 41.43,
"lon": -75.62
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/SBI_landfill_Cranbourne_site.jpg/500px-SBI_landfill_Cranbourne_site.jpg"
},
"waste-to-energy": {
"img": "./img/processes-waste-to-energy.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Waste_incineration_plant_Bratislava.jpg",
"author": "Rios",
"license": "CC BY-SA 4.0",
"summary": "Residual waste is burned in a furnace and the heat raises steam to generate electricity.",
"emissions": "Combustion of fossil-derived materials (plastics) in the waste.",
"locations": [
{
"name": "Covanta Essex, Newark, New Jersey",
"country": "USA",
"lat": 40.73,
"lon": -74.12
},
{
"name": "Copenhill (Amager Bakke), Copenhagen",
"country": "Denmark",
"lat": 55.68,
"lon": 12.62
},
{
"name": "Spittelau, Vienna",
"country": "Austria",
"lat": 48.23,
"lon": 16.36
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Waste_incineration_plant_Bratislava.jpg/500px-Waste_incineration_plant_Bratislava.jpg"
},
"building-maintenance": {
"img": "./img/processes-building-maintenance.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_hoist_along_the_Andaz_Hotel_of_Singapore_at_sunset.jpg",
"author": "Basile Morin",
"license": "CC BY-SA 4.0",
"summary": "Facade-access gondolas and window-washing rigs clean glass and bronze, and support repairs over the building's life.",
"emissions": "Electricity for hoists; replacement parts and cleaning chemicals.",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Fa%C3%A7ade_hoist_along_the_Andaz_Hotel_of_Singapore_at_sunset.jpg/500px-Fa%C3%A7ade_hoist_along_the_Andaz_Hotel_of_Singapore_at_sunset.jpg"
},
"steam-plant": {
"img": "./img/processes-steam-plant.jpg",
"page": "https://commons.wikimedia.org/wiki/File:East_River_Power_Plant,_New_York_City,_20231001_1056_0990.jpg",
"author": "Jakub Hałun",
"license": "CC BY-SA 4.0",
"summary": "Central plants burn gas (or oil) to make steam that is piped under the streets to heat buildings and drive absorption chillers.",
"emissions": "Natural gas combustion in boilers and cogeneration units.",
"locations": [
{
"name": "Con Edison East River Generating Station, Manhattan",
"country": "USA",
"lat": 40.73,
"lon": -73.97
},
{
"name": "Con Edison 59th Street Station, Manhattan",
"country": "USA",
"lat": 40.77,
"lon": -73.99
},
{
"name": "Con Edison 74th Street Station, Manhattan",
"country": "USA",
"lat": 40.77,
"lon": -73.95
},
{
"name": "Brooklyn Navy Yard Cogeneration",
"country": "USA",
"lat": 40.7,
"lon": -73.97
}
],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/East_River_Power_Plant%2C_New_York_City%2C_20231001_1056_0990.jpg/500px-East_River_Power_Plant%2C_New_York_City%2C_20231001_1056_0990.jpg"
},
"chiller-plant": {
"img": "./img/processes-chiller-plant.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Chiller_in_a_large_commercial_building,_Brisbane.jpg",
"author": "Kgbo",
"license": "CC BY-SA 4.0",
"summary": "Electric or steam-driven chillers make chilled water that is pumped to air handlers for cooling.",
"emissions": "Electricity use plus leaks of refrigerant gases (HFCs).",
"locations": [],
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Chiller_in_a_large_commercial_building%2C_Brisbane.jpg/500px-Chiller_in_a_large_commercial_building%2C_Brisbane.jpg"
}
},
"materials": {
"steel-section": {
"img": "./img/materials-steel-section.jpg",
"page": "https://commons.wikimedia.org/wiki/File:I-beam_raw_material_at_WP_Welding_3.jpg",
"author": "W.carter",
"license": "CC0",
"caption": "Hot-rolled steel I-beams (wide-flange type) in stock",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/I-beam_raw_material_at_WP_Welding_3.jpg/500px-I-beam_raw_material_at_WP_Welding_3.jpg"
},
"steel-section-eaf": {
"img": "./img/materials-steel-section-eaf.jpg",
"page": "https://commons.wikimedia.org/wiki/File:I-beam_raw_material_at_WP_Welding_1.jpg",
"author": "W.carter",
"license": "CC0",
"caption": "Stock of rolled steel beams (stand-in image for EAF/recycled-content sections)",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/I-beam_raw_material_at_WP_Welding_1.jpg/500px-I-beam_raw_material_at_WP_Welding_1.jpg"
},
"steel-deck": {
"img": "./img/materials-steel-deck.png",
"page": "https://commons.wikimedia.org/wiki/File:Q_deck_001.png",
"author": "Achim Hering",
"license": "CC BY 3.0",
"caption": "Profiled composite steel floor deck",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Q_deck_001.png/500px-Q_deck_001.png"
},
"rebar": {
"img": "./img/materials-rebar.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Rusty_rebar_nets.jpg",
"author": "W.carter",
"license": "CC BY-SA 4.0",
"caption": "Steel reinforcing bar (rebar) mesh",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Rusty_rebar_nets.jpg/500px-Rusty_rebar_nets.jpg"
},
"steel-stud": {
"img": "./img/materials-steel-stud.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Light_gage_metal_framing.JPG",
"author": "P199",
"license": "Public domain",
"caption": "Light-gauge cold-formed steel stud framing",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Light_gage_metal_framing.JPG/500px-Light_gage_metal_framing.JPG"
},
"bronze": {
"img": "./img/materials-bronze.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Seagram_Building_(4114889237).jpg",
"author": "Tom Ravenscrodt from Bristol, United Kingdom",
"license": "CC BY 2.0",
"caption": "Seagram Building bronze facade and mullions, New York",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Seagram_Building_%284114889237%29.jpg/500px-Seagram_Building_%284114889237%29.jpg"
},
"aluminium": {
"img": "./img/materials-aluminium.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Single_Extrusion_Panel.jpg",
"author": "AstridMitch",
"license": "CC BY-SA 4.0",
"caption": "Extruded aluminium panel profile",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Single_Extrusion_Panel.jpg/500px-Single_Extrusion_Panel.jpg"
},
"concrete": {
"img": "./img/materials-concrete.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Clean_concrete_mixer_truck.jpg",
"author": "woodleywonderworks",
"license": "CC BY 2.0",
"caption": "Ready-mix concrete truck",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Clean_concrete_mixer_truck.jpg/500px-Clean_concrete_mixer_truck.jpg"
},
"concrete-lowcarbon": {
"img": "./img/materials-concrete-lowcarbon.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Concrete_texture.jpg",
"author": "Daniel Schwen",
"license": "CC BY-SA 4.0",
"caption": "Concrete surface (generic; stand-in for low-carbon mix)",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Concrete_texture.jpg/500px-Concrete_texture.jpg"
},
"concrete-light": {
"img": "./img/materials-concrete-light.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Aerated_autoclaved_concrete_-_detail.jpg",
"author": "Marco Bernardini",
"license": "CC BY-SA 3.0",
"caption": "Lightweight (autoclaved aerated) concrete, cellular structure",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Aerated_autoclaved_concrete_-_detail.jpg/500px-Aerated_autoclaved_concrete_-_detail.jpg"
},
"precast": {
"img": "./img/materials-precast.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Full-Depth_Precast_Bridge_Deck_Panel_-5_IA_(8423182403).jpg",
"author": "Federal Highway Administration",
"license": "Public domain",
"caption": "Precast concrete deck panels",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Full-Depth_Precast_Bridge_Deck_Panel_-5_IA_%288423182403%29.jpg/500px-Full-Depth_Precast_Bridge_Deck_Panel_-5_IA_%288423182403%29.jpg"
},
"glass": {
"img": "./img/materials-glass.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Green_color_of_float_glass.jpg",
"author": "Alexander Flügel",
"license": "Public domain",
"caption": "Float glass edge showing its green tint",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Green_color_of_float_glass.jpg/500px-Green_color_of_float_glass.jpg"
},
"glass-igu": {
"img": "./img/materials-glass-igu.jpg",
"page": "https://commons.wikimedia.org/wiki/File:EURO_68_wooden_window_profile_with_insulated_glazing_01.JPG",
"author": "Kozuch",
"license": "CC BY-SA 3.0",
"caption": "Section through an insulating glass unit in a window frame",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/EURO_68_wooden_window_profile_with_insulated_glazing_01.JPG/500px-EURO_68_wooden_window_profile_with_insulated_glazing_01.JPG"
},
"granite": {
"img": "./img/materials-granite.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Granite_rose_poli.jpg",
"author": "Laurent Bélanger",
"license": "CC BY-SA 4.0",
"caption": "Polished pink granite (granit rose)",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Granite_rose_poli.jpg/500px-Granite_rose_poli.jpg"
},
"travertine": {
"img": "./img/materials-travertine.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Travertin_Classic_Fliesen_im_Quadratformat_20,3x20,3x1cm.jpg",
"author": "Fravert",
"license": "CC BY-SA 4.0",
"caption": "Travertine tiles",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Travertin_Classic_Fliesen_im_Quadratformat_20%2C3x20%2C3x1cm.jpg/500px-Travertin_Classic_Fliesen_im_Quadratformat_20%2C3x20%2C3x1cm.jpg"
},
"marble": {
"img": "./img/materials-marble.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Lyon-marbres_antiques3.jpg",
"author": "Ursus",
"license": "CC BY-SA 3.0",
"caption": "Antique coloured marbles incl. green verde antico samples",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Lyon-marbres_antiques3.jpg/500px-Lyon-marbres_antiques3.jpg"
},
"brick": {
"img": "./img/materials-brick.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Brick_wall_close-up_view.jpg",
"author": "Pawel Wozniak",
"license": "CC BY-SA 3.0",
"caption": "Clay brick wall",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Brick_wall_close-up_view.jpg/500px-Brick_wall_close-up_view.jpg"
},
"gypsum": {
"img": "./img/materials-gypsum.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Gib_board_aka_plasterboard_tapered_edges_01.jpg",
"author": "Panamitsu",
"license": "CC BY-SA 4.0",
"caption": "Gypsum plasterboard sheets",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Gib_board_aka_plasterboard_tapered_edges_01.jpg/500px-Gib_board_aka_plasterboard_tapered_edges_01.jpg"
},
"mineral-wool": {
"img": "./img/materials-mineral-wool.jpeg",
"page": "https://commons.wikimedia.org/wiki/File:Arrangement_Mineralwolle.jpeg",
"author": "FMI Fachverband Mineralwolleindustrie",
"license": "CC BY-SA 3.0 de",
"caption": "Mineral wool insulation products (batts, rolls, boards)",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Arrangement_Mineralwolle.jpeg/500px-Arrangement_Mineralwolle.jpeg"
},
"ceiling": {
"img": "./img/materials-ceiling.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Suspended-ceiling-0a.jpg",
"author": "Adamantios",
"license": "CC BY-SA 3.0",
"caption": "Suspended acoustic ceiling tiles",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Suspended-ceiling-0a.jpg/500px-Suspended-ceiling-0a.jpg"
},
"membrane": {
"img": "./img/materials-membrane.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Rolled_bitumen_base_membrane_Tehran_Iran_M.C.O.jpg",
"author": "M.Moradi.1985",
"license": "CC BY-SA 4.0",
"caption": "Rolls of bitumen roofing membrane",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Rolled_bitumen_base_membrane_Tehran_Iran_M.C.O.jpg/500px-Rolled_bitumen_base_membrane_Tehran_Iran_M.C.O.jpg"
},
"clt": {
"img": "./img/materials-clt.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Brettsperrholzkonstruktion.jpg",
"author": "RoterRolf",
"license": "CC0",
"caption": "Cross-laminated timber (CLT) wall and floor panels in a building",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Brettsperrholzkonstruktion.jpg/500px-Brettsperrholzkonstruktion.jpg"
}
},
"raw": {
"iron-ore": {
"img": "./img/raw-iron-ore.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Hematite-rich_iron_ore_(Precambrian;_Pioneer_Mine,_Ely,_Minnesota,_USA)_1.jpg",
"author": "James St. John",
"license": "CC BY 2.0",
"caption": "Iron ore from the Precambrian of Minnesota, USA. (~7.6 centimeters across at its widest) The Soudan Iron-Formation is a Neoarchean-aged banded iron",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hematite-rich_iron_ore_%28Precambrian%3B_Pioneer_Mine%2C_Ely%2C_Minnesota%2C_USA%29_1.jpg/500px-Hematite-rich_iron_ore_%28Precambrian%3B_Pioneer_Mine%2C_Ely%2C_Minnesota%2C_USA%29_1.jpg"
},
"coking-coal": {
"img": "./img/raw-coking-coal.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Primary_coking_coal_20180405_154027_1.jpg",
"author": "Leiem",
"license": "CC BY-SA 4.0",
"caption": "​焦煤的样本。",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Primary_coking_coal_20180405_154027_1.jpg/500px-Primary_coking_coal_20180405_154027_1.jpg"
},
"steel-scrap": {
"img": "./img/raw-steel-scrap.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Steel_Scrap_Compacted.JPG",
"author": "TeWeBs",
"license": "CC BY-SA 4.0",
"caption": "Stainless steel scrap shimmering in sunlight.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Steel_Scrap_Compacted.JPG/500px-Steel_Scrap_Compacted.JPG"
},
"limestone": {
"img": "./img/raw-limestone.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Morawica_limestone_2.jpg",
"author": "Tomasz91",
"license": "CC BY-SA 4.0",
"caption": "wapień Morawica; widoczne amonit, gąbki, szwy stylolitowe",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Morawica_limestone_2.jpg/500px-Morawica_limestone_2.jpg"
},
"clay": {
"img": "./img/raw-clay.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Wuyan_soil_used_in_traditional_pottery_in_Nigeria.jpg",
"author": "Faridat Oniye",
"license": "CC0",
"caption": "Wuyan, known as temper in English, is mixed with clay soil to improve its strength and prevent cracking during pottery production.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Wuyan_soil_used_in_traditional_pottery_in_Nigeria.jpg/500px-Wuyan_soil_used_in_traditional_pottery_in_Nigeria.jpg"
},
"gypsum-rock": {
"img": "./img/raw-gypsum-rock.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Naturalis_Biodiversity_Center_-_Gypsum_-_mineral.jpg",
"author": "Naturalis Biodiversity Center",
"license": "CC0",
"caption": "White gypsum mineral",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Naturalis_Biodiversity_Center_-_Gypsum_-_mineral.jpg/500px-Naturalis_Biodiversity_Center_-_Gypsum_-_mineral.jpg"
},
"silica-sand": {
"img": "./img/raw-silica-sand.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Eolian_sand_(modern;_Killpecker_Sand_Dunes,_Wyoming,_USA)_(31263432512).jpg",
"author": "James St. John",
"license": "CC BY 2.0",
"caption": "Modern eolian sand from Wyoming, USA. (field of view ~~7 centimeters across) \"Eolian\" refers to wind-blown sediments. This sample is from W",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Eolian_sand_%28modern%3B_Killpecker_Sand_Dunes%2C_Wyoming%2C_USA%29_%2831263432512%29.jpg/500px-Eolian_sand_%28modern%3B_Killpecker_Sand_Dunes%2C_Wyoming%2C_USA%29_%2831263432512%29.jpg"
},
"soda-ash": {
"img": "./img/raw-soda-ash.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Production_site_for_sodium_carbonate_near_Dombasle-sur-Meurthe_France_(19630816513).jpg",
"author": "Jeroen Komen from Utrecht, Netherlands",
"license": "CC BY-SA 2.0",
"caption": "Production site for sodium carbonate near Dombasle-sur-Meurthe, France. Created in 1873 by Solvay. Not only for washing soda, but also for making soda",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Production_site_for_sodium_carbonate_near_Dombasle-sur-Meurthe_France_%2819630816513%29.jpg/500px-Production_site_for_sodium_carbonate_near_Dombasle-sur-Meurthe_France_%2819630816513%29.jpg"
},
"dolomite": {
"img": "./img/raw-dolomite.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Silurian_dolostone_bedrock.jpg",
"author": "IChoseThisName",
"license": "CC BY 4.0",
"caption": "Photo of exposed bedrock",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Silurian_dolostone_bedrock.jpg/500px-Silurian_dolostone_bedrock.jpg"
},
"bauxite": {
"img": "./img/raw-bauxite.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Bauxite_h%C3%A9rault.JPG",
"author": "saphon",
"license": "CC BY-SA 1.0",
"caption": "bauxite (hérault)",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Bauxite_h%C3%A9rault.JPG/500px-Bauxite_h%C3%A9rault.JPG"
},
"copper-ore": {
"img": "./img/raw-copper-ore.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Chalcopyrite,_a_high-grade_copper_ore,_USA_-_Natural_History_Museum,_London_-_DSC05261.jpg",
"author": "Daderot",
"license": "CC0",
"caption": "Exhibit in the Natural History Museum, London, UK.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chalcopyrite%2C_a_high-grade_copper_ore%2C_USA_-_Natural_History_Museum%2C_London_-_DSC05261.jpg/500px-Chalcopyrite%2C_a_high-grade_copper_ore%2C_USA_-_Natural_History_Museum%2C_London_-_DSC05261.jpg"
},
"zinc": {
"img": "./img/raw-zinc.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Zinc_(Element_-_30).jpg",
"author": "James St. John",
"license": "CC BY 2.0",
"caption": "Zinc (Zn) is # 30 on the Periodic Table of Elements. Elemental zinc is a silvery-gray metal. Zinc is principally obtained by mining sphalerite (ZnS,",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Zinc_%28Element_-_30%29.jpg/500px-Zinc_%28Element_-_30%29.jpg"
},
"tin": {
"img": "./img/raw-tin.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Tin_(Element_-_50).jpg",
"author": "James St. John",
"license": "CC BY 2.0",
"caption": "Tin (Sn) is # 50 on the Periodic Table of Elements. Elemental tin is a silvery-gray or gray-colored metal. The most significant Sn-bearing mineral i",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Tin_%28Element_-_50%29.jpg/500px-Tin_%28Element_-_50%29.jpg"
},
"lead": {
"img": "./img/raw-lead.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Lead_ingots.JPG",
"author": "Rodw",
"license": "Public domain",
"caption": "Lead ingots from Roman Britain on display at the Wells and Mendip Museum",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Lead_ingots.JPG/500px-Lead_ingots.JPG"
},
"aggregate": {
"img": "./img/raw-aggregate.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Aggregate_heaps,_sand_and_gravel_quarry,_North_Cave_-_geograph.org.uk_-_8287208.jpg",
"author": "Christine Johnstone",
"license": "CC BY-SA 2.0",
"caption": "Aggregate heaps, sand and gravel quarry, North Cave <a href=\"//commons.wikimedia.o",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Aggregate_heaps%2C_sand_and_gravel_quarry%2C_North_Cave_-_geograph.org.uk_-_8287208.jpg/500px-Aggregate_heaps%2C_sand_and_gravel_quarry%2C_North_Cave_-_geograph.org.uk_-_8287208.jpg"
},
"cement": {
"img": "./img/raw-cement.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Portland_Cement_Bags.jpg",
"author": "KVDP",
"license": "Public domain",
"caption": "A pallet of Portland cement bags used for construction.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Portland_Cement_Bags.jpg/500px-Portland_Cement_Bags.jpg"
},
"fly-ash": {
"img": "./img/raw-fly-ash.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Fly_ash_of_a_thermal_power_plant_containing_hollow_cenospheres.jpg",
"author": "Dr Anatoly",
"license": "CC BY 4.0",
"caption": "Fly ash of a thermal power plant containing hollow cenospheres. Optical microscopy, magnification 40X.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Fly_ash_of_a_thermal_power_plant_containing_hollow_cenospheres.jpg/500px-Fly_ash_of_a_thermal_power_plant_containing_hollow_cenospheres.jpg"
},
"ggbs": {
"img": "./img/raw-ggbs.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Samples_of_%22ground_granulated_blast_furnace_slag%22_and_%22granulated_blast_furnace_slag%22.jpg",
"author": "Giám Định",
"license": "CC BY-SA 4.0",
"caption": "Samples of \"ground granulated blast furnace slag\" and \"granulated blast furnace slag",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Samples_of_%22ground_granulated_blast_furnace_slag%22_and_%22granulated_blast_furnace_slag%22.jpg/500px-Samples_of_%22ground_granulated_blast_furnace_slag%22_and_%22granulated_blast_furnace_slag%22.jpg"
},
"water": {
"img": "./img/raw-water.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Water_drop_001.jpg",
"author": "José Manuel Suárez from Spain",
"license": "CC BY 2.0",
"caption": "A globule of liquid water, and the concave depression a",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Water_drop_001.jpg/500px-Water_drop_001.jpg"
},
"basalt": {
"img": "./img/raw-basalt.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Basalt_Rock_Formation_-_geograph.org.uk_-_180882.jpg",
"author": "Mick Garratt",
"license": "CC BY-SA 2.0",
"caption": "Basalt Rock Formation, in the Mull Lava Group of Palaeocene age. Taken on the way to the fossilised tree. I am indebted to Keith Burns for this explan",
"src": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Basalt_Rock_Formation_-_geograph.org.uk_-_180882.jpg"
},
"crude-oil": {
"img": "./img/raw-crude-oil.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Petroleum_sample.jpg",
"author": "Nefronus",
"license": "CC0",
"caption": "Crude oil = petroleum in a flask and a small beaker.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Petroleum_sample.jpg/500px-Petroleum_sample.jpg"
},
"bitumen": {
"img": "./img/raw-bitumen.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Bitumen.jpg",
"author": "Daniel Tzvi",
"license": "Public domain",
"caption": "Natural formed Bitumen collected at the <a href=\"https://en.wikipe",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bitumen.jpg/500px-Bitumen.jpg"
},
"timber-logs": {
"img": "./img/raw-timber-logs.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Pine_logs_at_Keitele_Group_sawmill_in_Kemij%C3%A4rvi.jpg",
"author": "Q0ywo",
"license": "CC BY-SA 4.0",
"caption": "Pine logs at Keitele Group sawmill in Kemijärvi",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pine_logs_at_Keitele_Group_sawmill_in_Kemij%C3%A4rvi.jpg/500px-Pine_logs_at_Keitele_Group_sawmill_in_Kemij%C3%A4rvi.jpg"
},
"quartz": {
"img": "./img/raw-quartz.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Quartz,_Tibet.jpg",
"author": "JJ Harrison (https://www.jjharrison.com.au/)",
"license": "CC BY-SA 2.5",
"caption": "Quartz, Tibet.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Quartz%2C_Tibet.jpg/500px-Quartz%2C_Tibet.jpg"
},
"feldspar": {
"img": "./img/raw-feldspar.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Granite_cliff_with_feldspar_crystals_in_Loddebo_2.jpg",
"author": "W.carter",
"license": "CC0",
"caption": "Granite cliff with feldspar crystals by Brofjorden in Lodde",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Granite_cliff_with_feldspar_crystals_in_Loddebo_2.jpg/500px-Granite_cliff_with_feldspar_crystals_in_Loddebo_2.jpg"
}
},
"components": {
"columns": {
"img": "./img/components-columns.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Steel_Frame_Commercial_Building_Under_Construction,_Ann_Arbor_Township,_Michigan.JPG",
"author": "Dwight Burdette",
"license": "CC BY 3.0",
"caption": "Steel frame commercial building under construction, Domino Farms, Ann Arbor Township, Michigan.<table class=\"toccolours layouttemplate commons-file-in",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Steel_Frame_Commercial_Building_Under_Construction%2C_Ann_Arbor_Township%2C_Michigan.JPG/500px-Steel_Frame_Commercial_Building_Under_Construction%2C_Ann_Arbor_Township%2C_Michigan.JPG"
},
"beams": {
"img": "./img/components-beams.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Steel_frame_building_under_construction_in_Taiwan.jpg",
"author": "SSJF01",
"license": "CC0",
"caption": "Steel frame building under construction in Taiwan",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Steel_frame_building_under_construction_in_Taiwan.jpg/500px-Steel_frame_building_under_construction_in_Taiwan.jpg"
},
"bracing": {
"img": "./img/components-bracing.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Steel_braced_frame_added_to_an_unreinforced_masonry_bearing-wall_building_as_a_seismic_retrofit.jpg",
"author": "Keithalanporter",
"license": "CC BY-SA 4.0",
"caption": "New steel frame added apparently to seismically strengthen an unreinforced masonry bearing-wall building in Petaluma, California.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Steel_braced_frame_added_to_an_unreinforced_masonry_bearing-wall_building_as_a_seismic_retrofit.jpg/500px-Steel_braced_frame_added_to_an_unreinforced_masonry_bearing-wall_building_as_a_seismic_retrofit.jpg"
},
"core": {
"img": "./img/components-core.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Concrete_core_of_the_Millennium_Tower_(301_Mission_Street),_SF.JPG",
"author": "Cheers. Trance addict - Armin van Buuren - Oceanlab",
"license": "CC BY-SA 3.0",
"caption": "A shot of the concrete core of the Millennium Tower (301 Mission Street), under construction.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Concrete_core_of_the_Millennium_Tower_%28301_Mission_Street%29%2C_SF.JPG/500px-Concrete_core_of_the_Millennium_Tower_%28301_Mission_Street%29%2C_SF.JPG"
},
"slabs": {
"img": "./img/components-slabs.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Pouring_a_concrete_floor_slab_for_the_three-story_building_that_will_house_LIRR_personnel._(CM014B,_12-13-2018)_(45591917924).jpg",
"author": "MTA Capital Construction Mega Projects",
"license": "CC BY 2.0",
"caption": "Pouring a concrete floor slab for the three-story building that will house LIRR personnel. (CM014B, 12-13-2018)",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Pouring_a_concrete_floor_slab_for_the_three-story_building_that_will_house_LIRR_personnel._%28CM014B%2C_12-13-2018%29_%2845591917924%29.jpg/500px-Pouring_a_concrete_floor_slab_for_the_three-story_building_that_will_house_LIRR_personnel._%28CM014B%2C_12-13-2018%29_%2845591917924%29.jpg"
},
"foundation": {
"img": "./img/components-foundation.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Completed_pile_caps_at_Fall_River_station,_April_2021.jpg",
"author": "MassDOT",
"license": "Public domain",
"caption": "Completed concrete pile caps at Fall River station, which will provide the foundation for the new platform, in April 2021",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Completed_pile_caps_at_Fall_River_station%2C_April_2021.jpg/500px-Completed_pile_caps_at_Fall_River_station%2C_April_2021.jpg"
},
"basement": {
"img": "./img/components-basement.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Placing_steel_and_forms_for_concrete_basement_walls_at_Mission_66_Visitor_Center_and_Museum_construction._;_ZION_Museum_and_(abfa9c597daf4f85bbc0fb08e639aac7).jpg",
"author": "Carl E. Jepson",
"license": "Public domain",
"caption": "Placing steel and forms for concrete basement walls at Mission 66 Visitor Center and Museum construction. Image Series 004.01 - Administrati",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Placing_steel_and_forms_for_concrete_basement_walls_at_Mission_66_Visitor_Center_and_Museum_construction._%3B_ZION_Museum_and_%28abfa9c597daf4f85bbc0fb08e639aac7%29.jpg/500px-thumbnail.jpg"
},
"facade": {
"img": "./img/components-facade.jpg",
"page": "https://commons.wikimedia.org/wiki/File:1900_M_Street_NW_-_Washington_DC_-_curtain_wall_detail.JPG",
"author": "Tim1965",
"license": "CC BY-SA 3.0",
"caption": "Reflections of buildings in the eastern facade of 1900 M Street NW in Washington, D.C., in the United States. This Modernist office building has an a",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/1900_M_Street_NW_-_Washington_DC_-_curtain_wall_detail.JPG/500px-1900_M_Street_NW_-_Washington_DC_-_curtain_wall_detail.JPG"
},
"glass": {
"img": "./img/components-glass.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Building_in_Paulista_Avenue_09.jpg",
"author": "Wilfredor",
"license": "CC0",
"caption": "Building in Paulista Avenue, São Paulo, Brazil",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Building_in_Paulista_Avenue_09.jpg/500px-Building_in_Paulista_Avenue_09.jpg"
},
"roof": {
"img": "./img/components-roof.jpg",
"page": "https://commons.wikimedia.org/wiki/File:FinishedEPDMcoveredRoof.jpg",
"author": "KVDP",
"license": "Public domain",
"caption": "A picture of a roof under construction of which the 2nd roofing layer (EPDM) is being layed. The first layer had been bitumen, yet this layer is now c",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/FinishedEPDMcoveredRoof.jpg/500px-FinishedEPDMcoveredRoof.jpg"
},
"partitions": {
"img": "./img/components-partitions.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Installation_of_steel_stud_framing_at_the_ticket_area_of_the_future_LIRR_passenger_concourse._(CM014B,_09-25-2018)_(43161884280).jpg",
"author": "MTA Capital Construction Mega Projects",
"license": "CC BY 2.0",
"caption": "Installation of steel stud framing at the ticket area of the future LIRR passenger concourse. (CM014B, 09-25-2018)",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Installation_of_steel_stud_framing_at_the_ticket_area_of_the_future_LIRR_passenger_concourse._%28CM014B%2C_09-25-2018%29_%2843161884280%29.jpg/500px-Installation_of_steel_stud_framing_at_the_ticket_area_of_the_future_LIRR_passenger_concourse._%28CM014B%2C_09-25-2018%29_%2843161884280%29.jpg"
},
"ceilings": {
"img": "./img/components-ceilings.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Suspended-ceiling-0a.jpg",
"author": "Adamantios",
"license": "CC BY-SA 3.0",
"caption": "Suspended (aka dropped) ceiling.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Suspended-ceiling-0a.jpg/500px-Suspended-ceiling-0a.jpg"
},
"services": {
"img": "./img/components-services.jpg",
"page": "https://commons.wikimedia.org/wiki/File:OC_Fairground_ductwork.jpg",
"author": "Eric Polk",
"license": "CC BY-SA 4.0",
"caption": "HVAC ductwork in one of the event buildings at the Orange County Fairground in Costa Mesa, California, USA.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/OC_Fairground_ductwork.jpg/500px-OC_Fairground_ductwork.jpg"
},
"lifts": {
"img": "./img/components-lifts.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Elevator_machine_room.jpg",
"author": "Filip.vidinovski",
"license": "CC BY-SA 4.0",
"caption": "Old elevator machine room in a building in Kočani, Macedonia.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Elevator_machine_room.jpg/500px-Elevator_machine_room.jpg"
},
"plaza": {
"img": "./img/components-plaza.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Park_Av_53_St_Mar_2021_23.jpg",
"author": "Epicgenius",
"license": "CC BY-SA 4.0",
"caption": "The Seagram Building and its plaza in Manhattan, New York, seen from Park Avenue in March 2021.",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Park_Av_53_St_Mar_2021_23.jpg/500px-Park_Av_53_St_Mar_2021_23.jpg"
},
"pools": {
"img": "./img/components-pools.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Reflecting_pool_at_the_Christian_Science_Plaza_at_night._July_19,_2024.jpg",
"author": "Ztwice",
"license": "CC BY-SA 4.0",
"caption": "Reflecting pool at the Christian Science Plaza at night. July 19, 2024",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Reflecting_pool_at_the_Christian_Science_Plaza_at_night._July_19%2C_2024.jpg/500px-Reflecting_pool_at_the_Christian_Science_Plaza_at_night._July_19%2C_2024.jpg"
},
"finishes": {
"img": "./img/components-finishes.jpg",
"page": "https://commons.wikimedia.org/wiki/File:White_ivory_rippled_wavy_travertine_square_ground_floor_tile_texture.jpg",
"author": "Sisters.seamless",
"license": "CC0",
"caption": "this is a seamless texture of a tile surface photographed in a warm climate. It was turned into a texture, using photo editing software, \"gimp\".",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/White_ivory_rippled_wavy_travertine_square_ground_floor_tile_texture.jpg/500px-White_ivory_rippled_wavy_travertine_square_ground_floor_tile_texture.jpg"
}
},
"seagram": [
{
"img": "./img/seagram-1.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Seagram_Building_Nov_2025_06.jpg",
"author": "Epicgenius",
"license": "CC BY-SA 4.0",
"caption": "Seagram Building in Manhattan, New York, seen in November 2025",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Seagram_Building_Nov_2025_06.jpg/500px-Seagram_Building_Nov_2025_06.jpg"
},
{
"img": "./img/seagram-2.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Seagram_Building_(35098307116).jpg",
"author": "Ken OHYAMA from FUNABASHI, Japan",
"license": "CC BY-SA 2.0",
"caption": "Seagram Building",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Seagram_Building_%2835098307116%29.jpg/500px-Seagram_Building_%2835098307116%29.jpg"
},
{
"img": "./img/seagram-3.jpg",
"page": "https://commons.wikimedia.org/wiki/File:Seagram_Building.jpg",
"author": "Jo Baert",
"license": "CC BY-SA 3.0",
"caption": "Seagram Building, New York City architect Ludwig Mies van der Rohe",
"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Seagram_Building.jpg/500px-Seagram_Building.jpg"
}
]
};
