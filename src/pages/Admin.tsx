import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Plus, Trash2, BookOpen, Shield, Upload, Eye, Download, Search, Filter } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  university: string;
  semester: string;
  branch: string;
  driveLink: string;
  isPremium: boolean;
  uploadedBy: string;
  uploaderName: string;
  createdAt: any;
  views: number;
  downloads: number;
}

const CATEGORIES = [
  { id: 'btech', name: 'B.Tech', branches: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical'] },
  { id: 'bpharma', name: 'B.Pharma', branches: ['General'] },
  { id: 'diploma', name: 'Diploma', branches: ['CSE', 'ME', 'EE', 'Civil'] },
];

const UNIVERSITIES = ['RTMNU', 'DBATU', 'Other'];
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useFirebase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'btech',
    university: 'RTMNU',
    semester: '1st',
    branch: 'CSE',
    driveLink: '',
    isPremium: false,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchNotes();
    }
  }, [isAdmin]);

  const fetchNotes = async () => {
    try {
      const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.driveLink) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'notes'), {
        ...form,
        uploadedBy: user?.uid,
        uploaderName: user?.displayName || user?.email,
        createdAt: serverTimestamp(),
        views: 0,
        downloads: 0,
        status: 'approved', // Admin uploads are auto-approved
      });

      setForm({
        title: '',
        description: '',
        category: 'btech',
        university: 'RTMNU',
        semester: '1st',
        branch: 'CSE',
        driveLink: '',
        isPremium: false,
      });
      setShowForm(false);
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Redirect non-admin users
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Manage eBooks & Notes</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            <Plus className="w-5 h-5" />
            Add New Note
          </motion.button>
        </div>

        {/* Add Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-6">Add New eBook/Note</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Data Structures Notes - Unit 1"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                  rows={3}
                  placeholder="Brief description of the content..."
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, branch: CATEGORIES.find(c => c.id === e.target.value)?.branches[0] || '' })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Branch *</label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  {selectedCategory?.branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">University *</label>
                <select
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  {UNIVERSITIES.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Semester *</label>
                <select
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  {SEMESTERS.map(sem => (
                    <option key={sem} value={sem}>{sem} Semester</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">Google Drive Link *</label>
                <input
                  type="url"
                  value={form.driveLink}
                  onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="https://drive.google.com/..."
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Make sure the link is set to "Anyone with the link can view"</p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPremium}
                    onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Premium Only (Paid users)</span>
                </label>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Notes</p>
            <p className="text-2xl font-bold text-white">{notes.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Premium Notes</p>
            <p className="text-2xl font-bold text-purple-400">{notes.filter(n => n.isPremium).length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Views</p>
            <p className="text-2xl font-bold text-blue-400">{notes.reduce((acc, n) => acc + (n.views || 0), 0)}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Downloads</p>
            <p className="text-2xl font-bold text-green-400">{notes.reduce((acc, n) => acc + (n.downloads || 0), 0)}</p>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-700/50 text-gray-400 text-sm font-medium">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">University</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No notes found. Add your first note!</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="grid grid-cols-12 gap-4 p-4 border-t border-gray-700 items-center hover:bg-gray-700/30">
                <div className="col-span-5">
                  <p className="text-white font-medium truncate">{note.title}</p>
                  <p className="text-gray-500 text-xs">{note.branch} - {note.semester} Sem</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-300 text-sm">{note.category.toUpperCase()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-300 text-sm">{note.university}</span>
                </div>
                <div className="col-span-1">
                  {note.isPremium ? (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Premium</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Free</span>
                  )}
                </div>
                <div className="col-span-2 flex gap-2">
                  <a
                    href={note.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
