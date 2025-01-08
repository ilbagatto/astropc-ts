import { Polar, radians } from '../mathutils';
import { nutation, NutationRecord, obliquity } from '../nutobliq';
import * as sun from '../sun';
import { DAYS_PER_CENT, deltaT } from '../timeutils';
import { instantiate, OrbitInstance } from './orbit';
import { buildAuxSun } from './pert';
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
   * Factory that substitutes the constructor.
   * @param djd
   * @param apparent
   * @returns
   */
  public static forDJD(djd: number, apparent: boolean = true):CelestialSphera {
    const dt = deltaT(djd);
    const t = (djd + dt / 86400.0) / DAYS_PER_CENT;
    const ms = sun.meanAnomaly(t);
    const nu = nutation(t);
    const ob = obliquity(djd, nu.deltaEps);
    return new CelestialSphera(
      t,
      sun.trueGeocentric(t, ms),
      radians(ms),
      nu,
      apparent,
      ob,
      dt
    );
  }

  /**
   * Auxiliraly Sun-related elements needed for calculating perturbations.
   * Once calculated, the values are cached.
   */
  get auxSun(): number[] {
    this._auxSun ??= buildAuxSun(this.t);
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
