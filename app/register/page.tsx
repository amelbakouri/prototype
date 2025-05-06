'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nom" placeholder="Nom" onChange={handleChange} className="w-full p-2 border" />
        <input name="prenom" placeholder="Prénom" onChange={handleChange} className="w-full p-2 border" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" />
        <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} className="w-full p-2 border" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">S'inscrire</button>
      </form>
    </div>
  );
}
