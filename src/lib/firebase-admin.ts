'use server';

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import 'server-only';

let adminApp: App;

if (!getApps().length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error parsing Firebase service account key:', error);
    }
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Server-side Firebase features will be disabled.');
  }
} else {
  adminApp = getApps()[0];
}


export async function getAuthenticatedUser() {
  const session = cookies().get('session')?.value;

  if (!session) {
    return null;
  }

  if (!adminApp) {
    console.error("Firebase Admin SDK is not initialized. Cannot verify session cookie.");
    return null;
  }

  try {
    const decodedIdToken = await getAuth(adminApp).verifySessionCookie(session, true);
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
    if (!adminApp) {
      throw new Error("Firebase Admin SDK is not initialized. Cannot create session cookie.");
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}
