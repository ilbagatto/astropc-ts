import { djdToSidereal } from '../../src/timeutils/sidereal';

describe('UTC -> GST', () => {
  const cases = [
    {
      djd: 30923.851053,
      lst: 7.072111,
      utc: 8.425278,
      ok: true,
    }, // 1984-08-31.4
    {
      djd: 683.498611,
      lst: 3.525306,
      utc: 23.966667,
      ok: false,
    }, // 1901-11-15.0
    {
      djd: 682.501389,
      lst: 3.526444,
      utc: 0.033333,
      ok: false,
    }, // 1901-11-14.0
    { djd: 29332.108931, lst: 4.668119, utc: 14.614353, ok: true },
  ]; // 1980-04-22.6

  for (let { djd, lst } of cases) {
    test(`DJD ${djd} == GST ${lst}`, () =>
      expect(djdToSidereal(djd)).toBeCloseTo(lst, 0.4));
  }
});
