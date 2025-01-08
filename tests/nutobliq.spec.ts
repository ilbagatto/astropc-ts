import { nutation, obliquity } from '../src/nutobliq';

const delta = 4; // result precision

describe('Nutation', () => {
  const cases = [
    {
      djd: -15804.5, // 1856 Sept. 23
      dpsi: -0.00127601021242336,
      deps: 0.00256293723137559,
    },
    {
      djd: 36524.5, // 2000 Jan. 1
      dpsi: -0.00387728730373955,
      deps: -0.00159919822661103,
    },
    {
      djd: 28805.69, // 1978 Nov 17
      dpsi: -9.195562346652888e-4,
      deps: -2.635113483663831e-3,
    },
    {
      djd: 32541.5, // 1989 Feb 4
      dpsi: 0.0023055555555555555,
      deps: 0.0022944444444444444,
    },
    {
      djd: 36525, // 2000 Jan 1.5
      dpsi: -0.003877777777777778,
      deps: -0.0016,
    },
    {
      djd: 34810.5, // 1995 Apr 23
      dpsi: 0.0026472222222222223,
      deps: -0.002013888888888889,
    },
    {
      djd: 23772.5, // 1965 Feb 1
      dpsi: -0.0042774118548615766,
      deps: 0.000425,
    },
  ];

  for (const { djd, dpsi, deps } of cases) {
    const t = djd / 36525;
    const nut = nutation(t);
    test(`dpsi at DJD #${djd}`, () =>
      expect(nut.deltaPsi).toBeCloseTo(dpsi, delta));
    test(`deps at DJD #${djd}`, () =>
      expect(nut.deltaEps).toBeCloseTo(deps, delta));
  }
});

describe('Obliquity of the Ecliptic', () => {
  // P.Duffett-Smith, "Astronomy With Your Personal Computer", p.54
  describe('Mean Obliquity', () => {
    const cases = [
      {
        djd: 29120.5, // 1979-09-24.0
        eps: 23.441916666666668,
      },
      {
        djd: 36524.5, // 2000-01-01.0
        eps: 23.43927777777778,
      },
    ];

    for (const { djd, eps } of cases) {
      test(`eps at DJD #${djd}`, () =>
        expect(obliquity(djd)).toBeCloseTo(eps, delta));
    }
  });

  // Meeus, "Astronomical Algorithms", second edition, p.148.
  describe('True Obliquity', () => {
    const djd = 31875.5; // 1987-04-10.0
    const deps = 9.443;
    test(`eps at DJD #${djd} with deps ${deps}°`, () =>
      expect(obliquity(djd, deps / 3600)).toBeCloseTo(
        23.443569444444446,
        delta
      ));
  });
});
