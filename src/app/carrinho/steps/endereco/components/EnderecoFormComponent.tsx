"use client";

import CreateAddressModal from "@/components/modals/address/create";
import { Button } from "@/components/ui/button";
import useCartStore from "@/hooks/use-cart-store";
import { useCheckout } from "@/hooks/use-checkout";
import { toast } from "@/hooks/use-toast";
import { getUserAddresses } from "@/lib/actions/address";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";

const EnderecoFormComponent = ({ user }: { user: User }) => {
  const { secondStep, resetCheckout, deliveryDate } = useCheckout();
  const { products } = useCartStore();
  const [address, setAddress] = useState<any>(null);
  const { addFee, fee_id } = useCartStore();
  const { handleSubmit } = useForm();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    deliveryDate || null
  );

  const router = useRouter();

  const exceptionList: string[] = ["2025-06-08T10:00", "2025-06-14T13:00"];

  useEffect(() => {
    if (products.length <= 0) {
      router.push("/");
    }
  }, [products, router]);

  const isDateBlocked = (date: Date) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const exception of exceptionList) {
      const [exceptionDate, exceptionHour] = exception.split("T");
      const exceptionDateTime = new Date(exception);

      const selectedDate = format(date, "yyyy-MM-dd");

      if (selectedDate === exceptionDate && date <= exceptionDateTime) {
        return false;
      }
    }

    const day = date.getDay();
    const hour = date.getHours();

    if (date < today) {
      return true;
    }

    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isSameDay && now.getHours() >= 14) {
      return true;
    }

    if (day === 0) return true;

    if (day === 6 && hour >= 12) return true;

    return false;
  };

  const onSubmit = () => {
    if (!selectedDate || isDateBlocked(selectedDate)) {
      toast({
        title: "Data inválida para entrega.",
        description:
          "Selecione uma data permitida para entrega. Finais de semana e horários após o limite são bloqueados.",
        variant: "destructive",
      });
      return;
    }

    secondStep(address, selectedDate);

    router.push("/carrinho/steps/destinatario");
  };

  const { data, isPending } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddresses(user),
    refetchOnWindowFocus: true,
  });

  return (
    <>
      <CreateAddressModal />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          {isPending && (
            <div className="flex items-center justify-center gap-2">
              <span>Carregando endereços</span>
              <Loader2 className="animate-spin" />
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-y-4">
              {data.map((a) => (
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
                    <span className="text-sm text-justify">
                      Rua: {a.street}, número: {a.number}, bairro: {a.district},
                      estado: {a.state}, cidade: {a.city}
                      {a.complement && `, complemento: ${a.complement}`}
                    </span>
                    <span className="text-sm">
                      <b>
                        Taxa:{" "}
                        {a.delivery_fee!.fee.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </b>
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Data e hora da entrega</label>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione uma data e hora"
              minDate={new Date()}
              className="w-full border px-3 py-2 rounded-md text-sm"
              filterDate={(date) => !isDateBlocked(date)}
              locale={"pt-BR"}
            />
          </div>
          {selectedDate && isDateBlocked(selectedDate) && (
            <p className="text-sm text-destructive font-medium">
              Data/hora não permitida. Escolha outro horário ou dia.
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              resetCheckout();
              router.push("/carrinho/steps/entrega");
            }}
          >
            Voltar
          </Button>
          <Button type="submit">Próximo</Button>
        </div>
      </form>
    </>
  );
};

export default EnderecoFormComponent;
