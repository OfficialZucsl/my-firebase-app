
'use server';

// Use require for dotenv to ensure it runs before anything else
require('dotenv').config();

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import 'server-only';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Directly read from process.env, which is populated by dotenv
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set in the .env file. Server-side Firebase features will be disabled.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    throw new Error('Could not initialize Firebase Admin SDK. Please check that your FIREBASE_SERVICE_ACCOUNT_KEY in the .env file is a valid JSON string.');
  }
}


export async function getAuthenticatedUser() {
  const session = cookies().get('session')?.value;

  if (!session) {
    return null;
  }

  try {
    const app = getAdminApp();
    const decodedIdToken = await getAuth(app).verifySessionCookie(session, true);
    return decodedIdToken;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    // If the session is invalid, try to delete the cookie
    try {
      cookies().delete('session');
    } catch (deleteError) {
      console.error('Failed to delete invalid session cookie:', deleteError);
    }
    return null;
  }
}

export async function createSessionCookie(idToken: string) {
  try {
    const app = getAdminApp();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth(app).createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
  } catch (error) {
     if (error instanceof Error && error.message.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
        throw new Error('Firebase Admin SDK is not initialized. Cannot create session cookie.');
     }
     throw error;
  }
}
