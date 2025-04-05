"use client";

import useCartStore, { ProductCart } from "@/hooks/use-cart-store";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const ProductDetails = ({ product, finalPrice, discount }: any) => {
  const [selectedImage, setSelectedImage] = useState(
    product.product_images[0]?.url || "/images/placeholder.png"
  );
  const { addProduct } = useCartStore();

  const { register, handleSubmit } = useForm<ProductCart>();

  function onSubmit(data: ProductCart) {
    addProduct({
      ...data,
      price: parseFloat(data.price as unknown as string),
      quantity: parseInt(data.quantity as unknown as string),
      total_stock: parseInt(data.total_stock as unknown as string),
    });
  }

  return (
    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <Image
            src={selectedImage}
            alt={product.name}
            width={800}
            height={600}
            quality={100}
            className="w-full object-cover rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          {product.product_images.map((img: any, index: number) => (
            <Image
              key={index}
              src={img.url}
              alt={`Imagem ${index + 1}`}
              width={100}
              height={100}
              className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                selectedImage === img.url ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedImage(img.url)}
            />
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-title">{product.name}</h1>

        <div className="mt-3">
          {discount > 0 ? (
            <p className="text-red-500 text-2xl font-bold">
              R$ {finalPrice.toFixed(2)}{" "}
              <span className="text-price line-through text-lg">
                R$ {product.price.toFixed(2)}
              </span>
            </p>
          ) : (
            <p className="text-price text-2xl font-bold">
              R$ {product.price.toFixed(2)}
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-4"
        >
          <input {...register("id")} type="hidden" value={product.id} />
          <input
            {...register("total_stock")}
            type="hidden"
            value={product.stock_quantity}
          />
          <input
            {...register("price")}
            type="hidden"
            value={finalPrice.toFixed(2)}
          />
          <input {...register("name")} type="hidden" value={product.name} />
          <input
            {...register("product_image")}
            type="hidden"
            value={
              product?.product_images.length > 0
                ? product.product_images[0].url
                : ""
            }
          />

          <div>
            <label htmlFor="quantity" className="font-medium text-price">
              Quantidade:
            </label>
            <select
              {...register("quantity")}
              className="w-full text-sm border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-primary"
              defaultValue={1}
            >
              {Array.from({ length: product.stock_quantity }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} UN
                </option>
              ))}
            </select>
          </div>

          <Button className="text-btn-text bg-btn-body" type="submit">
            Adicionar ao Carrinho
          </Button>
        </form>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-title">Descrição</h2>
          <p className="text-price mt-2">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
