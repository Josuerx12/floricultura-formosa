"use client";
import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";
import { ProductCart } from "./use-cart-store";
import { User } from "next-auth";

export type checkoutInput = {
  cart: ProductCart[];
  address?: any;
  user: User;
  observation?: string;
  orderPreferences?: any;
};

const useMercadoPago = () => {
  const router = useRouter();

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: checkoutInput) {
    try {
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      router.push(data.initPoint);
    } catch (error) {
      console.log(error);
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
