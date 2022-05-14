import { describe, it, expect } from "vitest";
import { getDay, getMonth, getWeek, getYear } from "~/dates";

describe("year-parser", () => {
  it("should return year as number given a date", () => {
    const date = new Date(2020, 0, 1);
    let sut = getYear(date);
    expect(sut).toBe(2020);
  });
  it("should throw an error given bad input", () => {
    const date = new Date(2020, 0, 1);
    expect(() => {
      // @ts-ignore
      getYear(date.toISOString());
    }).toThrow();
  });
});

describe("month-parser", () => {
  it("should return Month as number given a date", () => {
    const date = new Date(2020, 0, 1);
    let sut = getMonth(date);
    expect(sut).toBe(1);
  });
  it("should throw an error given bad input", () => {
    const date = new Date(2020, 0, 1);
    expect(() => {
      // @ts-ignore
      getMonth(date.toISOString());
    }).toThrow();
  });
});

describe("week-parser", () => {
  it("should return Week as number given a date", () => {
    const date = new Date("2022-02-01");
    let sut = getWeek(date);
    expect(sut).toBe(6);
  });
  it("should throw an error given bad input", () => {
    const date = new Date(2020, 0, 1);
    expect(() => {
      // @ts-ignore
      getWeek(date.toISOString());
    }).toThrow();
  });
});

describe("day-parser", () => {
  it("should return Day as number given a date", () => {
    const date = new Date("2021-01-25");
    let sut = getDay(date);
    expect(sut).toBe(25);
  });
  it("should throw an error given bad input", () => {
    const date = new Date(2020, 0, 1);
    expect(() => {
      // @ts-ignore
      getDay(date.toISOString());
    }).toThrow();
  });
});
