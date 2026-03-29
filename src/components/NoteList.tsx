import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Search, Filter, Loader2 } from 'lucide-react';
import NoteCard from './NoteCard';

interface Note {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
  // Optional legacy fields for UI compatibility
  subject?: string;
  course?: string;
}

export default function NoteList() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    async function fetchNotes() {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase is not configured. Using mock data.");
        setNotes([
          {
            id: '1',
            title: 'Anatomy & Physiology I',
            description: 'Comprehensive study of human anatomy and physiology, focusing on skeletal and muscular systems.',
            file_url: '#',
            uploaded_by: 'system',
            created_at: new Date().toISOString(),
            subject: 'Anatomy',
            course: 'B.Pharma 1st Sem'
          },
          {
            id: '2',
            title: 'Pharmaceutical Analysis',
            description: 'Introduction to quality control and analytical techniques in pharmacy.',
            file_url: '#',
            uploaded_by: 'system',
            created_at: new Date().toISOString(),
            subject: 'Analysis',
            course: 'B.Pharma 1st Sem'
          }
        ]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotes(data);
      }
      setLoading(false);
    }

    fetchNotes();
  }, []);

  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject)))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative flex-grow sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="font-medium">Loading notes...</p>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              isPremium={profile?.is_premium} 
              onUnlock={() => window.location.href = '/premium'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-500">Try searching with different keywords or filters.</p>
        </div>
      )}
    </div>
  );
}
