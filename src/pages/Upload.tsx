import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { useFirebase } from '../context/FirebaseContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Link as LinkIcon,
  BookOpen,
  Sparkles,
  Upload as UploadIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'btech', name: 'B.Tech', branches: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical', 'Other'] },
  { id: 'bpharma', name: 'B.Pharma', branches: ['General'] },
  { id: 'diploma', name: 'Diploma', branches: ['CSE', 'ME', 'EE', 'Civil', 'Other'] },
  { id: 'other', name: 'Other', branches: ['General'] },
];

const UNIVERSITIES = ['RTMNU', 'DBATU', 'SPPU', 'Mumbai University', 'Other'];
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

export default function Upload() {
  const { user, userProfile, loading: authLoading } = useFirebase();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'btech',
    branch: 'CSE',
    university: 'RTMNU',
    semester: '1st',
    driveLink: '',
  });
  
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);

  const validateDriveLink = (link: string) => {
    const drivePatterns = [
      /drive\.google\.com/,
      /docs\.google\.com/,
      /dropbox\.com/,
      /mediafire\.com/,
      /mega\.nz/,
    ];
    return drivePatterns.some(pattern => pattern.test(link));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to upload.');
      return;
    }

    if (!form.title.trim()) {
      setError('Please enter a title.');
      return;
    }

    if (!form.driveLink.trim()) {
      setError('Please enter a Google Drive link.');
      return;
    }

    if (!validateDriveLink(form.driveLink)) {
      setError('Please enter a valid Google Drive, Dropbox, or file sharing link.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'notes'), {
        ...form,
        uploadedBy: user.uid,
        uploaderName: user.displayName || user.email?.split('@')[0],
        uploaderEmail: user.email,
        uploaderPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        status: 'pending', // Requires admin approval
        views: 0,
        downloads: 0,
        isPremium: false, // User uploads are free, admin can change
      });

      setSuccess(true);
      setForm({
        title: '',
        description: '',
        category: 'btech',
        branch: 'CSE',
        university: 'RTMNU',
        semester: '1st',
        driveLink: '',
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please contact admin to enable uploads.');
      } else {
        setError(err.message || 'Failed to upload. Please try again.');
      }
    }
    setUploading(false);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-purple-500/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
        >
          <UploadIcon className="h-12 w-12 text-purple-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-white mb-4">Login to Contribute</h2>
        <p className="text-white/60 max-w-md mb-10 text-lg">Share your notes with students and help the community grow!</p>
        <Link 
          to="/auth"
          className="bg-purple-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all"
        >
          Login / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Community Contribution</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Upload Your Notes</h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Share your study materials with students. Just paste your Google Drive link and we'll handle the rest!
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Upload Submitted!</h2>
                <p className="text-white/60 mb-8">
                  Your notes have been submitted for review. They'll be live once approved by our team.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-purple-500 text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Upload Another
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold border border-white/20"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="p-8 space-y-6"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Data Structures Notes - Unit 1 to 5"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 resize-none"
                    rows={3}
                    placeholder="What's included in these notes?"
                  />
                </div>

                {/* Category & Branch */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Course *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ 
                        ...form, 
                        category: e.target.value,
                        branch: CATEGORIES.find(c => c.id === e.target.value)?.branches[0] || ''
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-gray-800">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Branch *</label>
                    <select
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      {selectedCategory?.branches.map(branch => (
                        <option key={branch} value={branch} className="bg-gray-800">{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* University & Semester */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">University *</label>
                    <select
                      value={form.university}
                      onChange={(e) => setForm({ ...form, university: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      {UNIVERSITIES.map(uni => (
                        <option key={uni} value={uni} className="bg-gray-800">{uni}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Semester *</label>
                    <select
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      {SEMESTERS.map(sem => (
                        <option key={sem} value={sem} className="bg-gray-800">{sem} Semester</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Google Drive Link */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    Google Drive Link *
                  </label>
                  <input
                    type="url"
                    value={form.driveLink}
                    onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <p className="text-white/40 text-xs mt-2">
                    Make sure the link is set to "Anyone with the link can view"
                  </p>
                </div>

                {/* How it works */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    How it works
                  </h4>
                  <ol className="text-white/50 text-sm space-y-1 list-decimal list-inside">
                    <li>Upload your PDF to Google Drive</li>
                    <li>Right click → Share → Anyone with link</li>
                    <li>Copy the link and paste here</li>
                    <li>Our team will review and approve</li>
                  </ol>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-5 h-5" />
                      Submit for Review
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
