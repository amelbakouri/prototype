import { jsPDF } from "jspdf";
import societe from "@/components/societeInfo";

export function generateCDCpdf({ client, cdcData }) {
  const doc = new jsPDF();
  const leftMargin = 20;
  const rightMargin = 115;
  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor("#1E90FF");
  doc.text("Cahier des Charges", 105, y, { align: "center" });

  y += 10;


  doc.setFontSize(11);
  doc.setTextColor("#000000");

  
  doc.setFont("helvetica", "bold");
  doc.text("Societe :", leftMargin, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  doc.text(`Nom : ${societe.nom}`, leftMargin, y);
  y += 6;

  const adresseSocieteLigne1 = societe.adresse;
  const adresseSocieteLigne2 = `${societe.codePostal} ${societe.ville}`;
  doc.text(`Adresse : ${adresseSocieteLigne1}`, leftMargin, y);
  y += 6;
  doc.text(`         ${adresseSocieteLigne2}`, leftMargin, y);
  y += 6;
  doc.text(`SIRET : ${societe.siret}`, leftMargin, y);
  y += 6;
  doc.text(`TVA : ${societe.tva}`, leftMargin, y);
  y += 6;
  doc.text(`Téléphone : ${societe.tel}`, leftMargin, y);


  let yClient = 30; 
  doc.setFont("helvetica", "bold");
  doc.text("Client :", rightMargin, yClient);
  doc.setFont("helvetica", "normal");
  yClient += 6;

  const adresseClientLigne1 = client.adresse?.split(",")[0] || "";
  const adresseClientLigne2 = client.adresse?.split(",")[1]?.trim() || "";

  doc.text(`Nom : ${client.prenom || ""} ${client.nom || ""}`, rightMargin, yClient);
  yClient += 6;
  doc.text(`Société : ${client.societe || ""}`, rightMargin, yClient);
  yClient += 6;
  doc.text(`Adresse : ${adresseClientLigne1}`, rightMargin, yClient);
  yClient += 6;
  if (adresseClientLigne2) {
    doc.text(`         ${adresseClientLigne2}`, rightMargin, yClient);
    yClient += 6;
  }
  doc.text(`Email : ${client.email || ""}`, rightMargin, yClient);
  yClient += 6;
  doc.text(`Téléphone : ${client.tel || ""}`, rightMargin, yClient);


  y = Math.max(y, yClient) + 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); 
  doc.text("Contenu du cahier des charges :", leftMargin, y);
  y += 10;


  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  Object.entries(cdcData).forEach(([key, value]) => {
    if (value) {
      const label = key.replaceAll("_", " ").replace(/^\w/, c => c.toUpperCase());
      doc.setFont("helvetica", "bold");
      doc.text(`${label} :`, leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value, 170);
      doc.text(lines, leftMargin, y);
      y += lines.length * 6 + 4;
    }
  });

  doc.save(`Cahier-des-charges-${client.nom || "client"}.pdf`);
}
