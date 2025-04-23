"use client";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { UpdateRefoundTerms } from "@/lib/actions/refound-terms/infrastructure/actions/edit";
import { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditRefoundTermsModal = ({
  refoundTerms,
}: {
  refoundTerms: Prisma.refound_termsGetPayload<{}>;
}) => {
  const [open, setOpen] = useState(false);
  const { watch, setValue, handleSubmit, reset } = useForm({
    defaultValues: { ...refoundTerms },
  });

  const query = useQueryClient();

  useEffect(() => {
    reset(refoundTerms);
  }, [refoundTerms, reset]);

  function handleReset() {
    reset();
    setOpen(false);
    query.invalidateQueries({ queryKey: ["politica-de-reembolso"] });
  }

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["edit-refound-terms"],
    mutationFn: UpdateRefoundTerms,
    onSuccess: (data) => {
      toast({ title: data.message, variant: "default" });
      handleReset();
    },
    onError: (e) => toast({ title: e.message, variant: "destructive" }),
  });

  const submit = async (data: any) => {
    await mutateAsync({ id: data.id, data });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Editar <Pen />
      </Button>
      <Dialog open={open} onOpenChange={handleReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>editar politica de reembolso</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <RichTextEditor
              value={watch("content")}
              onChange={(html) => setValue("content", html)}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Editando..." : "Editar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditRefoundTermsModal;
