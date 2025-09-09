
'use server';

import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import 'server-only';

function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !privateKey ||
    !process.env.FIREBASE_CLIENT_EMAIL
  ) {
    throw new Error(
      'Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL) are not set. Server-side Firebase features will be disabled.'
    );
  }
  
  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("Firebase Admin SDK initialized successfully.");
    return app;
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization failed:", error.message);
    throw new Error(
      'Could not initialize Firebase Admin SDK. Please check your Firebase environment variables.'
    );
  }
}


export async function getAuthenticatedUser() {
  const session = cookies().get('session')?.value;

  if (!session) {
    return null;
  }

  try {
    const app = getAdminApp();
    const decodedIdToken = await getAuth(app).verifySessionCookie(
      session,
      true
    );
    return decodedIdToken;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    // clean up the invalid cookie
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
    const sessionCookie = await getAuth(app).createSessionCookie(idToken, {
      expiresIn,
    });
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Firebase environment variables')
    ) {
      throw new Error(
        'Firebase Admin SDK is not initialized. Cannot create session cookie.'
      );
    }
    throw error;
  }
}
