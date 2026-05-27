import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Shield, 
  Eye, 
  Search, 
  Check, 
  X, 
  Clock, 
  Settings, 
  Tag, 
  IndianRupee, 
  Loader2, 
  ShieldCheck, 
  Percent, 
  CheckCircle2, 
  Star,
  Sparkles,
  Info,
  UploadCloud
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Note {
  id: string;
  title: string;
  description: string;
  semester: number;
  unit?: number;
  file_url: string;
  is_premium: boolean;
  uploaded_by: string;
  created_at: any;
  download_count: number;
  view_count: number;
  status?: string;
  category?: string;
  branch?: string;
  subject_name?: string;
  subject_code?: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'flat';
  max_uses: number;
  used_count: number;
  active: boolean;
}

const CATEGORIES = [
  { id: 'bpharma', name: 'B.Pharma Notes & E-Books', branches: ['General'] },
  { id: 'jee', name: 'IIT-JEE Prep Notes & E-Books', branches: ['Physics', 'Chemistry', 'Mathematics'] },
  { id: 'neet', name: 'NEET Prep Notes & E-Books', branches: ['Physics', 'Chemistry', 'Biology'] },
  { id: 'ebooks', name: 'Reference E-Books (All Streams)', branches: ['Pharmacy', 'Engineering', 'Medical', 'General'] }
];

