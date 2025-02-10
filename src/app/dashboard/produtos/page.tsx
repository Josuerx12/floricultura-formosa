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
import SearchFilter from "@/components/Filters/CategoryFilter";
import ManageCategoryDropdown from "@/components/dropdowns/MenageCategoryDropdown";
import Image from "next/image";
import ManageProductDropdown from "@/components/dropdowns/MenageProductDropdown";
import CreateProductModal from "@/components/modals/product/create";

const ProdutosPage = async ({ searchParams }: { searchParams: any }) => {
  const { search } = await searchParams;

  const products = await prisma.product.findMany({
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
    include: {
      product_images: true,
      subcategory: true,
    },
  });

  const subcategories = await prisma.subcategory.findMany();

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="produtos" />
        <CreateProductModal subcategories={subcategories} />
      </div>
      <Table>
        {products?.length <= 0 && (
          <TableCaption>
            Não foi possivel encontrar produtos cadastrados ou baseado nos
            filtros.
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Sub-Categoria</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Data criação</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((prod) => (
            <TableRow key={prod.id}>
              <TableCell className="font-medium">
                <Image
                  src={
                    prod?.product_images[0]?.url
                      ? prod.product_images[0].url
                      : "/no-profile.svg"
                  }
                  alt="Product image"
                  width={50}
                  height={50}
                />
              </TableCell>
              <TableCell>{prod.name}</TableCell>
              <TableCell>{prod.subcategory.name}</TableCell>
              <TableCell>{prod.stock_quantity}</TableCell>
              <TableCell>{prod.price}</TableCell>
              <TableCell>{prod.created_at.toLocaleString("pt-BR")}</TableCell>
              <TableCell className="text-right">
                <ManageProductDropdown product={prod} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProdutosPage;
