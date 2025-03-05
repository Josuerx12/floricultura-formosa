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
import React from "react";
import SearchFilter from "@/components/filters/search-filter";
import Pagination from "@/components/pagination";

const BannersPage = async ({ searchParams }: { searchParams: any }) => {
  const { search, page } = await searchParams;

  const perPage = 10;
  const currentPage = page ?? 1;

  const totalBanners = await prisma.banners.count({
    where: {
      OR: [
        {
          title: {
            contains: search ?? "",
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

  const totalPages = Math.ceil(totalBanners / perPage);

  const banners = await prisma.banners.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search ?? "",
            mode: "insensitive",
          },
        },
        !isNaN(Number(search))
          ? {
              id: Number(search),
            }
          : {},
      ],
    },
    take: perPage ?? 10,
    skip: (currentPage - 1) * perPage,
    orderBy: {
      is_active: "desc",
    },
  });
  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="do banner" />
        {/* <CreateCategoriaModal /> */}
      </div>
      <Table>
        {banners?.length <= 0 && (
          <TableCaption>
            Não foi possivel encontrar categorias cadastradas.
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Titulo</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead>Data criação</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell className="font-medium">{banner.id}</TableCell>
              <TableCell>{banner.title}</TableCell>
              <TableCell>{banner.is_active ? "Sim" : "Não"}</TableCell>
              <TableCell>{banner.created_at.toLocaleString("pt-BR")}</TableCell>
              <TableCell className="text-right">
                {/* <ManageCategoryDropdown category={categoria} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default BannersPage;
