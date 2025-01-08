/// Kepler equation

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
    const dla = ea - s * Math.sin(ea) - m;
    if (Math.abs(dla) < delta) {
      return ea;
    }
    return solve(ea - dla / (1 - s * Math.cos(ea)));
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
  return 2 * Math.atan(Math.sqrt((1 + s) / (1 - s)) * Math.tan(ea / 2));
}
