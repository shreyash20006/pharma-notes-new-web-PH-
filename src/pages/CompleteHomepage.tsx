import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ArrowRight, 
  Download, 
  Sparkles, 
  BookOpen, 
  Zap,
  Check,
  Star,
  Crown,
  Pill,
  Cpu,
  Brain,
  HeadphonesIcon,
  FileText,
  Lock,
  Instagram,
  Send,
  X,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompleteHomepage() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStream, setSelectedStream] = useState<'bpharma' | 'btech'>('bpharma');

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('notesdrive_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem('notesdrive_popup_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-hidden">
      {/* TOP TICKER BAR */}
      <TickerBar />

      {/* STICKY NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <HeroSection />

      {/* ANIMATED STATS COUNTER */}
      <StatsCounter />

      {/* STREAM SELECTOR */}
      <StreamSelector selectedStream={selectedStream} setSelectedStream={setSelectedStream} />

      {/* FEATURES GRID */}
      <FeaturesGrid />

      {/* SUBJECTS PREVIEW */}
      <SubjectsPreview selectedStream={selectedStream} setSelectedStream={setSelectedStream} />

      {/* TRENDING NOTES */}
      <TrendingNotes />

      {/* UNIVERSITY STRIP */}
      <UniversityStrip />

      {/* PRICING STRIP */}
      <PricingStrip />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FOOTER */}
      <Footer />

      {/* ANNOUNCEMENT POPUP */}
      <AnnouncementPopup show={showPopup} onClose={closePopup} />
    </div>
  );
}

