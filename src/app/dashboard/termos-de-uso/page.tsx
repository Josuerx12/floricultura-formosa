"use client";

import Loading from "@/components/loading";
import CreateUseTermsModal from "@/components/modals/use-terms/create";
import DeleteUseTermsModal from "@/components/modals/use-terms/delete";
import EditUseTermsModal from "@/components/modals/use-terms/edit";
import { GetUseTerms } from "@/lib/actions/use-terms/infrastructure/actions/get";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const UseTermsPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["termo-de-uso"],
    queryFn: GetUseTerms,
  });

  if (isPending) {
    return <Loading />;
  }

  if (!isPending && !data) {
    return (
      <p className="text-center text-sm">
        Nenhum termo de uso encontrado,
        <CreateUseTermsModal />
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
        <EditUseTermsModal useTerms={data!} />
        <DeleteUseTermsModal useTerms={data!} />
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: data!.content }}
        className="mt-4 mx-2 prose"
      ></div>
    </div>
  );
};

export default UseTermsPage;
