'use client'; // si tu es dans /app

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          Générateur de Documents
        </div>
        <div>
          <Link href="/devis">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Devis / Facture
            </button>
          </Link>
        </div>
      </nav>

      {/* Contenu central */}
      <main className="flex items-center justify-center h-[calc(100vh-64px)]">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center">
          Bienvenue au générateur de documents
        </h1>
      </main>
    </div>
  );
}
