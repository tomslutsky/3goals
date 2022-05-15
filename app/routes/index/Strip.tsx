import type { Goal } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import GoalForm from "./GoalForm";
import { ArchiveIcon, CheckIcon } from "@heroicons/react/solid";

type Props = {
  goals: Goal[];
  scope: "year" | "month" | "week" | "day";
};
let Strip = (props: Props) => {
  let { goals, scope } = props;

  return (
    <section className="flex h-full w-full flex-col items-start justify-center space-y-2 p-4 shadow-md">
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
