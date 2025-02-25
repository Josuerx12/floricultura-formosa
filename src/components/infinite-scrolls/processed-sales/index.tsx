"use client";
import SalesCard from "@/components/cards/sales-card";
import { getPendingOrders, getProcessedOrders } from "@/lib/actions/orders";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

const ProcessedSalesInfiniteScroll = () => {
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["processedSales"],
    queryFn: ({ pageParam = 1 }) =>
      getProcessedOrders({ pageParam: pageParam as number }),
    getNextPageParam: (lastPage: any) => lastPage.next_page,
    initialData: undefined,
    initialPageParam: 1,
  });

  if (data?.pages[0].data.length <= 0) return null;

  return (
    <div className="flex flex-col bg-emerald-500 text-brack rounded-lg shadow-md  min-w-[300px] w-full p-4 mx-2 overflow-y-auto h-screen">
      <h2 className="text-center md:text-lg font-semibold my-4">
        Vendas aprovadas
      </h2>

      {isLoading && <p className="animate-pulse">Carregando...</p>}

      <div className="flex flex-col gap-y-4 ">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((sale: any) => (
              <SalesCard key={sale.id} sale={sale} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Carregar mais
        </button>
      )}
    </div>
  );
};

export default ProcessedSalesInfiniteScroll;
