import * as crypto from "crypto";
import { firestore } from "firebase-admin";
import * as logger from "firebase-functions/logger";
import getSalt from "./getSalt";
import { Provider } from "./types";

export default async (
  uid: string,
  tokenType: "accessToken" | "refreshToken",
  tokenName: Provider,
  accessToken: string,
  opts: { hash?: boolean } = {},
) => {
  let salt = null;
  salt = await getSalt("monzoHashSalt");
  logger.debug(`Salt: ${salt}`);

  if (!salt) {
    throw new Error("Missing hash salt");
  }

  const tokenPath = `${tokenType}s.${tokenName}`;

  if (!opts.hash) {
    // Don't hash, just save the token
    logger.debug(`Saving ${tokenType} without hashing`);
    firestore()
      .collection("data")
      .doc(uid)
      .update({ [tokenPath]: accessToken });
    return;
  }

  // Hash the token
  const hash = crypto
    .createHash("sha256")
    .update(accessToken + salt)
    .digest("hex");

  if (!hash) {
    throw new Error(`Could not hash ${tokenType}`);
  }

  // Save the hash
  logger.debug(`Saving ${tokenType} hash`);
  firestore()
    .collection("data")
    .doc(uid)
    .update({ [tokenPath]: hash });
};
