import { HardDrive, Lock, Download, ExternalLink, ChevronDown, ChevronUp, Clock, GraduationCap, Crown, Eye, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import StarRating from './StarRating';
import RatingModal from './RatingModal';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    description?: string;
    file_url?: string;
    driveLink?: string;
    uploaded_by: string;
    created_at: string;
    category?: string;
    university?: string;
    course_code?: string;
    price?: number;
    isPremium?: boolean;
    subject?: string;
    course?: string;
    branch?: string;
    semester?: string;
    views?: number;
    downloads?: number;
    averageRating?: number;
    ratingCount?: number;
  };
  isPremium: boolean; // User's premium status
  onUnlock?: () => void;
}

export default function NoteCard({ note, isPremium, onUnlock }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user } = useFirebase();
  
  // Check if this note requires premium
  const isNotePremium = note.isPremium || (note.price && note.price > 0);
  
  // User can access if: note is free OR user has premium
  const canAccess = !isNotePremium || isPremium;

  const handleDownload = async () => {
    if (!canAccess) {
      onUnlock?.();
      return;
    }

    setDownloading(true);
    
    try {
      // Increment download count
      await updateDoc(doc(db, 'notes', note.id), {
        downloads: increment(1)
      });

      // Open drive link
      const downloadUrl = note.driveLink || note.file_url;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }

      // Show rating modal after download
      setTimeout(() => {
        if (user) {
          setShowRatingModal(true);
        }
      }, 2000);

    } catch (error) {
      console.error('Error downloading note:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleView = async () => {
    try {
      // Increment view count
      await updateDoc(doc(db, 'notes', note.id), {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
        transition: { duration: 0.3 }
      }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-[2rem] border border-outline-variant shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 transition-all overflow-hidden group relative"
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      {/* Premium Badge */}
      {isNotePremium && (
        <motion.div 
          className="absolute top-4 right-4 z-10"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            <Crown className="w-3 h-3" />
            Premium
          </div>
        </motion.div>
      )}

      <div className="p-8 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-4 rounded-2xl group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-lg"
          >
            <HardDrive className="h-6 w-6 text-primary group-hover:text-white" />
          </motion.div>
          <div className="flex gap-2">
            {!isNotePremium && (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest shadow-sm"
              >
                Free
              </motion.div>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-headline font-extrabold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {note.title}
        </h3>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
            <GraduationCap className="w-3.5 h-3.5" />
            {note.category || note.subject || 'General'}
          </span>
          {note.university && (
            <span className="text-xs font-medium text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-lg">
              {note.university}
            </span>
          )}
          {note.branch && (
            <span className="text-xs font-medium text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-lg">
              {note.branch}
            </span>
          )}
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="pt-4 border-t border-outline-variant space-y-4">
                {note.description && (
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed font-body">{note.description}</p>
                  </div>
                )}
                {(note.semester || note.course_code) && (
                  <div className="grid grid-cols-2 gap-4">
                    {note.semester && (
                      <div>
                        <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Semester</h4>
                        <p className="text-xs font-bold text-on-surface">{note.semester}</p>
                      </div>
                    )}
                    {note.course_code && (
                      <div>
                        <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Course Code</h4>
                        <p className="text-xs font-bold text-on-surface">{note.course_code}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70 transition-all py-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                More Details
              </>
            )}
          </button>

          <div className="flex gap-3">
            {canAccess ? (
              <>
                <a 
                  href={note.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-grow flex items-center justify-center gap-3 bg-primary text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                >
                  <ExternalLink className="h-4 w-4" />
                  Access File
                </a>
                <a 
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </a>
              </>
            ) : (
              <Link 
                to="/premium"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                <Lock className="h-4 w-4" />
                Unlock with Premium
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
