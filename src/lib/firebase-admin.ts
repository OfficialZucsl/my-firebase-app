
// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

// Global singleton variables to ensure the SDK is initialized only once
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let initializationPromise: Promise<{ app: App; auth: Auth }> | null = null;

async function initializeFirebaseAdmin(): Promise<{ app: App; auth: Auth }> {
  // If already initialized, return existing instances
  if (adminApp && adminAuth) {
    console.log('Firebase Admin already initialized, using existing instance');
    return { app: adminApp, auth: adminAuth };
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    console.log('Firebase Admin initialization in progress, waiting...');
    return initializationPromise;
  }

  // Start new initialization
  initializationPromise = (async () => {
    try {
      console.log('Starting Firebase Admin initialization...');
      
      const existingApps = getApps();
      if (existingApps.length > 0) {
        console.log('Found existing Firebase app, using it');
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

      console.log('All Firebase credentials found, creating credential...');
      
      const credential = cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      });

      console.log('Initializing Firebase app...');
      adminApp = initializeApp({ credential });
      adminAuth = getAuth(adminApp);

      console.log('Firebase Admin initialized successfully');
      console.log('App name:', adminApp.name);
      console.log('Project ID:', adminApp.options.projectId);


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
    console.log('\n--- createSessionCookieFromToken START ---');
    console.log('ID token received, length:', idToken.length);
    
    try {
      console.log('Getting admin auth...');
      const auth = await getAdminAuth();
      console.log('Admin auth obtained successfully');
      console.log('Auth app name:', auth.app.name);
      
      console.log('Setting expiration time...');
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      console.log('Expires in:', expiresIn, 'ms');
      
      console.log('Calling auth.createSessionCookie...');
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      
      console.log('Session cookie created successfully!');
      console.log('Session cookie length:', sessionCookie.length);
      console.log('--- createSessionCookieFromToken SUCCESS ---\n');
      
      return sessionCookie;
      
    } catch (error: any) {
      console.error('\n--- createSessionCookieFromToken ERROR ---');
      console.error('Error at createSessionCookie step');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      console.error('--- END createSessionCookieFromToken ERROR ---\n');
      throw error;
    }
  }
