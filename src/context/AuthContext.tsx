import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../config/firebase';
import type { UserProfile } from '../types/habit';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseMode: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'habitflow_guest_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile from Firestore or localStorage
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const userRef = doc(db!, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              setUser(userSnap.data() as UserProfile);
            } else {
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Habit Explorer',
                photoURL: firebaseUser.photoURL,
                themePreference: 'system',
                weekStartsOn: 1, // Monday default
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                createdAt: new Date().toISOString(),
                isGuest: false,
              };
              await setDoc(userRef, newProfile);
              setUser(newProfile);
            }
          } catch (err) {
            console.error('Error fetching Firestore user profile:', err);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'Habit Explorer',
              photoURL: firebaseUser.photoURL,
              themePreference: 'system',
              weekStartsOn: 1,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              createdAt: new Date().toISOString(),
              isGuest: false,
            });
          }
        } else {
          const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
          if (savedGuest) {
            try {
              setUser(JSON.parse(savedGuest));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
      if (savedGuest) {
        try {
          setUser(JSON.parse(savedGuest));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error(
        'Firebase Google Authentication is not configured yet. Please configure your .env credentials or use Demo Guest Login to explore immediately!'
      );
    }

    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setLoading(false);
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const loginAsGuest = () => {
    const guestProfile: UserProfile = {
      uid: 'guest_user_demo',
      email: 'demo@habitflow.app',
      displayName: 'Alex Morgan',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      themePreference: 'system',
      weekStartsOn: 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      createdAt: new Date().toISOString(),
      isGuest: true,
    };
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestProfile));
    setUser(guestProfile);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth && user && !user.isGuest) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setUser(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (isFirebaseConfigured && db && !user.isGuest) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, updates, { merge: true });
      } catch (err) {
        console.error('Failed to update Firestore profile:', err);
      }
    } else {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    localStorage.removeItem(`habitflow_habits_${user.uid}`);
    localStorage.removeItem(`habitflow_completions_${user.uid}`);
    localStorage.removeItem(GUEST_STORAGE_KEY);
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseMode: isFirebaseConfigured,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateUserProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
