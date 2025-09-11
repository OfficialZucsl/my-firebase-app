
import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

// CRITICAL: Force this route to run on the Node.js runtime.
// The 'firebase-admin' SDK is not compatible with the Edge runtime.
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }
    
    const auth = await getAdminAuth();
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const decodedToken = await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    const user = await auth.getUser(decodedToken.uid);

    const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax' as const,
    };
    
    const response = NextResponse.json(
      { 
        success: true,
        user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        }
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    response.cookies.set('session', sessionCookie, options);
    
    return response;

  } catch (error: any) {
    console.error('Session API Route Error:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to create session',
        details: error.message
      },
      { status: 500 }
    );
  }
}
