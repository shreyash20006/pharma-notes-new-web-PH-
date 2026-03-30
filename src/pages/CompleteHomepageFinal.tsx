import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { 
  Shield, ArrowRight, Download, Sparkles, BookOpen, Check, Star, Crown,
  Brain, HeadphonesIcon, FileText, Lock, Instagram, Send, X, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompleteHomepage() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStream, setSelectedStream] = useState<'bpharma' | 'btech'>('bpharma');

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('notesdrive_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem('notesdrive_popup_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-hidden">
      <TickerBar />
      <Navbar />
      <HeroSection />
      <StatsCounter />
      <StreamSelector selectedStream={selectedStream} setSelectedStream={setSelectedStream} />
      <FeaturesGrid />
      <SubjectsPreview selectedStream={selectedStream} setSelectedStream={setSelectedStream} />
      <TrendingNotes />
      <UniversityStrip />
      <PricingStrip />
      <Testimonials />
      <Footer />
      <AnnouncementPopup show={showPopup} onClose={closePopup} />
    </div>
  );
}

// All component implementations follow...
