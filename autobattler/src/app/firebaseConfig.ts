import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pokemone-b4cdd.firebaseapp.com",
  projectId: "pokemone-b4cdd",
  storageBucket: "pokemone-b4cdd.firebasestorage.app",
  messagingSenderId: "651123518640",
  appId: "1:651123518640:web:4f93c51f3ee50ec7e99f75",
  measurementId: "G-MHH18VV2H5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };