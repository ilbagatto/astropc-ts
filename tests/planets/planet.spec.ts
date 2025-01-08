import { EclipticCoords } from "../../src/common";
import { OrbitInstance } from "../../src/planets/orbit";
import { PertRecord } from "../../src/planets/pert";
import { Planet, PlanetId } from "../../src/planets/planet"
import { CelestialSphera } from "../../src/planets/sphera";

type PlanPos = {id:PlanetId,  pos: EclipticCoords};


describe('Factory methods', () => {
    test('Get planet by name', () => {
      const names = [
        'Mercury',
        'Venus',
        'Mars',
        'Jupiter',
        'Saturn',
        'Uranus',
        'Neptune',
        'Pluto'
      ];

      for (const name of names) {
        const pla = Planet.forName(name);
        switch (name) {
          case 'Mercury':
            expect(pla.id).toBe(PlanetId.Mercury);
            break;
          case 'Venus':
            expect(pla.id).toBe(PlanetId.Venus);
            break;
          case 'Mars':
            expect(pla.id).toBe(PlanetId.Mars);
            break;
          case 'Jupiter':
            expect(pla.id).toBe(PlanetId.Jupiter);
            break;
          case 'Saturn':
            expect(pla.id).toBe(PlanetId.Saturn);
            break;
          case 'Uranus':
            expect(pla.id).toBe(PlanetId.Uranus);
            break;
          case 'Neptune':
            expect(pla.id).toBe(PlanetId.Neptune);
            break;
          case 'Pluto':
            expect(pla.id).toBe(PlanetId.Pluto);
        }
      }
    });
  });

  describe('Heliocentric', () => {
    const delta = 6;

    const oi: OrbitInstance = {
      s: 0.20563138612828713,
      sa: 0.3870986,
      ph: 1.34752240012577,
      nd: 0.8402412010285969,
      ic: 0.12225040301524157,
      ma: 1.7277480419370512,
      dm: 0 // not used
    };
    const re = 0.9839698373786032;
    const lg = 8.379862816965847;
    const ma = 1.7277480419370512;
    const pert: PertRecord = {
      dl: -0.001369031774972449,
      dr: -0.000013447032242762032,
      dml: 0,
      ds: 0,
      dm: 0,
      da: 0,
      dhl: 0
    };

    const got = Planet.calculateHeliocentric(oi, ma, re, lg, pert);

    const exp = {
      ll: -4.920247322912694,
      rpd: 0.4136118768849629,
      lpd: 3.459615494053153,
      spsi: 0.06116731001819705,
      cpsi: 0.9981275270150292,
      rho: 0.9858704400566043,
    };

    test('ll', () => expect(exp.ll).toBeCloseTo(got.ll, delta));
    test('rpd', () => expect(exp.rpd).toBeCloseTo(got.rpd, delta));
    test('lpd', () => expect(exp.lpd).toBeCloseTo(got.lpd, delta));
    test('spsi', () => expect(exp.spsi).toBeCloseTo(got.spsi, delta));
    test('cpsi', () => expect(exp.cpsi).toBeCloseTo(got.cpsi, delta));
    test('rho', () => expect(exp.rho).toBeCloseTo(got.rho, delta));
  });

  describe('Positions', () => {
    const delta = 1E-3; // result precision

    const cases = [
      {
        id: PlanetId.Mercury,
        pos: {lambda: 275.885, beta: 1.47425, delta: 0.986}
      },
      {id: PlanetId.Venus, pos: {lambda: 264.157, beta: 1.42582, delta: 1.229}},
      {id: PlanetId.Mars, pos: {lambda: 214.982, beta: 1.67762, delta: 1.414}},
      {id: PlanetId.Jupiter, pos: {lambda: 270.3, beta: 0.29758, delta: 6.11}},
      {id: PlanetId.Saturn, pos: {lambda: 225.379, beta: 2.336, delta: 10.049}},
      {id: PlanetId.Uranus, pos: {lambda: 252.174, beta: 0.052, delta: 19.633}},
      {
        id: PlanetId.Neptune,
        pos: {lambda: 270.076, beta: 1.163, delta: 31.112}
      },
      {id: PlanetId.Pluto, pos: {lambda: 212.08, beta: 16.882, delta: 29.861}}
    ];
    const sph = CelestialSphera.forDJD(30700.5, false);
    for (const {id, pos} of cases) {
      const pla = Planet.forId(id);
      const got = pla.geocentricPosition(sph);
      test(`${pla} Lon.`, () => expect(got.lambda).toBeCloseTo(pos.lambda, delta));
      test(`${pla} Lat.`, () => expect(got.beta).toBeCloseTo(pos.beta, delta));
      test(`${pla} Dist.`, () => expect(got.delta).toBeCloseTo(pos.delta, delta));
    }
  });

  describe('Duffett-Smith examples', () => {
    const delta = 1E-2; // result precision

    const cases = [
      {
        id: PlanetId.Mercury,
        pos: {lambda: 45.9319, beta: -2.78797, delta: 0.999897}
      },
      {
        id: PlanetId.Saturn,
        pos: {lambda: 221.2009, beta: 2.56691, delta: 8.956587}
      }
    ];

    const sph = CelestialSphera.forDJD(30830.5, false); // 1984 May 30

    for (const {id, pos} of cases) {
      const pla = Planet.forId(id);
      const got = pla.geocentricPosition(sph);
      test(`${pla} Lon.`, () => expect(got.lambda).toBeCloseTo(pos.lambda, delta));
      test(`${pla} Lat.`, () => expect(got.beta).toBeCloseTo(pos.beta, delta));
      test(`${pla} Dist.`, () => expect(got.delta).toBeCloseTo(pos.delta, delta));
    }
  });