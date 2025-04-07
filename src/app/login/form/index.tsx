"use client";

import { signInWithCredentials } from "@/lib/actions/auth";
import { Loader } from "lucide-react";
import React, { useActionState, useEffect, useRef } from "react";
import { BiMailSend, BiKey } from "react-icons/bi";

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(
    signInWithCredentials,
    null
  );

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-6 max-w-prose mx-auto w-full px-4"
      action={formAction}
    >
      <label className="flex items-center bg-neutral-200 p-3 gap-2 rounded-3xl">
        <BiMailSend className="text-primary-foreground" size={20} />
        <input
          required
          className="w-full bg-transparent outline-none text-sm placeholder:text-neutral-700"
          type="email"
          name="email"
          placeholder="E-mail"
        />
      </label>

      <label className="flex items-center bg-neutral-200 p-3 gap-2 rounded-3xl">
        <BiKey className="text-primary-foreground" size={20} />
        <input
          required
          className="w-full bg-transparent outline-none text-sm placeholder:text-neutral-700"
          type="password"
          name="password"
          placeholder="Senha"
        />
      </label>

      {state && (
        <div className="bg-red-100 text-sm p-2 rounded-md text-red-700 border border-red-300">
          <strong>Erro:</strong> {state}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="border flex items-center gap-2 border-primary-foreground hover:bg-primary-foreground duration-200 hover:text-primary py-1 w-fit px-6 rounded-full mx-auto"
      >
        {isPending ? (
          <>
            Fazendo login <Loader className="animate-spin" />
          </>
        ) : (
          <>Fazer login</>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
