// components/checkout/SecondStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";

export default function SecondStep() {
  const { secondStep, goToStep } = useCheckout();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    secondStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold">Endereço de entrega</h2>
      <Input {...register("street")} placeholder="Rua" required />
      <Input {...register("number")} placeholder="Número" required />
      <Input {...register("district")} placeholder="Bairro" required />
      <Input {...register("city")} placeholder="Cidade" required />
      <Input {...register("state")} placeholder="Estado" required />
      <Input {...register("zipCode")} placeholder="CEP" required />
      <Input {...register("complement")} placeholder="Complemento (opcional)" />
      <Input
        type="number"
        {...register("delivery_fee.fee")}
        placeholder="Taxa de entrega"
        required
      />
      <div className="flex justify-between pt-4">
        <Button variant="outline" type="button" onClick={() => goToStep(1)}>
          Voltar
        </Button>
        <Button variant="outline" type="submit">
          Próximo
        </Button>
      </div>
    </form>
  );
}
