import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import monzo from "../stores/monzo";

export default async (): Promise<string> => {
  let accessToken = null;

  try {
    const result = await httpsCallable<null, any>(functions, "refreshMonzoAccessToken")();
    accessToken = result.data?.body?.monzoAccessToken;
  } catch (e) {
    console.error(e);
  }

  if (!accessToken) {
    throw new Error("Could not refresh access token");
  }

  monzo.updateAccessToken(accessToken);

  return accessToken;
};
