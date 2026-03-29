import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  signInWithGoogle, 
  handleRedirectResult, 
  logout, 
  auth,
  onAuthStateChange,
  isUserAuthenticated 
} from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Check auth state and handle Firebase redirect result on component mount
  useEffect(() => {
    const handleAuthFlow = async () => {
      try {
        // Check if user is already authenticated
        if (isUserAuthenticated()) {
          console.log('User already authenticated, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }

        // Check for redirect result from Google Sign-In
        console.log('Checking for Google redirect result...');
        const result = await handleRedirectResult();
        
        if (result && result.user) {
          console.log('✓ Successfully logged in with Google:', result.user.email);
          // Give Firebase time to establish session
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate('/dashboard');
        }
      } catch (err: any) {
        console.error('Error during auth flow:', err);
        
        // Map Firebase error codes to user-friendly messages
        let userMessage = 'An error occurred during sign-in. Please try again.';
        
        switch (err.code) {
          case 'auth/unauthorized-domain':
            userMessage = 'This domain is not authorized for Google Sign-In. Please contact support.';
            console.error(
              '🚨 DOMAIN NOT AUTHORIZED\n' +
              'This typically means your domain (notesdrive.shop) is not whitelisted in Firebase Console.\n' +
              'Solution: Ask admin to add https://www.notesdrive.shop and http://localhost:3000 to:\n' +
              'Firebase Console > Authentication > Settings > Authorized JavaScript origins & Redirect URIs'
            );
            break;
          
          case 'auth/account-exists-with-different-credential':
            userMessage = 'An account with this email already exists. Please sign in with your original method.';
            break;
          
          case 'auth/auth-domain-config-required':
            userMessage = 'Firebase domain configuration is incomplete. Please contact support.';
            break;
          
          case 'auth/operation-not-supported-in-this-environment':
            userMessage = 'Sign-in is not supported in this browser. Please try a different browser.';
            break;
          
          case 'auth/network-request-failed':
            userMessage = 'Network error. Please check your internet connection.';
            break;
          
          case 'auth/popup-closed-by-user':
            // User just closed the popup, don't show an error
            console.log('User closed Google Sign-In');
            return;
          
          default:
            userMessage = err.message || 'An unexpected error occurred.';
        }
        
        setError(userMessage);
      }
    };

    handleAuthFlow();
  }, [navigate]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        console.log('Auth state: User is signed in -', user.email);
        // Auto-redirect if user gets signed in
        navigate('/dashboard');
      } else {
        console.log('Auth state: User is signed out');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Email/Password Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        console.log('✓ Successfully logged in with email/password');
        navigate('/dashboard');
      } else {
        // Email/Password Signup
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (signUpError) throw signUpError;
        
        console.log('✓ Account created successfully. Please check your email to verify.');
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('User clicked "Continue with Google"');
      
      // Initiate redirect to Google
      // Note: This will redirect the page, so code after this may not execute
      await signInWithGoogle();
      
      // If we get here, redirect was initiated but not yet completed
      console.log('✓ Redirected to Google Sign-In');
      // The page will redirect, so this is just for logging
    } catch (err: any) {
      // Handle errors that occur during redirect initiation
      console.error('Google Sign-In Error:', {
        code: err.code,
        message: err.message,
      });
      
      setLoading(false);
      
      let userMessage = 'Failed to initiate Google Sign-In. Please try again.';
      
      switch (err.code) {
        case 'auth/unauthorized-domain':
          userMessage = '❌ This domain is not authorized for Google Sign-In. Ask the admin to configure Firebase Console.';
          break;
        
        case 'auth/network-request-failed':
          userMessage = 'Network error. Please check your internet connection and try again.';
          break;
        
        case 'auth/operation-not-supported-in-this-environment':
          userMessage = 'Google Sign-In is not supported in this browser. Try Chrome or Firefox.';
          break;
        
        case 'auth/auth-domain-config-required':
          userMessage = 'Firebase domain is not properly configured. Contact support.';
          break;
        
        default:
          userMessage = err.message || 'An error occurred. Please try again.';
      }
      
      setError(userMessage);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join PharmaNotes'}
            </h1>
            <p className="text-gray-500">
              {isLogin 
                ? 'Login to access your study materials' 
                : 'Create an account to start sharing and learning'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
                <p className="text-gray-500 mb-8">
                  We've sent a confirmation link to <strong>{email}</strong>. Please verify your account to continue.
                </p>
                <button 
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Back to Login
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleAuth} 
                className="space-y-6"
              >
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </motion.div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    isLogin ? 'Login' : 'Create Account'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-500 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Google Sign-In Button - Production Ready */}
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-blue-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Chrome className="h-5 w-5 group-hover:text-blue-600" />
                  Continue with Google
                </button>

                {/* Production Domain Info */}
                <div className="text-xs text-gray-500 text-center mt-4">
                  Production Domain: <strong>notesdrive.shop</strong>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {!success && (
          <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
