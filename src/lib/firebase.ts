// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "fiducialend",
  appId: "1:56482727919:web:ec41baf7bb9e66214b181a",
  storageBucket: "fiducialend.firebasestorage.app",
  apiKey: "AIzaSyCmZDIw34uiYqsmZsouOVbVqBlYHnibp-g",
  authDomain: "fiducialend.firebaseapp.com",
  messagingSenderId: "56482727919"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { app, db };
