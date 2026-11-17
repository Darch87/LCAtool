// Sun & Wind Lab — climate.
// Built-in typical year for Midtown Manhattan, assembled from published monthly normals:
//  - temperature: NOAA 1991–2020 normals, Central Park (mean daily max / min, °F)
//  - humidity: NOAA climatology, Central Park (mean relative humidity, %)
//  - solar: NREL NSRDB-style monthly mean daily global horizontal irradiation for New York City (kWh/m²/day)
//  - wind: approximate LaGuardia (LGA) 10 m wind rose and monthly means; LGA is the usual open-terrain reference for Midtown.
// Every value is a monthly typical value, not a measured hour. Load an EPW file to replace all of it with hourly data.

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// Klein's recommended mean day for each month (day of year), used for sun geometry.
export const MEAN_DAY = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];

const F = (f) => (f - 32) * 5 / 9;
const HI_F = [39.5, 42.2, 49.9, 61.8, 71.4, 79.7, 84.9, 83.3, 76.2, 64.5, 54.0, 44.3];
const LO_F = [26.9, 29.0, 35.3, 45.1, 54.8, 64.1, 69.9, 68.9, 62.3, 51.4, 41.5, 32.8];

// 16 compass points, FROM direction.
export const DIRS16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const ROSE_FREQ = [6.5, 5.0, 6.0, 5.0, 4.5, 3.5, 4.0, 4.5, 6.5, 6.5, 6.0, 6.0, 7.5, 8.5, 10.0, 9.5];
const ROSE_MEAN = [5.3, 5.6, 6.0, 5.8, 5.0, 4.3, 4.2, 4.6, 5.0, 5.2, 5.1, 5.4, 6.2, 6.8, 6.9, 5.9]; // m/s at 10 m

export const NYC = {
  id: 'nyc-typical',
  label: 'New York City · typical year (built-in)',
  source: 'NOAA 1991–2020 normals (Central Park), NREL solar resource, approximate LaGuardia wind rose',
  tHi: HI_F.map(F),
  tLo: LO_F.map(F),
  rh: [61, 60, 58, 56, 61, 64, 64, 66, 67, 65, 64, 64],
  ghiDay: [1.95, 2.80, 3.95, 4.95, 5.75, 6.15, 6.10, 5.40, 4.40, 3.15, 2.05, 1.65],
  windMean: [6.3, 6.4, 6.4, 6.0, 5.2, 4.9, 4.6, 4.6, 4.9, 5.4, 5.8, 6.2],
  // prevailing FROM direction by month (degrees true): north-westerlies in the cold half, south-westerlies in summer
  windDir: [315, 315, 315, 300, 200, 200, 200, 200, 45, 315, 315, 315],
  rose: DIRS16.map((d, i) => ({ dir: d, deg: i * 22.5, freq: ROSE_FREQ[i] / ROSE_FREQ.reduce((a, b) => a + b, 0), mean: ROSE_MEAN[i], k: 2.0 })),
  hourly: null,
};

// Hourly air temperature on a typical day: a cosine between the daily low (~6 am) and high (~3 pm).
export function airTemp(cl, m, hour) {
  if (cl.hourly) return cl.hourly.monthHour[m][hour].t;
  const hi = cl.tHi[m], lo = cl.tLo[m];
  const h = ((hour % 24) + 24) % 24;
  let x;
  if (h >= 6 && h <= 15) x = (1 - Math.cos(Math.PI * (h - 6) / 9)) / 2;
  else { const hh = h < 6 ? h + 24 : h; x = (1 + Math.cos(Math.PI * (hh - 15) / 15)) / 2; }
  return lo + (hi - lo) * x;
}

export function relHumidity(cl, m, hour) {
  if (cl.hourly) return cl.hourly.monthHour[m][hour].rh;
  return cl.rh[m];
}

// Vapour pressure (hPa) from temperature (°C) and RH (%).
export function vapourPressure(t, rh) {
  return rh / 100 * 6.105 * Math.exp(17.27 * t / (237.7 + t));
}

