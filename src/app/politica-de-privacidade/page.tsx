import { GetPrivacyTerms } from "@/lib/actions/privacy-terms/infrastructure/actions/get";
import React from "react";

const PrivacyPolicyPage = async () => {
  const policy = await GetPrivacyTerms();

  if (!policy) {
    return (
      <p className="text-center">Nenhuma politica de privacidade adicionada!</p>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div
        className="max-w-3xl mx-auto prose"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      ></div>
      <p className="mt-6 text-sm">
        Última atualização: {policy?.created_at.toLocaleString("pt-br")}
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
