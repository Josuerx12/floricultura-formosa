"use client";

import useCartStore from "@/hooks/use-cart-store";
import { useRouter } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";
import React from "react";

const CartBtn = () => {
  const router = useRouter();
  const { products } = useCartStore();
  return (
    <div
      onClick={() => router.push("/carrinho")}
      className="flex cursor-pointer flex-col items-center"
      title="Ir para carrinho de compras!"
    >
      <div className=" relative">
        {products.length > 0 && (
          <p className="absolute text-sm bg-primary-foreground text-primary w-5 rounded-full leading-none h-5 flex items-center justify-center -top-2 -right-2">
            {products.length}
          </p>
        )}

        <IoCartOutline className="text-primary-foreground text-2xl md:text-3xl" />
      </div>
      <p className="hidden md:block text-primary-foreground text-nowrap">
        Meu carrinho
      </p>
    </div>
  );
};

export default CartBtn;
