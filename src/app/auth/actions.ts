'use server';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { doc, setDoc, Timestamp } from 'firebase/firestore';


export async function authenticate(formData: FormData) {
  // Prevent crash on initial render with useActionState
  if (!formData) {
    return;
  }
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const idToken = await user.getIdToken();
    
    cookies().set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'Authentication failed';
  }
  
  redirect('/');
}

export async function register(formData: FormData) {
   // Prevent crash on initial render with useActionState
  if (!formData) {
    return;
  }
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;


  if (!email || !password || !name) {
    throw new Error('All fields are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: Timestamp.now(),
    });
    
    const idToken = await user.getIdToken();
    
    cookies().set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
        return error.message;
    }
    return 'Registration failed';
  }
  
  redirect('/');
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}