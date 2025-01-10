/// Kepler equation

import { abs, atan, cos, sin, sqrt, tan } from './mathutils';

/**
 * Solve Kepler equation.
 *
 * @param s - eccentricity
 * @param m -  mean anomaly, radians
 * @returns - eccentric anomaly
 */
export function eccentricAnomaly(s: number, m: number): number {
  const delta = 1e-7; // minimal precision
  const solve = (ea: number): number => {
    const dla = ea - s * sin(ea) - m;
    if (abs(dla) < delta) {
      return ea;
    }
    return solve(ea - dla / (1 - s * cos(ea)));
  };

  return solve(m);
}

/**
 * Given eccentricity and eccentric anomaly, find true anomaly.
 * @param s - eccentricity
 * @param ea - eccentric anomaly
 * @returns true anomaly
 */
export function trueAnomaly(s: number, ea: number): number {
  return 2 * atan(sqrt((1 + s) / (1 - s)) * tan(ea / 2));
}
