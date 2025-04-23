import { GetRefoundTerms } from "@/lib/actions/refound-terms/infrastructure/actions/get";
import React from "react";

const RefoundPolicyPage = async () => {
  const refoundTerm = await GetRefoundTerms();

  if (!refoundTerm) {
    return (
      <p className="text-center">Nenhuma politica de reembolso adicionada!</p>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div
        className="max-w-3xl mx-auto prose"
        dangerouslySetInnerHTML={{ __html: refoundTerm.content }}
      ></div>
      <p className="mt-6 text-sm">
        Última atualização: {refoundTerm.created_at.toLocaleString("pt-br")}
      </p>
    </div>
  );
};

export default RefoundPolicyPage;
