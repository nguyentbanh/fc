import { notFound } from 'next/navigation';
import FlashcardDeck from '../components/FlashcardDeck';
import prisma from '../lib/db';
import Link from 'next/link';
import { resetDeck } from '../lib/actions';

export default async function DeckPage({ params }) {
  const deck = await prisma.deck.findUnique({
    where: { id: params.deck },
    include: { cards: true }
  });
  
  if (!deck) {
    notFound();
  }
  
  // Group cards by their status
  const newCards = deck.cards.filter(card => card.status === 'new');
  const knowCards = deck.cards.filter(card => card.status === 'know');
  const relearnCards = deck.cards.filter(card => card.status === 'relearn');
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          &larr; Back to all decks
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">{deck.name}</h1>
      
      {/* Added justify-center to center the boxes */}
      <div className="mb-8 flex justify-center space-x-4 text-center">
        <div className="px-4 py-2 bg-gray-100 rounded">
          <div className="text-2xl font-bold">{newCards.length}</div>
          <div className="text-sm text-gray-600">New</div>
        </div>
        <div className="px-4 py-2 bg-green-100 rounded">
          <div className="text-2xl font-bold">{knowCards.length}</div>
          <div className="text-sm text-gray-600">Know</div>
        </div>
        <div className="px-4 py-2 bg-red-100 rounded">
          <div className="text-2xl font-bold">{relearnCards.length}</div>
          <div className="text-sm text-gray-600">Relearn</div>
        </div>
      </div>
      
      {newCards.length > 0 ? (
        <FlashcardDeck cards={newCards} />
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">All cards reviewed!</h3>
          <p className="text-gray-600 mb-4">
            You've gone through all the flashcards in this deck.
          </p>
          
          <form action={async () => {
            'use server';
            await resetDeck(deck.id);
          }}>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              type="submit"
            >
              Reset Deck
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
