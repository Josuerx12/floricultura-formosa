"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { EditDeliveryFee } from "@/lib/actions/delivery-fee";
import {
  DeliveryFeeSchema,
  DeliveryFeeType,
} from "@/lib/schemas-validator/delivery-fee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { delivery_fee } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Banknote, Loader, PenBox, RectangleEllipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const DetailNeighborhoodModal = ({
  fee,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: VoidFunction;
  fee: delivery_fee;
}) => {
  const query = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(DeliveryFeeSchema),
    defaultValues: {
      id: fee.id,
      district: fee.district,
      fee: fee.fee?.toString(),
    },
  });

  useEffect(() => {
    reset({
      district: fee.district,
      fee: fee.fee?.toString(),
    });
  }, [fee, reset]);

  const onClose = () => {
    setIsEditing(false);
    reset();
    handleClose();
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: EditDeliveryFee,
    onSuccess: (data) => {
      toast({ title: data.message });
      onClose();
      query.invalidateQueries({ queryKey: ["allDeliveryFees"] });
    },
    onError: (err) => {
      toast({ title: err.message });
    },
  });

  const ref = useRef<HTMLFormElement | null>(null);

  const OnSubmit = async (data: DeliveryFeeType) => {
    await mutateAsync({ ...data, id: fee.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do bairro / taxa</DialogTitle>
        </DialogHeader>

        <p className="text-sm font-semibold mb-2">
          Veja os detalhes abaixo do bairro / taxa - ID: {fee.id}
        </p>

        <form
          ref={ref}
          onSubmit={handleSubmit(OnSubmit)}
          className="flex flex-col gap-4"
        >
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-fit bg-blue-600 hover:bg-blue-500 text-white ml-auto"
              type="button"
            >
              Editar <PenBox className="ml-2" />
            </Button>
          )}

          <label className="flex items-center gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <RectangleEllipsis />
            <input
              {...register("district")}
              disabled={!isEditing}
              className="w-full bg-transparent outline-none"
              placeholder="Bairro"
            />
          </label>
          {errors.district && (
            <p className="text-red-600">{errors.district.message}</p>
          )}

          <label className="flex items-center gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <Banknote />
            <input
              {...register("fee")}
              disabled={!isEditing}
              className="w-full bg-transparent outline-none"
              placeholder="Preço da taxa"
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9.,]/g,
                  ""
                ))
              }
            />
          </label>
          {errors.fee && <p className="text-red-600">{errors.fee.message}</p>}

          {isEditing && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="destructive"
                className="flex-1"
                disabled={isPending}
              >
                Cancelar <Ban className="ml-2" />
              </Button>
              <Button
                type="button"
                onClick={() => ref.current?.requestSubmit()}
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    Editando <Loader className="animate-spin" />
                  </div>
                ) : (
                  <span>Salvar</span>
                )}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DetailNeighborhoodModal;
