'use server'

import { redirect } from 'next/navigation';
import prisma from './db';
import { parseMarkdownToFlashcards } from './parseMarkdown';

export async function createDeckFromMarkdown(formData) {
  const file = formData.get('file');
  const deckName = formData.get('deckName');
  
  if (!file || !deckName) {
    throw new Error('File and deck name are required');
  }
  
  const markdown = await file.text();
  const flashcards = parseMarkdownToFlashcards(markdown);
  
  // Create the deck and cards in the database
  const deck = await prisma.deck.create({
    data: {
      name: deckName,
      cards: {
        create: flashcards
      }
    }
  });
  
  redirect(`/${deck.id}`);
}

export async function updateCardStatus(cardId, newStatus) {
  await prisma.card.update({
    where: { id: cardId },
    data: { status: newStatus }
  });
}

export async function resetDeck(deckId) {
  await prisma.card.updateMany({
    where: { deckId },
    data: { status: 'new' }
  });
}
