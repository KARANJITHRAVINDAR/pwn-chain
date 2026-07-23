import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ rating, max = 5, interactive = false, onRatingChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= currentRating;

        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={`flex items-center justify-center p-0.5 transition-transform duration-100 ${
              interactive ? 'cursor-pointer hover:scale-110 focus:outline-none' : ''
            }`}
            aria-label={interactive ? `Rate ${starValue} stars out of ${max}` : undefined}
          >
            <Star
              size={interactive ? 24 : 16}
              className={isFilled ? 'fill-terracotta text-terracotta' : 'text-charcoal-light opacity-30'}
              fill={isFilled ? '#C97C5D' : 'none'}
            />
          </button>
        );
      })}
    </div>
  );
}

