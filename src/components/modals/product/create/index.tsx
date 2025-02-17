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
import { CreateProductAction } from "@/lib/actions/products";
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

const CreateProductModal = ({ categories }: { categories: Category[] }) => {
  const [state, formAction, isPending, reset] = useResetableActionState(
    CreateProductAction,
    null
  );

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const { reset: resetForm, register } = useForm();

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      reset();
      resetForm();
      setPhotos([]);
      setPreviewImages([]);
    }
  }, [state?.success]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground p-2 rounded font-medium text-sm drop-shadow">
        Adicionar <Plus size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo produto!</DialogTitle>
        </DialogHeader>

        <form
          action={formAction}
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

          {state?.errors?.name && (
            <p className="text-red-600">{state?.errors?.name}</p>
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
          {state?.errors?.subcategory_id && (
            <p className="text-red-600">{state?.errors?.subcategory_id}</p>
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

          {state?.errors?.stock_quantity && (
            <p className="text-red-600">{state?.errors?.stock_quantity}</p>
          )}

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Banknote className="text-primary-foreground" size={24} />
            <input
              {...register("price")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="number"
              placeholder="Preço do produto!"
              step="0.01"
              min="0"
              inputMode="decimal"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9.]/g, ""); // Remove caracteres inválidos
              }}
            />
          </label>

          {state?.errors?.price && (
            <p className="text-red-600">{state?.errors?.price}</p>
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

          {state?.errors?.description && (
            <p className="text-red-600">{state?.errors?.description}</p>
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

          {state?.errors?.description && (
            <p className="text-red-600">{state?.errors?.description}</p>
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
