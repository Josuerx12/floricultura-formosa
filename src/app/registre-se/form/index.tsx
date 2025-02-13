"use client";
import { signUp, UserErrorsT } from "@/lib/actions/auth";
import { Loader } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useActionState, useEffect, useRef } from "react";
import { BiSolidUser, BiMailSend, BiSolidPhone, BiKey } from "react-icons/bi";

const SignUpForm = () => {
  const [state, formAction, isPending] = useActionState(signUp, null);

  if (state?.success) {
    redirect("/login");
  }

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-6 max-w-prose mx-auto w-full"
      action={formAction}
    >
      <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
        <BiSolidUser className="text-primary-foreground" size={24} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-700"
          type="text"
          name="name"
          placeholder="Insira seu nome para criar uma conta!"
        />
      </label>
      {state?.errors?.name && (
        <p className="text-red-600">{state?.errors?.name}</p>
      )}
      <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
        <BiMailSend className="text-primary-foreground" size={24} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-700"
          type="email"
          name="email"
          placeholder="Insira seu e-mail para criar uma conta!"
        />
      </label>
      {state?.errors?.email && (
        <p className="text-red-600">{state?.errors?.email}</p>
      )}
      <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
        <BiSolidPhone className="text-primary-foreground" size={24} />
        <input
          className="w-full bg-transparent outline-none placeholder:text-neutral-700"
          type="tel"
          name="phone"
          placeholder="Insira seu numero de telefone para criar uma conta!"
        />
      </label>
      {state?.errors?.phone && (
        <p className="text-red-600">{state?.errors?.phone}</p>
      )}
      <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
        <BiKey className="text-primary-foreground" size={24} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-700"
          type="password"
          name="password"
          placeholder="Insira uma senha para criar uma conta!"
        />
      </label>
      {state?.errors?.password && (
        <p className="text-red-600">{state?.errors?.password}</p>
      )}

      {state?.error && (
        <div className="bg-red-100 p-2 rounded-md flex gap-2">
          <span className="text-red-900 font-semibold">Error:</span>{" "}
          <p className="text-red-600">{state.error}</p>
        </div>
      )}

      <p className="text-sm text-center">
        Já possui uma conta? Vá até a pagina de login e autentique-se! Ou{" "}
        <Link href={"/login"} className="text-blue-500">
          clique aqui!
        </Link>
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="border border-primary-foreground flex items-center gap-2 hover:bg-primary-foreground duration-200 hover:text-primary py-1 w-fit px-6 rounded-full mx-auto"
      >
        {isPending ? (
          <>
            Fazendo cadastro <Loader className="animate-spin" />
          </>
        ) : (
          <>Fazer Cadastro</>
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
