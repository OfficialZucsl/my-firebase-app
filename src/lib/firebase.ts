// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmZDIw34uiYqsmZsouOVbVqBlYHnibp-g",
  authDomain: "fiducialend.firebaseapp.com",
  projectId: "fiducialend",
  storageBucket: "fiducialend.appspot.com",
  messagingSenderId: "56482727919",
  appId: "1:56482727919:web:ec41baf7bb9e66214b181a"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
