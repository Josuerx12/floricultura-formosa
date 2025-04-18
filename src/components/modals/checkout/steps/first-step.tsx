"use client";

import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { Truck, Store } from "lucide-react";

export default function FirstStep() {
  const { firstStep } = useCheckout();

  return (
    <div className="flex flex-col items-center text-center px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Escolha o Método de Entrega
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 hover:border-blue-500 transition-colors"
          onClick={() => firstStep(true)}
        >
          <Truck className="w-6 h-6 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Entrega</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 hover:border-blue-500 transition-colors"
          onClick={() => firstStep(false)}
        >
          <Store className="w-6 h-6 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Retirada</span>
        </Button>
      </div>
    </div>
  );
}
