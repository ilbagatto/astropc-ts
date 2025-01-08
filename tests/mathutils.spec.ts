import {
  ddd,
  degrees,
  diffAngle,
  dms,
  frac,
  frac360,
  modf,
  polynome,
  radians,
  reduceDeg,
  reduceRad,
  shortestArc,
  shortestArcRad,
  zdms,
} from '../src/mathutils';

describe('Decomposing a number', () => {
  it('Positive argument', () => {
    const [f, i] = modf(5.5);
    expect(f).toBeCloseTo(0.5);
    expect(i).toBeCloseTo(5.0);
  });

  it('Negative argument', () => {
    const [f, i] = modf(-5.5);
    expect(f).toBeCloseTo(-0.5);
    expect(i).toBeCloseTo(-5.0);
  });
});

describe('Polynome', () => {
  it('Simple', () => {
    const x = polynome(10.0, 1.0, 2.0, 3.0);
    expect(x).toBeCloseTo(321.0);
  });
  it('Complex', () => {
    const x = polynome(
      -0.127296372347707,
      0.409092804222329,
      -0.0226937890431606,
      -7.51461205719781e-6,
      0.0096926375195824,
      -0.00024909726935408,
      -0.00121043431762618,
      -0.000189319742473274,
      3.4518734094999e-5,
      0.000135117572925228,
      2.80707121362421e-5,
      1.18779351871836e-5
    );
    expect(x).toBeCloseTo(0.411961500152426, 15);
  });
});

describe('Ranges', () => {
  const delta = 1e-6;
  describe('Degrees', () => {
    const cases = [
      [20.0, -700.0],
      [0.0, 0.0],
      [345.0, 345.0],
      [340.0, 700.0],
      [0.0, 360.0],
      [70.45, 324070.45],
    ];

    for (const c of cases) {
      const exp = c[0];
      const arg = c[1];
      test(`reduceDeg(${arg}) should be ${exp}`, () =>
        expect(reduceDeg(arg)).toBeCloseTo(exp, delta));
    }
  });

  describe('Radians', () => {
    const cases = [
      [0.323629385640829, 12.89],
      [5.95955592153876, -12.89],
      [0.0, 0.0],
      [3.71681469282041, 10.0],
      [Math.PI, Math.PI],
      [0.0, Math.PI * 2],
    ];

    for (const c of cases) {
      const exp = c[0];
      const arg = c[1];
      test(`reduceDeg(${arg}) should be ${exp}`, () =>
        expect(reduceRad(arg)).toBeCloseTo(exp, delta));
    }
  });
});

describe('Fractional part of a number', () => {
  test('frac(5.5) should be 0.5', () => expect(frac(5.5)).toBeCloseTo(0.5));
  test('with a negative argument should be negative', () => expect(frac(-5.5)).toBeCloseTo(-0.5));
});

describe('frac360', () => {
  const delta = 1e-6;
  const k = 23772.99 / 36525;
  const cases: number[][] = [
    [31.7842235930254, 1.000021358e2 * k],
    [30.6653235575305, 9.999736056e1 * k],
    [42.3428797768338, 1.336855231e3 * k],
    [273.934866366267, 1.325552359e3 * k],
    [178.873057561472, 5.372616667 * k],
  ];

  for (const [exp, arg] of cases) {
    test(`${arg} --> ${exp}`, () => expect(frac360(arg)).toBeCloseTo(exp, delta));
  }
});

describe('Sexigecimal', () => {
  const delta = 1e-6;

  describe('Sexadecimalal --> Decimal', () => {
    test('Positive, 3 values', () => expect(ddd(37, 35, 0)).toBeCloseTo(37.5833333, delta));
    test('Positive, 2 values', () => expect(ddd(37, 35)).toBeCloseTo(37.5833333, delta));
    test('Negative degrees', () => expect(ddd(-37, 35)).toBeCloseTo(-37.5833333, delta));
    test('Negative minutes', () => expect(ddd(0, -35)).toBeCloseTo(-0.5833333, delta));
  });

  describe('Decimal --> Sexadecimalal', () => {
    describe('Positive', () => {
      const [d, m, s] = dms(55.75833333333333);

      test('Degrees', () => expect(d).toBeCloseTo(55));
      test('Minutes', () => expect(m).toBeCloseTo(45));
      test('Seconds', () => expect(s).toBeCloseTo(30.0, delta));
    });
    describe('Negative', () => {
      const [d, m, s] = dms(-55.75833333333333);

      test('Degrees', () => expect(d).toBeCloseTo(-55));
      test('Minutes', () => expect(m).toBeCloseTo(45));
      test('Seconds', () => expect(s).toBeCloseTo(30.0, delta));
    });
    describe('Negative, zero degrees', () => {
      const [d, m, s] = dms(-0.75833333333333);

      test('Degrees', () => expect(d).toBeCloseTo(0));
      test('Minutes', () => expect(m).toBeCloseTo(-45));
    });

    describe('Zodiac', () => {
      const [z, d, m] = zdms(312.4);

      test('Zodiac sign index', () => expect(z).toBe(10));
      test('Zodiac degrees', () => expect(d).toBeCloseTo(12));
    });
  });
});

describe('Arcs', () => {
  const delta = 1e-6;

  describe('Conversions', () => {
    test('Degrees -> Radians', () => expect(radians(180)).toBeCloseTo(Math.PI));
    test('Radians -> Degrees', () => expect(degrees(Math.PI)).toBeCloseTo(180));
  });

  describe('Shortest arc', () => {
    const cases = [
      { a: 10.0, b: 270.0, x: 100.0 },
      { a: 350.0, b: 20.0, x: 30.0 },
      { a: 10.0, b: 20.0, x: 10.0 },
    ];

    for (const { a, b, x } of cases) {
      test(`a = ${a}, b = ${b}, deg.`, () => {
        expect(shortestArc(a, b)).toBeCloseTo(x, delta);
      });
    }

    for (const { a, b, x } of cases) {
      test(`a = ${a}, b = ${b}, rad.`, () => {
        expect(shortestArcRad(radians(a), radians(b))).toBeCloseTo(radians(x), delta);
      });
    }
  });

  describe('Diff angles', () => {
    const cases = [
      [75.0, 10.0, -65],
      [10.0, 75.0, 65],
      [280.0, 30.0, 110],
      [30.0, 280.0, -110],
    ];
    for (let [a, b, c] of cases) {
      test(`a = ${a}, b = ${b}, deg.`, () => {
        expect(diffAngle(a, b)).toBeCloseTo(c, delta);
      });
    }
  });
});
