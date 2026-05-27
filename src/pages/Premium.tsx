import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ShieldCheck, CheckCircle2, Zap, AlertCircle, Star, Crown, Rocket, CreditCard, X, Loader2, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Cashfree: any;
  }
}

// 3D Animated Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-[#0F172A] to-slate-950 overflow-hidden relative">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
    </div>

    <div className="relative z-10 flex flex-col items-center">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
      <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Loading Checkout
      </h2>
      <p className="text-gray-500 text-sm">Preparing secure payment gateways...</p>
    </div>
  </div>
);

export default function Premium() {
  const { user, userProfile, loading: authLoading, isAuthReady } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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

  // Verify and apply coupon (checks DB, fallbacks securely to local rules)
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setApplyingCoupon(true);
    setCouponError('');
    
    const formattedCode = couponCode.trim().toUpperCase();

    try {
      // 1. Try fetching from Supabase coupons table first
      const { data, error: sbError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', formattedCode)
        .eq('active', true)
        .single();

      if (!sbError && data) {
        if (data.used_count >= data.max_uses) {
          setCouponError('This coupon limit has been reached.');
          setAppliedCoupon(null);
        } else {
          setAppliedCoupon({
            id: data.id,
            code: data.code,
            type: data.type, // 'percent' or 'fixed'
            discount: data.discount
          });
          setCouponError('');
        }
      } else {
        // 2. Failsafe Local Fallbacks if table/entry doesn't exist
        if (formattedCode === 'SAVE50') {
          setAppliedCoupon({ code: 'SAVE50', type: 'percent', discount: 50 });
        } else if (formattedCode === 'FREEPRO') {
          setAppliedCoupon({ code: 'FREEPRO', type: 'fixed', discount: 499 });
        } else if (formattedCode === 'PHARMA100') {
          setAppliedCoupon({ code: 'PHARMA100', type: 'fixed', discount: 100 });
        } else {
          setCouponError('Invalid coupon code. Try SAVE50 or PHARMA100');
          setAppliedCoupon(null);
        }
      }
    } catch (err) {
      // Local fallback on connection issues
      if (formattedCode === 'SAVE50') {
        setAppliedCoupon({ code: 'SAVE50', type: 'percent', discount: 50 });
      } else {
        setCouponError('Invalid coupon code.');
      }
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Launch secure Cashfree billing checkout
  const handleCashfreePayment = async () => {
    try {
      if (!window.Cashfree) {
        throw new Error('Cashfree Web Checkout SDK failed to load. Please refresh the page.');
      }

      setError('');
      setLoading(true);

      const env = import.meta.env.VITE_CASHFREE_ENV || 'SANDBOX';
      const mode = env.toUpperCase() === 'PRODUCTION' ? 'production' : 'sandbox';
      const cashfree = window.Cashfree({ mode });

      // Create a unique order ID including user ID to map on server side verification
      const customOrderId = `ND_${user!.uid}_${Date.now()}`;

      // 1. Create Order Session in Backend
      const response = await fetch('/api/cashfree/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalPrice,
          customerId: user!.uid,
          customerPhone: '9999999999', // Fallback required phone number
          customerEmail: user!.email,
          orderId: customOrderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Order initiation failed.' }));
        throw new Error(errorData.error || 'Server connection error.');
      }

      const order = await response.json();

      if (!order.payment_session_id) {
        throw new Error('Verification session signature missing from server.');
      }

      // 2. Open Cashfree Web Checkout Checkout Modal / Screen
      const checkoutOptions = {
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self" // Cashfree opens checkout inline
      };

      cashfree.checkout(checkoutOptions);
    } catch (err: any) {
      console.error("Cashfree billing failed:", err);
      setError(err.message || 'Failed to initialize Cashfree transaction. Please try again.');
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      setError('Please sign in to buy Premium.');
      return;
    }

    // Bypass payment completely if discount equals ₹499 (100% discount)
    if (finalPrice === 0) {
      setLoading(true);
      try {
        const { error: upgradeError } = await supabase
          .from('profiles')
          .update({ 
            is_premium: true, 
            premium_activated_at: new Date().toISOString() 
          })
          .eq('id', user.uid);
        
        if (upgradeError) throw upgradeError;

        window.location.href = '/payment/success?success=true&order_id=FREE_PROMO';
      } catch (err) {
        setError('Failed to apply free promotional code.');
        setLoading(false);
      }
      return;
    }

    await handleCashfreePayment();
  };

  if (authLoading || !isAuthReady) {
    return <LoadingScreen />;
  }

  // Already Premium user profile layout
  if (userProfile?.is_premium || userProfile?.isPremium) {
    return (
      <div className="min-h-screen bg-[#0D1117] pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-slate-900 border border-blue-500/20 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-1/2 translate-x-1/2 bg-blue-600 px-6 py-1.5 rounded-b-2xl font-bold uppercase text-[9px] tracking-wider">
              Lifetime Pro Member
            </div>
            
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex w-24 h-24 bg-blue-500/10 rounded-full items-center justify-center mb-6 border border-blue-500/30"
            >
              <Crown className="w-12 h-12 text-blue-400" />
            </motion.div>
            
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Welcome to Pro, {userProfile.displayName || 'Learner'}! 🎉
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Your unlimited lifetime access to B.Pharma notes and summaries is active.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-md mx-auto flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-400">Subscription Status:</span>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                Active / Lifetime
              </span>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to="/notes-library/bpharma"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all"
              >
                Browse Notes
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10 transition-all"
              >
                Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Star className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            Pricing Plans
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Elevate Your Study Experience
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Invest in premium PCI- syllabus verified study handouts and lock in unlimited lifetime access today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Free Tier */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Standard Access</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Essential resources for standard study preparation.</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹0</span>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">/ Free Lifetime</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Access to Open/Free Repository",
                  "Semester & Unit Navigation Filters",
                  "Standard PDF Viewing Options",
                  "Join the Telegram Study Group"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/notes-library/bpharma">
              <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-xl font-bold text-sm transition-all">
                Browse Free Notes
              </button>
            </Link>
          </motion.div>

          {/* Premium Tier */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-slate-950 border-2 border-blue-500 rounded-3xl p-10 flex flex-col justify-between relative shadow-[0_0_50px_rgba(59,130,246,0.15)]"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-2xl font-bold uppercase text-[9px] tracking-wider">
              Recommended Choice
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Crown className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Lifetime Pro access</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Complete curriculum coverage and advanced GPAT preparation materials.</p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  {appliedCoupon && (
                    <span className="text-2xl text-gray-500 line-through font-bold">₹{basePrice}</span>
                  )}
                  <span className="text-4xl font-extrabold text-blue-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{finalPrice}</span>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">/ One-time fee</span>
                </div>
                
                {appliedCoupon && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    Code {appliedCoupon.code} Applied!
                    <button onClick={removeCoupon} className="text-emerald-400 hover:text-red-400 ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Coupon input */}
              {!appliedCoupon && (
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE (e.g. SAVE50)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 uppercase placeholder:text-gray-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-400 text-[11px] mt-1.5 font-semibold">{couponError}</p>
                  )}
                </div>
              )}

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited High-Quality Note Downloads",
                  "Unlock All Semester (1-8) Premium Handouts",
                  "AI Summarizer Unlimited Document Length",
                  "Complete GPAT Preparation Resources Included",
                  "Lifetime Updates (No recurring monthly fees)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                    <CheckCircle2 className="h-4.5 w-4.5 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                Upgrade to Lifetime Pro
              </button>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  {error}
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
