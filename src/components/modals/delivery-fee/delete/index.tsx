"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DeleteDeliveryFee } from "@/lib/actions/delivery-fee";
import { delivery_fee } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX, Loader, Trash } from "lucide-react";
import { FormEvent } from "react";

const DeleteNeighborhoodModal = ({
  fee,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
  fee: delivery_fee;
}) => {
  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete-delivery-fee", fee.id],
    mutationFn: DeleteDeliveryFee,
    onSuccess: () => {
      toast({ title: "Bairro / Taxa de entrega deletada com sucesso!" });
      query.invalidateQueries({ queryKey: ["allDeliveryFees"] });
      handleClose();
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await mutateAsync(fee.id);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-red-600">
            Deletar bairro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <CircleX className="text-red-500" size={100} />
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja deletar o bairro{" "}
              <span className="font-semibold text-foreground">
                {fee.district}
              </span>
              ? Esta ação não poderá ser desfeita.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>Deletando</span>
                </>
              ) : (
                <>
                  <Trash size={18} />
                  <span>Confirmar</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNeighborhoodModal;
