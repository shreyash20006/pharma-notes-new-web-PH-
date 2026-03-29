import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config - hardcoded for reliability
const firebaseConfig = {
  apiKey: "AIzaSyCXPP1bsJiUprhaI5_BusF-R_pFFWReMgw",
  authDomain: "notesdrive-925f6.firebaseapp.com",
  projectId: "notesdrive-925f6",
  storageBucket: "notesdrive-925f6.firebasestorage.app",
  messagingSenderId: "314698842551",
  appId: "1:314698842551:web:4b5f5e70b2fa8a6c9da832",
  measurementId: "G-NB07LMP79N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google provider
const googleProvider = new GoogleAuthProvider();

// GitHub provider
const githubProvider = new GithubAuthProvider();

// Sign in with Google (popup - more reliable than redirect on Vercel)
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Sign in with GitHub
export const signInWithGithub = () => {
  return signInWithPopup(auth, githubProvider);
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