"use client";

import React from "react";
import SearchFilter from "@/components/filters/search-filter";
import CreateProductModal from "@/components/modals/product/create";
import Pagination from "@/components/pagination";
import { useQuery } from "@tanstack/react-query";
import { GetAllProductsWithPagination } from "@/lib/actions/products";
import { useSearchParams } from "next/navigation";
import { getAllCategoriesWithoutPagination } from "@/lib/actions/category";
import Loading from "@/components/loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductTableRow from "./product-table/ProductTable";

const ProdutosPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ["products-dash", search, page],
    queryFn: () => GetAllProductsWithPagination({ page, search }),
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="produtos" />
        <CreateProductModal />
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
              {data?.products.map((p) => (
                <ProductTableRow key={p.id} prod={p} />
              ))}
              {data?.totalPages && <Pagination totalPages={data.totalPages} />}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default ProdutosPage;
