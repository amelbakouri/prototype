"use client";

import { useState } from "react";
import ClientForm from "@/components/ClientForm";
import CDCForm from "@/components/cdc/CDCForm";
import DocumentActions from "@/components/cdc/DocumentActions";
import { generateCDCpdf } from "@/components/cdc/generateCDCpdf";

export default function CahierDesChargesPage() {
  const [client, setClient] = useState({});
  const [cdcData, setCdcData] = useState({
    contexte: "",
    objectifs: "",
    perimetre_fonctionnel: "",
    technologies: "",
    contraintes: "",
    budget: "",
    delai: "",
    acteurs_impliquees: "",
    validation_et_signature: "",
  });

  const handleSave = async () => {
    const response = await fetch("/api/cdc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client, ...cdcData }),
    });
    const result = await response.json();
    alert(response.ok ? "CDC sauvegardé !" : "Erreur : " + result.message);
  };

  const handleExport = () => {
    generateCDCpdf({ client, cdcData });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Créer un cahier des charges</h1>

        <ClientForm client={client} setClient={setClient} />
        <CDCForm data={cdcData} setData={setCdcData} />
        <DocumentActions onSave={handleSave} onExport={handleExport} />
      </div>
    </div>
  );
}
