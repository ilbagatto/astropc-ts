import {
  calDay,
  dateToDjd,
  dayOfYear,
  djdMidnight,
  djdToDate,
  djdZero,
  isLeapYear,
  julDay,
  weekDay,
} from '../../src/timeutils/julian';

const cases = [
  { ymd: { year: 1984, month: 8, day: 29.0 }, djd: 30921.5 },
  { ymd: { year: 1899, month: 12, day: 31.5 }, djd: 0.0 },
  { ymd: { year: 1938, month: 8, day: 17.0 }, djd: 14107.5 },
  { ymd: { year: 1, month: 1, day: 1.0 }, djd: -693596.5 },
  { ymd: { year: -4713, month: 7, day: 12.0 }, djd: -2414827.5 },
  { ymd: { year: -4713, month: 1, day: 1.5 }, djd: -2415020.0 },
];

describe('Civil to Julian', () => {
  for (let { ymd, djd } of cases) {
    test(`${ymd.year}-${ymd.month}-${ymd.day}`, () =>
      expect(julDay(ymd)).toBeCloseTo(djd));
  }

  test('Zero date (Jan 0.5, 1900)', () =>
    expect(julDay({ year: 1900, month: 1, day: 0.5 })).toBeCloseTo(0.0));

  describe('Exceptions', () => {
    test('Zero year', () =>
      expect(() => {
        julDay({ year: 0, month: 12, day: 1 });
      }).toThrow(/zero year/i));

    test('Impossible date 1582 Oct 10', () =>
      expect(() => {
        julDay({ year: 1582, month: 10, day: 10 });
      }).toThrow(/impossible date/i));
  });
});

describe('Julian to Civil', () => {
  for (let { ymd, djd } of cases) {
    const got = calDay(djd);
    test(`${djd} year`, () => expect(got.year).toBe(ymd.year));
    test(`${djd} month`, () => expect(got.month).toBe(ymd.month));
    test(`${djd} day`, () => expect(got.day).toBeCloseTo(ymd.day));
  }
});

describe('DJD Midnight', () => {
  test('Before noon', () =>
    expect(djdMidnight(23772.99)).toBeCloseTo(23772.5, 0.5));

  test('After noon', () =>
    expect(djdMidnight(23773.3)).toBeCloseTo(23772.5, 0.5));

  test('Previous day, before midnight', () =>
    expect(djdMidnight(23772.4)).toBeCloseTo(23771.5, 0.5));

  test('Previous day, before noon', () =>
    expect(djdMidnight(23771.9)).toBeCloseTo(23771.5, 0.5));
  test('Next day, after midnight', () =>
    expect(djdMidnight(23773.6)).toBeCloseTo(23773.5, 0.5));
});

test('DJD Zero', () => expect(djdZero(2010)).toBeCloseTo(40176.5, 0.5));

describe('Weekdays', () => {
  const cases = [
    [30921.5, 3],
    [0.0, 0],
    [14107.5, 3],
    [-693596.5, 6],

    // Not sure about weekDays of the next two dates; there are controverses;
    // Perl  DateTime module gives weekDays 5 and 4 respectively
    [-2414827.5, 5],
    [-2415020.0, 1],
    [23772.99, 1],
  ];
  for (const [djd, wd] of cases) {
    test(`${djd} should be weekday ${wd}`, () => expect(weekDay(djd)).toBe(wd));
  }
});

describe('Leap year', () => {
  const leap = [
    2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044,
    2048,
  ];
  const noleap = [
    2001, 2003, 2010, 2014, 2017, 2019, 2025, 2026, 2035, 2038, 2045, 2047,
    2049,
  ];

  for (const y of leap) {
    test(`${y} should be a leap year`, () =>
      expect(isLeapYear(y)).toBeTruthy());
  }
  for (const y of noleap) {
    test(`${y} should not be a leap year`, () =>
      expect(isLeapYear(y)).toBeFalsy());
  }
});

describe('Day of year', () => {
  test('Non-leap year', () =>
    expect(dayOfYear({ year: 1990, month: 4, day: 1 })).toBe(91));
  test('Leap year', () =>
    expect(dayOfYear({ year: 2000, month: 4, day: 1 })).toBe(92));
});

describe('DJD to Date', () => {
  const got = djdToDate(23772.990278);
  test('UTC String', () => expect(got.toUTCString()).toBe('Mon, 01 Feb 1965 11:46:00 GMT'));
});

describe('Date to DJD', () => {
    const got = dateToDjd(new Date(Date.UTC(1965, 1, 1, 11, 46)));
    test('DJD', () => expect(got).toBeCloseTo(23772.990278, 6));
  });
  