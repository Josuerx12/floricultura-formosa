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
import CreateSubCategoryModal from "@/components/modals/subcategory/create";
import ManageSubCategoryDropdown from "@/components/dropdowns/MenageSubCategoryDropdown";

const SubCategoriasPage = async ({ searchParams }: { searchParams: any }) => {
  const { search } = await searchParams;

  const subCategories = await prisma.subcategory.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          category: {
            name: {
              contains: search,
            },
          },
        },
        !isNaN(Number(search))
          ? {
              id: Number(search),
            }
          : {},
      ],
    },
    include: {
      category: true,
    },
  });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="sub-categorias" />
        <CreateSubCategoryModal categories={categories} />
      </div>
      <Table>
        {subCategories?.length <= 0 && (
          <TableCaption>
            Não foi possivel encontrar sub-categorias cadastradas.
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data criação</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subCategories.map((subCategory) => (
            <TableRow key={subCategory.id}>
              <TableCell className="font-medium">{subCategory.id}</TableCell>
              <TableCell>{subCategory.name}</TableCell>
              <TableCell>{subCategory.category.name}</TableCell>
              <TableCell>
                {subCategory.created_at.toLocaleString("pt-BR")}
              </TableCell>
              <TableCell className="text-right">
                <ManageSubCategoryDropdown subCategory={subCategory as any} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubCategoriasPage;
