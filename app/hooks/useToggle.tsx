import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";

const toggleMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: { on: { TOGGLE: "active" } },
    active: { on: { TOGGLE: "inactive" } },
  },
});

export let useToggle = () => {
  let [state, send] = useMachine(toggleMachine);
  let { value, ...rest } = state;
  return {
    ...rest,
    value,
    onToggle: () => send("TOGGLE"),
  };
};
