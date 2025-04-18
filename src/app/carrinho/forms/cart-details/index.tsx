"use client";
import useCartStore from "@/hooks/use-cart-store";
import React, { useState } from "react";
import { User } from "next-auth";
import DeliveryForm from "../delivery-form";
import CartProductCard from "@/components/cards/cart-product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CheckoutDialog from "@/components/modals/checkout";

const CartDetails = ({ user }: { user?: User }) => {
  const { products, fee, totalPrice } = useCartStore();
  const router = useRouter();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!products || products.length === 0)
    return (
      <p className="text-center">
        Nenhum produto adicionado ao carrinho. Busque por seu produto na lupa de
        pesquisa ou vá para pagina inicial{" "}
        <Link href={"/"} className="text-blue-600">
          clicando aqui!
        </Link>
      </p>
    );

  function handleCheckoutOpen() {
    setCheckoutOpen((prev) => !prev);
  }

  return (
    <>
      <CheckoutDialog handleClose={handleCheckoutOpen} isOpen={checkoutOpen} />
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Lista de produtos */}
        <div className="flex-1 min-w-0">
          <ul className="flex flex-col gap-4">
            {products.map((product) => (
              <CartProductCard key={product.id} product={product} />
            ))}
          </ul>
        </div>

        {/* Resumo do pedido */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 mx-auto">
          <h2 className="text-lg font-semibold border-b pb-3 mb-4">
            Resumo do Pedido
          </h2>

          {/* Detalhes */}
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <span className="text-gray-700">
                  {product.name} (x{product.quantity})
                </span>
                <span className="text-gray-900 font-medium">
                  {(product.price * product.quantity).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-base font-semibold">
              <span>Total:</span>
              <span className="text-green-600">
                {totalPrice().toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>

          <div className="w-full mt-4">
            {user ? (
              <Button className="w-full" onClick={handleCheckoutOpen}>
                Finalizar Pedido
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 transition duration-300 w-full"
              >
                Autentique-se para continuar
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
