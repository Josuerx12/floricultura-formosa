"use client";
import Loading from "@/components/loading";
import CreatePrivacyTermsModal from "@/components/modals/privacy-terms/create";
import DeletePrivacyTermsModal from "@/components/modals/privacy-terms/delete";
import EditPrivacyTermsModal from "@/components/modals/privacy-terms/edit";
import { GetPrivacyTerms } from "@/lib/actions/privacy-terms/infrastructure/actions/get";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const PolicyOfPrivacityTermsPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["politica-de-privacidade"],
    queryFn: GetPrivacyTerms,
  });

  if (isPending) {
    return <Loading />;
  }

  if (!isPending && !data) {
    return (
      <p className="text-center text-sm">
        Nenhuma politica de privacidade encontrada,
        <CreatePrivacyTermsModal />
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-xl text-center font-semibold">
        Politica de privacidade
      </h2>

      <div
        className="flex items-center
       gap-2 justify-center"
      >
        <EditPrivacyTermsModal privacyTerms={data!} />
        <DeletePrivacyTermsModal privacyTerms={data!} />
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: data!.content }}
        className="mt-4 mx-2 prose"
      ></div>
    </div>
  );
};

export default PolicyOfPrivacityTermsPage;
