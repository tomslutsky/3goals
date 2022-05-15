import type { Goal } from "@prisma/client";
import {
  type LoaderFunction,
  redirect,
  json,
  type ActionFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import {
  archiveGoal,
  getGoalsReport,
  markDone,
  setGoal,
} from "~/models/goals.server";
import { getUserId } from "~/session.server";
import Strip from "./Strip";

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await getUserId(request);
  if (!userId) {
    return redirect("/login");
  }

  let date = new Date();

  let goals = await getGoalsReport(userId, date);
  return json({ goals });
};

type LoaderData = {
  goals: {
    yearlyGoals: Goal[];
    monthlyGoals: Goal[];
    weeklyGoals: Goal[];
    dailyGoals: Goal[];
  };
};

export let setGoalValidator = withZod(
  z.discriminatedUnion("_action", [
    z.object({
      _action: z.literal("set_goal"),
      title: z.string(),
      scope: z.enum(["year", "month", "week", "day"]),
    }),
    z.object({ _action: z.literal("archive"), id: z.string() }),
    z.object({ _action: z.literal("mark_done"), id: z.string() }),
  ])
);
export let action: ActionFunction = async ({ request }) => {
  let result = await setGoalValidator.validate(
    Object.fromEntries(await request.formData())
  );
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }
  switch (result.data._action) {
    case "set_goal": {
      let userId = await getUserId(request);
      if (!userId) {
        throw new Response("Not logged in", {
          status: 401,
        });
      }
      let date = new Date();

      await setGoal({
        scope: result.data.scope,
        title: result.data.title,
        date,
        userId,
      });

      return redirect("/");
    }
    case "archive": {
      await archiveGoal(result.data.id);
      return redirect("/");
    }
    case "mark_done": {
      await markDone(result.data.id);
      return redirect("/");
    }
  }
};
export default function Index() {
  let { goals } = useLoaderData() as LoaderData;
  return (
    <main className="relative  flex min-h-screen flex-col">
      <Strip goals={goals.yearlyGoals} scope="year" />
      <Strip goals={goals.monthlyGoals} scope="month" />
      <Strip goals={goals.weeklyGoals} scope="week" />
    </main>
  );
}
