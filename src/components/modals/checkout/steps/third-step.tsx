// components/checkout/ThirdStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function ThirdStep() {
  const { thirdStep, previousStep, phone, to, from, message } = useCheckout();
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
      <Input {...register("from")} placeholder="De" required />
      <Input {...register("to")} placeholder="Para" required />
      <Textarea
        {...register("message")}
        placeholder="Digite sua mensagem aqui."
        rows={5}
        required
      />

      <Link
        target="_blank"
        href={"/sugestao-mensagens"}
        className="text-blue-600 underline font-semibold my-2"
      >
        Sugestões de mensagens
      </Link>

      <div className="flex justify-between pt-4">
        <Button variant="outline" type="button" onClick={previousStep}>
          Voltar
        </Button>
        <Button variant="outline" type="submit">
          Finalizar
        </Button>
      </div>
    </form>
  );
}
