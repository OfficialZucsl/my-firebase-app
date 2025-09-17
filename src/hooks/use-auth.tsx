
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
      console.log('Auth Check: Starting user session check...');
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          console.log('Auth Check: User session found.', data.user);
        } else {
          console.log('Auth Check: No active user session found.');
        }
      } catch (error) {
        console.error('Auth Check: Failed to fetch user session.', error);
      } finally {
        setLoading(false); // Stop loading once the check is complete
        console.log('Auth Check: Session check complete. Loading set to false.');
      }
    };
    checkUserSession();
  }, []);

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
