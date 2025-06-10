"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCheckout } from "@/hooks/use-checkout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";

const DestinatarioFormComponent = () => {
  const { thirdStep, delivery, phone, to, from, message } = useCheckout();

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      phone,
      to,
      from,
      message,
    },
  });

  const router = useRouter();

  const onSubmit = (data: any) => {
    thirdStep(data.phone, data.message, data.to, data.from);
    router.push("/carrinho/steps/resumo");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <IMaskInput
              {...field}
              mask="(00) 00000-0000"
              placeholder="(11) 91234-5678"
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
            />
          )}
        />
      </label>
      <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
        <Input {...register("from")} placeholder="De" required />
      </label>
      <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
        <Input {...register("to")} placeholder="Para" required />
      </label>
      <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
        <Textarea
          {...register("message")}
          rows={5}
          required
          placeholder="Digite sua mensagem aqui."
        />
      </label>

      <div>
        <Link
          target="_blank"
          href={"/sugestao-mensagens"}
          className="text-blue-600 underline font-semibold "
        >
          Sugestões de mensagens
        </Link>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            if (delivery) {
              router.push("/carrinho/steps/endereco");
            } else {
              router.push("/carrinho/steps/entrega");
            }
          }}
        >
          Voltar
        </Button>
        <Button type="submit">Finalizar</Button>
      </div>
    </form>
  );
};

export default DestinatarioFormComponent;
