"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


export default function DevisPage() {
  // à mettre en bdd ou non
  const societe = {
    nom: "Pledge & Grow",
    adresse: "4 B RUE ALFRED NOBEL",
    codePostal: "77420",
    ville: "CHAMPS-SUR-MARNE",
    siret: "93157766200014",
    tva: "FR38931577662",
    tel: "01 23 45 67 89",
  };

  const [typeDoc, setTypeDoc] = useState("devis");
  const [client, setClient] = useState({
    nom: "",
    prenom: "",
    societe: "",
    adresse: "",
    codePostal: "",
    ville: "",
    siret: "",
    email: "",
    tel: "",
  });

  const [dates, setDates] = useState({
    dateDevis: "",
    validite: "",
    dateFacturation: "",
    dateLivraison: "",
    echeance: "",
  });

  const [prestations, setPrestations] = useState([
    { description: "", quantite: 1, prixHT: 0 },
  ]);

  const [infoSupp, setInfoSupp] = useState("");

  const addPrestation = () => {
    setPrestations([
      ...prestations,
      { description: "", quantite: 1, prixHT: 0 },
    ]);
  };

  const handlePrestationChange = (index, field, value) => {
    const updated = [...prestations];
    updated[index][field] =
      field === "quantite" || field === "prixHT" ? Number(value) : value;
    setPrestations(updated);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      if (response.ok) {
        alert("Données sauvegardées avec succès !");
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
  };

  const totalHT = prestations.reduce(
    (acc, item) => acc + item.quantite * item.prixHT,
    0
  );
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;

  const generatePDF = () => {
    const doc = new jsPDF();

    // Couleurs & styles
    const blue = "#1E90FF";
    const gray = "#6b7280";
    const marginLeft = 10;
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(blue);
    doc.text(typeDoc === "devis" ? "DEVIS" : "FACTURE", 105, y, {
      align: "center",
    });

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(gray);

    doc.text("Société :", marginLeft, y);
    doc.setFont(undefined, "normal");
    doc.text("Client :", 200, y, { align: "right" });
    y += 5;
    doc.text(`${client.nom}`, 200, y, { align: "right" });

    const societeLigne = [
      societe.nom,
      societe.adresse,
      `${societe.codePostal} ${societe.ville}`,
      `SIRET : ${societe.siret}`,
      `TVA : ${societe.tva}`,
      `Tel : ${societe.tel}`,
    ];

    const clientLigne = [
      `${client.prenom} ${client.nom}`,
      client.societe,
      client.adresse,
      `${client.codePostal} ${client.ville}`,
      `SIRET : ${client.siret}`,
      `Email : ${client.email}`,
      `Tel : ${client.tel}`,
    ];

    societeLigne.forEach((line, idx) => {
      doc.text(line, marginLeft, y + idx * 5);
      doc.text(clientLigne[idx] || "", 200, y + idx * 5, { align: "right" });
    });

    y += societeLigne.length * 5 + 10;

    // Dates
    doc.setTextColor(0);
    if (typeDoc === "devis") {
      doc.text(`Date du devis : ${dates.dateDevis}`, marginLeft, y);
      doc.text(`Validité : ${dates.validite}`, 200, y, { align: "right" });
    } else {
      doc.text(`Facturation : ${dates.dateFacturation}`, marginLeft, y);
      doc.text(`Livraison : ${dates.dateLivraison}`, 140, y); // Déplace plus à droite
      y += 5;
      doc.text(`Échéance : ${dates.echeance}`, marginLeft, y);
    }

    y += 10;

    // Prestations en tableau
    autoTable(doc, {
      startY: y,
      head: [["Description", "Quantité", "Prix HT", "Total HT"]],
      body: prestations.map((p) => [
        p.description,
        p.quantite,
        `${p.prixHT.toFixed(2)}€`,
        `${(p.quantite * p.prixHT).toFixed(2)}€`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { halign: "center" },
    });

    y = doc.lastAutoTable.finalY + 10;

    // Totaux
    doc.setFontSize(12);
    doc.setFont(undefined, "normal"); // Désactive le gras
    const rightMargin = 200;
    doc.text(`Total HT : ${totalHT.toFixed(2)}€`, rightMargin, y, {
      align: "right",
    });
    y += 6;
    doc.text(`TVA (20%) : ${tva.toFixed(2)}€`, rightMargin, y, {
      align: "right",
    });
    y += 6;
    doc.text(`Total TTC : ${totalTTC.toFixed(2)}€`, rightMargin, y, {
      align: "right",
    });

    // Infos supp
    if (infoSupp) {
      y += 15;
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.setTextColor(gray);
      doc.text("Informations complémentaires :", marginLeft, y);
      y += 5;
      doc.text(doc.splitTextToSize(infoSupp, 180), marginLeft, y);
    }

    doc.save(`${typeDoc}-${client.nom || "client"}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Créer {typeDoc === "devis" ? "un devis" : "une facture"}
      </h1>

      <div className="mb-6">
        <select
          value={typeDoc}
          onChange={(e) => setTypeDoc(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="devis">Devis</option>
          <option value="facture">Facture</option>
        </select>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Informations client
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const clientInput = e.currentTarget.elements.clientInput;
            fetch(`/api/clients?search=${clientInput.value}`)
              .then((res) => res.json())
              .then((clients) => {
                if (clients.length > 0) {
                  setClient(clients[0]);
                } else {
                  alert("Client non trouvé");
                }
              });
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="clientInput"
                placeholder="Rechercher un client"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white flex items-center justify-center w-11 h-9 rounded-full ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "prenom",
            "nom",
            "societe",
            "adresse",
            "codePostal",
            "ville",
            "siret",
            "email",
            "tel",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                onChange={(e) =>
                  setClient({ ...client, [field]: e.target.value })
                }
                value={client[field]}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {typeDoc === "devis" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date du devis
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setDates({ ...dates, dateDevis: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Validité
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30 jours"
                  onChange={(e) =>
                    setDates({ ...dates, validite: e.target.value })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date de facturation
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setDates({ ...dates, dateFacturation: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date de livraison
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setDates({ ...dates, dateLivraison: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Échéance paiement
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30 jours"
                  onChange={(e) =>
                    setDates({ ...dates, echeance: e.target.value })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Prestations
        </h2>
        <div className="space-y-4">
          {prestations.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-md border border-gray-200"
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) =>
                    handlePrestationChange(i, "description", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Quantité"
                  value={p.quantite}
                  onChange={(e) =>
                    handlePrestationChange(i, "quantite", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Prix HT
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Prix HT"
                  value={p.prixHT}
                  onChange={(e) =>
                    handlePrestationChange(i, "prixHT", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addPrestation}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          + Ajouter une ligne
        </button>

        <div className="mt-6 p-4 bg-white rounded-md border border-gray-200">
          <div className="space-y-2 text-right">
            <p className="text-gray-600">Total HT : {totalHT.toFixed(2)}€</p>
            <p className="text-gray-600">TVA (20%) : {tva.toFixed(2)}€</p>
            <p className="text-xl font-bold text-gray-800">
              Total TTC : {totalTTC.toFixed(2)}€
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Informations complémentaires
        </h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
          onChange={(e) => setInfoSupp(e.target.value)}
          placeholder="Conditions de paiement, mentions légales, etc."
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Sauvegarder
        </button>
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Télécharger PDF
        </button>
      </div>
    </div>
  );
}
