import { supabase } from './supabase';

// Bridge db and auth to avoid breaking existing imports
export const auth: any = {
  signOut: () => supabase.auth.signOut(),
  currentUser: null,
};
export const db: any = {};

// Google sign-in wrapper using Supabase OAuth
export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/notes'
    }
  });
};

// GitHub sign-in wrapper using Supabase OAuth
export const signInWithGithub = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin + '/notes'
    }
  });
};

// Logout wrapper using Supabase auth
export const logout = () => {
  return supabase.auth.signOut();
};

// Keep existing enum and error helpers intact
export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

export const handleFirestoreError = (
  error: unknown,
  operation: OperationType,
  collection: string
): string => {
  console.error(`Database ${operation} error on ${collection}:`, error);
  
  if (error instanceof Error) {
    if (error.message.includes('permission') || error.message.includes('RLS')) {
      return 'You do not have permission to perform this action.';
    }
    return error.message;
  }
  
  return `Failed to ${operation} ${collection}. Please try again.`;
};