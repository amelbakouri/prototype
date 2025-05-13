"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        <a href="/">Générateur de Documents</a>
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
}
