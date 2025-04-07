"use client";
import { signUp } from "@/lib/actions/auth";
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
      className="flex flex-col gap-4 max-w-md mx-auto w-full px-4"
      action={formAction}
    >
      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiSolidUser className="text-primary-foreground" size={20} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="text"
          name="name"
          placeholder="Nome completo"
        />
      </label>
      {state?.errors?.name && (
        <p className="text-red-600 text-sm">{state.errors.name}</p>
      )}

      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiMailSend className="text-primary-foreground" size={20} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="email"
          name="email"
          placeholder="E-mail"
        />
      </label>
      {state?.errors?.email && (
        <p className="text-red-600 text-sm">{state.errors.email}</p>
      )}

      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiSolidPhone className="text-primary-foreground" size={20} />
        <input
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="tel"
          name="phone"
          placeholder="Telefone"
        />
      </label>
      {state?.errors?.phone && (
        <p className="text-red-600 text-sm">{state.errors.phone}</p>
      )}

      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiKey className="text-primary-foreground" size={20} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="password"
          name="password"
          placeholder="Senha"
        />
      </label>
      {state?.errors?.password && (
        <p className="text-red-600 text-sm">{state.errors.password}</p>
      )}

      {state?.error && (
        <div className="bg-red-100 p-3 rounded-md text-sm">
          <strong className="text-red-700">Erro:</strong> {state.error}
        </div>
      )}

      <p className="text-xs text-center text-neutral-600">
        Já possui uma conta?{" "}
        <Link href="/login" className="text-blue-500 underline">
          Faça login
        </Link>
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="border border-primary-foreground flex items-center justify-center gap-2 hover:bg-primary-foreground hover:text-primary duration-200 py-2 w-full sm:w-fit px-6 rounded-full mx-auto text-sm"
      >
        {isPending ? (
          <>
            Fazendo cadastro <Loader className="animate-spin" size={16} />
          </>
        ) : (
          <>Fazer Cadastro</>
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
