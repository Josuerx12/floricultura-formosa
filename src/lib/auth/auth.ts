import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../db/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

class InvalidLoginError extends CredentialsSignin {
  code = "Email ou senha incorretos!";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { laber: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        if (!user) {
          throw new InvalidLoginError();
        }

        const userVerified = compare(
          password as string,
          user.password as string
        );

        if (!userVerified) {
          throw new InvalidLoginError();
        }

        return user;
      },
    }),
  ],
});
