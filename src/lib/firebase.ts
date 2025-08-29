// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "fiducialend",
  appId: "1:56482727919:web:ec41baf7bb9e66214b181a",
  storageBucket: "fiducialend.firebasestorage.app",
  apiKey: "AIzaSyCmZDIw34uiYqsmZsouOVbVqBlYHnibp-g",
  authDomain: "fiducialend.firebaseapp.com",
  messagingSenderId: "56482727919"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
