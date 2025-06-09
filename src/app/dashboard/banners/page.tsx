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
import BannerTableRow from "./components/BannerTableRow";

const BannersPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["banners", search, page],
    queryFn: () => findAllBannersWithPagination({ page, search }),
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="do banner" />
        <CreateBannerModal />
      </div>
      {isPending && <Loading />}
      {!isPending && (
        <>
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
                  <BannerTableRow key={banner.id} banner={banner} />
                ))}
            </TableBody>
          </Table>
          {data && <Pagination totalPages={data?.totalPages} />}
        </>
      )}
    </div>
  );
};

export default BannersPage;
