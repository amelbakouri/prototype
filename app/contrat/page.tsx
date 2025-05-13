"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateContratPDF } from "@/components/generateContratPDF";

export default function ContratPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const [form, setForm] = useState({
    objet: "",
    date_debut: "",
    date_fin: "",
    duree: "",
    modalites_resiliation: "",
    modalites_paiement: "",
    obligations: "",
    clauses_juridiques: "",
    lieu_signature: "",
    date_signature: "",
    client: {
      nom: "",
      prenom: "",
      societe: "",
      adresse: "",
      code_postal: "",
      ville: "",
      siret: "",
      email: "",
      tel: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("client.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        client: {
          ...prev.client,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/contrat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Contrat ajouté avec succès.");
        router.refresh();
      } else {
        setMessage(data.message || "Erreur lors de l'ajout du contrat");
      }
    } catch (err) {
      setMessage("Erreur réseau ou serveur");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6 bg-white p-8 rounded-2xl shadow-lg">
        {message && (
          <p className="mb-4 text-sm text-blue-600 bg-blue-100 p-2 rounded">
            {message}
          </p>
        )}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Créer un contrat
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {[
            { name: "objet", label: "Objet" },
            { name: "duree", label: "Durée" },
            {
              name: "modalites_resiliation",
              label: "Modalités de résiliation",
            },
            { name: "modalites_paiement", label: "Modalités de paiement" },
            { name: "lieu_signature", label: "Lieu de signature" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          ))}

          {[
            { name: "date_debut", label: "Date de début" },
            { name: "date_fin", label: "Date de fin" },
            { name: "date_signature", label: "Date de signature" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="date"
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          ))}

          {[
            { name: "obligations", label: "Obligations" },
            { name: "clauses_juridiques", label: "Clauses juridiques" },
          ].map(({ name, label }) => (
            <div key={name} className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={inputStyle}
                rows={4}
                required
              />
            </div>
          ))}

          <div className="sm:col-span-2 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Informations client
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(form.client).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <input
                    name={`client.${key}`}
                    value={value}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed me-3"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>

            <button
              type="button"
              onClick={() => generateContratPDF(form)}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md transition"
            >
              Exporter en PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
