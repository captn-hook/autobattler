import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

console.log("Initializing Firebase Admin SDK...");

const firebaseConfig = {
  credential: cert({
    projectId: "pokemone-b4cdd",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pokemone-b4cdd.firebaseapp.com",
  projectId: "pokemone-b4cdd",
  storageBucket: "pokemone-b4cdd.firebasestorage.app",
  messagingSenderId: "651123518640",
  appId: "1:651123518640:web:4f93c51f3ee50ec7e99f75",
  measurementId: "G-MHH18VV2H5"
};

// Check if the app is already initialized
const app = getApps().find(app => app.name === 'serverApp') 
  ? getApp('serverApp') 
  : initializeApp(firebaseConfig, 'serverApp');

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };