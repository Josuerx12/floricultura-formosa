"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteProductAction, Product } from "@/lib/actions/products";
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
  const [state, formAction, isPending] = useActionState(
    DeleteProductAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      handleClose();
    }
  }, [state?.success]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar produto!</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="w-full mx-auto">
          <CircleX className="mx-auto text-red-600" size={200} />

          <input type="hidden" value={product.id} name="id" />
          <h4 className="text-start text-sm my-6">
            Tem certeza que deseja deletar o produto: <b>{product.name}</b>?
          </h4>

          {state?.error && <p className="text-red-600">{state?.error}</p>}

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
