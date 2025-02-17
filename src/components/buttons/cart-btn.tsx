"use client";

import useCartStore from "@/hooks/use-cart-store";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CartBtn = () => {
  const router = useRouter();
  const { products } = useCartStore();
  return (
    <div
      onClick={() => router.push("/carrinho")}
      title="Ir para carrinho de compras!"
      className="cursor-pointer relative"
    >
      {products.length > 0 && (
        <p className="absolute text-sm bg-primary-foreground text-primary w-5 rounded-full leading-none h-5 flex items-center justify-center -top-2 -right-2">
          {products.length}
        </p>
      )}

      <ShoppingCart className="text-primary-foreground" />
    </div>
  );
};

export default CartBtn;
