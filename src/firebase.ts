import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXhUhH15Lzz4hqsgvPjfoJimZjRoWE8Zo",
  authDomain: "spender-7e181.firebaseapp.com",
  projectId: "spender-7e181",
  storageBucket: "spender-7e181.appspot.com",
  messagingSenderId: "578896377696",
  appId: "1:578896377696:web:3a9d82323e696c29e95005",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(firestore, "localhost", 8080);
}

export { app, firestore };
