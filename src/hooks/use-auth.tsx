
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: { uid: string; email: string | null } | null;
  login: (userData: { uid: string; email: string | null }) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true); // Start in a loading state
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      console.log('[Auth Check] 1. Starting user session check...');
      try {
        const response = await fetch('/api/auth/me');
        console.log('[Auth Check] 2. API call to /api/auth/me was successful.');
        const data = await response.json();
        if (data.user) {
          console.log('[Auth Check] 3. User data found. Setting user state.');
          setUser(data.user);
        } else {
          console.log('[Auth Check] 3. No user data in API response.');
        }
      } catch (error) {
        console.error('[Auth Check] 4. An error occurred during the session check:', error);
      } finally {
        console.log('[Auth Check] 5. Session check complete. Setting loading to false.');
        setLoading(false);
      }
    };
    checkUserSession();
  }, []); // The empty array ensures this runs only once on mount

  const login = (userData: { uid: string; email: string | null }) => {
    setUser(userData);
    // Reload the page. The middleware will see the new session cookie
    // and redirect to the dashboard.
    window.location.reload(); 
  };

  const logout = async () => {
    // You would create a '/api/auth/logout' route to clear the httpOnly cookie
    setUser(null);
    window.location.href = '/login';
  };

  const value = { user, login, logout, loading };

  // Don't render the rest of the app until the session check is complete
  if (loading) {
    return null; // Or a loading spinner component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
