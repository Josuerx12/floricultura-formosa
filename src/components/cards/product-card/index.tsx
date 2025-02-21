"use client";

import { BadgePercent } from "lucide-react";
import { Product } from "@/lib/actions/products";
import Image from "next/image";
import useCartStore, { ProductCart } from "@/hooks/use-cart-store";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.promotions && product.promotions.length > 0
      ? Number(product.promotions[0]?.discount_percentage)
      : 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  const stockMessage =
    product.stock_quantity <= 10
      ? `Restam apenas ${product.stock_quantity} unidades!`
      : `${product.stock_quantity} unidades disponíveis`;

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

  const router = useRouter();

  return (
    <div className="relative border basis-72 group w-full rounded-lg h-full p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col overflow-hidden">
      <div className="relative">
        <Image
          width={800}
          height={600}
          src={product.product_images?.[0]?.url || "/images/placeholder.png"}
          alt={product.name}
          className="w-full h-52 object-contain md:object-cover rounded-md"
        />

        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center space-x-1">
            <BadgePercent className="w-4 h-4" />
            <span>{discount}% OFF</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5 flex-grow mt-5"
      >
        {finalPrice !== product.price ? (
          <p className="text-red-500 font-bold text-xl">
            R$ {finalPrice.toFixed(2)}{" "}
            <span className="text-gray-400 line-through text-xl">
              R$ {product.price.toFixed(2)}
            </span>
          </p>
        ) : (
          <p className="text-gray-600 text-xl">R$ {product.price.toFixed(2)}</p>
        )}
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
            product?.product_images && product?.product_images?.length > 0
              ? product?.product_images[0].url
              : ""
          }
        />
        <div>
          <select
            {...register("quantity")}
            className="w-full text-sm bg-transparent border-primary-foreground/40 border px-2 py-1 outline-none"
            defaultValue={1}
          >
            {Array.from({ length: product.stock_quantity }).map((_, i) => (
              <option key={i} value={i + 1}>
                Quantidade: {i + 1} UN
              </option>
            ))}
          </select>

          <p
            className={`text-sm mt-1 mx-auto ${
              product.stock_quantity <= 10
                ? "text-red-600 font-bold"
                : "text-gray-600"
            }`}
          >
            {stockMessage}
          </p>
        </div>

        <div className="mt-auto flex  gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-primary-foreground/90 w-full p-2 rounded-md text-white hover:bg-primary-foreground transition duration-200">
            Comprar
          </button>
          <button
            onClick={() => router.push("/produto/" + product.id)}
            type="button"
            className="bg-primary-foreground/90 w-full p-2 rounded-md text-white hover:bg-primary-foreground transition duration-200"
          >
            Visualizar
          </button>
        </div>
      </form>
    </div>
  );
}
