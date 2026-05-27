import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  BookOpen, 
  Loader2, 
  Search, 
  Lock, 
  Unlock, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  Eye, 
  HelpCircle,
  Star
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { supabase } from '../lib/supabase';

interface Note {
  id: string;
  title: string;
  description?: string;
  semester: number;
  unit?: number;
  file_url: string;
  file_size_mb?: number;
  file_type?: string;
  thumbnail_url?: string;
  is_premium: boolean;
  download_count: number;
  view_count: number;
  tags?: string[];
  subject_name?: string;
  subject_code?: string;
}

export default function BpharmaNotesPage() {
  const { user, userProfile, isAuthReady } = useFirebase();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSem, setActiveSem] = useState<number | 'All'>('All');
  const [activeUnit, setActiveUnit] = useState<number | 'All'>('All');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync with search params
  useEffect(() => {
    const semParam = searchParams.get('sem');
    if (semParam) {
      const parsed = parseInt(semParam, 10);
      if (parsed >= 1 && parsed <= 8) {
        setActiveSem(parsed);
      }
    }
  }, [searchParams]);

  // Fetch B.Pharma notes from Supabase
  const fetchNotesAndBookmarks = async () => {
    try {
      setLoading(true);
      // Fetch active notes using the custom SQL view notes_with_subject
      const { data, error } = await supabase
        .from('notes_with_subject')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setNotes(data || []);

      // Fetch user bookmarks if authenticated
      if (user) {
        const { data: bData, error: bError } = await supabase
          .from('bookmarks')
          .select('note_id')
          .eq('user_id', user.uid);
        
        if (!bError && bData) {
          setBookmarks(bData.map(b => b.note_id));
        }
      }
    } catch (err) {
      console.error('BpharmaNotesPage fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthReady) return;
    fetchNotesAndBookmarks();
  }, [isAuthReady, user]);

  // Bookmark Toggle logic
  const handleBookmark = async (noteId: string) => {
    if (!user) {
      showToast('Please sign in to bookmark notes.');
      return;
    }

    const isAlreadyBookmarked = bookmarks.includes(noteId);
    try {
      if (isAlreadyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.uid)
          .eq('note_id', noteId);

        if (error) throw error;
        setBookmarks(prev => prev.filter(id => id !== noteId));
        showToast('Bookmark removed.');
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.uid, note_id: noteId });

        if (error) throw error;
        setBookmarks(prev => [...prev, noteId]);
        showToast('Note bookmarked!');
      }
    } catch (err) {
      console.error('Bookmark toggle error:', err);
    }
  };

  // Download trigger with server side analytics
  const handleDownload = async (note: Note) => {
    if (note.is_premium && !userProfile?.isPremium) {
      showToast('Upgrade to Pro is required for this file.');
      return;
    }

    try {
      // 1. Increment down count on remote Supabase using RPC function
      await supabase.rpc('increment_download_count', { note_id: note.id });

      // 2. Track download history in database
      if (user) {
        await supabase
          .from('downloads')
          .insert({ user_id: user.uid, note_id: note.id })
          .select();
      }

      // Update local state for immediate feedback
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, download_count: n.download_count + 1 } : n));

      // 3. Open URL
      window.open(note.file_url, '_blank');
      showToast('Download initiated successfully!');
    } catch (err) {
      console.error('Analytics tracking error:', err);
      // Fallback
      window.open(note.file_url, '_blank');
    }
  };

  // Help alert feedback
  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  // Filter lists
  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.subject_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.subject_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSem = activeSem === 'All' ? true : n.semester === activeSem;
    const matchesUnit = activeUnit === 'All' ? true : n.unit === activeUnit;

    return matchesSearch && matchesSem && matchesUnit;
  });

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-28 px-4 pb-20 relative selection:bg-blue-600/30">
      
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161B22] border border-blue-500/30 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.25)] flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="text-sm font-bold">{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </Link>

        {/* Header container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            B.Pharma Notes Repository
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Navigate through high-definition pharmacy handouts verified under the PCI Syllabus curriculum structure.
          </p>
        </motion.div>

        {/* Search & live filters Bar */}
        <div className="mb-10 max-w-4xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by note title, subject code (e.g. BP101T) or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-semibold"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            
            {/* Semester Selection pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Sem:
              </span>
              {['All', 1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <button
                  key={sem}
                  onClick={() => {
                    setActiveSem(sem as any);
                    if (sem === 'All') {
                      searchParams.delete('sem');
                    } else {
                      searchParams.set('sem', sem.toString());
                    }
                    setSearchParams(searchParams);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSem === sem
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {sem === 'All' ? 'All' : `Sem ${sem}`}
                </button>
              ))}
            </div>

            {/* Unit Selection pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mr-2">
                Unit:
              </span>
              {['All', 1, 2, 3, 4, 5].map(unit => (
                <button
                  key={unit}
                  onClick={() => setActiveUnit(unit as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeUnit === unit
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {unit === 'All' ? 'All Units' : `Unit ${unit}`}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex flex-col items-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-gray-400 font-medium">Fetching verified database files...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/5 max-w-4xl mx-auto">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Matching Notes Found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Try adjusting your query, semester filtering or search term to discover available B.Pharma handouts.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveSem('All'); setActiveUnit('All'); searchParams.delete('sem'); setSearchParams(searchParams); }}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-sm font-semibold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, i) => {
              const isPremiumLocked = note.is_premium && !userProfile?.isPremium;
              const isBookmarked = bookmarks.includes(note.id);
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 hover:border-blue-500/40 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.05)] relative group flex flex-col justify-between overflow-hidden"
                >
                  
                  {/* Lock glow visual on premium notes */}
                  {note.is_premium && (
                    <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-400 border-l border-b border-blue-500/30 px-3.5 py-1.5 rounded-bl-2xl font-bold uppercase text-[9px] tracking-widest flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-blue-400 text-blue-400 animate-pulse" />
                      Premium
                    </div>
                  )}

                  <div>
                    {/* Header: Semester & Bookmark */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">
                          Semester {note.semester}
                        </span>
                        {note.unit && (
                          <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-lg border border-purple-500/20">
                            Unit {note.unit}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleBookmark(note.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          isBookmarked 
                            ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' 
                            : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Cover Thumbnail Preview */}
                    {note.thumbnail_url && (
                      <div className="w-full h-40 rounded-2xl border border-white/10 overflow-hidden mb-4 relative bg-[#161B22]">
                        <img src={note.thumbnail_url} alt={note.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}

                    {/* Subject info */}
                    {note.subject_name && (
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="text-gray-400">{note.subject_code}</span> — {note.subject_name}
                      </div>
                    )}

                    {/* Note title */}
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2 pr-6">
                      {note.title}
                    </h3>

                    {/* Description */}
                    {note.description && (
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                        {note.description}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-white/5 pt-4 mb-5">
                      <div className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>{note.download_count} downloads</span>
                      </div>
                      {note.file_size_mb && (
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{note.file_size_mb} MB ({note.file_type || 'pdf'})</span>
                        </div>
                      )}
                    </div>

                    {/* Action Trigger */}
                    {isPremiumLocked ? (
                      <Link 
                        to="/premium"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] group/btn"
                      >
                        <Lock className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        Unlock with Pro (₹499)
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleDownload(note)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold rounded-xl text-sm transition-colors"
                      >
                        {note.is_premium ? <Unlock className="w-4 h-4 text-blue-400" /> : <Download className="w-4 h-4" />}
                        Download PDF Note
                      </button>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
