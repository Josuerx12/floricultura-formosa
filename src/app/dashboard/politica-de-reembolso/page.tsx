"use client";
import Loading from "@/components/loading";
import CreateRefoundTermsModal from "@/components/modals/refound-terms/create";
import DeleteRefoundTermsModal from "@/components/modals/refound-terms/delete";
import EditRefoundTermsModal from "@/components/modals/refound-terms/edit";
import { GetRefoundTerms } from "@/lib/actions/refound-terms/infrastructure/actions/get";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const PolicyOfRefoundPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["politica-de-reembolso"],
    queryFn: GetRefoundTerms,
  });

  if (isPending) {
    return <Loading />;
  }

  if (!isPending && !data) {
    return (
      <p className="text-center text-sm">
        Nenhuma politica de privacidade encontrada,
        <CreateRefoundTermsModal />
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
        <EditRefoundTermsModal refoundTerms={data!} />
        <DeleteRefoundTermsModal refoundTerms={data!} />
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: data!.content }}
        className="mt-4 mx-2 prose"
      ></div>
    </div>
  );
};

export default PolicyOfRefoundPage;
