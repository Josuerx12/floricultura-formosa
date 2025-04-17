"use client";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";

export default function FirstStep() {
  const { firstStep } = useCheckout();

  return (
    <div>
      <h2 className="text-xl font-semibold">Escolha o Método de Entrega</h2>
      <div className="space-y-4">
        <Button variant="outline" onClick={() => firstStep(true)}>
          Entrega
        </Button>
        <Button variant="outline" onClick={() => firstStep(false)}>
          Retirada
        </Button>
      </div>
    </div>
  );
}
