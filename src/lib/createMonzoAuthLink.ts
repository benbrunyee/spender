import { PUBLIC_MONZO_CLIENT_ID } from "$env/static/public";
import createMonzoRedirectLink from "./createMonzoRedirectLink";
import createNewMonzoState from "./createNewMonzoState";

export default (state?: string) => {
  const monzoState = state ?? createNewMonzoState();

  return (
    "https://auth.monzo.com/" +
    "?client_id=" +
    PUBLIC_MONZO_CLIENT_ID +
    "&redirect_uri=" +
    createMonzoRedirectLink() +
    "&response_type=code" +
    "&state=" +
    monzoState
  );
};
