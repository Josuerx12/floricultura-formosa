"use client";
import useCartStore from "@/hooks/use-cart-store";
import React from "react";
import Image from "next/image";
import { User } from "next-auth";
import DeliveryForm from "../delivery-form";

const CartDetails = ({ user }: { user?: User }) => {
  const { products, increaseQuantity, decreaseQuantity, fee, totalPrice } =
    useCartStore();

  return (
    <div className="flex gap-2 flex-wrap md:flex-nowrap flex-1">
      {products.length === 0 ? (
        <p className="text-center">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="flex flex-col flex-grow basis-96 gap-4 rounded-xl p-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex gap-4 w-full p-3 rounded-xl bg-white/70 shadow-md"
              >
                {product.product_image && (
                  <Image
                    src={product.product_image}
                    width={400}
                    height={400}
                    quality={80}
                    alt="Imagem do produto!"
                    className="w-32 h-32 rounded-md"
                  />
                )}

                <div className="flex flex-col gap-y-2">
                  <span className="text-sm md:text-lg uppercase">
                    {product.name}
                  </span>

                  <span className="font-bold text-sm md:text-lg text-primary-foreground">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>

                  <div className="flex  items-center gap-3">
                    <button
                      className="py-1 px-3 text-primary bg-primary-foreground rounded-md"
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      -
                    </button>
                    <span className="text-primary-foreground text-sm font-bold">
                      {product.quantity} {"un's"}
                    </span>
                    <button
                      disabled={product.total_stock === product.quantity}
                      className="py-1 px-3 text-primary bg-primary-foreground rounded-md"
                      onClick={() => increaseQuantity(product.id)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-primary-foreground font-semibold">
                    Total:{" "}
                    <span>
                      {(product.price * product.quantity).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                      )}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-white shadow-lg rounded-xl flex-grow basis-[448px] p-6 mx-2 md:mx-auto">
            <h2 className="text-lg font-semibold border-b pb-3 mb-4">
              Resumo do Pedido
            </h2>

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
                    {(product.price * product.quantity).toLocaleString(
                      "pt-BR",
                      { style: "currency", currency: "BRL" }
                    )}
                  </span>
                </div>
              ))}
            </div>

            {fee ? (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span>Frete:</span>
                  <span className="text-gray-900 font-medium">
                    {fee.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total com Frete:</span>
                  <span className="text-green-600 font-medium">
                    {totalPrice().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {totalPrice().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            )}

            <DeliveryForm user={user} />
          </div>
        </>
      )}
    </div>
  );
};

export default CartDetails;
