import { eccentricAnomaly, trueAnomaly } from '../src/kepler';

const delta = 4; // result precision

const cases = [
  {
    m: 3.5208387374141448,
    s: 0.016718,
    e: 3.5147440476661806,
    ta: -2.774497552017826,
  },
  {
    m: 0.763009079752865,
    s: 0.965,
    e: 1.7176273861066755,
    ta: 2.9122563898777387,
  },
];

describe('Eccentric anomaly', () => {
  for (const { s, m, e } of cases) {
    test(`s: ${s}, m: ${m}`, () => expect(eccentricAnomaly(s, m)).toBeCloseTo(e, delta));
  }
});

describe('True anomaly', () => {
  for (var { s, e, ta } of cases) {
    test(`s: ${s}, e: ${e}`, () => expect(trueAnomaly(s, e)).toBeCloseTo(ta, delta));
  }
});
