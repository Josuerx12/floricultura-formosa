"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DeleteRefoundTerms } from "@/lib/actions/refound-terms/infrastructure/actions/delete";
import { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX, Loader, Trash } from "lucide-react";
import { FormEvent, useState } from "react";

const DeleteRefoundTermsModal = ({
  refoundTerms,
}: {
  refoundTerms: Prisma.refound_termsGetPayload<{}>;
}) => {
  const [open, setOpen] = useState(false);

  const query = useQueryClient();

  function handleReset() {
    setOpen(false);
    query.invalidateQueries({ queryKey: ["politica-de-reembolso"] });
  }

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete-privacy-terms", refoundTerms.id],
    mutationFn: DeleteRefoundTerms,
    onSuccess: (data) => {
      toast({ title: data.message });
      handleReset();
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    await mutateAsync(refoundTerms.id);
  };

  return (
    <>
      <Button variant={"destructive"} onClick={() => setOpen(true)}>
        Deletar <Trash />
      </Button>
      <Dialog open={open} onOpenChange={handleReset}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-red-600">
              Deletar politica de reembolso
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <CircleX className="text-red-500" size={100} />
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja a politica de reembolso?
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    <span>Deletando</span>
                  </>
                ) : (
                  <>
                    <Trash size={18} />
                    <span>Confirmar</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteRefoundTermsModal;
