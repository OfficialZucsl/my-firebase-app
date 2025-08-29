'use server';

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import 'server-only';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!getApps().length) {
  initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
  });
}

export async function getAuthenticatedUser() {
  const session = cookies().get('session')?.value;

  if (!session) {
    return null;
  }

  try {
    const decodedIdToken = await getAuth().verifySessionCookie(session, true);
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
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}
