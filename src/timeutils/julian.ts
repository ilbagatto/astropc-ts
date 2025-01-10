/**
 * # Julian Date
 *
 * The main purpose is to convert between civil and Julian dates.
 * *Julian date* (JD) is the number of days elapsed since mean UT noon of
 * January 1st 4713 BC. This system of time measurement is widely adopted by
 * the astronomers.
 * 
 * For better precision around the XX century, we use
 * the epoch **1900 January 0.5 (1989 December 31.5)** as the starting point.
 * See _"Astronomy With Your Personal Computer"_, p.14. This kind of Julian
 * date is referred as 'DJD'. To convert DJD to JD and vise versa, use
 * [djdToJd] constant: `jd = djd + DJD_TO_JD`
 * The module contains some other usefull calendar-related functions, such as
 * [weekDay], [dayOfYear], [isLeapYear].
 * 
 * ## Civil vs. Astronomical year
 * There is disagreement between astronomers and historians about how to count
 * the years preceding the year 1. Astronomers generally use zero-based system.
 * The year before the year +1, is the *year zero*, and the year preceding the
 * latter is the *year -1*. The year which the historians call 585 B.C. is
 * actually the year -584.

 * In this module all subroutines accepting year ([isLeapYear], [cal2djd] etc.)
 * assume that **there is no year zero**. Conversion from the civil to the
 * astronomical time scale is done internally. Thus, the sequence of years is:
 * `BC -3, -2, -1, 1, 2, 3, AD`.
 *
 * ## Time
 *
 * Time is represented by fractional part of a day. For example, 7h30m UT
 * is `(7 + 30 / 60) / 24 = 0.3125`.
 *
 * ## Zero day
 *
 * Zero day is a special case of date: it indicates 12h UT of previous calendar
 * date. For instance, *1900 January 0.5* is often used instead of
 * *1899 December 31.5* to designate start of the astronomical epoch.
 *
 * ##  Gregorian calendar
 *
 * _Civil calendar_ in most cases means _proleptic Gregorian calendar_. it is
 * assumed that Gregorian calendar started at *Oct. 4, 1582*, when it was first
 * adopted in several European countries. Many other countries still used the
 * older Julian calendar. In Soviet Russia, for instance, Gregorian system was
 * accepted on **Jan 26, 1918**. See
 * [Wiki article](https://en.wikipedia.org/wiki/Gregorian_calendar#Adoption_of_the_Gregorian_Calendar)
 */

import { abs, floor, modf, trunc } from '../mathutils';

/** Year when Gregorian calendar was introduced */
const GREGORIAN_YEAR = 1582;

export const DJD_TO_JD = 2415020;
export const JD_TO_MJD = 2400000.5;
export const DAYS_PER_CENT = 36525;
export const DJD_TO_UNIX_MILLIS = 631108800000;
export const MILLIS_PER_DAY = 86400000;
export const DJD_UNIX_EPOCH = 25567.5;

export interface CalDate {
  /** civil year, zeroes not allowed */
  year: number;
  /** month (1 - 12) */
  month: number;
  /** day, with hours as fractional part */
  day: number;
}

/**
 * Does a given date falls to period after introducion of Gregorian calendar?
 * @param ymd - civil date
 * @returns
 */
function afterGregorian(ymd: CalDate): boolean {
  if (ymd.year < GREGORIAN_YEAR) return false;
  if (ymd.year > GREGORIAN_YEAR) return true;
  if (ymd.month < 10) return false;
  if (ymd.month > 10) return true;
  return ymd.day >= 15;
}

/**
 * Converts civil date into Julian days.
 *
 * @param ymd - civil date
 *
 * @returns Julian days elapsed since 1900, Jan 0.5 (1899 Dec 31.5)
 * @throws Error if year is zero (astronomical years are not allowed)
 * @throws Error if input date is between 5th and 14 October 1582, inclusive.
 */
