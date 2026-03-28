import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { User, LogOut, Send, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import Logo from './Logo';

export default function Navbar() {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/notes" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Notes</Link>
            <Link to="/summarizer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">AI Summarizer</Link>
            <Link to="/quiz" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Quiz Generator</Link>
            <Link to="/upload" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Upload Notes</Link>
            <Link to="/premium" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Premium</Link>
            
            <a 
              href="https://t.me/your_channel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Send className="h-4 w-4" />
              Join Telegram
            </a>

            {user ? (
              <div className="flex items-center gap-4 border-l pl-8 border-gray-100">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {profile?.name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline">{profile?.name || user.email?.split('@')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-white border-b border-gray-100 overflow-hidden transition-all duration-300",
        isMenuOpen ? "max-height-screen py-4" : "max-h-0 py-0"
      )}>
        <div className="px-4 space-y-3">
          <Link to="/notes" className="block text-base font-medium text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>Notes</Link>
          <Link to="/summarizer" className="block text-base font-medium text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>AI Summarizer</Link>
          <Link to="/quiz" className="block text-base font-medium text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>Quiz Generator</Link>
          <Link to="/premium" className="block text-base font-medium text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>Premium</Link>
          
          <a 
            href="https://t.me/your_channel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base font-medium text-blue-600 py-2"
          >
            <Send className="h-5 w-5" />
            Join Telegram
          </a>

          {user ? (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link to="/dashboard" className="flex items-center gap-3 text-base font-medium text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
                <User className="h-5 w-5" />
                Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 text-base font-medium text-red-600 py-2 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-base font-semibold text-center hover:bg-blue-700 transition-all"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
