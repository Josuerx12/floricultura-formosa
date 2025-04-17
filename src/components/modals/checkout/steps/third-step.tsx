// components/checkout/ThirdStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";

export default function ThirdStep() {
  const { thirdStep, goToStep, phone, to, from, message } = useCheckout();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      phone,
      to,
      from,
      message,
    },
  });

  const onSubmit = (data: any) => {
    thirdStep(data.phone, data.message, data.to, data.from);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold">Informações do destinatário</h2>
      <Input {...register("phone")} placeholder="Telefone" required />
      <Input {...register("to")} placeholder="Para" required />
      <Input {...register("from")} placeholder="De" required />
      <Input {...register("message")} placeholder="Mensagem" required />

      <div className="flex justify-between pt-4">
        <Button variant="outline" type="button" onClick={() => goToStep(2)}>
          Voltar
        </Button>
        <Button variant="outline" type="submit">
          Finalizar
        </Button>
      </div>
    </form>
  );
}
