import { RefreshCcw } from "lucide-react";
import React from "react";

const RefetchBtn = ({
  isRefetching,
  refetch,
}: {
  isRefetching: boolean;
  refetch: () => void;
}) => {
  return (
    <button
      disabled={isRefetching}
      onClick={() => refetch()}
      className="text-sm flex items-center gap-1 bg-neutral-900 disabled:bg-neutral-900/80 text-white p-2 rounded-md"
    >
      <span>{isRefetching ? "Atualizando" : "Atualizar"} </span>
      <RefreshCcw
        size={14}
        className={`${isRefetching ? "animate-spin" : ""}`}
      />
    </button>
  );
};

export default RefetchBtn;
