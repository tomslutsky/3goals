import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useRef } from "react";
import { useField } from "remix-validated-form";

type Props = {
  scope: "year" | "month" | "week" | "day";
};
let GoalForm = (props: Props) => {
  let fetcher = useFetcher();
  let { getInputProps, error } = useField("title", {
    formId: `goal-form-${props.scope}`,
  });

  let ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.type === "actionRedirect" || fetcher.type === "actionReload") {
      ref.current?.reset();
    }
  }, [fetcher.type]);

  return (
    <fetcher.Form
      ref={ref}
      id={`goal-form-${props.scope}`}
      method="post"
      className="w-full"
    >
      <input
        {...getInputProps({ placeholder: "Set a goal" })}
        className="w-full focus:outline-none focus:ring-0"
      />
      <input type="hidden" name="scope" value={props.scope} />

      <button type="submit" name="_action" value="set_goal" />
      {error && <div className="text-red-500">{error}</div>}
    </fetcher.Form>
  );
};

export default GoalForm;
