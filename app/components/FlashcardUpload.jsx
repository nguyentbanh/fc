'use client'

import { useState } from 'react';
import { createDeckFromMarkdown } from '../lib/actions';

export default function FlashcardUpload() {
  const [fileName, setFileName] = useState('');
  
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create a New Flashcard Deck</h2>
      <form action={createDeckFromMarkdown}>
        <div className="mb-4">
          <label htmlFor="deckName" className="block text-sm font-medium mb-1">
            Deck Name
          </label>
          <input
            type="text"
            id="deckName"
            name="deckName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="file" className="block text-sm font-medium mb-1">
            Markdown File
          </label>
          <div className="flex items-center">
            <label className="flex flex-col items-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <span className="text-base text-gray-700">
                {fileName || 'Choose file'}
              </span>
              <input
                id="file"
                name="file"
                type="file"
                accept=".md"
                required
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Format: Content separated by --- with front/back divided by ===
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Flashcard Deck
        </button>
      </form>
    </div>
  );
}
