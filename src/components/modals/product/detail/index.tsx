"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResetableActionState } from "@/hooks/use-resetable-action-state";
import { EditProductAction, Product } from "@/lib/actions/products";
import { SubCategory } from "@/lib/actions/sub-category";
import {
  Ban,
  Banknote,
  Boxes,
  Calendar,
  CloudUpload,
  ListPlus,
  Loader,
  NotepadText,
  Pen,
  PenBox,
  RectangleEllipsis,
  ScrollText,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const DetailProductModal = ({
  product,
  isOpen,
  handleClose,
  subcategories,
}: {
  isOpen: boolean;
  handleClose: VoidFunction;
  product: Product;
  subcategories: SubCategory[];
}) => {
  const [state, formAction, isPending, reset] = useResetableActionState(
    EditProductAction,
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  console.log(state);

  useEffect(() => {
    if (state?.success) {
      Promise.all([setIsEditing(false), handleClose(), reset()]);
    }
  }, [state?.success]);

  const ref = useRef<HTMLFormElement | null>(null);

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

        <div className="flex overflow-auto gap-2">
          {product.product_images &&
            product.product_images?.length > 0 &&
            product.product_images?.map((img) => (
              <Image
                key={img.file_key}
                src={img.url}
                alt="product img"
                width={100}
                height={100}
              />
            ))}
        </div>

        <form
          ref={ref}
          action={formAction}
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
              name="name"
              defaultValue={product.name}
              required
              disabled={!isEditing}
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="text"
              placeholder="Insira o nome do produto!"
            />
          </label>

          <span>Sub categoria</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <ScrollText className="text-primary-foreground" size={24} />
            <select
              name="subcategory_id"
              className="flex-grow bg-transparent outline-none text-neutral-700"
              required
              disabled={!isEditing}
              defaultValue={product.subcategory_id}
            >
              <option disabled value={""}>
                Selecione uma sub categoria!
              </option>
              {subcategories.map((subc) => (
                <option key={subc.id} value={subc.id}>
                  {subc.name}
                </option>
              ))}
            </select>
          </label>

          <span>Quantidade em estoque</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Boxes className="text-primary-foreground" size={24} />
            <input
              name="stock_quantity"
              defaultValue={product.stock_quantity}
              required
              disabled={!isEditing}
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="number"
              placeholder="Quantidade em estoque!"
              min={0}
            />
          </label>

          <span>Preço</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 items-center rounded-3xl">
            <Banknote className="text-primary-foreground" size={24} />
            <input
              name="price"
              defaultValue={product.price}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              type="number"
              disabled={!isEditing}
              placeholder="Preço do produto!"
              step={"2"}
              min="0"
              inputMode="decimal"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9.]/g, ""); // Remove caracteres inválidos
              }}
            />
          </label>

          <span>Descrição</span>

          <label className="flex flex-grow bg-neutral-200 p-2 gap-2 rounded-3xl">
            <NotepadText className="text-primary-foreground" size={24} />
            <textarea
              name="description"
              rows={5}
              disabled={!isEditing}
              defaultValue={product.description}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-700"
              placeholder="Descrição do produto!"
            />
          </label>

          <span>Data criação</span>

          <label className="flex flex-grow bg-neutral-200   p-2 gap-2 items-center rounded-3xl">
            <Calendar className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              disabled
              defaultValue={product?.created_at?.toLocaleString("pt-BR")}
            />
          </label>

          {state?.error && <p className="text-red-600">{state?.error}</p>}

          {isEditing && (
            <div className="flex gap-2 items-center">
              <Button
                className="flex-grow"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  reset();
                }}
                variant={"destructive"}
              >
                <div className="flex items-center justify-center gap-2">
                  Cancelar <Ban />
                </div>
              </Button>
              <Button
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
