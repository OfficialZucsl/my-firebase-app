import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear all auth-related cookies
  cookieStore.delete('session');
  cookieStore.delete('login_success');
  
  return NextResponse.json({ success: true });
}
