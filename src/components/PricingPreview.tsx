import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function PricingPreview() {
  return (
    <div className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-on-surface rounded-[3rem] p-12 md:p-24 text-surface relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                <ShieldCheck className="w-4 h-4" />
                Premium Infrastructure
              </div>
              <h2 className="text-5xl font-headline font-extrabold mb-8 tracking-tight">
                Upgrade to <span className="text-primary italic">NotesDrive Pro</span>
              </h2>
              <p className="text-on-surface-variant text-xl mb-12 leading-relaxed font-body">
                Gain unrestricted access to our high-fidelity archival repository, advanced AI document analysis, and priority retrieval systems.
              </p>
              <ul className="space-y-6 mb-12">
                {[
                  "Unlimited Archival Downloads", 
                  "Exclusive Pro-Tier Repository", 
                  "Neural Document Summarization", 
                  "Priority Technical Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-body font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/premium" 
                className="inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
              >
                View Access Plans
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-surface-container-high/10 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-6 mb-10">
                  <div className="h-16 w-16 rounded-2xl bg-primary/30 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-48 bg-white/20 rounded-full" />
                    <div className="h-3 w-32 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-5 w-full bg-white/20 rounded-full" />
                  <div className="h-5 w-full bg-white/20 rounded-full" />
                  <div className="h-5 w-4/5 bg-white/20 rounded-full" />
                  <div className="h-5 w-full bg-white/20 rounded-full" />
                </div>
                <div className="mt-12 pt-10 border-t border-white/10 flex justify-between items-center">
                  <div className="h-8 w-24 bg-primary/30 rounded-full" />
                  <div className="h-12 w-32 bg-white/10 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
