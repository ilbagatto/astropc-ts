import { findClosestPhase, Quarter } from '../../src/moon';


describe('Events closest to dates', () => {
    const delta = 2;
    const cases = [
    {
      date: { year: 1984, month: 9, day: 1 },
      quarter: Quarter.newMoon(),
      djd: 30919.3097, //[1984, 8, 26, 19, 26]
    },
    {
      date: { year: 1984, month: 9, day: 1 },
      quarter: Quarter.fullMoon(),
      djd: 30933.79236, //[1984, 9, 10, 7, 1]
    },
    {
      date: { year: 1968, month: 12, day: 12 },
      quarter: Quarter.newMoon(),
      djd: 25190.263194, // [1968, 12, 19, 18, 19]
    },
    {
      date: { year: 1968, month: 12, day: 12 },
      quarter: Quarter.fullMoon(),
      djd: 25205.26944, // [1969, 1, 3, 18, 28]
    },
    {
      date: { year: 1974, month: 4, day: 1 },
      quarter: Quarter.newMoon(),
      djd: 27110.39166, // [1974, 3, 23, 21, 24]
    },
    {
      date: { year: 1974, month: 4, day: 1 },
      quarter: Quarter.fullMoon(),
      djd: 27124.375, //[1974, 4, 6, 21, 0]
    },
    {
      date: { year: 1977, month: 2, day: 15 },
      quarter: Quarter.newMoon(),
      djd: 28172.65118,
    },
    {
      date: { year: 1965, month: 2, day: 1 },
      quarter: Quarter.firstQuarter(),
      djd: 23780.87026,
    },
    {
      date: { year: 1965, month: 2, day: 1 },
      quarter: Quarter.fullMoon(),
      djd: 23787.52007,
    },
    {
      date: { year: 2044, month: 1, day: 1 },
      quarter: Quarter.lastQuarter(),
      djd: 52616.49186,
    },
    {
      date: { year: 2019, month: 8, day: 21 },
      quarter: Quarter.newMoon(),
      djd: 43705.94287,
    },
    {
      date: { year: 2019, month: 8, day: 21 },
      quarter: Quarter.firstQuarter(),
      djd: 43712.63302,
    },
    {
      date: { year: 2019, month: 8, day: 21 },
      quarter: Quarter.fullMoon(),
      djd: 43720.69049,
    },
    {
      date: { year: 2019, month: 8, day: 21 },
      quarter: Quarter.lastQuarter(),
      djd: 43728.61252,
    },
  ];

  for (const { date, djd, quarter } of cases) {
    test(`${quarter.name} to ${date.year}-${date.month}-${date.day}`, () =>
      expect(findClosestPhase(quarter, date)).toBeCloseTo(djd, delta));
  }
});
