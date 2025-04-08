'use client'

import { useState } from 'react';
import { updateCardStatus } from '../lib/actions';
import Flashcard from './Flashcard';

export default function FlashcardDeck({ cards: initialCards }) {
  const [cards, setCards] = useState(initialCards);
  
  const handleRemoveCard = (cardId) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  };
  
  const handleKnow = async () => {
    if (cards.length === 0) return;
    
    const currentCard = cards[0];
    await updateCardStatus(currentCard.id, 'know');
    handleRemoveCard(currentCard.id);
  };
  
  const handleRelearn = async () => {
    if (cards.length === 0) return;
    
    const currentCard = cards[0];
    await updateCardStatus(currentCard.id, 'relearn');
    handleRemoveCard(currentCard.id);
  };
  
  if (cards.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">All cards reviewed!</h3>
        <p className="text-gray-600 mb-4">You've gone through all the flashcards in this deck.</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <p className="text-gray-600">{cards.length} cards remaining</p>
      </div>
      
      <div className="w-full max-w-md mb-8">
        {cards.length > 0 && (
          <Flashcard card={cards[0]} onRemove={handleRemoveCard} />
        )}
      </div>
      
      <div className="flex gap-4">
        <button 
          className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          onClick={handleRelearn}
        >
          Relearn
        </button>
        
        <button 
          className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          onClick={handleKnow}
        >
          Know
        </button>
      </div>
    </div>
  );
}
