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
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SecondStep({ user }: { user: User }) {
  const { secondStep, goToStep } = useCheckout();
  const [address, setAddress] = useState<any>(null);
  const { addFee, fee_id } = useCartStore();
  const { handleSubmit } = useForm();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isDateBlocked = (date: Date) => {
    const today = new Date();
    const dayOfWeek = date.getDay();
    const hour = date.getHours();

    if (dayOfWeek === 0) {
      return true;
    }

    if (dayOfWeek === 6 && hour >= 12) {
      return true;
    }

    if (date < new Date(today.setHours(0, 0, 0, 0))) {
      return true;
    }

    return false;
  };

  const onSubmit = () => {
    if (!selectedDate) {
      toast({
        title: "Não foi possivel passar para o segundo passo.",
        variant: "destructive",
      });
      return;
    }
    secondStep(address, selectedDate);
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
                        setAddress(a);
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

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Data de entrega</label>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "dd/MM/yyyy")
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setIsPopoverOpen(false);
              }}
              disabled={isDateBlocked}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {selectedDate && isDateBlocked(selectedDate) && (
          <p className="text-sm font-medium text-destructive">
            A data selecionada não é válida para entrega (Domingos ou data
            passada).
          </p>
        )}
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
