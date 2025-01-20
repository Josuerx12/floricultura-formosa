"use server";
import { signIn, signOut } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { UserSchema } from "@/lib/schemas-validator/user.schema";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function singInWithGoogle() {
  await signIn("google");
}

export async function singOutAction() {
  await signOut();
}

export async function signInWithCredentials(formData: FormData) {
  await signIn("credentials", formData);
}

export async function signUp(formData: FormData) {
  const credentials = UserSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (user) {
    throw new Error("Não é possivel criar uma conta com o e-mail informado!");
  }

  const hashPassword = await hash(credentials.password as string, 10);

  await prisma.user.create({
    data: {
      ...credentials,
      password: hashPassword,
    },
  });

  transporter.sendMail({
    from: process.env.MAIL,
    to: credentials.email,
    subject: "Floricultura Formosa - Conta criada!",
    text: `Seja muito bem vindo ${credentials.name} à floricultura formosa a sua floricultura de confiaça!`,
  });

  return NextResponse.redirect("/account-created");
}
