'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/')
    } else {
      alert("Erreur lors de l'inscription")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Inscription</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="nom"
            placeholder="Nom"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="prenom"
            placeholder="Prénom"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            S'inscrire
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  )
}
