import monzo from "../stores/monzo";
import fetchMonzo from "./fetchMonzo";

export default async () => {
  // Check if we are already logged in
  const loggedInResponse = await fetchMonzo("/ping/whoami");
  const loggedInJson = await loggedInResponse.json();
  console.debug("Ping JSON response", loggedInJson);

  if (loggedInJson?.authenticated) {
    console.debug("Already logged into Monzo");
    monzo.update((cur) => ({ ...cur, isAuthenticated: true }));
    return true;
  } else {
    console.debug("User is not logged into Monzo");
  }

  monzo.update((cur) => ({ ...cur, isAuthenticated: false }));
  return false;
};
