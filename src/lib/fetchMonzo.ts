import monzo from "../stores/monzo";
import refreshMonzoAccessToken from "./refreshMonzoAccessToken";

let tokenExpired = false;

monzo.subscribe((cur) => {
  if (cur.expiry && cur.expiry.toDate() < new Date()) {
    tokenExpired = true;
  }
});

export default (endpoint: string, accessToken?: string, params?: object) => {
  if (tokenExpired) {
    console.log("Token expired, refreshing");
    refreshMonzoAccessToken().then((newAccessToken) => {
      tokenExpired = false;
      return createMonzoCall(endpoint, newAccessToken, params);
    });
  } else {
    return createMonzoCall(endpoint, accessToken, params);
  }
};

function createMonzoCall(endpoint: string, accessToken?: string, params?: object) {
  const url = new URL(endpoint, "https://api.monzo.com");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return fetch(
    url,
    accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {},
  );
}
