import { initializeApp } from "firebase-admin/app";
import { onCall } from "firebase-functions/v2/https";
import exchangeCodeForMonzoAccessTokenCallable from "./callable/exchangeCodeForMonzoAccessToken";
import getMonzoAccessTokenCallable from "./callable/getMonzoAccessToken";
import refreshMonzoAccessTokenCallable from "./callable/refreshMonzoAccessToken";
import formatCallableResponse from "./lib/formatCallableResponse";

initializeApp();

export const exchangeCodeForMonzoAccessToken = onCall(
  {},
  formatCallableResponse(exchangeCodeForMonzoAccessTokenCallable),
);

export const refreshMonzoAccessToken = onCall(
  {},
  formatCallableResponse(refreshMonzoAccessTokenCallable),
);

export const getMonzoAccessToken = onCall({}, formatCallableResponse(getMonzoAccessTokenCallable));
