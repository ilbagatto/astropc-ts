import { EclipticCoords } from '../common';
import { eccentricAnomaly, trueAnomaly } from '../kepler';
import { asin, atan, atan2, cos, degrees, radians, reduceRad, sin, sqrt } from '../mathutils';
import { instantiate, MLTerms, OElements, OrbitInstance, Terms } from './orbit';
import {
  PertCalculator,
  PertJupiter,
  PertMars,
  PertMercury,
  PertNeptune,
  PertPluto,
  PertRecord,
  PertSaturn,
  PertUranus,
  PertVenus,
} from './pert';
import { CelestialSphera } from './sphera';

/** Planets identifiers */
export enum PlanetId {
  Mercury,
  Venus,
  Mars,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
  Pluto,
}

export const AllPlanets = [
  PlanetId.Mercury,
  PlanetId.Venus,
  PlanetId.Mars,
  PlanetId.Jupiter,
  PlanetId.Saturn,
  PlanetId.Uranus,
  PlanetId.Neptune,
  PlanetId.Pluto,
];

// Params of calculated planetary heliocentric orbit
type HelioRecord = {
  ll: number;
  rpd: number;
  lpd: number;
  spsi: number;
  cpsi: number;
  rho: number;
};

export class Planet {
  /// Constructor
  private constructor(
    public id: PlanetId,
    public name: string,
    public orbit: OElements,
    public isInner: boolean,
    public pertCalculator: PertCalculator
  ) {}

  public toString() {
    return this.name;
  }

  public static forId(id: PlanetId): Planet {
    switch (id) {
      case PlanetId.Mercury:
        return new Planet(
          id,
          'Mercury',
          {
            ML: new MLTerms(178.179078, 415.2057519, 3.011e-4),
            PH: new Terms(75.899697, 1.5554889, 2.947e-4),
            EC: new Terms(2.0561421e-1, 2.046e-5, -3e-8),
            IN: new Terms(7.002881, 1.8608e-3, -1.83e-5),
            ND: new Terms(47.145944, 1.1852083, 1.739e-4),
            SA: 3.870986e-1,
          },
          true,
          new PertMercury()
        );
      case PlanetId.Venus:
        return new Planet(
          id,
          'Venus',
          {
            ML: new MLTerms(342.767053, 162.5533664, 3.097e-4),
            PH: new Terms(130.163833, 1.4080361, -9.764e-4),
            EC: new Terms(6.82069e-3, -4.774e-5, 9.1e-8),
            IN: new Terms(3.393631, 1.0058e-3, -1e-6),
            ND: new Terms(75.779647, 8.9985e-1, 4.1e-4),
            SA: 7.233316e-1,
          },
          true,
          new PertVenus()
        );
      case PlanetId.Mars:
        return new Planet(
          id,
          'Mars',
          {
            ML: new MLTerms(293.737334, 53.17137642, 3.107e-4),
            PH: new Terms(3.34218203e2, 1.8407584, 1.299e-4, -1.19e-6),
            EC: new Terms(9.33129e-2, 9.2064e-5, -7.7e-8),
            IN: new Terms(1.850333, -6.75e-4, 1.26e-5),
            ND: new Terms(48.786442, 7.709917e-1, -1.4e-6, -5.33e-6),
            SA: 1.5236883,
          },
          false,
          new PertMars()
        );
      case PlanetId.Jupiter:
        return new Planet(
          id,
          'Jupiter',
          {
            ML: new MLTerms(238.049257, 8.434172183, 3.347e-4, -1.65e-6),
            PH: new Terms(1.2720972e1, 1.6099617, 1.05627e-3, -3.43e-6),
            EC: new Terms(4.833475e-2, 1.6418e-4, -4.676e-7, -1.7e-9),
            IN: new Terms(1.308736, -5.6961e-3, 3.9e-6),
            ND: new Terms(99.443414, 1.01053, 3.5222e-4, -8.51e-6),
            SA: 5.202561,
          },
          false,
          new PertJupiter()
        );
      case PlanetId.Saturn:
        return new Planet(
          id,
          'Saturn',
          {
            ML: new MLTerms(266.564377, 3.398638567, 3.245e-4, -5.8e-6),
            PH: new Terms(9.1098214e1, 1.9584158, 8.2636e-4, 4.61e-6),
            EC: new Terms(5.589232e-2, -3.455e-4, -7.28e-7, 7.4e-10),
            IN: new Terms(2.492519, -3.9189e-3, -1.549e-5, 4e-8),
            ND: new Terms(112.790414, 8.731951e-1, -1.5218e-4, -5.31e-6),
            SA: 9.554747,
          },
          false,
          new PertSaturn()
        );
      case PlanetId.Uranus:
        return new Planet(
          id,
          'Uranus',
          {
            ML: new MLTerms(244.19747, 1.194065406, 3.16e-4, -6e-7),
            PH: new Terms(1.71548692e2, 1.4844328, 2.372e-4, -6.1e-7),
            EC: new Terms(4.63444e-2, -2.658e-5, 7.7e-8),
            IN: new Terms(7.72464e-1, 6.253e-4, 3.95e-5),
            ND: new Terms(73.477111, 4.986678e-1, 1.3117e-3),
            SA: 19.21814,
          },
          false,
          new PertUranus()
        );
      case PlanetId.Neptune:
        return new Planet(
          id,
          'Neptune',
          {
            ML: new MLTerms(84.457994, 6.107942056e-1, 3.205e-4, -6e-7),
            PH: new Terms(4.6727364e1, 1.4245744, 3.9082e-4, -6.05e-7),
            EC: new Terms(8.99704e-3, 6.33e-6, -2e-9),
            IN: new Terms(1.779242, -9.5436e-3, -9.1e-6),
            ND: new Terms(130.681389, 1.098935, 2.4987e-4, -4.718e-6),
            SA: 30.10957,
          },
          false,
          new PertNeptune()
        );

      case PlanetId.Pluto:
        return new Planet(
          id,
          'Pluto',
          {
            ML: new MLTerms(95.3113544, 3.980332167e-1),
            PH: new Terms(224.017),
            EC: new Terms(2.5515e-1),
            IN: new Terms(17.1329),
            ND: new Terms(110.191),
            SA: 39.8151,
          },
          false,
          new PertPluto()
        );
      default:
        throw new Error(`Unknown planet id: ${id}`);
    }
  }

