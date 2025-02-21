"use client";
import useCartStore from "@/hooks/use-cart-store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DeliveryForm from "./forms/delivery-form";

const CartPage = () => {
  const { products, increaseQuantity, decreaseQuantity } = useCartStore();

  const totalPrice = products.reduce((acc, p) => {
    const totalPriceByProduct = p.price * p.quantity;

    return acc + totalPriceByProduct;
  }, 0);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col">
      <h2 className="text-center text-xl my-6">Carrinho de Compras</h2>

      <div className="flex gap-2 mx-2 flex-wrap md:flex-nowrap max-w-screen-lg">
        {products.length === 0 ? (
          <p className="text-center">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="flex flex-col gap-4 ">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex gap-4 border w-full p-3 rounded"
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

                  <div className="flex flex-col gapy-2">
                    <span>
                      {product.name} - R${product.price}
                    </span>
                    <span>
                      Valor unitario:{" "}
                      {product.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <div className="flex  items-center gap-3">
                      <button
                        className="p-1 border rounded-md"
                        onClick={() => decreaseQuantity(product.id)}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        disabled={product.total_stock === product.quantity}
                        className="p-1 border rounded-md"
                        onClick={() => increaseQuantity(product.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
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
                      R$ {(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <DeliveryForm />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
