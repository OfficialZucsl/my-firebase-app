
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { logout as serverLogout } from '@/app/auth/actions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // This is our safety net. If the user is authenticated but somehow
      // ends up on a public page (like /login), we redirect them to the dashboard.
      const isPublicRoute = ['/login', '/signup'].includes(pathname);
      if (user && isPublicRoute) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const logout = async () => {
    try {
      // Sign out from Firebase on the client
      await auth.signOut();
      // Then, call the server action to clear the session cookie
      await serverLogout();
      // The middleware will handle the redirect after this.
      // A hard refresh ensures the middleware runs.
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
