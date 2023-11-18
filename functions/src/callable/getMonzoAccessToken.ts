import * as crypto from "crypto";
import { firestore } from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { FunctionReturnData } from "../lib/types";

export default async (request: any): Promise<FunctionReturnData> => {
  const uid = request.auth.uid;

  if (!uid) {
    return {
      success: false,
      msg: "Not authenticated",
    };
  }

  let accessToken = null;
  try {
    const docRef = await firestore().collection("data").doc(uid).get();
    const docData = docRef.data();

    accessToken = docData?.accessTokens?.monzo?.accessToken;
  } catch (e) {
    return {
      error: e,
      success: false,
      msg: "Failed to get access token",
    };
  }

  if (!accessToken) {
    return {
      success: false,
      msg: "No access token found",
    };
  }

  // Decrypt the token
  const decryptKey = process.env.MONZO_ENCRYPT_KEY;
  const decryptInitVector = process.env.MONZO_ENCRYPT_INIT_VECTOR;

  if (!decryptKey || !decryptInitVector) {
    return {
      success: false,
      msg: "Missing decryption key or init vector",
    };
  }

  logger.debug("Decrypting access token");
  const decryptedAccessToken = decryptValue(decryptKey, decryptInitVector, accessToken);

  return {
    success: true,
    msg: "Successfully decrypted access token",
    body: {
      accessToken: decryptedAccessToken,
    },
  };
};

function decryptValue(key: string, init_vector: string, value: string) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(init_vector, "hex"),
  );

  let decrypted = decipher.update(value, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
