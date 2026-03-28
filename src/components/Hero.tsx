import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-8">
            <Zap className="h-4 w-4" />
            AI-Powered Learning for B.Pharma
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
            Master Pharmacy with <br />
            <span className="text-blue-600">Smart Study Notes</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Access high-quality B.Pharma notes, generate AI summaries, and practice with MCQs. Everything you need to ace your exams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/notes" 
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
            >
              Browse Notes
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/summarizer" 
              className="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              Try AI Summarizer
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
