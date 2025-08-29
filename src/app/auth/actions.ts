'use server';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SESSION_COOKIE_NAME = 'user_session';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    cookies().set(SESSION_COOKIE_NAME, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });
    
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      return 'Invalid email or password.';
    }
    return 'Something went wrong. Please try again.';
  }
  redirect('/');
}


export async function signup(prevState: string | undefined, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            fullName: name,
            email: user.email,
            createdAt: serverTimestamp(),
            // Initialize other fields as empty or with default values
            phoneNumber: '',
            nationalId: '',
            employmentStatus: 'Unemployed',
            employerName: '',
            workplaceAddress: '',
            supervisorContact: '',
            monthlyIncome: 0,
        });
        
        const idToken = await user.getIdToken();
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        cookies().set(SESSION_COOKIE_NAME, idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiresIn,
            path: '/',
        });

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            return 'This email is already registered. Please login.';
        }
        if (error.code === 'auth/weak-password') {
            return 'Password should be at least 6 characters.';
        }
        console.error(error);
        return 'Something went wrong. Please try again.';
    }
    redirect('/');
}


export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/login');
}
