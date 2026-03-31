import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Brain,
  ArrowRight,
  Download,
  Users,
  GraduationCap,
  Star,
  ChevronDown
} from 'lucide-react';
import { LogoMinimal } from '../components/NotesDriveLogo';

export default function NewHomepage() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]"></div>
        {/* Floating orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 bg-[#3B31B8]/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        ></motion.div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          style={{ opacity }}
          className="max-w-6xl mx-auto text-center z-10"
        >
          {/* 3D Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-8"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                rotateX: [0, 10, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="px-6 py-2 bg-gradient-to-r from-[#3B31B8]/20 to-purple-600/20 border border-[#3B31B8]/30 rounded-full backdrop-blur-xl"
            >
              <span className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3B31B8]" />
                Your Ultimate Study Companion
              </span>
            </motion.div>
          </motion.div>

          {/* Main Heading with 3D Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          >
            <motion.span
              animate={{
                textShadow: [
                  '0 0 20px rgba(59,49,184,0.5)',
                  '0 0 40px rgba(59,49,184,0.8)',
                  '0 0 20px rgba(59,49,184,0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-[#3B31B8] via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              NotesDrive
            </motion.span>
            <br />
            <span className="text-white">Learn Smarter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Access premium study notes, AI-powered summaries, and ace your exams with confidence 🚀
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/notes-library">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#3B31B8] to-purple-600 rounded-2xl font-bold text-lg overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <span className="relative flex items-center gap-2">
                  Browse Notes
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>
            </Link>

            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Upload Notes
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-20"
          >
            <ChevronDown className="w-8 h-8 mx-auto text-gray-600" />
          </motion.div>
        </motion.div>

        {/* 3D Floating Cards */}
        <FloatingCards />
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

// Navbar Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0D1117]/80 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
            <LogoMinimal size="md" animated={true} />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/notes-library" className="text-sm font-medium hover:text-[#3B31B8] transition-colors">
              Notes Library
            </Link>
            <Link to="/summarizer" className="text-sm font-medium hover:text-[#3B31B8] transition-colors">
              AI Tools
            </Link>
            <Link to="/upload" className="text-sm font-medium hover:text-[#3B31B8] transition-colors">
              Upload
            </Link>
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-[#3B31B8] rounded-xl font-semibold"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Floating 3D Cards
function FloatingCards() {
  const cards = [
    { icon: BookOpen, label: 'Notes', position: 'top-20 left-10', delay: 0 },
    { icon: Brain, label: 'AI Tools', position: 'top-40 right-20', delay: 0.2 },
    { icon: Zap, label: 'Quick Access', position: 'bottom-40 left-20', delay: 0.4 },
    { icon: Star, label: 'Premium', position: 'bottom-20 right-10', delay: 0.6 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: 1,
            rotateY: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, delay: card.delay },
            scale: { duration: 0.5, delay: card.delay },
            rotateY: { duration: 10, repeat: Infinity, ease: "linear", delay: card.delay },
            y: { duration: 4, repeat: Infinity, delay: card.delay }
          }}
          className={`absolute ${card.position} hidden lg:block`}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <card.icon className="w-8 h-8 text-[#3B31B8]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Features Section with Scroll Animation
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: BookOpen,
      title: 'Vast Library',
      description: 'Access thousands of notes from BTech & B.Pharma streams',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI Summarizer',
      description: 'Get instant summaries of lengthy PDFs with AI',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Quick Access',
      description: 'Navigate by branch, semester, and subject easily',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Upload and share notes with fellow students',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <section ref={ref} className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-[#3B31B8] to-purple-500 bg-clip-text text-transparent">
              To Excel
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to make your study life easier
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity from-[#3B31B8]/50 to-purple-500/50 rounded-3xl"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { icon: Download, value: 'Unlimited', label: 'Free Downloads' },
    { icon: BookOpen, value: 'All', label: 'Subjects Covered' },
    { icon: Users, value: 'Growing', label: 'Student Community' },
    { icon: GraduationCap, value: '100%', label: 'Free Access' },
  ];

  return (
    <section ref={ref} className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#3B31B8]/20 to-purple-600/20 border border-[#3B31B8]/30 rounded-3xl p-12 backdrop-blur-xl">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 text-[#3B31B8] mx-auto mb-4" />
                <div className="text-4xl font-black mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of students already using NotesDrive
          </p>
          
          <Link to="/notes-library">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-[#3B31B8] to-purple-600 rounded-2xl font-bold text-xl"
            >
              Explore Notes Library →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
