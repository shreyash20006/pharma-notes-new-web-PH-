import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';

export default function NotesLibrary() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">📚 Notes Library</h1>
          <p className="text-gray-400 text-lg">Choose your stream to browse notes</p>
        </motion.div>

        {/* Stream Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* BTech Card */}
          <Link to="/notes-library/btech">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-[#3B31B8] to-purple-700 rounded-3xl p-8 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              
              <GraduationCap className="w-16 h-16 mb-4 text-white/90" />
              
              <h2 className="text-3xl font-bold mb-3">BTech</h2>
              <p className="text-white/80 mb-6">
                Engineering notes for CSE, IT, Mechanical, Civil, ECE, EE & more
              </p>
              
              <div className="flex items-center gap-2 text-sm font-semibold">
                Browse Notes
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* B.Pharma Card */}
          <Link to="/notes-library/bpharma">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              
              <BookOpen className="w-16 h-16 mb-4 text-white/90" />
              
              <h2 className="text-3xl font-bold mb-3">B.Pharma</h2>
              <p className="text-white/80 mb-6">
                Pharmaceutical notes for all semesters
              </p>
              
              <div className="flex items-center gap-2 text-sm font-semibold">
                Browse Notes
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
