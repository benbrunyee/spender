import * as logger from "firebase-functions/logger";
import saveToken from "./saveToken";
import { Provider } from "./types";

export default async (uid: string, body: any, provider: Provider) => {
  const accessToken = body.access_token;
  const refreshToken = body.refresh_token;
  const accessTokenExpiresIn = body.expires_in;

  logger.debug("Saving access token");
  await saveToken(uid, "accessToken", provider, accessToken);

  logger.debug("Saving refresh token");
  await saveToken(uid, "refreshToken", provider, refreshToken);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn,
  };
};
