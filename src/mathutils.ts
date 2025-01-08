export const PI2 = Math.PI + Math.PI;
const _S = Math.PI / 180.0;

/**
 * Convert arc-degrees to radians.
 * @param x - arc-degrees
 * @returns x in radians
 */
export function radians(x: number): number {
  return x * _S;
}

/**
 * Convert radians to arc-degrees.
 * @param x - radians
 * @returns x in arc-degrees
 */
export function degrees(x: number): number {
  return x / _S;
}

/**
 * Decompose a floating-point number.
 * The result always keeps sign of the argument, e.g.:
 * `modf(-5.5)` will produce `-0.5, -5.0`.
 *
 * @param x a number
 * @returns decimal and integer part of x
 * @example
 *
 * ```ts
 * modf(-5.5)
 * ```
 * will produce `-0.5, -5.0`
 */
export function modf(x: number): [number, number] {
  const i = Math.trunc(x);
  return [x - i, i];
}

/**
 * Calculates polynome: a1 + a2*t + a3*t*t + a4*t*t*t...
 *
 *
 * @param t - number of Julian centuries elapsed since 1900, Jan 0.5
 * @param terms - list of coefficients
 * @returns result of the expression
 *
 * @example
 * ```ts
 * polynome(10.0, 1.0, 2.0, 3.0)
 * ```
 * gives `321.0`.
 */
export function polynome(t: number, ...terms: number[]): number {
  return terms.reverse().reduce((a, b) => a * t + b);
}

/**
 * Reduces x to 0 >= x < r
 * @param x - a number
 * @param r - range
 * @returns
 */
export function toRange(x: number, r: number): number {
  const a = x % r;
  return a < 0 ? a + r : a;
}

/**
 * Reduces x to `0 >= x < 360`.
 * @param x a number
 * @returns number in range 0 - 360
 */
export function reduceDeg(x: number): number {
  return toRange(x, 360.0);
}

/**
 * Reduces x to `0 >= x <  PI * 2`.
 * @param x a number
 * @returns number in range 0 - PI * 2
 */
export function reduceRad(x: number): number {
  return toRange(x, PI2);
}

/**
 * Fractional part of number.
 * @param x - a number
 * @returns fractional part of x.
 *
 * The result always keeps sign of the argument, e.g.: `frac(-5.5) = -0.5`
 */
export function frac(x: number): number {
  const res = Math.abs(x) % 1.0;
  return x < 0 ? -res : res;
}

/**
 * Range function. Used with polinomial function for better accuracy.
 * @param x - a number
 * @returns number in range 0 - 360
 */
export function frac360(x: number): number {
  return frac(x) * 360;
}

/**
 * Convert decimal to sexagesimal values.
 *
 * @param d - hours or degrees
 * @param m - minutes
 * @param s - seconds, optional, defaut 0
 * @returns decimal hours (or degrees)
 */
export function ddd(d: number, m: number, s: number = 0): number {
  const sgn = d < 0 || m < 0 || s < 0 ? -1 : 1;
  return (Math.abs(d) + (Math.abs(m) + Math.abs(s) / 60.0) / 60.0) * sgn;
}

/**
 * Convert decimal number to sexagesimal values.
 * @param x - decimal number
 * @returns [degrees, minutes, seconds]
 */
export function dms(x: number): [number, number, number] {
  let [f, i] = modf(Math.abs(x));
  let d = i;
  [f, i] = modf(f * 60);
  let m = i;
  [f, i] = modf(f * 60);
  let s = f + i;

  if (x < 0) {
    if (d != 0) {
      d = -d;
    } else if (m != 0) {
      m = -m;
    } else {
      s = -s;
    }
  }
  return [d, m, s];
}

/**
 * Convert decimal degrees to sexagesimal with zodiac sign index.
 * @param x - arc-degrees
 * @returns  zodiac sign number (zero based), zodiac degrees, minutes and seconds
 */
export function zdms(x: number): [number, number, number, number] {
  const [d, m, s] = dms(x);
  return [Math.trunc(d / 30), d % 30, m, s];
}

/**
 * Calculate shortest arc in dergees between two ponts in degrees.
 * @param a - the first angle, degrees
 * @param b - the second angle, degrees
 * @returns - shothest distance, degrees
 */
export function shortestArc(a: number, b: number): number {
  const x = Math.abs(a - b);
  return x > 180 ? 360 - x : x;
}

/**
 * Calculate shortest arc in radians between two ponts in degrees.
 * @param a - the first angle, radians
 * @param b - the second angle, radians
 * @returns - shothest distance, radians
 */
export function shortestArcRad(a: number, b: number): number {
  const x = Math.abs(a - b);
  return x > Math.PI ? PI2 - x : x;
}

/**
 * Angle `b - a`, accounting for circular values.
 * Parameters a and b should be in the range `0..360`. The
 * result will be in the range `-180..180`.
 *
 * This allows us to directly compare angles which cross through 0:
 * `359 degrees... 0 degrees... 1 degree...` etc.
 *
 * @param a - the first angle, in arc-degrees
 * @param b - the second angle, in arc-degrees
 * @returns - difference, arc-degrees
 */
export function diffAngle(a: number, b: number): number {
  const x = b < a ? b + 360 - a : b - a;
  return x > 180 ? x - 360 : x;
}

/**
 * Polar coordinates
 */
export interface Polar {
  /** Radial coordinate */
  rho: number;
  /** Angular coordinate */
  phi: number;
}

export const sin = Math.sin;
export const cos = Math.cos;
export const tan = Math.tan;
export const atan = Math.atan;
export const asin = Math.asin;
export const acos = Math.acos;
export const sqrt = Math.sqrt;
export const floor = Math.floor;
export const trunc = Math.trunc;
export const round = Math.round;
export const atan2 = Math.atan2;
