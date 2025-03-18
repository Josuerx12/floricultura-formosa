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
      className="flex cursor-pointer gap-4 items-center"
      title="Ir para carrinho de compras!"
    >
      <p className="hidden md:block text-primary text-nowrap uppercase">
        carrinho
      </p>

      <div className=" relative ">
        {products.length > 0 && (
          <p className="absolute text-sm bg-primary text-primary-foreground font-medium w-5 rounded-full leading-none h-5 flex items-center justify-center -top-2 -right-2">
            {products.length}
          </p>
        )}

        <IoCartOutline className="text-primary text-2xl md:text-3xl" />
      </div>
    </div>
  );
};

export default CartBtn;
