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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RichTextEditor } from "@/components/rich-text-editor";
import { FlowerCareSchema } from "@/lib/actions/flower-care/infraestructure/schemas/flower-care.schema";
import { CreateFlowerCare } from "@/lib/actions/flower-care/infraestructure/actions/create";
import { CloudUpload } from "lucide-react";

export const CreateFlowerCareModal = () => {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    resolver: zodResolver(FlowerCareSchema),
    defaultValues: {
      description: "",
    },
  });

  function handleReset() {
    setPhotos([]);
    setPreviewImages([]);
    reset();
    setOpen(false);
  }

  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["CreateFlowerCare"],
    mutationFn: CreateFlowerCare,
    onSuccess: (data) => {
      toast({ title: data.message, variant: "default" });
      query.invalidateQueries({
        queryKey: ["Metodos de como cuidar".toLowerCase()],
      });
      handleReset();
    },
    onError: (e) => toast({ title: e.message, variant: "destructive" }),
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const submit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", photos[0]);

    await mutateAsync(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Novo cuidado</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar cuidado com flor.</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <Input
              placeholder="Nome da flor."
              {...register("title", { required: true })}
            />

            <label
              aria-required
              htmlFor="photos-input"
              className="flex flex-grow cursor-pointer bg-neutral-200 p-2 gap-2 rounded-3xl"
            >
              <CloudUpload className="text-primary-foreground" size={24} />
              <p>Clique aqui para adicionar uma imagem</p>
              <input
                onChange={handlePhotoChange}
                id="photos-input"
                type="file"
                multiple={false}
                required
                className="hidden"
                placeholder="Descrição do produto!"
              />
            </label>

            {previewImages.length <= 0 ? (
              <p>Nenhuma foto adicionada!</p>
            ) : (
              <div className="flex gap-2 mt-2">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}

            <RichTextEditor
              value={watch("description")}
              onChange={(html) => setValue("description", html)}
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
