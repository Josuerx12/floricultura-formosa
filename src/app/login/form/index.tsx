"use client";

import { signInWithCredentials } from "@/lib/actions/auth";
import { Loader } from "lucide-react";
import React, { useActionState } from "react";
import { BiMailSend, BiKey } from "react-icons/bi";

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(
    signInWithCredentials,
    null
  );

  return (
    <form
      className="flex flex-col gap-6 max-w-prose mx-auto w-full"
      action={formAction}
    >
      <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
        <BiMailSend className="text-primary-foreground" size={24} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-700"
          type="email"
          name="email"
          placeholder="Insira seu e-mail cadastrado para se autenticar!"
        />
      </label>
      <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
        <BiKey className="text-primary-foreground" size={24} />
        <input
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-700"
          type="password"
          name="password"
          placeholder="Insira sua senha para se autenticar!"
        />
      </label>

      {state && (
        <div className="bg-red-100 p-2 rounded-md">
          <span className="text-red-900 font-semibold">Error:</span>{" "}
          <p className="text-red-600">{state}</p>
        </div>
      )}
      <button
        type="submit"
        className="border flex border-primary-foreground hover:bg-primary-foreground duration-200 hover:text-primary py-1 w-fit px-6 rounded-full mx-auto"
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
