'use client'

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { updateCardStatus } from '../lib/actions';

export default function Flashcard({ card, onRemove }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  let startX = 0;
  let currentX = 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current) return;

    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    // Move card with touch
    cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;
  };

  const handleTouchEnd = async () => {
    if (!cardRef.current) return;

    const deltaX = currentX - startX;

    if (deltaX > 100) {
      // Swiped right - Know
      cardRef.current.style.transform = 'translateX(1000px) rotate(30deg)';
      await updateCardStatus(card.id, 'know');
      onRemove(card.id);
    } else if (deltaX < -100) {
      // Swiped left - Relearn
      cardRef.current.style.transform = 'translateX(-1000px) rotate(-30deg)';
      await updateCardStatus(card.id, 'relearn');
      onRemove(card.id);
    } else {
      // Return to center
      cardRef.current.style.transform = 'translateX(0) rotate(0)';
    }
  };

  return (
    <div
      ref={cardRef}
      className="w-full max-w-xl h-80 bg-white rounded-xl shadow-lg transition-all duration-300 cursor-pointer relative" // Increased size: max-w-lg h-80
      onClick={handleFlip}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Front Side */}
      <div className={`absolute inset-0 w-full h-full ${isFlipped ? 'hidden' : 'flex'} flex-col overflow-hidden rounded-xl`}> {/* Moved positioning to inner divs */}
        <div className="p-6 flex-grow overflow-y-auto"> {/* Use flex-grow and overflow-y-auto */}
          <div className="prose max-w-full h-full"> {/* Ensure prose takes full height */}
            <ReactMarkdown>{card.front}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div className={`absolute inset-0 w-full h-full ${isFlipped ? 'flex' : 'hidden'} flex-col bg-blue-50 rounded-xl overflow-hidden`}> {/* Moved positioning to inner divs */}
        <div className="p-6 flex-grow overflow-y-auto"> {/* Use flex-grow and overflow-y-auto */}
          <div className="prose max-w-full h-full"> {/* Ensure prose takes full height */}
             <ReactMarkdown>{card.back}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
