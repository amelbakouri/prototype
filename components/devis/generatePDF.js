import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDF({ typeDoc, societe, client, dates, prestations, totalHT, tva, totalTTC, infoSupp }) {
  const doc = new jsPDF();
  const blue = "#1E90FF";
  const gray = "#6b7280";
  const marginLeft = 10;
  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor(blue);
  doc.text(typeDoc === "devis" ? "DEVIS" : "FACTURE", 105, y, { align: "center" });

  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(gray);

  const societeLigne = [
    societe.nom, societe.adresse,
    `${societe.codePostal} ${societe.ville}`,
    `SIRET : ${societe.siret}`, `TVA : ${societe.tva}`,
    `Tel : ${societe.tel}`
  ];

  const clientLigne = [
    `${client.prenom} ${client.nom}`, client.societe,
    client.adresse, `${client.codePostal} ${client.ville}`,
    `SIRET : ${client.siret}`, `Email : ${client.email}`, `Tel : ${client.tel}`
  ];

  societeLigne.forEach((line, idx) => {
    doc.text(line, marginLeft, y + idx * 5);
    doc.text(clientLigne[idx] || "", 200, y + idx * 5, { align: "right" });
  });

  y += societeLigne.length * 5 + 10;
  doc.setTextColor(0);

  if (typeDoc === "devis") {
    doc.text(`Date du devis : ${dates.dateDevis}`, marginLeft, y);
    doc.text(`Validité : ${dates.validite}`, 200, y, { align: "right" });
  } else {
    doc.text(`Facturation : ${dates.dateFacturation}`, marginLeft, y);
    doc.text(`Livraison : ${dates.dateLivraison}`, 140, y);
    y += 5;
    doc.text(`Échéance : ${dates.echeance}`, marginLeft, y);
  }

  y += 10;

  autoTable(doc, {
    startY: y,
    head: [["Description", "Quantité", "Prix HT", "Total HT"]],
    body: prestations.map(p => [
      p.description, p.quantite,
      `${p.prixHT.toFixed(2)}€`,
      `${(p.quantite * p.prixHT).toFixed(2)}€`
    ]),
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235] },
    styles: { halign: "center" }
  });

  y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  const rightMargin = 200;
  doc.text(`Total HT : ${totalHT.toFixed(2)}€`, rightMargin, y, { align: "right" });
  y += 6;
  doc.text(`TVA (20%) : ${tva.toFixed(2)}€`, rightMargin, y, { align: "right" });
  y += 6;
  doc.text(`Total TTC : ${totalTTC.toFixed(2)}€`, rightMargin, y, { align: "right" });

  if (infoSupp) {
    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(gray);
    doc.text("Informations complémentaires :", marginLeft, y);
    y += 5;
    doc.text(doc.splitTextToSize(infoSupp, 180), marginLeft, y);
  }

  doc.save(`${typeDoc}-${client.nom || "client"}.pdf`);
}
