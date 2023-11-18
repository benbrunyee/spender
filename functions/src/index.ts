import { initializeApp } from "firebase-admin/app";
import { onCall } from "firebase-functions/v2/https";
import exchangeCodeForMonzoAccessTokenCallable from "./callable/exchangeCodeForMonzoAccessToken";
import formatCallableResponse from "./lib/formatCallableResponse";

initializeApp();

export const exchangeCodeForMonzoAccessToken = onCall(
  {},
  formatCallableResponse(exchangeCodeForMonzoAccessTokenCallable),
);
