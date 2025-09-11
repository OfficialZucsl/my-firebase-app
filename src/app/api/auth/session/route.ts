
import { NextResponse, type NextRequest } from 'next/server';
import { createSessionCookieFromToken } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  console.log('\n=== SESSION API ROUTE START ===');
  console.log('Time:', new Date().toISOString());
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  
  try {
    console.log('Step 1: Reading request body...');
    const body = await request.json();
    console.log('Request body received:', { hasIdToken: !!body.idToken, bodyKeys: Object.keys(body) });
    
    const idToken = body.idToken;

    if (!idToken) {
      console.error('FAILED: No idToken provided');
      console.log('Body contents:', body);
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    console.log('Step 2: ID token found, length:', idToken.length);
    console.log('ID token preview:', idToken.substring(0, 50) + '...');

    console.log('Step 3: Environment check...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('FIREBASE_PROJECT_ID exists:', !!process.env.FIREBASE_PROJECT_ID);
    console.log('FIREBASE_CLIENT_EMAIL exists:', !!process.env.FIREBASE_CLIENT_EMAIL);
    console.log('FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
    
    console.log('Step 4: Attempting to create session cookie...');
    
    const sessionCookie = await createSessionCookieFromToken(idToken);
    
    console.log('Step 5: Session cookie created successfully!');
    console.log('Cookie length:', sessionCookie.length);

    console.log('Step 6: Creating response...');
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    console.log('Step 7: Setting cookie...');
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    console.log('=== SESSION API ROUTE SUCCESS ===\n');
    return response;

  } catch (error: any) {
    console.error('\n=== SESSION API ROUTE ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===\n');
    
    return NextResponse.json(
      { 
        error: 'Failed to create session',
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}
