
'use server';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { cookies } from 'next/headers';

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
    
    // After registration, the user will be logged in on the client.
    // We will set a temporary cookie to signal the client to create the session.
    cookies().set('login_success', 'true', { maxAge: 10 });
    
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
  
  // Redirect to the dashboard where the client can finalize the session
  redirect('/');
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
