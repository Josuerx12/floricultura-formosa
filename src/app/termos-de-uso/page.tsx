import { GetUseTerms } from "@/lib/actions/use-terms/infrastructure/actions/get";
import React from "react";

const TermsOfUsePage = async () => {
  const useTerms = await GetUseTerms();

  if (!useTerms) {
    return <p className="text-center">Nenhum termo de uso adicionado!</p>;
  }

  return (
    <div className="min-h-screen p-8">
      <div
        className="max-w-3xl mx-auto prose"
        dangerouslySetInnerHTML={{ __html: useTerms.content }}
      ></div>
      <p className="mt-6 text-sm">
        Última atualização: {useTerms.created_at.toLocaleString("pt-br")}
      </p>
    </div>
  );
};

export default TermsOfUsePage;
