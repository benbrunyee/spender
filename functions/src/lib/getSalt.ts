import * as crypto from "crypto";
import { firestore } from "firebase-admin";
import * as logger from "firebase-functions/logger";

export default async (saltName: string) => {
  let saltDoc = null;
  let salt = null;

  try {
    saltDoc = await firestore().collection("config").doc(saltName).get();
  } catch (e) {
    console.error("Could not get hash salt doc", e);
    throw e;
  }

  if (!saltDoc.exists) {
    logger.debug("Salt doc does not exist, creating...");
    salt = await createSalt(saltName);
  }

  if (saltDoc.exists) {
    salt = saltDoc.data()?.salt;
  }

  if (!salt) {
    throw new Error("Could not get salt");
  }

  return salt;
};

async function createSalt(saltName: string) {
  const salt = crypto.randomBytes(16).toString("hex");

  try {
    await firestore().collection("config").doc(saltName).set({
      salt,
    });
  } catch (e) {
    console.error("Could not create hash salt doc", e);
    throw e;
  }

  return salt;
}
