import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: any | null;
  userProfile: any | null;
  loading: boolean;
  isAuthReady: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin emails
const ADMIN_EMAILS = ['notesdriveshop@gmail.com', 'shreyash20006@gmail.com'];

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setUserProfile({
          uid,
          email,
          displayName: data.full_name || email.split('@')[0],
          photoURL: data.avatar_url,
          isPremium: data.is_premium || false,
          role: ADMIN_EMAILS.includes(email) ? 'admin' : 'user',
          ...data
        });
      } else {
        // Create profile in background if it does not exist (fallback if DB trigger didn't fire)
        const name = email.split('@')[0];
        const newProfile = {
          id: uid,
          email,
          full_name: name,
          is_premium: false
        };
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (insertError) {
          console.error('Error creating fallback profile:', insertError);
        }

        setUserProfile({
          uid,
          email,
          displayName: name,
          isPremium: false,
          role: ADMIN_EMAILS.includes(email) ? 'admin' : 'user',
          ...newProfile
        });
      }
    } catch (e) {
      console.error('Profile fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const mappedUser = {
          ...session.user,
          uid: session.user.id,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          photoURL: session.user.user_metadata?.avatar_url || ''
        } as any;
        setUser(mappedUser);
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
      setIsAuthReady(true);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const mappedUser = {
          ...session.user,
          uid: session.user.id,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          photoURL: session.user.user_metadata?.avatar_url || ''
        } as any;
        setUser(mappedUser);
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
      setIsAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/notes'
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAuthReady, isAdmin, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
