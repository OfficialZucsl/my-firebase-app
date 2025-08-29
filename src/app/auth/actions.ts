'use server';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function authenticate(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the ID token
    const idToken = await user.getIdToken();
    
    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    // Set a flag to indicate successful login
    cookieStore.set('login_success', 'true', {
      httpOnly: false, // This needs to be accessible to client-side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10, // Short-lived, just for the transition
    });

    console.log('Authentication successful, redirecting...');
    
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof Error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
    throw new Error('Authentication failed');
  }
  
  // Redirect after successful authentication
  redirect('/');
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password || !confirmPassword) {
    throw new Error('All fields are required');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the ID token
    const idToken = await user.getIdToken();
    
    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    // Set a flag to indicate successful registration
    cookieStore.set('login_success', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10, // Short-lived
    });

    console.log('Registration successful, redirecting...');
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
    throw new Error('Registration failed');
  }
  
  // Redirect after successful registration
  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  
  // Clear session cookie
  cookieStore.delete('session');
  cookieStore.delete('login_success');
  
  // Redirect to login page
  redirect('/login');
}
