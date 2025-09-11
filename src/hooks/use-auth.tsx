
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { logout as serverLogout } from '@/app/auth/actions';

// Define the shape of the context data
interface AuthContextType {
  user: { uid: string; email: string | null, displayName: string | null } | null;
  login: (userData: { uid: string; email: string | null, displayName: string | null }) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that will wrap our application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [loading, setLoading] = useState(true); // Start in a loading state
  const router = useRouter();

  // This effect runs once on mount to check the initial Firebase auth state
  // This is for handling page reloads where the user is already logged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log('[AuthProvider] onAuthStateChanged: User is logged in.', firebaseUser);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        console.log('[AuthProvider] onAuthStateChanged: User is logged out.');
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  // The login function that the login page calls
  const login = (userData: { uid: string; email: string | null; displayName: string | null }) => {
    console.log('[AuthProvider] Login function called. Setting user:', userData);
    setUser(userData);
  };

  // A logout function for completeness
  const logout = async () => {
    console.log('[AuthProvider] Logout function called.');
    await serverLogout(); // Clears the server session cookie
    await auth.signOut(); // Signs out the client
    setUser(null);
    router.push('/login');
  };
  
  // This is the CRITICAL part that fixes the navigation on LOGIN
  useEffect(() => {
    console.log(`[AuthProvider] useEffect triggered by user state change. User is:`, user);
    
    // If the user state changes from null to a real user object, it means
    // a login just occurred. NOW we can safely navigate.
    if (user && !loading) {
      console.log('[AuthProvider] User detected, navigating to dashboard...');
      window.location.href = '/';
    }

  }, [user, loading, router]); // This effect runs whenever the user or loading state changes

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
