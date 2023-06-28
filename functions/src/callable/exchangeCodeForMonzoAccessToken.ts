import * as logger from "firebase-functions/logger";
import monzoApiUri from "../lib/monzoApiUri";

export default async (request: any) => {
  const authorizationCode = request.data.code;
  const redirectUri = request.data.redirectUri;

  if (!authorizationCode) {
    return {
      success: false,
      msg: "No authorization code provided",
    };
  }

  if (!redirectUri) {
    return {
      success: false,
      msg: "No redirect URI provided",
    };
  }

  const monzoExchangeCodeUrl = monzoApiUri + "/oauth2/token";
  const postFormData = {
    grant_type: "authorization_code",
    client_id: process.env.MONZO_CLIENT_ID,
    client_secret: process.env.MONZO_CLIENT_SECRET,
    redirect_uri: redirectUri,
    code: authorizationCode,
  };

  logger.debug("POST form data: " + JSON.stringify(postFormData));

  const response = await fetch(monzoExchangeCodeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.entries(postFormData).reduce<string[][]>((r, [k, v]) => [...r, [k, v]], []),
    ),
  });

  const json = await response.json();
  logger.debug("Reponse (JSON): " + JSON.stringify(json));

  if (!response.ok) {
    return {
      success: false,
      msg: "API request failed",
    };
  }

  if (!json?.access_token) {
    return {
      success: false,
      msg: "Failed to exchange authorization code for access token",
    };
  }

  const monzoAccessToken = json.access_token;
  // const monzoRefreshToken = json.refresh_token;
  const monzoAccessTokenExpiresIn = json.expires_in;

  return {
    success: true,
    msg: "Successfully exchanged authorization code for access token",
    body: {
      monzoAccessToken,
      monzoAccessTokenExpiresIn,
    },
  };
};
