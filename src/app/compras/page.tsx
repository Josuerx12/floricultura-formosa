"use client";
import { getOrdersByUser } from "@/lib/actions/orders";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Loading from "@/components/loading";
import OrderCard from "@/components/cards/order-card";

const Compras = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "10";
  const search = searchParams.get("search") || "";

  const {
    data: orders,
    isPending,
    error,
  } = useQuery({
    queryKey: ["orders", page, perPage, search],
    queryFn: () => getOrdersByUser({ page, perPage, search }),
  });

  console.log(orders);

  if (isPending) return <Loading />;
  if (error) return <div>Erro ao carregar os pedidos.</div>;

  return (
    <div className="p-6">
      <h1 className="text-center text-xl my-6">Compras Realizadas</h1>
      {orders?.data?.length === 0 ? (
        <p>Nenhuma compra encontrada.</p>
      ) : (
        <div className="grid gap-4">
          {orders?.data?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Compras;
