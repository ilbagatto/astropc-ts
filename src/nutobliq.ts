/**
 * Calculates:
 * 1. Obliquity of the ecliptic.
 * 2. Effects of nutation with accuracy of about 1 arcsecond.
 *
 * Source: P.Duffett-Smith, "Astronomy with Your PC", 2 edition.
 *
 */

import { cos, frac360, radians, sin } from './mathutils';
import { DAYS_PER_CENT } from './timeutils';

export interface NutationRecord {
  /** Nutation in longitude, arc-degrees */
  deltaPsi: number;
  /** Nutation in obliquity, arc-degrees */
  deltaEps: number;
}

/**
 * Nutation in longitude and obliquity of the Ecliptic.
 * @param t - Julian centuries since 1900 Jan, 0.5.
 * @returns NutationRecord
 */
export function nutation(t: number): NutationRecord {
  const t2 = t * t;

  const ls = radians(2.796967e2 + 3.03e-4 * t2 + frac360(1.000021358e2 * t));
  const ms = radians(3.584758e2 - 1.5e-4 * t2 + frac360(9.999736056e1 * t));
  const ld = radians(2.704342e2 - 1.133e-3 * t2 + frac360(1.336855231e3 * t));
  const md = radians(2.961046e2 + 9.192e-3 * t2 + frac360(1.325552359e3 * t));
  const nm = radians(2.591833e2 + 2.078e-3 * t2 - frac360(5.372616667 * t));
  const tls = ls + ls;
  const tld = ld + ld;
  const tnm = nm + nm;

  let dpsi =
    (-17.2327 - 1.737e-2 * t) * sin(nm) +
    (-1.2729 - 1.3e-4 * t) * sin(tls) +
    2.088e-1 * sin(tnm) -
    2.037e-1 * sin(tld) +
    (1.261e-1 - 3.1e-4 * t) * sin(ms) +
    6.75e-2 * sin(md) -
    (4.97e-2 - 1.2e-4 * t) * sin(tls + ms) -
    3.42e-2 * sin(tld - nm) -
    2.61e-2 * sin(tld + md) +
    2.14e-2 * sin(tls - ms) -
    1.49e-2 * sin(tls - tld + md) +
    1.24e-2 * sin(tls - nm) +
    1.14e-2 * sin(tld - md);
  dpsi /= 3600;

  let deps =
    (9.21 + 9.1e-4 * t) * cos(nm) +
    (5.522e-1 - 2.9e-4 * t) * cos(tls) -
    9.04e-2 * cos(tnm) +
    8.84e-2 * cos(tld) +
    2.16e-2 * cos(tls + ms) +
    1.83e-2 * cos(tld - nm) +
    1.13e-2 * cos(tld + md) -
    9.3e-3 * cos(tls - ms) -
    6.6e-3 * cos(tls - nm);
  deps /= 3600;

  return {
    deltaPsi: dpsi,
    deltaEps: deps,
  }; //  1965-2-1 11:46 dpsi = -0.0042774118548615766
}

/**
 * Obliquity of ecliptic.
 * Without the second argument, return mean obliquity.
 *
 * @param djd - number of Julian days since 1900 Jan. 0.5.
 * @param deps - nutation in ecliptic obliquity in degrees
 * @returns - arc-degrees
 */
export function obliquity(djd: number, deps: number = 0.0): number {
  const t = djd / DAYS_PER_CENT;
  const c = ((-0.00181 * t + 0.0059) * t + 46.845) * t;
  return 23.45229444 - c / 3600 + deps;
}
