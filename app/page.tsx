"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
      <main className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Bienvenue au générateur de documents
        </h1>
        <p className="text-gray-600 mb-8">
          Créez rapidement vos devis, factures et autres documents administratifs.
        </p>
        <Link href="/devis">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300">
            Accéder à l’espace Devis / Facture
          </button>
        </Link>
        <Link href="/contrat">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 mt-5 rounded-xl transition duration-300">
            Accéder à l’espace Contrat
          </button>
        </Link>
      </main>
    </div>
  );
}