export function julDay(ymd: CalDate): number {
  if (ymd.year == 0) {
    throw new Error('Zero year not allowed!');
  }

  const d = trunc(ymd.day);
  if (ymd.year == GREGORIAN_YEAR && ymd.month == 10) {
    if (d > 4 && d < 15) {
      throw new Error(`Impossible date: ${ymd.year}-${ymd.month}-${ymd.day}`);
    }
  }
  let y = ymd.year < 0 ? ymd.year + 1 : ymd.year;
  let m = ymd.month;
  if (m < 3) {
    m += 12;
    y--;
  }

  let b;
  if (afterGregorian(ymd)) {
    // after Gregorian calendar
    const a = trunc(y / 100);
    b = 2 - a + trunc(a / 4);
  } else {
    b = 0;
  }

  const f = 365.25 * y;
  const c = trunc(y < 0 ? f - 0.75 : f) - 694025;
  const e = trunc(30.6001 * (m + 1));

  return b + c + e + ymd.day - 0.5;
}

/**
 * Converts Julian into the calendar date.
 * @param djd - number of Julian days since 1900 Jan. 0.5
 * @returns civil date
 */
export function calDay(djd: number): CalDate {
  const d = djd + 0.5;
  // eslint-disable-next-line prefer-const
  let [f, i] = modf(d);

  if (i > -115860) {
    const a = floor(i / 36524.25 + 9.9835726e-1) + 14;
    i += 1 + a - floor(a / 4);
  }
  const b = floor(i / 365.25 + 8.02601e-1);
  const c = i - floor(365.25 * b + 7.50001e-1) + 416;
  const g = floor(c / 30.6001);
  const da = c - floor(30.6001 * g) + f;
  const mo = g - (g > 13.5 ? 13 : 1);
  let ye = b + (mo < 2.5 ? 1900 : 1899);
  // convert astronomical, zero-based year to civil
  if (ye < 1) {
    ye--;
  }
  return { year: ye, month: mo, day: da };
}

/**
 * DJD at Greenwich midnight.
 * @param djd -  a number of Julian days elapsed since 1900, Jan 0.5.
 * @returns DJD at Greenwich midnight
 */
export function djdMidnight(djd: number): number {
  const f = floor(djd);
  return f + (abs(djd - f) >= 0.5 ? 0.5 : -0.5);
}

/**
 * Day of week.
 * @param djd - number of Julian days elapsed since 1900, Jan 0.5
 * @returns number in range (0..6) corresponding to weekDay: `0` for Sunday, `1` for Monday and so on.
 */
export function weekDay(djd: number): number {
  const d0 = djdMidnight(djd);
  const j0 = d0 + DJD_TO_JD;
  return trunc((j0 + 1.5) % 7);
}

/**
 * Is given year a leap-year?
 * @param ye - civil year
 * @returns true is the year is a leap-year.
 */
export function isLeapYear(ye: number): boolean {
  return ye % 4 == 0 && (ye % 100 != 0 || ye % 400 == 0);
}

/**
 * Number of days in the year up to a particular date.
 * @param ymd - civil date
 * @returns number of days
 */
export function dayOfYear(ymd: CalDate): number {
  const k = isLeapYear(ymd.year) ? 1 : 2;
  const a = floor((275 * ymd.month) / 9);
  const b = floor(k * ((ymd.month + 9) / 12.0));
  const c = floor(ymd.day);
  return a - b + c - 30;
}

/**
 * DJD corresponding to January 0.0 of a given year.
 *
 * Zero day is a special case of date: it indicates 12h UT of previous calendar
 * date. For instance, 1900 January 0.5 is often used instead of
 * 1899 December 31.5 to designate start of the astronomical epoch.
 *
 * @param year - a year
 * @returns Julian day since 1900 January 0.5
 */
export function djdZero(year: number): number {
  const y = year - 1;
  const a = trunc(y / 100);
  return trunc(365.25 * y) - a + trunc(a / 4) - 693595.5;
}

/**
 * Convert Juian date to Date object.
 * @param djd - number of Julian days elapsed since 1900, Jan 0.5
 * @returns - corresponding Date object, in UTC
 */
export function djdToDate(djd: number): Date {
  const mil = (djd - DJD_UNIX_EPOCH) * MILLIS_PER_DAY;
  return new Date(mil);
}

/**
 * Convert Date object to Julian date
 * @param d - a date
 * @returns number of Julian days elapsed since 1900, Jan 0.5
 */
export function dateToDjd(d: Date): number {
  return d.getTime() / MILLIS_PER_DAY + DJD_UNIX_EPOCH;
}
