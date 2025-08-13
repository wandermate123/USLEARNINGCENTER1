import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const demoEnabled = (import.meta as any).env?.VITE_DEMO_AUTH === 'true' || !auth;

  useEffect(() => {
    if (!auth) {
      // Demo mode: restore from localStorage if present
      const storedEmail = localStorage.getItem('demo_user_email');
      if (storedEmail) {
        // Minimal mock object satisfying user?.email usage
        setUser({ email: storedEmail } as unknown as User);
      }
      setIsLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth || demoEnabled) {
      // Demo credentials (configurable)
      const allowed: Record<string, string> = {
        'admin@uslc.test': 'Admin123!',
        'student@uslc.test': 'Student123!',
      };
      if (allowed[email] && allowed[email] === password) {
        localStorage.setItem('demo_user_email', email);
        setUser({ email } as unknown as User);
        return;
      }
      throw new Error('Demo login failed. Use admin@uslc.test / Admin123! or student@uslc.test / Student123!');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth || demoEnabled) {
      localStorage.removeItem('demo_user_email');
      setUser(null);
      return;
    }
    await signOut(auth);
  };

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: Boolean(user),
    user,
    isLoading,
    login,
    logout,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}