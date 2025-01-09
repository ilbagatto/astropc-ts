import {
  PertJupiter,
  PertMars,
  PertMercury,
  PertNeptune,
  PertPluto,
  PertSaturn,
  PertUranus,
  PertVenus,
} from '../../src/planets/pert';
import { CelestialSphera } from '../../src/planets/sphera';

describe('PertCalculator implementations', () => {
  const ctx = CelestialSphera.forDJD(23772.990277);
  test('Mercury', () => {
    const pert = new PertMercury().calculatePerturbations(ctx);
    expect(pert).toMatchObject({
      dl: 0.0008172644590941437,
      dr: -0.000004203179216262242,
      dml: 0,
      ds: 0,
      dm: 0,
      da: 0,
      dhl: 0,
    });
  });
  test('Venus', () => {
    const pert = new PertVenus().calculatePerturbations(ctx);
    expect(pert).toMatchObject({
      dl: 0.005243803988052716,
      dr: -0.000016139294298865303,
      dml: -0.000005670065459895276,
      ds: 0,
      dm: -0.000005670065459895276,
      da: 0,
      dhl: 0,
    });
  });
  test('Mars', () => {
    const pert = new PertMars().calculatePerturbations(ctx);
    expect(pert).toMatchObject({
      dl: -0.00280602093366712,
      dr: -0.000007532639681080412,
      dml: 0.00021929405846312294,
      ds: 0,
      dm: 0.00021929405846312294,
      da: 0,
      dhl: 0,
    });
  });
  test('Jupiter', () => {
    const pert = new PertJupiter().calculatePerturbations(ctx);
    expect(pert).toMatchObject({
      dl: 0,
      dr: 0,
      dml: 0.0025107670114457143,
      ds: -0.00021983995477328224,
      dm: 0.009246807150538687,
      da: -0.00039433305976555575,
      dhl: 0,
    });
  });
  test('Saturn', () => {
    const pert = new PertSaturn().calculatePerturbations(ctx);
    expect(pert).toMatchObject({
      dl: 0,
      dr: 0,
      dml: -0.0036485353349126858,
      ds: -0.0009366634839158407,
      dm: 0.051169023060177676,
      da: 0.006359386692275477,
      dhl: 0.00004100755335842852,
    });
  });
  test('Uranus', () => {
    const pert = new PertUranus().calculatePerturbations(ctx);
    expect(pert).toMatchObject({
      dl: -0.06841758311407377,
      dr: -0.028621319896722272,
      dml: -0.014130475503079687,
      ds: 0.0009128215974594608,
      dm: 0.027620929578174934,
      da: -0.001280698885069828,
      dhl: -0.0000025570207258577733,
    });
  });
  test('Neptune', () => {
    const pert = new PertNeptune().calculatePerturbations(ctx);
    expect(pert).toMatchObject({
      dl: 0.005870238119480507,
      dr: -0.04645417157280168,
      dml: 0.009642140652184515,
      ds: -0.00042658797898279514,
      dm: 0.06857037443749586,
      da: 0.0029058215463567206,
      dhl: -9.7047829324761e-7,
    });
  });
  test('Pluto', () => {
    const pert = new PertPluto().calculatePerturbations();
    expect(pert).toMatchObject({
      dl: 0,
      dr: 0,
      dml: 0,
      ds: 0,
      dm: 0,
      da: 0,
      dhl: 0,
    });
  });
});
