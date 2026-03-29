import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { logout } from '../lib/firebase';
import { User, LogOut, Send, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import Logo from './Logo';

export default function Navbar() {
  const { user, userProfile } = useFirebase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/notes" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Notes</Link>
            <Link to="/summarizer" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">AI Summarizer</Link>
            <Link to="/quiz" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Quiz Generator</Link>
            <Link to="/upload" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Upload Notes</Link>
            <Link to="/premium" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Premium</Link>
            
            <a 
              href="https://t.me/your_channel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary-container/20 px-4 py-2 rounded-full hover:bg-primary-container/30 transition-colors"
            >
              <Send className="h-4 w-4" />
              Join Telegram
            </a>

            {user ? (
              <div className="flex items-center gap-4 border-l pl-8 border-outline-variant">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors">
                  <div className="h-9 w-9 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
                    ) : (
                      user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="hidden lg:inline">{user.displayName || user.email?.split('@')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-0.5"
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
        "md:hidden bg-surface-container-lowest border-b border-outline-variant overflow-hidden transition-all duration-300",
        isMenuOpen ? "max-height-screen py-4" : "max-h-0 py-0"
      )}>
        <div className="px-4 space-y-3">
          <Link to="/notes" className="block text-base font-medium text-on-surface-variant py-2" onClick={() => setIsMenuOpen(false)}>Notes</Link>
          <Link to="/summarizer" className="block text-base font-medium text-on-surface-variant py-2" onClick={() => setIsMenuOpen(false)}>AI Summarizer</Link>
          <Link to="/quiz" className="block text-base font-medium text-on-surface-variant py-2" onClick={() => setIsMenuOpen(false)}>Quiz Generator</Link>
          <Link to="/premium" className="block text-base font-medium text-on-surface-variant py-2" onClick={() => setIsMenuOpen(false)}>Premium</Link>
          
          <a 
            href="https://t.me/your_channel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base font-bold text-primary py-2"
          >
            <Send className="h-5 w-5" />
            Join Telegram
          </a>

          {user ? (
            <div className="pt-4 border-t border-outline-variant space-y-3">
              <Link to="/dashboard" className="flex items-center gap-3 text-base font-bold text-on-surface py-2" onClick={() => setIsMenuOpen(false)}>
                <User className="h-5 w-5" />
                Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 text-base font-bold text-error py-2 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-primary text-white px-5 py-3 rounded-xl text-base font-bold text-center hover:bg-primary/90 transition-all"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
