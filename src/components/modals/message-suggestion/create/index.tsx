"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CreateMessageSuggestion } from "@/lib/actions/message-suggestion/infraestructure/actions/create";
import { MessageSuggestionSchema } from "@/lib/actions/message-suggestion/infraestructure/schemas/message-suggestion.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RichTextEditor } from "@/components/rich-text-editor";

export const CreateMessageSuggestionModal = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    resolver: zodResolver(MessageSuggestionSchema),
    defaultValues: {
      content: "",
    },
  });

  const query = useQueryClient();

  function handleReset() {
    reset();
    setOpen(false);
    query.invalidateQueries({ queryKey: ["Mensagens".toLowerCase()] });
  }

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["CreateMessageSuggestion"],
    mutationFn: CreateMessageSuggestion,
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
      <Button onClick={() => setOpen(true)}>Nova sugestão</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar sugestão de mensagem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <Input
              placeholder="Título"
              {...register("title", { required: true })}
            />
            <RichTextEditor
              value={watch("content")}
              onChange={(html) => setValue("content", html)}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
