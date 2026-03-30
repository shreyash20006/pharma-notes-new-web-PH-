import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  Download, 
  Sparkles, 
  BookOpen, 
  Zap, 
  Lock,
  Check,
  Star,
  Menu,
  X,
  Instagram,
  Send,
  MessageCircle,
  Pill,
  Cpu,
  GraduationCap,
  FileText,
  HeadphonesIcon,
  Crown
} from 'lucide-react';

export default function HomeNew() {
  const [selectedStream, setSelectedStream] = useState<'bpharma' | 'btech'>('bpharma');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* HERO SECTION */}
      <HeroSection />

      {/* STREAM SELECTOR */}
      <StreamSelector selectedStream={selectedStream} setSelectedStream={setSelectedStream} />

      {/* FEATURES SECTION */}
      <FeaturesSection />

      {/* SUBJECTS PREVIEW */}
      <SubjectsPreview />

      {/* PRICING STRIP */}
      <PricingStrip />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// ============ NAVBAR COMPONENT ============
function Navbar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean, setMobileMenuOpen: (open: boolean) => void }) {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/10"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="navbar-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B31B8]/30 group-hover:shadow-[#3B31B8]/50 transition-all">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">NotesDrive</div>
              <div className="text-[10px] text-gray-400 -mt-1">Your Smartest Study Partner</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" data-testid="nav-home">
              Home
            </Link>
            <Link to="/notes" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" data-testid="nav-library">
              Notes Library
            </Link>
            <Link to="/premium" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" data-testid="nav-plans">
              Plans
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" data-testid="nav-about">
              About
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link 
              to="/premium"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#3B31B8]/30 hover:shadow-[#3B31B8]/50"
              data-testid="navbar-upgrade-cta"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0A0F1E] border-t border-white/10"
        >
          <div className="px-4 py-6 space-y-4">
            <Link to="/" className="block text-gray-300 hover:text-white font-medium">Home</Link>
            <Link to="/notes" className="block text-gray-300 hover:text-white font-medium">Notes Library</Link>
            <Link to="/premium" className="block text-gray-300 hover:text-white font-medium">Plans</Link>
            <Link to="/about" className="block text-gray-300 hover:text-white font-medium">About</Link>
            <Link 
              to="/premium"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#3B31B8] text-white rounded-xl font-semibold"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden" data-testid="hero-section">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#3B31B8]/20 rounded-full blur-[150px] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B31B8]/10 border border-[#3B31B8]/30 rounded-full text-sm font-medium text-[#3B31B8] mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Premium Study Platform
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Upgrade to
              <br />
              <span className="bg-gradient-to-r from-[#3B31B8] to-[#6366F1] bg-clip-text text-transparent">
                NotesDrive Pro
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
              Unlimited notes, AI summaries & mock tests for <span className="text-white font-semibold">B.Pharma</span> and <span className="text-white font-semibold">BTech</span> students across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/premium"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-[#3B31B8]/40 hover:shadow-[#3B31B8]/60 group"
                data-testid="hero-plans-cta"
              >
                View Access Plans
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/notes"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white/40 text-white rounded-xl font-bold text-lg transition-all"
                data-testid="hero-notes-cta"
              >
                Browse Free Notes
              </Link>
            </div>
          </motion.div>

          {/* Right - Floating Card Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B31B8]/30 to-[#6366F1]/30 blur-3xl -z-10" />
              
              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
                  <div className="px-3 py-1 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-xs font-bold">
                    PRO
                  </div>
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
                  <div className="text-gray-400">2.4 MB • 1,234 downloads</div>
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

// ============ STREAM SELECTOR ============
function StreamSelector({ selectedStream, setSelectedStream }: { selectedStream: string, setSelectedStream: (stream: 'bpharma' | 'btech') => void }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]" data-testid="stream-selector">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B31B8]/10 border border-[#3B31B8]/30 rounded-full text-sm font-bold uppercase tracking-wider text-[#3B31B8] mb-4">
            Premium Infrastructure
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Choose Your Stream</h2>
          <p className="text-gray-400 text-lg">Select your course to explore premium study materials</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* B.Pharma Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedStream('bpharma')}
            className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedStream === 'bpharma' 
                ? 'bg-[#3B31B8]/20 border-2 border-[#3B31B8] shadow-xl shadow-[#3B31B8]/30' 
                : 'bg-[#0D1117] border-2 border-white/10 hover:border-white/20'
            }`}
            data-testid="stream-bpharma"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-2xl flex items-center justify-center">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">B.Pharma</h3>
                <p className="text-gray-400">Bachelor of Pharmacy</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-300 mb-3">Subjects Available:</div>
              {['Pharmacology', 'Pharmaceutics', 'Medicinal Chemistry', 'Pharmacognosy', 'Pharmaceutical Analysis'].map((subject, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400">
                  <Check className="w-4 h-4 text-[#3B31B8]" />
                  {subject}
                </div>
              ))}
            </div>
          </motion.div>

          {/* BTech Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedStream('btech')}
            className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedStream === 'btech' 
                ? 'bg-[#3B31B8]/20 border-2 border-[#3B31B8] shadow-xl shadow-[#3B31B8]/30' 
                : 'bg-[#0D1117] border-2 border-white/10 hover:border-white/20'
            }`}
            data-testid="stream-btech"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-2xl flex items-center justify-center">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">BTech</h3>
                <p className="text-gray-400">Bachelor of Technology</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-300 mb-3">Branches Available:</div>
              {['Computer Science (CSE)', 'Electronics (ECE)', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'].map((branch, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400">
                  <Check className="w-4 h-4 text-[#3B31B8]" />
                  {branch}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============ FEATURES SECTION ============
function FeaturesSection() {
  const features = [
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Unlimited Archival Downloads',
      description: 'Download unlimited notes and study materials anytime, anywhere.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Exclusive Pro-Tier Repository',
      description: 'Access premium notes uploaded by top-scoring students.'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Neural Document Summarization',
      description: 'AI-powered summaries to help you study faster and smarter.'
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: 'Priority Technical Support',
      description: '24/7 support to help you with any queries or issues.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="features-section">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything You Need to Score More</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Premium features designed specifically for Indian college students
          </p>
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
              className="relative p-6 bg-[#0A0F1E] border border-white/10 rounded-2xl hover:border-[#3B31B8]/50 transition-all group"
              data-testid={`feature-${index}`}
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

// ============ SUBJECTS PREVIEW ============
function SubjectsPreview() {
  const [activeTab, setActiveTab] = useState<'bpharma' | 'btech'>('bpharma');

  const bpharmaSubjects = [
    { year: 'Year 1', subjects: ['Pharmaceutics-I', 'Pharmaceutical Chemistry', 'Pharmacognosy', 'Human Anatomy'], notes: 24 },
    { year: 'Year 2', subjects: ['Pharmaceutics-II', 'Medicinal Chemistry', 'Pathophysiology', 'Pharmacology-I'], notes: 32 },
    { year: 'Year 3', subjects: ['Pharmacology-II', 'Pharmaceutical Analysis', 'Pharmaceutical Jurisprudence', 'Biopharmaceutics'], notes: 28 },
    { year: 'Year 4', subjects: ['Clinical Pharmacy', 'Hospital Pharmacy', 'Drug Regulatory Affairs', 'Pharmaceutical Marketing'], notes: 20 }
  ];

  const btechBranches = [
    { branch: 'Computer Science', subjects: ['DSA', 'DBMS', 'OS', 'Computer Networks'], notes: 45 },
    { branch: 'Electronics', subjects: ['Digital Electronics', 'Signals & Systems', 'Control Systems', 'VLSI'], notes: 38 },
    { branch: 'Mechanical', subjects: ['Thermodynamics', 'Fluid Mechanics', 'SOM', 'Manufacturing'], notes: 35 },
    { branch: 'Civil', subjects: ['Structural Analysis', 'Concrete Technology', 'Surveying', 'Geotechnical'], notes: 30 }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]" data-testid="subjects-preview">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Browse By Subject</h2>
          <p className="text-gray-400 text-lg">Comprehensive notes for every semester and branch</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('bpharma')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'bpharma'
                ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            data-testid="tab-bpharma"
          >
            B.Pharma
          </button>
          <button
            onClick={() => setActiveTab('btech')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'btech'
                ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            data-testid="tab-btech"
          >
            BTech
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTab === 'bpharma' ? (
            bpharmaSubjects.map((item, index) => (
              <SubjectCard key={index} title={item.year} subjects={item.subjects} notes={item.notes} />
            ))
          ) : (
            btechBranches.map((item, index) => (
              <SubjectCard key={index} title={item.branch} subjects={item.subjects} notes={item.notes} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SubjectCard({ title, subjects, notes }: { title: string, subjects: string[], notes: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative p-6 bg-[#0D1117] border border-white/10 rounded-2xl hover:border-[#3B31B8]/50 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="px-3 py-1 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-xs font-bold">
          {notes} notes
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        {subjects.map((subject, i) => (
          <div key={i} className="text-sm text-gray-400">• {subject}</div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-[#3B31B8] border border-white/10 hover:border-[#3B31B8] rounded-xl font-semibold transition-all group-hover:shadow-lg">
        <Lock className="w-4 h-4" />
        Unlock with Pro
      </button>
    </motion.div>
  );
}

// ============ PRICING STRIP ============
function PricingStrip() {
  const plans = [
    { name: 'Free', price: '₹0', period: 'Forever', features: ['Basic notes access', '3 AI summaries/month', 'Community support'] },
    { name: 'Pro', price: '₹99', period: '/month', popular: true, features: ['Unlimited downloads', 'Unlimited AI summaries', '1 stream access'] },
    { name: 'Elite', price: '₹179', period: '/month', features: ['Both streams', 'Priority support', 'Early access to features'] }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="pricing-strip">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 text-lg">Choose the plan that works best for you</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'bg-[#3B31B8]/20 border-2 border-[#3B31B8] shadow-xl shadow-[#3B31B8]/30'
                  : 'bg-[#0A0F1E] border border-white/10'
              }`}
              data-testid={`plan-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-full text-xs font-bold shadow-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-gray-400 text-sm mb-2">{plan.name}</div>
                <div className="text-5xl font-bold mb-1">{plan.price}</div>
                <div className="text-gray-400 text-sm">{plan.period}</div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#3B31B8]" />
                    {feature}
                  </div>
                ))}
              </div>

              <Link
                to="/premium"
                className={`block w-full text-center px-6 py-3 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-[#3B31B8] hover:bg-[#4d42d4] text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                {plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/premium"
            className="inline-flex items-center gap-2 text-[#3B31B8] hover:text-[#4d42d4] font-semibold transition-colors"
            data-testid="view-full-plans"
          >
            View Full Plans & Comparison
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIALS ============
function Testimonials() {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      college: 'JSS College of Pharmacy',
      stream: 'B.Pharma - 3rd Year',
      rating: 5,
      text: 'NotesDrive helped me ace my exams! The AI summaries are a game-changer. Worth every rupee!'
    },
    {
      name: 'Priya Patel',
      college: 'NIT Trichy',
      stream: 'BTech CSE - 2nd Year',
      rating: 5,
      text: 'Best investment for my studies. The notes are well-organized and the mock tests are super helpful.'
    },
    {
      name: 'Arjun Reddy',
      college: 'Manipal College of Pharmacy',
      stream: 'B.Pharma - 4th Year',
      rating: 5,
      text: 'Finally, a platform made for Indian students. The quality of notes is excellent and support is amazing!'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]" data-testid="testimonials">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Loved by Students</h2>
          <p className="text-gray-400 text-lg">Join thousands of students scoring better with NotesDrive</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-[#0D1117] border border-white/10 rounded-2xl hover:border-[#3B31B8]/50 transition-all"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#3B31B8] text-[#3B31B8]" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-full flex items-center justify-center text-lg font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.college}</div>
                  <div className="text-xs text-[#3B31B8]">{testimonial.stream}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl">NotesDrive</div>
                <div className="text-xs text-gray-400">Your Smartest Study Partner</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              Premium study notes platform for B.Pharma and BTech students across India. Study smarter, score better.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Made for Indian Students</span>
              <span className="text-2xl">🇮🇳</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-bold mb-4">Quick Links</div>
            <div className="space-y-2">
              <Link to="/notes" className="block text-gray-400 hover:text-white text-sm transition-colors">Notes Library</Link>
              <Link to="/premium" className="block text-gray-400 hover:text-white text-sm transition-colors">Pricing Plans</Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link>
              <Link to="/about" className="block text-gray-400 hover:text-white text-sm transition-colors">About</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="font-bold mb-4">Connect With Us</div>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/notesdrive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-[#3B31B8] border border-white/10 hover:border-[#3B31B8] rounded-xl flex items-center justify-center transition-all"
                data-testid="footer-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://t.me/notesdrive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-[#3B31B8] border border-white/10 hover:border-[#3B31B8] rounded-xl flex items-center justify-center transition-all"
                data-testid="footer-telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-[#3B31B8] border border-white/10 hover:border-[#3B31B8] rounded-xl flex items-center justify-center transition-all"
                data-testid="footer-whatsapp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© 2025 NotesDrive. All rights reserved. Built with 💙 for Indian students.</p>
        </div>
      </div>
    </footer>
  );
}
