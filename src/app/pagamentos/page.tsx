"use client";

import useCartStore from "@/hooks/use-cart-store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle, XCircle, Hourglass } from "lucide-react";
import Link from "next/link";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { removeFee, clearCart } = useCartStore();

  useEffect(() => {
    if (status === "sucesso") {
      removeFee();
      clearCart();
    }
  }, [status, removeFee, clearCart]);

  let content;

  switch (status) {
    case "sucesso":
      content = (
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h1 className="text-2xl font-semibold text-green-700 mt-4">
            Pagamento aprovado!
          </h1>
          <p className="text-gray-700 mt-2">
            Obrigado por sua compra. Seu pedido foi confirmado e será processado
            em breve.
          </p>
          <Link
            href="/compras"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Ir para minhas compras
          </Link>
        </div>
      );
      break;

    case "falha":
      content = (
        <div className="bg-red-100 p-6 rounded-lg shadow-md">
          <XCircle className="w-16 h-16 text-red-600 mx-auto" />
          <h1 className="text-2xl font-semibold text-red-700 mt-4">
            Falha no pagamento!
          </h1>
          <p className="text-gray-700 mt-2">
            Algo deu errado com seu pagamento. Tente novamente ou escolha outro
            método de pagamento.
          </p>
          <Link
            href="/carrinho"
            className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Tentar novamente
          </Link>
        </div>
      );
      break;

    default:
      content = (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            Status desconhecido
          </h1>
          <p className="text-gray-600 mt-2">
            Não encontramos informações sobre seu pagamento.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Voltar para a loja
          </Link>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center  min-h-screen text-center p-6">
      {content}
    </div>
  );
};

export default PaymentPage;
