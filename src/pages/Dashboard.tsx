import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  ChevronRight,
  Clock,
  Download,
  Loader2,
  ShieldCheck,
  Bookmark,
  Sparkles,
  GraduationCap,
  School,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const { user, userProfile, loading: authLoading, isAuthReady } = useFirebase();
  const navigate = useNavigate();

  // States
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [recentDownloads, setRecentDownloads] = useState<any[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [college, setCollege] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthReady && !user) {
      navigate('/auth');
    }
  }, [isAuthReady, user, navigate]);

  // Load user dynamic data from Supabase
  const loadDashboardData = async (uid: string) => {
    setFetchingData(true);
    try {
      // 1. Fetch total bookmarks count
      const { count: bCount, error: bErr } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid);
      if (!bErr) setBookmarksCount(bCount || 0);

      // 2. Fetch total downloads count
      const { count: dCount, error: dErr } = await supabase
        .from('downloads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid);
      if (!dErr) setDownloadsCount(dCount || 0);

      // 3. Fetch recent downloads details (linked to notes table)
      const { data: dData, error: dDetailErr } = await supabase
        .from('downloads')
        .select(`
          note_id,
          downloaded_at,
          notes:note_id (
            id,
            title,
            is_premium,
            file_url,
            semester,
            subject_name:subject_id (
              name
            )
          )
        `)
        .eq('user_id', uid)
        .order('downloaded_at', { ascending: false })
        .limit(5);

      if (!dDetailErr && dData) {
        setRecentDownloads(dData);
      }

      // 4. Fetch recent bookmarks details (linked to notes table)
      const { data: bData, error: bDetailErr } = await supabase
        .from('bookmarks')
        .select(`
          note_id,
          notes:note_id (
            id,
            title,
            is_premium,
            file_url,
            semester,
            subject_name:subject_id (
              name
            )
          )
        `)
        .eq('user_id', uid)
        .limit(5);

      if (!bDetailErr && bData) {
        setRecentBookmarks(bData);
      }

    } catch (err) {
      console.error('Error loading student dashboard details:', err);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData(user.uid);
      setCollege(userProfile?.college || '');
      setSemester(userProfile?.semester || 1);
    }
  }, [user, userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          college,
          semester: Number(semester)
        })
        .eq('id', user.uid);

      if (error) throw error;

      setStatusMessage('Academic profile updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Profile save error:', err);
      setStatusMessage('Failed to save profile. Try again.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading || !isAuthReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1117]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 text-sm">Synchronizing your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const displayName = userProfile?.full_name || user.email?.split('@')[0] || 'Learner';

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col md:flex-row relative overflow-hidden selection:bg-blue-600/30">
      
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-white/[0.01] border-b md:border-b-0 md:border-r border-white/10 flex flex-col p-6 z-10">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="bg-blue-600 p-2 rounded-xl">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              NotesDrive
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            to="/notes-library/bpharma" 
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-semibold text-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            Browse Library
          </Link>
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-semibold text-sm text-left transition-all"
          >
            <Settings className="w-4 h-4" />
            Edit Academics
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-8 overflow-y-auto z-10">
        
        {/* Status overlay bar */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl mb-8 font-semibold text-sm"
            >
              {statusMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Welcome Back, {displayName}!
            </h1>
            <p className="text-gray-400 text-sm">
              Keep learning and complete your B.Pharma course studies.
            </p>
          </div>

          <Link to="/notes-library/bpharma">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all"
            >
              <Plus className="w-4 h-4" />
              Download Notes
            </motion.button>
          </Link>
        </div>

        {/* Academic Card Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between aspect-[3/2] group hover:border-blue-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Bookmarked Files</span>
                <p className="text-3xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {bookmarksCount}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between aspect-[3/2] group hover:border-purple-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Downloads</span>
                <p className="text-3xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {downloadsCount}
                </p>
              </div>
            </div>

            {/* Premium Gold badge */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between aspect-[3/2] relative overflow-hidden group hover:border-yellow-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Membership</span>
                <p className="text-xl font-bold flex items-center gap-1.5 mt-1 text-yellow-400 font-headline">
                  {userProfile?.is_premium ? 'Lifetime Pro 👑' : 'Standard Basic'}
                </p>
              </div>
            </div>

          </div>

          {/* Academic Info */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2 text-sm text-gray-300">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                Academic Profile
              </h3>
              
              {!isEditingProfile && (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs font-bold text-blue-400 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">College Name</label>
                    <input 
                      type="text" 
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Enter college name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Current Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px] transition-all"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-lg text-[11px] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 flex-grow flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <School className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">College</span>
                    <span className="text-sm font-semibold text-white">{userProfile?.college || 'Not Added'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Degree Program</span>
                    <span className="text-sm font-semibold text-white">
                      B.Pharma Semester {userProfile?.semester || '1'}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Dashboard Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Download History */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <Clock className="w-5 h-5 text-blue-400" />
              Download History
            </h3>

            {fetchingData ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : recentDownloads.length > 0 ? (
              <div className="space-y-3">
                {recentDownloads.map((dl, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl flex justify-between items-center gap-4 transition-all">
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{dl.notes?.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Downloaded {new Date(dl.downloaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {dl.notes?.file_url && (
                      <a 
                        href={dl.notes.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500 text-xs">No downloads logged yet.</p>
                <Link to="/notes-library/bpharma" className="text-blue-400 font-bold text-xs mt-2 inline-block hover:underline">
                  Find Notes
                </Link>
              </div>
            )}
          </div>

          {/* Bookmarks */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <Bookmark className="w-5 h-5 text-purple-400" />
              Bookmarked Notes
            </h3>

            {fetchingData ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : recentBookmarks.length > 0 ? (
              <div className="space-y-3">
                {recentBookmarks.map((bm, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl flex justify-between items-center gap-4 transition-all">
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{bm.notes?.title}</h4>
                      <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md text-[9px] font-bold mt-1 uppercase border border-purple-500/20">
                        Semester {bm.notes?.semester}
                      </span>
                    </div>

                    <Link 
                      to={`/notes-library/bpharma?sem=${bm.notes?.semester}`}
                      className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500 text-xs">No bookmarked files.</p>
                <Link to="/notes-library/bpharma" className="text-purple-400 font-bold text-xs mt-2 inline-block hover:underline">
                  Add Bookmarks
                </Link>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
