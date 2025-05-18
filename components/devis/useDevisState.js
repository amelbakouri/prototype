import { useState } from "react";

export default function useDevisState() {
  const [typeDoc, setTypeDoc] = useState("devis");
  const [client, setClient] = useState({
    nom: "", prenom: "", societe: "", adresse: "",
    codePostal: "", ville: "", siret: "", email: "", tel: ""
  });

  const [dates, setDates] = useState({
    dateDevis: "", validite: "",
    dateFacturation: "", dateLivraison: "", echeance: ""
  });

  const [prestations, setPrestations] = useState([
    { description: "", quantite: 1, prixHT: 0 }
  ]);

  const [infoSupp, setInfoSupp] = useState("");

  const addPrestation = () => {
    setPrestations([...prestations, { description: "", quantite: 1, prixHT: 0 }]);
  };

  const handlePrestationChange = (index, field, value) => {
    const updated = [...prestations];
    updated[index][field] = field === "quantite" || field === "prixHT" ? Number(value) : value;
    setPrestations(updated);
  };

  const totalHT = prestations.reduce((acc, item) => acc + item.quantite * item.prixHT, 0);
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;

  return {
    typeDoc, setTypeDoc,
    client, setClient,
    dates, setDates,
    prestations, setPrestations,
    infoSupp, setInfoSupp,
    addPrestation, handlePrestationChange,
    totalHT, tva, totalTTC
  };
}
