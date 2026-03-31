// Real Data SubjectsPreview Component - Shows only uploaded/approved notes
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Star, Crown, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export default function RealSubjectsPreview({ selectedStream, setSelectedStream }: any) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedNotes() {
      try {
        const q = query(collection(db, 'notes'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter only approved notes
        const approvedNotes = data.filter(note => 
          note.status === 'approved' || note.status === 'published'
        );
        
        setNotes(approvedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchApprovedNotes();
  }, []);

  // Don't show section at all if no notes exist
  if (!loading && notes.length === 0) {
    return null;
  }

  // Filter notes by stream
  const filteredNotes = notes.filter(note => {
    const cat = (note.category || '').toLowerCase();
    const branch = (note.branch || '').toLowerCase();
    
    if (selectedStream === 'bpharma') {
      return cat.includes('pharma') || cat.includes('bpharma') || branch.includes('pharma');
    } else if (selectedStream === 'btech') {
      return cat.includes('tech') || cat.includes('btech') || 
             branch.includes('cse') || branch.includes('ece') || 
             branch.includes('me') || branch.includes('ee');
    }
    return true;
  }).slice(0, 6);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Browse Notes</h2>
          <p className="text-gray-400 text-lg">Study materials uploaded by students</p>
        </motion.div>

        {/* Tabs */}
        {notes.length > 0 && (
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedStream('bpharma')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                selectedStream === 'bpharma'
                  ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              B.Pharma
            </button>
            <button
              onClick={() => setSelectedStream('btech')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                selectedStream === 'btech'
                  ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              BTech
            </button>
          </div>
        )}

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B31B8]"></div>
            <p className="text-gray-400 mt-4">Loading notes...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="relative bg-[#0D1117] border border-white/10 rounded-2xl p-6 hover:border-[#3B31B8]/50 transition-all group"
                >
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{note.title}</h3>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {note.semester && (
                      <span className="px-3 py-1 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-xs font-bold">
                        {note.semester}
                      </span>
                    )}
                    {note.branch && (
                      <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-xs font-bold">
                        {note.branch}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {note.downloads || 0}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      {note.averageRating ? note.averageRating.toFixed(1) : '0.0'}
                    </span>
                    {note.views !== undefined && (
                      <>
                        <span>•</span>
                        <span>{note.views} views</span>
                      </>
                    )}
                  </div>

                  <Link
                    to="/notes"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all bg-[#3B31B8] hover:bg-[#4d42d4] text-white"
                  >
                    <Download className="w-5 h-5" />
                    View & Download
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredNotes.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-xl font-bold text-lg transition-all shadow-xl"
                >
                  View All Notes
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
