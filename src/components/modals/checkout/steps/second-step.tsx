"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { useQuery } from "@tanstack/react-query";
import { getUserAddresses } from "@/lib/actions/address";
import { User } from "next-auth";
import useCartStore from "@/hooks/use-cart-store";
import CreateAddressModal from "../../address/create";
import { Loader2 } from "lucide-react";

export default function SecondStep({ user }: { user: User }) {
  const { secondStep, goToStep } = useCheckout();
  const { addFee, removeFee, fee_id } = useCartStore();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    secondStep(data);
  };

  const { data, isPending } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddresses(user),
    refetchOnWindowFocus: true,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold">
        Endereços de entrega cadastrados
      </h2>
      {/* <Input {...register("street")} placeholder="Rua" required />
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
      /> */}

      <div>
        {isPending && (
          <div className="flex items-center justify-center gap-2">
            <span>Carregando endereços</span>{" "}
            <Loader2 className="animate-spin" />
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-y-4">
            {data.map((a) => {
              return (
                <label key={a.id} className="flex items-start space-x-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="pickup"
                      checked={fee_id === a.id}
                      onChange={() => {
                        a.delivery_fee && addFee(a.delivery_fee.fee, a.id);
                      }}
                      className="form-radio"
                    />
                    <span className="font-bold">Endereço: </span>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <span className="text-justify text-sm">
                      Rua: {a.street}, numero: {a.number}, bairro: {a.district},
                      estado: {a.state}, cidade: {a.city},{" "}
                      {a.complement && "complemento:" + a.complement}{" "}
                    </span>
                    <span className="text-sm">
                      <b>
                        taxa:{" "}
                        {a.delivery_fee!.fee.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </b>
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
        <CreateAddressModal />
      </div>
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
