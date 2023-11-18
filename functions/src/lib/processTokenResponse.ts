import * as logger from "firebase-functions/logger";
import saveToken from "./saveToken";
import { Provider } from "./types";

export default async (uid: string, body: any, provider: Provider) => {
  const accessToken = body.access_token;
  const refreshToken = body.refresh_token;
  // This is in seconds
  const accessTokenExpiresIn = body.expires_in;

  const encryptKey = process.env.MONZO_ENCRYPT_KEY;
  const encryptInitVector = process.env.MONZO_ENCRYPT_INIT_VECTOR;

  if (!encryptKey || !encryptInitVector) {
    throw new Error("Missing encryption key or init vector");
  }

  logger.debug("Saving access token");
  await saveToken(uid, "accessToken", provider, accessToken, {
    // Convert seconds to milliseconds
    expires: new Date(Date.now() + accessTokenExpiresIn * 1000),
    encrypt: {
      key: encryptKey,
      init_vector: encryptInitVector,
    },
  });

  logger.debug("Saving refresh token");
  await saveToken(uid, "refreshToken", provider, refreshToken);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn,
  };
};
