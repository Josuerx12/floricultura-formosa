import React from "react";
import SummaryComponent from "./components/SummaryComponent";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const ResumoPage = async () => {
  const user = await auth();

  if (!user?.user) {
    redirect("/");
  }

  return (
    <main className="max-w-screen-2xl mx-auto w-full space-y-6 py-6">
      <h2 className="text-xl font-semibold">Resumo do Pedido</h2>

      <SummaryComponent user={user} />
    </main>
  );
};

export default ResumoPage;
