import type { Timestamp } from "firebase/firestore";
import { writable } from "svelte/store";
import { auth } from "../firebase";

const monzoStore = () => {
  const store = writable<{
    accessToken: string;
    expiry: Timestamp | null;
    code: string;
    isAuthenticated: boolean;
  }>({
    accessToken: "",
    expiry: null,
    code: "",
    isAuthenticated: false,
  });

  const updateAccessToken = async (accessToken: string) => {
    store.update((cur) => ({ ...cur, accessToken: accessToken }));

    if (!auth.currentUser) {
      console.warn("No user logged in, cannot update access token");
      return;
    }
  };

  const updateCode = (code: string) => {
    store.update((cur) => ({ ...cur, code: code }));
  };

  const updateExpiry = (expiry: Timestamp) => {
    store.update((cur) => ({ ...cur, expiry: expiry }));
  };

  return {
    ...store,
    updateAccessToken,
    updateCode,
    updateExpiry,
  };
};

export default monzoStore();
