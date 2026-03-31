import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValue, useMotionValueEvent, useTransform, MotionValue } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FileText, Download, ExternalLink, GraduationCap, Crown, ChevronDown } from 'lucide-react';
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
  {
    id: 'fallback-1',
    title: 'Chapter 2, Unit 2, Human Anatomy and Physiology 1',
    category: 'bpharma',
    university: 'DBATU',
    branch: 'General',
    downloads: 0,
    isPremium: false,
  },
  {
    id: 'fallback-2',
    title: 'Chapter 2, Unit 1, Human Anatomy and Physiology 1',
    category: 'bpharma',
    university: 'DBATU',
    branch: 'General',
    downloads: 0,
    isPremium: false,
  },
  {
    id: 'fallback-3',
    title: 'Chapter 1, Unit 2, Human Anatomy and Physiology 1',
    category: 'bpharma',
    university: 'DBATU',
    branch: 'General',
    downloads: 0,
    isPremium: false,
  },
  {
    id: 'fallback-4',
    title: 'Chapter 1, Unit 1, Human Anatomy and Physiology 1',
    category: 'bpharma',
    university: 'DBATU',
    branch: 'General',
    downloads: 0,
    isPremium: false,
  },
];

const CARD_PALETTES = [
  { border: 'border-[#3B82F6]/40', icon: 'from-[#3B31B8]/30 to-[#3B82F6]/30', iconColor: 'text-[#60A5FA]', tag: 'bg-[#3B31B8]/20 text-[#818CF8] border-[#3B31B8]/30', btn: 'bg-[#3B31B8] hover:bg-[#4a3fd4]' },
  { border: 'border-purple-500/40', icon: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400', tag: 'bg-purple-500/10 text-purple-300 border-purple-500/20', btn: 'bg-purple-600 hover:bg-purple-500' },
  { border: 'border-cyan-500/40', icon: 'from-cyan-500/20 to-blue-500/20', iconColor: 'text-cyan-400', tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', btn: 'bg-cyan-700 hover:bg-cyan-600' },
  { border: 'border-emerald-500/40', icon: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', btn: 'bg-emerald-700 hover:bg-emerald-600' },
  { border: 'border-orange-500/40', icon: 'from-orange-500/20 to-red-500/20', iconColor: 'text-orange-400', tag: 'bg-orange-500/10 text-orange-300 border-orange-500/20', btn: 'bg-orange-700 hover:bg-orange-600' },
];

// --- Transform helpers (pure functions, no hooks) ---
function getCardY(progress: number, i: number, n: number): number {
  const float = progress * n;
  const exit = Math.floor(float);
  const frac = Math.min(float - exit, 1);
  if (i < exit) return -900;
  if (i === exit) {
    const eased = frac * frac * frac;
    return eased * -800;
  }
  const pos = i - exit;
  return pos * 26 - frac * 26;
}
function getCardScale(progress: number, i: number, n: number): number {
  const float = progress * n;
  const exit = Math.floor(float);
  const frac = Math.min(float - exit, 1);
  if (i < exit) return 0.7;
  if (i === exit) return 1 - frac * 0.06;
  const pos = i - exit;
  const base = 1 - pos * 0.07;
  const next = 1 - (pos - 1) * 0.07;
  return Math.max(0.72, base + frac * (next - base));
}
function getCardOpacity(progress: number, i: number, n: number): number {
  const float = progress * n;
  const exit = Math.floor(float);
  const frac = Math.min(float - exit, 1);
  if (i < exit) return 0;
  if (i === exit) return Math.max(0, 1 - frac * 1.6);
  const pos = i - exit;
  const base = 1 - pos * 0.2;
  const next = 1 - (pos - 1) * 0.2;
  return Math.max(0.25, base + frac * (next - base));
}

// Individual card — derives transforms from shared scrollProgress MotionValue
function NoteStackCard({
  note, index, total, scrollProgress,
}: {
  note: Note;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const y = useTransform(scrollProgress, (p: number) => getCardY(p, index, total));
  const scale = useTransform(scrollProgress, (p: number) => getCardScale(p, index, total));
  const opacity = useTransform(scrollProgress, (p: number) => getCardOpacity(p, index, total));

  const isNotePremium = note.isPremium || (note.price && note.price > 0);
  const zIndex = total - index;
  const pal = CARD_PALETTES[index % CARD_PALETTES.length];

  return (
    <motion.div
      data-testid={`stack-card-${index}`}
      style={{
        y,
        scale,
        opacity,
        zIndex,
        position: 'absolute',
        left: 'calc(50% - 170px)',
        top: 0,
        width: '340px',
      }}
    >
      <div
        className={`bg-[#0D1B2A] border ${pal.border} rounded-2xl p-6`}
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${pal.icon} rounded-xl flex items-center justify-center`}>
            <FileText className={`w-6 h-6 ${pal.iconColor}`} />
          </div>
          {isNotePremium ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
              <Crown className="w-3 h-3" />
              Premium
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
              FREE
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 leading-snug" style={{ minHeight: '3.5rem' }}>
          {note.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(note.category || note.subject) && (
            <span className={`flex items-center gap-1 px-2.5 py-1 ${pal.tag} text-xs font-semibold rounded-lg border`}>
              <GraduationCap className="w-3 h-3" />
              {note.category || note.subject}
            </span>
          )}
          {note.university && (
            <span className="px-2.5 py-1 bg-white/5 text-gray-400 text-xs font-semibold rounded-lg border border-white/10">
              {note.university}
            </span>
          )}
          {note.branch && (
            <span className="px-2.5 py-1 bg-white/5 text-gray-400 text-xs font-semibold rounded-lg border border-white/10">
              {note.branch}
            </span>
          )}
          {note.semester && (
            <span className="px-2.5 py-1 bg-white/5 text-gray-400 text-xs font-semibold rounded-lg border border-white/10">
              {note.semester}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
          <Download className="w-3.5 h-3.5" />
          <span>{note.downloads || 0} downloads</span>
          {note.averageRating ? (
            <span className="ml-3 text-yellow-400 font-medium">★ {note.averageRating.toFixed(1)}</span>
          ) : null}
        </div>

        {/* CTA */}
        <Link to="/notes-library" tabIndex={-1}>
          <button
            data-testid={`stack-card-cta-${index}`}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${pal.btn} text-white font-semibold rounded-xl text-sm transition-colors duration-200`}
          >
            <ExternalLink className="w-4 h-4" />
            Access File
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// Inner component — always mounted, uses getBoundingClientRect on every scroll
function StackedNotesSectionInner({ notes }: { notes: Note[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const n = notes.length;

  // Direct MotionValue for scroll progress (0→1 through this section)
  const scrollProgress = useMotionValue(0);

  const { scrollY } = useScroll();

  // Recompute progress on every scroll tick using live getBoundingClientRect
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sectionHeight = containerRef.current.offsetHeight;
    const viewportH = window.innerHeight;
    const scrollableRange = sectionHeight - viewportH;

    if (rect.top > 0) {
      // Section hasn't reached viewport top yet
      scrollProgress.set(0);
    } else if (rect.bottom <= viewportH) {
      // Section has fully passed the viewport
      scrollProgress.set(1);
    } else {
      // Sticky active — progress = how far we've scrolled into the section
      const progress = Math.max(0, Math.min(1, -rect.top / scrollableRange));
      scrollProgress.set(progress);
    }
  });

  // Also set initial value on mount (in case user loaded mid-page)
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sectionHeight = containerRef.current.offsetHeight;
    const viewportH = window.innerHeight;
    const range = sectionHeight - viewportH;
    if (rect.top <= 0 && rect.bottom > viewportH) {
      scrollProgress.set(Math.max(0, Math.min(1, -rect.top / range)));
    }
  }, []);

  return (
    <section
      ref={containerRef}
      data-testid="stacked-notes-section"
      style={{ height: `${100 + n * 90}vh` }}
      className="relative bg-[#0D1117]"
    >
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center px-4"
        style={{ overflow: 'visible' }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,49,184,0.12) 0%, transparent 70%)' }}
          />
        </div>

        {/* Heading — always visible (no whileInView inside sticky) */}
        <div className="text-center mb-10 z-50 relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#0EA5E9' }}>
            Top Course Notes
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Scroll to Explore
          </h2>
          <p className="text-gray-400 text-base">
            {n} curated notes — scroll down to browse each one
          </p>
        </div>

        {/* Card stack */}
        <div
          data-testid="card-stack-container"
          className="relative w-full z-10"
          style={{ height: '440px' }}
        >
          {notes.map((note, i) => (
            <NoteStackCard
              key={note.id}
              note={note}
              index={i}
              total={n}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-8 flex flex-col items-center gap-1 text-gray-500 text-sm z-50 relative"
        >
          <ChevronDown className="w-5 h-5" />
          <span>Scroll to see next note</span>
        </motion.div>
      </div>
    </section>
  );
}

// Outer wrapper — data fetching only
export default function StackedNotesSection() {
  const [notes, setNotes] = useState<Note[]>(FALLBACK_NOTES);

  useEffect(() => {
    let cancelled = false;
    async function fetchNotes() {
      try {
        const snapshot = await getDocs(collection(db, 'notes'));
        if (cancelled) return;
        const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Note[];
        const filtered = all
          .filter(n => n.status === 'approved' || n.status === 'published' || !n.status)
          .slice(0, 5);
        if (!cancelled && filtered.length >= 2) setNotes(filtered);
      } catch {
        // keep fallback
      }
    }
    fetchNotes();
    return () => { cancelled = true; };
  }, []);

  return <StackedNotesSectionInner notes={notes} />;
}
