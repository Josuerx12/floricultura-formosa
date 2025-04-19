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
import Image from "next/image";
import ManageProductDropdown from "@/components/dropdowns/MenageProductDropdown";
import CreateProductModal from "@/components/modals/product/create";
import Pagination from "@/components/pagination";
import { useQuery } from "@tanstack/react-query";
import { GetAllProductsWithPagination } from "@/lib/actions/products";
import { useSearchParams } from "next/navigation";
import { getAllCategoriesWithoutPagination } from "@/lib/actions/category";
import Loading from "@/components/loading";

const ProdutosPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ["products-dash", search, page],
    queryFn: () => GetAllProductsWithPagination({ page, search }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesWithoutPagination,
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="produtos" />
        {categories && <CreateProductModal categories={categories} />}
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Table>
            {data && data?.products?.length <= 0 && (
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
              {data &&
                data.products.map((prod) => (
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
                    <TableCell>
                      {prod.created_at.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {categories && (
                        <ManageProductDropdown
                          product={prod}
                          categories={categories}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {data?.totalPages && <Pagination totalPages={data.totalPages} />}
        </>
      )}
    </div>
  );
};

export default ProdutosPage;
