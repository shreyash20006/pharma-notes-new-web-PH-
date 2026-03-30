import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  Crown, 
  Zap,
  ChevronDown,
  Shield,
  Sparkles,
  Users,
  Calendar,
  HeadphonesIcon,
  FileText,
  Brain,
  Flame,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'semester'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 pb-20">
      {/* HERO SECTION */}
      <HeroSection billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

      {/* PRICING CARDS */}
      <PricingCards billingCycle={billingCycle} />

      {/* SEMESTER PASS (if semester billing selected) */}
      {billingCycle === 'semester' && <SemesterPassCard />}

      {/* FEATURE COMPARISON TABLE */}
      <FeatureComparisonTable />

      {/* FAQ SECTION */}
      <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* BOTTOM CTA */}
      <BottomCTA />
    </div>
  );
}

// ============ HERO SECTION ============
function HeroSection({ billingCycle, setBillingCycle }: { 
  billingCycle: 'monthly' | 'semester', 
  setBillingCycle: (cycle: 'monthly' | 'semester') => void 
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" data-testid="pricing-hero">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B31B8]/10 border border-[#3B31B8]/30 rounded-full text-sm font-medium text-[#3B31B8] mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Trusted by 10,000+ Students
        </motion.div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          Simple, Student-Friendly
          <br />
          <span className="bg-gradient-to-r from-[#3B31B8] to-[#6366F1] bg-clip-text text-transparent">
            Pricing
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          No hidden fees. Cancel anytime. Made for Indian students. 🇮🇳
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-2 bg-[#0A0F1E] border border-white/10 rounded-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="toggle-monthly"
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('semester')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
              billingCycle === 'semester'
                ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="toggle-semester"
          >
            Semester Pass
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
              SAVE 77%
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}

// ============ PRICING CARDS ============
function PricingCards({ billingCycle }: { billingCycle: 'monthly' | 'semester' }) {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Perfect for trying out',
      features: [
        { text: '10 note downloads/month', included: true },
        { text: '1 stream only (BTech or B.Pharma)', included: true },
        { text: 'AI Summary: 3 uses/month', included: true },
        { text: 'Mock tests', included: false },
        { text: 'Flashcard generator', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'white',
      testId: 'plan-free'
    },
    {
      name: 'Pro',
      price: '₹99',
      period: '/month',
      description: 'Best for single stream students',
      features: [
        { text: 'Unlimited downloads', included: true },
        { text: '1 stream: BTech OR B.Pharma', included: true },
        { text: 'Unlimited AI summaries', included: true },
        { text: 'Smart flashcard generator', included: true },
        { text: 'Mock test engine', included: true },
        { text: 'Formula sheets', included: true },
        { text: 'Study groups', included: false },
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      color: 'blue',
      testId: 'plan-pro'
    },
    {
      name: 'Elite',
      price: '₹179',
      period: '/month',
      description: 'For serious students',
      features: [
        { text: 'Unlimited downloads', included: true },
        { text: 'Both streams: BTech + B.Pharma', included: true },
        { text: 'Unlimited AI summaries', included: true },
        { text: 'All Pro features', included: true },
        { text: 'Study groups', included: true },
        { text: 'Exam planner + alerts', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: 'Get Elite Access',
      popular: false,
      color: 'purple',
      testId: 'plan-elite'
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard key={plan.name} plan={plan} index={index} />
        ))}
      </div>
    </section>
  );
}

function PricingCard({ plan, index }: { plan: any, index: number }) {
  const getBorderColor = () => {
    if (plan.popular) return 'border-[#3B31B8]';
    if (plan.color === 'purple') return 'border-purple-600';
    return 'border-white/10';
  };

  const getButtonColor = () => {
    if (plan.popular) return 'bg-[#3B31B8] hover:bg-[#4d42d4] shadow-lg shadow-[#3B31B8]/40 hover:shadow-[#3B31B8]/60';
    if (plan.color === 'purple') return 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/40';
    return 'bg-white/5 border-2 border-white/20 hover:bg-white/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`relative bg-[#0A0F1E]/80 backdrop-blur-xl border-2 ${getBorderColor()} rounded-2xl p-8 ${
        plan.popular ? 'shadow-2xl shadow-[#3B31B8]/20 scale-105' : ''
      }`}
      data-testid={plan.testId}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-full text-xs font-bold shadow-lg">
          ⭐ MOST POPULAR
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-extrabold">{plan.price}</span>
          <span className="text-gray-400">{plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature: any, i: number) => (
          <li key={i} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            )}
            <span className={feature.included ? 'text-white' : 'text-gray-500'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        to="/premium"
        className={`block w-full text-center px-6 py-4 rounded-xl font-bold text-lg transition-all ${getButtonColor()}`}
        data-testid={`cta-${plan.testId}`}
      >
        {plan.cta}
      </Link>
    </motion.div>
  );
}

// ============ SEMESTER PASS CARD ============
function SemesterPassCard() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      data-testid="semester-pass"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center border-2 border-green-400 shadow-2xl shadow-green-600/30">
        {/* Save Badge */}
        <div className="absolute top-4 right-4 px-4 py-2 bg-white text-green-700 rounded-full text-sm font-bold shadow-lg">
          Save 77%
        </div>

        <div className="relative z-10">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-2">Semester Pass</h2>
          <p className="text-white/90 mb-6 text-lg">Best value before exams</p>
          
          <div className="flex items-baseline justify-center gap-3 mb-6">
            <span className="text-6xl font-extrabold">₹249</span>
            <div className="text-left">
              <div className="text-sm text-white/70">for 6 months</div>
              <div className="text-xs text-white/50 line-through">₹1,074 value</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              Elite Access
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              Both Streams
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              All Features
            </div>
          </div>

          <Link
            to="/premium"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            data-testid="semester-pass-cta"
          >
            <Target className="w-5 h-5" />
            Grab Semester Pass
          </Link>
        </div>

        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>
    </motion.section>
  );
}

// ============ FEATURE COMPARISON TABLE ============
function FeatureComparisonTable() {
  const features = [
    { name: 'Downloads', free: '10/month', pro: 'Unlimited', elite: 'Unlimited' },
    { name: 'AI Summaries', free: '3/month', pro: 'Unlimited', elite: 'Unlimited' },
    { name: 'Mock Tests', free: false, pro: true, elite: true },
    { name: 'Flashcards', free: false, pro: true, elite: true },
    { name: 'Formula Sheets', free: false, pro: true, elite: true },
    { name: 'Both Streams', free: false, pro: false, elite: true },
    { name: 'Study Groups', free: false, pro: false, elite: true },
    { name: 'Priority Support', free: false, pro: false, elite: true },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      data-testid="comparison-table"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Feature Comparison</h2>
        <p className="text-gray-400 text-lg">Choose the plan that fits your needs</p>
      </div>

      <div className="overflow-x-auto">
        <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">Feature</th>
                <th className="text-center py-4 px-4 font-semibold">Free</th>
                <th className="text-center py-4 px-4 font-semibold text-[#3B31B8]">Pro</th>
                <th className="text-center py-4 px-4 font-semibold text-purple-400">Elite</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{feature.name}</td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-400">{feature.free}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-[#3B31B8] font-semibold">{feature.pro}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.elite === 'boolean' ? (
                      feature.elite ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-purple-400 font-semibold">{feature.elite}</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}

// ============ FAQ SECTION ============
function FAQSection({ openFaq, setOpenFaq }: { openFaq: number | null, setOpenFaq: (index: number | null) => void }) {
  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your plan anytime. Changes take effect immediately and we will prorate any payments.'
    },
    {
      question: 'Is payment secure?',
      answer: 'Absolutely! We use Razorpay for secure payments. We support UPI, credit/debit cards, net banking, and wallets. All transactions are encrypted and PCI-DSS compliant.'
    },
    {
      question: 'Can I share my account?',
      answer: 'Your account is for personal use only. Sharing accounts violates our terms of service and may result in account suspension. Consider our Study Groups feature for collaboration!'
    },
    {
      question: 'Do notes get updated every semester?',
      answer: 'Yes! Our team continuously updates notes based on latest syllabi. Pro and Elite members get priority access to newly uploaded content and syllabus updates.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 7-day money-back guarantee for all paid plans. If you are not satisfied, contact support within 7 days of purchase for a full refund.'
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      data-testid="faq-section"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400 text-lg">Everything you need to know</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            data-testid={`faq-${index}`}
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold text-lg">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openFaq === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ============ BOTTOM CTA ============
function BottomCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      data-testid="bottom-cta"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-2xl p-12 text-center">
        <div className="relative z-10">
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Flame key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Join 10,000+ students already scoring more
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Start your journey to better grades today. No credit card required for free plan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#3B31B8] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              data-testid="cta-start-free"
            >
              Start Free
            </Link>
            <Link
              to="/premium"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0D1117] border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-[#1a2332] transition-all"
              data-testid="cta-go-pro"
            >
              <Crown className="w-5 h-5" />
              Go Pro ₹99
            </Link>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>
    </motion.section>
  );
}
