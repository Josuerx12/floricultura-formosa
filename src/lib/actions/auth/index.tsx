"use server";
import { signIn, signOut } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { transporter } from "@/lib/mail/transporter";
import { UserSchema } from "@/lib/schemas-validator/user.schema";
import { hash } from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

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

export async function signUp(
  state: SignUpStateActionT | null,
  formData: FormData
) {
  try {
    const rawObject: Record<string, string> = {};

    formData.forEach((value, key) => {
      rawObject[key] = value.toString();
    });

    const credentials = UserSchema.parse(rawObject);

    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (user) {
      return {
        success: false,
        error: "Não é possível criar uma conta com o e-mail informado!",
        errors: null,
      };
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

    return {
      success: true,
    };
  } catch (err: any) {
    let formattedErrors: UserErrorsT | null = null;

    if (err instanceof z.ZodError) {
      formattedErrors = Object.fromEntries(
        Object.entries(err.format()).map(([key, value]) => [
          key,
          (value as any)._errors,
        ])
      ) as UserErrorsT;
    }

    console.log(formattedErrors);

    return {
      success: false,
      error: err instanceof z.ZodError ? null : err.message,
      errors: formattedErrors,
    };
  }
}
