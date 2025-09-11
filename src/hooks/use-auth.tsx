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
    // This effect runs once on app load to check for an existing session
    const checkUserSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
      } finally {
        setLoading(false); // Stop loading once the check is complete
      }
    };
    checkUserSession();
  }, []);

  const login = (userData: { uid: string; email: string | null }) => {
    setUser(userData);
    // The navigation now uses a hard reload to ensure middleware has the cookie
    window.location.href = '/'; 
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
