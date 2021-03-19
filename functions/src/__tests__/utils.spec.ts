import { getWeekOfYear, getYearOfWeek, getYearWeekString } from "../utils";

describe("getWeekOfYear", () => {
  it("passes", () => {
    const dates: Array<{ ymd: [number, number, number]; week: number }> = [
      { ymd: [2021, 0, 3], week: 53 },
      { ymd: [2021, 0, 4], week: 1 },
      { ymd: [2021, 0, 10], week: 1 },
      { ymd: [2021, 0, 11], week: 2 },
    ];

    dates.forEach(({ ymd, week }) => {
      expect(getWeekOfYear(new Date(...ymd).valueOf())).toBe(week);
    });
  });
});

describe("getYearOfWeek", () => {
  it("passes", () => {
    const dates: Array<{ ymd: [number, number, number]; year: number }> = [
      { ymd: [2021, 0, 3], year: 2020 },
      { ymd: [2021, 0, 4], year: 2021 },
      { ymd: [2021, 0, 10], year: 2021 },
      { ymd: [2021, 0, 11], year: 2021 },
    ];

    dates.forEach(({ ymd, year }) => {
      expect(getYearOfWeek(new Date(...ymd).valueOf())).toBe(year);
    });
  });
});

describe("getYearWeekString", () => {
  it("passes", () => {
    const dates: Array<{ ymd: [number, number, number]; str: string }> = [
      { ymd: [2021, 0, 3], str: `2020-53` },
      { ymd: [2021, 0, 4], str: `2021-01` },
      { ymd: [2021, 0, 10], str: `2021-01` },
      { ymd: [2021, 0, 11], str: `2021-02` },
    ];

    dates.forEach(({ ymd, str }) => {
      expect(getYearWeekString(new Date(...ymd).valueOf())).toBe(str);
    });
  });
});
