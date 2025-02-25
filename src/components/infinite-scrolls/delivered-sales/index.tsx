"use client";
import SalesCard from "@/components/cards/sales-card";
import { getDeliveredOrders } from "@/lib/actions/orders";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

const DeliveredSalesInfiniteScroll = () => {
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["deliveredSales"],
    queryFn: ({ pageParam = 1 }) =>
      getDeliveredOrders({ pageParam: pageParam as number }),
    getNextPageParam: (lastPage: any) => lastPage.next_page,
    initialData: undefined,
    initialPageParam: 1,
  });

  if (data?.pages[0].data.length <= 0) return null;

  return (
    <div className="flex flex-col bg-neutral-300 text-black rounded-lg shadow-md max-w-[300px] p-4 mx-2 overflow-y-auto h-screen">
      <h2 className="text-center md:text-lg font-semibold my-4">
        Pedidos entregues
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

export default DeliveredSalesInfiniteScroll;
