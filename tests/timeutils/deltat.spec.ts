import { deltaT } from "../../src/timeutils/deltat";

describe("Delta-T", () => {
  const cases = [
    { djd: -102146.5, exp: 119.51, text: "historical start" }, // 1620-05-01
    { djd: -346701.5, exp: 1820.325, text: "after 948" }, // # 950-10-01
    { djd: 44020.5, exp: 93.81, text: "after 2010" }, // 2020-07-10
    { djd: 109582.5, exp: 407.2, text: "after 2100" }, // ?
  ];

  for (const { djd, exp, text } of cases) {
    test(`${text} - DJD ${djd} should be ${exp}.`, () => {
      const got = deltaT(djd);
      expect(got).toBeCloseTo(exp, 1);
    });
  }
});

test("The last entry in the historicaltable", () =>
  expect(deltaT(42368.5)).toBeCloseTo(70.0));

test("Before 948", () => expect(deltaT(-348070.5)).toBeCloseTo(1833.43769));
