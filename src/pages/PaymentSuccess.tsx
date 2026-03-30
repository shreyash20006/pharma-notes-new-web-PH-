import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const success = searchParams.get('success');

  useEffect(() => {
    // Check payment status
    const checkStatus = async () => {
      try {
        if (success === 'true' || paymentId) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        setStatus('failed');
      }
    };

    setTimeout(checkStatus, 1000);
  }, [success, paymentId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#3B31B8] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#161B22] border border-red-500/30 rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Payment Failed</h1>
          <p className="text-gray-400 mb-6">
            Your payment could not be processed. Please try again.
          </p>

          {orderId && (
            <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
          )}

          <div className="space-y-3">
            <Link
              to="/pricing"
              className="block w-full px-6 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-semibold transition-all"
            >
              Try Again
            </Link>
            <Link
              to="/"
              className="block w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-[#161B22] border border-[#3B31B8]/30 rounded-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="relative mb-6">
            <motion.div
              className="absolute inset-0 bg-[#3B31B8]/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <CheckCircle2 className="w-20 h-20 text-[#3B31B8] mx-auto relative" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Payment Successful! 🎉
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-6"
        >
          Your premium subscription is now active. Enjoy unlimited access to all study materials!
        </motion.p>

        {(orderId || paymentId) && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 rounded-xl p-4 mb-6"
          >
            {paymentId && <p className="text-sm text-gray-400">Payment ID: <span className="text-white font-mono">{paymentId}</span></p>}
            {orderId && <p className="text-sm text-gray-400 mt-1">Order ID: <span className="text-white font-mono">{orderId}</span></p>}
          </motion.div>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Link
            to="/notes"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-semibold transition-all"
          >
            <Download className="w-5 h-5" />
            Start Downloading Notes
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all"
          >
            View Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 mt-6"
        >
          A confirmation email has been sent to your registered email address.
        </motion.p>
      </motion.div>
    </div>
  );
}
