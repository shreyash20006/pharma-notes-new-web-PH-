import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface FirebaseContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  isAuthReady: boolean;
  isAdmin: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Admin emails
const ADMIN_EMAILS = ['notesdriveshop@gmail.com', 'shreyash20006@gmail.com'];

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      // Set basic profile immediately from auth (INSTANT)
      const basicProfile = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        isPremium: false,
        role: ADMIN_EMAILS.includes(currentUser.email || '') ? 'admin' : 'user'
      };
      setUserProfile(basicProfile);
      setLoading(false); // Stop loading immediately!

      // Fetch full profile in background (non-blocking)
      try {
        const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (profileDoc.exists()) {
          setUserProfile({ ...basicProfile, ...profileDoc.data() });
        } else {
          // Create profile in background
          setDoc(doc(db, 'users', currentUser.uid), {
            ...basicProfile,
            createdAt: serverTimestamp(),
          }, { merge: true }).catch(console.error);
        }
      } catch (error) {
        console.error("Firestore error (non-blocking):", error);
        // Keep using basic profile - no blocking
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, userProfile, loading, isAuthReady, isAdmin }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
