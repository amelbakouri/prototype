import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateContratPDF(form) {
  const doc = new jsPDF();
  const blue = "#1E90FF";
  const gray = "#6b7280";
  const marginLeft = 15;
  const rightAlign = 200;
  let y = 20;

  const { objet, date_debut, date_fin, duree, modalites_resiliation, modalites_paiement, obligations, clauses_juridiques, lieu_signature, date_signature, client } = form;

  // Titre
  doc.setFontSize(18);
  doc.setTextColor(blue);
  doc.text("CONTRAT", 105, y, { align: "center" });

  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(gray);

  // Infos société (exemple fictif)
  const societe = {
    nom: "Pledge & Grow",
    adresse: "12 rue des Lilas",
    code_postal: "75000",
    ville: "Paris",
    siret: "123 456 789 00012",
    tel: "01 23 45 67 89",
  };

  const societeLigne = [
    societe.nom, societe.adresse,
    `${societe.code_postal} ${societe.ville}`,
    `SIRET : ${societe.siret}`, `Tel : ${societe.tel}`
  ];

  const clientLigne = [
    `${client.prenom} ${client.nom}`, client.societe,
    client.adresse, `${client.code_postal} ${client.ville}`,
    `SIRET : ${client.siret}`, `Email : ${client.email}`, `Tel : ${client.tel}`
  ];

  societeLigne.forEach((line, idx) => {
    doc.text(line, marginLeft, y + idx * 5);
    doc.text(clientLigne[idx] || "", rightAlign, y + idx * 5, { align: "right" });
  });

  y += societeLigne.length * 5 + 10;
  doc.setTextColor(0);
  doc.setFontSize(12);

  // Section contrat
  const sections = [
    ["Objet", objet],
    ["Date de début", date_debut],
    ["Date de fin", date_fin],
    ["Durée", duree],
    ["Modalités de résiliation", modalites_resiliation],
    ["Modalités de paiement", modalites_paiement],
    ["Obligations", obligations],
    ["Clauses juridiques", clauses_juridiques],
    ["Lieu de signature", lieu_signature],
    ["Date de signature", date_signature],
  ];

  sections.forEach(([titre, contenu]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont(undefined, "bold");
    doc.text(`${titre} :`, marginLeft, y);
    doc.setFont(undefined, "normal");
    y += 6;
    const textLines = doc.splitTextToSize(contenu, 180);
    doc.text(textLines, marginLeft, y);
    y += textLines.length * 5 + 4;
  });

  doc.save(`Contrat-${client.nom || "client"}.pdf`);
}
