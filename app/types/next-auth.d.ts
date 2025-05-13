import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | number;
      role?: string;
      name?: string;
      email?: string;
    };
  }

  interface User {
    id: string | number; 
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | number; 
    role?: string;
  }
}
