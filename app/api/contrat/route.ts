import { NextRequest, NextResponse } from 'next/server';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.id) {
        return NextResponse.json({ message: 'Utilisateur non authentifié' }, { status: 401 });
      }
      const utilisateurId = session.user.id;
  
      const {
        objet,
        date_debut,
        date_fin,
        duree,
        modalites_resiliation,
        modalites_paiement,
        obligations,
        clauses_juridiques,
        lieu_signature,
        date_signature,
        client,
      } = await req.json();
  

      if (
        !objet || !date_debut || !date_fin || !duree ||
        !modalites_resiliation || !modalites_paiement ||
        !obligations || !clauses_juridiques || !lieu_signature ||
        !date_signature || !client || !client.email
      ) {
        return NextResponse.json({ message: 'Champs manquants' }, { status: 400 });
      }
  
      const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
  
      // Vérification si le client existe
      const [existingClient] = await db.execute<any[]>(
        `SELECT id FROM client WHERE societe = ? OR siret = ?`,
        [client.societe, client.siret]
      );
  
      let clientId: number;
      if (existingClient.length > 0) {
        clientId = existingClient[0].id;
      } else {
        const [clientResult] = await db.execute<ResultSetHeader>(
          `INSERT INTO client (nom, prenom, societe, adresse, code_postal, ville, siret, email, tel)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            client.nom,
            client.prenom,
            client.societe,
            client.adresse,
            client.code_postal,
            client.ville,
            client.siret,
            client.email,
            client.tel,
          ]
        );
        clientId = clientResult.insertId;
      }
  
      
      const coordonnees = `${client.adresse}, ${client.code_postal} ${client.ville}, ${client.email}, ${client.tel}`;
  
      // Insertion du contrat
      const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO contrat (
          client_id, utilisateur_id, nom_societe, coordonnees, objet, date_debut, date_fin, duree,
          resiliation, paiement, obligations, clauses_juridiques, lieu_signature, date_signature
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          clientId,
          utilisateurId,
          client.societe,
          coordonnees,
          objet,
          date_debut,
          date_fin,
          duree,
          modalites_resiliation,
          modalites_paiement,
          obligations,
          clauses_juridiques,
          lieu_signature,
          date_signature
        ]
      );
  
      await db.end();
  
      return NextResponse.json({ message: 'Contrat ajouté avec succès', id: result.insertId }, { status: 201 });
  
    } catch (error: any) {
      console.error("Erreur POST /api/contrat:", error);
      return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
    }
  }

  