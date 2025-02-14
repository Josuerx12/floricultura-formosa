"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Category,
  CreateCategoryAction,
  EditCategoryAction,
} from "@/lib/actions/category";
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

const DetailCategoriaModal = ({
  category,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: VoidFunction;
  category: Category;
}) => {
  const [state, formAction, isPending] = useActionState(
    EditCategoryAction,
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsEditing((prev) => !prev);
      handleClose();
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
            Veja os detalhes abaixo da categoria - ID: {category.id}
          </h4>
          <input type="hidden" name="id" value={category.id} />
          <label className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl">
            <ListPlus className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              name="name"
              defaultValue={category.name}
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
              defaultValue={category.created_at?.toLocaleString("pt-BR")}
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

export default DetailCategoriaModal;
