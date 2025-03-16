"use server";

import React from "react";
import DeliveryForm from "./forms/delivery-form";
import CartDetails from "./forms/cart-details";
import { auth } from "@/lib/auth/auth";

const CartPage = async () => {
  const user = await auth();

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col mb-10">
      <h2 className="text-center text-xl my-6">Carrinho de Compras</h2>

      <CartDetails user={user?.user} />
    </div>
  );
};

export default CartPage;
