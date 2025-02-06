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
          throw new InvalidLoginError("Nenhum usuário encontrado!");
        }

        if (!user.password) {
          throw new InvalidLoginError(
            "Nenhuma senha cadastrada para o usuário até o momento, tente recuperar sua senha para fazer login!"
          );
        }

        const userVerified = await compare(
          password as string,
          user.password as string
        );

        if (!userVerified) {
          throw new InvalidLoginError("Credenciais invalidas!");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.email = token.email as string),
          (session.user.image = token.picture),
          (session.user.phone = token.phone),
          (session.user.role = token.role);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email as string },
      });

      if (dbUser) {
        token.picture = dbUser.image;
        token.id = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.phone = dbUser.phone;
        token.role = dbUser.role;
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
