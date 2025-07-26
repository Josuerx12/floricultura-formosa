"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Order, ReciveOrder } from "@/lib/actions/orders";
import { Info, Truck } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ReciveOrderModal = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  function handleClose() {
    setIsOpen((prev) => !prev);
  }

  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["recive-order"],
    mutationFn: ReciveOrder,
    onSuccess: (data) => {
      query.invalidateQueries({ queryKey: ["orders"] });
      query.invalidateQueries({ queryKey: ["shippedSales"] });
      query.invalidateQueries({ queryKey: ["deliveredSales"] });
      handleClose();
      toast({
        title: data.message,
      });
      router.push("/dashboard/vendas");
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });

  async function handleSubmit() {
    await mutateAsync(order.id);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger className="py-2 px-3 text-sm rounded-md flex items-center justify-between border bg-green-600 hover:bg-green-700 text-primary duration-200">
        Enviar para o cliente <Truck size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar recebimento de produtos.</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col w-full mx-auto my-4">
          <Info size={200} className="text-green-600 mx-auto" />

          <div className="flex flex-col gap-y-2 justify-center">
            <h3 className="font-bold">Lista de produtos recebidos.</h3>
            {order.items.map((i) => {
              return (
                <div className="flex gap-2 items-center" key={i.id}>
                  {i.product?.product_images[0]?.url && (
                    <img
                      src={i.product.product_images[0].url}
                      alt={i.product.name}
                      width={50}
                      height={50}
                      className="rounded-md w-12 h-12"
                    />
                  )}
                  <span>{i.product.name}</span>
                  <span>
                    <span className="font-bold">{i.quantity}</span>{" "}
                    <b>{"un's"}</b>
                  </span>
                </div>
              );
            })}
          </div>

          <h2 className="mt-4 text-lg mx-auto">
            Confirmo ter recebido todos os produtos listados acima.
          </h2>

          <div className="flex items-center gap-2 flex-wrap mt-4">
            <Button
              disabled={isPending}
              onClick={handleClose}
              className="flex-grow"
              variant={"destructive"}
            >
              Cancelar
            </Button>

            <Button
              disabled={isPending}
              onClick={handleSubmit}
              className="flex-grow"
            >
              {isPending ? "Confirmando" : "Confirmar!"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReciveOrderModal;
