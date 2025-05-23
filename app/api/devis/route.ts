import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 

export async function POST(req: NextRequest) {
  try {
    // 0. Récupération de la session utilisateur
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Utilisateur non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const {
      typeDoc,
      client,
      dates,
      prestations,
      infoSupp,
      totalHT,
      tva,
      totalTTC,
    } = body;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Vérifier si le client existe
    const [existingClientRows] = await connection.execute<any[]>(
      `SELECT id FROM client WHERE email = ? OR siret = ?`,
      [client.email, client.siret]
    );

    let clientId: number;

    if (existingClientRows.length > 0) {
      clientId = existingClientRows[0].id;
    } else {
      const [clientResult] = await connection.execute<ResultSetHeader>(
        `
        INSERT INTO client (
          nom, prenom, societe, adresse,
          code_postal, ville, siret, email, tel
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          client.nom,
          client.prenom,
          client.societe,
          client.adresse,
          client.codePostal,
          client.ville,
          client.siret,
          client.email,
          client.tel,
        ]
      );
      clientId = clientResult.insertId;
    }

    // Insertion du devis/facture avec l'ID de l'utilisateur connecté
    const [devisResult] = await connection.execute<ResultSetHeader>(
      `
      INSERT INTO devis_facture (
        type, client_id, utilisateur_id,
        date_creation, validite, date_facturation,
        date_livraison, echeance, info_supp,
        total_ht, tva, total_ttc
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        typeDoc,
        clientId,
        userId, // depuis la session
        dates.dateDevis || new Date(),
        dates.validite || null,
        dates.dateFacturation || null,
        dates.dateLivraison || null,
        dates.echeance || null,
        infoSupp || '',
        totalHT,
        tva,
        totalTTC,
      ]
    );

    const devisId = devisResult.insertId;

    // Insertion des lignes de prestation
    if (Array.isArray(prestations)) {
      for (const prestation of prestations) {
        await connection.execute<ResultSetHeader>(
          `
          INSERT INTO ligne_prestation (
            devis_id, description, quantite, prix_ht
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            devisId,
            prestation.description,
            prestation.quantite,
            prestation.prixHT,
          ]
        );
      }
    }

    await connection.end();

    return NextResponse.json(
      { message: 'Devis inséré avec succès' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur API devis :', error);
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
