import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Award, 
  BookOpen, 
  Sparkles, 
  UploadCloud, 
  GraduationCap, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  Layers,
  BookMarked,
  Stethoscope,
  PenTool,
  ArrowRightLeft
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

export default function NewHomepage() {
  const { user, userProfile, signInWithGoogle, signOut, isAdmin } = useFirebase();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mousemove micro-interaction ambient glow tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(173, 198, 255, 0.15) 0%, transparent 70%)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Shortcut key listener (Ctrl+K or Cmd+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Redirect search to the pharmacy library by default or competitive library based on query
    const query = searchQuery.toLowerCase();
    if (query.includes('jee') || query.includes('neet') || query.includes('physics') || query.includes('biology')) {
      navigate(`/notes-library/jeeneet?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/notes-library/bpharma?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const trendingMaterials = [
    {
      title: 'Structural Analysis II Masterclass',
      category: 'B.Tech Engineering',
      pages: 124,
      price: 499,
      rating: '4.8 (210)',
      colorClass: 'border-blue-500/30 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(173,198,255,0.25)]',
      accentColor: 'text-[#adc6ff]',
      btnBg: 'bg-[#adc6ff]/10 hover:bg-[#adc6ff] text-[#adc6ff] hover:text-[#002e6a]',
      link: '/notes-library/btech',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBegryekxoela3xATEZJXjP0gvgMkgOhkddXduyq-xJ2GOzabsDmRD2VfcgFA-O1Kt8rg_TBGnUAy57G1XhAwHMQni9vROFDdQebDPTHDPGESv-iJx5ZmS7nGa-e0vhwx0tnyGxzAMvi8ChxoCYVT3C0gUwnL--oNORRULs0Acrv38MAVkiAst_vdG7x35x-5Y7_jJGJoh9fy9uTMiVGc6kCdaF7VAMQdutUrA-0xHJMbSfaLHFDO3tX4INe7D_dYm-ZhBRowIymX1k'
    },
    {
      title: 'Applied Pharmacology: Clinical Keys',
      category: 'Pharmacy',
      pages: 310,
      price: 899,
      rating: '4.9 (85)',
      colorClass: 'border-pink-500/30 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(255,176,205,0.25)]',
      accentColor: 'text-[#ffb0cd]',
      btnBg: 'bg-[#ffb0cd]/10 hover:bg-[#ffb0cd] text-[#ffb0cd] hover:text-[#640039]',
      link: '/notes-library/bpharma',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiaS4STmnjTyuPn5IylpxTGvRO213Iqs7oHW8S_z_cYzqhcddo36Qe3s_bfh2d9s1fVozPweWsW-BH8ZHI9Sq-i3Ve6qfziO3iWZ3ryiX3uGM9IsgfCTRNf4JezGHcYF5jPBr0FEZlmpSIhjt62mN-jp7M49OWeNq9LVAvTXkyb6rfB6s7NEDM4mV5q6PrHxqPadeEXg7Qif-3dVELPw1AA2UkT382iDnwzQ9gOU3ZYhYnZYUgGRWwUpQK3F8KHdmJaPuZS0AKuGYq'
    },
    {
      title: 'Human Anatomy: Visual Atlas v3.0',
      category: 'Medical (MBBS)',
      pages: 450,
      price: 1299,
      rating: '5.0 (42)',
      colorClass: 'border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(208,188,255,0.25)]',
      accentColor: 'text-[#d0bcff]',
      btnBg: 'bg-[#d0bcff]/10 hover:bg-[#d0bcff] text-[#d0bcff] hover:text-[#3c0091]',
      link: '/notes-library/bpharma',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvl1TG2Yn68TDPm8GIq20VJ16_m1B9N5wRIxq6bqkbq_6-6h_WljaZtIuhFE1PIPf1C7WYqE3RWkvxgZvKR0lwGT_RU_keWwj8uebPa1AyxvC4Ia_eK1YG5IxC4lOP6Y21E9r0j50ASF0LmlFmtVm4-EDRH1s-rVHPaiUtSnYjWREMq4MqNh3xrstS8dWTByv-5u-whUyVFgGSKjDJW9wrdHDk95tlAdCnOmcSFBp5bixi3MvnNxXdms2IGGwHsWtpC9Oi9GlbPuTe'
    },
    {
      title: 'Python for Engineers: Applied Logic',
      category: 'Engineering (B.Tech)',
      pages: 280,
      price: 349,
      rating: '4.7 (156)',
      colorClass: 'border-blue-500/30 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(173,198,255,0.25)]',
      accentColor: 'text-[#adc6ff]',
      btnBg: 'bg-[#adc6ff]/10 hover:bg-[#adc6ff] text-[#adc6ff] hover:text-[#002e6a]',
      link: '/notes-library/btech',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACAChT8dqZiskQv_7hEZpg6Wh7fYEj5lXMQO2XPPKMIS7gCFR6O9mIFnrmCJRIyHxPyR70BJWFTVD_7ImheuEiPTJ-l_yvOK_JnfaXQhNUn2w9zicz5TCAjtKJgOh6tewtz5gaW17FOPAB2z4HLpYO8spXvvuKYEE7twJwblitXDNSIw1Y704-AEMKxLB-zWIyqnnCF1xKfl3BUqa53Z875lynqkS4ckJ5tydt7WOFuCOnUBWRD678sRB2iGtOTISu5c-qDjNVr_AS'
    },
    {
      title: 'Organic Chemistry: The Reaction Core',
      category: 'Reference / Pharmacy',
      pages: 520,
      price: 749,
      rating: '4.9 (92)',
      colorClass: 'border-pink-500/30 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(255,176,205,0.25)]',
      accentColor: 'text-[#ffb0cd]',
      btnBg: 'bg-[#ffb0cd]/10 hover:bg-[#ffb0cd] text-[#ffb0cd] hover:text-[#640039]',
      link: '/notes-library/bpharma',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx2mAxjgP5Sd-W-ON0fpLyQpxIO2iHuBuFKUD2kghN0zFxtVpwgPlvHcWJl9W4NYadNTRjA4e5b3fSiHj6TBMeRh99L5AwYBpzfSRU7Bsv2y06_sIxHz-x_gGjGQr07j_t9qf6cy3aBHxyG_9kmEfVEQTqjEybuVlBjV26ocZmvRW1rl7XCoQQBOJBMjXxPQysgYen60bVE1ypp6EmoE8dY2Jq149X5hpbSvKFAXNZoQAi53nBtRhrCByg_nievd18QP2OtSowYREl'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#e1e2ec] relative overflow-hidden font-sans selection:bg-blue-600/30 pt-24">
      {/* Premium Header Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.25)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition-all">
              <BookOpen className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              NotesDrive
            </span>
          </Link>

          {/* Quick Hub Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-400">
            <Link to="/notes-library/btech" className="hover:text-blue-400 transition-colors">B.Tech</Link>
            <Link to="/notes-library/bpharma" className="hover:text-pink-400 transition-colors">B.Pharma</Link>
            <Link to="/notes-library/jeeneet" className="hover:text-purple-400 transition-colors">JEE / NEET</Link>
            <Link to="/premium" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Pro Access
            </Link>
          </div>

          {/* Authentication Actions (Google Login / Profile Widget) */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-2xl pl-3 pr-2 py-1.5">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-white line-clamp-1">{userProfile?.displayName || user.email?.split('@')[0]}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold">{userProfile?.isPremium ? 'PRO MEMBER' : 'FREE ACCOUNT'}</p>
                </div>
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-purple-500" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold border border-purple-500 text-white">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
                <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                {isAdmin && (
                  <Link to="/admin" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-bold px-2 py-1">
                    Admin
                  </Link>
                )}
                <Link to="/student-dashboard" className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-bold px-2 py-1">
                  Dashboard
                </Link>
                <button onClick={signOut} className="text-xs text-gray-400 hover:text-red-400 transition-colors font-bold px-2 py-1">
                  Log out
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={signInWithGoogle}
                className="bg-white hover:bg-gray-100 text-gray-900 text-xs sm:text-sm font-black px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-white/5 flex items-center gap-2 group transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </motion.button>
            )}
          </div>
        </div>
      </nav>
      
      {/* Decorative radial lighting backdrops */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[640px] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-white/5 bg-radial-gradient"
      >
        <div className="max-w-4xl mx-auto space-y-8 z-10">
          
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(173,198,255,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              High-Fidelity Cyber-Library & Bookstore
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The Pulse of <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(173,198,255,0.3)]">Modern Academia.</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Access and list high-fidelity study materials curated by top-performing students and verified professionals. From engineering algorithms to clinical case sheets and eBooks.
          </motion.p>

          {/* Large Hero Google Sign In Call to Action */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={signInWithGoogle}
                className="bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 border border-white/50 mx-auto transition-all"
                style={{
                  boxShadow: '0 10px 30px rgba(255,255,255,0.05), 0 0 0 1px rgba(255,255,255,0.5)'
                }}
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google Account
              </motion.button>
            </motion.div>
          )}

          {/* Search Engine Input Bar */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl mx-auto group"
          >
            <div className="relative p-[1px] rounded-full overflow-hidden transition-all duration-500 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:shadow-[0_0_30px_rgba(173,198,255,0.35)]">
              <div className="flex items-center bg-[#191b23] rounded-full px-6 py-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-white placeholder:text-gray-500 text-sm px-4 font-semibold" 
                  placeholder="Search organic chemistry mechanisms, B.Tech codex, MBBS blueprints..." 
                  type="text"
                />
                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-gray-500">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </motion.form>

          {/* Trending Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 items-center text-xs pt-2"
          >
            <span className="text-gray-500 font-bold uppercase tracking-wider">Trending:</span>
            <button onClick={() => setSearchQuery('Fluid Dynamics')} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 transition-colors">Fluid Dynamics</button>
            <button onClick={() => setSearchQuery('Pharmacology')} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-pink-500/50 transition-colors">Pathology Mnemonics</button>
            <button onClick={() => setSearchQuery('GATE')} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors">GATE 2026</button>
          </motion.div>

        </div>
      </section>

      {/* Domain Hubs (Stream Selector Cards) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Explore Domain Hubs
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Monetized and community-verified files categorized cleanly by discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Engineering */}
          <Link to="/notes-library/btech" className="group block h-[400px]">
            <motion.div 
              whileHover={{ y: -6 }}
              className="relative h-full overflow-hidden bg-[#10131a] rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_rgba(173,198,255,0.08)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent z-0" />
              <img 
                alt="Engineering Hub" 
                className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-25 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 pointer-events-none rounded-l-[3rem]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO8cN6AFylTHCKcnuLLmWWTHAGD1cUS--BF9mF5lmZLG9o8wnvifphHCPyS5AgeF0MgE6Uo5KSsCcMo7L8_2aYF0I9uHHMG09ga_Co4Izab1Scew0kt5oagzEvqAIa1wtQJYzDD88VXRWPKabnLE3cvjoIzS77hK5ypfBC5Qnq_uSC9TwhhZ04NfSZnh7Pm85zMD_TeD411NaMiQp5NgJViE8MuVwJ4WyFZNUhBKU5I-xdFRo-h9bjaFVQC1IJ8N4vdTA3gONdia9h"
              />
              <div className="relative z-10 flex justify-between items-start">
                <span className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <Layers className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  B.Tech
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-2 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Engineering Store
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  Calculus to Machine Learning: Premium study guides and test codes for modern engineering tracks.
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs group-hover:gap-4 transition-all">
                  <span>Enter Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Medical */}
          <Link to="/notes-library/bpharma" className="group block h-[400px]">
            <motion.div 
              whileHover={{ y: -6 }}
              className="relative h-full overflow-hidden bg-[#10131a] rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-pink-500/30 transition-all hover:shadow-[0_0_30px_rgba(255,176,205,0.08)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent z-0" />
              <img 
                alt="Medical Hub" 
                className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-25 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 pointer-events-none rounded-l-[3rem]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGGinlXeKSJkipfvYOgxlb1LPBrpzgYscUGPKgOHCuInsUuGQl7s3kKB8yolJJEwOofqdcf-PTKt3Mvwx735Nwid84h1NXvia_2meZred0PZ_kOcbrmMCJkh-387gHNPTmCCE6ea3oRqIvU8QWs_HfsQ8QRS_FT0C_HASWX8L9VY25PTc4xX5CWAOY-39Gjzxx7CyvRxM1aGC9DAeuBRy80EmsXljlSBaEBh9z5omzfRmUgK7w1Ip0JtfHOk_YIBRC1IOnqKGFRqP-"
              />
              <div className="relative z-10 flex justify-between items-start">
                <span className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400">
                  <Stethoscope className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  MBBS / BDS
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-2 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Medical E-Store
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  Visual anatomy atlas guides, pathology flashcards, diagnostics files, and clinical keys.
                </p>
                <div className="flex items-center gap-2 text-pink-400 font-bold text-xs group-hover:gap-4 transition-all">
                  <span>Enter Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Competitive Exams */}
          <Link to="/notes-library/jeeneet" className="group block h-[400px]">
            <motion.div 
              whileHover={{ y: -6 }}
              className="relative h-full overflow-hidden bg-[#10131a] rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-purple-500/30 transition-all hover:shadow-[0_0_30px_rgba(208,188,255,0.08)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent z-0" />
              <img 
                alt="Competitive Hub" 
                className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-25 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 pointer-events-none rounded-l-[3rem]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsbd5awmCqvVggyFbS3aJYgt6jWjPfrAPXWCRkWRnPb7dC7qZOUhi_4UH8qup6drwb3PJGnJAEXtcpGx80mbHgPNGnGjrVpi40ToI7XvFglrKKSXyFUgo3-8Cn1udnxFDieB45Tc-7OrExoor-rtBVmB9MHvZrRHnFoeS4Um5vsjIfTB_nbb1imuxzByyKxuIDbCDYidLSt7brBban2uNfI9ExrS5tx0maEnsrXmpCW0MwOs_LviYFzPQBAVQURgTeXelsj8UraNZR"
              />
              <div className="relative z-10 flex justify-between items-start">
                <span className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                  <Award className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  JEE / NEET
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-2 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Competitive Prep
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  Formula boards, organic mechanism maps, solved question sets, and strategy cheat sheets.
                </p>
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs group-hover:gap-4 transition-all">
                  <span>Enter Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Reference Books */}
          <Link to="/notes-library/bpharma" className="group block h-[400px]">
            <motion.div 
              whileHover={{ y: -6 }}
              className="relative h-full overflow-hidden bg-[#10131a] rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-emerald-500/30 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent z-0" />
              <img 
                alt="Reference Hub" 
                className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-25 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 pointer-events-none rounded-l-[3rem]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-bA567IEoQBtRwewgKabudbUuXba-63EkSsoD4DcI3JKRmGWrnTTRCVTDwagbWgAbuP9oa-MfoEwAUy1tDiWWz-WiXIB7oavOljcJYjyJek0W5pzWfnaBdEmltsyvXGB2RBF9dQDZByAghPfdxvldYeRteUwKfUqRYxiEtTkA7IEgfyuY1bgAjqTaOmXAG-zI8K6LfGzEnZ69vZICeld2XU99ynFkFAhVLZyw0uEZI1zqyZyFUrerhJioNFZ0NHAgpPdPosJH8emO"
              />
              <div className="relative z-10 flex justify-between items-start">
                <span className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-6 h-6" />
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  B.Pharma / Global
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-2 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Reference Library
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  Curriculum textbooks aligned with PCI specifications, chemistry manuals, and guides.
                </p>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs group-hover:gap-4 transition-all">
                  <span>Enter Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          </Link>

        </div>
      </section>

      {/* Bento Grid Stats / Contributor Networks */}
      <section className="py-24 border-y border-white/5 bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Elite Contributors Network
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Join the top academic authors. Upload your handwritten notes or custom textbooks, set a custom price tag, and sell directly to students globally with instant payouts!
              </p>
            </div>
            <Link to="/upload">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 inline-flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                Become a Seller
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Dr Arjun Profile */}
            <div className="bg-[#10131a]/60 border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                  <img 
                    alt="Top Contributor" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTTk5yw3YlHrPnJURYjHrVLhd3dwCfOX1MwvBtrhwbBZ3BxDdAc38u1uavAJdIIT6Mo9QZQOJg22tOGvrAcGXJ6PkaJCxqqS5fMvQZD7fv0XOIJRcs36wEqX9yCWdm9YGkCoD8T3_hHq31x294sqY666DEPWuORaKt5LRXySffvC14i5mOvqwE8RPGGgDfygQ6WBlFLpPOYgcu8Z2OeuKdvwgrSVB5vDC_L7On-oGimqZlJ-su41TaMQF7SWZztb4Ue7hwPpbpMn3T"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white leading-none">Dr. Arjun V.</h4>
                  <p className="text-xs text-blue-400 font-bold mt-1.5">Platinum Seller · Medical</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-blue-400 font-bold text-lg leading-none">₹1.2M</p>
                  <p className="text-[9px] text-gray-500 uppercase font-extrabold tracking-wider mt-1">Earnings</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-white font-bold text-lg leading-none">4.2k</p>
                  <p className="text-[9px] text-gray-500 uppercase font-extrabold tracking-wider mt-1">Books</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
                  <div className="flex items-center justify-center text-yellow-400 gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span className="font-bold text-sm">4.9</span>
                  </div>
                  <p className="text-[9px] text-gray-500 uppercase font-extrabold tracking-wider mt-1">Rating</p>
                </div>
              </div>
            </div>

            {/* Marketplace metrics */}
            <div className="bg-[#10131a]/60 border border-white/10 p-8 rounded-3xl flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 block">Live Marketplace Stats</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-blue-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>85k+</span>
                <span className="text-gray-400 text-sm">Materials Listed</span>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>12% growth this month</span>
              </div>
            </div>

            {/* Secure payouts */}
            <div className="bg-[#10131a]/60 border border-white/10 p-8 rounded-3xl flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 block">Total Seller Payouts</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-pink-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹4.8Cr</span>
                <span className="text-gray-400 text-sm">Disbursed</span>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant payouts powered by Cashfree</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Featured / Trending Materials Cards */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Trending E-Books & Handouts
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Explore bestsellers highly valued by high-scoring academic cohorts.
            </p>
          </div>
          <Link to="/notes-library/bpharma" className="text-blue-400 text-xs font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {trendingMaterials.map((material, i) => (
            <div 
              key={i}
              onClick={() => navigate(material.link)}
              className="group cursor-pointer flex flex-col justify-between h-full"
            >
              <div>
                <div className={`aspect-[3/4] rounded-2xl overflow-hidden border bg-[#161B22] relative transition-all duration-300 transform group-hover:scale-[1.02] ${material.colorClass}`}>
                  <img 
                    alt={material.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 pointer-events-none" 
                    src={material.img}
                  />
                  {i === 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-md">
                      BESTSELLER
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors leading-snug">
                    {material.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {material.category} · {material.pages} Pages
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 mt-auto">
                <span className="font-extrabold text-sm text-white">₹{material.price}</span>
                <div className="flex items-center text-[10px] text-yellow-400 font-bold gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span>{material.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Premium Lifetime Upgrade CTA Banner */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-blue-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-pulse-slow"
        >
          {/* Top highlight badge */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 bg-blue-600 text-white px-8 py-2.5 rounded-b-3xl font-bold uppercase text-[9px] tracking-widest shadow-md">
            RECOMMENDED FOR GPAT, JEE & NEET COHORTS
          </div>

          <div className="max-w-2xl mx-auto flex flex-col items-center pt-4">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Unlock All Premium Resources
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed max-w-xl">
              Get lifetime access to the entire multi-disciplinary study library containing all B.Tech branches, B.Pharma semesters, and JEE/NEET handwritten modules.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <div className="text-left">
                <span className="text-[10px] text-gray-500 line-through block font-bold">REGULAR PRICE: ₹1,499</span>
                <span className="text-4xl md:text-5xl font-black text-blue-400">₹499 <span className="text-xs text-gray-400 font-medium">/ Lifetime</span></span>
              </div>
              <div className="h-[2px] w-12 sm:h-12 sm:w-[2px] bg-white/10" />
              <ul className="text-left space-y-2">
                {[
                  '100% Secure Checkout via Cashfree',
                  'Unlimited Premium eBook Downloads',
                  'Access both Pharmacy & Engineering/Medical Hubs',
                  'Zero Subscription Fees'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {userProfile?.is_premium ? (
              <div className="px-8 py-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Active Premium Access (Lifetime Pro)
              </div>
            ) : (
              <Link to="/premium">
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                >
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  Upgrade to Pro Now
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Community Channels / Footer promos */}
      <section className="py-16 px-6 border-t border-white/5 bg-[#161B22]/10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl mb-16">
        <div>
          <h3 className="text-2xl font-extrabold text-white mb-2">Join the Academic Circle</h3>
          <p className="text-gray-400 text-sm">Get live job alerts, competitive mock keys, syllabus catalogs, and peer support on Telegram.</p>
        </div>
        <a
          href="https://t.me/your_channel"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 hover:bg-blue-500 hover:text-white font-bold flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
        >
          <Sparkles className="w-5 h-5" />
          Join Telegram Channel
        </a>
      </section>

    </div>
  );
}
