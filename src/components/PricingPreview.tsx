import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function PricingPreview() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Upgrade to Premium</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Get unlimited access to premium notes, ad-free experience, and priority support. Join thousands of successful students.
              </p>
              <ul className="space-y-4 mb-10">
                {["Unlimited PDF Downloads", "Exclusive Premium Notes", "Ad-free AI Tools", "Priority Telegram Support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-300" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/premium" 
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-blue-400/30" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-white/20 rounded-full" />
                    <div className="h-2 w-20 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/20 rounded-full" />
                  <div className="h-4 w-full bg-white/20 rounded-full" />
                  <div className="h-4 w-3/4 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
