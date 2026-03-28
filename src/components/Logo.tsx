import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100 
        }}
        className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <BookOpen className="h-6 w-6 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col"
      >
        <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">
          Pharma<span className="text-blue-600">Notes</span>
        </span>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mt-0.5"
        >
          Digital Library
        </motion.span>
      </motion.div>
    </div>
  );
}
