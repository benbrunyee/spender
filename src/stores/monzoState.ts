import { browser } from "$app/environment";
import { writable } from "svelte/store";

const monzoStateStore = () => {
  const monzoState = writable<{ state: string | null; stateExpiry: string | null }>({
    state: null,
    stateExpiry: null,
  });

  if (browser) {
    // Check if we have a state in local storage (that hasn't expired)
    let stateExpiry = window.localStorage.getItem("monzoStateExpiry");
    let state = window.localStorage.getItem("monzoState");

    // If the expiry is in the past, clear the state
    if (stateExpiry && new Date(stateExpiry) < new Date()) {
      window.localStorage.removeItem("monzoState");
      window.localStorage.removeItem("monzoStateExpiry");

      state = null;
      stateExpiry = null;
    }

    monzoState.set({ state, stateExpiry });
  }

  const set = (newState: { state: string; stateExpiry: string }) => {
    if (browser) {
      // Store the state in the session
      window.localStorage.setItem("monzoState", newState.state);
      // Store the expiry in the session (5 minutes from now)
      window.localStorage.setItem("monzoStateExpiry", newState.stateExpiry);
    }
    monzoState.set(newState);
  };

  return {
    ...monzoState,
    set,
  };
};

export const monzoState = monzoStateStore();
