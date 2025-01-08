import { ecl2equ, equ2ecl, equ2hor, hor2equ } from '../src/coco';
import { ddd } from '../src/mathutils';

const delta = 4; // result precision

const casesEquEcl = [
  {
    ob: 23.44574451788568,
    ra: ddd(14, 26, 57) * 15,
    de: ddd(32, 21, 5),
    lo: ddd(200, 19, 6.66),
    la: ddd(43, 47, 13.83),
  },
  {
    ob: 23.43871898795463,
    ra: ddd(0, 0, 5.5) * 15,
    de: ddd(-87, 12, 12),
    lo: ddd(277, 0, 6.26),
    la: ddd(-66, 24, 19.75),
  },
];

const casesEquHor = [
  {
    gl: ddd(51, 15, 0),
    ha: ddd(8, 37, 20),
    de: ddd(14, 23, 55),
    az: ddd(310, 15, 33.6),
    al: ddd(-10, 58, 20.8),
  },
  {
    gl: ddd(-20, 31, 13),
    ha: ddd(23, 19, 0),
    de: ddd(-43, 0, 0),
    az: ddd(161, 23, 19),
    al: ddd(65, 56, 6.1),
  },
];

describe('Equatorial -> Eclipical', () => {
  for (const { ra, de, ob,lo, la } of casesEquEcl) {
    const [got_lo, got_la] = equ2ecl(ra, de, ob);
    test(`Lambda for ${ra}, ${de}`, () => expect(lo).toBeCloseTo(got_lo, delta));
    test(`Beta for ${ra}, ${de}`, () => expect(la).toBeCloseTo(got_la, delta));
  }
});

describe('Eclipical -> Equatorial', () => {
  for (const { lo, la, ob, ra, de } of casesEquEcl) {
    const [got_ra, got_de] = ecl2equ(lo, la, ob);
    test(`Alpha for ${lo}, ${la}`, () => expect(got_ra).toBeCloseTo(ra, delta));
    test(`Delta for ${lo}, ${la}`, () => expect(got_de).toBeCloseTo(de, delta));
  }
});

describe('Equatorial -> Horizontal', () => {
  for (const { ha, de, gl, az, al } of casesEquHor) {
    const [got_az, got_al] = equ2hor(ha * 15, de, gl);
    test(`Azimuth for ${ha}, ${de}`, () => expect(got_az).toBeCloseTo(az, delta));
    test(`Altitude for ${ha}, ${de}`, () => expect(got_al).toBeCloseTo(al, delta));
  }
});

describe('Horizontal -> Equatorial', () => {
  for (const { az, al, gl, ha, de } of casesEquHor) {
    const [got_ha, got_de] = hor2equ(az, al, gl);
    test(`Hour angle for ${az}, ${al}`, () =>
      expect(got_ha / 15).toBeCloseTo(ha, delta));
    test(`Declination for ${az}, ${al}`, () =>
      expect(got_de).toBeCloseTo(de, delta));
  }
});
