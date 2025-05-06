import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  const { nom, prenom, email, password } = await req.json();

  if (!email || !password || !nom || !prenom) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  try {
    // Vérifie si l'utilisateur existe déjà
    const [rows]: any = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
    if (rows.length > 0) {
      return NextResponse.json({ error: "Email déjà utilisé." }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);
    await db.query(
      "INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword, "salarie"]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
