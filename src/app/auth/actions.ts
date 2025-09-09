
'use server';
import 'dotenv/config';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAdminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';


export async function createSessionCookie(idToken: string) {
  try {
    console.log('Attempting to create session cookie...');
    const auth = getAdminAuth();
    
    // Create session cookie (expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    // Set the cookie
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    console.log('Session cookie created successfully.');
    return { success: true };
    
  } catch (error: any) {
    console.error('Session cookie creation failed:', error);
    // Log environment variables on failure for debugging
    console.log('Environment check during auth action failure:', {
      nodeEnv: process.env.NODE_ENV,
      projectId: process.env.FIREBASE_PROJECT_ID ? 'FOUND' : 'MISSING',
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'FOUND' : 'MISSING',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'FOUND' : 'MISSING',
    });
    return { success: false, error: error.message };
  }
}

export async function authenticate(formData: FormData) {
  // STEP 1: Pre-check for environment variables
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.error('Firebase Admin environment variables are missing!');
    return { error: 'Server configuration error. Admin credentials not found.' };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    const sessionResult = await createSessionCookie(idToken);
    if (!sessionResult.success) {
      // The error is already logged in createSessionCookie
      return { error: 'Could not create a server session. Please check server logs.' };
    }

  } catch (error: any) {
    console.error('Authentication error:', error);
    if (error.code === 'auth/invalid-credential' || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        return { error: 'Invalid email or password. Please try again.' };
    }
    
    return { error: `Authentication failed: ${error.message}` };
  }
  
  redirect('/');
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const confirmPassword = formData.get('confirmPassword') as string;


  if (!email || !password || !name || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: Timestamp.now(),
    });
    
    const idToken = await user.getIdToken();
    
    const sessionResult = await createSessionCookie(idToken);
    if (!sessionResult.success) {
      return { error: 'Could not create a server session after registration. Please check server logs.' };
    }
    
  } catch (error: any) {
    console.error('Registration error:', error);
     if (error.code === 'auth/email-already-in-use') {
        return { error: 'This email is already registered.' };
    }
    if (error.code === 'auth/weak-password') {
        return { error: 'The password is too weak.' };
    }
    
    return { error: `Registration failed: ${error.message}` };
  }
  
  redirect('/');
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
