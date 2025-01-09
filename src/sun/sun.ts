import { eccentricAnomaly, trueAnomaly } from '../kepler';
import {
  cos,
  degrees,
  floor,
  frac360,
  PI2,
  Polar,
  polynome,
  radians,
  reduceDeg,
  sin,
} from '../mathutils';
import { nutation } from '../nutobliq';
import { DAYS_PER_CENT } from '../timeutils';

const ABERRATION = 5.69e-3; // aberration in degrees

/**
 * Mean longitude of the Sun
 * @param t - Julian centuries since 1900 Jan, 0.5.
 * @returns arc-degrees
 */
export function meanLongitude(t: number): number {
  return reduceDeg(2.7969668e2 + 3.025e-4 * t * t + frac360(1.000021359e2 * t));
}

/**
 *
 * @param t -  Julian centuries since 1900 Jan, 0.5.
 * @returns arc-degrees
 */
export function meanAnomaly(t: number): number {
  return reduceDeg(3.5847583e2 - (1.5e-4 + 3.3e-6 * t) * t * t + frac360(9.999736042e1 * t));
}

/**
 * True geocentric longitude of the Sun for the mean equinox of date (degrees),
 * and the Sun-Earth distance (AU) for moment [t]
 *
 * @param t - Julian centuries since 1900 Jan, 0.5.
 * @param ms mean anomaly of the Sun, optional;  if not provided, will be calculated automatically
 * @returns Polar coordinates of the Sun.
 */
export function trueGeocentric(t: number, ms?: number): Polar {
  ms ??= meanAnomaly(t);
  const ls = meanLongitude(t);
  const ma = radians(ms);
  const s = polynome(t, 1.675104e-2, -4.18e-5, -1.26e-7); // eccentricity
  const ea = eccentricAnomaly(s, ma - PI2 * floor(ma / PI2)); // eccentric anomaly
  const nu = trueAnomaly(s, ea); // true anomaly
  const t2 = t * t;

  const calcPert = (a: number, b: number): number => radians(a + frac360(b * t));

  const a = calcPert(153.23, 6.255209472e1); // Venus
  const b = calcPert(216.57, 1.251041894e2); // ?
  const c = calcPert(312.69, 9.156766028e1); // ?
  const d = calcPert(350.74 - 1.44e-3 * t2, 1.236853095e3); // Moon
  const h = calcPert(353.4, 1.831353208e2); // ?
  const e = radians(231.19 + 20.2 * t); // inequality of long period

  // correction in orbital longitude
  const dl =
    1.34e-3 * cos(a) + 1.54e-3 * cos(b) + 2e-3 * cos(c) + 1.79e-3 * sin(d) + 1.78e-3 * sin(e);
  // correction in radius-vector
  const dr =
    5.43e-6 * sin(a) + 1.575e-5 * sin(b) + 1.627e-5 * sin(c) + 3.076e-5 * cos(d) + 9.27e-6 * sin(h);
  const lsn = reduceDeg(degrees(nu) + ls - ms + dl);
  const rsn = 1.0000002 * (1 - s * cos(ea)) + dr;
  return { phi: lsn, rho: rsn };
}

/**
 * Apparent position of the Sun, with respect of nutation, aberration
 * and optionally, light-time travel.
 * @param djd - Julian centuries since 1900 Jan, 0.5.
 * @param options: { dpsi: nutation in longitude, optional, ignoreLightTravel: true }
 * @returns
 */
export function apparent(djd: number, options?: { dpsi?: number; ignoreLightTravel?: boolean }): Polar {
  options ??= {};
  options.ignoreLightTravel ??= true;
  const t = djd / DAYS_PER_CENT;
  options.dpsi ??= nutation(t).deltaPsi;
  const tGeo = trueGeocentric(t);
  

  let lambda = tGeo.phi + options.dpsi!; // nutation
  lambda -= ABERRATION; // aberration

  if (!options.ignoreLightTravel) {
    const dt = 1.365 * tGeo.rho; // seconds
    lambda -= (dt * 15) / 3600; // convert to degrees and substract
  }
  return { phi: lambda, rho: tGeo.rho };
}
