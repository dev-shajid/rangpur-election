import { DefaultSession } from "next-auth";

import { Role } from "./index";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: Role | undefined;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: Role | undefined;
    } & DefaultSession["user"];
    token: string;
  }
}

// JWT type extension
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role | undefined;
    googleId?: string;
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  }
}
