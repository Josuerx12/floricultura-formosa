"use client";
import { getOrdersByUser } from "@/lib/actions/orders";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { CheckCircle, Truck, XCircle } from "lucide-react";

const Compras = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "10";
  const search = searchParams.get("search") || "";

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", page, perPage, search],
    queryFn: () => getOrdersByUser({ page, perPage, search }),
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os pedidos.</div>;

  return (
    <div className="p-6">
      <h1 className="text-center text-xl my-6">Compras Realizadas</h1>
      {orders?.data?.length === 0 ? (
        <p>Nenhuma compra encontrada.</p>
      ) : (
        <div className="grid gap-4">
          {orders?.data?.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>ID do pedido: {order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Usuário:</strong> {order.user.name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {order.user.phone || "N/A"}
                </p>
                <div className="flex gap-2">
                  <strong>Status:</strong>{" "}
                  {order.status == "CANCELED" && (
                    <div className="text-red-500 flex items-center gap-2 text-sm">
                      <XCircle size={14} /> Cancelado
                    </div>
                  )}
                  {order.status == "SHIPPED" && (
                    <div className="text-yellow-500 animate-pulse flex items-center gap-2 text-sm">
                      <Truck size={14} /> Em rota de entrega
                    </div>
                  )}
                  {order.status == "DELIVERED" && (
                    <div className="text-gray-500 flex items-center gap-2 text-sm">
                      <CheckCircle size={14} /> Entregue
                    </div>
                  )}
                  {order.status == "PROCESSING" && (
                    <div className="text-green-500 flex items-center gap-2 text-sm">
                      <CheckCircle size={14} /> Em separação, pagamento
                      efetuado.
                    </div>
                  )}
                  {order.status == "PENDING" && (
                    <div className="text-gray-400 animate-pulse flex items-center gap-2 text-sm">
                      <CheckCircle size={14} /> Aguarando pagamento.
                    </div>
                  )}
                </div>

                <p>
                  <strong>Endereço:</strong>{" "}
                  {order.address
                    ? order.address.street
                    : "Endereço não informado"}
                </p>
                <p>
                  <strong>Pedido realizado: </strong>{" "}
                  {order.createdAt.toLocaleString("pt-BR")}
                </p>
                <h2 className="mt-4 text-lg font-semibold">Itens do Pedido</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:block"></TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Preço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell width={48} className="hidden sm:block">
                          <Image
                            className="!w-12"
                            src={item.product.product_images[0]!.url}
                            alt={"Foto do produto " + item.product.name}
                            width={48}
                            height={48}
                            quality={100}
                          />
                        </TableCell>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Compras;
