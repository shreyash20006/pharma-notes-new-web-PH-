import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { courses, branchNames } from '../data/courses';

export default function SubjectSelection() {
  const { stream, branch } = useParams<{ stream: string; branch?: string }>();

  // Get subjects based on stream and branch
  const getSubjects = () => {
    if (stream === 'btech' && branch) {
      const branchData = courses.btech[branch as keyof typeof courses.btech];
      if (branchData) {
        return Object.entries(branchData).map(([sem, subjects]) => ({
          semester: sem,
          subjects: subjects as string[]
        }));
      }
    } else if (stream === 'bpharma') {
      return Object.entries(courses.bpharma).map(([sem, subjects]) => ({
        semester: sem,
        subjects: subjects as string[]
      }));
    }
    return [];
  };

  const subjectsBySemester = getSubjects();
  const title = stream === 'btech' && branch 
    ? branchNames[branch as keyof typeof branchNames]
    : 'B.Pharma';

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to={stream === 'btech' ? '/notes-library/btech' : '/notes-library'} 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">📚 {title}</h1>
          <p className="text-gray-400 text-lg">Select a subject to view notes</p>
        </motion.div>

        {/* Subjects by Semester */}
        <div className="space-y-8">
          {subjectsBySemester.map(({ semester, subjects }) => (
            <div key={semester}>
              <h2 className="text-2xl font-bold mb-4 capitalize flex items-center gap-3">
                <span className="w-10 h-10 bg-[#3B31B8] rounded-lg flex items-center justify-center text-sm">
                  {semester.replace('sem', '')}
                </span>
                {semester.replace('sem', 'Semester ')}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject, index) => (
                  <Link 
                    key={index}
                    to={`/notes-library/${stream}/${branch || 'subjects'}/${semester}/${encodeURIComponent(subject)}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-[#161B22] border border-white/10 rounded-xl p-5 cursor-pointer group hover:border-[#3B31B8]/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <BookOpen className="w-6 h-6 text-[#3B31B8] mb-2" />
                          <h3 className="font-semibold mb-1 group-hover:text-[#3B31B8] transition-colors">
                            {subject}
                          </h3>
                          <p className="text-xs text-gray-500">Click to view PDFs</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#3B31B8] group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
