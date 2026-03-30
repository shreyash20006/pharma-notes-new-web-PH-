import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp, getDoc, collection, query, where, getDocs, increment } from 'firebase/firestore';
import { ShieldCheck, CheckCircle2, Zap, AlertCircle, Star, Crown, Rocket, CreditCard, BookOpen, Sparkles, Tag, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

declare global {
  interface Window {
    Razorpay: any;
    Cashfree: any;
  }
}

// 3D Animated Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
    {/* Animated background */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"
      />
    </div>

    {/* 3D Floating Books */}
    <div className="relative z-10 flex flex-col items-center">
      <div className="relative mb-8">
        {/* Center Book */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotateY: [0, 15, 0],
            rotateX: [0, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <div 
            className="w-24 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-2xl flex items-center justify-center"
            style={{
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.5), 8px 8px 0 rgba(0,0,0,0.3)',
              transform: 'rotateY(-10deg)'
            }}
          >
            <BookOpen className="w-12 h-12 text-white/80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl" />
          </div>
        </motion.div>

        {/* Left Book */}
        <motion.div
          animate={{ 
            y: [5, -5, 5],
            rotateZ: [-15, -12, -15]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-16 top-4"
        >
          <div 
            className="w-16 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg"
            style={{
              boxShadow: '-6px 6px 0 rgba(0,0,0,0.3), -12px 12px 25px rgba(0,0,0,0.4)'
            }}
          />
        </motion.div>

        {/* Right Book */}
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
            rotateZ: [15, 12, 15]
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 top-6"
        >
          <div 
            className="w-14 h-18 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"
            style={{
              boxShadow: '6px 6px 0 rgba(0,0,0,0.3), 12px 12px 25px rgba(0,0,0,0.4)'
            }}
          />
        </motion.div>

        {/* Sparkles */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-4 -right-4"
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-3">Loading Premium</h2>
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 bg-purple-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-3 h-3 bg-pink-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-3 h-3 bg-blue-400 rounded-full"
          />
        </div>
        <p className="text-white/50 text-sm mt-4">Preparing your subscription details...</p>
      </motion.div>
    </div>
  </div>
);

export default function Premium() {
  const { user, userProfile, loading: authLoading, isAuthReady } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cashfree'>('razorpay');
  
  // Price and coupon states
  const [basePrice, setBasePrice] = useState(499);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Calculate final price
  const finalPrice = appliedCoupon 
    ? appliedCoupon.type === 'percent' 
      ? Math.round(basePrice * (1 - appliedCoupon.discount / 100))
      : Math.max(0, basePrice - appliedCoupon.discount)
    : basePrice;

  // Fetch price from Firestore
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'pricing'));
        if (settingsDoc.exists()) {
          setBasePrice(settingsDoc.data().premiumPrice || 499);
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    fetchPrice();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setApplyingCoupon(true);
    setCouponError('');
    
    try {
      const q = query(
        collection(db, 'coupons'),
        where('code', '==', couponCode.toUpperCase()),
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setCouponError('Invalid coupon code');
        setAppliedCoupon(null);
      } else {
        const couponData = snapshot.docs[0].data();
        if (couponData.usedCount >= couponData.maxUses) {
          setCouponError('Coupon usage limit reached');
          setAppliedCoupon(null);
        } else {
          setAppliedCoupon({ id: snapshot.docs[0].id, ...couponData });
          setCouponError('');
        }
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Error applying coupon');
    }
    setApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  if (authLoading || !isAuthReady) {
    return <LoadingScreen />;
  }

  // If user is already premium, show subscription status
  if (userProfile?.isPremium) {
    const expiryDate = userProfile.premiumExpiresAt?.toDate?.() || null;
    const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
      <div className="min-h-screen bg-surface pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#3B31B8] to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <CheckCircle2 className="w-24 h-24" />
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4">You're Already Premium! 🎉</h1>
            <p className="text-xl opacity-90 mb-8">
              Enjoy unlimited access to all study materials
            </p>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
              <p className="text-sm opacity-75 mb-2">Subscription Status</p>
              <p className="text-3xl font-bold mb-4">Active</p>
              
              {expiryDate && (
                <>
                  <p className="text-sm opacity-75 mb-1">Valid Until</p>
                  <p className="text-lg font-semibold">{expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm opacity-75 mt-2">{daysLeft} days remaining</p>
                </>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to="/notes"
                className="px-8 py-4 bg-white text-[#3B31B8] rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                Browse Notes
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white/20 backdrop-blur text-white rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleRazorpayPayment = async () => {
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      setError('');
      
      // 1. Create order on server with final price
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalPrice })
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
              // 4. Update user status in Firestore with expiry date
              try {
                // Set subscription to expire after 2 months
                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 2);
                
                await updateDoc(doc(db, 'users', user!.uid), {
                  isPremium: true,
                  premiumSince: serverTimestamp(),
                  premiumExpiresAt: expiryDate,
                  subscriptionDuration: '2 months'
                });
                
                // Redirect to success page with payment details
                window.location.href = `/payment/success?success=true&payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
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
          amount: finalPrice,
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

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                {appliedCoupon && (
                  <span className="text-3xl font-headline font-extrabold text-on-surface-variant line-through">₹{basePrice}</span>
                )}
                <span className="text-5xl font-headline font-extrabold text-primary">₹{finalPrice}</span>
                <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold">/ One-Time</span>
              </div>
              {appliedCoupon && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-emerald-500 font-bold">
                    {appliedCoupon.type === 'percent' ? `${appliedCoupon.discount}% OFF` : `₹${appliedCoupon.discount} OFF`} Applied!
                  </span>
                  <button onClick={removeCoupon} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Coupon Code Input */}
            {!appliedCoupon && (
              <div className="mb-8">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-high rounded-xl border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary uppercase"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-400 text-sm mt-2">{couponError}</p>
                )}
              </div>
            )}

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
              <div className="space-y-4">
                <div className="bg-primary/5 text-primary px-8 py-5 rounded-2xl font-headline font-bold text-lg text-center flex flex-col items-center justify-center gap-3 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6" />
                    Already Subscribed
                  </div>
                  {userProfile?.premiumExpiresAt && (
                    <div className="text-sm font-body text-primary/70">
                      Valid till: {new Date(userProfile.premiumExpiresAt.toDate?.() || userProfile.premiumExpiresAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  )}
                </div>
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
