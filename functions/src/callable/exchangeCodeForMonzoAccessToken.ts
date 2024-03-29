import * as logger from "firebase-functions/logger";
import monzoApiUri from "../lib/monzoApiUri";
import processTokenResponse from "../lib/processTokenResponse";
import { FunctionReturnData, Provider } from "../lib/types";

export default async (request: any): Promise<FunctionReturnData> => {
  const authorizationCode = request.data.code;
  const redirectUri = request.data.redirectUri;
  const uid = request.auth?.uid;

  if (!uid) {
    return {
      success: false,
      msg: "Not authenticated",
    };
  }

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
    msg: "Successfully exchanged authorization code for access token",
    body: {
      monzoAccessToken: accessToken,
      monzoAccessTokenExpiresIn: accessTokenExpiresIn,
    },
  };
};
