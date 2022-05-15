import { parseISO } from "date-fns";
import { describe, it, expect } from "vitest";
import { formatDateByScope, getDay, getMonth, getWeek, getYear } from "~/dates";

describe("year-parser", () => {
  it("should return year as number given a date", () => {
    const date = new Date(2020, 0, 1);
    let sut = getYear(date);
    expect(sut).toBe(2020);
  });
});

describe("month-parser", () => {
  it("should return Month as number given a date", () => {
    const date = new Date(2020, 0, 1);
    let sut = getMonth(date);
    expect(sut).toBe(1);
  });
});

describe("week-parser", () => {
  it("should return Week as number given a date", () => {
    const date = parseISO("2022-02-01");
    let sut = getWeek(date);
    expect(sut).toBe(6);
  });
});

describe("day-parser", () => {
  it("should return Day as number given a date", () => {
    const date = parseISO("2021-01-25");
    let sut = getDay(date);
    expect(sut).toBe(25);
  });
});

describe("date-formatter", () => {
  it("should return the year given a date and a year scope", () => {
    let date = parseISO("1999-04-05");
    let sut = formatDateByScope(date, "year");
    expect(sut).toBe("1999");
  });
  it("should return the month given a date and a month scope", () => {
    let date = parseISO("1999-04-05");
    let sut = formatDateByScope(date, "month");
    expect(sut).toBe("April");
  });
  it("should return the week given a date and a week scope", () => {
    let date = parseISO("1999-04-05");
    let sut = formatDateByScope(date, "week");
    expect(sut).toBe("15");
  });
  it("should return the day given a date and a day scope", () => {
    let date = parseISO("1999-04-05");
    let sut = formatDateByScope(date, "day");
    expect(sut).toBe("Monday");
  });
});
