"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Banner, editBanner } from "@/lib/actions/banners";
import { EditBannerSchema } from "@/lib/schemas-validator/banner.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  Calendar,
  CloudUpload,
  Link,
  Loader,
  Pen,
  PenBox,
  RectangleEllipsis,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const DetailBannerModal = ({
  banner,
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: VoidFunction;
  banner: Banner;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["edit-banner", banner.id],
    mutationFn: editBanner,
    onSuccess: (data) => {
      setIsEditing((prev) => !prev);
      handleClose();
      toast({
        title: data.message,
      });
      setPhotos([]);
      setPreviewImages([]);
      query.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (err) => {
      toast({
        title: err.message,
        variant: "destructive",
      });
    },
  });

  const { register, watch, reset, setValue, handleSubmit } = useForm({
    resolver: zodResolver(EditBannerSchema),
    defaultValues: {
      isActive: banner.is_active,
      title: banner.title,
      url: banner?.redirect_url,
    },
  });

  async function OnSubmit(data: any) {
    const formData = new FormData();

    formData.append("id", banner.id?.toString());
    formData.append("title", data.title);
    formData.append("redirect_url", data.redirect_url);
    formData.append("is_active", data.isActive?.toString());
    formData.append("file", photos[0]);

    await mutateAsync(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do banner</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="w-full mx-auto flex flex-col gap-y-5"
        >
          {!isEditing && (
            <Button
              onClick={() => setIsEditing((prev) => !prev)}
              className="w-fit bg-blue-600 hover:bg-blue-500 text-white ml-auto"
            >
              Editar <PenBox />
            </Button>
          )}

          <h4 className="text-start text-sm font-semibold">
            Veja os detalhes abaixo do banner - ID: {banner.id}
          </h4>

          <label className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("title")}
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              defaultValue={watch("title")}
              disabled={!isEditing}
              placeholder="Insira o titulo do banner!"
            />
          </label>

          <label className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl">
            <Link className="text-primary-foreground" size={24} />
            <input
              {...register("url")}
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="url"
              defaultValue={watch("url")}
              disabled={!isEditing}
              placeholder="Insira um link de redirecionamento do seu banner!"
            />
          </label>

          <label
            htmlFor="is-active"
            className="flex  p-2 gap-2 items-center rounded-3xl"
          >
            <Switch
              disabled={!isEditing}
              id="is-active"
              checked={watch("isActive")}
              onCheckedChange={(c) => setValue("isActive", c)}
            />
            <span>{watch("isActive") ? "Ativo" : "Desativado"}</span>
          </label>

          <label className="flex flex-grow bg-neutral-200   p-2 gap-2 items-center rounded-3xl">
            <Calendar className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              disabled
              defaultValue={banner.created_at?.toLocaleString("pt-BR")}
            />
          </label>

          {isEditing && (
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
                required={false}
                className="hidden"
                placeholder="Descrição do produto!"
              />
            </label>
          )}

          {previewImages.length > 0 && (
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

          {isEditing && (
            <div className="flex gap-2 items-center">
              <Button
                type="submit"
                className="flex-grow"
                onClick={() => {
                  handleClose();
                  setIsEditing((prev) => !prev);
                }}
                variant={"destructive"}
              >
                <div className="flex items-center justify-center gap-2">
                  Cancelar <Ban />
                </div>
              </Button>
              <Button className="flex-grow" type="submit" variant={"secondary"}>
                <div className="flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <span>Editando</span> <Loader className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Editar</span> <Pen />
                    </>
                  )}
                </div>
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DetailBannerModal;
