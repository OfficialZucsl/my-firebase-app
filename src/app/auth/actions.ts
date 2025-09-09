
'use server';
import 'dotenv/config';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { createSessionCookie } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function authenticate(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    await createSessionCookie(idToken);

  } catch (error: any) {
    console.error('Authentication error:', error);
    if (error.message.includes('Firebase Admin SDK is not initialized')) {
        return { error: 'Firebase Admin SDK is not initialized. Cannot create session cookie.' };
    }
    // Use a more specific check for the error code if available, otherwise check the message.
    if (error.code === 'auth/invalid-credential' || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        return { error: 'Invalid email or password. Please try again.' };
    }
    
    // Fallback for other errors
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
    
    await createSessionCookie(idToken);
    
  } catch (error: any) {
    console.error('Registration error:', error);
     if (error.message.includes('Firebase Admin SDK is not initialized')) {
        return { error: 'Firebase Admin SDK is not initialized. Cannot create session cookie.' };
    }
    
    // Use a more specific check for the error code if available.
    if (error.code === 'auth/email-already-in-use') {
        return { error: 'This email is already registered.' };
    }
    if (error.code === 'auth/weak-password') {
        return { error: 'The password is too weak.' };
    }
    
    // Fallback for other errors
    return { error: `Registration failed: ${error.message}` };
  }
  
  redirect('/');
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
