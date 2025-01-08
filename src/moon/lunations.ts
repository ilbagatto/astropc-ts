import { cos, radians, reduceDeg, round, sin } from '../mathutils';
import { CalDate, dayOfYear, isLeapYear } from '../timeutils';
import { FullMoon, LastQuarter, NewMoon, Quarter } from './quarters';

function calculateDelta(
  quarter: Quarter,
  t: number,
  ms: number,
  mm: number,
  f: number
): number {
  const tms = ms + ms;
  const tmm = mm + mm;
  const tf = f + f;
  let delta;

  if (quarter instanceof NewMoon || quarter instanceof FullMoon) {
    delta =
      (1.734e-1 - 3.93e-4 * t) * sin(ms) +
      2.1e-3 * sin(tms) -
      4.068e-1 * sin(mm) +
      1.61e-2 * sin(tmm) -
      4e-4 * sin(mm + tmm) +
      1.04e-2 * sin(tf) -
      5.1e-3 * sin(ms + mm) -
      7.4e-3 * sin(ms - mm) +
      4e-4 * sin(tf + ms) -
      4e-4 * sin(tf - ms) -
      6e-4 * sin(tf + mm) +
      1e-3 * sin(tf - mm) +
      5e-4 * sin(ms + tmm);
  } else {
    delta =
      (0.1721 - 0.0004 * t) * sin(ms) +
      0.0021 * sin(tms) -
      0.628 * sin(mm) +
      0.0089 * sin(tmm) -
      0.0004 * sin(tmm + mm) +
      0.0079 * sin(tf) -
      0.0119 * sin(ms + mm) -
      0.0047 * sin(ms - mm) +
      0.0003 * sin(tf + ms) -
      0.0004 * sin(tf - ms) -
      0.0006 * sin(tf + mm) +
      0.0021 * sin(tf - mm) +
      0.0003 * sin(ms + tmm) +
      0.0004 * sin(ms - tmm) -
      0.0003 * sin(tms + mm);
    let w = 0.0028 - 0.0004 * cos(ms) + 0.0003 * cos(ms);
    if (quarter instanceof LastQuarter) {
      w = -w;
    }
    delta += w;
  }
  return delta;
}

/**
 * Find Julian date of a quarter, closest to given civil date.
 * @param quarter - quarter to search
 * @param ymd - civil date
 * @returns - number of Julian days elapsed since 1900, Jan 0.5.
 */
export function findClosestPhase(quarter: Quarter, ymd: CalDate) {
  const n = isLeapYear(ymd.year) ? 366 : 365;
  const y = ymd.year + dayOfYear(ymd) / n;
  const k = round((y - 1900) * 12.3685) + quarter.coeff;
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;

  const c = radians(166.56 + (132.87 - 9.173e-3 * t) * t);
  const j =
    0.75933 + 29.53058868 * k + 0.0001178 * t2 - 1.55e-7 * t3 + 3.3e-4 * sin(c); // mean lunar phase

  const assemble = (args: number[]) =>
    radians(reduceDeg(args[0] + args[1] * k + args[2] * t2 + args[3] * t3));

  const ms = assemble([359.2242, 29.10535608, -0.0000333, -0.00000347]);
  const mm = assemble([306.0253, 385.81691806, 0.0107306, 0.00001236]);
  const f = assemble([21.2964, 390.67050646, -0.0016528, -0.00000239]);

  return j + calculateDelta(quarter, t, ms, mm, f);
}
