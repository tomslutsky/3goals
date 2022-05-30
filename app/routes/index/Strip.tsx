import type { Goal } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import GoalForm from "./GoalForm";
import { formatDateByScope } from "~/dates";
import { useEffect, useMemo, useRef, type HTMLProps } from "react";
import classNames from "classnames";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "@heroicons/react/outline";

import { add, format } from "date-fns";

type Props = HTMLProps<HTMLDivElement> & {
  goals: Goal[];
  scope: "year" | "month" | "week" | "day";
  date: Date;
  hideCompleted?: boolean;
};
let Strip = (props: Props) => {
  let { goals, scope, date, className, hideCompleted, ...rest } = props;

  let numOfActiveGoals = useMemo(() => {
    return goals.filter((goal) => goal.status === "active").length;
  }, [goals]);

  let formattedDate = formatDateByScope(date, scope);

  let filteredGoals = useMemo(() => {
    if (hideCompleted) {
      return goals.filter((goal) => goal.status !== "done");
    }
    return goals;
  }, [goals, hideCompleted]);

  let nextDate = add(date, { [`${scope}s`]: 1 });
  let prevDate = add(date, { [`${scope}s`]: -1 });

  return (
    <section
      {...rest}
      className={classNames(
        "flex h-full w-full flex-col items-start  space-y-2 p-4 shadow",
        className
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Link to={`/?date=${format(prevDate, "yyyy-MM-dd")}`}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
        <h3 className="text-lg font-bold">
          {scope === "week" ? "Week " : ""}
          {formattedDate}
        </h3>
        <Link
          to={`/?date=${format(nextDate, "yyyy-MM-dd")}`}
          className="h-4 w-4"
        >
          <ChevronRightIcon />
        </Link>
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
