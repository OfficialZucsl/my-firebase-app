// lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import type { User } from 'firebase-admin/auth';

let adminApp;
let adminAuth;

function initializeFirebaseAdmin() {
  // Check if already initialized
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    adminAuth = getAuth(adminApp);
    return { app: adminApp, auth: adminAuth };
  }

  // Debug environment variables
  console.log('Initializing Firebase Admin with:', {
    projectId: process.env.FIREBASE_PROJECT_ID ? 'FOUND' : 'MISSING',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? `${process.env.FIREBASE_PRIVATE_KEY.substring(0, 50)}...` : 'MISSING',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'FOUND' : 'MISSING'
  });

  try {
    // Method 1: Using individual environment variables
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    const credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    });

    adminApp = initializeApp({
      credential: credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    adminAuth = getAuth(adminApp);

    console.log('Firebase Admin initialized successfully');
    return { app: adminApp, auth: adminAuth };
    
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    
    // Method 2: Fallback to service account JSON if individual vars fail
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
        
        adminAuth = getAuth(adminApp);
        
        console.log('Firebase Admin initialized with service account JSON');
        return { app: adminApp, auth: adminAuth };
      }
    } catch (jsonError) {
      console.error('Service account JSON parsing error:', jsonError);
    }
    
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

export function getFirebaseAdmin() {
  if (!adminApp) {
    const initialized = initializeFirebaseAdmin();
    adminApp = initialized.app;
    adminAuth = initialized.auth;
  }
  return adminApp;
}

export function getAdminAuth() {
  if (!adminAuth) {
    const initialized = initializeFirebaseAdmin();
    adminApp = initialized.app;
    adminAuth = initialized.auth;
  }
  return adminAuth;
}

export async function getAuthenticatedUser(): Promise<User | null> {
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
    return null;
  }
}