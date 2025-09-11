
import { NextResponse, type NextRequest } from 'next/server';
import { createSessionCookieFromToken } from '@/lib/firebase-admin';

// CRITICAL: Force this route to run on the Node.js runtime.
// The 'firebase-admin' SDK is not compatible with the Edge runtime.
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('\n=== SESSION API ROUTE START ===');
  console.log('Time:', new Date().toISOString());
  console.log('Request URL:', request.url);
  
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      console.error('FAILED: No idToken provided');
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    const sessionCookie = await createSessionCookieFromToken(idToken);
    
    console.log('Step 5: Session cookie created successfully!');

    // Manually construct the response for more robust cookie setting
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    response.headers.append('Set-Cookie', `session=${sessionCookie}; Max-Age=${expiresIn / 1000}; HttpOnly; Secure; Path=/; SameSite=Lax`);
    
    console.log('=== SESSION API ROUTE SUCCESS ===\n');
    return response;

  } catch (error: any) {
    console.error('\n=== SESSION API ROUTE ERROR ===');
    console.error('Error message:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to create session',
        details: error.message
      },
      { status: 500 }
    );
  }
}
