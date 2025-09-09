'use server';

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import 'server-only';

let adminApp: App;

function initializeFirebaseAdmin(): App {
  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  console.log('--- Initializing Firebase Admin SDK ---');
  console.log('Checking environment variables:', {
    projectId: process.env.FIREBASE_PROJECT_ID ? 'FOUND' : 'MISSING',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'FOUND' : 'MISSING',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? `FOUND (starts with: ${process.env.FIREBASE_PRIVATE_KEY.substring(0, 35)}...)` : 'MISSING',
  });

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error(
      'Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL) are not set correctly. Server-side Firebase features will be disabled.'
    );
  }
  
  try {
    const credential = cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    });

    adminApp = initializeApp({
      credential,
    });

    console.log("Firebase Admin SDK initialized successfully.");
    return adminApp;
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization failed:", error.message);
    throw new Error(
      `Could not initialize Firebase Admin SDK. Please check your Firebase environment variables. Error: ${error.message}`
    );
  }
}

export function getFirebaseAdmin(): App {
    if (!adminApp) {
        adminApp = initializeFirebaseAdmin();
    }
    return adminApp;
}

export function getAdminAuth() {
    return getAuth(getFirebaseAdmin());
}
