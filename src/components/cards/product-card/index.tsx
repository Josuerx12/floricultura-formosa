"use client";

import { BadgePercent } from "lucide-react";
import { Product } from "@/lib/actions/products";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.promotions && product.promotions.length > 0
      ? Number(product.promotions[0]?.discount_percentage)
      : 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  const router = useRouter();

  return (
    <div
      title={`Visitar pagina do produto: ${product.name}`}
      onClick={() => router.push("/produto/" + product.id)}
      className="relative cursor-pointer bg-transparent transition-transform duration-300 ease-in-out flex flex-col overflow-hidden"
    >
      {/* Imagem do Produto */}
      <div className="relative w-full h-full hover:opacity-80 duration-200">
        <img
          width={410}
          height={410}
          src={product.product_images?.[0]?.url || "/images/placeholder.png"}
          alt={product.name}
          className="object-cover w-full"
          priority
        />

        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 flex items-center space-x-1">
            <BadgePercent className="w-4 h-4" />
            <span>{discount}% OFF</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 h-full">
        {/* Nome do Produto */}
        <h3 className=" text-start mt-2 uppercase font-bold text-neutral-500">
          {product.name}
        </h3>

        <div>
          {finalPrice !== product.price ? (
            <div className="flex justify-start items-center space-x-2 text-neutral-500">
              <span className="line-through">
                {product.price.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <p className="">
                {finalPrice.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          ) : (
            <p className="text-start text-neutral-500">
              {product.price.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
