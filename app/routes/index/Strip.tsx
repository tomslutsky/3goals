import type { Goal } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import GoalForm from "./GoalForm";
import { ArchiveIcon, CheckIcon } from "@heroicons/react/solid";
import { formatDateByScope } from "~/dates";
import { type HTMLProps } from "react";
import classNames from "classnames";

type Props = HTMLProps<HTMLDivElement> & {
  goals: Goal[];
  scope: "year" | "month" | "week" | "day";
  date: Date;
};
let Strip = (props: Props) => {
  let { goals, scope, date, className, ...rest } = props;

  let formattedDate = formatDateByScope(date, scope);
  return (
    <section
      {...rest}
      className={classNames(
        "flex h-full w-full flex-col items-start  space-y-2 p-4 shadow",
        className
      )}
    >
      <h3 className="text-lg font-bold">
        {scope === "week" ? "Week " : ""}
        {formattedDate}
      </h3>
      {goals.map((goal) => (
        <GoalItem key={goal.id} {...goal} />
      ))}
      {goals.length < 3 && <GoalForm scope={scope} />}
    </section>
  );
};

export default Strip;

let GoalItem = (goal: Goal) => {
  let fetcher = useFetcher();
  return (
    <fetcher.Form
      method="post"
      key={goal.id}
      className="flex w-full flex-row justify-between"
    >
      <input type="hidden" name="id" value={goal.id} />
      <p>{goal.title}</p>
      <div className="flex items-center space-x-2">
        <button name="_action" value="mark_done">
          <CheckIcon className="h-5 w-5" />
        </button>
        <button name="_action" value="archive">
          <ArchiveIcon className="h-5 w-5" />
        </button>
      </div>
    </fetcher.Form>
  );
};
