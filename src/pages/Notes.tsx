import NoteList from '../components/NoteList';
import { motion } from 'motion/react';

export default function Notes() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full font-label text-[10px] font-bold uppercase tracking-widest mb-6">
            Knowledge Marketplace
          </div>
          <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-4">
            Study Notes <span className="text-primary">Repository</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-body max-w-2xl leading-relaxed">
            Access high-performance study materials precision-engineered by the NotesDrive community.
          </p>
        </motion.div>
        
        <NoteList />
      </div>
    </div>
  );
}
