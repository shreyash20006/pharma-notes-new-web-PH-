import { Brain, Sparkles, Lock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Summarizer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative inline-block mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-4">
            AI <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Summarizer</span>
          </h1>
          
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto">
            Transform lengthy study materials into concise, easy-to-understand summaries powered by advanced AI.
          </p>

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 max-w-xl mx-auto"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
            
            <p className="text-white/60 mb-8">
              We're working on bringing you powerful AI-powered summarization. 
              Stay tuned for updates!
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left bg-white/5 rounded-xl p-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Smart Summaries</h3>
                  <p className="text-white/50 text-sm">Convert long notes into key points</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-left bg-white/5 rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Exam-Ready Format</h3>
                  <p className="text-white/50 text-sm">Bullet points & clear headings</p>
                </div>
              </div>
            </div>

            <Link
              to="/notes"
              className="inline-block mt-8 bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-purple-600 transition-all"
            >
              Browse Notes Instead
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
