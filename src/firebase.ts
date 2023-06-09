import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const googleProvider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyDXhUhH15Lzz4hqsgvPjfoJimZjRoWE8Zo",
  authDomain: "spender-7e181.web.app",
  projectId: "spender-7e181",
  storageBucket: "spender-7e181.appspot.com",
  messagingSenderId: "578896377696",
  appId: "1:578896377696:web:3a9d82323e696c29e95005",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const functions = getFunctions(app);
const auth = getAuth(app);
auth.useDeviceLanguage();
setPersistence(auth, browserLocalPersistence);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export { app, auth, firestore, functions, googleProvider };
