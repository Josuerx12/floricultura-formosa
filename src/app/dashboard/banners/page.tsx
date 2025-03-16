"use client";

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
import CreateBannerModal from "@/components/modals/banners/create";
import ManageBannerDropdown from "@/components/dropdowns/manage-banner-dropdown";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { findAllBannersWithPagination } from "@/lib/actions/banners";
import Loading from "@/components/loading";

const BannersPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["banners", search, page],
    queryFn: () => findAllBannersWithPagination({ page, search }),
  });

  if (!data && isPending) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="do banner" />
        <CreateBannerModal />
      </div>
      <Table>
        {data && data?.banners?.length <= 0 && (
          <TableCaption>
            Não foi possivel encontrar banners cadastrados.
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
          {data &&
            data.banners?.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell className="font-medium">{banner.id}</TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.is_active ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  {banner.created_at.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  <ManageBannerDropdown banner={banner} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {data && <Pagination totalPages={data?.totalPages} />}
    </div>
  );
};

export default BannersPage;
