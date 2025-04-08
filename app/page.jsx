import FlashcardUpload from './components/FlashcardUpload';
import prisma from './lib/db';
import Link from 'next/link';

export default async function Home() {
  const decks = await prisma.deck.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { cards: true } } }
  });
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Markdown Flashcard App</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <FlashcardUpload />
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Flashcard Decks</h2>
          
          {decks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {decks.map(deck => (
                <li key={deck.id} className="py-3">
                  <Link 
                    href={`/${deck.id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium flex justify-between items-center"
                  >
                    <span>{deck.name}</span>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {deck._count.cards} cards
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No flashcard decks yet. Create your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
