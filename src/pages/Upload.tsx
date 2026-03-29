import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Link } from 'react-router-dom';

export default function Upload() {
  const { user, profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or an image (JPEG, PNG, WEBP).');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
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

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notes-files')
        .getPublicUrl(filePath);

      // 3. Save metadata to notes table
      const { error: dbError } = await supabase
        .from('notes')
        .insert([
          {
            title,
            description,
            file_url: publicUrl,
            uploaded_by: user.id
          }
        ]);

      if (dbError) throw dbError;

      setSuccess(true);
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload. Make sure your Supabase bucket and table are correctly configured.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <UploadIcon className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login to Upload Notes</h2>
        <p className="text-gray-500 mb-8">Share your knowledge with fellow students and earn rewards.</p>
        <Link 
          to="/auth"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Login / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Study Notes</h1>
        <p className="text-gray-500">Help your peers by sharing high-quality pharmacy notes.</p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-100 rounded-3xl p-12 text-center"
          >
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Upload Successful!</h2>
            <p className="text-green-700 mb-8">Your notes have been added to the library and are now available for other students.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
            >
              Upload Another Note
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6"
          >
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Title</label>
              <input 
                type="text" 
                required
                placeholder="Enter a title for your upload"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea 
                required
                rows={4}
                placeholder="Provide a brief description of the content"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">File (PDF or Image)</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  required
                  onChange={handleFileChange}
                  className="hidden" 
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all"
                >
                  {file ? (
                    <div className="flex flex-col items-center text-blue-600">
                      <FileText className="h-12 w-12 mb-2" />
                      <span className="font-bold">{file.name}</span>
                      <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <UploadIcon className="h-12 w-12 mb-2" />
                      <span className="font-bold">Click to select file</span>
                      <span className="text-xs">PDF, JPG, PNG (Max 10MB)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="h-5 w-5" />
                  Publish Note
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
