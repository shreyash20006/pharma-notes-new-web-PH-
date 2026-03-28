import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Ready to start studying?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/notes" 
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
          >
            Get Started Now
          </Link>
          <a 
            href="https://t.me/your_channel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-all"
          >
            <Send className="h-5 w-5" />
            Join our Telegram
          </a>
        </div>
      </div>
    </section>
  );
}
