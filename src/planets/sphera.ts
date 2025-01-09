import { Polar, radians, reduceRad } from '../mathutils';
import { nutation, NutationRecord, obliquity } from '../nutobliq';
import * as sun from '../sun';
import { DAYS_PER_CENT, deltaT } from '../timeutils';
import { instantiate, OrbitInstance } from './orbit';
import { Planet, PlanetId } from './planet';

export class CelestialSphera {
  private _auxSun?: number[];
  private orbits: Map<PlanetId, OrbitInstance> = new Map();

  /** Private constructor */
  private constructor(
    public t: number,
    public sunGeo: Polar,
    public manomSun: number,
    public nut: NutationRecord,
    public apparent: boolean,
    public obliquity: number,
    public deltaT: number
  ) {}

  /**
   * Auxiliraly Sun-related elements needed for calculating perturbations.
   * @param t time in centuries since the epoch 1900,0.
   * @returns
   */
  private buildAuxSun(): number[] {
    const x = [0, 0, 0, 0, 0, 0];
    const t = this.t;
    x[0] = t / 5 + 0.1;
    x[1] = reduceRad(4.14473 + 5.29691e1 * t);
    x[2] = reduceRad(4.641118 + 2.132991e1 * t);
    x[3] = reduceRad(4.250177 + 7.478172 * t);
    x[4] = 5 * x[2] - 2 * x[1];
    x[5] = 2 * x[1] - 6 * x[2] + 3 * x[3];

    return x;
  }

  /**
   * Factory that substitutes the constructor.
   * @param djd
   * @param apparent
   * @returns
   */
  public static forDJD(djd: number, apparent: boolean = true): CelestialSphera {
    const dt = deltaT(djd);
    const t = (djd + dt / 86400.0) / DAYS_PER_CENT;
    const ms = sun.meanAnomaly(t);
    const nu = nutation(t);
    const ob = obliquity(djd, nu.deltaEps);
    return new CelestialSphera(t, sun.trueGeocentric(t, ms), radians(ms), nu, apparent, ob, dt);
  }

  /**
   * Auxiliraly Sun-related elements needed for calculating perturbations.
   * Once calculated, the values are cached.
   */
  get auxSun(): number[] {
    this._auxSun ??= this.buildAuxSun();
    return this._auxSun;
  }

  /// Given [id] of a planet, return its mean anomaly **in radians**.
  /// [dt] parameter is a time correction necessary when calculating
  /// *true* (light-time corrected) planetary positions.

  getMeanAnomaly(id: PlanetId, dt: number = 0): number {
    const oi = this.getOrbitInstance(id);
    let ma = oi.ma;
    if (dt != 0) {
      ma -= radians(dt * oi.dm);
    }
    return ma;
  }

  /// Given [id] of a planet, return its orbit instantiated for a given moment.
  /// Once calculated, the `OrbitInstance` record is saved to the cache.
  getOrbitInstance(id: PlanetId): OrbitInstance {
    if (this.orbits.has(id)) {
      return this.orbits.get(id)!;
    }

    const oi = instantiate(this.t, Planet.forId(id).orbit);
    this.orbits.set(id, oi);
    return oi;
  }
}
