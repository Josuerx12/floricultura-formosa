"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Banner, deleteBanner } from "@/lib/actions/banners";
import { Category, DeleteCategoryAction } from "@/lib/actions/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX, Loader, Trash } from "lucide-react";
import { FormEvent, useActionState, useEffect } from "react";

const DeleteBannerModal = ({
  banner,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
  banner: Banner;
}) => {
  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteBanner,
    mutationKey: ["deleteBanner", banner.id],
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: data.message,
      });
      query.invalidateQueries({ queryKey: ["banners"] });
      handleClose();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await mutateAsync({ id: banner.id });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Banner!</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <CircleX className="mx-auto text-red-600" size={200} />

          <input type="hidden" value={banner.id} name="id" />
          <h4 className="text-start text-sm my-6">
            Tem certeza que deseja deletar a Banner: <b>{banner.title}</b>
          </h4>
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

export default DeleteBannerModal;
