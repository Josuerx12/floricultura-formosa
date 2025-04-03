"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Plus, RectangleEllipsis, ScrollText } from "lucide-react";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddressSchema } from "@/lib/schemas-validator/address.schema";
import { CreateAddressAction, getDistricts } from "@/lib/actions/address";
import { Button } from "@/components/ui/button";

const CreateAddressModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddressSchema),
  });

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["createAddress"],
    mutationFn: CreateAddressAction,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.resetQueries({ queryKey: ["userAddresses"] });
    },
  });

  async function onSubmit(data: any) {
    await mutateAsync(data);
  }

  const { data } = useQuery({ queryKey: ["districts"], queryFn: getDistricts });

  const ref = useRef<HTMLFormElement | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger className="text-blue-500 p-2 rounded font-medium text-sm drop-shadow">
        Adicionar endereço
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo endereço!</DialogTitle>
        </DialogHeader>

        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha o campo abaixo para criar um novo endereço!
          </h4>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("zipCode")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o cep da sua residencia!"
            />
          </label>

          {errors.zipCode && (
            <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ScrollText className="text-primary-foreground" size={24} />
            <select
              {...register("delivery_fee_id")}
              className="flex-grow bg-transparent outline-none text-neutral-700"
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                Selecione seu bairro
              </option>
              {data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.district} -{" "}
                  {Number(d.fee).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </option>
              ))}
            </select>
          </label>

          {errors.delivery_fee_id && (
            <p className="text-red-500 text-sm">
              {errors.delivery_fee_id.message}
            </p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("street")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o nome da rua!"
            />
          </label>

          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("number")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o numero da residencia!"
            />
          </label>

          {errors.number && (
            <p className="text-red-500 text-sm">{errors.number.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("state")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o nome do seu estado!"
            />
          </label>

          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("city")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o nome da sua cidade!"
            />
          </label>

          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
          <Button
            onClick={() => ref.current?.requestSubmit()}
            type="button"
            className="mt-4"
          >
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

export default CreateAddressModal;