  static forName(name: string): Planet {
    switch (name) {
      case 'Mercury':
        return Planet.forId(PlanetId.Mercury);
      case 'Venus':
        return Planet.forId(PlanetId.Venus);
      case 'Mars':
        return Planet.forId(PlanetId.Mars);
      case 'Jupiter':
        return Planet.forId(PlanetId.Jupiter);
      case 'Saturn':
        return Planet.forId(PlanetId.Saturn);
      case 'Uranus':
        return Planet.forId(PlanetId.Uranus);
      case 'Neptune':
        return Planet.forId(PlanetId.Neptune);
      case 'Pluto':
        return Planet.forId(PlanetId.Pluto);
    }

    throw new Error(`Unknown planet $name`);
  }

  /// Core part of heliocentric position calculation.
  /// [oi] are osculating elements of the obit instantiated for
  /// that moment.
  /// [ma] - mean anomaly of the planet
  /// [re] - Sun-Earth distance
  /// [lg] - lonitude of the Earth
  /// [pert] - PertRecord instance

  static calculateHeliocentric(
    oi: OrbitInstance,
    ma: number,
    re: number,
    lg: number,
    pert: PertRecord
  ): HelioRecord {
    const s = oi.s + pert.ds; // eccentricity corrected
    ma = reduceRad(ma + pert.dm); // mean anomaly corrected
    const ea = eccentricAnomaly(s, ma); // eccentric anomaly
    const nu = trueAnomaly(s, ea); // true anomaly
    // radius-vector
    const rp = ((oi.sa + pert.da) * (1 - s * s)) / (1 + s * cos(nu)) + pert.dr;
    const lp = nu + oi.ph + (pert.dml - pert.dm); // planet's orbital longitude
    const lo = lp - oi.nd;
    const sinLo = sin(lo);
    const spsi = sinLo * sin(oi.ic);
    const y = sinLo * cos(oi.ic);
    const psi = asin(spsi) + pert.dhl; // heliocentric latitude
    const lpd = atan2(y, cos(lo)) + oi.nd + radians(pert.dl);
    const cpsi = cos(psi);
    const ll = lpd - lg;
    // distance from the Earth
    const rho = sqrt(re * re + rp * rp - 2 * re * rp * cpsi * cos(ll));

    return {
      ll,
      rpd: rp * cpsi,
      lpd,
      spsi: sin(psi), // not the same as spsi, for now psi is corrected
      cpsi,
      rho,
    };
  }

