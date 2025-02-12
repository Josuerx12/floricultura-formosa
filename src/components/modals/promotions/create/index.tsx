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
import { CreatePromotionAction } from "@/lib/actions/promotions";
import {
  BadgePercent,
  Calendar,
  ListPlus,
  Loader,
  Plus,
  ScrollText,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CreatePromotionModal = ({
  products,
}: {
  products: { id: number; name: string }[];
}) => {
  const [state, formAction, isPending, reset] = useResetableActionState(
    CreatePromotionAction,
    null
  );
  const { register, reset: resetForm } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      reset();
      resetForm();
    }
  }, [state?.success]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen((prev) => !prev);
        reset();
        resetForm();
      }}
    >
      <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
        Adicionar <Plus size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar nova promoção!</DialogTitle>
        </DialogHeader>

        <form
          action={formAction}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm font-semibold">
            Preencha os campos abaixo para criar uma nova promoção!
          </h4>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ScrollText className="text-primary-foreground" size={24} />
            <select
              {...register("product_id")}
              className="flex-grow bg-transparent outline-none text-neutral-700"
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                Selecione um produto
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          {state?.errors?.product_id && (
            <p className="text-red-600">{state?.errors?.product_id}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <BadgePercent className="text-primary-foreground" size={24} />
            <input
              {...register("discount_percentage")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="number"
              max={99}
              min={0}
              placeholder="Insira a porcentagem do disconto!"
            />
          </label>

          {state?.errors?.discount_percentage && (
            <p className="text-red-600">{state?.errors?.discount_percentage}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Calendar className="text-primary-foreground" size={24} />
            <input
              {...register("start_date")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="datetime-local"
              placeholder="Insira uma data de inicio para promoção!"
            />
          </label>

          {state?.errors?.start_date && (
            <p className="text-red-600">{state?.errors?.start_date}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Calendar className="text-primary-foreground" size={24} />
            <input
              {...register("end_date")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="datetime-local"
              placeholder="Insira uma data de fim para promoção!"
            />
          </label>

          {state?.errors?.end_date && (
            <p className="text-red-600">{state?.errors?.end_date}</p>
          )}

          {state?.error && <p className="text-red-600">{state?.error}</p>}

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

export default CreatePromotionModal;
