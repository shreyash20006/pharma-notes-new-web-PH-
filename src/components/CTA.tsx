import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

export default function CTA() {
  return (
    <div className="py-32 bg-on-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden bg-primary rounded-[3rem] p-12 md:p-24">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-5xl font-headline font-extrabold text-white tracking-tight mb-8">
              Ready to Upgrade Your <span className="text-white/60 italic">Knowledge Infrastructure?</span>
            </h2>
            <p className="text-xl text-white/80 font-body mb-12 leading-relaxed">
              Join thousands of high-performing students who use NotesDrive to manage, share, and preserve their academic legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/notes"
                className="inline-flex items-center justify-center gap-3 bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all active:scale-95"
              >
                Explore Repository
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-3 bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
              >
                <HardDrive className="w-5 h-5" />
                Upload Notes
              </Link>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-black/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
