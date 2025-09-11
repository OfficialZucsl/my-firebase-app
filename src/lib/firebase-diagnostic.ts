'use server';
import 'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';


// This function is self-contained to avoid dependencies on the potentially faulty singleton.
export async function diagnoseFirebaseSetup() {
  console.log('\n=== Firebase Server-Side Diagnostic Running ===');
  
  const diagnostics: Record<string, any> = {
    'NODE_ENV': process.env.NODE_ENV,
    'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID ? 'OK' : 'MISSING',
    'FIREBASE_CLIENT_EMAIL': process.env.FIREBASE_CLIENT_EMAIL ? 'OK' : 'MISSING',
    'FIREBASE_PRIVATE_KEY': process.env.FIREBASE_PRIVATE_KEY ? `OK (length: ${process.env.FIREBASE_PRIVATE_KEY.length})` : 'MISSING',
    'Initialization Status': 'Not Attempted',
  };

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error('One or more required Firebase environment variables are missing.');
    }

    // Use a temporary, unique app name for diagnostics to avoid conflicts
    const appName = `firebase-diagnostic-${Date.now()}`;
    
    if (getApps().some(app => app.name === appName)) {
        // This case is unlikely but handled for safety
        diagnostics['Initialization Status'] = 'Skipped - Diagnostic app name conflict.';
    } else {
        const app = initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        }, appName);

        diagnostics['Initialization Status'] = 'Success';
        diagnostics['Initialized App Name'] = app.name;
        diagnostics['Initialized Project ID'] = app.options.projectId;
        console.log('Firebase Admin SDK initialized successfully during diagnostic.');
    }
    
    return { success: true, details: diagnostics };

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization FAILED during diagnostic:', error);
    diagnostics['Initialization Status'] = 'Failed';
    diagnostics['Error Message'] = error.message;
    return { success: false, error: error.message, details: diagnostics };
  }
}
