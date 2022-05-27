import type { Goal } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import GoalForm from "./GoalForm";
import { formatDateByScope } from "~/dates";
import { useMemo, type HTMLProps } from "react";
import classNames from "classnames";
import { XIcon } from "@heroicons/react/outline";

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
      <ul className="w-full">
        {goals.map((goal) => (
          <li key={goal.id} className="w-full">
            <GoalItem {...goal} />
          </li>
        ))}
        {goals.length < 3 && (
          <li>
            <GoalForm scope={scope} />
          </li>
        )}
      </ul>
    </section>
  );
};

export default Strip;

let GoalItem = (goal: Goal) => {
  let fetcher = useFetcher();

  let status = useMemo(() => {
    if (fetcher.submission) {
      return fetcher.submission.formData.get("_action") === "mark_done"
        ? "done"
        : "active";
    }
    return goal.status;
  }, [fetcher.submission, goal.status]);

  return (
    <fetcher.Form
      method="post"
      key={goal.id}
      className="grid w-full grid-cols-[min-content_auto_min-content] items-center gap-3"
    >
      <input type="hidden" name="id" value={goal.id} />
      <input
        type="checkbox"
        name="_action"
        value={status === "active" ? "mark_done" : "mark_not_done"}
        onChange={() => {
          let formData = new FormData();
          formData.append(
            "_action",
            status === "active" ? "mark_done" : "mark_not_done"
          );
          formData.append("id", goal.id);
          fetcher.submit(formData, { method: "post" });
        }}
        defaultChecked={status === "done"}
      />
      <p className={status === "done" ? "line-through opacity-50" : ""}>
        {goal.title}
      </p>
      <div className="flex items-center space-x-2">
        <button name="_action" value="archive">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </fetcher.Form>
  );
};
