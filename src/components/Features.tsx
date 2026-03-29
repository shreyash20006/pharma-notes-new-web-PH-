import React from 'react';
import { ShieldCheck, Zap, Globe, HardDrive, Cpu, Database } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    name: 'Archival Integrity',
    description: 'High-resolution document scanning and archival-grade storage for long-term knowledge preservation.',
    icon: Database,
  },
  {
    name: 'Precision Search',
    description: 'Advanced metadata indexing allows for sub-second retrieval of specific course materials.',
    icon: HardDrive,
  },
  {
    name: 'Global Repository',
    description: 'Access a worldwide network of student-contributed knowledge across all major disciplines.',
    icon: Globe,
  },
  {
    name: 'Verified Accuracy',
    description: 'Community-driven verification systems ensure the highest quality of contributed materials.',
    icon: ShieldCheck,
  },
  {
    name: 'High Performance',
    description: 'Optimized interface designed for rapid navigation and efficient study sessions.',
    icon: Zap,
  },
  {
    name: 'Neural Processing',
    description: 'AI-enhanced document analysis for automated summarization and key concept extraction.',
    icon: Cpu,
  },
];

export default function Features() {
  return (
    <div className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-sm font-label font-bold text-primary uppercase tracking-widest mb-4">Core Capabilities</h2>
          <p className="text-5xl font-headline font-extrabold text-on-surface tracking-tight">
            Precision Systems for <span className="text-primary">Knowledge Management</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-surface-container-low rounded-3xl border border-outline-variant hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-3">{feature.name}</h3>
              <p className="text-on-surface-variant font-body text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
