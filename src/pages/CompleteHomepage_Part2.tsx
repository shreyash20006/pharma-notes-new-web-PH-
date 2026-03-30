// Continuation of CompleteHomepage.tsx
// Add these sections after FeaturesGrid

// ============ SUBJECTS PREVIEW ============
function SubjectsPreview({ selectedStream, setSelectedStream }: any) {
  const bpharmaSubjects = [
    { id: 1, title: 'Pharmacology I', semester: 'Sem 3', size: '4.2 MB', downloads: '1.2k', rating: 4.5, isPremium: true },
    { id: 2, title: 'Pharmaceutics II', semester: 'Sem 2', size: '3.8 MB', downloads: '980', rating: 4.3, isPremium: false },
    { id: 3, title: 'Medicinal Chemistry', semester: 'Sem 5', size: '5.1 MB', downloads: '2.1k', rating: 4.7, isPremium: true },
    { id: 4, title: 'Pharmacognosy', semester: 'Sem 4', size: '4.5 MB', downloads: '1.5k', rating: 4.4, isPremium: true },
    { id: 5, title: 'Clinical Pharmacy', semester: 'Sem 7', size: '6.2 MB', downloads: '870', rating: 4.6, isPremium: true },
    { id: 6, title: 'Pharmaceutical Analysis', semester: 'Sem 6', size: '3.9 MB', downloads: '1.1k', rating: 4.5, isPremium: false },
  ];

  const btechSubjects = [
    { id: 7, title: 'Data Structures', semester: 'Sem 3', size: '4.8 MB', downloads: '3.2k', rating: 4.8, isPremium: true },
    { id: 8, title: 'DBMS', semester: 'Sem 5', size: '3.5 MB', downloads: '2.8k', rating: 4.6, isPremium: true },
    { id: 9, title: 'Digital Electronics', semester: 'Sem 3', size: '4.1 MB', downloads: '1.9k', rating: 4.5, isPremium: false },
    { id: 10, title: 'Thermodynamics', semester: 'Sem 4', size: '5.3 MB', downloads: '1.4k', rating: 4.4, isPremium: true },
    { id: 11, title: 'Fluid Mechanics', semester: 'Sem 5', size: '4.7 MB', downloads: '1.1k', rating: 4.3, isPremium: true },
    { id: 12, title: 'Computer Networks', semester: 'Sem 6', size: '3.8 MB', downloads: '2.3k', rating: 4.7, isPremium: false },
  ];

  const subjects = selectedStream === 'bpharma' ? bpharmaSubjects : btechSubjects;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]">
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
            onClick={() => setSelectedStream('bpharma')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              selectedStream === 'bpharma'
                ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            B.Pharma
          </button>
          <button
            onClick={() => setSelectedStream('btech')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              selectedStream === 'btech'
                ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            BTech
          </button>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="relative bg-[#0D1117] border border-white/10 rounded-2xl p-6 hover:border-[#3B31B8]/50 transition-all group"
            >
              {subject.isPremium && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  PRO
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{subject.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-xs font-bold">{subject.semester}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>{subject.size}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {subject.downloads}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  {subject.rating}
                </span>
              </div>

              <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  subject.isPremium
                    ? 'bg-white/5 border border-white/10 text-gray-400'
                    : 'bg-[#3B31B8] hover:bg-[#4d42d4] text-white'
                }`}
              >
                {subject.isPremium ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Pro Only
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ TRENDING NOTES ============
function TrendingNotes() {
  const trending = [
    { subject: 'Pharmacology II', percentage: 89 },
    { subject: 'Data Structures', percentage: 76 },
    { subject: 'Medicinal Chemistry', percentage: 65 },
    { subject: 'DBMS', percentage: 54 },
    { subject: 'Thermodynamics', percentage: 43 },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">🔥 Trending Notes This Week</h2>
        </motion.div>

        <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
          {trending.map((item, index) => (
            <TrendingBar key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingBar({ item, index }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">
          {index + 1}. {item.subject}
        </span>
        <span className="text-[#3B31B8] font-bold">{item.percentage}%</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${item.percentage}%` } : {}}
          transition={{ duration: 1, delay: index * 0.1 }}
          className="h-full bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-full"
        />
      </div>
    </div>
  );
}

