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
        status: {
          in: ["active", "done"],
        },

        userId,
        scope: "year",
        year,
      },
    }),
    monthlyGoals: db.goal.findMany({
      where: {
        status: {
          in: ["active", "done"],
        },

        userId,
        scope: "month",
        year,
        month,
      },
    }),
    weeklyGoals: db.goal.findMany({
      where: {
        userId,
        status: {
          in: ["active", "done"],
        },

        scope: "week",
        year,
        month,
        week,
      },
    }),
    dailyGoals: db.goal.findMany({
      where: {
        userId,
        status: {
          in: ["active", "done"],
        },

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

export async function setGoal(args: {
  scope: "year" | "month" | "week" | "day";
  userId: string;
  date: Date;
  title: string;
}) {
  let year = getYear(args.date);
  let month = args.scope !== "year" ? getMonth(args.date) : undefined;
  let week =
    args.scope === "week" || args.scope === "day"
      ? getWeek(args.date)
      : undefined;
  let day = args.scope === "day" ? getDay(args.date) : undefined;
  return db.goal.create({
    data: {
      userId: args.userId,
      scope: args.scope,

      title: args.title,
      year,
      month,
      week,
      day,
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

export async function markDone(goalId: string) {
  await db.goal.update({
    where: {
      id: goalId,
    },
    data: {
      status: "done",
    },
  });
}

export async function marNotkDone(goalId: string) {
  await db.goal.update({
    where: {
      id: goalId,
    },
    data: {
      status: "active",
    },
  });
}

export async function updateGoal(args: { id: string; title: string }) {
  return db.goal.update({
    where: {
      id: args.id,
    },
    data: {
      title: args.title,
    },
  });
}
