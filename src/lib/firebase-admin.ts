// lib/firebase-admin.js
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import 'dotenv/config';

// Define a type for our global variable to ensure type safety
interface FirebaseAdminGlobal {
  app?: App;
  auth?: Auth;
}

// Use a unique symbol to store the Firebase Admin instance on the global object.
// This prevents collisions with other libraries.
const ADMIN_APP_KEY = Symbol.for('firebase-admin-app');

// Type assertion for the global object
const globalWithFirebase = global as typeof globalThis & {
  [ADMIN_APP_KEY]?: FirebaseAdminGlobal;
};

function getFirebaseAdmin(): FirebaseAdminGlobal {
  // If the instance already exists, return it
  if (globalWithFirebase[ADMIN_APP_KEY]) {
    return globalWithFirebase[ADMIN_APP_KEY]!;
  }

  // Otherwise, initialize the app and store it
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('Firebase Admin SDK credentials are not set in environment variables.');
    }
    
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    
    const auth = getAuth(app);
    
    globalWithFirebase[ADMIN_APP_KEY] = { app, auth };
    
    return { app, auth };

  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
    // Throw a more specific error to help with debugging
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

export function getAdminAuth(): Auth {
  const { auth } = getFirebaseAdmin();
  return auth!;
}

export async function getAuthenticatedUser() {
  const session = cookies().get('session')?.value;
  if (!session) {
    return null;
  }
  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifySessionCookie(session, true);
    const user = await auth.getUser(decodedToken.uid);
    return user;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    // Invalidate the cookie if it's invalid
    cookies().delete('session');
    return null;
  }
}
