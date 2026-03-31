import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FileText, Download, ExternalLink, GraduationCap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  category?: string;
  subject?: string;
  branch?: string;
  semester?: string;
  university?: string;
  downloads?: number;
  isPremium?: boolean;
  price?: number;
  averageRating?: number;
  status?: string;
}

const FALLBACK_NOTES: Note[] = [
  { id: 'f1', title: 'Chapter 2, Unit 2 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
  { id: 'f2', title: 'Chapter 2, Unit 1 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
  { id: 'f3', title: 'Chapter 1, Unit 2 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
  { id: 'f4', title: 'Chapter 1, Unit 1 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
];

const PALETTES = [
  { bg: 'bg-[#0D1B2A]', border: 'border-[#3B82F6]/60', icon: 'from-[#3B31B8]/30 to-[#3B82F6]/30', iconColor: 'text-[#60A5FA]', tag: 'bg-[#3B31B8]/20 text-[#818CF8] border-[#3B31B8]/30', btn: 'bg-[#3B31B8] hover:bg-[#4a3fd4]', accent: '#3B82F6' },
  { bg: 'bg-[#120A1F]', border: 'border-purple-500/60', icon: 'from-purple-600/25 to-pink-600/25', iconColor: 'text-purple-400', tag: 'bg-purple-500/10 text-purple-300 border-purple-500/20', btn: 'bg-purple-700 hover:bg-purple-600', accent: '#A855F7' },
  { bg: 'bg-[#031A1A]', border: 'border-cyan-500/60', icon: 'from-cyan-600/25 to-teal-600/25', iconColor: 'text-cyan-400', tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', btn: 'bg-cyan-800 hover:bg-cyan-700', accent: '#06B6D4' },
  { bg: 'bg-[#0F1A0A]', border: 'border-emerald-500/60', icon: 'from-emerald-600/25 to-green-600/25', iconColor: 'text-emerald-400', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', btn: 'bg-emerald-800 hover:bg-emerald-700', accent: '#10B981' },
];

export default function StackedNotesSection() {
  const [notes, setNotes] = useState<Note[]>(FALLBACK_NOTES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'notes'));
        if (cancelled) return;
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Note[];
        const filtered = all
          .filter(n => n.status === 'approved' || n.status === 'published' || !n.status)
          .slice(0, 4);
        if (!cancelled && filtered.length >= 2) setNotes(filtered);
      } catch { /* keep fallback */ }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      data-testid="stacked-notes-section"
      className="relative py-24 px-4 bg-[#0D1117]"
    >
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#0EA5E9' }}>
            Top Course Notes
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Featured Notes
          </h2>
        </div>

        {/* Cards grid */}
        <div
          data-testid="card-stack-container"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {notes.map((note, i) => {
            const pal = PALETTES[i % PALETTES.length];
            const isPremium = note.isPremium || (note.price && note.price > 0);

            return (
              <motion.div
                key={note.id}
                data-testid={`stack-card-${i}`}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`${pal.bg} border ${pal.border} rounded-2xl p-6 cursor-default`}
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 bg-gradient-to-br ${pal.icon} rounded-xl flex items-center justify-center`}>
                    <FileText className={`w-5 h-5 ${pal.iconColor}`} />
                  </div>
                  {isPremium ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                      <Crown className="w-3 h-3" /> Premium
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                      FREE
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-base leading-snug mb-3 line-clamp-2" style={{ minHeight: '2.8rem' }}>
                  {note.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(note.category || note.subject) && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 ${pal.tag} text-xs font-semibold rounded-lg border`}>
                      <GraduationCap className="w-3 h-3" />{note.category || note.subject}
                    </span>
                  )}
                  {note.university && <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-lg border border-white/10">{note.university}</span>}
                  {note.branch && <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-lg border border-white/10">{note.branch}</span>}
                  {note.semester && <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-lg border border-white/10">{note.semester} Sem</span>}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                  <Download className="w-3.5 h-3.5" />
                  <span>{note.downloads || 0} downloads</span>
                  {note.averageRating ? <span className="ml-2 text-yellow-400">★ {note.averageRating.toFixed(1)}</span> : null}
                </div>

                {/* CTA */}
                <Link to="/notes-library" tabIndex={-1}>
                  <button
                    data-testid={`stack-card-cta-${i}`}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${pal.btn} text-white font-semibold rounded-xl text-sm transition-colors duration-200`}
                  >
                    <ExternalLink className="w-4 h-4" /> Access File
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12">
          <Link to="/notes-library">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              View All Notes →
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
}
