import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import React from "react";
import DestinatarioFormComponent from "./components/DestinatarioFormComponent";

const DestinatarioPage = async () => {
  const user = await auth();

  if (!user?.user) {
    redirect("/");
  }
  return (
    <main className="max-w-screen-2xl mx-auto w-full px-2 py-6">
      <h2 className="text-xl font-semibold my-6">
        Preencha as informações do destinatário
      </h2>

      <DestinatarioFormComponent />
    </main>
  );
};

export default DestinatarioPage;
