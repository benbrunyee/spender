import * as crypto from "crypto";
import { firestore } from "firebase-admin";
import * as logger from "firebase-functions/logger";
import getSalt from "./getSalt";
import { Provider } from "./types";

export default async (
  uid: string,
  tokenType: "accessToken" | "refreshToken",
  tokenName: Provider,
  token: string,
  opts: {
    hash?: boolean;
    expires?: Date;
    encrypt?: {
      key: string;
      init_vector: string;
    };
  } = {},
) => {
  let salt = null;
  salt = await getSalt("monzoHashSalt");
  logger.debug(`Salt: ${salt}`);

  if (!salt) {
    throw new Error("Missing hash salt");
  }

  const tokenPath = `accessTokens.${tokenName}`;

  function createTokenObject(value: string) {
    return {
      [`${tokenPath}.${tokenType}`]: value,
      ...(opts.expires ? { [`${tokenPath}.expiry`]: opts.expires } : {}),
    };
  }

  const docRef = firestore().collection("data").doc(uid);

  // Create the document if it doesn't exist
  if (!(await docRef.get()).exists) {
    await docRef.create({});
  }

  let newToken = token;

  if (opts.encrypt) {
    // Encrypt the token
    logger.debug(`Encrypting ${tokenType}`);
    newToken = encryptValue(opts.encrypt.key, opts.encrypt.init_vector, newToken);
  }

  if (opts.hash) {
    logger.debug(`Hashing ${tokenType}`);
    newToken = hashValue(salt, newToken);
  }

  // Save the token
  logger.debug(`Saving ${tokenType}`);
  await docRef.update(createTokenObject(newToken));
  return;
};

function encryptValue(key: string, init_vector: string, value: string) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(init_vector, "hex"),
  );
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function hashValue(salt: string, value: string) {
  // Hash the token
  const hash = crypto
    .createHash("sha256")
    .update(value + salt)
    .digest("hex");

  if (!hash) {
    throw new Error("Failed to hash value");
  }

  return hash;
}
