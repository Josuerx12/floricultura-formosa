"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { CompleteUserAction } from "@/lib/actions/users";
import {
  CompleteUserInput,
  CompleteUserSchema,
} from "@/lib/schemas-validator/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, FileText, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";

const CompleteRegister = () => {
  const { data, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  console.log(data?.user);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CompleteUserInput>({
    resolver: zodResolver(CompleteUserSchema),
    defaultValues: {
      phone: data?.user.phone || "",
      document: data?.user.document || "",
      birthdate: data?.user.birthdate
        ? new Date(data.user.birthdate)
        : undefined,
    },
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: CompleteUserAction,
    mutationKey: ["complete-user-register"],
    onError: (e) => {
      toast({
        title: e.message,
        variant: "destructive",
      });
    },

    onSuccess: async (data) => {
      toast({
        title: data.message,
      });

      await update();

      setIsOpen(false);
    },
  });

  async function onSubmit(data: CompleteUserInput) {
    await mutateAsync(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>Completar Cadastro</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Completar Cadastro</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          {/* Document */}
          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <FileText className="text-primary-foreground" size={20} />
            <Controller
              control={control}
              name="document"
              defaultValue={data?.user.document || ""}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask={[
                    {
                      mask: "000.000.000-00", // CPF
                    },
                    {
                      mask: "00.000.000/0000-00", // CNPJ
                    },
                  ]}
                  placeholder="Digite seu CPF ou CNPJ"
                  className="w-full bg-transparent outline-none placeholder:text-neutral-500"
                />
              )}
            />
          </label>
          {errors.document && (
            <p className="text-red-600 text-sm">{errors.document.message}</p>
          )}

          {/* Phone */}
          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Phone className="text-primary-foreground" size={20} />
            <Controller
              control={control}
              name="phone"
              defaultValue={data?.user.phone || ""}
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
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}

          {/* Birthdate */}
          <span className="font-bold text-sm">Data de aniversario: </span>
          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Calendar className="text-primary-foreground" size={20} />
            <input
              type="date"
              defaultValue={data?.user.birthdate as any}
              {...register("birthdate", { valueAsDate: true })}
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
            />
          </label>
          {errors.birthdate && (
            <p className="text-red-600 text-sm">{errors.birthdate.message}</p>
          )}

          <Button type="submit" className="mt-4">
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteRegister;