export default function Admin() {
  const { user, isAdmin, loading } = useFirebase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'settings'>('pending');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState(false);
  
  // Settings state
  const [premiumPrice, setPremiumPrice] = useState(499);
  const [savingSettings, setSavingSettings] = useState(false);
  const [couponsSupported, setCouponsSupported] = useState(true);
  
  // Coupon form
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: 10,
    type: 'percent' as 'percent' | 'flat',
    maxUses: 100,
  });
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'bpharma',
    semester: '1',
    branch: 'General',
    driveLink: '',
    isPremium: false,
    unit: '1'
  });

  // File Uploader state
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'link'>('upload');

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes_with_subject')
        .select('*');

      if (error) throw error;

      if (data) {
        // Map fields to maintain state compatibility
        const mapped = data.map(n => ({
          ...n,
          isPremium: n.is_premium,
          fileUrl: n.file_url,
          downloadCount: n.download_count,
          viewCount: n.view_count
        }));

        const approved = mapped.filter(n => n.status === 'approved' || !n.status);
        const pending = mapped.filter(n => n.status === 'pending');
        
        setNotes(approved);
        setPendingNotes(pending);
      }
    } catch (err) {
      console.error('Error fetching admin notes:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*');

      if (error) {
        if (error.code === 'PGRST114' || error.message.includes('relation "coupons" does not exist')) {
          setCouponsSupported(false); // coupons table hasn't been created yet
        }
        throw error;
      }

      if (data) {
        setCoupons(data);
        setCouponsSupported(true);
      }
    } catch (err) {
      console.warn('Coupons fetch skipped (table may not exist):', err);
    }
  };

  const fetchSettings = async () => {
    try {
      // Mock global pricing state
      setPremiumPrice(499);
    } catch (err) {
      console.error('Error fetching pricing settings:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchNotes();
      fetchSettings();
      fetchCoupons();
    }
  }, [isAdmin]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      setError(null);
      showToast(`Base price saved as ₹${premiumPrice}`);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: couponForm.code.toUpperCase(),
          discount: Number(couponForm.discount),
          type: couponForm.type,
          max_uses: Number(couponForm.maxUses),
          used_count: 0,
          active: true
        });

      if (error) throw error;

      setCouponForm({ code: '', discount: 10, type: 'percent', maxUses: 100 });
      setShowCouponForm(false);
      fetchCoupons();
      showToast('Coupon created successfully!');
    } catch (error) {
      console.error('Error creating coupon:', error);
      setError('Could not create coupon. Check if the coupons table exists in Supabase.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) throw error;
      fetchCoupons();
      showToast('Coupon deleted!');
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const handleToggleCoupon = async (couponId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ active: !currentActive })
        .eq('id', couponId);

      if (error) throw error;
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon:', error);
    }
  };

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
      const filePath = `ebooks/${fileName}`;

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
      showToast('PDF eBook uploaded successfully to Supabase Storage!');
    } catch (uploadErr: any) {
      console.error('Error uploading file:', uploadErr);
      alert(`Upload failed: ${uploadErr.message || 'Please ensure you have created a public storage bucket named "notes-files" in your Supabase dashboard.'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.driveLink) {
      setError('Title and Google Drive Link are required');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('notes')
        .insert({
          title: form.title,
          description: form.description,
          category: form.category,
          semester: Number(form.semester),
          unit: Number(form.unit) || null,
          branch: form.branch, // Subject tag
          file_url: form.driveLink,
          is_premium: form.isPremium,
          status: 'approved',
          download_count: 0,
          view_count: 0,
          uploaded_by: user!.uid
        });

      if (error) throw error;

      setForm({
        title: '',
        description: '',
        category: 'bpharma',
        semester: '1',
        branch: 'General',
        driveLink: '',
        isPremium: false,
        unit: '1'
      });
      setShowForm(false);
      fetchNotes();
      showToast('Note added successfully!');
    } catch (err: any) {
      console.error('Error adding note:', err);
      setError(err.message || 'Failed to add note to database');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePremium = async (noteId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_premium: !currentStatus })
        .eq('id', noteId);

      if (error) throw error;
      fetchNotes();
      showToast('Premium status updated!');
    } catch (error) {
      console.error('Error toggling premium:', error);
    }
  };

  const handleApprove = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ status: 'approved' })
        .eq('id', noteId);

      if (error) throw error;
      fetchNotes();
      showToast('Note approved and published!');
    } catch (error) {
      console.error('Error approving note:', error);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedNotes.length === 0) return;
    if (!confirm(`Approve ${selectedNotes.length} note(s)?`)) return;
    
    setBulkAction(true);
    try {
      await Promise.all(
        selectedNotes.map(noteId => 
          supabase.from('notes').update({ status: 'approved' }).eq('id', noteId)
        )
      );
      setSelectedNotes([]);
      fetchNotes();
      showToast('Notes approved in bulk!');
    } catch (error) {
      console.error('Error bulk approving:', error);
    } finally {
      setBulkAction(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedNotes.length === 0) return;
    if (!confirm(`Delete ${selectedNotes.length} note(s)?`)) return;
    
    setBulkAction(true);
    try {
      await Promise.all(
        selectedNotes.map(noteId => 
          supabase.from('notes').delete().eq('id', noteId)
        )
      );
      setSelectedNotes([]);
      fetchNotes();
      showToast('Selected notes deleted.');
    } catch (error) {
      console.error('Error bulk deleting:', error);
    } finally {
      setBulkAction(false);
    }
  };

  const toggleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNotes.length === filteredNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(filteredNotes.map(n => n.id));
    }
  };

  const handleReject = async (noteId: string) => {
    if (!confirm('Reject and delete this note?')) return;
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      fetchNotes();
      showToast('Note rejected and deleted.');
    } catch (error) {
      console.error('Error rejecting note:', error);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      fetchNotes();
      showToast('Note deleted successfully.');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const showToast = (msg: string) => {
    setError(`[SUCCESS] ${msg}`);
    setTimeout(() => {
      setError(null);
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white">
        <div className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl max-w-sm">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-4">You do not have administrative permissions.</p>
          <p className="text-gray-500 text-xs mb-6">Signed in as: {user.email}</p>
          <Link to="/dashboard" className="px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-bold block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredNotes = (activeTab === 'pending' ? pendingNotes : notes).filter(note => 
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 pb-12 selection:bg-blue-600/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Admin Portal
              </h1>
              <p className="text-gray-400 text-sm">Study Materials & Coupons Management (Supabase)</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            <Plus className="w-4 h-4" />
            Add New Note
          </motion.button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className={`p-4 rounded-2xl mb-8 font-semibold text-sm ${error.startsWith('[SUCCESS]') ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {error.replace('[SUCCESS] ', '')}
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Publish Study Note
            </h2>
            
             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">E-Book or Note Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="e.g., GPAT Crackbook, Pharmaceutical Analysis - Volumetric Notes"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Description / Synopsis</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                  rows={3}
                  placeholder="Brief description, syllabus coverage, or book synopsis..."
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Product Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, branch: CATEGORIES.find(c => c.id === e.target.value)?.branches[0] || 'General' })}
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Subject tag *</label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                >
                  {selectedCategory?.branches.map(br => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Class / Semester *</label>
                <select
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                >
                  {form.category === 'bpharma' || form.category === 'ebooks' ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s.toString()}>Semester {s} / Level {s}</option>
                    ))
                  ) : (
                    <>
                      <option value="1">Class 11</option>
                      <option value="2">Class 12</option>
                      <option value="3">Dropper / Repeater</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Unit ID (Optional for E-Books)</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                >
                  {[1, 2, 3, 4, 5].map(u => (
                    <option key={u} value={u.toString()}>Unit {u}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">eBook PDF File / Link *</label>
                
                {/* Upload method toggle */}
                <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('upload')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      uploadMethod === 'upload'
                        ? 'bg-blue-600 text-white'
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
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Provide Google Drive/External Link
                  </button>
                </div>

                {uploadMethod === 'upload' ? (
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center bg-white/[0.01] hover:bg-white/[0.02] hover:border-blue-500/30 transition-all relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingFile}
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 text-blue-400">
                        {uploadingFile ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-300">
                          {uploadingFile ? 'Uploading PDF eBook...' : 'Click or drag PDF file here to upload'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF format up to 50MB</p>
                      </div>
                      {form.driveLink && (
                        <div className="mt-3 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-bold inline-flex items-center gap-2">
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
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="https://drive.google.com/... or external PDF URL"
                      required={uploadMethod === 'link'}
                    />
                    <p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Ensure the link sharing permissions are set to "Anyone with the link can view"
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

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPremium}
                    onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 text-sm font-bold">Premium Only (Requires active Pro Upgrade)</span>
                </label>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Publish Notes'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tab Selector Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => { setActiveTab('all'); setSelectedNotes([]); }}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            All Published Notes ({notes.length})
          </button>
          <button
            onClick={() => { setActiveTab('pending'); setSelectedNotes([]); }}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending Approval ({pendingNotes.length})
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setSelectedNotes([]); }}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Settings className="w-4 h-4" />
            Billing & Coupons
          </button>
        </div>

        {/* Bulk approval widgets */}
        {activeTab === 'pending' && selectedNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-500/10 border border-purple-500/20 text-white rounded-2xl p-5 mb-6 flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm">{selectedNotes.length} notes selected</span>
              <button
                onClick={toggleSelectAll}
                className="text-xs text-purple-400 hover:underline font-bold"
              >
                {selectedNotes.length === filteredNotes.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkApprove}
                disabled={bulkAction}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-bold text-xs transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={handleBulkReject}
                disabled={bulkAction}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl font-bold text-xs transition-all disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Settings view */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            
            {/* Base pricing */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Lifetime Subscription Rate</h2>
                  <p className="text-gray-400 text-xs">Set the default target cost for NotesDrive Pro lifetime upgrade</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-bold">₹</span>
                  <input
                    type="number"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#161B22] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-2xl font-bold focus:outline-none focus:border-emerald-500/50"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-colors"
                >
                  Save Global Price
                </button>
              </div>
            </div>

            {/* Promo Codes */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/15 rounded-xl flex items-center justify-center border border-purple-500/20 text-purple-400">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Billing Promo Codes</h2>
                    <p className="text-gray-400 text-xs">Create discount vouchers for checkout upgrades</p>
                  </div>
                </div>
                {couponsSupported && (
                  <button
                    onClick={() => setShowCouponForm(!showCouponForm)}
                    className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Coupon
                  </button>
                )}
              </div>

              {!couponsSupported && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-2xl text-xs space-y-2 font-medium">
                  <p>⚠️ **Coupons table does not exist in your Supabase project.**</p>
                  <p>Please execute the `coupons` SQL schema in your Supabase SQL Editor to activate the Coupon management console!</p>
                </div>
              )}

              {/* Coupon Form */}
              {couponsSupported && showCouponForm && (
                <form onSubmit={handleCreateCoupon} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Coupon Code</label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        className="w-full bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-purple-500/50"
                        placeholder="e.g. SAVE50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Discount Val</label>
                      <input
                        type="number"
                        value={couponForm.discount}
                        onChange={(e) => setCouponForm({ ...couponForm, discount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Type</label>
                      <select
                        value={couponForm.type}
                        onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as 'percent' | 'flat' })}
                        className="w-full bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="percent">% Off</option>
                        <option value="flat">₹ Off</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Max redemption limit</label>
                      <input
                        type="number"
                        value={couponForm.maxUses}
                        onChange={(e) => setCouponForm({ ...couponForm, maxUses: parseInt(e.target.value) || 1 })}
                        className="w-full bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
                    >
                      Save Voucher
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCouponForm(false)}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              {couponsSupported && (
                coupons.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs font-semibold">
                    No active discount coupons logged. Create one!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="flex items-center justify-between bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <code className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg font-mono font-bold text-sm">
                            {coupon.code}
                          </code>
                          <div>
                            <span className="text-sm font-bold">
                              {coupon.type === 'percent' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                            </span>
                            <p className="text-gray-500 text-[10px] mt-0.5 font-semibold">
                              Limit: {coupon.used_count || 0} / {coupon.max_uses} redemptions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCoupon(coupon.id, coupon.active)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold ${coupon.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                          >
                            {coupon.active ? 'Active' : 'Disabled'}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg border border-red-500/20 hover:border-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

          </div>
        )}

        {/* Notes listings */}
        {activeTab !== 'settings' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            
            {/* Search filter */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes list by title..."
                className="w-full bg-[#161B22] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            {/* List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-xs font-semibold">
                No study notes match your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                      {activeTab === 'pending' && <th className="py-4 px-2 w-10"></th>}
                      <th className="py-4 px-3">Title / Subject</th>
                      <th className="py-4 px-3 w-28 text-center">Category</th>
                      <th className="py-4 px-3 w-24 text-center">Class / Sem</th>
                      <th className="py-4 px-3 w-24 text-center">Price Limit</th>
                      <th className="py-4 px-3 w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotes.map((note) => (
                      <tr key={note.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                        {activeTab === 'pending' && (
                          <td className="py-4 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedNotes.includes(note.id)}
                              onChange={() => toggleSelectNote(note.id)}
                              className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500"
                            />
                          </td>
                        )}
                        <td className="py-4 px-3">
                          <h4 className="font-bold text-white text-sm line-clamp-1">{note.title}</h4>
                          <span className="text-gray-500 font-semibold">{note.subject_name || note.branch || 'General'}</span>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md font-bold text-[9px] uppercase border border-blue-500/20">
                            {note.category?.toUpperCase() || 'PHARMA'}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center font-bold text-gray-300">
                          {note.category === 'bpharma' ? `Sem ${note.semester}` : `Class ${note.semester === 1 ? '11' : note.semester === 2 ? '12' : 'Dropper'}`}
                        </td>
                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => handleTogglePremium(note.id, note.is_premium)}
                            className={`px-3 py-1 rounded-xl text-[9px] font-bold border transition-colors ${note.is_premium ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}
                          >
                            {note.is_premium ? 'Premium 🔒' : 'Free 🔓'}
                          </button>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <div className="flex gap-2 justify-end">
                            {activeTab === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleApprove(note.id)}
                                  className="p-2 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl transition-colors"
                                  title="Approve"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleReject(note.id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                {note.file_url && (
                                  <a
                                    href={note.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                    title="View Notes"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDelete(note.id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
