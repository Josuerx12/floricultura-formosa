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
import SearchFilter from "@/components/Filters/CategoryFilter";
import CreatePromotionModal from "@/components/modals/promotions/create";

const OfertasPage = async ({ searchParams }: { searchParams: any }) => {
  const { search } = await searchParams;

  const promotions = await prisma.promotions.findMany({
    where: {
      AND: [
        {
          start_date: {
            lte: new Date(),
          },
          end_date: {
            gte: new Date(),
          },
        },
        search
          ? {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            }
          : {},
      ],
    },
    include: {
      product: true,
    },
  });

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="promoções" />
        <CreatePromotionModal products={products} />
      </div>
      <Table>
        {promotions?.length <= 0 && (
          <TableCaption>
            Não foi possivel encontrar promoções cadastradas.
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Desconto</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="font-medium">{promo.id}</TableCell>
              <TableCell>{promo.product.name}</TableCell>
              <TableCell>{promo.discount_percentage.toString()} %</TableCell>
              <TableCell>{promo.start_date.toLocaleString("pt-BR")}</TableCell>
              <TableCell>{promo.end_date.toLocaleString("pt-BR")}</TableCell>
              <TableCell>{promo.created_at.toLocaleString("pt-BR")}</TableCell>
              {/* <TableCell className="text-right">
                <ManageSubCategoryDropdown subCategory={subCategory as any} />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OfertasPage;
