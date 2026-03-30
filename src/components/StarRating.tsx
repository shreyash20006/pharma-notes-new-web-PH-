import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  ratingCount?: number;
}

export default function StarRating({ 
  rating, 
  onRate, 
  readOnly = false, 
  size = 'md',
  showCount = false,
  ratingCount = 0
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isPartiallyFilled = star === Math.ceil(displayRating) && displayRating % 1 !== 0;
          
          return (
            <motion.button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => !readOnly && onRate?.(star)}
              onMouseEnter={() => !readOnly && setHoveredRating(star)}
              onMouseLeave={() => !readOnly && setHoveredRating(0)}
              whileHover={!readOnly ? { scale: 1.2 } : {}}
              whileTap={!readOnly ? { scale: 0.9 } : {}}
              className={`transition-all ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <Star
                className={`${sizeClasses[size]} transition-all ${
                  isFilled
                    ? 'fill-yellow-500 text-yellow-500'
                    : isPartiallyFilled
                    ? 'fill-yellow-500/50 text-yellow-500'
                    : 'fill-gray-700 text-gray-600'
                } ${!readOnly && 'hover:scale-110'}`}
              />
            </motion.button>
          );
        })}
      </div>
      
      {showCount && (
        <span className="text-sm text-gray-400">
          {rating.toFixed(1)} {ratingCount > 0 && `(${ratingCount})`}
        </span>
      )}
    </div>
  );
}
