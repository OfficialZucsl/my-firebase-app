
// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

// Global singleton variables to ensure the SDK is initialized only once
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let initializationPromise: Promise<{ app: App; auth: Auth }> | null = null;

// Helper to format the private key, converting escaped newlines to actual newlines.
const formatPrivateKey = (key: string | undefined): string => {
  if (!key) {
    throw new Error('FIREBASE_PRIVATE_KEY environment variable is not defined.');
  }
  return key.replace(/\\n/g, '\n');
};


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

      const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

      console.log('Admin SDK Init: Project ID defined?', !!projectId);
      console.log('Admin SDK Init: Client Email defined?', !!clientEmail);
      
      if (!projectId || !privateKey || !clientEmail) {
        const missing = { projectId: !projectId, clientEmail: !clientEmail, privateKey: !privateKey };
        console.error('Admin SDK Init Error: Missing environment variables', missing);
        throw new Error(`Missing Firebase credentials: ${JSON.stringify(missing)}`);
      }
      
      const credential = cert({
        projectId,
        clientEmail,
        privateKey,
      });

      adminApp = initializeApp({ credential });
      adminAuth = getAuth(adminApp);

      console.log('Firebase Admin SDK initialized successfully.');
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
