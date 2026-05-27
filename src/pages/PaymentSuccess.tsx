import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProfile } = useFirebase();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyCashfreePayment = async () => {
      if (!orderId) {
        setStatus('failed');
        setErrorMessage('Order ID is missing from response session.');
        return;
      }

      // Handle promo bypass directly
      if (orderId === 'FREE_PROMO') {
        setStatus('success');
        return;
      }

      try {
        // Query backend verify endpoint which queries Cashfree API and updates Supabase
        const res = await fetch(`/api/cashfree/verify/${orderId}`);
        if (!res.ok) {
          throw new Error('Verification request rejected by server.');
        }

        const data = await res.json();
        
        // Cashfree Order statuses: 'PAID', 'ACTIVE', 'SUCCESS'
        if (data.order_status === 'PAID' || data.order_status === 'SUCCESS') {
          setStatus('success');
        } else {
          setStatus('failed');
          setErrorMessage(`Payment status is ${data.order_status || 'PENDING'}. Please wait or contact support.`);
        }
      } catch (err: any) {
        console.error('Payment verification failed:', err);
        setStatus('failed');
        setErrorMessage(err.message || 'Verification failed. Our server is checking your transaction.');
      }
    };

    // Bounded checkout check
    const delay = setTimeout(verifyCashfreePayment, 2000);
    return () => clearTimeout(delay);
  }, [orderId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Verifying Transaction...
          </p>
          <p className="text-gray-500 text-sm mt-1">Please do not refresh or close this tab</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white/[0.02] border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
          
          <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Payment Failed / Pending
          </h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {errorMessage || 'Your payment status could not be verified automatically by our gateways.'}
          </p>

          {orderId && (
            <div className="bg-white/5 rounded-xl p-3 mb-6 flex justify-between items-center text-xs">
              <span className="text-gray-500">Order Reference:</span>
              <span className="text-white font-mono font-bold">{orderId}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              Retry Verification
            </button>
            <Link
              to="/premium"
              className="block w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10 transition-all"
            >
              Try Different Method
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white/[0.02] border border-blue-500/20 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <CheckCircle2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
        
        <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Your Premium subscription is now fully active in Supabase. Enjoy unlimited downloads on B.Pharma notes!
        </p>

        {orderId && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <span className="text-white font-mono font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="text-emerald-400 font-bold uppercase">Paid / Verified</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/notes-library/bpharma"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            <Download className="w-4 h-4" />
            Start Downloading Notes
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10 transition-all"
          >
            Go to Student Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Premium access is applied immediately. If you face any delays, try logging out and logging back in.
        </p>
      </motion.div>
    </div>
  );
}
