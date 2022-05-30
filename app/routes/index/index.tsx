import { Switch } from "@headlessui/react";
import type { Goal } from "@prisma/client";
import {
  type LoaderFunction,
  redirect,
  json,
  type ActionFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { parse } from "date-fns";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import Header from "~/components/Header";
import { useToggle } from "~/hooks/useToggle";
import {
  archiveGoal,
  getGoalsReport,
  markDone,
  marNotkDone,
  setGoal,
  updateGoal,
} from "~/models/goals.server";
import { getUserId } from "~/session.server";
import Strip from "./Strip";

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await getUserId(request);
  if (!userId) {
    return redirect("/login");
  }
  let url = new URL(request.url);
  let desiredDate = url.searchParams.get("date");

  let date = desiredDate
    ? parse(desiredDate, "yyyy-MM-dd", new Date())
    : new Date();

  let goals = await getGoalsReport(userId, date);
  return json({ goals, date });
};

type LoaderData = {
  date: string;
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
    z.object({ _action: z.literal("mark_not_done"), id: z.string() }),
    z.object({
      _action: z.literal("update"),
      id: z.string(),
      title: z.string(),
    }),
  ])
);
export let action: ActionFunction = async ({ request }) => {
  let result = await setGoalValidator.validate(await request.formData());

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
    case "mark_not_done": {
      await marNotkDone(result.data.id);
      return redirect("/");
    }
    case "update": {
      await updateGoal({
        id: result.data.id,
        title: result.data.title,
      });
      return redirect("/");
    }
  }
};
export default function Index() {
  let { goals, date: stringifiedDate } = useLoaderData() as LoaderData;
  let date = new Date(stringifiedDate);

  let { value, onToggle } = useToggle();
  return (
    <main className="relative  flex min-h-screen flex-col">
      <Header />
      <div className="flex w-full  items-center justify-end px-4 pt-2">
        <Switch.Group>
          <div className="flex items-center gap-2">
            <Switch.Label className="text-sm">Hide completed</Switch.Label>

            <Switch
              checked={value === "active"}
              onChange={onToggle}
              className={`${value === "active" ? "bg-blue-500" : "bg-teal-400"}
          relative inline-flex h-[16px] w-[24px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  value === "active" ? "translate-x-[8px]" : "translate-x-0"
                }
            pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>
      <Strip
        goals={goals.yearlyGoals}
        scope="year"
        date={date}
        hideCompleted={value === "active"}
      />
      <Strip
        goals={goals.monthlyGoals}
        scope="month"
        date={date}
        hideCompleted={value === "active"}
      />
      <Strip
        goals={goals.weeklyGoals}
        scope="week"
        date={date}
        hideCompleted={value === "active"}
      />
      <Strip
        goals={goals.dailyGoals}
        scope="day"
        date={date}
        hideCompleted={value === "active"}
      />
    </main>
  );
}
