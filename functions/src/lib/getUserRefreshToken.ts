import { firestore } from "firebase-admin";

export default async (uid: string, tokenName: string) => {
  const userDoc = await firestore().collection("data").doc(uid).get();

  if (!userDoc.exists) {
    throw new Error("User document does not exist");
  }

  const userData = userDoc.data();

  console.log(userData);

  if (!userData?.accessTokens?.[tokenName].refreshToken) {
    throw new Error("No refresh token found");
  }

  return userData.accessTokens[tokenName].refreshToken;
};
