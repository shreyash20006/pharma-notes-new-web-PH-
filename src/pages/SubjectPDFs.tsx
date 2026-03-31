import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Eye, Star, FileText } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SubjectPDFs() {
  const { stream, branch, semester, subject } = useParams();
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPDFs();
  }, [subject]);

  const fetchPDFs = async () => {
    try {
      const notesRef = collection(db, 'notes');
      const q = query(
        notesRef,
        where('subject', '==', decodeURIComponent(subject || '')),
        where('status', 'in', ['approved', 'published'])
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPdfs(data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdf: any) => {
    try {
      // Open drive link
      if (pdf.driveLink || pdf.file_url) {
        window.open(pdf.driveLink || pdf.file_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          to={`/notes-library/${stream}/${branch || 'subjects'}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Subjects
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-sm font-bold capitalize">
              {semester}
            </span>
            <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-sm font-bold capitalize">
              {stream}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{decodeURIComponent(subject || '')}</h1>
          <p className="text-gray-400">Available study materials</p>
        </motion.div>

        {/* PDFs List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B31B8]"></div>
            <p className="text-gray-400 mt-4">Loading notes...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-20 bg-[#161B22] rounded-2xl border border-white/10">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Notes Available Yet</h3>
            <p className="text-gray-400 mb-6">Be the first to upload notes for this subject!</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-xl font-semibold transition-all"
            >
              Upload Notes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pdfs.map((pdf, index) => (
              <motion.div
                key={pdf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#161B22] border border-white/10 rounded-xl p-6 hover:border-[#3B31B8]/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#3B31B8] transition-colors">
                      {pdf.title}
                    </h3>
                    {pdf.description && (
                      <p className="text-gray-400 text-sm mb-4">{pdf.description}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {pdf.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {pdf.downloads || 0} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        {pdf.averageRating ? pdf.averageRating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(pdf)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-xl font-semibold transition-all whitespace-nowrap"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
