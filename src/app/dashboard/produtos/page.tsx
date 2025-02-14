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
import SearchFilter from "@/components/Filters/CategoryFilter";
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
            Não foi possível encontrar produtos cadastrados ou baseados nos
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
                  className="w-[50px] h-[50px]"
                  src={
                    prod?.product_images[0]?.url
                      ? prod.product_images[0].url
                      : "/no-profile.svg"
                  }
                  alt="Product image"
                  width={100}
                  height={100}
                  quality={100}
                />
              </TableCell>
              <TableCell>{prod.name}</TableCell>
              <TableCell>{prod.subcategory.name}</TableCell>
              <TableCell>{prod.stock_quantity} UN</TableCell>
              <TableCell>
                {prod.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>{prod.created_at.toLocaleString("pt-BR")}</TableCell>
              <TableCell className="text-right">
                <ManageProductDropdown
                  product={prod}
                  subcategories={subcategories}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProdutosPage;