// ============ TOP TICKER BAR ============
function TickerBar() {
  const messages = [
    '🆕 New: Pharmacology II Notes Added — Sem 5 B.Pharma',
    '🔥 Hot: DSA Complete Notes — BTech CSE',
    '🎉 Offer: Semester Pass ₹249 — Save 77%',
    '📢 New: DBMS Handwritten Notes Uploaded',
    '⚡ Flash Sale: Pro Plan ₹99 — Limited Time',
    '🆕 New: Medicinal Chemistry Unit 3 Added',
    '🏆 10,000+ Students Already Enrolled',
  ];

  return (
    <div className="h-9 bg-[#3B31B8] overflow-hidden relative">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1920] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...messages, ...messages, ...messages].map((msg, i) => (
          <span key={i} className="inline-flex items-center px-8 text-white text-[13px] font-medium">
            {msg} <span className="mx-4">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ============ NAVBAR ============
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0D1117]/90 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B31B8]/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">NotesDrive</div>
              <div className="text-[10px] text-gray-400 -mt-1">Your Smartest Study Partner</div>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-[#3B31B8] transition-colors">Home</Link>
            <Link to="/notes-library" className="text-sm font-medium hover:text-[#3B31B8] transition-colors">Notes Library</Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-[#3B31B8] transition-colors">Plans</Link>
            <Link to="/about" className="text-sm font-medium hover:text-[#3B31B8] transition-colors">About</Link>
          </div>

          {/* CTA Button */}
          <Link
            to="/pricing"
            className="px-6 py-2.5 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#3B31B8]/30"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#3B31B8]/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B31B8]/10 border border-[#3B31B8]/30 rounded-full text-sm font-bold text-[#3B31B8] mb-6">
              <Sparkles className="w-4 h-4" />
              PREMIUM INFRASTRUCTURE
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Upgrade to
              <br />
              <span className="bg-gradient-to-r from-[#3B31B8] to-[#6366F1] bg-clip-text text-transparent">
                NotesDrive Pro
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
              Unlimited notes, AI summaries & mock tests for <span className="text-white font-semibold">B.Pharma</span> and{' '}
              <span className="text-white font-semibold">BTech</span> students across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-[#3B31B8]/40"
              >
                View Access Plans
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/notes-library"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white/40 text-white rounded-xl font-bold text-lg transition-all"
              >
                Browse Free Notes
              </Link>
            </div>
          </motion.div>

          {/* Right - Floating Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B31B8]/20 to-[#6366F1]/20 blur-3xl" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative bg-[#0A0F1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Pharmacology Notes</div>
                      <div className="text-sm text-gray-400">B.Pharma - 3rd Sem</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-xs font-bold">PRO</div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-[#3B31B8] to-[#6366F1]" />
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-gradient-to-r from-[#3B31B8] to-[#6366F1]" />
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-5/6 h-full bg-gradient-to-r from-[#3B31B8] to-[#6366F1]" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">4.2 MB • 1,234 downloads</div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-lg font-semibold transition-all">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============ STATS COUNTER ============
function StatsCounter() {
  const stats = [
    { value: 50000, label: 'Notes Downloaded', icon: '📄', suffix: '+' },
    { value: 10000, label: 'Students Enrolled', icon: '👨‍🎓', suffix: '+' },
    { value: 500, label: 'Study Materials', icon: '📚', suffix: '+' },
    { value: 4.8, label: 'Average Rating', icon: '⭐', suffix: '/5' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index }: { stat: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:border-[#3B31B8]/50 transition-all"
    >
      <div className="text-4xl mb-4">{stat.icon}</div>
      <div className="text-4xl font-bold text-[#3B31B8] mb-2">
        {stat.value < 10 ? count.toFixed(1) : count.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="text-sm text-gray-400">{stat.label}</div>
    </motion.div>
  );
}

// ============ STREAM SELECTOR ============
function StreamSelector({ selectedStream, setSelectedStream }: any) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Choose Your Stream</h2>
          <p className="text-gray-400 text-lg">Select your course to explore premium study materials</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* B.Pharma Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => setSelectedStream('bpharma')}
            className={`p-8 rounded-2xl cursor-pointer transition-all ${
              selectedStream === 'bpharma'
                ? 'bg-[#3B31B8]/20 border-2 border-[#3B31B8] shadow-xl shadow-[#3B31B8]/30'
                : 'bg-[#0D1117] border-2 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-2xl flex items-center justify-center text-4xl">
                💊
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">B.Pharma</h3>
                <p className="text-gray-400">Bachelor of Pharmacy</p>
              </div>
            </div>

            <div className="space-y-2">
              {['Pharmacology', 'Pharmaceutics', 'Medicinal Chemistry', 'Pharmacognosy', 'Clinical Pharmacy'].map((subject, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-[#3B31B8]" />
                  {subject}
                </div>
              ))}
            </div>
          </motion.div>

          {/* BTech Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => setSelectedStream('btech')}
            className={`p-8 rounded-2xl cursor-pointer transition-all ${
              selectedStream === 'btech'
                ? 'bg-[#3B31B8]/20 border-2 border-[#3B31B8] shadow-xl shadow-[#3B31B8]/30'
                : 'bg-[#0D1117] border-2 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-2xl flex items-center justify-center text-4xl">
                ⚡
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">BTech</h3>
                <p className="text-gray-400">Bachelor of Technology</p>
              </div>
            </div>

            <div className="space-y-2">
              {['Computer Science (CSE)', 'Electronics (ECE)', 'Mechanical Engineering', 'Civil Engineering'].map((subject, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-[#3B31B8]" />
                  {subject}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============ FEATURES GRID ============
function FeaturesGrid() {
  const features = [
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Unlimited Archival Downloads',
      description: 'Download unlimited notes and study materials anytime, anywhere.',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Exclusive Pro-Tier Repository',
      description: 'Access premium notes uploaded by top-scoring students.',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Neural Document Summarization',
      description: 'AI-powered summaries to help you study faster and smarter.',
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: 'Priority Technical Support',
      description: '24/7 support to help you with any queries or issues.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything You Need to Score More</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Premium features designed specifically for Indian college students</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-[#0A0F1E]/80 backdrop-blur-xl border border-[#3B31B8]/30 rounded-2xl hover:shadow-xl hover:shadow-[#3B31B8]/20 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// I'll continue with the remaining sections in the next message due to length...
// Let me create the rest of the sections now.
