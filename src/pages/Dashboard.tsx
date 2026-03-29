import { useAuth } from '../hooks/useAuth';
import { User, Mail, ShieldCheck, Clock, BookOpen, Send, LogOut, Loader2 } from 'lucide-react';
import { logout } from '../lib/firebase';
import { Link, Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold border-4 border-white shadow-lg">
                {profile?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
              {profile?.is_premium && (
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-1.5 rounded-full border-2 border-white" title="Premium Member">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile?.displayName || user?.email?.split('@')[0] || 'User'}</h2>
            <p className="text-gray-500 text-sm mb-6 flex items-center justify-center gap-1.5">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
            
            <div className="flex flex-col gap-3">
              {profile?.is_premium ? (
                <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Premium Active
                </div>
              ) : (
                <Link 
                  to="/premium" 
                  className="bg-blue-600 text-white px-4 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Upgrade to Premium
                </Link>
              )}
              <button 
                onClick={logout}
                className="flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm py-2 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/notes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                <BookOpen className="h-5 w-5 text-blue-600" />
                My Notes
              </Link>
              <a href="https://t.me/your_channel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                <Send className="h-5 w-5 text-blue-600" />
                Telegram Channel
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Clock className="h-10 w-10 opacity-20 mb-4" />
              <p className="font-medium">No recent activity found.</p>
              <p className="text-xs mt-2">Start studying by browsing our notes collection.</p>
              <Link to="/notes" className="mt-6 text-blue-600 font-bold text-sm hover:underline">Browse Notes</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white shadow-lg shadow-blue-100">
              <h3 className="text-lg font-bold mb-2">Free Resources</h3>
              <p className="text-blue-100 text-sm mb-6">Access our collection of free B.Pharma notes and AI tools.</p>
              <Link to="/notes" className="inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                Explore Now
              </Link>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 rounded-3xl text-white shadow-lg shadow-amber-100">
              <h3 className="text-lg font-bold mb-2">Premium Content</h3>
              <p className="text-amber-100 text-sm mb-6">Unlock exclusive notes and advanced AI features.</p>
              <Link to="/premium" className="inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
