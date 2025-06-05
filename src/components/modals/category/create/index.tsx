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
import { BadgePlus, Loader, Plus, Link2 } from "lucide-react";
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
      <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
        Adicionar <Plus size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar nova categoria!</DialogTitle>
        </DialogHeader>

        <form
          action={formAction}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha os campos abaixo para criar uma nova categoria!
          </h4>

          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <BadgePlus className="text-primary-foreground" size={20} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              type="text"
              name="category"
              placeholder="Nome da nova categoria"
            />
          </label>

          {state?.errors?.category && (
            <p className="text-red-600 text-sm">{state?.errors?.category}</p>
          )}

          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Link2 className="text-primary-foreground" size={20} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              type="text"
              name="slug"
              placeholder="Slug da nova categoria"
            />
          </label>

          {state?.errors?.slug && (
            <p className="text-red-600 text-sm">{state?.errors?.slug}</p>
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
