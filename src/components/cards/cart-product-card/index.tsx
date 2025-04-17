"use client";

import useCartStore, { ProductCart } from "@/hooks/use-cart-store";
import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { GetBumpsByProductId } from "@/lib/actions/order-bump/infraestructure/actions/get-bumps-by-product";
import { Button } from "@/components/ui/button";
import { FaCartPlus } from "react-icons/fa";
import { Loader } from "lucide-react";

const CartProductCard = ({ product }: { product: ProductCart }) => {
  const { decreaseQuantity, increaseQuantity, addProduct } = useCartStore();

  const { isPending, data: bumps } = useQuery({
    queryKey: ["listBumpProducts", product.id],
    queryFn: () => GetBumpsByProductId(Number(product.id)),
  });

  return (
    <li className="flex flex-col w-full p-4 rounded-2xl overflow-auto bg-white/80 shadow-lg space-y-4">
      {/* Produto principal */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {product.product_image && (
          <Image
            src={product.product_image}
            width={400}
            height={400}
            alt="Imagem do produto"
            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg shrink-0"
          />
        )}

        <div className="flex flex-col justify-between w-full">
          {/* Nome e preço */}
          <div className="space-y-1">
            <span className="text-base md:text-lg font-semibold uppercase text-gray-700">
              {product.name}
            </span>
            <span className="text-primary text-lg font-bold">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          {/* Quantidade */}
          <div className="flex items-center gap-3 mt-3">
            <Button
              className="py-1 px-3 rounded-md"
              onClick={() => decreaseQuantity(product.id)}
            >
              -
            </Button>
            <span className="text-primary-foreground">
              {product.quantity} un
            </span>
            <Button
              disabled={product.total_stock === product.quantity}
              className="py-1 px-3 rounded-md disabled:opacity-50"
              onClick={() => increaseQuantity(product.id)}
            >
              +
            </Button>
          </div>

          <span className="text-gray-600 mt-2">
            Total:{" "}
            <strong className="text-primary-foreground">
              {(product.price * product.quantity).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </span>
        </div>
      </div>

      {/* Produtos relacionados */}
      {isPending && (
        <p>
          Carregando ofertas <Loader className="animate-spin" />{" "}
        </p>
      )}

      {bumps && bumps.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <h6 className="text-sm text-gray-600 uppercase mb-2">
            Produtos relacionados
          </h6>

          {bumps && bumps.length > 0 && (
            <div className="overflow-x-auto -mx-2 px-2">
              <ul className="flex gap-4 w-max pb-2">
                {bumps.map((bump) => (
                  <li
                    onClick={() =>
                      addProduct({
                        id: bump.bumpProduct.id,
                        name: bump.bumpProduct.name,
                        price: bump.bumpProduct.price,
                        quantity: 1,
                        total_stock: bump.bumpProduct.stock_quantity,
                        product_image:
                          bump.bumpProduct.product_images?.[0]?.url,
                      })
                    }
                    key={bump.id}
                    className="min-w-[200px] bg-white rounded-xl shadow-sm p-3 flex flex-col justify-between items-start gap-2 border"
                  >
                    <Image
                      src={bump.bumpProduct.product_images![0].url}
                      width={60}
                      height={60}
                      alt={`Imagem do produto ${bump.bumpProduct.name}`}
                      className="rounded-md"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {bump.bumpProduct.name}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {bump.bumpProduct.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <Button className="w-full flex items-center justify-center gap-2">
                      <FaCartPlus />
                      Adicionar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default CartProductCard;
