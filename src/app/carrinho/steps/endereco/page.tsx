import React from "react";
import EnderecoFormComponent from "./components/EnderecoFormComponent";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const EnderecoPage = async () => {
  const user = await auth();

  if (!user?.user) {
    redirect("/");
  }

  return (
    <main className="max-w-screen-2xl w-full mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold">
        Selecione um endereço de entrega para finalizar sua compra.
      </h2>

      <EnderecoFormComponent user={user.user as any} />
    </main>
  );
};

export default EnderecoPage;
