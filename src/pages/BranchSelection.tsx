import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { branchNames } from '../data/courses';

export default function BranchSelection() {
  const branches = [
    { key: 'common_first_year', icon: '📘', color: 'from-blue-600 to-blue-700' },
    { key: 'cse', icon: '💻', color: 'from-purple-600 to-purple-700' },
    { key: 'it', icon: '🖥️', color: 'from-indigo-600 to-indigo-700' },
    { key: 'mechanical', icon: '⚙️', color: 'from-orange-600 to-orange-700' },
    { key: 'civil', icon: '🏗️', color: 'from-yellow-600 to-yellow-700' },
    { key: 'ece', icon: '📡', color: 'from-pink-600 to-pink-700' },
    { key: 'electrical', icon: '⚡', color: 'from-red-600 to-red-700' },
    { key: 'data_science', icon: '📊', color: 'from-teal-600 to-teal-700' },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/notes-library" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Streams
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">🎓 BTech Branches</h1>
          <p className="text-gray-400 text-lg">Select your branch</p>
        </motion.div>

        {/* Branch Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {branches.map((branch, index) => (
            <Link key={branch.key} to={`/notes-library/btech/${branch.key}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${branch.color} rounded-2xl p-6 cursor-pointer group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                
                <div className="text-4xl mb-3">{branch.icon}</div>
                <h3 className="text-xl font-bold mb-2">{branchNames[branch.key as keyof typeof branchNames]}</h3>
                
                <div className="flex items-center gap-2 text-sm font-semibold mt-4">
                  View Subjects
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
