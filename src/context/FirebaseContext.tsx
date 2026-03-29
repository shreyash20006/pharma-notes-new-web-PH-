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

      // Fast profile fetch with getDoc instead of onSnapshot
      try {
        const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        } else {
          // Create profile quickly
          const newProfile = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            isPremium: false,
            createdAt: serverTimestamp(),
            role: ADMIN_EMAILS.includes(currentUser.email || '') ? 'admin' : 'user'
          };
          await setDoc(doc(db, 'users', currentUser.uid), newProfile, { merge: true });
          setUserProfile(newProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Set basic profile from auth to avoid blocking
        setUserProfile({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          isPremium: false
        });
      }
      
      setLoading(false);
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
