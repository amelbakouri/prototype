"use client";

import useDevisState from "@/components/useDevisState";
import { generatePDF } from "@/components/generatePDF";
import ClientForm from "@/components/ClientForm";
import DateSection from "@/components/DateSection";
import PrestationsSection from "@/components/PrestationsSection";
import DocumentActions from "@/components/DocumentActions";
import societe from "@/components/societeInfo";


export default function DevisPage() {
  const {
    typeDoc,
    setTypeDoc,
    client,
    setClient,
    dates,
    setDates,
    prestations,
    setPrestations,
    infoSupp,
    setInfoSupp,
    addPrestation,
    handlePrestationChange,
    totalHT,
    tva,
    totalTTC,
  } = useDevisState();


  const handleSave = async () => {
    const response = await fetch("/api/devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        typeDoc,
        client,
        dates,
        prestations,
        infoSupp,
        totalHT,
        tva,
        totalTTC,
      }),
    });
    const result = await response.json();
    alert(
      response.ok ? "Données sauvegardées !" : "Erreur : " + result.message
    );
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto p-6 ">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Créer {typeDoc === "devis" ? "un devis" : "une facture"}
        </h1>

        <select
          value={typeDoc}
          onChange={(e) => setTypeDoc(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="devis">Devis</option>
          <option value="facture">Facture</option>
        </select>

        <ClientForm client={client} setClient={setClient} />
        <DateSection typeDoc={typeDoc} dates={dates} setDates={setDates} />
        <PrestationsSection
          prestations={prestations}
          handleChange={handlePrestationChange}
          addPrestation={addPrestation}
        />
        <DocumentActions
          infoSupp={infoSupp}
          setInfoSupp={setInfoSupp}
          totalHT={totalHT}
          tva={tva}
          totalTTC={totalTTC}
          onSave={handleSave}
          onGeneratePDF={() =>
            generatePDF({
              typeDoc,
              societe: societe,
              client,
              dates,
              prestations,
              totalHT,
              tva,
              totalTTC,
              infoSupp,
            })
          }
        />
      </div>
    </div>
  );
}
