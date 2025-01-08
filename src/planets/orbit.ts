import { frac360, polynome, radians, reduceDeg } from '../mathutils';
import { DAYS_PER_CENT } from '../timeutils';

/** Terms (orbital parameters) */
export class Terms {
  public readonly terms;

  constructor(a: number, ...terms: number[]) {
    this.terms = [a, ...terms];
  }

  /**
   * Instaniate osculating elements for a given moment.
   * @param t - time in centuries since the epoch 1900,0.
   * @returns result
   */
  public assemble(t: number): number {
    return reduceDeg(polynome(t, ...this.terms));
  }
}

/**  Mean Lonitude, a special case of Terms */
export class MLTerms extends Terms {
  constructor(a: number, b: number = 0, c: number = 0, d: number = 0) {
    super(a, b, c, d);
  }

  /**
   * The mean longitude increases by 360 deg. for every rotation of a planet
   * about the Sun. In order to preserve accuracy, it is is expressed in such
   * a manner that integer rotations are subtracted from the second term of the
   * expression  before adding the other terms.
   *
   * @param t time in centuries since the epoch 1900,0.
   */
  public override assemble(t: number): number {
    const b = frac360(this.terms[1] * t);
    return reduceDeg(
      this.terms[0] + b + (this.terms[3] * t + this.terms[2]) * t * t
    );
  }
}

/**
 * A record holding an orbit instantiated for a given moment of time.
 * All angular values are in radians.
 */
export type OrbitInstance = {
  ph: number, // argument of perihelion
  s: number, // eccentricity
  nd: number, // ascending node
  ic: number, // inclination
  sa: number, // major semi-axis
  ma: number, // mean anomaly
  dm: number, // mean daily motion
}

/**  Osculating elements of an orbit. */
export type OElements = {
  /** mean longitude */
  ML: MLTerms,
  /** argument of perihelion */
  PH: Terms,
  /** eccentricity */
  EC: Terms,
  /** inclination */
  IN: Terms,
  /** ascending node */
  ND: Terms,
  /** major semiaxis  */
  SA: number
}

/**
 * Instantiate orbit for a given moment.
 * @param t - Julian centuries since 1900 Jan, 0.5.
 * @param e - orbital elements
 * @returns - OrbitInstance record
 */
export function instantiate(t: number, e: OElements): OrbitInstance {
  const ph = e.PH.assemble(t);
  const dm =
    e.ML.terms[1] * 9.856263e-3 +
    (e.ML.terms[2] + e.ML.terms[3]) / DAYS_PER_CENT;
  return {
    ph: radians(ph),
    s: e.EC.assemble(t),
    nd: radians(e.ND.assemble(t)),
    ic: radians(e.IN.assemble(t)),
    sa: e.SA,
    ma: radians(reduceDeg(e.ML.assemble(t) - ph)),
    dm: radians(dm),
  };
}
