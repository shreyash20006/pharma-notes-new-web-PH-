import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable device language for Google sign-in
auth.useDeviceLanguage();

// Set persistence to LOCAL so user stays logged in across sessions
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✓ Firebase persistence enabled (browserLocalPersistence)');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// @ts-ignore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with required scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Set custom parameters for better UX (optional)
googleProvider.setCustomParameters({
  prompt: 'select_account', // Force account selection
});

/**
 * Initiate Google sign-in with redirect flow
 * Used for production domains - avoids/resolves unauthorized-domain errors
 * 
 * User will be redirected to Google login, then back to your app
 * The result is handled by getRedirectResult() which should be called on every page load
 */
export const signInWithGoogle = async (): Promise<void> => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔵 Initiating Google Sign-In with redirect flow...`);
  try {
    // This will redirect to Google - we won't return from this call
    await signInWithRedirect(auth, googleProvider);
    console.log('✓ Redirect initiated - user will be sent to Google');
  } catch (error: any) {
    console.error('❌ Error initiating Google Sign-In:', {
      code: error.code,
      message: error.message,
      timestamp,
    });
    throw error;
  }
};

/**
 * Handle the redirect result after user returns from Google
 * CRITICAL: Must be called on every page load, typically in the root layout or main Auth page
 * 
 * This function retrieves the authentication result from the redirect
 * @returns The user credential result if sign-in was successful, null if no result
 */
export const handleRedirectResult = async () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔄 Checking for redirect result from Google...`);
  
  try {
    const result = await getRedirectResult(auth);
    
    if (result && result.user) {
      console.log('✓ Google Sign-In successful', {
        email: result.user.email,
        displayName: result.user.displayName,
        uid: result.user.uid,
        timestamp,
      });
      return result;
    } else {
      console.log(`[${timestamp}] ℹ️ No redirect result found (user not coming from Google redirect)`);
      return null;
    }
  } catch (error: any) {
    const errorDetails = {
      code: error.code,
      message: error.message,
      timestamp,
    };
    
    console.error('❌ Error handling redirect result:', errorDetails);
    
    // Handle specific error cases with detailed messaging
    switch (error.code) {
      case 'auth/unauthorized-domain':
        console.error(
          '🚨 UNAUTHORIZED DOMAIN ERROR\n' +
          'This domain is not authorized in Firebase Console.\n' +
          'Required Configuration:\n' +
          '1. Go to Firebase Console > Authentication > Settings\n' +
          '2. Add your domain to "Authorized JavaScript origins":\n' +
          '   - Add: https://www.notesdrive.shop\n' +
          '   - Add: https://notesdrive.shop\n' +
          '   - Add: http://localhost:3000 (for development)\n' +
          '3. Add your domain to "Authorized redirect URIs":\n' +
          '   - Add: https://www.notesdrive.shop/auth\n' +
          '   - Add: https://notesdrive.shop/auth\n' +
          '   - Add: http://localhost:3000/auth (for development)'
        );
        break;
      
      case 'auth/account-exists-with-different-credential':
        console.error(
          'Account already exists with a different credential.\n' +
          'This email is registered with another sign-in method.'
        );
        break;
      
      case 'auth/auth-domain-config-required':
        console.error(
          'Auth domain is not configured in Firebase Console.\n' +
          'Check Settings > Authorized domains.'
        );
        break;
      
      case 'auth/operation-not-supported-in-this-environment':
        console.error(
          'Redirect authentication is not supported in this environment.\n' +
          'This might be a browser compatibility issue.'
        );
        break;
      
      case 'auth/popup-closed-by-user':
        console.log('User closed the authentication popup.');
        break;
      
      case 'auth/network-request-failed':
        console.error('Network error during authentication. Check internet connection.');
        break;
      
      default:
        console.error('Unknown authentication error:', error);
    }
    
    throw error;
  }
};

/**
 * Listen to auth state changes
 * Use this to check if user is logged in on every page load
 * 
 * @param callback Function to call with user (or null if logged out)
 * @returns Unsubscribe function to stop listening
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log('🎧 Setting up auth state listener...');
  
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✓ Auth state changed - User is signed in:', user.email);
    } else {
      console.log('✓ Auth state changed - User is signed out');
    }
    callback(user);
  });
  
  return unsubscribe;
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  console.log('🔐 Logging out user...');
  try {
    await signOut(auth);
    console.log('✓ User logged out successfully');
  } catch (error) {
    console.error('❌ Error logging out:', error);
    throw error;
  }
};

/**
 * Get the currently authenticated user
 * @returns The current user object or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 * @returns true if user is logged in, false otherwise
 */
export const isUserAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};
