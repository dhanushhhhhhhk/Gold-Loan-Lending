import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import apiService from '../services/api'; // Import the API service

// Firebase config (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyBIYgLt1sZsjMQ_fr6sNs5nNHNGDlkks84",
  authDomain: "star-finance-loan-calculator.firebaseapp.com",
  projectId: "star-finance-loan-calculator",
  storageBucket: "star-finance-loan-calculator.firebasestorage.app",
  messagingSenderId: "22064294805",
  appId: "1:22064294805:web:811740e81311cf4dfee49c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'bank';
  kycNumber?: string;
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: 'customer' | 'bank') => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase. Now, fetch their KYC status from our backend.
        let kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | undefined = undefined;
        let kycNumber: string | undefined = undefined;

        try {
          const response = await apiService.getKYCStatus(firebaseUser.uid);
          if (response.success && response.data) {
            kycStatus = response.data.status;
            kycNumber = response.data.kycNumber;
          }
        } catch (e) {
          console.error("Could not fetch KYC status for user.", e);
        }

        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          email: firebaseUser.email || '',
          type: 'customer',
          kycStatus: kycStatus,
          kycNumber: kycNumber,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, userType: 'customer' | 'bank') => {
    setLoading(true);
    if (userType === 'customer') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setLoading(false);
        throw new Error('Login failed');
      }
    } else {
      // Mock logic for bank employee login (replace with real backend/JWT later)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Bank Officer',
        email,
        type: 'bank',
        employeeId: 'EMP' + Math.random().toString(36).substr(2, 6).toUpperCase()
      };
      setUser(mockUser);
    }
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name using the imported updateProfile function
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
      }
    } catch (error) {
      setLoading(false);
      throw new Error('Registration failed');
    }
    setLoading(false);
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      let prov;
      if (provider === 'google') {
        prov = new GoogleAuthProvider();
      } else {
        prov = new FacebookAuthProvider();
      }
      await signInWithPopup(auth, prov);
    } catch (error) {
      setLoading(false);
      throw new Error(`${provider} login failed`);
    }
    setLoading(false);
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    socialLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};