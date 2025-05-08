"use server";

import React from "react";
import CartDetails from "./forms/cart-details";
import { auth } from "@/lib/auth/auth";

const CartPage = async () => {
  const user = await auth();

  return (
    <div className="max-w-screen-xl w-full mx-auto flex flex-col mb-10">
      <h2 className="text-center text-xl my-6 font-medium uppercase">
        Carrinho de Compras
      </h2>

      <CartDetails user={user?.user} />
    </div>
  );
};

export default CartPage;
