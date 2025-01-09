import { instantiate, MLTerms, Terms } from '../../src/planets/orbit';

const delta = 6;
const t = 0.8405338809034908;

describe('Terms', () => {
  test('Standard terms', () => {
    const terms = new Terms(75.899697, 1.5554889, 0.0002947);
    const exp = 77.2073463265456;
    expect(terms.assemble(t)).toBeCloseTo(exp, delta);
  });
  describe('Mean longitude', () => {
    test('ML with 1 term', () => {
      const terms = new MLTerms(178.179078);
      expect(terms.assemble(t)).toBeCloseTo(178.179078, delta);
    });

    test('ML with 2 terms', () => {
      const terms = new MLTerms(178.179078, 415.2057519);
      expect(terms.assemble(t)).toBeCloseTo(176.1998044652222, delta);
    });

    test('ML with 3 terms', () => {
      const terms = new MLTerms(178.179078, 415.2057519, 0.0003011);
      const exp = 176.2000171915306;
      expect(terms.assemble(t)).toBeCloseTo(exp, delta);
    });
    test('ML with 4 terms', () => {
      const terms = new MLTerms(178.179078, 415.2057519, 0.0003011, 1e-6);
      expect(terms.assemble(t)).toBeCloseTo(176.2000177853655, delta);
    });  
  })
});
describe('Osculation elements', () => {
  const oe = {
    ML: new MLTerms(178.179078, 415.2057519, 3.011e-4),
    PH: new Terms(75.899697, 1.5554889, 2.947e-4),
    EC: new Terms(2.0561421e-1, 2.046e-5, -3e-8),
    IN: new Terms(7.002881, 1.8608e-3, -1.83e-5),
    ND: new Terms(47.145944, 1.1852083, 1.739e-4),
    SA: 3.870986e-1,
  };
  const oi = instantiate(t, oe);
  test('Mean anomaly', () => {
    expect(oi.ma).toBeCloseTo(1.7277480419370512, delta);
  });
  test('Mean daily motion', () => {
    expect(oi.dm).toBeCloseTo(0.07142545459475612, delta);
  });
  test('Argument of perihelion', () => {
    expect(oi.ph).toBeCloseTo(1.34752240012577, delta);
  });
  test('Eccentricity', () => {
    expect(oi.s).toBeCloseTo(0.20563138612828713, delta);
  });
  test('Ascending node', () => {
    expect(oi.nd).toBeCloseTo(0.8402412010285969, delta);
  });
  test('Inclination', () => {
    expect(oi.ic).toBeCloseTo(0.12225040301524157, delta);
  });
  test('Major semi-axis', () => {
    expect(oi.sa).toBeCloseTo(0.3870986, delta);
  });
});
