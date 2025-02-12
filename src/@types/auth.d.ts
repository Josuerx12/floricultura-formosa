import { UserRoles } from "@prisma/client";
import NextAuth, { type User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User & {
      phone?: string | null;
      role?: UserRoles | null;
    };
  }

  interface User {
    phone?: string | null;
    role?: UserRoles | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone?: string | null;
    role?: UserRoles | null;
  }
}
