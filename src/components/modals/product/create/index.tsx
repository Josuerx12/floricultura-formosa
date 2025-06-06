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
import {
  Banknote,
  Boxes,
  CloudUpload,
  Loader,
  Plus,
  RectangleEllipsis,
  ScrollText,
} from "lucide-react";
import { useState } from "react";
import { Category } from "@/lib/actions/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "@/lib/schemas-validator/product.schema";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/rich-text-editor";

const CreateProductModal = ({ categories }: { categories: Category[] }) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen((prev) => !prev);
  }

  const {
    reset: resetForm,
    watch,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: { is_visible: false },
  });

  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: CreateProduct,
    onSuccess: () => {
      resetForm();
      setPhotos([]);
      setPreviewImages([]);
      toast({
        title: "Produto criado com sucesso!",
      });
      query.invalidateQueries({ queryKey: ["products-dash"] });
      query.invalidateQueries({ queryKey: ["products"] });
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
    formData.append("is_visible", String(data.is_visible));
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
          <DialogTitle className="text-xl font-bold text-center">
            Adicionar novo produto
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Preencha os campos abaixo para cadastrar um produto.
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="w-full flex flex-col gap-5 mx-auto mt-6"
        >
          {/* Nome */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Nome do produto</label>
            <div className="flex items-center bg-neutral-100 px-3 py-2 rounded-full">
              <RectangleEllipsis
                className="text-primary-foreground"
                size={20}
              />
              <input
                {...register("name")}
                className="ml-2 w-full bg-transparent outline-none placeholder:text-neutral-500"
                type="text"
                placeholder="Ex: Camisa Polo"
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Subcategoria */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Subcategoria</label>
            <div className="flex items-center bg-neutral-100 px-3 py-2 rounded-full">
              <ScrollText className="text-primary-foreground" size={20} />
              <select
                {...register("subcategory_id")}
                className="ml-2 w-full bg-transparent outline-none text-neutral-700"
                required
                defaultValue={""}
              >
                <option disabled value="">
                  Selecione uma subcategoria
                </option>
                {categories.map((c) =>
                  c.subcategories?.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {c.name} | {sc.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {errors.subcategory_id && (
              <p className="text-red-600 text-sm">
                {errors.subcategory_id.message}
              </p>
            )}
          </div>

          {/* Estoque */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Quantidade em estoque</label>
            <div className="flex items-center bg-neutral-100 px-3 py-2 rounded-full">
              <Boxes className="text-primary-foreground" size={20} />
              <input
                {...register("stock_quantity")}
                className="ml-2 w-full bg-transparent outline-none"
                type="number"
                placeholder="Ex: 100"
                min={0}
                required
              />
            </div>
            {errors.stock_quantity && (
              <p className="text-red-600 text-sm">
                {errors.stock_quantity.message}
              </p>
            )}
          </div>

          {/* Preço */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Preço</label>
            <div className="flex items-center bg-neutral-100 px-3 py-2 rounded-full">
              <Banknote className="text-primary-foreground" size={20} />
              <input
                {...register("price")}
                className="ml-2 w-full bg-transparent outline-none"
                placeholder="Ex: 99.90"
                required
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^0-9.,]/g,
                    ""
                  );
                }}
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Descrição</label>
            <RichTextEditor
              value={watch("description")}
              onChange={(html) => setValue("description", html)}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <label
            htmlFor="is-active"
            className="flex  p-2 gap-2 items-center rounded-3xl"
          >
            <Switch
              id="is-active"
              checked={watch("is_visible")}
              onCheckedChange={(c) => setValue("is_visible", c)}
            />
            <span>{watch("is_visible") ? "Ativo" : "Desativado"}</span>
          </label>

          {/* Imagens */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Fotos do produto</label>
            {previewImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
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
              htmlFor="photos-input"
              className="flex items-center gap-2 bg-neutral-100 p-2 rounded-xl cursor-pointer"
            >
              <CloudUpload className="text-primary" size={20} />
              <span>Clique para selecionar fotos</span>
              <input
                id="photos-input"
                type="file"
                multiple
                required
                className="hidden"
                name="photos"
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          {/* Botão */}
          <Button type="submit" className="mt-4 w-full">
            <div className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span>Criando...</span> <Loader className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Criar produto</span> <Plus />
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
