'use server';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export async function authenticate(formData: FormData) {
  // Prevent crash on initial render with useActionState
  if (!formData?.get('email')) {
    return;
  }
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return 'Email and password are required';
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

    cookies().set('login_success', 'true', {
        httpOnly: false, // Must be readable by client script
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10, // Short-lived
    });

  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof Error) {
        // Provide a more user-friendly error message
        if (error.message.includes('auth/invalid-credential')) {
            return 'Invalid email or password.';
        }
        return 'Authentication failed. Please try again.';
    }
    return 'An unknown authentication error occurred.';
  }
  
  redirect('/');
}

export async function register(formData: FormData) {
   // Prevent crash on initial render with useActionState
  if (!formData?.get('email')) {
    return;
  }
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const confirmPassword = formData.get('confirmPassword') as string;


  if (!email || !password || !name || !confirmPassword) {
    return 'All fields are required';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore - THIS IS THE CRITICAL FIX
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

    cookies().set('login_success', 'true', {
        httpOnly: false, // Must be readable by client script
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10, // Short-lived
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
            return 'This email is already registered.';
        }
        return 'Registration failed. Please try again.';
    }
    return 'An unknown registration error occurred.';
  }
  
  redirect('/');
}

export async function logout() {
  cookies().delete('session');
  cookies().delete('login_success');
  redirect('/login');
}
