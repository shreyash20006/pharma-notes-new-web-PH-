import { Link } from 'react-router-dom';
import { BookOpen, Send, Mail, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Pharma<span className="text-blue-600">Notes</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Empowering B.Pharma students with high-quality study materials and AI-powered learning tools.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link to="/notes" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Study Notes</Link></li>
              <li><Link to="/summarizer" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">AI Summarizer</Link></li>
              <li><Link to="/quiz" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">MCQ Generator</Link></li>
              <li><Link to="/premium" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Premium Plans</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Community</h3>
            <p className="text-gray-500 text-sm mb-6">Join our Telegram channel for daily updates and new notes.</p>
            <a 
              href="https://t.me/your_channel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Send className="h-4 w-4" />
              Join Telegram Channel
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} PharmaNotes. All rights reserved. Built for B.Pharma students in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
