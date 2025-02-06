import { prisma } from "@/lib/db/prisma";
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
import CreateCategoriaModal from "@/components/modals/category/create";
import ManageCategoryDropdown from "@/components/MenageCategoryDropdown";
import CategoryFilter from "@/components/Filters/CategoryFilter";

const CategoriasPage = async ({ searchParams }: { searchParams: any }) => {
  const { search } = await searchParams;

  const categorias = await prisma.category.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        !isNaN(Number(search))
          ? {
              id: Number(search),
            }
          : {},
      ],
    },
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <CategoryFilter />
        <CreateCategoriaModal />
      </div>
      <Table>
        {categorias?.length <= 0 && (
          <TableCaption>
            Não foi possivel encontrar categorias cadastradas.
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Data criação</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorias.map((categoria) => (
            <TableRow key={categoria.id}>
              <TableCell className="font-medium">{categoria.id}</TableCell>
              <TableCell>{categoria.name}</TableCell>
              <TableCell>
                {categoria.created_at.toLocaleString("pt-BR")}
              </TableCell>
              <TableCell className="text-right">
                <ManageCategoryDropdown category={categoria} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriasPage;
