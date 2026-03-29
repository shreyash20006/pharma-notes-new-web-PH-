import { useState } from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, BookOpen, Sparkles, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating 3D Books */}
      <motion.div
        initial={{ y: 0, rotateY: 0 }}
        animate={{ y: [-10, 10, -10], rotateY: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 hidden lg:block"
      >
        <div className="w-16 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-2xl transform rotate-12 perspective-1000"
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.3), 16px 16px 30px rgba(0,0,0,0.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 0, rotateY: 0 }}
        animate={{ y: [10, -10, 10], rotateY: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-32 hidden lg:block"
      >
        <div className="w-20 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-2xl transform -rotate-12"
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: '-8px 8px 0 rgba(0,0,0,0.3), -16px 16px 30px rgba(0,0,0,0.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-40 hidden lg:block"
      >
        <div className="w-12 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg shadow-2xl transform rotate-6"
          style={{ 
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3), 12px 12px 20px rgba(0,0,0,0.4)'
          }}
        />
      </motion.div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          {/* Glass reflection effect */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          <div className="p-10 relative">
            {/* Logo */}
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                  style={{
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1)'
                  }}
                >
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">NotesDrive</span>
              </h1>
              <p className="text-white/60 text-sm">
                Access premium eBooks & study materials
              </p>
            </div>

            <div className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-3 backdrop-blur-sm"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}

              <motion.button 
                onClick={handleGoogleLogin}
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-gray-900 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 group relative overflow-hidden"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.5)'
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-white/40 px-4">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/refunds" className="text-purple-400 hover:text-purple-300 underline">Refund Policy</a>.
              </p>
            </div>
          </div>

          <div className="px-10 py-6 bg-white/5 border-t border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secure authentication powered by Firebase</span>
            </div>
          </div>
        </div>

        {/* 3D Shadow */}
        <div 
          className="absolute -bottom-4 left-4 right-4 h-8 bg-black/30 rounded-3xl blur-xl -z-10"
          style={{ transform: 'perspective(500px) rotateX(90deg)' }}
        />
      </motion.div>
    </div>
  );
}
