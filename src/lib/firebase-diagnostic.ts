'use server';
import 'server-only';

export async function diagnoseFirebaseSetup() {
  console.log('=== Firebase Server-Side Diagnostic Running ===');
  
  const diagnostics: Record<string, any> = {
    node_env: process.env.NODE_ENV,
    firebase_project_id: process.env.FIREBASE_PROJECT_ID ? 'FOUND' : 'MISSING',
    firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL ? 'FOUND' : 'MISSING',
    firebase_private_key: process.env.FIREBASE_PRIVATE_KEY ? `FOUND (length: ${process.env.FIREBASE_PRIVATE_KEY.length})` : 'MISSING',
    initialization_status: 'Not attempted',
  };
  
  try {
    // Dynamically import to ensure it runs fresh
    const { getFirebaseAdmin } = await import('./firebase-admin');
    const app = getFirebaseAdmin();
    
    diagnostics.initialization_status = 'Success';
    diagnostics.app_name = app.name;
    diagnostics.project_id_from_sdk = app.options.projectId;

    console.log('Firebase Admin SDK initialized successfully during diagnostic.');
    return { success: true, details: diagnostics };
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization FAILED during diagnostic:', error);
    diagnostics.initialization_status = 'Failed';
    diagnostics.error_message = error.message;
    return { success: false, error: error.message, details: diagnostics };
  }
}
