"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Category } from "@/lib/actions/category";
import {
  deleteProductPhoto,
  GetProductImages,
} from "@/lib/actions/product-images";
import { EditProduct, Product } from "@/lib/actions/products";
import {
  EditProductSchema,
  ProductSchema,
} from "@/lib/schemas-validator/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  Banknote,
  Boxes,
  Calendar,
  CloudUpload,
  Loader,
  NotepadText,
  Pen,
  PenBox,
  RectangleEllipsis,
  ScrollText,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DetailProductModal = ({
  product,
  isOpen,
  handleClose,
  categories,
}: {
  isOpen: boolean;
  handleClose: VoidFunction;
  product: Product;
  categories: Category[];
}) => {
  const { data: images, isPending: imagesLoading } = useQuery({
    queryKey: ["product-image", product.id],
    queryFn: () => GetProductImages({ product_id: product.id }),
  });

  const query = useQueryClient();

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(EditProductSchema),
  });

  const [isEditing, setIsEditing] = useState(false);

  function onClose() {
    setIsEditing(false);
    setPhotos([]);
    setPreviewImages([]);
    reset();
    handleClose();
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: EditProduct,
    mutationKey: ["edit-product"],
    onSuccess: (data) => {
      toast({
        title: data.success,
      });
      query.invalidateQueries({ queryKey: ["products-dash"] });
      query.invalidateQueries({ queryKey: ["product-image"] });
      onClose();
    },
    onError: (err) => {
      toast({
        title: err.message,
      });
    },
  });

  const ref = useRef<HTMLFormElement | null>(null);

  async function OnSubmit(data: z.infer<typeof EditProductSchema>) {
    const formData = new FormData();

    data.name && formData.append("name", data.name);
    data.description && formData.append("description", data.description);
    data.price && formData.append("price", data.price);
    data.stock_quantity &&
      formData.append("stock_quantity", data.stock_quantity.toString());
    data.subcategory_id &&
      formData.append("subcategory_id", data.subcategory_id.toString());

    photos.map((p) => formData.append("photos", p));

    await mutateAsync({ id: product.id, formData });
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const { mutate } = useMutation({
    mutationKey: ["delete-photo", product.id],
    mutationFn: deleteProductPhoto,
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
      query.invalidateQueries({ queryKey: ["product-image"] });
      query.invalidateQueries({ queryKey: ["products-dash"] });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        handleClose();
        setIsEditing(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do produto</DialogTitle>
        </DialogHeader>

        <h4 className="text-start text-sm font-semibold">
          Veja os detalhes abaixo do produto - ID: {product.id}
        </h4>

        <div className="flex overflow-auto gap-2 py-4">
          {imagesLoading && <p>Carregando imagens...</p>}
          {images &&
            images.map((i) => (
              <div key={i.id} className="relative">
                <button
                  onClick={() => mutate(i.id)}
                  title="Deletar foto"
                  type="button"
                  className="absolute hover:bg-red-700 duration-200 bg-red-600 rounded-full z-30 -top-2 -right-2 text-white shadow"
                >
                  <X size={24} />
                </button>
                <Image
                  src={i.url}
                  alt="Imagem do produto"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          {!images && <p>Nenhuma foto encontrada!</p>}
        </div>

        <form
          ref={ref}
          onSubmit={handleSubmit(OnSubmit)}
          className="w-full mx-auto flex flex-col gap-y-2"
        >
          {!isEditing && (
            <Button
              onClick={() => setIsEditing((prev) => !prev)}
              className="w-fit bg-blue-600 hover:bg-blue-500 text-white ml-auto"
            >
              Editar <PenBox />
            </Button>
          )}

          <input type="hidden" name="id" value={product.id} />

          <span>Nome do produto</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <RectangleEllipsis className="text-primary-foreground" size={24} />
            <input
              {...register("name")}
              defaultValue={product.name}
              required
              disabled={!isEditing}
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o nome do produto!"
            />
          </label>

          {errors.name && <p className="text-red-600">{errors.name.message}</p>}

          <span>Sub categoria</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ScrollText className="text-primary-foreground" size={24} />
            <select
              {...register("subcategory_id")}
              defaultValue={product.subcategory_id}
              className="flex-grow bg-transparent outline-none text-neutral-700"
              required
              disabled={!isEditing}
            >
              <option disabled value={""}>
                Selecione uma sub categoria!
              </option>
              {categories.map((c) =>
                c.subcategories?.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {c.name} / {sc.name}
                  </option>
                ))
              )}
            </select>
          </label>

          {errors.subcategory_id && (
            <p className="text-red-600">{errors.subcategory_id.message}</p>
          )}

          <span>Quantidade em estoque</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Boxes className="text-primary-foreground" size={24} />
            <input
              {...register("stock_quantity")}
              defaultValue={product.stock_quantity}
              required
              disabled={!isEditing}
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="number"
              placeholder="Quantidade em estoque!"
              min={0}
            />
          </label>

          {errors.stock_quantity && (
            <p className="text-red-600">{errors.stock_quantity.message}</p>
          )}

          <span>Preço</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Banknote className="text-primary-foreground" size={24} />
            <input
              {...register("price")}
              defaultValue={product.price}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              disabled={!isEditing}
              placeholder="Preço do produto!"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9.,]/g,
                  ""
                );
              }}
            />
          </label>

          {errors.price && (
            <p className="text-red-600">{errors.price.message}</p>
          )}

          <span>Descrição</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 rounded-3xl">
            <NotepadText className="text-primary-foreground" size={24} />
            <textarea
              {...register("description")}
              defaultValue={product.description}
              rows={5}
              disabled={!isEditing}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              placeholder="Descrição do produto!"
            />
          </label>

          {errors.description && (
            <p className="text-red-600">{errors.description.message}</p>
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

          {isEditing && (
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
                className="hidden"
                name="photos"
                placeholder="Descrição do produto!"
                onChange={handlePhotoChange}
              />
            </label>
          )}

          <span>Data criação</span>

          <label className="flex flex-grow bg-neutral-200   p-2 gap-2 items-center rounded-3xl">
            <Calendar className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              disabled
              value={product?.created_at?.toLocaleString("pt-BR")}
            />
          </label>

          {isEditing && (
            <div className="flex gap-2 items-center">
              <Button
                disabled={isPending}
                className="flex-grow"
                onClick={onClose}
                variant={"destructive"}
              >
                <div className="flex items-center justify-center gap-2">
                  Cancelar <Ban />
                </div>
              </Button>
              <Button
                disabled={isPending}
                onClick={() => ref.current?.requestSubmit()}
                className="flex-grow z-50"
                variant={"secondary"}
              >
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

export default DetailProductModal;
