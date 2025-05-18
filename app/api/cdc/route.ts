import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier la session utilisateur
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Utilisateur non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const {
      client,
      contexte,
      objectifs,
      perimetre_fonctionnel,
      technologies,
      contraintes,
      budget,
      delai,
      acteurs_impliquees,
      validation,
    } = body;

    // 2. Connexion à la BDD
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 3. Vérifier si le client existe déjà
    const [existingClientRows] = await connection.execute<any[]>(
      `SELECT id FROM client WHERE societe = ? OR siret = ?`,
      [client.societe, client.siret]
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

    // 4. Insertion du cahier des charges
    await connection.execute<ResultSetHeader>(
      `
      INSERT INTO cahier_des_charges (
        client_id, utilisateur_id,
        contexte, objectifs, perimetre_fonctionnel,
        technologies, contraintes, budget,
        delais, acteurs_impliquees, validation
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        clientId,
        userId,
        contexte,
        objectifs,
        perimetre_fonctionnel,
        technologies,
        contraintes,
        budget,
        delai,
        acteurs_impliquees,
        validation,
      ]
    );

    await connection.end();

    return NextResponse.json({ message: 'CDC inséré avec succès' }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur API CDC :', error);
    return NextResponse.json({ message: 'Erreur serveur', error: error.message }, { status: 500 });
  }
}
