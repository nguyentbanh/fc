import './globals.css';

export const metadata = {
  title: 'Markdown Flashcard App',
  description: 'Create and study flashcards from Markdown files',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-blue-700 text-white p-4"> {/* Restored padding */}
          <div className="max-w-6xl mx-auto"> {/* Added container div */}
            <h1 className="text-2xl font-bold">Markdown Flashcard App</h1> {/* Added title */}
            <p className="text-blue-200">Study smarter with custom flashcards</p> {/* Added subtitle */}
          </div> {/* Closed container div */}
        </header>

        <main className="py-8">
          {children}
        </main>

        {/* Added footer back */}
        <footer className="bg-gray-100 border-t p-4 text-center text-gray-600 text-sm">
          <p>Markdown Flashcard App - Built with Next.js</p>
        </footer>
      </body>
    </html>
  );
}
