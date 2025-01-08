/**
 * Ecliptical coordinates.
 */
export interface EclipticCoords {
  /**celestial longitude, degrees */
  lambda: number;
  /** celestial latitude, degrees */
  beta: number;
  /** distance from Earth, A.U. */
  delta: number;
}
