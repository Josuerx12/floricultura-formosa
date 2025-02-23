import React from "react";

import { prisma } from "@/lib/db/prisma";
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

const DeliveryFeePage = async ({ searchParams }: { searchParams: any }) => {
  const { search, page } = await searchParams;

  const perPage = 10;

  const currentPage = page ?? 1;

  const totalDeliveryFees = await prisma.delivery_fee.count({
    where: {
      OR: [
        {
          district: {
            contains: search ?? "",
            mode: "insensitive",
          },
        },
        {
          id: search ?? "",
        },
      ],
    },
  });

  const totalPages = Math.ceil(totalDeliveryFees / perPage);

  const deliveryFees = await prisma.delivery_fee.findMany({
    where: {
      OR: [
        {
          district: {
            contains: search ?? "",
            mode: "insensitive",
          },
        },
        {
          id: search ?? "",
        },
      ],
    },
    take: perPage ?? 10,
    skip: (currentPage - 1) * perPage,
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="taxas de entrega" />
        <CreateDeliveryFeeModal />
      </div>
      <Table className="overflow-auto">
        {deliveryFees?.length <= 0 && (
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
          {deliveryFees.map((fee) => (
            <TableRow key={fee.id}>
              <TableCell className="font-medium">{fee.id}</TableCell>
              <TableCell>{fee.district}</TableCell>
              <TableCell>
                {fee.fee.toNumber().toLocaleString("pt-BR", {
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

      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default DeliveryFeePage;
