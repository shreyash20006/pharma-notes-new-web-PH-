import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimatedFooter from './components/AnimatedFooter';
import Home from './pages/Home';
import HomeNew from './pages/HomeNew';
import NewHomepage from './pages/NewHomepage';
import LogoShowcase from './pages/LogoShowcase';
import Notes from './pages/Notes';
import NotesLibrary from './pages/NotesLibrary';
import BranchSelection from './pages/BranchSelection';
import SubjectSelection from './pages/SubjectSelection';
import SubjectPDFs from './pages/SubjectPDFs';
import UserSettings from './pages/UserSettings';
import PricingPlans from './pages/PricingPlans';
import StudentDashboard from './pages/StudentDashboard';
import Summarizer from './pages/Summarizer';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import Premium from './pages/Premium';
import Upload from './pages/Upload';
import Auth from './pages/Auth';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Refunds from './pages/Refunds';
import Admin from './pages/Admin';
import BpharmaNotesPage from './pages/BpharmaNotesPage';
import JeeNeetNotesPage from './pages/JeeNeetNotesPage';
import PaymentSuccess from './pages/PaymentSuccess';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './components/Logo';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Logo className="scale-150" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<NewHomepage />} />
            <Route path="/home-old" element={<><Navbar /><Home /></>} />
            <Route path="/home-new" element={<><Navbar /><HomeNew /></>} />
            <Route path="/logo-showcase" element={<><Navbar /><LogoShowcase /></>} />
            <Route path="/notes" element={<><Navbar /><Notes /></>} />
            <Route path="/notes-library" element={<><Navbar /><NotesLibrary /></>} />
            <Route path="/notes-library/btech" element={<><Navbar /><BranchSelection /></>} />
            <Route path="/notes-library/:stream/:branch" element={<><Navbar /><SubjectSelection /></>} />
            <Route path="/notes-library/bpharma" element={<><Navbar /><BpharmaNotesPage /></>} />
            <Route path="/notes-library/jeeneet" element={<><Navbar /><JeeNeetNotesPage /></>} />
            <Route path="/notes-library/:stream/:branch/:semester/:subject" element={<><Navbar /><SubjectPDFs /></>} />
            <Route path="/pricing-plans" element={<Navigate to="/premium" replace />} />
            <Route path="/student-dashboard" element={<><Navbar /><StudentDashboard /></>} />
            <Route path="/summarizer" element={<><Navbar /><Summarizer /></>} />
            <Route path="/quiz" element={<><Navbar /><Quiz /></>} />
            <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
            <Route path="/premium" element={<><Navbar /><Premium /></>} />
            <Route path="/pricing" element={<><Navbar /><Premium /></>} />
            <Route path="/upload" element={<><Navbar /><Upload /></>} />
            <Route path="/auth" element={<><Navbar /><Auth /></>} />
            <Route path="/contact" element={<><Navbar /><Contact /></>} />
            <Route path="/terms" element={<><Navbar /><Terms /></>} />
            <Route path="/refunds" element={<><Navbar /><Refunds /></>} />
            <Route path="/admin" element={<><Navbar /><Admin /></>} />
            <Route path="/settings" element={<><Navbar /><UserSettings /></>} />
            <Route path="/payment/success" element={<><Navbar /><PaymentSuccess /></>} />
          </Routes>
        </main>
        <AnimatedFooter />
      </div>
    </Router>
  );
}