  /// Calculates perturbations.
  /// [ctx] is a context, [dt] is optional `delta-T` in seconds.
  /// Typically, some members of the returned PertRecord instance are
  /// initialized while others contain zeroes.
  private calculatePerturbations(ctx: CelestialSphera, dt: number = 0): PertRecord {
    return this.pertCalculator.calculatePerturbations(ctx, dt);
  }

  /// Calculate heliocentric position taking account of the finit light-travel
  /// time between the Earth and the planet.
  ///
  /// This method is recursive.
  ///
  /// > When we view a planet now, we see it in the position it occupied t
  /// > hours ago, given by *t = 0.1386 x RH*, where RH is the distance in AU
  /// > between the Earth and the planet. In this routine, an approximate position
  /// > for the planet is first calculated, neglecting the light-travel time.
  /// > Then a second pass is made through the program using the light-travel
  /// > time based on the approximate position found on the first pass.
  /// > <cite>_Peter Duffett-Smith, p.137-138</cite>
  ///
  private getCorrectedHelio(
    ctx: CelestialSphera,
    oi: OrbitInstance,
    lg: number,
    rg: number,
    dt: number = 0,
    rho: number = 0
  ): HelioRecord {
    const ma = ctx.getMeanAnomaly(this.id, dt);
    const pert = this.calculatePerturbations(ctx, dt);
    const h = Planet.calculateHeliocentric(oi, ma, rg, lg, pert);
    if (dt == 0) {
      // take account of the finit light-travel time between the Earth and the planet.
      // h.rho is the Earth-planet distance
      return this.getCorrectedHelio(ctx, oi, lg, rg, h.rho * 5.775518e-3, h.rho);
    }
    return {
      ll: h.ll,
      rpd: h.rpd,
      lpd: h.lpd,
      spsi: h.spsi, // not the same as spsi, for now psi is corrected
      cpsi: h.cpsi,
      rho: rho,
    };
  }

  /**
   * Geocentric position.
   *
   * If ctx.apparent is true, then the result will be
   * an apparent position, reffered to true equinox of the date
   * and with respect to aberration. Otherwise, the method will
   * return true geometric position.
   *
   * @param ctx - CestialSphera instance, the context
   * @returns EclipticCoords record.
   */
  geocentricPosition(ctx: CelestialSphera): EclipticCoords {
    const sg = ctx.sunGeo;
    // convert logitude of the Sun to Earth's position
    const lg = radians(sg.phi) + Math.PI;
    const rsn = sg.rho; // Sun-Earth distance
    const oi = instantiate(ctx.t, this.orbit);
    // heliocentric position corrected for light-time travel
    const h = this.getCorrectedHelio(ctx, oi, lg, rsn);

    // Convert to geocentric
    const sll = sin(h.ll);
    const cll = cos(h.ll);
    // geocentric ecliptic longitude
    let lam =
      this.isInner ?
        atan2(-1 * h.rpd * sll, rsn - h.rpd * cll) + lg + Math.PI
      : atan2(rsn * sll, h.rpd - rsn * cll) + h.lpd;
    lam = reduceRad(lam);
    // geocentric latitude
    let bet = atan((h.rpd * h.spsi * sin(lam - h.lpd)) / (h.cpsi * rsn * sll));

    if (ctx.apparent) {
      // nutation
      lam += radians(ctx.nut.deltaPsi);
      // aberration
      const a = lg - lam;
      lam -= (9.9387e-5 * cos(a)) / cos(bet);
      lam = reduceRad(lam);
      bet -= 9.9387e-5 * sin(a) * sin(bet);
    }

    return { lambda: degrees(lam), beta: degrees(bet), delta: h.rho };
  }
}
