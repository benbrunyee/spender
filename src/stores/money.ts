import { doc, setDoc } from "firebase/firestore";
import { writable } from "svelte/store";
import { auth, firestore } from "../firebase";

const moneyStore = () => {
  const store = writable(0);

  /**
   * Triggers a write to the database to update the user's money
   */
  const updateMoney = async (money: number) => {
    store.set(money);

    if (!auth.currentUser) {
      console.warn("User not logged in, can't update money");
      return;
    }

    try {
      await setDoc(
        doc(firestore, "data", auth.currentUser.uid),
        {
          money: money,
        },
        {
          merge: true,
        },
      );
    } catch (e) {
      console.error(e);
      return;
    }
  };

  return {
    ...store,
    updateMoney,
  };
};

export default moneyStore();
