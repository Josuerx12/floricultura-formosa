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
import { useForm, useWatch } from "react-hook-form";
import { useMask } from "@react-input/mask";

const CompleteRegister = () => {
  const { data, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  console.log(data?.user);

  const {
    control,
    register,
    setValue,
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

  const document = useWatch({ control, name: "document" });

  const cpfMask = "___.___.___-__";
  const cnpjMask = "__.___.___/____-__";
  const currentMask = document?.length > 13 ? cnpjMask : cpfMask;

  const documentInputRef = useMask({
    mask: currentMask,
    replacement: { _: /\d/ },
  });

  const phoneInputRef = useMask({
    mask: "55 (__) _____-____",
    replacement: { _: /\d/ },
  });

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
            <input
              {...register("document")}
              ref={documentInputRef}
              onChange={(e) => {
                setValue("document", e.target.value);
              }}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
              type="text"
              placeholder="999.888.111-52 ou 12.163.577/0001-22"
            />
          </label>
          {errors.document && (
            <p className="text-red-600 text-sm">{errors.document.message}</p>
          )}

          {/* Phone */}
          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Phone className="text-primary-foreground" size={20} />
            <input
              {...register("phone")}
              ref={phoneInputRef}
              onChange={(e) => {
                setValue("phone", e.target.value);
              }}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
              type="tel"
              placeholder="+55 (22) 99797-9797"
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
