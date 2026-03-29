import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-surface">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary-container/10 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-container/20 text-primary text-sm font-bold mb-8 border border-primary/10">
            <Zap className="h-4 w-4" />
            The Ultimate Digital Drive for Students
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface tracking-tight mb-8 leading-[1.1]">
            Unlock Your Potential with <br />
            <span className="text-primary">NotesDrive Marketplace</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Access high-quality study notes, generate AI summaries, and practice with MCQs. The most powerful digital drive for your academic success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              to="/notes" 
              className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Browse Notes
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/summarizer" 
              className="w-full sm:w-auto bg-surface-container-lowest text-on-surface border-2 border-outline-variant px-10 py-5 rounded-2xl text-lg font-bold hover:bg-surface-container-low transition-all flex items-center justify-center gap-2"
            >
              Try AI Summarizer
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
