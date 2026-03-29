import React, { useState, useCallback } from 'react';
import { db, storage, OperationType, handleFirestoreError } from '../lib/firebase';
import { useFirebase } from '../context/FirebaseContext';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Search,
  Bell,
  UploadCloud,
  Clock,
  ChevronRight,
  ShieldCheck,
  FileUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export default function Upload() {
  const { user, userProfile, loading: authLoading } = useFirebase();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [price, setPrice] = useState('');
  const [university, setUniversity] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf')) {
      setError('Please upload a PDF, DOCX, or an image.');
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit as per template
      setError('File size must be less than 50MB.');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setUploadProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to upload.');
      return;
    }
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // 1. Upload file to Firebase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const storageRef = ref(storage, `notes/${user.uid}/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        }, 
        (err) => {
          console.error('Upload error:', err);
          setError(err.message || 'Failed to upload file.');
          setUploading(false);
        }, 
        async () => {
          // Upload completed successfully, now get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          try {
            // 2. Save metadata to Firestore
            await addDoc(collection(db, 'notes'), {
              title,
              description,
              fileUrl: downloadURL,
              uploadedBy: user.uid,
              category,
              price: parseFloat(price) || 0,
              university,
              courseCode,
              createdAt: serverTimestamp(),
              status: 'published',
              views: 0,
              downloads: 0
            });

            setSuccess(true);
            setUploading(false);
            setFile(null);
            setTitle('');
            setDescription('');
            setPrice('');
            setUniversity('');
            setCourseCode('');
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.CREATE, 'notes');
          }
        }
      );

    } catch (err: any) {
      console.error('Overall error:', err);
      setError(err.message || 'Failed to upload. Please try again.');
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="bg-primary-container/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8">
          <UploadCloud className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-4 tracking-tight">Login to Contribute</h2>
        <p className="text-on-surface-variant max-w-md mb-10 text-lg">Share your knowledge with the global student community and earn rewards for your high-quality notes.</p>
        <Link 
          to="/auth"
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1"
        >
          Login / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-black tracking-tighter text-primary font-headline">NotesDrive</Link>
            <div className="hidden md:flex gap-8">
              <Link to="/notes" className="text-on-surface-variant font-bold hover:text-primary transition-colors font-label text-xs uppercase tracking-widest">Marketplace</Link>
              <Link to="/dashboard" className="text-on-surface-variant font-bold hover:text-primary transition-colors font-label text-xs uppercase tracking-widest">Dashboard</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-surface-container-high px-4 py-2 rounded-xl">
              <Search className="text-outline w-4 h-4" />
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48 font-body ml-2 outline-none" placeholder="Search knowledge..." type="text"/>
            </div>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
              ) : (
                userProfile?.displayName?.[0] || user.email?.[0]?.toUpperCase()
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-5 space-y-10">
            <header>
              <h1 className="font-headline font-extrabold text-5xl tracking-tight text-on-surface">Knowledge Intake</h1>
              <p className="text-on-surface-variant mt-3 text-lg font-body">Precision-engineered contribution portal.</p>
            </header>

            {/* File Drop Zone */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={`group relative border-2 border-dashed ${file ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50 bg-surface-container-low'} transition-all duration-300 p-12 text-center rounded-3xl flex flex-col items-center justify-center min-h-[360px] cursor-pointer`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input 
                type="file" 
                id="file-input" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.docx,image/*"
              />
              <div className={`mb-6 p-5 rounded-3xl ${file ? 'bg-primary text-white' : 'bg-primary-fixed text-primary'}`}>
                <FileUp className="w-10 h-10" />
              </div>
              <h3 className="font-headline font-bold text-2xl mb-2 text-on-surface">
                {file ? 'Document Ready' : 'Drag & Drop Documents'}
              </h3>
              <p className="text-on-surface-variant text-sm font-body max-w-xs mx-auto mb-8">
                {file ? file.name : 'PDF, DOCX, or LaTeX files up to 50MB. High-resolution scans preferred for archival quality.'}
              </p>
              <button className="bg-surface-container-highest text-on-surface px-8 py-3 font-bold font-headline text-sm rounded-xl hover:translate-x-1 transition-transform border-none">
                {file ? 'Change File' : 'Browse Files'}
              </button>
            </div>

            {/* Preview Area */}
            <div className="bg-surface-container p-8 rounded-3xl">
              <div className="flex justify-between items-center mb-8">
                <span className="font-label text-xs font-bold uppercase tracking-widest text-primary">Preview Stack</span>
                <span className="bg-primary-container/20 text-primary px-3 py-1 font-label text-[10px] font-bold rounded-lg uppercase tracking-widest">
                  {uploading ? `${uploadProgress}% Complete` : file ? 'Ready' : 'Waiting'}
                </span>
              </div>
              
              <div className="relative h-64 w-full flex items-center justify-center">
                {/* Simulated Stack */}
                <div className="absolute w-44 h-56 bg-surface-container-lowest shadow-sm rounded-xl transform translate-x-4 -rotate-3 opacity-40"></div>
                <div className="absolute w-44 h-56 bg-surface-container-lowest shadow-md rounded-xl transform translate-x-2 -rotate-1 opacity-70"></div>
                <div className="relative w-44 h-56 bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col">
                  {file ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="w-12 h-12 text-primary mb-2" />
                      <span className="text-[10px] font-bold text-on-surface truncate w-full">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex-1 bg-surface-container-high animate-pulse"></div>
                  )}
                  <div className="p-4 space-y-2 bg-surface-container-lowest">
                    <div className="h-1.5 w-3/4 bg-surface-container-high rounded"></div>
                    <div className="h-1.5 w-1/2 bg-surface-container-high rounded"></div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              {uploading && (
                <div className="mt-10 space-y-3">
                  <div className="flex justify-between font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <span className="truncate max-w-[200px]">Uploading: {file?.name}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-10 lg:p-14 shadow-2xl shadow-on-surface/5 rounded-3xl border border-outline-variant">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-headline font-bold text-on-surface mb-4">Upload Successful!</h2>
                    <p className="text-on-surface-variant mb-10 text-lg">Your knowledge contribution has been verified and published to the marketplace.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => setSuccess(false)}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
                      >
                        Upload Another
                      </button>
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-surface-container-highest text-on-surface px-10 py-4 rounded-2xl font-bold hover:bg-surface-container-high transition-all"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="font-headline font-bold text-3xl mb-10 border-l-8 border-primary pl-6 text-on-surface">Metadata Specs</h2>
                      
                      {error && (
                        <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-error">
                          <AlertCircle className="w-5 h-5" />
                          <p className="text-sm font-bold">{error}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                          <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Document Title</label>
                          <input 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-surface-container-low border-none p-5 font-body text-on-surface focus:ring-2 focus:ring-primary/40 rounded-2xl transition-all" 
                            placeholder="e.g. Advanced Thermodynamics - Midterm Prep 2024" 
                            type="text"
                          />
                        </div>
                        <div>
                          <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Category</label>
                          <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-surface-container-low border-none p-5 font-body text-on-surface focus:ring-2 focus:ring-primary/40 rounded-2xl transition-all appearance-none"
                          >
                            <option>Engineering</option>
                            <option>Computer Science</option>
                            <option>Pure Mathematics</option>
                            <option>Theoretical Physics</option>
                            <option>Medicine</option>
                            <option>Pharmacy</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Price Setting (INR)</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                            <input 
                              required
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full bg-surface-container-low border-none p-5 pl-10 font-body text-on-surface focus:ring-2 focus:ring-primary/40 rounded-2xl transition-all" 
                              placeholder="99" 
                              type="number" 
                              step="1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">University / Institution</label>
                          <input 
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            className="w-full bg-surface-container-low border-none p-5 font-body text-on-surface focus:ring-2 focus:ring-primary/40 rounded-2xl transition-all" 
                            placeholder="MIT, Stanford, Oxford..." 
                            type="text"
                          />
                        </div>
                        <div>
                          <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Course Code</label>
                          <input 
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            className="w-full bg-surface-container-low border-none p-5 font-body text-on-surface focus:ring-2 focus:ring-primary/40 rounded-2xl transition-all" 
                            placeholder="ME-401" 
                            type="text"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Detailed Synopsis</label>
                      <textarea 
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-surface-container-low border-none p-5 font-body text-on-surface focus:ring-2 focus:ring-primary/40 rounded-2xl transition-all resize-none" 
                        placeholder="Briefly describe the contents, key topics covered, and level of difficulty..." 
                        rows={5}
                      ></textarea>
                    </div>

                    {file && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl"
                      >
                        <ShieldCheck className="text-primary w-6 h-6" />
                        <span className="font-body text-sm text-primary font-bold">File integrity verified. Ready for archival.</span>
                      </motion.div>
                    )}

                    <div className="pt-6 flex flex-col sm:flex-row gap-5">
                      <button 
                        disabled={uploading || !file}
                        className="flex-1 bg-primary text-white px-10 py-5 font-headline font-extrabold text-xl rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
                        type="submit"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Publish To Marketplace'
                        )}
                      </button>
                      <button 
                        type="button"
                        className="sm:w-1/3 bg-surface-container-highest text-on-surface px-10 py-5 font-headline font-bold text-lg rounded-2xl hover:bg-surface-container-high transition-colors"
                      >
                        Save Draft
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-16 border-t border-outline-variant mt-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-black text-primary font-headline tracking-tighter">NotesDrive</span>
            <p className="mt-6 text-on-surface-variant text-sm font-body leading-relaxed">Precision Systems for High-Performance Knowledge Management.</p>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6">Resources</h4>
            <div className="flex flex-col gap-3">
              <a className="text-on-surface-variant text-sm font-body hover:text-primary transition-colors" href="#">Editorial Guidelines</a>
              <a className="text-on-surface-variant text-sm font-body hover:text-primary transition-colors" href="#">Hardware Support</a>
            </div>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6">Legal</h4>
            <div className="flex flex-col gap-3">
              <a className="text-on-surface-variant text-sm font-body hover:text-primary transition-colors" href="#">Terms</a>
              <a className="text-on-surface-variant text-sm font-body hover:text-primary transition-colors" href="#">Privacy</a>
            </div>
          </div>
          <div className="col-span-1">
            <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest leading-relaxed opacity-60">
              © {new Date().getFullYear()} NotesDrive Precision Systems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
