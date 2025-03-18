"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchFilter from "@/components/filters/search-filter";
import Pagination from "@/components/pagination";
import CreateDeliveryFeeModal from "@/components/modals/delivery-fee/create";
import { useSearchParams } from "next/navigation";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { GetAllDeliveryFeesWithPagination } from "@/lib/actions/delivery-fee";
import Loading from "@/components/loading";

const BairrosPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["allDeliveryFees", search, page],
    queryFn: () => GetAllDeliveryFeesWithPagination({ page, search }),
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="taxas de entrega" />
        <CreateDeliveryFeeModal />
      </div>

      {isPending ? (
        <Loading />
      ) : (
        <>
          {" "}
          <Table className="overflow-auto">
            {data!.deliveryFees?.length <= 0 && (
              <TableCaption>
                Não foi possivel encontrar taxas de entrega cadastradas.
              </TableCaption>
            )}
            <TableHeader className="overflow-auto">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome do Bairro</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-auto">
              {data!.deliveryFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.id}</TableCell>
                  <TableCell>{fee.district}</TableCell>
                  <TableCell>
                    {fee.fee.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* <ManagefeeDropdown fee={fee as any} /> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination totalPages={data!.totalPages} />
        </>
      )}
    </div>
  );
};

export default BairrosPage;
