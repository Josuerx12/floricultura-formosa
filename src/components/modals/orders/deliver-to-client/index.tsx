"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeliverOrder, Order } from "@/lib/actions/orders";
import { Info, Truck } from "lucide-react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const DeliverToClientModal = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen((prev) => !prev);
  }

  const router = useRouter();

  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["deliver-order", order.id],
    mutationFn: DeliverOrder,
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
      query.invalidateQueries({ queryKey: ["processedSales"] });
      query.invalidateQueries({ queryKey: ["shippedSales"] });
      handleClose();
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
      <DialogTrigger className="py-2 px-3 text-sm rounded-md flex items-center justify-between border bg-blue-500 hover:bg-blue-600 text-primary duration-200">
        Enviar para o cliente <Truck size={18} />
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg!">
        <DialogHeader>
          <DialogTitle>Enviar para o cliente!</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col w-full mx-auto my-4">
          <Info size={200} className="text-green-600 mx-auto" />

          <div className="flex flex-col gap-y-2 justify-center">
            <h3 className="font-bold">Lista de produtos.</h3>
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
            Tem certeza que deseja enviar esse pedido para o cliente?
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
              {isPending ? "Enviando" : "Enviar!"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliverToClientModal;
