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

export function formatDateByScope(date: Date, scope: string): string {
  switch (scope) {
    case "year":
      return format(date, "yyyy");
    case "month":
      return format(date, "MMMM");
    case "week":
      return format(date, "w");
    case "day":
      return format(date, "eeee");
    default:
      return "";
  }
}
