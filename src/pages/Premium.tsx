import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { ShieldCheck, CheckCircle2, Zap, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Premium() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!user) {
      setError('Please login to upgrade to Premium.');
      return;
    }

    setLoading(true);
    setError('');

    try {
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
        name: "PharmaNotes Premium",
        description: "One-time subscription for B.Pharma study materials",
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
              // 4. Update user status in Supabase
              const { error: updateError } = await supabase
                .from('users')
                .update({ is_premium: true })
                .eq('email', user.email);

              if (!updateError) {
                window.location.href = '/dashboard?success=true';
              } else {
                setError('Payment successful but failed to update profile. Please contact support.');
              }
            } else {
              setError(verifyData.error || 'Payment verification failed.');
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setError('Failed to verify payment. Please contact support.');
          }
        },
        prefill: {
          name: profile?.displayName || user?.email?.split('@')[0] || 'Premium User',
          email: user.email
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Invest in your future with our premium study materials and advanced AI tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Plan</h3>
            <p className="text-gray-500 text-sm">Perfect for getting started.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900">₹0</span>
            <span className="text-gray-400 text-sm">/forever</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {[
              "Access to Free Notes",
              "Basic AI Summarizer",
              "Basic MCQ Generator",
              "Join Telegram Community"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
          <button 
            disabled 
            className="w-full bg-gray-100 text-gray-400 px-6 py-4 rounded-2xl font-bold text-lg cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-blue-600 shadow-xl shadow-blue-50 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-2xl text-xs font-bold uppercase tracking-wider">
            Best Value
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Plan</h3>
            <p className="text-gray-500 text-sm">Complete access for serious students.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900">₹499</span>
            <span className="text-gray-400 text-sm">/one-time</span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {[
              "Unlimited PDF Downloads",
              "Exclusive Premium Notes",
              "Ad-free Experience",
              "Priority AI Tool Access",
              "Priority Support",
              "Lifetime Access"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                {item}
              </li>
            ))}
          </ul>
          
          {profile?.is_premium ? (
            <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl font-bold text-lg text-center flex items-center justify-center gap-2">
              <ShieldCheck className="h-6 w-6" />
              Premium Active
            </div>
          ) : (
            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6" />}
              Upgrade Now
            </button>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="text-gray-400 text-sm mb-6">Secure payments powered by Razorpay</p>
        <div className="flex justify-center gap-8 grayscale opacity-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
        </div>
      </div>
    </div>
  );
}
