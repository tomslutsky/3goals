import { format } from "date-fns";

export function getYear(date: Date): number {
  return parseInt(format(date, "yyyy"), 10);
}

export function getMonth(date: Date): number {
  return parseInt(format(date, "MM"), 10);
}

export function getWeek(date: Date): number {
  return parseInt(format(date, "w"), 10);
}

export function getDay(date: Date): number {
  return parseInt(format(date, "d"), 10);
}
