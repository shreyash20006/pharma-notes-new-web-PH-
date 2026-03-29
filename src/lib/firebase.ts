import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google provider
const provider = new GoogleAuthProvider();

// Sign in
export const signInWithGoogle = () => {
  return signInWithRedirect(auth, provider);
};

// ✅ LOGOUT (IMPORTANT FIX)
export const logout = () => {
  return signOut(auth);
};

// Operation types for error handling
export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

// Firestore error handler
export const handleFirestoreError = (
  error: unknown,
  operation: OperationType,
  collection: string
): string => {
  console.error(`Firestore ${operation} error on ${collection}:`, error);
  
  if (error instanceof Error) {
    // Permission denied
    if (error.message.includes('permission-denied')) {
      return 'You do not have permission to perform this action.';
    }
    // Not found
    if (error.message.includes('not-found')) {
      return 'The requested document was not found.';
    }
    // Network error
    if (error.message.includes('unavailable') || error.message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    return error.message;
  }
  
  return `Failed to ${operation} ${collection}. Please try again.`;
};