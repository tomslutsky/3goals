import { Disclosure } from "@headlessui/react";
import type { Goal } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import GoalForm from "./GoalForm";
import { ArchiveIcon } from "@heroicons/react/solid";

type Props = {
  goals: Goal[];
  scope: "year" | "month" | "week" | "day";
};
let Strip = (props: Props) => {
  let { goals, scope } = props;

  let hasGoals = goals.length > 0;

  return (
    <section className="flex h-full w-full flex-col items-start justify-center shadow-md">
      {hasGoals ? (
        <Disclosure as="div" className="w-full space-y-2 py-2">
          <Disclosure.Button className="w-full px-4 text-left" as="div">
            <GoalItem {...goals[0]} />
          </Disclosure.Button>
          <Disclosure.Panel className="space-y-2 px-4 text-gray-500">
            {goals.slice(1).map((goal) => (
              <GoalItem key={goal.id} {...goal} />
            ))}
            {goals.length < 3 && <GoalForm scope={scope} />}
          </Disclosure.Panel>
        </Disclosure>
      ) : (
        <GoalForm scope={scope} />
      )}
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
      {goal.title}
      <button name="_action" value="archive">
        <ArchiveIcon className="h-5 w-5" />
      </button>
    </fetcher.Form>
  );
};
