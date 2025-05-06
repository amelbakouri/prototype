import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'workspace',
  });

  const [rows] = await connection.execute(
    `SELECT * FROM clients WHERE societe LIKE ? OR siret LIKE ? LIMIT 10`,
    [`%${query}%`, `%${query}%`]
  );

  await connection.end();

  return NextResponse.json(rows);
}
