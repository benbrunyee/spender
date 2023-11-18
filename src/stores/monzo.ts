import { httpsCallable } from "firebase/functions";
import { writable } from "svelte/store";
import { auth, functions } from "../firebase";

const monzoStore = () => {
  const store = writable({
    accessToken: "",
    code: "",
    isAuthenticated: false,
  });

  const updateAccessToken = async (accessToken: string) => {
    store.update((cur) => ({ ...cur, accessToken: accessToken }));

    if (!auth.currentUser) {
      console.warn("No user logged in, cannot update access token");
      return;
    }

    try {
      await httpsCallable<{ tokenName: string; accessToken: string }>(
        functions,
        "saveAccessToken",
      )({ tokenName: "monzoAccessToken", accessToken });
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const updateCode = (code: string) => {
    store.update((cur) => ({ ...cur, code: code }));
  };

  return {
    ...store,
    updateAccessToken,
    updateCode,
  };
};

export default monzoStore();
