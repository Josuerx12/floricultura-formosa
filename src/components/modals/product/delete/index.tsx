"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DeleteProduct, Product } from "@/lib/actions/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX, Loader, Trash } from "lucide-react";
import { useActionState, useEffect } from "react";

const DeleteProductModal = ({
  product,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
  product: Product;
}) => {
  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete-product", product.id],
    mutationFn: DeleteProduct,
    onSuccess: (data) => {
      toast({
        title: data.success,
      });
      query.invalidateQueries({ queryKey: ["products-dash"] });
      handleClose();
    },
  });

  async function handleSubmit() {
    await mutateAsync({ id: product.id });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar produto!</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <CircleX className="mx-auto text-red-600" size={200} />

          <h4 className="text-start text-sm my-6">
            Tem certeza que deseja deletar o produto: <b>{product.name}</b>?
          </h4>

          <Button
            type="submit"
            variant={"destructive"}
            className="mt-4 flex-grow w-full"
          >
            <div className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span>Deletando</span> <Loader className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Confirmar</span> <Trash />
                </>
              )}
            </div>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;
