import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-surface pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-on-surface-variant text-xl font-body max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface mb-1">Email</h3>
                <p className="text-on-surface-variant">notesdriveshop@gmail.com</p>
                <p className="text-on-surface-variant text-sm mt-1">We respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface mb-1">Phone</h3>
                <p className="text-on-surface-variant">+91 8668301185</p>
                <p className="text-on-surface-variant text-sm mt-1">Mon-Sat, 10 AM - 6 PM IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface mb-1">Address</h3>
                <p className="text-on-surface-variant">
                  NotesDrive<br />
                  Jaihind Housing Society,<br />
                  Shyam Nagar, Somalwada,<br />
                  Nagpur, Maharashtra, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface mb-1">Telegram</h3>
                <a href="https://t.me/notesdrive" className="text-primary hover:underline">
                  @notesdrive
                </a>
                <p className="text-on-surface-variant text-sm mt-1">Join our community</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant"
          >
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
