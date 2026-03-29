import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useFirebase } from '../context/FirebaseContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { Search, Filter, Loader2, SlidersHorizontal } from 'lucide-react';
import NoteCard from './NoteCard';

interface Note {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  driveLink?: string;
  uploadedBy: string;
  createdAt: any;
  category?: string;
  university?: string;
  courseCode?: string;
  branch?: string;
  semester?: string;
  price?: number;
  isPremium?: boolean;
  status?: string;
}

export default function NoteList() {
  const { userProfile } = useFirebase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchNotes() {
      try {
        // Simple query without orderBy (avoids index requirement)
        const q = query(collection(db, 'notes'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Note[];
        
        console.log('Fetched notes:', data.length);
        
        // Filter for approved/published notes and sort by createdAt
        const approvedNotes = data
          .filter(note => 
            note.status === 'approved' || !note.status || note.status === 'published'
          )
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          });
        
        console.log('Approved notes:', approvedNotes.length);
        setNotes(approvedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  const categories = ['All', ...Array.from(new Set(notes.map(n => n.category || 'Uncategorized')))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
          <input 
            type="text" 
            placeholder="Search knowledge repository..."
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none transition-all font-body text-on-surface"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
            <select 
              className="w-full pl-12 pr-10 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none appearance-none transition-all font-body text-on-surface"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
          <p className="font-bold font-headline">Syncing with Repository...</p>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={{
                ...note,
                file_url: note.driveLink || note.fileUrl || '#',
                uploaded_by: note.uploadedBy,
                created_at: note.createdAt?.toDate ? note.createdAt.toDate().toISOString() : note.createdAt,
                course_code: note.courseCode,
                isPremium: note.isPremium,
                branch: note.branch,
                semester: note.semester
              }} 
              isPremium={userProfile?.isPremium || false} 
              onUnlock={() => window.location.href = '/premium'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-surface-container-low rounded-3xl border border-outline-variant border-dashed">
          <div className="bg-surface-container-high w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="h-10 w-10 text-outline" />
          </div>
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">No documents found</h3>
          <p className="text-on-surface-variant font-body">Try adjusting your search parameters or category filters.</p>
        </div>
      )}
    </div>
  );
}
