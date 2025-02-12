"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useResetableActionState } from "@/hooks/use-resetable-action-state";
import {
  Category,
  CreateCategoryAction,
  EditCategoryAction,
} from "@/lib/actions/category";
import { SubCategory, EditSubCategoryAction } from "@/lib/actions/sub-category";
import {
  Ban,
  Calendar,
  ListPlus,
  Loader,
  Pen,
  PenBox,
  Plus,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const DetailSubCategoriaModal = ({
  subCategory,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: VoidFunction;
  subCategory: SubCategory;
}) => {
  const [state, formAction, isPending, reset] = useResetableActionState(
    EditSubCategoryAction,
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (state?.success) {
      Promise.all([setIsEditing((prev) => !prev), handleClose(), reset()]);
    }
  }, [state?.success]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes de categoria</DialogTitle>
        </DialogHeader>

        <form
          action={formAction}
          className="w-full mx-auto flex flex-col gap-y-5"
        >
          {!isEditing && (
            <Button
              onClick={() => setIsEditing((prev) => !prev)}
              className="w-fit bg-blue-600 hover:bg-blue-500 text-white ml-auto"
            >
              Editar <PenBox />
            </Button>
          )}
          <h4 className="text-start text-sm font-semibold">
            Veja os detalhes abaixo da categoria - ID: {subCategory.id}
          </h4>
          <input type="hidden" name="id" value={subCategory.id} />
          <label className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl">
            <ListPlus className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              name="name"
              defaultValue={subCategory.name}
              disabled={!isEditing}
              placeholder="Insira o nome da nova categoria!"
            />
          </label>
          <label className="flex flex-grow bg-neutral-200   p-2 gap-2 items-center rounded-3xl">
            <Calendar className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              disabled
              defaultValue={subCategory.created_at.toLocaleString("pt-BR")}
            />
          </label>

          {state?.error && <p className="text-red-600">{state?.error}</p>}

          {isEditing && (
            <div className="flex gap-2 items-center">
              <Button
                type="submit"
                className="flex-grow"
                onClick={() => {
                  handleClose();
                  setIsEditing((prev) => !prev);
                  reset();
                }}
                variant={"destructive"}
              >
                <div className="flex items-center justify-center gap-2">
                  Cancelar <Ban />
                </div>
              </Button>
              <Button className="flex-grow" type="submit" variant={"secondary"}>
                <div className="flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <span>Editando</span> <Loader className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Editar</span> <Pen />
                    </>
                  )}
                </div>
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DetailSubCategoriaModal;
