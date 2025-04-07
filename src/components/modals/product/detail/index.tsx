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
import { EditProductSchema } from "@/lib/schemas-validator/product.schema";
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
  PenBox,
  RectangleEllipsis,
  ScrollText,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity,
      subcategory_id: product.subcategory_id,
    },
  });

  useEffect(() => {
    reset({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity,
      subcategory_id: product.subcategory_id,
    });
  }, [product, reset]);

  const onClose = () => {
    setIsEditing(false);
    setPhotos([]);
    setPreviewImages([]);
    reset();
    handleClose();
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: EditProduct,
    onSuccess: (data) => {
      toast({ title: data.success });
      query.invalidateQueries({ queryKey: ["products-dash"] });
      query.invalidateQueries({ queryKey: ["product-image"] });
      onClose();
    },
    onError: (err) => {
      toast({ title: err.message });
    },
  });

  const ref = useRef<HTMLFormElement | null>(null);

  const OnSubmit = async (data: z.infer<typeof EditProductSchema>) => {
    const formData = new FormData();

    formData.append("name", data.name!);
    formData.append("description", data.description!);
    formData.append("price", data.price!);
    formData.append("stock_quantity", data.stock_quantity!.toString());
    formData.append("subcategory_id", data.subcategory_id!.toString());

    photos.forEach((photo) => formData.append("photos", photo));
    await mutateAsync({ id: product.id, formData });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPhotos(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const { mutate: deleteImage } = useMutation({
    mutationFn: deleteProductPhoto,
    onSuccess: (data) => {
      toast({ title: data.message });
      query.invalidateQueries({ queryKey: ["product-image"] });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: err.message });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do produto</DialogTitle>
        </DialogHeader>

        <p className="text-sm font-semibold mb-2">
          Veja os detalhes abaixo do produto - ID: {product.id}
        </p>

        <div className="flex overflow-auto gap-2 py-4">
          {imagesLoading ? (
            <p>Carregando imagens...</p>
          ) : images && images.length > 0 ? (
            images.map((i) => (
              <div key={i.id} className="relative">
                <button
                  onClick={() => deleteImage(i.id)}
                  type="button"
                  title="Deletar foto"
                  className="absolute -top-2 -right-2 z-30 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow"
                >
                  <X size={20} />
                </button>
                <Image
                  src={i.url}
                  alt="Imagem do produto"
                  width={100}
                  height={100}
                  className="rounded-md border"
                />
              </div>
            ))
          ) : (
            <p>Nenhuma foto encontrada!</p>
          )}
        </div>

        <form
          ref={ref}
          onSubmit={handleSubmit(OnSubmit)}
          className="flex flex-col gap-4"
        >
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-fit bg-blue-600 hover:bg-blue-500 text-white ml-auto"
              type="button"
            >
              Editar <PenBox className="ml-2" />
            </Button>
          )}

          {/* Nome */}
          <label className="flex items-center gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <RectangleEllipsis />
            <input
              {...register("name")}
              disabled={!isEditing}
              className="w-full bg-transparent outline-none"
              placeholder="Nome do produto"
            />
          </label>
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}

          {/* Subcategoria */}
          <label className="flex items-center gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <ScrollText />
            <select
              {...register("subcategory_id")}
              disabled={!isEditing}
              className="w-full bg-transparent outline-none"
            >
              <option disabled value="">
                Selecione uma subcategoria
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

          {/* Quantidade */}
          <label className="flex items-center gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <Boxes />
            <input
              {...register("stock_quantity")}
              type="number"
              min={0}
              disabled={!isEditing}
              className="w-full bg-transparent outline-none"
              placeholder="Quantidade em estoque"
            />
          </label>
          {errors.stock_quantity && (
            <p className="text-red-600">{errors.stock_quantity.message}</p>
          )}

          {/* Preço */}
          <label className="flex items-center gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <Banknote />
            <input
              {...register("price")}
              disabled={!isEditing}
              className="w-full bg-transparent outline-none"
              placeholder="Preço"
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9.,]/g,
                  ""
                ))
              }
            />
          </label>
          {errors.price && (
            <p className="text-red-600">{errors.price.message}</p>
          )}

          {/* Descrição */}
          <label className="flex gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <NotepadText />
            <textarea
              {...register("description")}
              rows={4}
              disabled={!isEditing}
              className="w-full bg-transparent outline-none resize-none"
              placeholder="Descrição do produto"
            />
          </label>
          {errors.description && (
            <p className="text-red-600">{errors.description.message}</p>
          )}

          {/* Previews */}
          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
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

          {/* Upload de novas fotos */}
          {isEditing && (
            <label
              htmlFor="photos-input"
              className="flex items-center gap-2 cursor-pointer bg-neutral-200 rounded-3xl px-4 py-2"
            >
              <CloudUpload />
              <span>Adicionar fotos</span>
              <input
                id="photos-input"
                type="file"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}

          {/* Data de criação */}
          <label className="flex items-center gap-2 bg-neutral-200 rounded-3xl px-4 py-2">
            <Calendar />
            <input
              type="text"
              disabled
              className="w-full bg-transparent outline-none"
              value={new Date(product.created_at!).toLocaleString("pt-BR")}
            />
          </label>

          {isEditing && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="destructive"
                className="flex-1"
                disabled={isPending}
              >
                Cancelar <Ban className="ml-2" />
              </Button>
              <Button
                type="button"
                onClick={() => ref.current?.requestSubmit()}
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    Editando <Loader className="animate-spin" />
                  </div>
                ) : (
                  <span>Salvar</span>
                )}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DetailProductModal;
