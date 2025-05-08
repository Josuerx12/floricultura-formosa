// components/checkout/SummaryStep.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useCartStore from "@/hooks/use-cart-store";
import { useCheckout } from "@/hooks/use-checkout";
import useMercadoPago from "@/hooks/use-mercado-pago";
import { useMutation } from "@tanstack/react-query";
import { User } from "next-auth";
import Image from "next/image";

interface SummaryProps {
  delivery: boolean;
  address?: any;
  user: User;
  orderPreferences: {
    phone?: string;
    message?: string;
    to?: string;
    from?: string;
    deliveryDate?: Date;
  };
}

export default function SummaryStep({
  delivery,
  user,
  address,
  orderPreferences,
}: SummaryProps) {
  const { products, totalPrice, fee } = useCartStore();
  const { getCheckoutSummary } = useCheckout();

  console.log(getCheckoutSummary());

  const { createMercadoPagoCheckout } = useMercadoPago();

  const { mutateAsync, isPending: isRedirecting } = useMutation({
    mutationKey: ["createMercadoPagoCheckout"],
    mutationFn: createMercadoPagoCheckout,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
      {delivery && address && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <p>
              <strong>Rua:</strong> {address.street}, {address.number}
            </p>
            <p>
              <strong>Bairro:</strong> {address.district}
            </p>
            <p>
              <strong>Cidade/Estado:</strong> {address.city} - {address.state}
            </p>
            <p>
              <strong>CEP:</strong> {address.zipCode}
            </p>
            <p>
              <strong>Complemento:</strong> {address.complement || "Nenhum"}
            </p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-4 space-y-1">
          <p>
            <strong>Telefone:</strong> {orderPreferences.phone}
          </p>
          <p>
            <strong>De:</strong> {orderPreferences.from}
          </p>
          <p>
            <strong>Para:</strong> {orderPreferences.to}
          </p>
          <p>
            <strong>Mensagem:</strong> {orderPreferences.message}
          </p>
          {orderPreferences.deliveryDate && (
            <p>
              <strong>Data de entrega:</strong>{" "}
              {orderPreferences.deliveryDate?.toLocaleDateString("pt-BR")}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-1">
          {fee && (
            <p>
              <strong>Taxa de Entrega: </strong>{" "}
              {fee?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          )}
          <p>
            <strong>Total à pagar:</strong>{" "}
            {totalPrice().toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </CardContent>
      </Card>

      <h4 className="text-xl font-semibold">Produtos</h4>
      {products?.map((p) => {
        return (
          <Card className="flex" key={p.id}>
            <CardHeader className="border-r-2">
              <Image
                width={50}
                height={50}
                src={p.product_image as string}
                alt={p.name}
              />
            </CardHeader>
            <CardContent className="p-4 space-y-1">
              <p>
                <strong>Nome do produto: </strong> {p.name}
              </p>
              <p>
                <strong>Nome do produto: </strong> {p.quantity}{" "}
                {p.quantity > 1 ? "un's" : "un"}
              </p>
              <p>
                <strong>Preço unitario: </strong>{" "}
                {p.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </CardContent>
          </Card>
        );
      })}
      <div className="flex justify-between pt-4">
        <Button
          onClick={async () =>
            await mutateAsync({
              cart: products,
              user,
              address,
              orderPreferences,
            })
          }
          variant="outline"
        >
          Ir para Pagamento
        </Button>
      </div>
    </div>
  );
}
