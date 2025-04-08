export function parseMarkdownToFlashcards(markdownContent) {
  const cards = [];
  
  // Split the markdown into individual flashcards
  const cardSections = markdownContent.split('---').filter(section => section.trim());
  
  // Process each card
  cardSections.forEach(section => {
    // Split each card into front and back parts
    const [front, back] = section.split('===').map(side => side.trim());
    
    if (front && back) {
      cards.push({
        front,
        back,
        status: 'new'
      });
    }
  });
  
  return cards;
}
