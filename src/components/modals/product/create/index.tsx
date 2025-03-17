"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateProduct } from "@/lib/actions/products";
import { SubCategory } from "@/lib/actions/sub-category";
import {
  Banknote,
  Boxes,
  CloudUpload,
  ListPlus,
  Loader,
  NotepadText,
  Plus,
  RectangleEllipsis,
  ScrollText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useResetableActionState } from "@/hooks/use-resetable-action-state";
import { Category } from "@/lib/actions/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "@/lib/schemas-validator/product.schema";
import { z } from "zod";

const CreateProductModal = ({ categories }: { categories: Category[] }) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen((prev) => !prev);
  }

  const {
    reset: resetForm,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductSchema),
  });

  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: CreateProduct,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] }), setIsOpen(false);
      resetForm();
      setPhotos([]);
      setPreviewImages([]);
      toast({
        title: "Produto criado com sucesso!",
      });
      handleClose();
    },
  });

  async function OnSubmit(data: z.infer<typeof ProductSchema>) {
    const formData = new FormData();

    photos?.map((p) => formData.append("photos", p));

    formData.append("name", data.name);
    formData.append("subcategory_id", data.subcategory_id?.toString());
    formData.append("stock_quantity", data.stock_quantity?.toString());
    formData.append("description", data.description);
    formData.append("price", data.price);

    await mutateAsync(formData);
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
        Adicionar <Plus size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo produto!</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha o campo abaixo para adicionar um novo produto!
          </h4>
          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("name")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o nome do produto!"
            />
          </label>

          {errors?.name && (
            <p className="text-red-600">{errors?.name.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ScrollText className="text-primary-foreground" size={24} />
            <select
              {...register("subcategory_id")}
              className="flex-grow bg-transparent outline-none text-neutral-700"
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                Selecione uma sub categoria!
              </option>
              {categories.map((c) =>
                c.subcategories?.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {c.name} | {sc.name}
                  </option>
                ))
              )}
            </select>
          </label>
          {errors?.subcategory_id && (
            <p className="text-red-600">{errors?.subcategory_id.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Boxes className="text-primary-foreground" size={24} />
            <input
              {...register("stock_quantity")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="number"
              placeholder="Quantidade em estoque!"
              min={0}
            />
          </label>

          {errors?.stock_quantity && (
            <p className="text-red-600">{errors?.stock_quantity.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Banknote className="text-primary-foreground" size={24} />
            <input
              {...register("price")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              placeholder="Preço do produto!"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9.,]/g,
                  ""
                );
              }}
            />
          </label>

          {errors?.price && (
            <p className="text-red-600">{errors?.price.message}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 rounded-3xl">
            <NotepadText className="text-primary-foreground" size={24} />
            <textarea
              {...register("description")}
              rows={5}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              placeholder="Descrição do produto!"
            />
          </label>

          {errors?.description && (
            <p className="text-red-600">{errors?.description.message}</p>
          )}

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

          <label
            aria-required
            htmlFor="photos-input"
            className="flex flex-grow cursor-pointer bg-neutral-200 p-2 gap-2 rounded-3xl"
          >
            <CloudUpload className="text-primary-foreground" size={24} />
            <p>Clique aqui para adicionar fotos</p>
            <input
              id="photos-input"
              type="file"
              multiple
              required
              className="hidden"
              name="photos"
              placeholder="Descrição do produto!"
              onChange={handlePhotoChange}
            />
          </label>

          {errors?.description && (
            <p className="text-red-600">{errors?.description.message}</p>
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

export default CreateProductModal;
