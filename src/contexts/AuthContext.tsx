import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { fetchStudentByEmail, createStudentProfile } from '../lib/studentApi';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const demoEnabled = false; // Disable demo mode since we have real Firebase configured

  // Function to fetch or create user profile
  const fetchOrCreateUserProfile = async (firebaseUser: User) => {
    try {
      // Try to fetch existing profile
      const existingProfile = await fetchStudentByEmail(firebaseUser.email!);
      
      if (existingProfile) {
        // Profile exists, use it
        setUserProfile({
          id: existingProfile.id,
          email: existingProfile.email,
          name: existingProfile.name || firebaseUser.displayName || undefined,
          role: 'student',
          createdAt: existingProfile.created_at,
          updatedAt: existingProfile.updated_at
        });
      } else {
        // Create new profile for Google sign-in users
        const newProfile = await createStudentProfile({
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          firebase_uid: firebaseUser.uid
        });
        
        setUserProfile({
          id: newProfile.id,
          email: newProfile.email,
          name: newProfile.name,
          role: 'student',
          createdAt: newProfile.created_at,
          updatedAt: newProfile.updated_at
        });
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
      // Set a basic profile if database operations fail
      setUserProfile({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
        role: 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

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
    
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // User is signed in, fetch or create profile
        await fetchOrCreateUserProfile(firebaseUser);
      } else {
        // User is signed out
        setUserProfile(null);
      }
      
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

  const register = async (email: string, password: string) => {
    if (!auth || demoEnabled) {
      // Demo registration - just store the email
      localStorage.setItem('demo_user_email', email);
      setUser({ email } as unknown as User);
      return;
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    if (!auth || demoEnabled) {
      // Demo Google sign-in - simulate with a demo email
      const demoEmail = 'demo-google-user@uslc.test';
      localStorage.setItem('demo_user_email', demoEmail);
      setUser({ email: demoEmail } as unknown as User);
      return;
    }
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth || demoEnabled) {
      localStorage.removeItem('demo_user_email');
      setUser(null);
      setUserProfile(null);
      return;
    }
    await signOut(auth);
  };

  const refreshUserProfile = async () => {
    if (user?.email) {
      await fetchOrCreateUserProfile(user);
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: Boolean(user),
    user,
    userProfile,
    isLoading,
    login,
    signInWithGoogle,
    register,
    logout,
    refreshUserProfile,
  }), [user, userProfile, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}