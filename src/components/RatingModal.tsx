import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StarRating from './StarRating';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteTitle: string;
  userId: string;
  userEmail: string;
}

export default function RatingModal({ 
  isOpen, 
  onClose, 
  noteId, 
  noteTitle, 
  userId, 
  userEmail 
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Check if user already rated this note
      const ratingsRef = collection(db, 'ratings');
      const q = query(ratingsRef, where('noteId', '==', noteId), where('userId', '==', userId));
      const existingRatings = await getDocs(q);

      if (!existingRatings.empty) {
        // Update existing rating
        const ratingDoc = existingRatings.docs[0];
        await updateDoc(doc(db, 'ratings', ratingDoc.id), {
          rating,
          comment,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new rating
        await addDoc(collection(db, 'ratings'), {
          noteId,
          userId,
          userEmail,
          rating,
          comment,
          createdAt: serverTimestamp()
        });
      }

      // Update note's average rating
      await updateNoteRating(noteId);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setRating(0);
        setComment('');
        setSuccess(false);
      }, 1500);

    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateNoteRating = async (noteId: string) => {
    try {
      // Get all ratings for this note
      const ratingsRef = collection(db, 'ratings');
      const q = query(ratingsRef, where('noteId', '==', noteId));
      const ratingsSnapshot = await getDocs(q);

      const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
        : 0;
      const ratingCount = ratings.length;

      // Update note document
      await updateDoc(doc(db, 'notes', noteId), {
        averageRating,
        ratingCount,
        updatedAt: serverTimestamp()
      });

    } catch (err) {
      console.error('Error updating note rating:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#161B22] border border-white/10 rounded-2xl p-6 max-w-md w-full relative"
        >
          {success ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Star className="w-10 h-10 text-green-500 fill-green-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-gray-400">Your rating has been submitted successfully.</p>
            </div>
          ) : (
            <>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold text-white mb-2">Rate This Note</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-1">{noteTitle}</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">Your Rating</label>
                  <div className="flex justify-center">
                    <StarRating
                      rating={rating}
                      onRate={setRating}
                      size="lg"
                    />
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-gray-400 text-sm mt-2">
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this note..."
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#3B31B8] resize-none"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="flex-1 px-6 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
