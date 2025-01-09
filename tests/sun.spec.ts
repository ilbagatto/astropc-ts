import { apparent, solEqu, SolEquType, trueGeocentric } from '../src/sun';

const delta = 4; // result precision

describe('Sun position', () => {
  const cases = [
    {
      djd: 30916.5, // 24 Aug 1984 00:00
      l: 151.01309547440778,
      r: 1.010993800005251,
      ap: 151.0035132296576,
    },
    {
      djd: 30819.10833333333, // 18 May 1984 14:36
      l: 57.83143688493146,
      r: 1.011718488789592,
      ap: 57.82109236581925,
    },
    {
      djd: 28804.5, // 12 Nov 1978 00:00
      l: 229.2517039627867,
      r: 0.9898375,
      ap: 229.2450957063683,
    },
    {
      djd: 33888.5, // 1992, Oct. 13 0h
      l: 199.90600618015975,
      r: 0.9975999344847888,
      ap: 199.9047664927989, // Meeus: 199.90734722222223
    },
  ];

  describe('True geometric position', () => {
    for (const { djd, l, r } of cases) {
      const t = djd / 36525;
      const geo = trueGeocentric(t);
      test(`longitude for djd ${djd}`, () => expect(geo.phi).toBeCloseTo(l, delta));
      test('R-vector for djd ${djd}', () => expect(geo.rho).toBeCloseTo(r, delta));
    }
  });

  describe('Apparent position', () => {
    for (const { djd, ap } of cases) {
      const sg = apparent(djd, { ignoreLightTravel: true });
      test(`longitude for djd ${djd}`, () => expect(sg.phi).toBeCloseTo(ap, delta));
      const sg1 = apparent(djd, { ignoreLightTravel: false });
      const ltDelta = Math.abs(sg.phi - sg1.phi);
      test('light-travel flag', () => expect(ltDelta).toBeGreaterThan(0));
    }
  });
});

describe('Equinoxes/Solstices', () => {
  const cases = [
    // from 'Astronomical algorithms' by Jean Meeus, p.168
    {
      djd: 22817.39,
      year: 1962,
      event: SolEquType.juneSolstice,
      angle: 90.0,
      title: 'June solstice (Meeus, "Astronomical Algorithms")',
    },
    // from http://www.usno.navy.mil/USNO/astronomical-applications/data-services/earth-seasons
    {
      djd: 36603.815972,
      year: 2000,
      event: SolEquType.marchEquinox,
      angle: 0.0,
      title: 'March equinox',
    },
    {
      djd: 36696.575,
      year: 2000,
      event: SolEquType.juneSolstice,
      angle: 90.0,
      title: 'June solstice',
    },
    {
      djd: 36790.227778,
      year: 2000,
      event: SolEquType.septemberEquinox,
      angle: 180.0,
      title: 'September equinox',
    },
    {
      djd: 36880.067361,
      year: 2000,
      event: SolEquType.decemberSolstice,
      angle: 270.0,
      title: 'December solstice',
    },
  ];

  for (const { djd, year, event, angle, title } of cases) {
    test(title, () => {
      const evt = solEqu(year, event);
      expect(evt.djd).toBeCloseTo(djd, 2);
      expect(evt.lambda).toBeCloseTo(angle, 5);
    });
  }
});
