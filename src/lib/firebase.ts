import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable device language for Google sign-in
auth.useDeviceLanguage();

// Set persistence to LOCAL so user stays logged in
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

// @ts-ignore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with additional scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Initiate Google sign-in with redirect flow
 * User will be redirected to Google login, then back to your app
 */
export const signInWithGoogle = async () => {
  console.log('Initiating Google Sign-In with redirect...');
  try {
    await signInWithRedirect(auth, googleProvider);
    console.log('Redirected to Google Sign-In');
  } catch (error) {
    console.error('Error initiating Google Sign-In:', error);
    throw error;
  }
};

/**
 * Handle the redirect result after user returns from Google
 * Call this on page load to complete the sign-in flow
 */
export const handleRedirectResult = async () => {
  console.log('Checking for redirect result...');
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('User signed in from redirect:', result.user.email);
      return result;
    } else {
      console.log('No redirect result found');
      return null;
    }
  } catch (error: any) {
    console.error('Error handling redirect result:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/account-exists-with-different-credential') {
      console.error('Account exists with different credential');
    } else if (error.code === 'auth/auth-domain-config-required') {
      console.error('Auth domain not configured. Check Firebase console.');
    } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
      console.error('Redirect flow not supported in this environment');
    }
    
    throw error;
  }
};

export const logout = () => signOut(auth);
