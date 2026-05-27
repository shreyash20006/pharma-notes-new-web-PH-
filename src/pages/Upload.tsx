import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Link as LinkIcon,
  BookOpen,
  Sparkles,
  Upload as UploadIcon,
  UploadCloud,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'bpharma', name: 'B.Pharma Notes & E-Books', branches: ['General'] },
  { id: 'jee', name: 'IIT-JEE Prep Notes & E-Books', branches: ['Physics', 'Chemistry', 'Mathematics'] },
  { id: 'neet', name: 'NEET Prep Notes & E-Books', branches: ['Physics', 'Chemistry', 'Biology'] },
  { id: 'ebooks', name: 'Reference E-Books (All Streams)', branches: ['Pharmacy', 'Engineering', 'Medical', 'General'] }
];

export default function Upload() {
  const { user, loading: authLoading } = useFirebase();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'bpharma',
    semester: '1',
    branch: 'General',
    driveLink: '',
    unit: '1',
    thumbnailUrl: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File uploader state
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'link'>('upload');
  const [uploadingCover, setUploadingCover] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notes-files')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, driveLink: publicUrl }));
      setError(null);
    } catch (uploadErr: any) {
      console.error('Error uploading file:', uploadErr);
      alert(`Upload failed: ${uploadErr.message || 'Please ensure you have created a public storage bucket named "notes-files" in your Supabase dashboard.'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file only (PNG/JPG/WEBP).');
      return;
    }

    setUploadingCover(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notes-files')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, thumbnailUrl: publicUrl }));
      setError(null);
    } catch (uploadErr: any) {
      console.error('Error uploading cover:', uploadErr);
      alert(`Upload failed: ${uploadErr.message || 'Please verify notes-files bucket is public.'}`);
    } finally {
      setUploadingCover(false);
    }
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
      setError('Please provide a PDF eBook or notes file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('notes')
        .insert({
          title: form.title,
          description: form.description,
          category: form.category,
          semester: Number(form.semester),
          unit: Number(form.unit) || null,
          branch: form.branch,
          file_url: form.driveLink,
          thumbnail_url: form.thumbnailUrl || null,
          is_premium: false, // User uploads are free by default
          status: 'pending', // Requires admin approval
          download_count: 0,
          view_count: 0,
          uploaded_by: user.uid
        });

      if (dbError) throw dbError;

      setSuccess(true);
      setForm({
        title: '',
        description: '',
        category: 'bpharma',
        semester: '1',
        branch: 'General',
        driveLink: '',
        unit: '1',
        thumbnailUrl: ''
      });
    } catch (err: any) {
      console.error('Upload submission error:', err);
      setError(err.message || 'Failed to submit notes. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-purple-500/10 border border-purple-500/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
        >
          <UploadIcon className="h-12 w-12 text-purple-400" />
        </motion.div>
        <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Login to Contribute
        </h2>
        <p className="text-gray-400 max-w-sm mb-10 text-sm">
          Share your high-quality study materials or eBooks with the community and help students excel!
        </p>
        <Link 
          to="/auth"
          className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20 text-sm"
        >
          Login / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-28 pb-12 relative selection:bg-purple-600/30">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] bg-purple-950/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[40rem] h-[40rem] bg-blue-950/10 rounded-full filter blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-purple-300 text-xs font-bold uppercase tracking-wider">Community Contribution</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Upload Study Materials
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Share your verified PDF E-Books or study notes. Upload files directly or paste a cloud link to publish.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Material Submitted!
                </h2>
                <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
                  Your notes/eBook have been sent to our moderators for verification. They will go live once approved!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
                  >
                    Upload Another
                  </button>
                  <button
                    onClick={() => navigate('/student-dashboard')}
                    className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
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
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-semibold"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">eBook or Note Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                    placeholder="e.g., Organic Chemistry Mechanism Handbook"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Description / Synopsis</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                    rows={3}
                    placeholder="Provide a brief synopsis of contents, pages, syllabus tags, or guidelines..."
                  />
                </div>

                {/* Category & Branch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Course Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ 
                        ...form, 
                        category: e.target.value,
                        branch: CATEGORIES.find(c => c.id === e.target.value)?.branches[0] || 'General'
                      })}
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#0D1117]">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Subject Tag *</label>
                    <select
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      {selectedCategory?.branches.map(branch => (
                        <option key={branch} value={branch} className="bg-[#0D1117]">{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Semester & Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Class / Semester *</label>
                    <select
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      {form.category === 'bpharma' || form.category === 'ebooks' ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <option key={s} value={s.toString()} className="bg-[#0D1117]">Semester {s} / Level {s}</option>
                        ))
                      ) : (
                        <>
                          <option value="1" className="bg-[#0D1117]">Class 11</option>
                          <option value="2" className="bg-[#0D1117]">Class 12</option>
                          <option value="3" className="bg-[#0D1117]">Dropper / Repeater</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Unit ID (Optional for E-Books)</label>
                    <select
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      {[1, 2, 3, 4, 5].map(u => (
                        <option key={u} value={u.toString()} className="bg-[#0D1117]">Unit {u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* File Upload Block */}
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">eBook PDF File / Link *</label>
                  
                  {/* Upload method selector */}
                  <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-xl w-fit">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('upload')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        uploadMethod === 'upload'
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Upload PDF Directly
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('link')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        uploadMethod === 'link'
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Provide Google Drive/External Link
                    </button>
                  </div>

                  {uploadMethod === 'upload' ? (
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center bg-white/[0.01] hover:bg-white/[0.02] hover:border-purple-500/30 transition-all relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingFile}
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20 text-purple-400">
                          {uploadingFile ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <UploadCloud className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-300">
                            {uploadingFile ? 'Uploading PDF...' : 'Click or drag PDF file here to upload'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF format up to 50MB</p>
                        </div>
                        {form.driveLink && (
                          <div className="mt-3 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-xs font-bold inline-flex items-center gap-2">
                            <Check className="w-3.5 h-3.5" /> PDF Uploaded Successfully!
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={form.driveLink}
                        onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                        className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                        placeholder="https://drive.google.com/file/d/... or external PDF URL"
                        required={uploadMethod === 'link'}
                      />
                      <p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1">
                        <LinkIcon className="w-3.5 h-3.5" /> Ensure the link sharing permissions are set to "Anyone with the link can view"
                      </p>
                    </div>
                  )}

                  {/* Hidden input to enforce html required validation */}
                  <input
                    type="hidden"
                    value={form.driveLink}
                    required
                  />
                </div>

                {/* Cover Photo Upload Block */}
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Cover Photo / Book Thumbnail (Optional)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 border border-white/10 rounded-2xl p-4">
                    {form.thumbnailUrl ? (
                      <div className="w-20 h-28 rounded-lg bg-gray-800 border border-white/10 overflow-hidden relative flex-shrink-0 group">
                        <img src={form.thumbnailUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, thumbnailUrl: '' }))}
                          className="absolute inset-0 bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-28 rounded-lg bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center flex-shrink-0 text-gray-500 text-xs text-center p-2">
                        <UploadCloud className="w-5 h-5 mb-1" />
                        No Cover
                      </div>
                    )}

                    <div className="flex-1 w-full text-center sm:text-left">
                      <div className="relative inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingCover}
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
                        >
                          {uploadingCover ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5" />
                              Select Image
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-gray-500 text-[10px] mt-2">PNG, JPG or WEBP formats. Recommended ratio 3:4</p>
                    </div>
                  </div>
                </div>

                {/* How it works info */}
                <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4">
                  <h4 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    How Contribution Works
                  </h4>
                  <ol className="text-gray-400 text-xs space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Upload your document directly or paste an external sharing link.</li>
                    <li>Verify details (Correct Category, Subject tag, Semester level).</li>
                    <li>Submit it. Our moderator panel reviews contributions before publishing them to the public libraries.</li>
                  </ol>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={uploading || uploadingFile}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold text-base transition-colors disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-purple-600/15"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Note...
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
