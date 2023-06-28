import { onCall } from "firebase-functions/v2/https";
import exchangeCodeForMonzoAccessTokenCallable from "./callable/exchangeCodeForMonzoAccessToken";
import formatCallableResponse from "./lib/formatCallableResponse";

export const exchangeCodeForMonzoAccessToken = onCall(
  {},
  formatCallableResponse(exchangeCodeForMonzoAccessTokenCallable),
);
