import { getDay, getMonth, getWeek, getYear } from "~/dates";
import { db } from "~/db.server";
import { promiseHash } from "remix-utils";
import { randomizeList } from "~/lists";

export async function getGoalsReport(userId: string, date: Date) {
  let year = getYear(date);
  let month = getMonth(date);
  let week = getWeek(date);
  let day = getDay(date);

  let goals = await promiseHash({
    yearlyGoals: db.goal.findMany({
      where: {
        status: "active",
        userId,
        scope: "year",
        year,
      },
    }),
    monthlyGoals: db.goal.findMany({
      where: {
        status: "active",

        userId,
        scope: "month",
        year,
        month,
      },
    }),
    weeklyGoals: db.goal.findMany({
      where: {
        userId,
        status: "active",

        scope: "week",
        year,
        month,
        week,
      },
    }),
    dailyGoals: db.goal.findMany({
      where: {
        userId,
        status: "active",

        scope: "day",
        year,
        month,
        week,
        day,
      },
    }),
  });

  return {
    yearlyGoals: randomizeList(
      goals.yearlyGoals,
      Math.ceil(Math.random() * goals.yearlyGoals.length)
    ),
    monthlyGoals: randomizeList(goals.monthlyGoals),
    weeklyGoals: randomizeList(goals.weeklyGoals),
    dailyGoals: randomizeList(goals.dailyGoals),
  };
}

export async function createYearlyGoal(args: {
  userId: string;
  year: number;
  title: string;
}) {
  return db.goal.create({
    data: {
      userId: args.userId,
      scope: "year",
      year: args.year,
      title: args.title,
    },
  });
}

export async function archiveGoal(goalId: string) {
  return db.goal.update({
    where: { id: goalId },
    data: {
      status: "archived",
    },
  });
}
