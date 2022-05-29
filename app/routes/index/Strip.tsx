import type { Goal } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import GoalForm from "./GoalForm";
import { formatDateByScope } from "~/dates";
import { useEffect, useMemo, useRef, type HTMLProps } from "react";
import classNames from "classnames";
import { XIcon } from "@heroicons/react/outline";
import { useToggle } from "~/hooks/useToggle";
import { Switch } from "@headlessui/react";

type Props = HTMLProps<HTMLDivElement> & {
  goals: Goal[];
  scope: "year" | "month" | "week" | "day";
  date: Date;
};
let Strip = (props: Props) => {
  let { goals, scope, date, className, ...rest } = props;
  let { value, onToggle } = useToggle();

  let numOfActiveGoals = useMemo(() => {
    return goals.filter((goal) => goal.status === "done").length;
  }, [goals]);

  let formattedDate = formatDateByScope(date, scope);

  let filteredGoals = useMemo(() => {
    if (value === "active") {
      return goals.filter((goal) => goal.status !== "done");
    }
    return goals;
  }, [goals, value]);
  return (
    <section
      {...rest}
      className={classNames(
        "flex h-full w-full flex-col items-start  space-y-2 p-4 shadow",
        className
      )}
    >
      <div className="flex w-full items-center justify-between">
        <h3 className="text-lg font-bold">
          {scope === "week" ? "Week " : ""}
          {formattedDate}
        </h3>
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
      <ul className="w-full">
        {filteredGoals.map((goal) => (
          <li key={goal.id} className="w-full">
            <GoalItem {...goal} />
          </li>
        ))}
        {numOfActiveGoals < 3 && (
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

  let ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      fetcher.submission &&
      fetcher.submission.formData.get("_action") === "update"
    ) {
      ref.current?.blur();
    }
  }, [fetcher]);

  return (
    <div
      className={classNames(
        "grid w-full grid-cols-[min-content_auto_min-content] items-center gap-3",
        {
          hidden: fetcher.submission?.formData.get("_action") === "archive",
        }
      )}
    >
      <fetcher.Form method="post">
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
      </fetcher.Form>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={goal.id} />

        <input
          ref={ref}
          onBlur={(e) => {
            fetcher.submit(e.target.form, { method: "post" });
          }}
          maxLength={80}
          className={classNames("w-full", {
            "line-through opacity-50": status === "done",
          })}
          name="title"
          defaultValue={goal.title}
        />
        <input type="hidden" name="_action" value="update" />
      </fetcher.Form>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={goal.id} />
        <button name="_action" value="archive">
          <XIcon className="h-5 w-5" />
        </button>
      </fetcher.Form>
    </div>
  );
};
