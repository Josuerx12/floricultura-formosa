"use client";

import useCartStore from "@/hooks/use-cart-store";
import { GetBumpsByCategoryId } from "@/lib/actions/order-bump/infraestructure/actions/get-bumps-by-category";
import { Product } from "@/lib/actions/products";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = {
  product: Product;
  isOpen: boolean;
  handleClose: VoidFunction;
};

const AddCartModal = ({ product, handleClose, isOpen }: Props) => {
  const { data: bumps, isPending } = useQuery({
    queryKey: ["listBumpProducts", product.subcategory?.category_id],
    queryFn: () => GetBumpsByCategoryId(product.subcategory!.category_id!),
  });

  const [quantity, setQuantity] = useState(1);

  const { addProduct } = useCartStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!isPending && bumps?.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicione uma oferta ao carrinho</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Lista de produtos */}
          <div className="md:w-1/2 space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {isPending ? (
              <p>Carregando...</p>
            ) : (
              bumps?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedProduct(item.bumpProduct)}
                  className="flex items-center gap-3 cursor-pointer border p-3 rounded hover:bg-muted"
                >
                  {item.bumpProduct.product_images?.[0]?.url && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <img
                        src={item.bumpProduct.product_images[0].url}
                        alt={item.bumpProduct.name}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">
                      {item.bumpProduct.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.bumpProduct.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detalhes do produto selecionado */}
          <div className="md:w-1/2 border rounded p-4">
            {selectedProduct ? (
              <>
                <h2 className="text-lg font-bold mb-2">
                  {selectedProduct.name}
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct.description,
                  }}
                  className="prose mb-2"
                />

                {selectedProduct.product_images?.[0]?.url && (
                  <div className="relative w-full h-48 mb-4">
                    <img
                      src={selectedProduct.product_images[0].url}
                      alt={selectedProduct.name}
                      className="object-contain rounded"
                    />
                  </div>
                )}

                <p className="mb-4">
                  <span className="font-medium">Preço:</span>{" "}
                  {selectedProduct.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-col gap-4 w-full">
                    <div>
                      <label
                        htmlFor="quantity"
                        className="font-medium text-sm text-price"
                      >
                        Quantidade:
                      </label>
                      <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-primary"
                      >
                        {Array.from({
                          length: selectedProduct.stock_quantity,
                        }).map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} UN
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="w-full"
                        onClick={() =>
                          addProduct({
                            id: selectedProduct.id,
                            name: selectedProduct.name,
                            price: selectedProduct.price,
                            total_stock: selectedProduct.stock_quantity,
                            product_image:
                              selectedProduct.product_images?.[0]?.url || "",
                            quantity: quantity,
                          })
                        }
                      >
                        Adicionar ao carrinho
                      </Button>
                      <DialogClose asChild>
                        <Button className="w-full" variant="outline">
                          Concluir
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Clique em um produto para ver os detalhes
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCartModal;
