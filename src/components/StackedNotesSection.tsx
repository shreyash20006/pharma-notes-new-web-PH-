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
  { id: 'f1', title: 'Chapter 2, Unit 2 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
  { id: 'f2', title: 'Chapter 2, Unit 1 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
  { id: 'f3', title: 'Chapter 1, Unit 2 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
  { id: 'f4', title: 'Chapter 1, Unit 1 — Human Anatomy and Physiology 1', category: 'bpharma', university: 'DBATU', branch: 'General', downloads: 0 },
];

const PALETTES = [
  { bg: 'bg-[#0D1B2A]', border: 'border-[#3B82F6]/40', icon: 'from-[#3B31B8]/30 to-[#3B82F6]/30', iconColor: 'text-[#60A5FA]', tag: 'bg-[#3B31B8]/20 text-[#818CF8] border-[#3B31B8]/30', btn: 'bg-[#3B31B8] hover:bg-[#4a3fd4]', accent: '#3B82F6' },
  { bg: 'bg-[#120A1F]', border: 'border-purple-500/40', icon: 'from-purple-600/25 to-pink-600/25', iconColor: 'text-purple-400', tag: 'bg-purple-500/10 text-purple-300 border-purple-500/20', btn: 'bg-purple-700 hover:bg-purple-600', accent: '#A855F7' },
  { bg: 'bg-[#031A1A]', border: 'border-cyan-500/40', icon: 'from-cyan-600/25 to-teal-600/25', iconColor: 'text-cyan-400', tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', btn: 'bg-cyan-800 hover:bg-cyan-700', accent: '#06B6D4' },
  { bg: 'bg-[#0F1A0A]', border: 'border-emerald-500/40', icon: 'from-emerald-600/25 to-green-600/25', iconColor: 'text-emerald-400', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', btn: 'bg-emerald-800 hover:bg-emerald-700', accent: '#10B981' },
];

/* ─── Stacking math ─────────────────────────────────────────────────────────
   float = 1 + progress * (n − 1)
   • float = 1  →  card 0 already visible, alone at top
   • float = 2  →  card 1 fully entered, sitting on top of card 0
   • float = n  →  all n cards stacked

   For card i:
   • ep     = clamp(0,1, float − i)       — entry progress (smoothstepped)
   • depth  = clamp(0, n−1−i, float−i−1) — how many cards are on top of i
───────────────────────────────────────────────────────────────────────────── */
const STACK_Y = 20;       // px per depth level
const STACK_SCALE = 0.05; // scale step per depth
const STACK_DIM = 0.13;   // opacity reduction per depth

function smooth(t: number) { return t * t * (3 - 2 * t); }

function stackCard(float: number, i: number, n: number) {
  const ep = Math.max(0, Math.min(1, float - i));
  const es = smooth(ep);
  if (es === 0) return { y: -90, scale: 0.92, opacity: 0 };

  const rawDepth = Math.max(0, float - i - 1);
  const depth    = Math.min(n - 1 - i, rawDepth);

  return {
    y:       (1 - es) * -70 + depth * STACK_Y,
    scale:   Math.max(0.78, 1 - depth * STACK_SCALE),
    opacity: Math.max(0.18, es - depth * STACK_DIM),
  };
}

/* ─── Single card component ──────────────────────────────────────────────── */
function NoteCard({
  note, idx, n, scrollProgress,
}: {
  note: Note; idx: number; n: number; scrollProgress: MotionValue<number>;
}) {
  const y       = useTransform(scrollProgress, p => stackCard(1 + p * (n - 1), idx, n).y);
  const scale   = useTransform(scrollProgress, p => stackCard(1 + p * (n - 1), idx, n).scale);
  const opacity = useTransform(scrollProgress, p => stackCard(1 + p * (n - 1), idx, n).opacity);

  const pal = PALETTES[idx % PALETTES.length];
  const isPremium = note.isPremium || (note.price && note.price > 0);

  return (
    <motion.div
      data-testid={`stack-card-${idx}`}
      style={{
        y, scale, opacity,
        zIndex: idx + 1,
        position: 'absolute',
        left: 'calc(50% - 170px)',
        top: 0,
        width: 340,
      }}
    >
      <div
        className={`${pal.bg} border ${pal.border} rounded-2xl p-6`}
        style={{ boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)` }}
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
        <h3 className="text-white font-bold text-[1.05rem] leading-snug mb-3 line-clamp-2" style={{ minHeight: '3rem' }}>
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
          {note.branch    && <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-lg border border-white/10">{note.branch}</span>}
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
            data-testid={`stack-card-cta-${idx}`}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${pal.btn} text-white font-semibold rounded-xl text-sm transition-colors duration-200`}
          >
            <ExternalLink className="w-4 h-4" /> Access File
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Progress dots ──────────────────────────────────────────────────────── */
function ProgressDots({ n, scrollProgress }: { n: number; scrollProgress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollProgress, 'change', p => {
    const float = 1 + p * (n - 1);
    setActive(Math.min(n - 1, Math.max(0, Math.floor(float) - (float % 1 < 0.5 ? 1 : 0))));
  });
  return (
    <div className="flex items-center gap-2 z-50 relative mt-6">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === active ? 20 : 6,
            height: 6,
            background: i === active ? PALETTES[i % PALETTES.length].accent : 'rgba(255,255,255,0.2)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Inner component (always mounted so ref is hydrated) ────────────────── */
function StackedNotesSectionInner({ notes }: { notes: Note[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const n = notes.length;

  const scrollProgress = useMotionValue(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', () => {
    if (!containerRef.current) return;
    const rect   = containerRef.current.getBoundingClientRect();
    const height = containerRef.current.offsetHeight;
    const vh     = window.innerHeight;
    const range  = height - vh;
    if (range <= 0) return;

    if (rect.top > 0) { scrollProgress.set(0); return; }
    if (rect.bottom <= vh) { scrollProgress.set(1); return; }
    scrollProgress.set(Math.max(0, Math.min(1, -rect.top / range)));
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect  = containerRef.current.getBoundingClientRect();
    const range = containerRef.current.offsetHeight - window.innerHeight;
    if (range > 0 && rect.top <= 0 && rect.bottom > window.innerHeight) {
      scrollProgress.set(Math.max(0, Math.min(1, -rect.top / range)));
    }
  }, []);

  return (
    <section
      ref={containerRef}
      data-testid="stacked-notes-section"
      /* Each card gets ~80vh of scroll space, plus 100vh for the sticky view */
      style={{ height: `${100 + n * 80}vh` }}
      className="relative bg-[#0D1117]"
    >
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center px-4"
        style={{ overflow: 'visible' }}
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,49,184,0.10) 0%, transparent 70%)' }}
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-8 z-50 relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] mb-2" style={{ color: '#0EA5E9' }}>
            Top Course Notes
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Scroll to Stack
          </h2>
          <p className="text-gray-400 text-sm">
            {n} notes — scroll down to add each card to the stack
          </p>
        </div>

        {/* Card stack */}
        <div
          data-testid="card-stack-container"
          className="relative w-full z-10"
          style={{ height: 420 }}
        >
          {notes.map((note, i) => (
            <NoteCard
              key={note.id}
              note={note}
              idx={i}
              n={n}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>

        {/* Progress dots */}
        <ProgressDots n={n} scrollProgress={scrollProgress} />

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-4 flex flex-col items-center gap-1 text-gray-600 text-xs z-50 relative"
        >
          <ChevronDown className="w-4 h-4" />
          <span>Scroll down to stack · Scroll up to unstack</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Outer wrapper (data fetching only) ────────────────────────────────── */
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

  return <StackedNotesSectionInner notes={notes} />;
}
