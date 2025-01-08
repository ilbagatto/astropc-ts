import { radians, shortestArc, sin } from '../mathutils';
import { apparent } from './sun';

export enum SolEquType {
  marchEquinox,
  juneSolstice,
  septemberEquinox,
  decemberSolstice,
}

/** Solstice/quinox event circumstances */
export interface SolEquEvent {
  /**  Number of Julian days since 1900 Jan. 0.5 */
  djd: number;
  /** Apparent longitude of the Sun, arc-degrees */
  lambda: number;
}

/**
 * Find time of solstice or equinox for a given year.
 * The result is accurate within 5 minutes of Universal Time.
 * @param year
 * @param type
 * @returns SolEquEvent
 */
export function solEqu(year: number, type: SolEquType): SolEquEvent {
  let k;
  switch (type) {
    case SolEquType.marchEquinox:
      k = 0;
      break;
    case SolEquType.juneSolstice:
      k = 1;
      break;
    case SolEquType.septemberEquinox:
      k = 2;
      break;
    case SolEquType.decemberSolstice:
      k = 3;
  }
  const k90 = k * 90.0;
  let djd = (year + k / 4.0) * 365.2422 - 693878.7; // shorter but less exact way
  let lambda: number;
  do {
    const sg = apparent(djd, { ignoreLightTravel: true });
    lambda = sg.phi;
    djd += 58.0 * sin(radians(k90 - lambda));
  } while (shortestArc(k90, lambda) >= 1e-6);

  return { djd, lambda };
}
