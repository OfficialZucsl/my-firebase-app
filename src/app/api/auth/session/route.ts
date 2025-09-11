
import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  console.log('=== SESSION API ROUTE CALLED ===');
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      console.error('No idToken provided');
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    console.log('Getting Admin Auth and creating session cookie...');
    const auth = await getAdminAuth();
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    console.log('Session cookie created successfully');
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    return response;

  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json(
        { 
            error: 'Could not create a server session. Please check server logs.',
            details: error.message 
        }, 
        { status: 500 }
    );
  }
}
