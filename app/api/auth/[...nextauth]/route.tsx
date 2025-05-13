import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const [rows]: any = await db.query(
          "SELECT * FROM utilisateur WHERE email = ?",
          [credentials?.email]
        );
        const user = rows[0];

        if (user && await compare(credentials.password, user.mot_de_passe)) {
          return {
            id: user.id.toString(),  
            email: user.email,
            name: user.nom + " " + user.prenom,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;         
        token.role = user.role;     
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;   
        session.user.role = token.role; 
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
