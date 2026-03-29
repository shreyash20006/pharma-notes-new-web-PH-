import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, CheckCircle2, Zap, Loader2, AlertCircle, Star, Crown, Rocket, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

declare global {
  interface Window {
    Razorpay: any;
    Cashfree: any;
  }
}

export default function Premium() {
  const { user, userProfile, loading: authLoading, isAuthReady } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cashfree'>('razorpay');

  if (authLoading || !isAuthReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface-variant">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
        <p className="font-medium">Loading subscription details...</p>
      </div>
    );
  }

  const handleRazorpayPayment = async () => {
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      setError('');
      
      // 1. Create order on server
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 499 }) // ₹499
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create order' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const order = await response.json();

      if (!order.id) {
        throw new Error('Invalid order response from server');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "NotesDrive Premium",
        description: "One-time subscription for premium study materials",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // 3. Verify payment on server
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // 4. Update user status in Firestore
              try {
                await updateDoc(doc(db, 'users', user!.uid), {
                  isPremium: true,
                  premiumSince: serverTimestamp()
                });
                window.location.href = '/dashboard?success=true';
              } catch (dbErr) {
                console.error("Firestore error:", dbErr);
                setError('Payment successful but profile update failed. Please contact support.');
              }
            } else {
              setError(verifyData.error || 'Payment verification failed.');
            }
          } catch (handlerErr) {
            console.error("Payment handler error:", handlerErr);
            setError('Payment processing error. Please contact support.');
          }
        },
        onDismiss: () => {
          setError('Payment cancelled. Please try again.');
        },
        prefill: {
          name: userProfile?.displayName || user?.displayName || user?.email?.split('@')[0],
          email: user?.email
        },
        theme: {
          color: "#3525cd" // primary color
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay initiation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.');
    }
  };

  const handleCashfreePayment = async () => {
    try {
      if (!window.Cashfree) {
        throw new Error('Cashfree SDK not loaded. Please refresh the page.');
      }

      setError('');

      const env = import.meta.env.VITE_CASHFREE_ENV || 'SANDBOX';
      const mode = env.toUpperCase() === 'PRODUCTION' ? 'production' : 'sandbox';
      
      console.log("Cashfree Environment:", env, "Mode:", mode);

      const cashfree = window.Cashfree({ mode });

      // 1. Create order on server
      const response = await fetch('/api/cashfree/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 499,
          customerId: user!.uid,
          customerPhone: userProfile?.phone || "9999999999",
          customerEmail: user!.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create order' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const order = await response.json();
      console.log("Order created:", order.order_id);

      if (!order.payment_session_id) {
        throw new Error('Payment session ID missing from server response');
      }

      // 2. Initialize Checkout
      const checkoutOptions = {
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self",
      };

      console.log("Opening Cashfree Checkout...");
      cashfree.checkout(checkoutOptions);
    } catch (err: any) {
      console.error("Cashfree payment error:", err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      setError('Please login to upgrade to Premium.');
      return;
    }

    console.log("Initiating upgrade with method:", paymentMethod);
    setLoading(true);
    setError('');

    try {
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment();
      } else {
        await handleCashfreePayment();
      }
    } catch (err: any) {
      console.error("Upgrade error:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      // Don't set loading to false immediately as the payment handler might be async
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full font-label text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            <Star className="w-3 h-3 fill-primary" />
            Premium Access
          </motion.div>
          <h1 className="text-6xl font-headline font-extrabold text-on-surface tracking-tight mb-6">
            Elevate Your <span className="text-primary">Knowledge</span>
          </h1>
          <p className="text-on-surface-variant text-xl font-body max-w-2xl mx-auto leading-relaxed">
            Invest in precision-engineered study materials and advanced archival tools for high-performance learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-lowest p-12 rounded-[3rem] border border-outline-variant flex flex-col group hover:shadow-2xl hover:shadow-on-surface/5 transition-all"
          >
            <div className="mb-10">
              <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <Rocket className="w-7 h-7 text-on-surface-variant group-hover:text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Standard Access</h3>
              <p className="text-on-surface-variant font-body text-sm">Essential tools for baseline management.</p>
            </div>
            
            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-headline font-extrabold text-on-surface">₹0</span>
                <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold">/ Lifetime</span>
              </div>
            </div>

            <ul className="space-y-5 mb-12 flex-grow">
              {[
                "Access to Open Repository",
                "Basic Search & Filters",
                "Standard PDF Viewing",
                "Community Support Access"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-on-surface-variant text-sm font-medium font-body">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <button 
              disabled 
              className="w-full bg-surface-container-high text-on-surface-variant px-8 py-5 rounded-2xl font-headline font-bold text-lg cursor-not-allowed opacity-60"
            >
              Active Baseline
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-lowest p-12 rounded-[3rem] border-2 border-primary shadow-2xl shadow-primary/10 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-primary text-white px-8 py-3 rounded-bl-3xl font-label text-[10px] font-bold uppercase tracking-widest">
              High Performance
            </div>
            
            <div className="mb-10">
              <div className="w-14 h-14 bg-primary-container/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-300">
                <Crown className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">NotesDrive Pro</h3>
              <p className="text-on-surface-variant font-body text-sm">Full-spectrum archival & analysis suite.</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-headline font-extrabold text-on-surface">₹499</span>
                <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold">/ One-Time</span>
              </div>
            </div>

            <ul className="space-y-5 mb-12 flex-grow">
              {[
                "Unlimited Archival Downloads",
                "Exclusive Premium Repository",
                "Zero-Latency Interface",
                "Priority Contribution Verification",
                "Advanced Metadata Analytics",
                "Lifetime Archival Access"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-on-surface font-bold text-sm font-body">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            
            {userProfile?.isPremium ? (
              <div className="bg-primary/5 text-primary px-8 py-5 rounded-2xl font-headline font-bold text-lg text-center flex items-center justify-center gap-3 border border-primary/20">
                <ShieldCheck className="h-6 w-6" />
                Pro Status Verified
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'razorpay' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-sm">Razorpay</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('cashfree')}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'cashfree' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-sm">Cashfree</span>
                  </button>
                </div>

                <button 
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-primary text-white px-8 py-5 rounded-2xl font-headline font-extrabold text-xl hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6 fill-white" />}
                  Initialize Upgrade
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-6 p-4 bg-error/10 text-error rounded-2xl flex items-center gap-3 text-sm font-bold border border-error/20">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}
          </motion.div>
        </div>

        <div className="mt-24 text-center">
          <p className="text-on-surface-variant font-label text-[10px] font-bold uppercase tracking-widest mb-8 opacity-60">Secure Transaction Gateway</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-30 hover:opacity-60 transition-opacity items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-5" />
            <img src="https://www.cashfree.com/wp-content/uploads/2021/04/Cashfree-Logo-1.png" alt="Cashfree" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
