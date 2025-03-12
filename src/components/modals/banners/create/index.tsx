"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { storeBanner } from "@/lib/actions/banners";
import { BannerSchema } from "@/lib/schemas-validator/banner.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CloudUpload,
  Link,
  Loader,
  Plus,
  RectangleEllipsis,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const CreateBannerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BannerSchema),
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["createAddress"],
    mutationFn: storeBanner,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      setPhotos([]);
      setPreviewImages([]);
      queryClient.resetQueries({ queryKey: ["banners"] });
    },
  });

  async function onSubmit(data: any) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("redirect_url", data.redirect_url);
    formData.append("file", photos[0]);

    await mutateAsync(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
        Adicionar banner <Plus />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar banner!</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha o campo abaixo para criar um novo endereço!
          </h4>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("title")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira um titulo para seu banner!"
            />
          </label>

          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Link className="text-primary-foreground" size={24} />
            <input
              {...register("redirect_url")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira um link de redirecionameto do banner!"
            />
          </label>

          {errors.redirect_url && (
            <p className="text-red-500 text-sm">
              {errors.redirect_url.message}
            </p>
          )}

          <label
            aria-required
            htmlFor="photos-input"
            className="flex flex-grow cursor-pointer bg-neutral-200 p-2 gap-2 rounded-3xl"
          >
            <CloudUpload className="text-primary-foreground" size={24} />
            <p>Clique aqui para adicionar o banner</p>
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
            <p>Nenhuma foto selecionada para o produto!</p>
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

          <Button type="submit" className="mt-4">
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

export default CreateBannerModal;
