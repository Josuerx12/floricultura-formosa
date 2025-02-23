"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Loader,
  Plus,
  RectangleEllipsis,
  ScrollText,
} from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DeliveryFeeSchema } from "@/lib/schemas-validator/delivery-fee.schema";
import { CreateDeliveryFee } from "@/lib/actions/delivery-fee";
import { Button } from "@/components/ui/button";

const CreateDeliveryFeeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DeliveryFeeSchema),
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: ["createDeliveryFee"],
    mutationFn: CreateDeliveryFee,
    onSuccess: () => {
      setIsOpen(false);
      reset();
    },
  });

  async function onSubmit(data: any) {
    await mutateAsync(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
        Adicionar <Plus size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo bairro para entrega!</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha o campo abaixo para criar uma nova taxa de entrega!
          </h4>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("district")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o nome do bairro!"
            />
          </label>

          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <DollarSign className="text-primary-foreground" size={24} />
            <input
              {...register("fee")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="number"
              placeholder="Insira o cep da sua residencia!"
            />
          </label>

          {errors.fee && (
            <p className="text-red-500 text-sm">{errors.fee.message}</p>
          )}

          <Button type="submit" className="mt-4">
            <div className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span>Criando</span> <Loader className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Criar</span> <Plus />
                </>
              )}
            </div>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeliveryFeeModal;
