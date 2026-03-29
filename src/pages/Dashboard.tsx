import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { logout, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  Bell,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Loader2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user, userProfile, loading, isAuthReady, isAdmin } = useFirebase();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [fetchingNotes, setFetchingNotes] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (isAuthReady && !user) {
      navigate('/auth');
    }
  }, [isAuthReady, user, navigate]);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const success = searchParams.get('success');

    if (success === 'true') {
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 5000);
    }

    if (orderId && user && !userProfile?.isPremium) {
      const verifyPayment = async () => {
        try {
          const response = await fetch(`/api/cashfree/verify/${orderId}`);
          const data = await response.json();
          
          if (data.order_status === 'PAID') {
            // Set subscription to expire after 2 months
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 2);
            
            await updateDoc(doc(db, 'users', user.uid), {
              isPremium: true,
              premiumSince: serverTimestamp(),
              premiumExpiresAt: expiryDate,
              subscriptionDuration: '2 months'
            });
            setPaymentSuccess(true);
            setTimeout(() => setPaymentSuccess(false), 5000);
          }
        } catch (error) {
          console.error("Error verifying Cashfree payment:", error);
        }
      };
      verifyPayment();
    }
  }, [searchParams, user, userProfile]);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      if (!user) return;
      setFetchingNotes(true);
      try {
        const q = query(
          collection(db, 'notes'),
          where('uploadedBy', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentNotes(notes);
      } catch (error) {
        console.error("Error fetching recent notes:", error);
      } finally {
        setFetchingNotes(false);
      }
    };

    if (user) {
      fetchRecentNotes();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading || !isAuthReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-white/60">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const userName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <div className="bg-primary p-2 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">NotesDrive</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
          <SidebarLink icon={<FileText className="w-5 h-5" />} label="My Notes" />
          <SidebarLink icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
          <SidebarLink icon={<Settings className="w-5 h-5" />} label="Settings" />
          
          {/* Admin Panel Link - Only for admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold mt-4 hover:shadow-lg transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-on-surface-variant hover:bg-surface-container-low hover:text-primary rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search your notes, categories..."
              className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-lowest"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface">{userName}</p>
                <p className="text-xs text-on-surface-variant">{userProfile?.isPremium ? 'Premium Member' : 'Free Member'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  userName[0].toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-headline font-bold text-on-surface">Welcome back, {userName}!</h1>
              <p className="text-on-surface-variant mt-1">Here's what's happening with your notes today.</p>
            </div>
            <button 
              onClick={() => navigate('/upload')}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Quick Upload</span>
            </button>
          </div>

          <AnimatePresence>
            {paymentSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-emerald-500 text-white rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold">Payment Successful! Your account has been upgraded to Premium.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Notes" value={recentNotes.length.toString()} trend="+0%" icon={<FileText className="text-primary" />} />
            <StatCard label="Total Views" value="0" trend="+0%" icon={<Eye className="text-primary" />} />
            <StatCard label="Downloads" value="0" trend="+0%" icon={<Download className="text-primary" />} />
            <StatCard label="Earnings" value="₹0" trend="+0%" icon={<BarChart3 className="text-primary" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-headline font-bold text-on-surface">Recent Notes</h2>
                <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {fetchingNotes ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recentNotes.length > 0 ? (
                  recentNotes.map(note => (
                    <NoteItem 
                      key={note.id}
                      title={note.title} 
                      category={note.university || 'General'} 
                      date={note.createdAt?.toDate ? new Date(note.createdAt.toDate()).toLocaleDateString() : 'Just now'} 
                      views={0} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
                    <FileText className="w-12 h-12 text-outline mx-auto mb-4" />
                    <p className="text-on-surface-variant font-medium">No notes uploaded yet.</p>
                    <button 
                      onClick={() => navigate('/upload')}
                      className="text-primary font-bold mt-2 hover:underline"
                    >
                      Upload your first note
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Categories */}
            <div className="space-y-6">
              {userProfile?.isPremium ? (
                <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-6 text-white">
                  <h3 className="font-headline font-bold text-lg mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Premium Active
                  </h3>
                  <p className="text-sm opacity-90 mb-2">You have full access to all features!</p>
                  {userProfile?.premiumExpiresAt && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-xs opacity-75 mb-1">Valid until:</p>
                      <p className="font-bold">
                        {new Date(userProfile.premiumExpiresAt.toDate?.() || userProfile.premiumExpiresAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-primary-container rounded-3xl p-6 text-on-primary-container">
                  <h3 className="font-headline font-bold text-lg mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Upgrade to Pro
                  </h3>
                  <p className="text-sm opacity-90 mb-4">Get unlimited uploads, advanced analytics and custom branding.</p>
                  <button 
                    onClick={() => navigate('/premium')}
                    className="w-full py-3 bg-white text-primary rounded-2xl font-bold hover:bg-opacity-90 transition-all"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-6">
                <h3 className="font-headline font-bold text-lg mb-4 text-on-surface">Popular Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <CategoryTag label="Pharmacy" count={0} />
                  <CategoryTag label="Medicine" count={0} />
                  <CategoryTag label="Biology" count={0} />
                  <CategoryTag label="Chemistry" count={0} />
                  <CategoryTag label="Physics" count={0} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`
      flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium
      ${active 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}
    `}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-surface-container-low rounded-xl group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <p className="text-on-surface-variant text-sm font-medium">{label}</p>
      <p className="text-2xl font-headline font-bold text-on-surface mt-1">{value}</p>
    </div>
  );
}

function NoteItem({ title, category, date, views }: { title: string, category: string, date: string, views: number }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-2xl transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-primary">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">{category}</span>
            <span className="flex items-center gap-1 text-xs text-on-surface-variant">
              <Clock className="w-3 h-3" /> {date}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-on-surface">{views}</p>
        <p className="text-xs text-on-surface-variant">views</p>
      </div>
    </div>
  );
}

function CategoryTag({ label, count }: { label: string, count: number }) {
  return (
    <button className="px-3 py-1.5 bg-surface-container-low hover:bg-primary hover:text-white rounded-xl text-sm font-medium text-on-surface-variant transition-all flex items-center gap-2">
      <span>{label}</span>
      <span className="opacity-60 text-xs">{count}</span>
    </button>
  );
}
