"use server";
import { signIn, signOut } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { UserSchema, UserType } from "@/lib/schemas-validator/user.schema";
import { hash } from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type UserErrorsT = {
  password?: string[];
  email?: string[];
  name?: string[];
  phone?: string[];
};

export type SignUpStateActionT = {
  success: boolean;
  error?: string;
  errors?: UserErrorsT | null;
};

export async function singInWithGoogle() {
  await signIn("google");
}

export async function singOutAction() {
  await signOut();
}

export async function signInWithCredentials(
  state: string | null,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
    return null;
  } catch (error: any) {
    if (isRedirectError(error)) {
      console.log(error);
      throw error;
    }

    return error.message;
  }
}

export async function signUp({ credentials }: { credentials: UserType }) {
  try {
    const emailAlreadyInUse = await prisma.user.findUnique({
      where: { email: credentials.email },
      select: { id: true },
    });

    if (emailAlreadyInUse) {
      throw new Error("Email informado já em uso.");
    }

    const document = credentials.document.replace(/\D/g, "");

    const documentAlreadyInUse = await prisma.user.findFirst({
      where: { document },
      select: { document: true },
    });

    if (documentAlreadyInUse) {
      throw new Error("Documento informado já em uso.");
    }

    const hashPassword = await hash(credentials.password as string, 10);

    await prisma.user.create({
      data: {
        ...credentials,
        phone: credentials.phone?.replace(/\D/g, ""),
        document,
        password: hashPassword,
      },
    });

    transporter.sendMail({
      from: `Floricultura Formosa <${process.env.MAIL}>`,
      to: credentials.email,
      subject: "Floricultura Formosa - Conta criada!",
      text: `Seja muito bem vindo ${credentials.name} à floricultura formosa a sua floricultura de confiaça!`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
