"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Category } from "@/lib/actions/category";
import { DeleteOrderBump } from "@/lib/actions/order-bump/infraestructure/actions/delete";
import { GetBumpsByCategoryId } from "@/lib/actions/order-bump/infraestructure/actions/get-bumps-by-category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";

type ModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  category: Category;
};

const ListOrderBumpModal = ({ handleClose, isOpen, category }: ModalProps) => {
  const query = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["RemoveBumpToCategory", category.id],
    mutationFn: DeleteOrderBump,
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
      query.invalidateQueries({ queryKey: ["listBumpProducts", category.id] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  async function onSubmit(id: number) {
    await mutateAsync(id);
  }

  const { isPending, data: bumps } = useQuery({
    queryKey: ["listBumpProducts", category.id],
    queryFn: () => GetBumpsByCategoryId(category.id),
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lista de order bumps!</DialogTitle>
        </DialogHeader>

        <div>
          {bumps && (
            <>
              <h4 className="text-start text-sm my-6 font-semibold">
                Lista de Order Bumps para a categoria: {category.name}
              </h4>
              <div className="flex justify-between flex-wrap gap-4">
                {bumps &&
                  bumps.map((bump) => (
                    <div key={bump.id} className="flex gap-2 items-center">
                      <Image
                        className="rounded-md"
                        src={bump.bumpProduct.product_images?.[0]?.url || ""}
                        width={50}
                        height={50}
                        alt={`Imagem do produto ${bump.bumpProduct.name}`}
                      />
                      <span>{bump.bumpProduct.name}</span> |
                      <span>
                        {bump.bumpProduct.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onSubmit(bump.id!)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
              </div>
            </>
          )}

          {bumps && bumps.length <= 0 && (
            <p>Nenhum bump encontrado para esse produto!</p>
          )}

          {isPending && <Loader className="my-4 animate-spin" size={32} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListOrderBumpModal;
