import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  CheckCircle2,
  FileText,
  ShieldAlert,
  Send
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

export default function NewHomepage() {
  const { user, userProfile } = useFirebase();

  return (
    <div className="min-h-screen bg-[#0D1117] text-white relative overflow-hidden font-sans selection:bg-blue-600/30">
      
      {/* Decorative Neon Blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Floating Interactive Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Premium B.Pharma Notes Hub
            </span>
          </div>
        </motion.div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your B.Pharma Notes, <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              All in One Place
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Master pharmacy subjects with high-quality, semester-wise handwritten notes. Complete your syllabus, prepare for GPAT, and ace your exams effortlessly.
          </motion.p>
        </div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16 z-10"
        >
          <Link to="/notes-library/bpharma">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-base flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
            >
              Browse B.Pharma Notes
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>

          {!userProfile?.isPremium && (
            <Link to="/premium">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-2xl font-bold text-base flex items-center gap-2 backdrop-blur-xl transition-all"
              >
                Get Lifetime Pro (₹499)
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* Floating Semester Numbers Preview */}
        <div className="w-full max-w-5xl grid grid-cols-4 md:grid-cols-8 gap-4 mb-24 px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem, idx) => (
            <Link key={sem} to={`/notes-library/bpharma?sem=${sem}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ scale: 1.1, y: -5, borderColor: 'rgba(59,130,246,0.5)' }}
                className="aspect-square rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gradient-to-br hover:from-blue-600/10 hover:to-purple-600/10 group"
              >
                <span className="text-2xl md:text-3xl font-black text-blue-400 group-hover:text-white transition-colors">
                  S{sem}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider group-hover:text-blue-300 transition-colors mt-0.5">
                  Sem
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: FileText, value: '500+ Notes', label: 'Precise Handouts & PPTs' },
            { icon: BookOpen, value: '8 Semesters', label: 'Entire B.Pharma Covered' },
            { icon: Users, value: '1,000+ Students', label: 'Active Learners Daily' },
            { icon: Star, value: '₹499 Lifetime', label: 'One-time upgrade cost' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <stat.icon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Engineered for <span className="text-blue-400">Excellent Grades</span>
          </h2>
          <p className="text-gray-400">
            Everything a B.Pharma student needs to succeed, right inside a single dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: 'Curated PDF Notes',
              description: 'Semester-wise notes structured unit-by-unit according to PCI syllabus.'
            },
            {
              icon: Brain,
              title: 'AI Study Assistant',
              description: 'Summarize heavy pharmacology and chemistry chapters in seconds using AI.'
            },
            {
              icon: Zap,
              title: 'Instant Checkout SDK',
              description: 'Secure billing through Cashfree Payment Gateway with instant upgrades.'
            }
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative group overflow-hidden transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <feat.icon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Semester Selector Grid Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#161B22]/40 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Explore By <span className="text-purple-400">Semester</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Select your semester to access tailored hand-outs, university blueprints, syllabus catalogs, and notes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <Link key={sem} to={`/notes-library/bpharma?sem=${sem}`}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4, borderColor: 'rgba(139,92,246,0.4)' }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 cursor-pointer transition-all hover:bg-gradient-to-tr hover:from-blue-600/5 hover:to-purple-600/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center font-black text-lg text-purple-400 border border-purple-500/20">
                    S{sem}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Semester {sem}</h4>
                    <p className="text-xs text-gray-500">View Active Subject Notes</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Lifetime Upgrade CTA Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-blue-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]"
        >
          {/* Top highlight badge */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 bg-blue-600 text-white px-8 py-2.5 rounded-b-3xl font-bold uppercase text-[10px] tracking-widest shadow-md">
            RECOMMENDED FOR GPAT & PCI EXAMS
          </div>

          <div className="max-w-2xl mx-auto flex flex-col items-center pt-4">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Unlock All B.Pharma Notes
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
              Get lifetime access to the entire B.Pharma library containing all subjects, exclusive mock GPAT study materials, and premium university templates for a one-time upgrade fee.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <div className="text-left">
                <span className="text-xs text-gray-500 line-through block font-bold">REGULAR PRICE: ₹1,499</span>
                <span className="text-5xl font-black text-blue-400">₹499 <span className="text-base text-gray-400 font-medium">/ Lifetime</span></span>
              </div>
              <div className="h-[2px] w-12 sm:h-12 sm:w-[2px] bg-white/10" />
              <ul className="text-left space-y-2">
                {[
                  '100% Secure Checkout via Cashfree',
                  'Unlimited High-Quality Downloads',
                  'No Monthly Subscriptions',
                  'Exclusive Handwritten Content'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {userProfile?.isPremium ? (
              <div className="px-8 py-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Active Premium Access (Lifetime Pro)
              </div>
            ) : (
              <Link to="/premium">
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl flex items-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                >
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                  Upgrade to Pro Now
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Community / Footer Telegram Promo */}
      <section className="py-16 px-6 border-t border-white/5 bg-[#161B22]/10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl mb-16">
        <div>
          <h3 className="text-2xl font-extrabold mb-2">Join the B.Pharma Circle</h3>
          <p className="text-gray-400 text-sm">Get live job alerts, syllabus catalogs, exam updates, and peer support on Telegram.</p>
        </div>
        <a
          href="https://t.me/your_channel"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 hover:bg-blue-500 hover:text-white font-bold flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
        >
          <Send className="w-5 h-5" />
          Join Telegram Channel
        </a>
      </section>

    </div>
  );
}
