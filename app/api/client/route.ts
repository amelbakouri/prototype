import { NextRequest, NextResponse } from 'next/server';
import mysql, { ResultSetHeader } from 'mysql2/promise';

export async function GET(req: NextRequest) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute(`
    SELECT id, nom, prenom, societe, adresse, code_postal as codePostal, ville, siret, email, tel
    FROM client
    ORDER BY societe
  `);

  await connection.end();

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const clientData = await req.json();

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const {
    nom,
    prenom,
    societe,
    adresse,
    codePostal,
    ville,
    siret,
    email,
    tel,
  } = clientData;

  const [result] = await connection.execute<ResultSetHeader>(
    `INSERT INTO client (nom, prenom, societe, adresse, code_postal, ville, siret, email, tel)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nom, prenom, societe, adresse, codePostal, ville, siret, email, tel]
  );

  await connection.end();

  return NextResponse.json({ id: result.insertId });
}
