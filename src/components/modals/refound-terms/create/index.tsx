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
import { CreateRefoundTerms } from "@/lib/actions/refound-terms/infrastructure/actions/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const CreateRefoundTermsModal = () => {
  const [open, setOpen] = useState(false);
  const { watch, setValue, handleSubmit, reset } = useForm({
    defaultValues: { content: "<p>Novo termo de reembolso...</p>" },
  });

  const query = useQueryClient();

  function handleReset() {
    reset();
    setOpen(false);
    query.invalidateQueries({ queryKey: ["politica-de-reembolso"] });
  }

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["create-refound-terms"],
    mutationFn: CreateRefoundTerms,
    onSuccess: (data) => {
      toast({ title: data.message, variant: "default" });
      handleReset();
    },
    onError: (e) => toast({ title: e.message, variant: "destructive" }),
  });

  const submit = async (data: any) => {
    await mutateAsync(data);
  };

  return (
    <>
      <Button variant={"link"} onClick={() => setOpen(true)}>
        Criar politica de reembolso
      </Button>
      <Dialog open={open} onOpenChange={handleReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>criar politica de reembolso</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <RichTextEditor
              value={watch("content")}
              onChange={(html) => setValue("content", html)}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRefoundTermsModal;
