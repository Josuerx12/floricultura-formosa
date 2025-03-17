"use client";

import ManageUserDropdown from "@/components/dropdowns/manage-user-dropdown";
import SearchFilter from "@/components/filters/search-filter";
import Loading from "@/components/loading";
import Pagination from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsersWithPagination } from "@/lib/actions/users";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";

const UsersPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["allUsers", search, page],
    queryFn: () => getAllUsersWithPagination({ page, search }),
  });

  return (
    <div>
      <div className="flex mb-4 justify-end items-center gap-4">
        <SearchFilter placeholder="do banner" />
        {/* <CreateBannerModal /> */}
      </div>
      {isPending && <Loading />}

      {!isPending && (
        <>
          <Table>
            {data && data.users?.length <= 0 && (
              <TableCaption>
                Não foi possivel encontrar banners cadastrados.
              </TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data criação</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <ManageUserDropdown user={user} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {data && <Pagination totalPages={data.totalPages} />}
        </>
      )}
    </div>
  );
};

export default UsersPage;
