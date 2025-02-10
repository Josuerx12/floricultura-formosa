"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSubCategoryAction } from "@/lib/actions/sub-category";
import { ListPlus, Loader, Plus, ScrollText } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const CreateSubCategoryModal = ({
  categories,
}: {
  categories: { id: number; name: string }[];
}) => {
  const [state, formAction, isPending] = useActionState(
    CreateSubCategoryAction,
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
          <DialogTitle>Adicionar nova sub categoria!</DialogTitle>
        </DialogHeader>

        <form
          action={formAction}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm font-semibold">
            Preencha o campo abaixo para criar uma nova sub categoria!
          </h4>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ListPlus className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              name="name"
              placeholder="Insira o nome da nova sub categoria!"
            />
          </label>

          {state?.errors?.name && (
            <p className="text-red-600">{state?.errors?.name}</p>
          )}
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ScrollText className="text-primary-foreground" size={24} />
            <select
              name="category_id"
              className="flex-grow bg-transparent outline-none text-neutral-700"
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                Selecione uma categoria
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          {state?.errors?.category_id && (
            <p className="text-red-600">{state?.errors?.category_id}</p>
          )}
          <Button type="submit">
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

export default CreateSubCategoryModal;
