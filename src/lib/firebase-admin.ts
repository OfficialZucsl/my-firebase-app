// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { config } from 'dotenv';
import path from 'path';

// Explicitly load .env file from the project root
config({ path: path.resolve(process.cwd(), '.env') });


// Global singleton variables to ensure the SDK is initialized only once
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let initializationPromise: Promise<{ app: App; auth: Auth }> | null = null;

async function initializeFirebaseAdmin(): Promise<{ app: App; auth: Auth }> {
  // If already initialized, return existing instances
  if (adminApp && adminAuth) {
    return { app: adminApp, auth: adminAuth };
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start new initialization
  initializationPromise = (async () => {
    try {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        adminApp = existingApps[0];
        adminAuth = getAuth(adminApp);
        return { app: adminApp, auth: adminAuth };
      }

      const privateKey = process.env.FIREBASE_PRIVATE_KEY;
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

      if (!projectId || !privateKey || !clientEmail) {
        throw new Error(`Missing Firebase credentials: ${!projectId ? 'PROJECT_ID ' : ''}${!privateKey ? 'PRIVATE_KEY ' : ''}${!clientEmail ? 'CLIENT_EMAIL' : ''}`);
      }
      
      const credential = cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      });

      adminApp = initializeApp({ credential });
      adminAuth = getAuth(adminApp);

      return { app: adminApp, auth: adminAuth };

    } catch (error) {
      console.error('Firebase Admin initialization failed:', error);
      
      // Reset state on failure to allow retries
      adminApp = null;
      adminAuth = null;
      initializationPromise = null;
      
      throw error;
    }
  })();

  return initializationPromise;
}

export async function getAdminAuth(): Promise<Auth> {
  const { auth } = await initializeFirebaseAdmin();
  return auth;
}

export async function getAuthenticatedUser() {
  const session = cookies().get('session')?.value;
  if (!session) {
    return null;
  }
  try {
    const auth = await getAdminAuth();
    const decodedToken = await auth.verifySessionCookie(session, true);
    const user = await auth.getUser(decodedToken.uid);
    return user;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    cookies().delete('session');
    return null;
  }
}

export async function createSessionCookieFromToken(idToken: string) {
    try {
      const auth = await getAdminAuth();
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      return sessionCookie;
    } catch (error: any) {
      console.error('Error creating session cookie:', error);
      throw error;
    }
  }
