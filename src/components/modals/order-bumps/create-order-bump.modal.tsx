"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Category } from "@/lib/actions/category";
import { CreateOrderBump } from "@/lib/actions/order-bump/infraestructure/actions/create";
import { OrderBumpShema } from "@/lib/actions/order-bump/infraestructure/schemas/order-bump.schema";
import { getAllProducts, Product } from "@/lib/actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  category: Category;
};

const CreateOrderBumpModal = ({
  handleClose,
  isOpen,
  category,
}: ModalProps) => {
  const query = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    resolver: zodResolver(OrderBumpShema),
  });

  const {
    mutateAsync,
    isPending: isMutating,
    reset,
  } = useMutation({
    mutationKey: ["AddBumpToCategory", category.id],
    mutationFn: CreateOrderBump,
    onSuccess: (data) => {
      query.invalidateQueries({ queryKey: ["listBumpProducts", category.id] });
      resetForm();
      toast({
        title: data.message,
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof OrderBumpShema>) {
    await mutateAsync({
      bumpProductId: data.bumpProductId,
      categoryId: category.id,
    });
  }

  const { isPending, data: products } = useQuery({
    queryKey: ["bumpProducts", category.id],
    queryFn: getAllProducts,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        handleClose();
        reset();
        resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Order Bump!</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha o campo abaixo para adicionar um novo produto ao order
            bump!
          </h4>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <select
              {...register("bumpProductId")}
              className="flex-grow bg-transparent outline-none text-neutral-700"
              required
              defaultValue={""}
            >
              {isPending && (
                <option disabled value={""}>
                  Carregando produtos
                </option>
              )}

              {products && (
                <>
                  <option disabled value={""}>
                    Selecione um produto para criar o bump!
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>
          {errors?.bumpProductId && (
            <p className="text-red-600">{errors?.bumpProductId.message}</p>
          )}

          <Button
            type="submit"
            disabled={isMutating || isPending}
            className="mt-4"
          >
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

export default CreateOrderBumpModal;
