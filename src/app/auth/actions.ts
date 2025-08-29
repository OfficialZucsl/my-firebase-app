
'use server';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { createSessionCookie } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function authenticate(formData: FormData) {
  if (!formData) {
    // This handles the initial call by useActionState without form data.
    return { error: undefined };
  }

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
    // Provide more specific error messages from Firebase
    return { error: error.message || 'An unknown authentication error occurred.' };
  }
  
  redirect('/');
}

export async function register(formData: FormData) {
   if (!formData) {
    // This handles the initial call by useActionState without form data.
    return { error: undefined };
  }
  
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

    // Create a corresponding user document in Firestore
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
    // Provide more specific error messages from Firebase
    return { error: error.message || 'An unknown registration error occurred.' };
  }
  
  redirect('/');
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
