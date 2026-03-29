import { HardDrive, Lock, Download, ExternalLink, ChevronDown, ChevronUp, Clock, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    description?: string;
    file_url: string;
    uploaded_by: string;
    created_at: string;
    category?: string;
    university?: string;
    course_code?: string;
    price?: number;
    // Optional UI fields
    subject?: string;
    course?: string;
  };
  isPremium: boolean;
  onUnlock?: () => void;
}

export default function NoteCard({ note, isPremium, onUnlock }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // For now, assume all user uploads are free unless specified
  const canAccess = true; 

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden group"
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-primary-container/20 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <HardDrive className="h-6 w-6 text-primary group-hover:text-white" />
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
              {note.price ? `₹${note.price}` : 'Open Access'}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-headline font-extrabold text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {note.title}
        </h3>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
            <GraduationCap className="w-3.5 h-3.5" />
            {note.category || note.subject || 'General'}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
            <Clock className="w-3.5 h-3.5" />
            {new Date(note.created_at).toLocaleDateString()}
          </span>
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
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Technical Synopsis</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed font-body">{note.description}</p>
                  </div>
                )}
                {(note.university || note.course_code) && (
                  <div className="grid grid-cols-2 gap-4">
                    {note.university && (
                      <div>
                        <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Institution</h4>
                        <p className="text-xs font-bold text-on-surface">{note.university}</p>
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
                Collapse Specs
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Expand Specs
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
                  download={`${note.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                  title="Download Archival Copy"
                >
                  <Download className="h-5 w-5" />
                </a>
              </>
            ) : (
              <button 
                onClick={onUnlock}
                className="w-full flex items-center justify-center gap-3 bg-on-surface text-surface px-6 py-3.5 rounded-2xl text-sm font-bold hover:opacity-90 transition-all"
              >
                <Lock className="h-4 w-4" />
                Unlock with Premium
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
