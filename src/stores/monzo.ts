import { doc, updateDoc } from "firebase/firestore";
import { writable } from "svelte/store";
import { auth, firestore } from "../firebase";

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
      await updateDoc(doc(firestore, "data", auth.currentUser.uid), {
        monzoAccessToken: accessToken,
      });
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