// Weibull scale from mean and shape.
export function weibullC(mean, k) {
  return mean / gamma(1 + 1 / k);
}
function gamma(z) {
  // Lanczos approximation
  const g = 7, p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1; let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// ---------------- EPW import ----------------
// Reads an EnergyPlus weather file and rebuilds every input above from its 8,760 hours:
// monthly-by-hour means for temperature, humidity and irradiance, and a 16-sector wind rose with Weibull fits.
export function parseEPW(text) {
  const lines = text.split(/\r?\n/);
  const head = lines[0].split(',');
  const loc = { city: head[1], country: head[3], lat: +head[6], lon: +head[7], tz: +head[8], elev: +head[9] };
  const rows = [];
  for (let i = 8; i < lines.length; i++) {
    const c = lines[i].split(',');
    if (c.length < 22) continue;
    rows.push({ m: +c[1] - 1, d: +c[2], h: +c[3] - 1, t: +c[6], rh: +c[8], ghi: +c[13], dni: +c[14], dhi: +c[15], wd: +c[20], ws: +c[21] });
  }
  if (rows.length < 8000) throw new Error(`Expected about 8,760 hourly rows, found ${rows.length}. Is this an EPW file?`);
  const acc = [...Array(12)].map(() => [...Array(24)].map(() => ({ t: 0, rh: 0, ghi: 0, dni: 0, dhi: 0, n: 0 })));
  const sectors = [...Array(16)].map(() => []);
  const monthWind = [...Array(12)].map(() => ({ s: 0, n: 0, sx: 0, sy: 0 }));
  for (const r of rows) {
    const a = acc[r.m][r.h];
    a.t += r.t; a.rh += r.rh; a.ghi += r.ghi; a.dni += r.dni; a.dhi += r.dhi; a.n++;
    if (r.ws > 0.3 && r.ws < 60) {
      sectors[Math.round(r.wd / 22.5) % 16].push(r.ws);
      const mw = monthWind[r.m]; mw.s += r.ws; mw.n++; mw.sx += r.ws * Math.sin(r.wd * Math.PI / 180); mw.sy += r.ws * Math.cos(r.wd * Math.PI / 180);
    }
  }
  const monthHour = acc.map((m) => m.map((a) => ({ t: a.t / a.n, rh: a.rh / a.n, ghi: a.ghi / a.n, dni: a.dni / a.n, dhi: a.dhi / a.n })));
  const total = sectors.reduce((s, x) => s + x.length, 0) || 1;
  const rose = sectors.map((sp, i) => {
    const mean = sp.length ? sp.reduce((a, b) => a + b, 0) / sp.length : 0.1;
    const sd = sp.length > 2 ? Math.sqrt(sp.reduce((a, b) => a + (b - mean) ** 2, 0) / (sp.length - 1)) : mean * 0.5;
    const k = Math.max(1.2, Math.min(4, Math.pow(sd / mean, -1.086))); // Justus moment fit
    return { dir: DIRS16[i], deg: i * 22.5, freq: sp.length / total, mean, k };
  });
  const tHi = monthHour.map((m) => Math.max(...m.map((h) => h.t)));
  const tLo = monthHour.map((m) => Math.min(...m.map((h) => h.t)));
  return {
    id: 'epw',
    label: `${loc.city}${loc.country ? ', ' + loc.country : ''} · EPW`,
    source: 'Uploaded EPW weather file (hourly)',
    loc,
    tHi, tLo,
    rh: monthHour.map((m) => m.reduce((s, h) => s + h.rh, 0) / 24),
    ghiDay: monthHour.map((m) => m.reduce((s, h) => s + h.ghi, 0) / 1000),
    windMean: monthWind.map((w) => (w.n ? w.s / w.n : 4)),
    windDir: monthWind.map((w) => ((Math.atan2(w.sx, w.sy) * 180 / Math.PI) + 360) % 360),
    rose,
    hourly: { monthHour },
  };
}
