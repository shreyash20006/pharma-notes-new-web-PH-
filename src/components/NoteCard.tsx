import { BookOpen, Lock, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
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
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
              Free
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{note.title}</h3>
        <p className="text-sm text-gray-500 mb-6">
          {note.subject && `${note.subject} • `}
          {note.course || 'Study Material'}
        </p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="pt-2 border-t border-gray-50 space-y-4">
                {note.description && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{note.description}</p>
                  </div>
                )}
                <div className="text-[10px] text-gray-400">
                  Uploaded on {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors py-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                View Details
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
                  className="flex-grow flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
                <a 
                  href={note.file_url}
                  download={`${note.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </a>
              </>
            ) : (
              <button 
                onClick={onUnlock}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
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
