import { monzoState } from "../stores/monzoState";

export default () => {
  const state = crypto.randomUUID();

  // Expire the state in 1 minute
  const stateExpiry = new Date(Date.now() + 1000 * 60 * 1).toISOString();

  monzoState.set({
    state,
    stateExpiry,
  });

  return state;
};
