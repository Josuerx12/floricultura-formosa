"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useCartStore from "@/hooks/use-cart-store";
import { useCheckout } from "@/hooks/use-checkout";
import useMercadoPago from "@/hooks/use-mercado-pago";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SummaryComponent = ({ user }: { user: any }) => {
  const { products, totalPrice, fee, clearCart } = useCartStore();
  const { getCheckoutSummary, resetCheckout } = useCheckout();
  const router = useRouter();

  const { delivery, recipient, address, deliveryDate } = getCheckoutSummary();

  const [acceptedTerms, setAcceptedTerms] = useState({
    usage: false,
    purchase: false,
  });

  useEffect(() => {
    if (!recipient && !address && !delivery) {
      router.push("/carrinho/steps/entrega");
    }

    if (typeof delivery === "boolean" && delivery && !address) {
      router.push("/carrinho/steps/endereco");
    }

    if (typeof delivery === "boolean" && delivery && !recipient) {
      router.push("/carrinho/steps/destinatario");
    }

    if (products.length <= 0) {
      router.push("/");
    }
  }, [router, recipient, address, products]);

  const { createMercadoPagoCheckout } = useMercadoPago();

  const { mutateAsync, isPending: isRedirecting } = useMutation({
    mutationKey: ["createMercadoPagoCheckout"],
    mutationFn: createMercadoPagoCheckout,
  });

  return (
    <div className="space-y-4">
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
            <strong>Telefone:</strong> {recipient.phone}
          </p>
          <p>
            <strong>De:</strong> {recipient.from}
          </p>
          <p>
            <strong>Para:</strong> {recipient.to}
          </p>
          <p>
            <strong>Mensagem:</strong> {recipient.message}
          </p>
          {deliveryDate && (
            <p>
              <strong>Data de entrega:</strong>{" "}
              {deliveryDate?.toLocaleDateString("pt-BR")}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-1">
          {delivery && fee && fee > 0 && (
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
                <strong>Quantidade: </strong> {p.quantity}{" "}
                {p.quantity > 1 ? "un's" : "un"}
              </p>
              <p>
                <strong>Preço unitário: </strong>{" "}
                {p.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </CardContent>
          </Card>
        );
      })}

      {/* Termos de Uso e Compra */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="usageTerms"
            checked={acceptedTerms.usage}
            onChange={(e) =>
              setAcceptedTerms((prev) => ({
                ...prev,
                usage: e.target.checked,
              }))
            }
          />
          <label htmlFor="usageTerms" className="text-sm">
            Li e aceito a{" "}
            <Link
              target="_blank"
              href={"/politica-de-privacidade"}
              className="text-blue-600 underline"
            >
              Politica de Privacidade
            </Link>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="purchaseTerms"
            checked={acceptedTerms.purchase}
            onChange={(e) =>
              setAcceptedTerms((prev) => ({
                ...prev,
                purchase: e.target.checked,
              }))
            }
          />
          <label htmlFor="purchaseTerms" className="text-sm">
            Li e aceito os{" "}
            <Link
              target="_blank"
              href={"/termos-de-uso"}
              className="text-blue-600 underline"
            >
              Termos de Uso
            </Link>
          </label>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          onClick={() => {
            resetCheckout();
            clearCart();
            router.push("/");
          }}
          variant={"destructive"}
        >
          Cancelar Pagamento
        </Button>
        <Button
          disabled={
            !acceptedTerms.usage || !acceptedTerms.purchase || isRedirecting
          }
          onClick={async () =>
            await mutateAsync({
              cart: products,
              user,
              address,
              orderPreferences: recipient,
              deliveryDate,
            })
          }
        >
          Ir para Pagamento
        </Button>
      </div>
    </div>
  );
};

export default SummaryComponent;
