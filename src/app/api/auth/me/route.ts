import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    // Not logged in
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const adminAuth = await getAdminAuth();
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ user: { uid: decodedClaims.uid, email: decodedClaims.email } }, { status: 200 });
  } catch (error) {
    // Session cookie is invalid or expired
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
