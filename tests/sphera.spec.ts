import { abs } from '../src/mathutils';
import { PlanetId } from '../src/planets/planet';
import { CelestialSphera } from '../src/planets/sphera';
import { deltaT } from '../src/timeutils';

describe('Factory', () => {
  const djd = 23772.990277;
  const sph = CelestialSphera.forDJD(djd);
  test('Instance created', () => expect(sph).toBeInstanceOf(CelestialSphera));

  test('Aux Sun', () => expect(sph.auxSun).toBeDefined());

  test('getMeanAnomaly', () => {
    const dt = deltaT(djd);
    const ma1 = sph.getMeanAnomaly(PlanetId.Venus);
    const ma2 = sph.getMeanAnomaly(PlanetId.Venus, dt);
    expect(abs(ma1 - ma2)).toBeGreaterThan(0);
  });

  test('getOrbitInstance', () => {
    const exp = {
      ph: 0.24031949336774427,
      s: 0.048441411116171056,
      nd: 1.7470969830387244,
      ic: 0.022777074476789394,
      sa: 5.202561,
      ma: 0.707119826383305,
      dm: 0.0014508822298571445,
    };
    expect(sph.getOrbitInstance(PlanetId.Jupiter)).toStrictEqual(exp);
  });
});
