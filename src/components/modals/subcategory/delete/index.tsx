"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DeleteSubCategoryAction,
  SubCategory,
} from "@/lib/actions/sub-category";
import { CircleX, Loader, Trash } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const DeleteSubCategoriaModal = ({
  subCategory,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
  subCategory: SubCategory;
}) => {
  const [state, formAction, isPending] = useActionState(
    DeleteSubCategoryAction,
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
          <DialogTitle>Deletar categoria!</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="w-full mx-auto">
          <CircleX className="mx-auto text-red-600" size={200} />

          <input type="hidden" value={subCategory.id} name="id" />
          <h4 className="text-start text-sm my-6">
            Tem certeza que deseja deletar a sub categoria:{" "}
            <b>{subCategory.name}</b>?
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

export default DeleteSubCategoriaModal;
