import * as logger from "firebase-functions/logger";
import getUserRefreshToken from "../lib/getUserRefreshToken";
import monzoApiUri from "../lib/monzoApiUri";
import processTokenResponse from "../lib/processTokenResponse";
import { FunctionReturnData, Provider } from "../lib/types";

export default async (request: any): Promise<FunctionReturnData> => {
  const uid = request.auth?.uid;

  if (!uid) {
    return {
      success: false,
      msg: "Not authenticated",
    };
  }

  let refreshToken = null;

  try {
    refreshToken = await getUserRefreshToken(uid, "monzo");
  } catch (e) {
    return {
      error: e,
      success: false,
      msg: "Could not get refresh token",
    };
  }

  const monzoExchangeCodeUrl = monzoApiUri + "/oauth2/token";
  const postFormData = {
    grant_type: "refresh_token",
    client_id: process.env.MONZO_CLIENT_ID,
    client_secret: process.env.MONZO_CLIENT_SECRET,
    refresh_token: refreshToken,
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

  if (!json.access_token) {
    return {
      success: false,
      msg: "No access token in response",
    };
  }

  if (!json.refresh_token) {
    return {
      success: false,
      msg: "No refresh token in response",
    };
  }

  let accessToken = null;
  let accessTokenExpiresIn = null;
  try {
    const tokenResponse = await processTokenResponse(uid, json, Provider.Monzo);

    accessToken = tokenResponse.accessToken;
    accessTokenExpiresIn = tokenResponse.accessTokenExpiresIn;
  } catch (e) {
    return {
      error: e,
      success: false,
      msg: "Failed to save access token",
    };
  }

  return {
    success: true,
    msg: "Successfully exchanged refresh token for access token",
    body: {
      monzoAccessToken: accessToken,
      monzoAccessTokenExpiresIn: accessTokenExpiresIn,
    },
  };
};
