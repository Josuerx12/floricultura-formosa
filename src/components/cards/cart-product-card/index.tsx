"use client";

import useCartStore, { ProductCart } from "@/hooks/use-cart-store";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CartProductCard = ({ product }: { product: ProductCart }) => {
  const { decreaseQuantity, increaseQuantity, addProduct } = useCartStore();

  return (
    <li className="flex flex-col w-full p-4 rounded-2xl overflow-auto bg-white/80 shadow-lg space-y-4">
      {/* Produto principal */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {product.product_image && (
          <Image
            src={product.product_image}
            width={400}
            height={400}
            alt="Imagem do produto"
            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg shrink-0"
          />
        )}

        <div className="flex flex-col justify-between w-full">
          {/* Nome e preço */}
          <div className="space-y-1">
            <span className="text-base md:text-lg font-semibold uppercase text-gray-700">
              {product.name}
            </span>
          </div>

          {/* Quantidade */}
          <div className="flex items-center gap-3 mt-3">
            <Button
              className="py-1 px-3 rounded-md"
              onClick={() => decreaseQuantity(product.id)}
            >
              -
            </Button>
            <span className="text-primary-foreground">
              {product.quantity} un
            </span>
            <Button
              disabled={product.total_stock === product.quantity}
              className="py-1 px-3 rounded-md disabled:opacity-50"
              onClick={() => increaseQuantity(product.id)}
            >
              +
            </Button>
          </div>

          <span className="text-gray-600 mt-2">
            Total:{" "}
            <strong className="text-primary-foreground">
              {(product.price * product.quantity).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </span>
        </div>
      </div>
    </li>
  );
};

export default CartProductCard;
