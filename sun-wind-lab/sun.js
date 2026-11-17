// Sun & Wind Lab — sun position and irradiance.
// Sun position: NOAA solar calculator equations (accurate to about 0.01° for present-day dates).
// Irradiance: Haurwitz clear-sky shape scaled to the month's measured mean daily total, split into beam and diffuse
// with the Erbs correlation. With an EPW loaded, measured hourly GHI / DNI / DHI are used instead.

import { MEAN_DAY, DAYS_IN_MONTH } from './climate.js';

const rad = Math.PI / 180;

// US Eastern time: EST (UTC−5), EDT (UTC−4) from the second Sunday in March to the first Sunday in November.
export function easternOffset(year, month0, day, hour) {
  const nthSunday = (m, n) => { const d = new Date(Date.UTC(year, m, 1)); const first = (7 - d.getUTCDay()) % 7 + 1; return first + 7 * (n - 1); };
  const start = nthSunday(2, 2), end = nthSunday(10, 1);
  const t = month0 * 100 + day + hour / 24;
  const dst = t >= 2 * 100 + start + 2 / 24 && t < 10 * 100 + end + 1 / 24;
  return dst ? -4 : -5;
}

export function sunPosition(date, lat, lon) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = Math.sin(M * rad) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * rad) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * rad) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * rad);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * rad);
  const decl = Math.asin(Math.sin(eps * rad) * Math.sin(lambda * rad)) / rad;
  const y = Math.tan(eps / 2 * rad) ** 2;
  const eqTime = 4 / rad * (y * Math.sin(2 * L0 * rad) - 2 * e * Math.sin(M * rad) + 4 * e * y * Math.sin(M * rad) * Math.cos(2 * L0 * rad) - 0.5 * y * y * Math.sin(4 * L0 * rad) - 1.25 * e * e * Math.sin(2 * M * rad));
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  let tst = (minutes + eqTime + 4 * lon) % 1440; if (tst < 0) tst += 1440;
  let ha = tst / 4 - 180; if (ha < -180) ha += 360;
  const cosZ = Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(ha * rad);
  const zen = Math.acos(Math.max(-1, Math.min(1, cosZ))) / rad;
  let az;
  const sz = Math.sin(zen * rad);
  if (sz < 1e-6) az = 180;
  else {
    const ca = ((Math.sin(lat * rad) * Math.cos(zen * rad)) - Math.sin(decl * rad)) / (Math.cos(lat * rad) * sz);
    az = Math.acos(Math.max(-1, Math.min(1, ca))) / rad;
    az = ha > 0 ? (az + 180) % 360 : (540 - az) % 360;
  }
  let el = 90 - zen;
  // atmospheric refraction (small, matters only near the horizon)
  if (el > -0.575 && el < 85) {
    const te = Math.tan(el * rad);
    const r = el > 5 ? 58.1 / te - 0.07 / te ** 3 + 0.000086 / te ** 5 : 1735 + el * (-518.2 + el * (103.4 + el * (-12.79 + el * 0.711)));
    el += r / 3600;
  }
  return { az, el, decl };
}

// Local clock time in New York → Date (UTC).
export function nyDate(year, month0, day, hour, minute = 0) {
  const off = easternOffset(year, month0, day, hour);
  return new Date(Date.UTC(year, month0, day, hour - off, minute));
}

export function dayOfYearToMonthDay(doy) {
  let m = 0; let d = doy;
  while (m < 11 && d > DAYS_IN_MONTH[m]) { d -= DAYS_IN_MONTH[m]; m++; }
  return { m, d };
}

// Extraterrestrial normal irradiance (W/m²) for a day of year.
function g0n(doy) { return 1367 * (1 + 0.033 * Math.cos(2 * Math.PI * doy / 365)); }

// Erbs diffuse fraction from the clearness index.
function erbs(kt) {
  if (kt <= 0.22) return 1 - 0.09 * kt;
  if (kt <= 0.8) return 0.9511 - 0.1604 * kt + 4.388 * kt ** 2 - 16.638 * kt ** 3 + 12.336 * kt ** 4;
  return 0.165;
}

const cache = new Map();
// Representative day for month m: 24 hourly records at mid-hour (clock time), with sun position and irradiance.
export function monthDay(cl, site, m, year = 2026) {
  const key = `${cl.id}|${m}|${site.lat}|${site.lon}`;
  if (cache.has(key)) return cache.get(key);
  const doy = MEAN_DAY[m];
  const { d } = dayOfYearToMonthDay(doy);
  const hours = [];
  for (let h = 0; h < 24; h++) {
    const pos = sunPosition(nyDate(year, m, d, h, 30), site.lat, site.lon);
    const cz = Math.sin(Math.max(0, pos.el) * rad);
    hours.push({ h, az: pos.az, el: pos.el, decl: pos.decl, cz, clear: pos.el > 0 ? 1098 * cz * Math.exp(-0.057 / Math.max(cz, 0.02)) : 0 });
  }
  if (cl.hourly) {
    for (const r of hours) {
      const x = cl.hourly.monthHour[m][r.h];
      r.ghi = r.el > 0 ? x.ghi : 0; r.dni = r.el > 0 ? x.dni : 0; r.dhi = r.el > 0 ? x.dhi : 0;
    }
  } else {
    const clearSum = hours.reduce((s, r) => s + r.clear, 0);
    const scale = clearSum > 0 ? cl.ghiDay[m] * 1000 / clearSum : 0;
    // Monthly-mean diffuse fraction from the monthly clearness index (Erbs et al. 1982, monthly form). Applying the
    // hourly Erbs curve to averaged hours would blur clear and cloudy days together and understate the beam.
    const decl = hours[12].decl ?? 0;
    const phi = site.lat * rad, dl = decl * rad;
    const ws = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(dl))));
    const H0 = 24 / Math.PI * g0n(doy) * (Math.cos(phi) * Math.cos(dl) * Math.sin(ws) + ws * Math.sin(phi) * Math.sin(dl));
    const KT = Math.min(0.8, cl.ghiDay[m] * 1000 / H0);
    const Kd = ws <= 81.4 * rad ? 1.391 - 3.560 * KT + 4.189 * KT ** 2 - 2.137 * KT ** 3 : 1.311 - 3.022 * KT + 3.427 * KT ** 2 - 1.821 * KT ** 3;
    for (const r of hours) {
      r.ghi = r.clear * scale;
      if (r.el <= 0 || r.ghi <= 0) { r.ghi = r.dni = r.dhi = 0; continue; }
      // low sun: fall back to the hourly correlation so dawn and dusk stay mostly diffuse
      const kt = Math.min(1, r.ghi / (g0n(doy) * r.cz));
      const fd = r.el < 8 ? Math.max(Kd, erbs(kt)) : Kd;
      r.dhi = r.ghi * fd;
      r.dni = Math.min(1000, (r.ghi - r.dhi) / Math.max(r.cz, 0.05));
    }
  }
  cache.set(key, hours);
  return hours;
}
export function clearCache() { cache.clear(); }

// Sun path for drawing: hourly positions on any date, plus the analemma-free day arc.
export function dayArc(site, year, month0, day, stepMin = 10) {
  const pts = [];
  for (let t = 0; t <= 24 * 60; t += stepMin) {
    const p = sunPosition(nyDate(year, month0, day, Math.floor(t / 60), t % 60), site.lat, site.lon);
    pts.push({ t, ...p });
  }
  return pts;
}
