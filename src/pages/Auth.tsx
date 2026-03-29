import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { signInWithGoogle, handleRedirectResult, logout, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Handle Firebase redirect result on page load
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      try {
        console.log('Auth page loaded, checking for Google redirect result...');
        const result = await handleRedirectResult();
        
        if (result && result.user) {
          console.log('Google Sign-In successful, redirecting to dashboard:', result.user.email);
          // Wait a moment for session to be established
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate('/dashboard');
        }
      } catch (err: any) {
        console.error('Error handling Google redirect:', err);
        
        // Handle specific error codes
        if (err.code === 'auth/account-exists-with-different-credential') {
          setError('An account already exists with this email address. Please sign in with your original method.');
        } else if (err.code === 'auth/auth-domain-config-required') {
          setError('Firebase auth domain is not configured. Please contact support.');
        } else if (err.code === 'auth/operation-not-supported-in-this-environment') {
          setError('Sign-in is not supported in this environment.');
        } else if (err.code !== 'auth/popup-closed-by-user') {
          // Only show error if it's not just a user closing a popup
          setError(err.message || 'An error occurred during sign-in.');
        }
      }
    };

    handleGoogleRedirect();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('User clicked "Continue with Google"');
      // This will redirect to Google, then back to this page
      // The useEffect hook will handle the result
      await signInWithGoogle();
      
      // Note: We won't reach here if redirect is successful
      // This is expected behavior for signInWithRedirect
      console.log('Google Sign-In redirect initiated');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setLoading(false);
      
      // Handle specific Firebase auth errors
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In. Contact support.');
      } else if (err.code === 'auth/operation-not-supported-in-this-environment') {
        setError('Google Sign-In is not supported in this environment.');
      } else if (err.code === 'auth/auth-domain-config-required') {
        setError('Firebase auth domain is not configured properly.');
      } else {
        setError(err.message || 'Failed to initiate Google Sign-In. Please try again.');
      }
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
                  <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
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
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
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

                {/* Google Sign-In Button */}
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Chrome className="h-5 w-5" />
                  Continue with Google
                </button>
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
