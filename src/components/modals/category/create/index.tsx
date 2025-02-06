"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCategoryAction } from "@/lib/actions/category";
import { ListPlus, Loader, Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const CreateCategoriaModal = () => {
  const [state, formAction, isPending] = useActionState(
    CreateCategoryAction,
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state?.success]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger>
        <Button variant={"default"}>
          Adicionar <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar nova categoria!</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="w-full mx-auto">
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha o campo abaixo para criar uma nova categoria!
          </h4>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ListPlus className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              name="category"
              placeholder="Insira o nome da nova categoria!"
            />
          </label>

          {state?.errors?.category && (
            <p className="text-red-600">{state?.errors?.category}</p>
          )}

          <Button type="submit" className="mt-4">
            <div className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span>Criando</span> <Loader className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Criar</span> <Plus />
                </>
              )}
            </div>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoriaModal;
