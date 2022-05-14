import { useFetcher } from "@remix-run/react";
import { useField, ValidatedForm } from "remix-validated-form";
import { setGoalValidator } from ".";

type Props = {
  scope: "year" | "month" | "week" | "day";
};
let GoalForm = (props: Props) => {
  let fetcher = useFetcher();
  let { getInputProps, error } = useField("title", {
    formId: `goal-form-${props.scope}`,
  });

  return (
    <fetcher.Form id={`goal-form-${props.scope}`} method="post">
      <input {...getInputProps({ placeholder: "Set an yearly goal" })} />
      <input type="hidden" name="scope" value={props.scope} />

      <button type="submit" name="_action" value="set_goal" />
      {error && <div className="text-red-500">{error}</div>}
    </fetcher.Form>
  );
};

export default GoalForm;
