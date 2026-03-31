import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Download, FileText, BookOpen, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';

interface Note {
  id: string;
  title: string;
  description?: string;
  category?: string;
  branch?: string;
  semester?: string;
  university?: string;
  driveLink?: string;
  fileUrl?: string;
  downloads?: number;
  views?: number;
  isPremium?: boolean;
  status?: string;
  createdAt?: any;
}

export default function BpharmaNotesPage() {
  const { isAuthReady } = useFirebase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSem, setActiveSem] = useState<string>('All');

  useEffect(() => {
    if (!isAuthReady) return;

    async function fetchBpharma() {
      try {
        const snapshot = await getDocs(collection(db, 'notes'));
        const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Note[];
        // Filter bpharma notes — also handle pending status so user sees their own uploads
        const bpharma = all.filter(n => {
          const cat = (n.category || '').toLowerCase();
          const status = n.status || '';
          const notRejected = status !== 'rejected';
          return notRejected && (cat === 'bpharma' || cat === 'b.pharma' || cat === 'b pharma' || cat === 'pharmacy');
        });
        // Sort by semester then title
        bpharma.sort((a, b) => {
          const semA = a.semester || '';
          const semB = b.semester || '';
          if (semA !== semB) return semA.localeCompare(semB);
          return (a.title || '').localeCompare(b.title || '');
        });
        setNotes(bpharma);
      } catch (err) {
        console.error('BpharmaNotesPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBpharma();
  }, [isAuthReady]);

  const semesters = ['All', ...Array.from(new Set(notes.map(n => n.semester || 'General')))];
  const filtered = activeSem === 'All' ? notes : notes.filter(n => (n.semester || 'General') === activeSem);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link to="/notes-library" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Library
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <BookOpen className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">B.Pharma Notes</h1>
          <p className="text-gray-400">{notes.length} notes available</p>
        </motion.div>

        {/* Semester filter tabs */}
        {semesters.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {semesters.map(sem => (
              <button
                key={sem}
                onClick={() => setActiveSem(sem)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeSem === sem
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {sem === 'All' ? 'All Semesters' : `${sem} Sem`}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            <p className="text-gray-400">Loading B.Pharma notes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#161B22] rounded-2xl border border-white/10">
            <FileText className="w-14 h-14 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Notes Yet</h3>
            <p className="text-gray-400 mb-6">Be the first to upload B.Pharma notes!</p>
            <Link to="/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition-all">
              Upload Notes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((note, i) => (
              <motion.div
                key={note.id}
                data-testid={`bpharma-note-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#161B22] border border-white/10 rounded-2xl p-6 hover:border-green-500/40 hover:-translate-y-1 transition-all group"
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-green-500/15 rounded-xl flex items-center justify-center border border-green-500/20">
                    <FileText className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                    FREE
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-base mb-3 line-clamp-2 leading-snug group-hover:text-green-400 transition-colors">
                  {note.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {note.semester && (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-lg border border-green-500/20">
                      {note.semester} Sem
                    </span>
                  )}
                  {note.university && (
                    <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-lg border border-white/10">
                      {note.university}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                  <Download className="w-3.5 h-3.5" />
                  <span>{note.downloads || 0} downloads</span>
                </div>

                {/* CTA */}
                {(note.driveLink || note.fileUrl) ? (
                  <a
                    href={note.driveLink || note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Notes
                  </a>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-gray-400 font-semibold rounded-xl text-sm border border-white/10 cursor-not-allowed">
                    Link Unavailable
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
