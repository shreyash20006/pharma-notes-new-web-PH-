import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { 
    q: "What is NotesDrive?", 
    a: "NotesDrive is a high-performance knowledge management platform designed for students to archive, share, and discover precision study materials across all academic disciplines." 
  },
  { 
    q: "How do I access premium notes?", 
    a: "Premium notes are available through our 'NotesDrive Pro' subscription, which provides unlimited access to our entire archival repository and advanced AI features." 
  },
  { 
    q: "Can I contribute my own notes?", 
    a: "Yes. Our 'Upload' portal allows you to contribute your own materials. All contributions undergo a verification process to ensure archival quality." 
  },
  { 
    q: "Is my data secure?", 
    a: "Absolutely. We use industry-standard encryption and archival-grade storage systems to ensure your knowledge legacy is preserved and protected." 
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="py-32 bg-surface">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-sm font-label font-bold text-primary uppercase tracking-widest mb-4">Information Center</h2>
          <p className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Frequently Asked Questions</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              className="bg-surface-container-low rounded-3xl border border-outline-variant overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left hover:bg-primary/5 transition-colors"
              >
                <span className="text-lg font-headline font-bold text-on-surface">{faq.q}</span>
                {openIndex === i ? (
                  <Minus className="w-5 h-5 text-primary" />
                ) : (
                  <Plus className="w-5 h-5 text-on-surface-variant" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-8 text-on-surface-variant font-body leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
