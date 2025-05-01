
import React, { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '../data/flashcards';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  card: FlashcardType;
  onFlip?: (isFlipped: boolean) => void;
  forceShowFront?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onFlip, forceShowFront = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset to front side when requested
  useEffect(() => {
    if (forceShowFront && isFlipped) {
      setIsFlipped(false);
    }
  }, [forceShowFront]);

  const toggleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    if (onFlip) {
      onFlip(newFlippedState);
    }
  };

  const getCategoryColor = () => {
    switch (card.category) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-blue-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className="relative w-full h-64 md:h-80 cursor-pointer perspective-1000"
      onClick={toggleFlip}
    >
      <div
        className={cn(
          "absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden bg-white border-2 border-gray-300 rounded-xl p-6 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-center">{card.front}</h2>
        </div>
        
        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden bg-blue-50 border-2 border-gray-300 rounded-xl p-6 flex items-center justify-center rotate-y-180">
          <p className="text-xl text-center">{card.back}</p>
        </div>
      </div>
      
      {/* Category indicator */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getCategoryColor()}`}></div>
    </div>
  );
};

export default Flashcard;
