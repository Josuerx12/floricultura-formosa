"use client";
import RefetchBtn from "@/components/buttons/refetch-btn";
import SalesCard from "@/components/cards/sales-card";
import { getShippedOrders } from "@/lib/actions/orders";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader, RefreshCcw } from "lucide-react";
import React from "react";

const ShippedSalesInfiniteScroll = () => {
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["shippedSales"],
    queryFn: ({ pageParam = 1 }) =>
      getShippedOrders({ pageParam: pageParam as number }),
    getNextPageParam: (lastPage: any) => lastPage.next_page,
    initialData: undefined,
    initialPageParam: 1,
    refetchInterval: 1000 * 60 * 5,
  });

  if (data?.pages[0].data.length <= 0) return null;

  return (
    <div className="flex flex-col bg-yellow-400 text-black rounded-lg shadow-md max-w-96 w-full mx-2 overflow-y-auto h-full">
      <div className="sticky inset-0 bg-yellow-200  drop-shadow-md flex  items-center justify-between p-2 gap-2">
        <h2 className="text-start font-semibold">Pedidos em rota de entrega</h2>

        <RefetchBtn isRefetching={isRefetching} refetch={refetch} />
      </div>

      {isLoading && <p className="animate-pulse">Carregando...</p>}

      <div className="flex flex-col gap-y-4 p-2">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((sale: any) => (
              <SalesCard key={sale.id} sale={sale} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {hasNextPage && !isFetchingNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Carregar mais
        </button>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center text-primary-foreground items-center gap-2">
          Carregando mais <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ShippedSalesInfiniteScroll;
