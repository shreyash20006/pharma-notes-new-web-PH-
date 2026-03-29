import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Plus, Trash2, BookOpen, Shield, Eye, Search, Check, X, Clock, Settings, Tag, IndianRupee, Percent } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

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
  uploaderEmail?: string;
  createdAt: any;
  views: number;
  downloads: number;
  status?: string;
  price?: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'flat';
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt?: any;
}

const CATEGORIES = [
  { id: 'btech', name: 'B.Tech', branches: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical'] },
  { id: 'bpharma', name: 'B.Pharma', branches: ['General'] },
  { id: 'diploma', name: 'Diploma', branches: ['CSE', 'ME', 'EE', 'Civil'] },
];

const UNIVERSITIES = ['RTMNU', 'DBATU', 'SPPU', 'Other'];
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

export default function Admin() {
  const { user, isAdmin, loading } = useFirebase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'settings'>('all');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');
  
  // Settings state
  const [premiumPrice, setPremiumPrice] = useState(499);
  const [savingSettings, setSavingSettings] = useState(false);
  
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
    category: 'btech',
    university: 'RTMNU',
    semester: '1st',
    branch: 'CSE',
    driveLink: '',
    isPremium: false,
    price: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchNotes();
      fetchSettings();
      fetchCoupons();
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'pricing'));
      if (settingsDoc.exists()) {
        setPremiumPrice(settingsDoc.data().premiumPrice || 499);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'coupons'));
      const couponsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Coupon[];
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'pricing'), {
        premiumPrice: premiumPrice,
        updatedAt: serverTimestamp()
      });
      setError(null);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    }
    setSavingSettings(false);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) return;
    
    setSaving(true);
    try {
      await addDoc(collection(db, 'coupons'), {
        code: couponForm.code.toUpperCase(),
        discount: couponForm.discount,
        type: couponForm.type,
        maxUses: couponForm.maxUses,
        usedCount: 0,
        active: true,
        createdAt: serverTimestamp()
      });
      setCouponForm({ code: '', discount: 10, type: 'percent', maxUses: 100 });
      setShowCouponForm(false);
      fetchCoupons();
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
    setSaving(false);
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const handleToggleCoupon = async (couponId: string, currentActive: boolean) => {
    try {
      await updateDoc(doc(db, 'coupons', couponId), {
        active: !currentActive
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const q = query(collection(db, 'notes'));
      const snapshot = await getDocs(q);
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      
      // Separate approved and pending
      const approved = notesData.filter(n => n.status === 'approved' || !n.status);
      const pending = notesData.filter(n => n.status === 'pending');
      
      setNotes(approved);
      setPendingNotes(pending);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.driveLink) {
      setError('Title and Drive Link are required');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, 'notes'), {
        ...form,
        uploadedBy: user?.uid,
        uploaderName: user?.displayName || user?.email,
        uploaderEmail: user?.email,
        createdAt: serverTimestamp(),
        views: 0,
        downloads: 0,
        status: 'approved',
        price: form.price || 0,
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
        price: 0,
      });
      setShowForm(false);
      fetchNotes();
    } catch (err: any) {
      console.error('Error adding note:', err);
      setError(err.message || 'Failed to add note');
    }
    setSaving(false);
  };

  const handleTogglePremium = async (noteId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        isPremium: !currentStatus,
        price: !currentStatus ? 499 : 0 // Default price when making premium
      });
      fetchNotes();
    } catch (error) {
      console.error('Error toggling premium:', error);
    }
  };

  const handleSetPrice = async (noteId: string) => {
    const price = parseInt(priceInput) || 0;
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        price: price,
        isPremium: price > 0
      });
      setEditingPrice(null);
      setPriceInput('');
      fetchNotes();
    } catch (error) {
      console.error('Error setting price:', error);
    }
  };

  const handleApprove = async (noteId: string) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        status: 'approved'
      });
      fetchNotes();
    } catch (error) {
      console.error('Error approving note:', error);
    }
  };

  const handleReject = async (noteId: string) => {
    if (!confirm('Reject and delete this note?')) return;
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      fetchNotes();
    } catch (error) {
      console.error('Error rejecting note:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You don't have admin access.</p>
          <p className="text-gray-500 text-sm">Logged in as: {user.email}</p>
          <Link to="/dashboard" className="mt-4 inline-block text-purple-400 hover:underline">
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
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                {error}
              </div>
            )}
            
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
                    onChange={(e) => setForm({ ...form, isPremium: e.target.checked, price: e.target.checked ? 499 : 0 })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Premium Only (Paid users)</span>
                </label>
              </div>

              {form.isPremium && (
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="499"
                    min="0"
                  />
                  <p className="text-gray-500 text-xs mt-1">Set 0 for subscription-based access only</p>
                </div>
              )}

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
                  disabled={saving}
                  className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'all' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending ({pendingNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            Price & Coupons
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Premium Price Settings */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Premium Subscription Price</h2>
                  <p className="text-gray-400 text-sm">Set the price for NotesDrive Pro subscription</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">₹</span>
                  <input
                    type="number"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-10 pr-4 py-4 text-white text-2xl font-bold focus:outline-none focus:border-green-500"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Price'}
                </button>
              </div>
              
              <div className="flex gap-2 mt-4">
                {[99, 199, 299, 499, 999].map(price => (
                  <button
                    key={price}
                    onClick={() => setPremiumPrice(price)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      premiumPrice === price
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ₹{price}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Codes */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Tag className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Coupon Codes</h2>
                    <p className="text-gray-400 text-sm">Create discount codes for customers</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl font-bold"
                >
                  <Plus className="w-4 h-4" />
                  Add Coupon
                </button>
              </div>

              {/* Coupon Form */}
              {showCouponForm && (
                <form onSubmit={handleCreateCoupon} className="bg-gray-700/50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-300 text-xs mb-1">Code</label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white uppercase"
                        placeholder="SAVE20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1">Discount</label>
                      <input
                        type="number"
                        value={couponForm.discount}
                        onChange={(e) => setCouponForm({ ...couponForm, discount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1">Type</label>
                      <select
                        value={couponForm.type}
                        onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as 'percent' | 'flat' })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="percent">% Off</option>
                        <option value="flat">₹ Off</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1">Max Uses</label>
                      <input
                        type="number"
                        value={couponForm.maxUses}
                        onChange={(e) => setCouponForm({ ...couponForm, maxUses: parseInt(e.target.value) || 1 })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowCouponForm(false)}
                      className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg font-bold"
                    >
                      Create Coupon
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              {coupons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No coupons created yet
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between bg-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <code className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg font-bold text-lg">
                          {coupon.code}
                        </code>
                        <div>
                          <span className="text-white font-bold">
                            {coupon.type === 'percent' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                          </span>
                          <p className="text-gray-400 text-xs">
                            Used: {coupon.usedCount || 0} / {coupon.maxUses}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCoupon(coupon.id, coupon.active)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            coupon.active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {coupon.active ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Section - Only show when not on settings tab */}
        {activeTab !== 'settings' && (
          <>
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
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-orange-400">{pendingNotes.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Premium Notes</p>
            <p className="text-2xl font-bold text-purple-400">{notes.filter(n => n.isPremium).length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Downloads</p>
            <p className="text-2xl font-bold text-green-400">{notes.reduce((acc, n) => acc + (n.downloads || 0), 0)}</p>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          {activeTab === 'pending' && pendingNotes.length > 0 && (
            <div className="p-4 bg-orange-500/10 border-b border-orange-500/30">
              <p className="text-orange-400 text-sm font-medium">
                These notes are waiting for your approval. Click ✓ to approve or ✕ to reject.
              </p>
            </div>
          )}

          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {activeTab === 'pending' ? 'No pending notes to approve.' : 'No notes found. Add your first note!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredNotes.map((note) => (
                <div key={note.id} className="p-4 hover:bg-gray-700/30 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{note.title}</h3>
                      <p className="text-gray-500 text-sm">
                        {note.branch} - {note.semester} Sem • {note.university} • 
                        <span className="text-gray-400"> by {note.uploaderName || note.uploaderEmail || 'Unknown'}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs uppercase">{note.category}</span>
                      <button
                        onClick={() => handleTogglePremium(note.id, note.isPremium || false)}
                        className={`px-3 py-1 text-xs rounded-full font-bold transition-all ${
                          note.isPremium 
                            ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                        title={note.isPremium ? 'Click to make Free' : 'Click to make Premium'}
                      >
                        {note.isPremium ? '💎 Premium' : '🆓 Free'}
                      </button>
                      
                      {/* Price Edit */}
                      {editingPrice === note.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs"
                            placeholder="₹499"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSetPrice(note.id)}
                            className="p-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditingPrice(null); setPriceInput(''); }}
                            className="p-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingPrice(note.id); setPriceInput(String(note.price || 0)); }}
                          className="px-2 py-1 text-xs rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 font-bold"
                        >
                          ₹{note.price || 0}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {activeTab === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApprove(note.id)}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(note.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <a
                            href={note.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
