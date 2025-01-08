import { acos, asin, atan2, cos, degrees, PI2, radians, reduceRad, sin, tan } from './mathutils';

interface Spherical2D {
  a: number;
  b: number;
}

/** Coordinates types. */
export enum CoordsType {
  Ecliptical,
  Equatorial,
  Horizontal,
}

enum EquEclConversionType {
  EquToEcl = 1,
  EclToEqu = -1,
}

/**
 *  Convert between longitude/right ascension and latitude/declination.
 *
 * @param x - longitude or right ascension, radians
 * @param y - latitude or declination, radians
 * @param e - obliquity of the ecliptic, radians
 * @param type - conversion direction
 * @returns the pair of result coordinates in radians
 */
function equecl(x: number, y: number, e: number, type: EquEclConversionType): Spherical2D {
  const k = type.valueOf();
  const sinE = sin(e);
  const cosE = cos(e);
  const sinX = sin(x);
  const a = reduceRad(atan2(sinX * cosE + k * (tan(y) * sinE), cos(x)));
  const b = asin(sin(y) * cosE - k * (cos(y) * sinE * sinX));
  return { a, b };
}

/**
 *  Convert between azimuth/altitude and hour-angle/declination.
 *
 *  The equations are symmetrical in the two pairs of coordinates so that
 *  exactly the same code may be used to convert in either direction, there
 *  is no need to specify direction with a swich (see Dufett-Smith, page 35).
 * @param x - azimuth or altitude
 * @param y - hour-angle or declination
 * @param phi - geographical latitude, radians
 * @returns - pair of result coordinates, radians
 */
function equhor(x: number, y: number, phi: number): Spherical2D {
  const sx = sin(x);
  const sy = sin(y);
  const sphi = sin(phi);
  const cx = cos(x);
  const cy = cos(y);
  const cphi = cos(phi);
  const sq = sy * sphi + cy * cphi * cx;
  const q = asin(sq);
  const cp = (sy - sphi * sq) / (cphi * cos(q));
  let p = acos(cp);
  if (sx > 0) {
    p = PI2 - p;
  }
  return { a: p, b: q };
}

/**
 * Intermediate function, converts radians to arc-degrees.
 *
 * @param x - the first coordinate, arc-degrees
 * @param y - the second coordinate, arc-degrees
 * @param e - obliquity of the ecliptic, arc-degrees
 * @param type - conversion direction
 * @returns pair of result coordinates, arc-degrees
 */
function convertEquEcl(x: number, y: number, e: number, type: EquEclConversionType): Spherical2D {
  const { a, b } = equecl(radians(x), radians(y), radians(e), type);
  return { a: degrees(a), b: degrees(b) };
}

/**
 * Intermediate function, converts radians to arc-degrees.
 *
 * @param x - the first coordinate, arc-degrees
 * @param y - the second coordinate, arc-degrees
 * @param phi - geographical latitude, arc-degrees
 * @returns pair of result coordinates, arc-degrees
 */
function convertEquHor(x: number, y: number, phi: number): Spherical2D {
  const { a, b } = equhor(radians(x), radians(y), radians(phi));
  return { a: degrees(a), b: degrees(b) };
}

/**
 *  Convert equatorial to ecliptical coordinates.
 *
 * @param alpha - right ascension, arc-degrees
 * @param delta - declination, arc-degrees
 * @param eps - obliquity of the ecliptic, arc-degrees
 * @returns - the pair of ecliptic coordinates, `(lambda, beta)`, in arc-degrees.
 */
export function equ2ecl(alpha: number, delta: number, eps: number): [number, number] {
  const { a, b } = convertEquEcl(alpha, delta, eps, EquEclConversionType.EquToEcl);
  return [a, b];
}

/**
 *  Convert ecliptical to equatorial coordinates.
 *
 * @param lambda - longiude
 * @param beta - latitude
 * @param eps - obliquity of the ecliptic
 * @returns the pair of equatorial coordinates, `[alpha, delta]`, arc-degrees.
 */
export function ecl2equ(lambda: number, beta: number, eps: number): [number, number] {
  const { a, b } = convertEquEcl(lambda, beta, eps, EquEclConversionType.EclToEqu);
  return [a, b];
}

/**
 * Convert equatorial to horizontal coordinates.
 *
 * @param h - the local hour angle, in degrees, measured westwards from the South. `h = LST - RA` (RA = Right Ascension)
 * @param delta - declination, arc-degrees
 * @param phi - the observer's latitude , positive in the Nothern, arc-degrees
 * @returns the pair of coordinates, [azimuth, altitude]
 *
 * Azimuth is  measured westward from the South.
 * Altitude is positive above the horizon
 */
export function equ2hor(h: number, delta: number, phi: number): [number, number] {
  const { a, b } = convertEquHor(h, delta, phi);
  return [a, b];
}

/**
 *  Convert horizontal to equatorial coordinates.
 *
 *  Arguments:
 *  1. [az]: azimuth, in radians, measured westwards from the South.
 *     `h = LST - RA` (RA = Right Ascension)
 *  2. alt: altitude, in radians, positive above the horizon
 *  3. phi: the observer's latitude, in radians, positive in the nothern
 *     hemisphere, negative in the southern one
 *
 *  Returns the pair of coordinates:
 *  1. *hour angle*, in degrees
 *  2. *declination*, in degrees
 * @param az
 * @param alt
 * @param phi
 * @returns
 */
export function hor2equ(az: number, alt: number, phi: number): [number, number] {
  const { a, b } = convertEquHor(az, alt, phi);
  return [a, b];
}