// ============ UNIVERSITY STRIP ============
function UniversityStrip() {
  const universities = [
    'RGPV',
    'VTU',
    'Mumbai University',
    'CSVTU',
    'RTU',
    'AKTU',
    'GTU',
    'SPPU',
    'Anna University',
    'MDU',
    'KUK',
    'JNTU',
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Notes for Students from Top Universities</h2>
        </motion.div>

        <div className="relative">
          <motion.div
            className="flex gap-4"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...universities, ...universities, ...universities].map((uni, i) => (
              <div
                key={i}
                className="px-6 py-3 bg-[#0D1117] border border-[#3B31B8]/30 rounded-full text-sm font-semibold whitespace-nowrap"
              >
                {uni}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============ PRICING STRIP ============
function PricingStrip() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Free</div>
            <div className="text-4xl font-bold mb-4">₹0</div>
            <div className="text-sm text-gray-400">Basic access</div>
          </div>

          <div className="relative bg-[#3B31B8]/20 border-2 border-[#3B31B8] rounded-2xl p-6 text-center shadow-xl shadow-[#3B31B8]/30 scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-full text-xs font-bold">
              ⭐ POPULAR
            </div>
            <div className="text-sm text-gray-400 mb-2">Pro</div>
            <div className="text-4xl font-bold mb-1">₹99</div>
            <div className="text-sm text-gray-400">/month</div>
          </div>

          <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Elite</div>
            <div className="text-4xl font-bold mb-1">₹179</div>
            <div className="text-sm text-gray-400">/month</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-center mb-6">
          <div className="text-2xl font-bold mb-2">🎯 Best Value: Elite for ₹249</div>
          <div className="text-white/90">Full 6 Months Access</div>
        </div>

        <div className="text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-[#3B31B8] hover:text-[#4d42d4] font-bold"
          >
            View Full Plans
            <ChevronRight className="w-5 h-5" />
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
      name: 'Priya Sharma',
      college: 'B.Pharma 3rd Year, RGPV Bhopal',
      text: 'Best notes platform for pharma students!',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      college: 'BTech CSE, VTU Bangalore',
      text: 'DSA and DBMS notes saved my semester!',
      rating: 5,
    },
    {
      name: 'Anjali Patel',
      college: 'B.Pharma Final Year, Mumbai University',
      text: 'AI summaries are a game changer for exams.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Loved by Students</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.college}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER WITH PAYMENT METHODS ============
function Footer() {
  const paymentMethods = [
    { name: 'UPI', icon: '🔷' },
    { name: 'RuPay', icon: '💳' },
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'Paytm', icon: '💰' },
    { name: 'PhonePe', icon: '📱' },
    { name: 'GPay', icon: '🔵' },
    { name: 'Razorpay', icon: '⚡' },
  ];

  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Payment Methods */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-bold mb-6">100% Secure Payments via</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, opacity: 1 }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-semibold opacity-80 transition-all"
              >
                <span className="mr-2">{method.icon}</span>
                {method.name}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Lock className="w-4 h-4" />
            <span>256-bit SSL Encrypted • PCI DSS Compliant</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
            <p className="text-gray-400 text-sm mb-4">
              Premium study notes platform for B.Pharma and BTech students across India.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Made for Indian Students</span>
              <span className="text-2xl">🇮🇳</span>
            </div>
          </div>

          <div>
            <div className="font-bold mb-4">Quick Links</div>
            <div className="space-y-2">
              <Link to="/notes-library" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Library
              </Link>
              <Link to="/pricing" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Plans
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <div className="font-bold mb-4">Connect</div>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#3B31B8] border border-white/10 rounded-xl flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#3B31B8] border border-white/10 rounded-xl flex items-center justify-center transition-all">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© 2025 NotesDrive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ============ ANNOUNCEMENT POPUP ============
function AnnouncementPopup({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 10,
  });

  useEffect(() => {
    if (show) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          let { days, hours, minutes, seconds } = prev;
          seconds--;
          if (seconds < 0) {
            seconds = 59;
            minutes--;
          }
          if (minutes < 0) {
            minutes = 59;
            hours--;
          }
          if (hours < 0) {
            hours = 23;
            days--;
          }
          return { days, hours, minutes, seconds };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-[#0A0F1E]/95 backdrop-blur-xl border-2 border-[#3B31B8] rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-[#3B31B8]/30"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Welcome to NotesDrive!</h2>
            <p className="text-xl text-gray-300 mb-6">Get Elite Access for just ₹249 this Exam Season</p>

            {/* Countdown Timer */}
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">Offer ends in</div>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#3B31B8]">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">days</div>
                </div>
                <div className="text-3xl font-bold text-gray-600">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#3B31B8]">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">hours</div>
                </div>
                <div className="text-3xl font-bold text-gray-600">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#3B31B8]">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">min</div>
                </div>
                <div className="text-3xl font-bold text-gray-600">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#3B31B8]">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">sec</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/pricing"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-bold text-lg mb-4 transition-all shadow-xl"
            >
              Grab Semester Pass
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Skip Link */}
            <button onClick={onClose} className="text-sm text-gray-400 hover:text-white transition-colors">
              No thanks, continue free
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Export statement
export { SubjectsPreview, TrendingNotes, UniversityStrip, PricingStrip, Testimonials, Footer, AnnouncementPopup };
